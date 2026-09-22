from fastapi import FastAPI, File, UploadFile, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse, JSONResponse, HTMLResponse
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
import os
import uuid
import shutil
import json
import numpy as np
from datetime import datetime

from .processing.kml_parser import parse_kml_content
from .processing.satellite import simulate_sentinel2_image
from .processing.vegetation import analyze_vegetation, compute_ndvi
from .processing.report import generate_vegetation_kml, generate_overlay_map_image, generate_technical_report

def sanitize_for_json(obj):
    """Recursively convert numpy and non-serializable types to python native."""
    if isinstance(obj, (np.integer,)):
        return int(obj)
    if isinstance(obj, (np.floating,)):
        return float(obj)
    if isinstance(obj, (np.ndarray,)):
        return obj.tolist()
    if isinstance(obj, (datetime,)):
        return obj.isoformat()
    if isinstance(obj, dict):
        return {k: sanitize_for_json(v) for k, v in obj.items()}
    if isinstance(obj, (list, tuple)):
        return [sanitize_for_json(v) for v in obj]
    return obj

app = FastAPI(title="Sistema de Análise de Vegetação Nativa - Sentinel-2")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FRONTEND_DIR = os.path.join(BASE_DIR, "frontend")
JOBS_DIR = os.path.join(BASE_DIR, "data", "jobs")
os.makedirs(JOBS_DIR, exist_ok=True)
os.makedirs(FRONTEND_DIR, exist_ok=True)

# In-memory job storage (also persisted to disk)
jobs = {}

def get_job_dir(job_id):
    return os.path.join(JOBS_DIR, job_id)

@app.get("/", response_class=HTMLResponse)
async def serve_frontend():
    index_path = os.path.join(FRONTEND_DIR, "index.html")
    if os.path.exists(index_path):
        with open(index_path, 'r', encoding='utf-8') as f:
            return HTMLResponse(content=f.read())
    else:
        return HTMLResponse(content="<h1>Frontend não encontrado</h1><p>Verifique pasta frontend/</p>")

@app.get("/api/sample-kml")
async def get_sample_kml():
    # Generate a sample KML for testing (a farm near Brasília)
    sample_kml = """<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
    <name>Fazenda Exemplo - Perímetro</name>
    <Placemark>
        <name>Perímetro da Fazenda</name>
        <Polygon>
            <outerBoundaryIs>
                <LinearRing>
                    <coordinates>
                        -47.9500,-15.8000,0
                        -47.9000,-15.8000,0
                        -47.9000,-15.7500,0
                        -47.9200,-15.7400,0
                        -47.9500,-15.7600,0
                        -47.9500,-15.8000,0
                    </coordinates>
                </LinearRing>
            </outerBoundaryIs>
        </Polygon>
    </Placemark>
</Document>
</kml>"""
    return JSONResponse(content={"kml": sample_kml})

@app.post("/api/upload")
async def upload_kml(file: UploadFile = File(...)):
    if not file.filename.lower().endswith('.kml'):
        raise HTTPException(status_code=400, detail="Arquivo deve ser .KML")

    content = await file.read()
    try:
        kml_text = content.decode('utf-8')
    except Exception:
        try:
            kml_text = content.decode('latin-1')
        except Exception:
            raise HTTPException(status_code=400, detail="Não foi possível ler o arquivo KML")

    try:
        parsed = parse_kml_content(kml_text)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Erro ao processar KML: {str(e)}")

    job_id = str(uuid.uuid4())
    job_dir = get_job_dir(job_id)
    os.makedirs(job_dir, exist_ok=True)

    # Save original KML
    original_kml_path = os.path.join(job_dir, "original.kml")
    with open(original_kml_path, 'w', encoding='utf-8') as f:
        f.write(kml_text)

    # Save parsed info
    job_info = {
        "id": job_id,
        "created_at": datetime.now().isoformat(),
        "filename": file.filename,
        "perimeter": {
            "geojson": parsed["geojson"],
            "bbox": parsed["bbox"],
            "centroid": parsed["centroid"],
            "area_m2": parsed["area_m2"],
            "area_ha": parsed["area_ha"],
            "num_polygons": parsed["num_polygons"]
        },
        "status": "uploaded",
        "result": None
    }

    # Store polygons separately (can't JSON serialize shapely)
    # Save job info json
    with open(os.path.join(job_dir, "job.json"), 'w', encoding='utf-8') as f:
        json.dump(job_info, f, indent=2, ensure_ascii=False)

    jobs[job_id] = {
        "info": job_info,
        "polygons": parsed["polygons"],
        "union": parsed["union"],
        "kml_text": kml_text
    }

    return JSONResponse(content={
        "job_id": job_id,
        "perimeter": job_info["perimeter"],
        "message": "KML processado com sucesso"
    })

@app.post("/api/process/{job_id}")
async def process_job(job_id: str):
    job_dir = get_job_dir(job_id)
    if not os.path.exists(job_dir):
        raise HTTPException(status_code=404, detail="Job não encontrado")

    # Load job if not in memory
    if job_id not in jobs:
        try:
            with open(os.path.join(job_dir, "job.json"), 'r', encoding='utf-8') as f:
                job_info = json.load(f)
            # Need to re-parse KML
            with open(os.path.join(job_dir, "original.kml"), 'r', encoding='utf-8') as f:
                kml_text = f.read()
            parsed = parse_kml_content(kml_text)
            jobs[job_id] = {
                "info": job_info,
                "polygons": parsed["polygons"],
                "union": parsed["union"],
                "kml_text": kml_text
            }
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Erro ao carregar job: {e}")

    job = jobs[job_id]
    polygons = job["polygons"]
    perimeter_geojson = job["info"]["perimeter"]["geojson"]
    bbox = job["info"]["perimeter"]["bbox"]  # original bbox
    # bbox format: (min_lon, min_lat, max_lon, max_lat)

    try:
        # Step 1: Simulate Sentinel-2 image
        job["info"]["status"] = "processing_satellite"
        satellite_data = simulate_sentinel2_image(polygons, bbox, job_dir, width=1024, height=1024)

        # Step 2: Analyze vegetation - V2 com SAVI, hysteresis, refinamento por gradiente
        job["info"]["status"] = "processing_vegetation"
        red = satellite_data["red"]
        nir = satellite_data["nir"]
        ndvi = satellite_data["ndvi"]
        rgb = satellite_data["rgb"]
        mask = satellite_data["mask"]
        padded_bbox = satellite_data["padded_bbox"]
        width = satellite_data["width"]
        height = satellite_data["height"]

        vegetation_result = analyze_vegetation(red, nir, ndvi, mask, padded_bbox, width, height, job_dir, rgb=rgb)

        # Step 3: Generate KML vegetation
        job["info"]["status"] = "generating_kml"
        veg_kml_path, veg_kml_content = generate_vegetation_kml(vegetation_result["vegetation_polygons"], job_dir, metadata=satellite_data["metadata"])

        # Step 4: Generate overlay map
        job["info"]["status"] = "generating_map"
        overlay_path = generate_overlay_map_image(satellite_data["rgb_path"], vegetation_result["vegetation_geojson"], perimeter_geojson, padded_bbox, job_dir)

        # Step 5: Generate PDF report
        job["info"]["status"] = "generating_pdf"
        # Prepare data for report
        perimeter_data = job["info"]["perimeter"]
        pdf_path = generate_technical_report(job["info"], satellite_data, vegetation_result, perimeter_data, job_dir)

        # Finalize result
        result = {
            "vegetation_geojson": vegetation_result["vegetation_geojson"],
            "perimeter_geojson": perimeter_geojson,
            "satellite_metadata": satellite_data["metadata"],
            "stats": vegetation_result["stats"],
            "classification": vegetation_result["classification"],
            "images": {
                "rgb": f"/api/download/image/{job_id}?type=rgb",
                "ndvi": f"/api/download/image/{job_id}?type=ndvi",
                "overlay": f"/api/download/image/{job_id}?type=overlay",
                "vegetation_overlay": f"/api/download/image/{job_id}?type=veg_overlay",
                "final_map": f"/api/download/image/{job_id}?type=final"
            },
            "downloads": {
                "kml": f"/api/download/kml/{job_id}",
                "pdf": f"/api/download/pdf/{job_id}"
            }
        }

        # Sanitize for JSON
        result_sanitized = sanitize_for_json(result)

        job["info"]["result"] = result_sanitized
        job["info"]["status"] = "completed"
        job["info"]["completed_at"] = datetime.now().isoformat()

        # Save updated job.json
        with open(os.path.join(job_dir, "job.json"), 'w', encoding='utf-8') as f:
            json.dump(job["info"], f, indent=2, ensure_ascii=False, default=str)

        # Also save result separately
        with open(os.path.join(job_dir, "result.json"), 'w', encoding='utf-8') as f:
            json.dump(result_sanitized, f, indent=2, ensure_ascii=False, default=str)

        return JSONResponse(content=result_sanitized)

    except Exception as e:
        import traceback
        traceback.print_exc()
        job["info"]["status"] = "failed"
        job["info"]["error"] = str(e)
        raise HTTPException(status_code=500, detail=f"Erro no processamento: {str(e)}")

@app.get("/api/result/{job_id}")
async def get_result(job_id: str):
    job_dir = get_job_dir(job_id)
    if not os.path.exists(job_dir):
        raise HTTPException(status_code=404, detail="Job não encontrado")

    result_path = os.path.join(job_dir, "result.json")
    if os.path.exists(result_path):
        with open(result_path, 'r', encoding='utf-8') as f:
            result = json.load(f)
        return JSONResponse(content=result)

    job_json_path = os.path.join(job_dir, "job.json")
    if os.path.exists(job_json_path):
        with open(job_json_path, 'r', encoding='utf-8') as f:
            job_info = json.load(f)
        if job_info.get("result"):
            return JSONResponse(content=job_info["result"])
        else:
            return JSONResponse(content={"status": job_info.get("status", "unknown"), "perimeter": job_info.get("perimeter")})

    raise HTTPException(status_code=404, detail="Resultado não encontrado")

@app.get("/api/download/kml/{job_id}")
async def download_kml(job_id: str):
    job_dir = get_job_dir(job_id)
    kml_path = os.path.join(job_dir, "vegetacao_nativa.kml")
    if not os.path.exists(kml_path):
        raise HTTPException(status_code=404, detail="KML de vegetação não encontrado. Processe o job primeiro.")
    return FileResponse(kml_path, media_type="application/vnd.google-earth.kml+xml", filename="vegetacao_nativa.kml")

@app.get("/api/download/pdf/{job_id}")
async def download_pdf(job_id: str):
    job_dir = get_job_dir(job_id)
    pdf_path = os.path.join(job_dir, "laudo_tecnico_vegetacao.pdf")
    if not os.path.exists(pdf_path):
        raise HTTPException(status_code=404, detail="Laudo PDF não encontrado. Processe o job primeiro.")
    return FileResponse(pdf_path, media_type="application/pdf", filename="laudo_tecnico_vegetacao.pdf")

@app.get("/api/download/image/{job_id}")
async def download_image(job_id: str, type: str = "rgb"):
    job_dir = get_job_dir(job_id)
    mapping = {
        "rgb": "satellite_rgb.png",
        "ndvi": "ndvi_vis.png",
        "overlay": "vegetation_overlay.png",
        "veg_overlay": "vegetation_overlay.png",
        "final": "mapa_final_overlay.png",
        "mapa": "mapa_final_overlay.png"
    }
    filename = mapping.get(type, "satellite_rgb.png")
    img_path = os.path.join(job_dir, filename)
    if not os.path.exists(img_path):
        # fallback to rgb
        img_path = os.path.join(job_dir, "satellite_rgb.png")
        if not os.path.exists(img_path):
            raise HTTPException(status_code=404, detail="Imagem não encontrada")
    return FileResponse(img_path, media_type="image/png")

# Serve frontend static files (css, js)
@app.get("/style.css")
async def serve_css():
    css_path = os.path.join(FRONTEND_DIR, "style.css")
    if os.path.exists(css_path):
        return FileResponse(css_path, media_type="text/css")
    raise HTTPException(status_code=404)

@app.get("/app.js")
async def serve_js():
    js_path = os.path.join(FRONTEND_DIR, "app.js")
    if os.path.exists(js_path):
        return FileResponse(js_path, media_type="application/javascript")
    raise HTTPException(status_code=404)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

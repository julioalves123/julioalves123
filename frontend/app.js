// VegetaSat Frontend Application
let map;
let perimeterLayer = null;
let vegetationLayer = null;
let currentJobId = null;
let perimeterGeoJSON = null;

document.addEventListener('DOMContentLoaded', () => {
    initMap();
    initUpload();
    initControls();
    logMessage("Sistema iniciado. Pronto para receber KML.", "info");
});

function initMap() {
    // Initialize Leaflet map centered on Brazil
    map = L.map('map').setView([-15.8, -47.9], 5);

    // Base layers
    const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap',
        maxZoom: 19
    }).addTo(map);

    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        attribution: '© Esri',
        maxZoom: 19
    });

    const baseMaps = {
        "OpenStreetMap": osm,
        "Satélite Esri": satellite
    };

    L.control.layers(baseMaps).addTo(map);

    // Scale control
    L.control.scale().addTo(map);
}

function initUpload() {
    const uploadZone = document.getElementById('upload-zone');
    const kmlInput = document.getElementById('kml-input');
    const browseBtn = document.getElementById('browse-btn');
    const fileInfo = document.getElementById('file-info');
    const removeFileBtn = document.getElementById('remove-file');
    const loadSampleBtn = document.getElementById('load-sample');

    // Click to browse
    browseBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        kmlInput.click();
    });

    uploadZone.addEventListener('click', () => {
        kmlInput.click();
    });

    // Drag and drop
    uploadZone.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadZone.classList.add('dragover');
    });

    uploadZone.addEventListener('dragleave', () => {
        uploadZone.classList.remove('dragover');
    });

    uploadZone.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadZone.classList.remove('dragover');
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFile(files[0]);
        }
    });

    // File input change
    kmlInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            handleFile(e.target.files[0]);
        }
    });

    // Remove file
    removeFileBtn.addEventListener('click', () => {
        resetUpload();
    });

    // Load sample
    loadSampleBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        logMessage("Carregando KML de exemplo...", "info");
        try {
            const response = await fetch('/api/sample-kml');
            const data = await response.json();
            const kmlContent = data.kml;
            
            // Create a file-like object
            const blob = new Blob([kmlContent], { type: 'application/vnd.google-earth.kml+xml' });
            const file = new File([blob], "fazenda_exemplo.kml", { type: 'application/vnd.google-earth.kml+xml' });
            
            handleFile(file, kmlContent);
        } catch (err) {
            logMessage(`Erro ao carregar exemplo: ${err.message}`, "error");
        }
    });

    // Process button
    document.getElementById('process-btn').addEventListener('click', () => {
        if (currentJobId) {
            processImage(currentJobId);
        }
    });
}

async function handleFile(file, preloadedContent = null) {
    if (!file.name.toLowerCase().endsWith('.kml') && !file.name.toLowerCase().endsWith('.xml')) {
        logMessage("Arquivo deve ser .KML", "error");
        alert("Por favor, envie um arquivo .KML válido");
        return;
    }

    const fileInfo = document.getElementById('file-info');
    const fileName = document.getElementById('file-name');
    const fileSize = document.getElementById('file-size');
    const uploadZone = document.getElementById('upload-zone');

    fileName.textContent = file.name;
    fileSize.textContent = `${(file.size / 1024).toFixed(1)} KB`;
    fileInfo.classList.remove('hidden');
    uploadZone.classList.add('hidden');

    logMessage(`Arquivo recebido: ${file.name} (${(file.size/1024).toFixed(1)} KB)`, "info");

    // Upload to backend
    const formData = new FormData();
    formData.append('file', file);

    try {
        updateStep(1, true);
        logMessage("Enviando KML para processamento...", "info");

        const response = await fetch('/api/upload', {
            method: 'POST',
            body: formData
        });

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Erro no upload");
        }

        const data = await response.json();
        currentJobId = data.job_id;
        perimeterGeoJSON = data.perimeter.geojson;

        logMessage(`KML processado: ${data.perimeter.area_ha.toFixed(4)} ha, ${data.perimeter.num_polygons} polígono(s)`, "success");

        // Update UI
        document.getElementById('perimeter-stats').classList.remove('hidden');
        document.getElementById('stat-area').textContent = `${data.perimeter.area_ha.toFixed(4)} ha`;
        document.getElementById('stat-centroid').textContent = `${data.perimeter.centroid[0].toFixed(4)}, ${data.perimeter.centroid[1].toFixed(4)}`;
        document.getElementById('stat-polys').textContent = data.perimeter.num_polygons;
        const bbox = data.perimeter.bbox;
        document.getElementById('stat-bbox').textContent = `${bbox[0].toFixed(3)},${bbox[1].toFixed(3)} → ${bbox[2].toFixed(3)},${bbox[3].toFixed(3)}`;

        document.getElementById('process-btn').classList.remove('hidden');

        // Show on map
        showPerimeterOnMap(data.perimeter.geojson, bbox);

        updateStep(2, false, true);

    } catch (err) {
        logMessage(`Erro no upload: ${err.message}`, "error");
        alert(`Erro: ${err.message}`);
        resetUpload();
    }
}

function showPerimeterOnMap(geojson, bbox) {
    if (perimeterLayer) {
        map.removeLayer(perimeterLayer);
    }

    perimeterLayer = L.geoJSON(geojson, {
        style: {
            color: '#ff0000',
            weight: 3,
            opacity: 0.9,
            fillColor: '#ff0000',
            fillOpacity: 0.1
        }
    }).addTo(map);

    // Fit bounds
    if (bbox) {
        const bounds = L.latLngBounds(
            [bbox[1], bbox[0]],
            [bbox[3], bbox[2]]
        );
        map.fitBounds(bounds, { padding: [30, 30] });
    } else {
        map.fitBounds(perimeterLayer.getBounds(), { padding: [30, 30] });
    }
}

async function processImage(jobId) {
    const processBtn = document.getElementById('process-btn');
    const statusDiv = document.getElementById('processing-status');
    const statusTitle = document.getElementById('status-title');
    const statusDesc = document.getElementById('status-desc');

    processBtn.classList.add('hidden');
    statusDiv.classList.remove('hidden');

    const steps = [
        { title: "Buscando imagem Sentinel-2 V2...", desc: "Catálogo Copernicus + simulação fractal realista offline" },
        { title: "Processando bandas + índices...", desc: "B04 Red, B08 NIR, NDVI, SAVI, NDWI - 10m" },
        { title: "Filtragem bilateral...", desc: "Preservando bordas reais, removendo ruído" },
        { title: "Hysteresis + SAVI + forma...", desc: "Low/High Otsu, SAVI>0.2, filtro solidity/eccentricity" },
        { title: "Refinamento gradiente RGB...", desc: "Sobel, snapping a bordas reais, <25% mudança" },
        { title: "Vetorização V2 suavizada...", desc: "Marching squares sub-pixel + Chaikin 2x + buffer 1m" },
        { title: "Gerando laudo V2...", desc: "KML + PDF com metodologia alta precisão" }
    ];

    let stepIndex = 0;
    const interval = setInterval(() => {
        if (stepIndex < steps.length) {
            statusTitle.textContent = steps[stepIndex].title;
            statusDesc.textContent = steps[stepIndex].desc;
            logMessage(`${steps[stepIndex].title} ${steps[stepIndex].desc}`, "info");
            stepIndex++;
        }
    }, 1200);

    try {
        logMessage("Iniciando processamento Sentinel-2...", "info");
        updateStep(2, true);

        const response = await fetch(`/api/process/${jobId}`, {
            method: 'POST'
        });

        clearInterval(interval);

        if (!response.ok) {
            const err = await response.json();
            throw new Error(err.detail || "Erro no processamento");
        }

        const result = await response.json();

        statusTitle.textContent = "Processamento concluído!";
        statusDesc.textContent = `${result.stats.num_polygons} fragmentos de vegetação detectados`;

        logMessage(`V2 - Vegetação: ${result.stats.vegetation_area_ha.toFixed(4)} ha (${result.stats.percentage.toFixed(2)}%) | ${result.stats.num_polygons} frag`, "success");
        logMessage(`Confiança: ${result.stats.confidence} | Otsu=${result.stats.threshold.toFixed(3)} Low=${result.stats.low_thresh?.toFixed(3)} High=${result.stats.high_thresh?.toFixed(3)} | SAVI veg=${result.stats.mean_savi_veg?.toFixed(3)} | Sep=${result.stats.separation?.toFixed(3)}`, "info");

        // Show results
        showResults(result);

        updateStep(3, true);
        updateStep(4, false, true);

        setTimeout(() => {
            statusDiv.classList.add('hidden');
        }, 2000);

    } catch (err) {
        clearInterval(interval);
        logMessage(`Erro no processamento: ${err.message}`, "error");
        statusTitle.textContent = "Erro no processamento";
        statusDesc.textContent = err.message;
        setTimeout(() => {
            statusDiv.classList.add('hidden');
            processBtn.classList.remove('hidden');
        }, 3000);
    }
}

function showResults(result) {
    const resultsSection = document.getElementById('results-section');
    resultsSection.classList.remove('hidden');

    // Update stats
    document.getElementById('result-perc').textContent = `${result.stats.percentage.toFixed(1)}%`;
    document.getElementById('result-area').textContent = `${result.stats.vegetation_area_ha.toFixed(2)} ha`;
    document.getElementById('result-frags').textContent = result.stats.num_polygons;

    // Metadata V2
    document.getElementById('meta-date').textContent = result.satellite_metadata.date;
    document.getElementById('meta-source').textContent = result.satellite_metadata.source.split('(')[0].trim();
    document.getElementById('meta-res').textContent = result.satellite_metadata.resolution;
    document.getElementById('meta-cloud').textContent = result.satellite_metadata.cloud_cover;
    document.getElementById('meta-thresh').textContent = result.stats.threshold.toFixed(3);
    document.getElementById('meta-hyst').textContent = `${result.stats.low_thresh?.toFixed(3) || '-'} / ${result.stats.high_thresh?.toFixed(3) || '-'}`;
    document.getElementById('meta-savi').textContent = `${result.stats.mean_savi_veg?.toFixed(3) || '-'} (thr ${result.stats.savi_thresh?.toFixed(2) || '0.20'})`;
    document.getElementById('meta-sep').textContent = `${result.stats.separation?.toFixed(3) || '-'} ±${result.stats.std_veg?.toFixed(3) || '-'}`;
    document.getElementById('meta-conf').textContent = result.stats.confidence;

    // Images
    const jobId = currentJobId;
    document.getElementById('preview-rgb').src = `/api/download/image/${jobId}?type=rgb&t=${Date.now()}`;
    document.getElementById('preview-ndvi').src = `/api/download/image/${jobId}?type=ndvi&t=${Date.now()}`;
    document.getElementById('preview-overlay').src = `/api/download/image/${jobId}?type=veg_overlay&t=${Date.now()}`;
    document.getElementById('preview-final').src = `/api/download/image/${jobId}?type=final&t=${Date.now()}`;

    // Show vegetation on map
    showVegetationOnMap(result.vegetation_geojson);

    // Setup download buttons
    document.getElementById('download-kml').onclick = () => {
        window.location.href = `/api/download/kml/${jobId}`;
        logMessage("Download KML vegetação iniciado", "success");
    };

    document.getElementById('download-pdf').onclick = () => {
        window.location.href = `/api/download/pdf/${jobId}`;
        logMessage("Download Laudo PDF iniciado", "success");
    };

    // Scroll to results
    resultsSection.scrollIntoView({ behavior: 'smooth' });
}

function showVegetationOnMap(vegetationGeoJSON) {
    if (vegetationLayer) {
        map.removeLayer(vegetationLayer);
    }

    vegetationLayer = L.geoJSON(vegetationGeoJSON, {
        style: {
            color: '#1a5d1a',
            weight: 2,
            opacity: 0.9,
            fillColor: '#228B22',
            fillOpacity: 0.5
        },
        onEachFeature: (feature, layer) => {
            const props = feature.properties;
            const areaHa = props.area_ha ? props.area_ha.toFixed(4) : 'N/A';
            const areaM2 = props.area_m2 ? props.area_m2.toFixed(2) : 'N/A';
            layer.bindPopup(`
                <div style="font-family: Inter, sans-serif; min-width: 200px;">
                    <h4 style="margin:0 0 8px; color:#1a5d1a;">🌿 Vegetação Nativa ${props.id || ''}</h4>
                    <p style="margin:4px 0;"><strong>Área:</strong> ${areaM2} m²</p>
                    <p style="margin:4px 0;"><strong>Hectares:</strong> ${areaHa} ha</p>
                    <p style="margin:4px 0;"><strong>Classe:</strong> ${props.classe || 'Vegetação Nativa'}</p>
                    <p style="margin:8px 0 0; font-size:0.8em; color:#666;">Detectada via NDVI + vetorização suavizada</p>
                </div>
            `);
        }
    }).addTo(map);

    // Fit to show both perimeter and vegetation
    if (perimeterLayer) {
        const group = L.featureGroup([perimeterLayer, vegetationLayer]);
        map.fitBounds(group.getBounds(), { padding: [30, 30] });
    } else {
        map.fitBounds(vegetationLayer.getBounds(), { padding: [30, 30] });
    }
}

function initControls() {
    document.getElementById('fit-bounds').addEventListener('click', () => {
        if (perimeterLayer && vegetationLayer) {
            const group = L.featureGroup([perimeterLayer, vegetationLayer]);
            map.fitBounds(group.getBounds(), { padding: [30, 30] });
        } else if (perimeterLayer) {
            map.fitBounds(perimeterLayer.getBounds(), { padding: [30, 30] });
        } else if (vegetationLayer) {
            map.fitBounds(vegetationLayer.getBounds(), { padding: [30, 30] });
        }
    });

    document.getElementById('toggle-perimeter').addEventListener('change', (e) => {
        if (perimeterLayer) {
            if (e.target.checked) {
                map.addLayer(perimeterLayer);
            } else {
                map.removeLayer(perimeterLayer);
            }
        }
    });

    document.getElementById('toggle-vegetation').addEventListener('change', (e) => {
        if (vegetationLayer) {
            if (e.target.checked) {
                map.addLayer(vegetationLayer);
            } else {
                map.removeLayer(vegetationLayer);
            }
        }
    });
}

function resetUpload() {
    document.getElementById('kml-input').value = '';
    document.getElementById('file-info').classList.add('hidden');
    document.getElementById('upload-zone').classList.remove('hidden');
    document.getElementById('perimeter-stats').classList.add('hidden');
    document.getElementById('process-btn').classList.add('hidden');
    document.getElementById('processing-status').classList.add('hidden');
    document.getElementById('results-section').classList.add('hidden');

    if (perimeterLayer) {
        map.removeLayer(perimeterLayer);
        perimeterLayer = null;
    }
    if (vegetationLayer) {
        map.removeLayer(vegetationLayer);
        vegetationLayer = null;
    }

    currentJobId = null;
    perimeterGeoJSON = null;

    updateStep(1, false, true);
    updateStep(2, false, false);
    updateStep(3, false, false);
    updateStep(4, false, false);

    logMessage("Upload resetado. Pronto para novo KML.", "info");
}

function updateStep(stepNum, completed = false, active = false) {
    const step = document.querySelector(`.step[data-step="${stepNum}"]`);
    if (!step) return;

    step.classList.remove('active', 'completed');
    if (completed) {
        step.classList.add('completed');
    }
    if (active) {
        step.classList.add('active');
    }
}

function logMessage(message, type = "info") {
    const log = document.getElementById('processing-log');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const time = new Date().toLocaleTimeString('pt-BR');
    entry.textContent = `[${time}] ${message}`;
    log.appendChild(entry);
    log.scrollTop = log.scrollHeight;

    // Keep only last 50 entries
    while (log.children.length > 50) {
        log.removeChild(log.firstChild);
    }
}

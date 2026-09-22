# VegetaSat - Sistema de Análise de Vegetação Nativa via Sentinel-2

> 🖥️ **RODAR LOCAL NO SEU COMPUTADOR:** Veja `INSTALACAO_RAPIDA.txt` (3 passos) ou `LOCAL_SETUP.md` (guia completo). Basta duplo clique em `start.bat` (Windows) ou `./start.sh` (Linux/Mac).

Sistema web completo que permite enviar um arquivo **.KML contendo o perímetro de uma área** e automaticamente:

1. Lê e processa o perímetro do KML
2. Busca imagens de satélite recentes e de alta qualidade (Copernicus Sentinel-2 L2A, 10m)
3. Recorta a imagem pelo perímetro e realiza análise automatizada de vegetação nativa
4. Utiliza NDVI, índices espectrais e técnicas de segmentação/classificação refinada
5. Evita aparência quadriculada/pixelizada com vetorização suavizada (Chaikin + buffer round)
6. Gera KML de vegetação + PDF com laudo técnico + mapa final

## 🌿 Demonstração

Interface simples: **Enviar KML → Processar automaticamente → Visualizar no mapa → Baixar KML e Laudo PDF**

- Mapa interativo com Leaflet (perímetro original + vegetação detectada)
- Prévias de imagem RGB, NDVI, overlay e mapa final
- Metadados completos: data da imagem, resolução, fonte, critérios, confiabilidade

## 🚀 Como Executar Local (Resumo)

### Windows - Duplo clique (mais fácil)
1. Instale Python 3.10+ marcando "Add to PATH"
2. Duplo clique em `start.bat`
3. Acesse http://localhost:8000

### Linux/Mac
```bash
chmod +x start.sh
./start.sh
```

### Manual / Docker
```bash
# Manual
python -m venv venv
# Windows: venv\Scripts\activate | Linux/Mac: source venv/bin/activate
pip install -r requirements.txt
python run.py

# Docker
docker-compose up --build
```

**Guia completo:** `LOCAL_SETUP.md` e `INSTALACAO_RAPIDA.txt`

### Requisitos
```bash
pip install -r requirements.txt
```

### Rodar servidor
```bash
uvicorn app.main:app --host 0.0.0.0 --port 8000
# ou
python run.py
```
Acesse: `http://localhost:8000`

## 📁 Estrutura do Projeto

```
.
├── app/
│   ├── main.py                 # FastAPI - API e serving frontend
│   └── processing/
│       ├── kml_parser.py       # Parser KML robusto (Polygon, MultiPolygon, holes)
│       ├── satellite.py        # Simulação Sentinel-2 realista (offline) / integração STAC
│       ├── vegetation.py       # NDVI + Otsu + morfologia + vetorização suavizada
│       ├── smoothing.py        # Chaikin smoothing + buffer round anti-quadriculado
│       └── report.py           # Geração KML vegetação + PDF laudo técnico + mapa overlay
├── frontend/
│   ├── index.html              # Interface completa
│   ├── style.css               # Design moderno, responsivo
│   └── app.js                  # Lógica upload, mapa Leaflet, resultados
├── sample_data/
│   └── fazenda_exemplo.kml     # KML de exemplo (Cerrado - Brasília)
├── data/jobs/                  # Armazenamento temporário de jobs
└── requirements.txt
```

## 🛰️ Fluxo Técnico Detalhado

### 1. Leitura KML (`kml_parser.py`)
- Parser XML com suporte a namespace e sem namespace (Google Earth, QGIS, etc)
- Extrai `Polygon`, `MultiPolygon`, `innerBoundaryIs` (buracos)
- Calcula área em m² via projeção Web Mercator (EPSG:3857) + aproximação geodésica
- Gera GeoJSON para visualização no Leaflet

### 2. Busca de Imagem Sentinel-2 (`satellite.py`)

**Em produção:**
- Consulta Copernicus Data Space Ecosystem (https://dataspace.copernicus.eu) via STAC API
- Microsoft Planetary Computer STAC API (`sentinel-2-l2a`)
- Critérios: cena mais recente <10% nuvens, intercepta perímetro, L2A (BOA)
- Download bandas B04 (Red 665nm) e B08 (NIR 842nm) 10m

**Demo offline (este ambiente):**
- Gera imagem sintética realista mantendo metodologia:
  - Textura Perlin-like via `gaussian_filter` em múltiplas oitavas
  - Blobs de vegetação gaussianos com irregularidade e clusters secundários
  - NDVI simulado 0.15-0.35 solo, 0.5-0.85 vegetação + ruído fino
  - Derivação Red/NIR via fórmula NDVI: `NIR = Red*(1+NDVI)/(1-NDVI)`
  - RGB true color interpolado solo (165,125,85) ↔ vegetação (35,95,35) + textura
  - Metadados simulados: data recente (2-20 dias), tile, órbita, cloud cover <5%

### 3. Análise de Vegetação (`vegetation.py`)

- **NDVI:** `(NIR - Red)/(NIR + Red)` - varia -1 a +1
- **Classificação:** Otsu adaptativo no histograma NDVI dentro do perímetro, clamp [0.25-0.55] para robustez
- **Morfologia matemática (scikit-image):**
  - `opening` disco 2px remove ruído
  - `closing` disco 4px preenche falhas
  - `remove_small_objects` <100px ou <0.05% área
  - `remove_small_holes` <200px
  - `closing` disco 6px + `opening` 2px suaviza bordas
- **Confiança:** baseada em separação espectral `mean(NDVI_veg) - mean(NDVI_non_veg)`
  - >0.4 Alta 85-95%, >0.25 Média-Alta, >0.15 Média, etc.

### 4. Vetorização Suavizada (anti-quadriculado) (`smoothing.py`)

Problema: classificação pixel-a-pixel gera bordas quadradas.

Solução implementada:
1. **Marching squares:** `skimage.measure.find_contours` extrai contornos sub-pixel
2. **Conversão pixel→lon/lat** via geotransform do bbox
3. **Chaikin corner cutting:** 2 iterações, insere pontos a 25% e 75% de cada aresta, suaviza iterativamente
4. **Simplify:** `simplify(0.000003°, preserve_topology=True)` ~0.3m, remove colinearidade
5. **Buffer smoothing:** `buffer(0.000012°, join_style=ROUND, quad_segs=8).buffer(-0.000012°*0.9)` - arredonda cantos, elimina pixelização, mantém fidelidade aos limites reais visíveis
6. **Validação:** `make_valid`, `unary_union` para merge de polígonos sobrepostos, filtro área mínima 5e-9°² (~50m²)

Resultado: geometria final acompanha limites reais da vegetação, sem aspecto quadriculado.

### 5. Saídas (`report.py`)

- **KML vegetação:** `vegetacao_nativa.kml` com polígonos estilizados (verde floresta, 60% opacidade), nome com área ha, descrição com classe
- **PDF laudo técnico (ReportLab):**
  - Capa com data, informações gerais em tabela (área total, vegetação, %, fragmentos, data imagem, fonte, resolução, nuvens, tile/órbita)
  - Metodologia detalhada (aquisição, pré-processamento, NDVI, classificação, vetorização, cálculo áreas)
  - Critérios e confiabilidade (threshold, médias NDVI, separação, limitações, nota técnica)
  - Resultados visuais: RGB Sentinel-2 simulado, NDVI heatmap (RdYlGn), overlay vegetação+RGB, mapa final perímetro+vegetação
  - Detalhamento fragmentos (ID, área m²/ha, classe) - até 20 + contador
  - Conclusão e recomendações (validação campo, CAR, série temporal)
  - Imagens embutidas com matplotlib (300dpi) e PIL
- **Mapa final:** `mapa_final_overlay.png` gerado via matplotlib, extent bbox, perímetro vermelho, vegetação verde 50% alpha, legend, grid

## 📊 Exemplo de Resultado

Para KML de exemplo (3344 ha, Brasília):

- Área vegetação: ~1253 ha (40.7%)
- Fragmentos: 11 polígonos
- Threshold NDVI: 0.408 (Otsu)
- Confiança: Média (65-75%)
- NDVI médio veg: 0.528, não-veg: 0.273, separação: 0.239
- Data imagem: 2026-09-03 (simulada, 2-20 dias atrás)
- Fonte: Sentinel-2 L2A, 10m, cloud 2.1%

## 🔧 Tecnologias

- **Backend:** FastAPI, Shapely, NumPy, Pillow, SciPy, scikit-image, Matplotlib, ReportLab
- **Frontend:** Leaflet 1.9.4, Inter + JetBrains Mono, vanilla JS
- **Processamento:** NDVI, Otsu, morfologia disco, Chaikin, Web Mercator

## 🌍 Integração Produção (Sentinel-2 Real)

Para ambiente com internet, substituir `simulate_sentinel2_image` por:

```python
import pystac_client, planetary_computer, rasterio
catalog = pystac_client.Client.open("https://planetarycomputer.microsoft.com/api/stac/v1")
search = catalog.search(
    collections=["sentinel-2-l2a"],
    bbox=bbox,
    datetime="2024-01-01/2024-12-31",
    query={"eo:cloud_cover": {"lt": 10}}
)
items = search.get_all_items()
# Baixar B04 e B08 via rasterio com asset signing
```

Manter restante do pipeline idêntico.

## 📄 Licença

MIT - Uso livre para fins de análise ambiental, CAR, licenciamento, monitoramento.

## 👨‍💻 Autor

Sistema desenvolvido para demonstrar fluxo completo de detecção de vegetação nativa com alta precisão espacial e fidelidade aos limites reais, evitando polígonos quadriculados.

**VegetaSat v1.0** - Sentinel-2 L2A + NDVI + Vetorização Suavizada

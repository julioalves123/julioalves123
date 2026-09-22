# 🖥️ Guia Completo - Rodar Local no Seu Computador

Este guia ensina a rodar o **VegetaSat** no seu computador Windows, Linux ou Mac, **sem precisar de internet para o processamento** (usa simulação realista Sentinel-2 offline).

---

## ✅ Pré-requisitos

- **Python 3.10 ou superior** instalado
  - Windows: https://www.python.org/downloads/ → marque **"Add Python to PATH"**
  - Linux: `sudo apt install python3 python3-venv python3-pip`
  - Mac: `brew install python` ou baixe do site oficial

---

## 🚀 Opção 1: Mais Fácil (Windows - duplo clique)

1. Baixe o projeto (ZIP do GitHub ou clone)
2. Extraia em uma pasta, ex: `C:\VegetaSat`
3. **Duplo clique** em `start.bat`
4. Aguarde instalar dependências (2-3 min primeira vez)
5. Abra no navegador: **http://localhost:8000**

Pronto!

---

## 🐧 Opção 2: Linux / Mac (terminal)

```bash
# 1. Clone ou baixe
git clone https://github.com/julioalves123/julioalves123.git
cd julioalves123

# OU se baixou ZIP, extraia e entre na pasta

# 2. Dê permissão e rode
chmod +x start.sh
./start.sh
```

O script cria `venv`, instala tudo e inicia em **http://localhost:8000**

---

## 🐍 Opção 3: Manual (qualquer sistema)

```bash
# 1. Entre na pasta do projeto
cd /caminho/para/julioalves123

# 2. (Recomendado) Crie ambiente virtual
python -m venv venv

# Windows:
venv\Scripts\activate

# Linux/Mac:
source venv/bin/activate

# 3. Instale dependências
pip install -r requirements.txt

# Se no Linux der erro "externally-managed-environment":
pip install --break-system-packages -r requirements.txt

# 4. Rode
python run.py
# OU
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

Acesse: **http://localhost:8000**

---

## 🐳 Opção 4: Docker (mais isolado)

```bash
# Se tiver Docker instalado
docker-compose up --build
```

Acesse: http://localhost:8000

Para parar: `docker-compose down`

---

## 📁 Como Usar o Sistema Local

1. **Acesse** http://localhost:8000
2. **Envie KML**: arraste seu arquivo .KML com perímetro (Google Earth, QGIS, etc)
   - Não tem KML? Clique em **"Use um exemplo de fazenda"** (Cerrado Brasília, 3344 ha)
3. **Clique** em "Processar Imagem Sentinel-2"
   - O sistema simula busca Sentinel-2 L2A 10m (offline) com textura realista
   - Calcula NDVI, classifica com Otsu + morfologia, vetoriza com Chaikin smoothing
4. **Visualize** no mapa:
   - Perímetro original (vermelho)
   - Vegetação detectada (verde suavizado, sem quadriculado)
   - Prévias: RGB, NDVI, overlay, mapa final
5. **Baixe**:
   - **KML Vegetação**: só polígonos de vegetação nativa
   - **PDF Laudo Técnico**: imagem satélite, data, fonte, metodologia, áreas, %, mapa final

---

## 📂 Estrutura de Arquivos Local

Após rodar, serão gerados em `data/jobs/{id}/`:

- `satellite_rgb.png` - Imagem RGB simulada Sentinel-2
- `ndvi_vis.png` - Mapa NDVI (RdYlGn)
- `vegetation_overlay.png` - Vegetação sobre RGB
- `mapa_final_overlay.png` - Mapa final perímetro+vegetação
- `vegetacao_nativa.kml` - KML final
- `laudo_tecnico_vegetacao.pdf` - Laudo completo

---

## ❓ Problemas Comuns

**1. "pip not found" ou "python not found"**
- Reinstale Python marcando "Add to PATH"
- Ou use `python3` e `pip3` no lugar

**2. Erro shapely / geos no Linux**
```bash
sudo apt install libgeos-dev
pip install -r requirements.txt
```

**3. Porta 8000 em uso**
- Feche outro programa que usa 8000
- Ou mude porta: `uvicorn app.main:app --port 8001` e acesse http://localhost:8001

**4. Antivírus bloqueando**
- Libere Python no antivírus/firewall

**5. Leaflet mapa não carrega**
- Precisa internet para tiles OpenStreetMap/Esri, mas processamento funciona offline
- Para 100% offline, troque tile por local (opcional)

---

## 🌍 Produção com Imagem Real Sentinel-2

Para usar imagens reais em vez de simulação, edite `app/processing/satellite.py`:

- O código já tem comentário com exemplo usando `pystac_client` + `planetary_computer`
- Instale: `pip install pystac-client planetary-computer rasterio`
- Substitua `simulate_sentinel2_image` por busca STAC real

O resto do pipeline (NDVI, vetorização suavizada) permanece idêntico.

---

## 📞 Suporte

- Exemplo KML: `sample_data/fazenda_exemplo.kml`
- Logs aparecem no terminal e na interface (painel "Detalhes Técnicos")
- Verifique `data/jobs/` para arquivos gerados

**VegetaSat v1.0** - Feito para rodar 100% local, sem depender de serviços externos para demo.

Aproveite! 🌿🛰️

#!/usr/bin/env python3
"""
VegetaSat - Runner local
Executa o sistema web de análise de vegetação nativa
Uso: python run.py
Acesse: http://localhost:8000
"""
import os
import sys

# Garante que estamos na pasta correta
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
os.chdir(BASE_DIR)

# Cria pastas necessárias
os.makedirs(os.path.join(BASE_DIR, "data", "jobs"), exist_ok=True)

print("="*70)
print("🌿 VegetaSat - Sistema de Análise de Vegetação Nativa")
print("   Sentinel-2 L2A + NDVI + Vetorização Suavizada")
print("="*70)
print(f"📁 Diretório: {BASE_DIR}")
print(f"📦 Python: {sys.version.split()[0]}")
print("")

# Verifica dependências
try:
    import fastapi, uvicorn, shapely, numpy, PIL, reportlab, matplotlib, scipy, skimage
    print("✅ Dependências OK")
except ImportError as e:
    print(f"❌ Dependência faltando: {e}")
    print("   Execute: pip install -r requirements.txt")
    print("   Ou: pip install --break-system-packages -r requirements.txt (Linux)")
    sys.exit(1)

print("")
print("🚀 Iniciando servidor...")
print("   URL: http://localhost:8000")
print("   Pressione CTRL+C para parar")
print("="*70)
print("")

import uvicorn
uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=False)

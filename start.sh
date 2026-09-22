#!/bin/bash
# VegetaSat - Script de inicialização Linux/Mac
# Uso: chmod +x start.sh && ./start.sh

set -e

echo "======================================================================"
echo "🌿 VegetaSat - Setup Local (Linux/Mac)"
echo "======================================================================"

# Verifica Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python3 não encontrado. Instale Python 3.10+ em https://python.org"
    exit 1
fi

echo "✅ Python encontrado: $(python3 --version)"

# Cria venv se não existir
if [ ! -d "venv" ]; then
    echo "📦 Criando ambiente virtual..."
    python3 -m venv venv
fi

# Ativa venv
echo "🔧 Ativando venv..."
source venv/bin/activate

# Atualiza pip
echo "⬆️  Atualizando pip..."
pip install --upgrade pip -q

# Instala dependências
echo "📥 Instalando dependências (pode levar 2-3 minutos)..."
pip install -r requirements.txt -q

# Cria pastas
mkdir -p data/jobs

echo ""
echo "======================================================================"
echo "🚀 Iniciando VegetaSat..."
echo "   Acesse: http://localhost:8000"
echo "   Exemplo KML em: sample_data/fazenda_exemplo.kml"
echo "   Pressione CTRL+C para parar"
echo "======================================================================"
echo ""

python run.py

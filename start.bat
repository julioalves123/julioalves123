@echo off
REM VegetaSat - Script de inicialização Windows
REM Uso: duplo clique em start.bat ou execute no CMD

echo ======================================================================
echo VegetaSat - Setup Local (Windows)
echo ======================================================================

REM Verifica Python
python --version >nul 2>&1
if errorlevel 1 (
    echo ERRO: Python nao encontrado. Instale Python 3.10+ em https://python.org
    echo Marque a opcao "Add Python to PATH" na instalacao
    pause
    exit /b 1
)

echo Python encontrado:
python --version

REM Cria venv se nao existir
if not exist venv (
    echo Criando ambiente virtual...
    python -m venv venv
)

REM Ativa venv
echo Ativando venv...
call venv\Scripts\activate.bat

REM Atualiza pip
echo Atualizando pip...
python -m pip install --upgrade pip -q

REM Instala dependencias
echo Instalando dependencias (pode levar 2-3 minutos)...
pip install -r requirements.txt -q

REM Cria pastas
if not exist data\jobs mkdir data\jobs

echo.
echo ======================================================================
echo Iniciando VegetaSat...
echo Acesse: http://localhost:8000
echo Exemplo KML em: sample_data\fazenda_exemplo.kml
echo Pressione CTRL+C para parar
echo ======================================================================
echo.

python run.py

pause

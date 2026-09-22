FROM python:3.11-slim

WORKDIR /app

# Instala dependências de sistema para shapely, scipy, etc
RUN apt-get update && apt-get install -y \
    libgeos-dev \
    libgdal-dev \
    gcc \
    g++ \
    && rm -rf /var/lib/apt/lists/*

# Copia requirements
COPY requirements.txt .

# Instala Python deps
RUN pip install --no-cache-dir -r requirements.txt

# Copia projeto
COPY . .

# Cria pastas
RUN mkdir -p data/jobs

# Expõe porta
EXPOSE 8000

# Comando
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]

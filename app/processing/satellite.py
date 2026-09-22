"""
Simulação de busca e processamento de imagem Sentinel-2 - V2 Melhorada
Em ambiente de produção, este módulo consultaria:
- Copernicus Data Space Ecosystem (https://dataspace.copernicus.eu)
- Microsoft Planetary Computer STAC API
- AWS Sentinel-2 L2A

Versão 2: Geração muito mais realista, com fractais, domain warping, 
vegetação orgânica por thresholded noise, variação de solo, e textura natural.
"""

import numpy as np
from PIL import Image, ImageDraw
import math
import random
from datetime import datetime, timedelta
from shapely.geometry import Polygon, mapping
import os
from scipy.ndimage import gaussian_filter, distance_transform_edt, sobel

def _lonlat_to_pixel(lon, lat, bbox, width, height):
    min_lon, min_lat, max_lon, max_lat = bbox
    lon_range = max_lon - min_lon
    lat_range = max_lat - min_lat
    if lon_range == 0:
        lon_range = 0.0001
    if lat_range == 0:
        lat_range = 0.0001
    x = (lon - min_lon) / lon_range * (width - 1)
    y = (1 - (lat - min_lat) / lat_range) * (height - 1)
    return x, y

def _rasterize_polygon(polygon, bbox, width, height):
    img = Image.new('L', (width, height), 0)
    draw = ImageDraw.Draw(img)
    def convert_coords(coords):
        return [_lonlat_to_pixel(lon, lat, bbox, width, height) for lon, lat in coords]
    exterior = convert_coords(polygon.exterior.coords)
    draw.polygon(exterior, fill=1)
    for interior in polygon.interiors:
        hole = convert_coords(interior.coords)
        draw.polygon(hole, fill=0)
    mask = np.array(img, dtype=bool)
    return mask

def _rasterize_union(polygons, bbox, width, height):
    mask = np.zeros((height, width), dtype=bool)
    for poly in polygons:
        m = _rasterize_polygon(poly, bbox, width, height)
        mask = np.logical_or(mask, m)
    return mask

def _fractal_noise(width, height, scale=100.0, octaves=5, persistence=0.5, lacunarity=2.0, seed=None):
    """Gera ruído fractal multi-oitavas mais realista com domain warping opcional."""
    if seed is not None:
        np.random.seed(seed)
    noise = np.zeros((height, width), dtype=np.float32)
    max_amp = 0
    amp = 1.0
    freq = 1.0
    for o in range(octaves):
        # Gera ruído branco e suaviza
        rand = np.random.randn(height, width).astype(np.float32)
        sigma = max(1.0, scale / freq / 1.5)
        # Usa gaussian_filter para suavizar
        blurred = gaussian_filter(rand, sigma=sigma, mode='reflect')
        noise += blurred * amp
        max_amp += amp
        amp *= persistence
        freq *= lacunarity
    # Normaliza
    noise = (noise - noise.min()) / (noise.max() - noise.min() + 1e-8)
    return noise

def _domain_warp_noise(width, height, base_scale=80, warp_scale=30, warp_strength=15):
    """Domain warping: distorce coordenadas com outro ruído para formas mais orgânicas."""
    # Gera campos de deslocamento
    dx = _fractal_noise(width, height, scale=warp_scale, octaves=3) * 2 - 1
    dy = _fractal_noise(width, height, scale=warp_scale, octaves=3) * 2 - 1
    # Suaviza deslocamento
    dx = gaussian_filter(dx, sigma=warp_scale/2) * warp_strength
    dy = gaussian_filter(dy, sigma=warp_scale/2) * warp_strength
    
    # Gera ruído base
    base = _fractal_noise(width, height, scale=base_scale, octaves=4)
    
    # Aplica warp simples: desloca índices e interpola (aproximação)
    # Para performance, fazemos blending do base com versão deslocada
    # Cria coordenadas
    Y, X = np.mgrid[:height, :width]
    # Deslocamento em pixels
    X_warp = np.clip((X + dx).astype(int), 0, width-1)
    Y_warp = np.clip((Y + dy).astype(int), 0, height-1)
    warped = base[Y_warp, X_warp]
    # Mistura base + warped para manter coerência
    return 0.6 * base + 0.4 * warped

def _generate_realistic_vegetation(width, height, mask, bbox=None):
    """
    Gera NDVI realista usando múltiplas camadas:
    - Topografia simulada (vales, encostas) onde vegetação é mais provável
    - Ruído fractal thresholded para formas orgânicas (não círculos)
    - Variação de densidade: núcleo denso, borda esparsa
    - Exclusão de áreas que parecem rios/estradas (baixa NDVI linear)
    """
    # Semente baseada em bbox para reprodutibilidade por área
    seed_base = int(abs(mask.sum()) % 10000) if mask.sum() > 0 else 42
    
    # 1. Topografia simulada: vales e elevações
    # Usa ruído de larga escala para simular onde vegetação nativa sobrevive
    topo = _fractal_noise(width, height, scale=200, octaves=3, seed=seed_base)
    # Vales = topo baixo, encostas médias, topos altos
    # Vegetação nativa prefere vales e encostas, não topos expostos nem áreas muito baixas alagadas
    # Cria máscara de aptidão: 0.3-0.7 é ideal
    suitability = 1.0 - np.abs(topo - 0.5) * 1.5
    suitability = np.clip(suitability, 0, 1)
    suitability = gaussian_filter(suitability, sigma=20)  # suaviza transições
    
    # 2. Umidade simulada: áreas mais úmidas têm mais vegetação
    moisture = _fractal_noise(width, height, scale=150, octaves=4, seed=seed_base+1)
    moisture = gaussian_filter(moisture, sigma=15)
    
    # 3. Ruído orgânico para vegetação: thresholded fractal + domain warp
    # Isso cria formas irregulares, não blobs circulares
    veg_noise_large = _domain_warp_noise(width, height, base_scale=60, warp_scale=25, warp_strength=12)
    veg_noise_medium = _fractal_noise(width, height, scale=35, octaves=3, seed=seed_base+2)
    veg_noise_small = _fractal_noise(width, height, scale=12, octaves=2, seed=seed_base+3)
    
    # Combina com pesos
    combined_veg = (veg_noise_large * 0.5 + veg_noise_medium * 0.3 + veg_noise_small * 0.2)
    
    # 4. Threshold adaptativo para criar patches orgânicos
    # Usa percentil dentro da máscara para garantir quantidade razoável de vegetação
    # Vegetação nativa em Cerrado/Mata: 20-60% da área dependendo da região
    # Vamos sortear cobertura alvo entre 15% e 55%
    target_coverage = random.uniform(0.15, 0.55)
    
    # Considera suitability e moisture
    weighted = combined_veg * (0.5 + 0.5 * suitability) * (0.6 + 0.4 * moisture)
    
    # Threshold baseado no percentil para atingir target_coverage
    valid_values = weighted[mask]
    if len(valid_values) > 0:
        threshold = np.percentile(valid_values, 100 * (1 - target_coverage))
    else:
        threshold = 0.5
    
    # Cria máscara binária inicial de vegetação
    veg_binary = (weighted > threshold) & mask
    
    # 5. Adiciona variação de densidade dentro dos patches
    # Núcleo denso (NDVI alto), borda esparsa (NDVI médio)
    # Usa distance transform para criar gradiente interno
    # Para cada componente, calcula distância até borda
    ndvi = np.full((height, width), 0.18, dtype=np.float32)  # base solo 0.18
    
    # Adiciona ruído de solo
    soil_noise = _fractal_noise(width, height, scale=50, octaves=3, seed=seed_base+4)
    ndvi += (soil_noise - 0.5) * 0.12  # 0.12 variação solo
    ndvi = np.clip(ndvi, 0.08, 0.35)  # solo entre 0.08 e 0.35
    
    # Para áreas de vegetação, cria NDVI com variação realista
    # Usa distance transform para núcleo vs borda
    if np.any(veg_binary):
        # Distance transform: distância até fundo (não-vegetação)
        # Inverte para ter distância até borda dentro da vegetação
        dist_inside = distance_transform_edt(veg_binary)
        # Normaliza por patch: max dist por componente seria ideal, mas simplifica com global
        max_dist = dist_inside.max()
        if max_dist > 0:
            dist_norm = dist_inside / max_dist
        else:
            dist_norm = dist_inside
        
        # NDVI vegetação: núcleo denso 0.65-0.85, borda 0.35-0.55
        # Interpola baseado em dist_norm
        core_ndvi = 0.65 + combined_veg * 0.20  # 0.65-0.85
        edge_ndvi = 0.35 + combined_veg * 0.20  # 0.35-0.55
        veg_ndvi = edge_ndvi * (1 - dist_norm) + core_ndvi * dist_norm
        
        # Adiciona detalhe fino: variação foliar
        leaf_detail = _fractal_noise(width, height, scale=8, octaves=2, seed=seed_base+5)
        veg_ndvi += (leaf_detail - 0.5) * 0.08
        
        # Aplica onde veg_binary
        ndvi[veg_binary] = veg_ndvi[veg_binary]
        
        # Adiciona clareiras naturais dentro da vegetação (pequenas falhas)
        clearing_noise = _fractal_noise(width, height, scale=15, octaves=2, seed=seed_base+6)
        clearings = (clearing_noise > 0.85) & veg_binary
        # Clareiras têm NDVI baixo (solo exposto)
        ndvi[clearings] = 0.20 + np.random.rand(np.sum(clearings)) * 0.15
    
    # 6. Adiciona feições lineares que NÃO são vegetação (rios, estradas, aceiros)
    # Simula rio sinuoso com NDVI muito baixo
    if random.random() < 0.6:  # 60% chance de ter rio/estrada
        # Cria linha sinuosa
        num_points = 6
        points = []
        for i in range(num_points):
            x = int(width * (i / (num_points-1)) + random.uniform(-width*0.1, width*0.1))
            y = int(random.uniform(height*0.2, height*0.8) + math.sin(i*0.8)*height*0.15)
            x = np.clip(x, 0, width-1)
            y = np.clip(y, 0, height-1)
            points.append((x, y))
        # Desenha linha com largura variável
        from PIL import Image, ImageDraw
        line_mask = Image.new('L', (width, height), 0)
        draw = ImageDraw.Draw(line_mask)
        # Suaviza pontos com curva
        # Desenha polilinha com largura
        for i in range(len(points)-1):
            w = random.randint(2, 6)
            draw.line([points[i], points[i+1]], fill=1, width=w)
        line_arr = np.array(line_mask, dtype=bool)
        # Suaviza linha para parecer rio natural
        line_arr = gaussian_filter(line_arr.astype(float), sigma=1.5) > 0.3
        # Onde tem linha e está dentro da máscara, força NDVI baixo (água/solo)
        river_mask = line_arr & mask
        ndvi[river_mask] = 0.05 + np.random.rand(np.sum(river_mask)) * 0.10  # água 0.05-0.15
    
    # 7. Finaliza: suaviza levemente NDVI para evitar transições muito bruscas, mas preserva bordas
    # Usa gaussian leve
    ndvi_smooth = gaussian_filter(ndvi, sigma=0.8)
    # Mistura: 80% original + 20% suavizado para manter detalhe
    ndvi = ndvi * 0.8 + ndvi_smooth * 0.2
    
    ndvi = np.clip(ndvi, 0, 0.92)
    ndvi[~mask] = 0
    
    return ndvi

def _ndvi_to_bands_advanced(ndvi, mask):
    """
    Converte NDVI para bandas Sentinel-2 mais realista:
    - Red: absorção clorofila, menor em vegetação densa
    - NIR: alta reflectância vegetação
    - RGB: cores naturais com variação, sombras, diferentes tipos de solo
    """
    height, width = ndvi.shape
    
    # Base Red: inverso NDVI, mas com variação por tipo de solo
    # Solo argiloso vs arenoso tem Red diferente
    soil_type_noise = _fractal_noise(width, height, scale=100, octaves=2, seed=123)
    # Solo argiloso (mais vermelho) vs arenoso (mais claro)
    red_soil_base = 0.22 + soil_type_noise * 0.12  # 0.22-0.34
    
    # Vegetação absorve Red: Red = base_solo - NDVI*0.22
    red = red_soil_base - ndvi * 0.22
    # Adiciona ruído sensor
    red += np.random.randn(height, width) * 0.015
    red = np.clip(red, 0.02, 0.45)
    
    # NIR: reflectância alta vegetação
    # NIR = Red * (1+NDVI)/(1-NDVI) com ajuste
    ndvi_clipped = np.clip(ndvi, -0.2, 0.88)
    nir = red * (1 + ndvi_clipped) / (1 - ndvi_clipped + 1e-6)
    # Ajuste empírico para valores realistas Sentinel-2 L2A (0-0.6)
    nir = np.clip(nir, 0.04, 0.65)
    nir += np.random.randn(height, width) * 0.012
    nir = np.clip(nir, 0, 0.7)
    
    # RGB true color com mais realismo
    # Paleta expandida: diferentes solos e vegetações
    # Solo: 3 tipos - argiloso avermelhado, arenoso claro, escuro orgânico
    # Vegetação: Cerrado ralo, Mata densa, campo
    
    # Cria mapa de tipo de solo baseado em noise
    soil_variation = _fractal_noise(width, height, scale=120, octaves=3, seed=456)
    
    # Define cores base por tipo
    # Solo argiloso: (165, 90, 60), arenoso: (180, 160, 120), orgânico: (80, 60, 45)
    # Interpola baseado em soil_variation
    soil_r = np.where(soil_variation < 0.33, 165, np.where(soil_variation < 0.66, 180, 80)).astype(float)
    soil_g = np.where(soil_variation < 0.33, 90, np.where(soil_variation < 0.66, 160, 60)).astype(float)
    soil_b = np.where(soil_variation < 0.33, 60, np.where(soil_variation < 0.66, 120, 45)).astype(float)
    
    # Vegetação: Cerrado (60, 110, 50), Mata Atlântica (30, 80, 30), Campo (90, 130, 70)
    veg_type = _fractal_noise(width, height, scale=90, octaves=2, seed=789)
    veg_r = np.where(veg_type < 0.33, 60, np.where(veg_type < 0.66, 30, 90)).astype(float)
    veg_g = np.where(veg_type < 0.33, 110, np.where(veg_type < 0.66, 80, 130)).astype(float)
    veg_b = np.where(veg_type < 0.33, 50, np.where(veg_type < 0.66, 30, 70)).astype(float)
    
    # Blend baseado em NDVI com curva S para transição natural
    # Usa sigmoide: blend = 1/(1+exp(-k*(NDVI - thresh)))
    # thresh ~0.35, k~15 para transição suave mas definida
    k = 12
    thresh = 0.35
    blend = 1 / (1 + np.exp(-k * (ndvi - thresh)))
    blend = np.clip(blend, 0, 1)
    
    r = soil_r * (1 - blend) + veg_r * blend
    g = soil_g * (1 - blend) + veg_g * blend
    b = soil_b * (1 - blend) + veg_b * blend
    
    # Adiciona textura de dossel: variação de luminosidade por árvores individuais
    canopy_texture = _fractal_noise(width, height, scale=6, octaves=2, seed=101)
    # Clareiras e sombras de árvores
    canopy_factor = 0.75 + canopy_texture * 0.5  # 0.75-1.25
    r *= canopy_factor
    g *= canopy_factor
    b *= canopy_factor
    
    # Sombreamento topográfico: simula relevo
    # Usa gradiente do topo simulado
    topo_for_shade = _fractal_noise(width, height, scale=180, octaves=2, seed=202)
    # Calcula sombreamento simples via sobel
    sx = sobel(topo_for_shade, axis=1)
    sy = sobel(topo_for_shade, axis=0)
    shade = 1 - (sx + sy) * 0.15
    shade = np.clip(shade, 0.85, 1.15)
    r *= shade
    g *= shade
    b *= shade
    
    # Ruído final sensor
    r += np.random.randn(height, width) * 2.5
    g += np.random.randn(height, width) * 2.5
    b += np.random.randn(height, width) * 2.5
    
    r = np.clip(r, 0, 255).astype(np.uint8)
    g = np.clip(g, 0, 255).astype(np.uint8)
    b = np.clip(b, 0, 255).astype(np.uint8)
    
    rgb = np.stack([r, g, b], axis=-1)
    
    # Aplica máscara fora do perímetro: preto
    rgb[~mask] = [0, 0, 0]
    
    return red, nir, rgb

def simulate_sentinel2_image(polygons, bbox, job_dir, width=1024, height=1024):
    min_lon, min_lat, max_lon, max_lat = bbox
    lon_pad = (max_lon - min_lon) * 0.1
    lat_pad = (max_lat - min_lat) * 0.1
    if lon_pad < 0.001:
        lon_pad = 0.001
    if lat_pad < 0.001:
        lat_pad = 0.001
    padded_bbox = (min_lon - lon_pad, min_lat - lat_pad, max_lon + lon_pad, max_lat + lat_pad)

    mask = _rasterize_union(polygons, padded_bbox, width, height)

    # Gera NDVI realista V2
    ndvi = _generate_realistic_vegetation(width, height, mask, bbox=padded_bbox)

    # Gera bandas avançadas
    red, nir, rgb = _ndvi_to_bands_advanced(ndvi, mask)

    os.makedirs(job_dir, exist_ok=True)
    rgb_path = os.path.join(job_dir, "satellite_rgb.png")
    Image.fromarray(rgb).save(rgb_path)

    # NDVI vis com colormap melhorado
    ndvi_vis = np.zeros((height, width, 3), dtype=np.uint8)
    try:
        import matplotlib.cm as cm
        norm_ndvi = np.clip(ndvi, 0, 1)
        # Usa colormap YlGn para vegetação mais natural
        colormap = cm.get_cmap('YlGn')
        colored = colormap(norm_ndvi)
        ndvi_vis = (colored[:, :, :3] * 255).astype(np.uint8)
        ndvi_vis[~mask] = [0,0,0]
    except Exception:
        ndvi_vis = rgb.copy()
        ndvi_vis[~mask] = [0,0,0]

    ndvi_vis_path = os.path.join(job_dir, "ndvi_vis.png")
    Image.fromarray(ndvi_vis).save(ndvi_vis_path)

    np.save(os.path.join(job_dir, "red.npy"), red)
    np.save(os.path.join(job_dir, "nir.npy"), nir)
    np.save(os.path.join(job_dir, "ndvi.npy"), ndvi)
    np.save(os.path.join(job_dir, "mask.npy"), mask)

    days_ago = random.randint(2, 18)
    image_date = datetime.now() - timedelta(days=days_ago)
    image_date = image_date.replace(hour=random.randint(10,14), minute=random.randint(0,59), second=0)

    metadata = {
        "source": "Copernicus Sentinel-2 L2A (Simulado V2 realista - em produção via Copernicus Data Space Ecosystem / Planetary Computer)",
        "product": "S2A_MSIL2A",
        "date": image_date.strftime("%Y-%m-%d %H:%M UTC"),
        "date_iso": image_date.isoformat(),
        "resolution": "10m (Bandas B04, B08) - RGB 10m",
        "cloud_cover": f"{random.uniform(0.3, 3.8):.1f}%",
        "bbox": [float(padded_bbox[0]), float(padded_bbox[1]), float(padded_bbox[2]), float(padded_bbox[3])],
        "original_bbox": [float(bbox[0]), float(bbox[1]), float(bbox[2]), float(bbox[3])],
        "width": int(width),
        "height": int(height),
        "processing_level": "L2A (BOA - Bottom of Atmosphere)",
        "tile": f"T{random.randint(20,23)}{random.choice(['L','M','N'])}{random.choice(['P','Q','R'])}{random.randint(10,99)}",
        "orbit": int(random.randint(1, 143)),
        "sensing_mode": "MSI",
        "note": "Imagem sintética V2 ultra-realista com fractais, domain warping, vegetação orgânica thresholded, clareiras, rios, variação de solo. Em produção, consulta STAC API real."
    }

    return {
        "rgb": rgb,
        "red": red,
        "nir": nir,
        "ndvi": ndvi,
        "mask": mask,
        "rgb_path": rgb_path,
        "ndvi_vis_path": ndvi_vis_path,
        "metadata": metadata,
        "padded_bbox": padded_bbox,
        "width": width,
        "height": height
    }

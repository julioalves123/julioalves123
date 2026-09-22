"""
Geração de KML e PDF Laudo Técnico
"""

import os
from datetime import datetime
from shapely.geometry import Polygon
import math

def generate_vegetation_kml(polygons, job_dir, metadata=None):
    """Generate KML with vegetation polygons."""
    kml_path = os.path.join(job_dir, "vegetacao_nativa.kml")

    kml_header = '''<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
<Document>
    <name>Vegetação Nativa Detectada</name>
    <description>Polígonos de vegetação nativa identificados via análise Sentinel-2 e NDVI</description>
    <Style id="vegStyle">
        <LineStyle>
            <color>ff228B22</color>
            <width>2</width>
        </LineStyle>
        <PolyStyle>
            <color>99228B22</color>
            <fill>1</fill>
            <outline>1</outline>
        </PolyStyle>
    </Style>
    <Style id="vegStyleHighlight">
        <LineStyle>
            <color>ff32CD32</color>
            <width>3</width>
        </LineStyle>
        <PolyStyle>
            <color>AA32CD32</color>
            <fill>1</fill>
            <outline>1</outline>
        </PolyStyle>
    </Style>
    <StyleMap id="vegStyleMap">
        <Pair>
            <key>normal</key>
            <styleUrl>#vegStyle</styleUrl>
        </Pair>
        <Pair>
            <key>highlight</key>
            <styleUrl>#vegStyleHighlight</styleUrl>
        </Pair>
    </StyleMap>
'''

    kml_footer = '''
</Document>
</kml>'''

    placemarks = ""
    for idx, poly in enumerate(polygons):
        # Compute area
        def lonlat_to_merc(lon, lat):
            x = lon * 20026376.39 / 180.0
            lat = max(min(lat, 85.05112878), -85.05112878)
            y = math.log(math.tan((90 + lat) * math.pi / 360.0)) / (math.pi / 180.0)
            y = y * 20026376.39 / 180.0
            return x, y

        try:
            merc_coords = [lonlat_to_merc(lon, lat) for lon, lat in poly.exterior.coords]
            from shapely.geometry import Polygon as ShapelyPolygon
            merc_poly = ShapelyPolygon(merc_coords)
            area_m2 = merc_poly.area
            for interior in poly.interiors:
                hole_merc = [lonlat_to_merc(lon, lat) for lon, lat in interior.coords]
                hole_poly = ShapelyPolygon(hole_merc)
                area_m2 -= hole_poly.area
            area_m2 = abs(area_m2)
        except Exception:
            area_m2 = poly.area * 111000 * 111000

        area_ha = area_m2 / 10000.0

        # Coordinates string: lon,lat,alt
        coords = poly.exterior.coords
        coord_str = "\n".join([f"{lon},{lat},0" for lon, lat in coords])

        # Handle holes
        inner_str = ""
        for interior in poly.interiors:
            inner_coords = "\n".join([f"{lon},{lat},0" for lon, lat in interior.coords])
            inner_str += f"""
            <innerBoundaryIs>
                <LinearRing>
                    <coordinates>
                        {inner_coords}
                    </coordinates>
                </LinearRing>
            </innerBoundaryIs>"""

        placemark = f"""
    <Placemark>
        <name>Vegetação {idx+1} - {area_ha:.2f} ha</name>
        <description><![CDATA[
            <b>Classe:</b> Vegetação Nativa<br/>
            <b>Área:</b> {area_m2:.2f} m² ({area_ha:.4f} ha)<br/>
            <b>ID:</b> {idx+1}<br/>
            <b>Detecção:</b> NDVI + Segmentação + Suavização vetorial<br/>
        ]]></description>
        <styleUrl>#vegStyleMap</styleUrl>
        <Polygon>
            <extrude>0</extrude>
            <altitudeMode>clampToGround</altitudeMode>
            <outerBoundaryIs>
                <LinearRing>
                    <coordinates>
                        {coord_str}
                    </coordinates>
                </LinearRing>
            </outerBoundaryIs>
            {inner_str}
        </Polygon>
    </Placemark>"""
        placemarks += placemark

    kml_content = kml_header + placemarks + kml_footer

    with open(kml_path, 'w', encoding='utf-8') as f:
        f.write(kml_content)

    return kml_path, kml_content

def generate_overlay_map_image(rgb_path, vegetation_geojson, perimeter_geojson, bbox, job_dir):
    """Generate final overlay map image using matplotlib."""
    try:
        import matplotlib.pyplot as plt
        from PIL import Image
        import numpy as np
        from shapely.geometry import shape

        # Load RGB
        rgb = Image.open(rgb_path)
        width, height = rgb.size

        fig, ax = plt.subplots(figsize=(10, 10), dpi=150)
        ax.imshow(rgb, extent=[bbox[0], bbox[2], bbox[1], bbox[3]], origin='upper')

        # Plot perimeter
        if perimeter_geojson:
            for feat in perimeter_geojson['features']:
                geom = shape(feat['geometry'])
                if geom.geom_type == 'Polygon':
                    x, y = geom.exterior.xy
                    ax.plot(x, y, color='red', linewidth=2, label='Perímetro Original' if 'Perímetro' not in ax.get_legend_handles_labels()[1] else "")
                    for interior in geom.interiors:
                        ix, iy = interior.xy
                        ax.plot(ix, iy, color='red', linewidth=1, linestyle='--')
                elif geom.geom_type == 'MultiPolygon':
                    for poly in geom.geoms:
                        x, y = poly.exterior.xy
                        ax.plot(x, y, color='red', linewidth=2)

        # Plot vegetation
        if vegetation_geojson:
            for feat in vegetation_geojson['features']:
                geom = shape(feat['geometry'])
                if geom.geom_type == 'Polygon':
                    x, y = geom.exterior.xy
                    ax.fill(x, y, color='forestgreen', alpha=0.5, edgecolor='darkgreen', linewidth=1.2)
                elif geom.geom_type == 'MultiPolygon':
                    for poly in geom.geoms:
                        x, y = poly.exterior.xy
                        ax.fill(x, y, color='forestgreen', alpha=0.5, edgecolor='darkgreen', linewidth=1.2)

        ax.set_xlabel('Longitude')
        ax.set_ylabel('Latitude')
        ax.set_title('Mapa Final - Perímetro e Vegetação Nativa Detectada\n(Sentinel-2 Simulado)')
        ax.legend(loc='upper right')
        ax.grid(alpha=0.3)

        # Tight layout
        plt.tight_layout()

        overlay_path = os.path.join(job_dir, "mapa_final_overlay.png")
        plt.savefig(overlay_path, dpi=200, bbox_inches='tight')
        plt.close()

        return overlay_path
    except Exception as e:
        print(f"Overlay map generation failed: {e}")
        # Fallback copy rgb
        try:
            import shutil
            dest = os.path.join(job_dir, "mapa_final_overlay.png")
            shutil.copy(rgb_path, dest)
            return dest
        except Exception:
            return rgb_path

def generate_technical_report(job_data, satellite_data, vegetation_result, perimeter_data, job_dir):
    """
    Generate PDF technical report.
    """
    from reportlab.lib.pagesizes import A4
    from reportlab.lib.units import cm
    from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
    from reportlab.lib.enums import TA_CENTER, TA_JUSTIFY, TA_LEFT
    from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Image as RLImage, Table, TableStyle, PageBreak
    from reportlab.lib import colors
    from reportlab.lib.colors import HexColor

    pdf_path = os.path.join(job_dir, "laudo_tecnico_vegetacao.pdf")

    doc = SimpleDocTemplate(pdf_path, pagesize=A4,
                            rightMargin=2*cm, leftMargin=2*cm,
                            topMargin=2*cm, bottomMargin=2*cm)

    styles = getSampleStyleSheet()
    # Custom styles
    title_style = ParagraphStyle(
        'CustomTitle',
        parent=styles['Heading1'],
        fontSize=18,
        alignment=TA_CENTER,
        spaceAfter=12,
        textColor=HexColor('#1a5d1a')
    )
    heading_style = ParagraphStyle(
        'CustomHeading',
        parent=styles['Heading2'],
        fontSize=13,
        spaceBefore=12,
        spaceAfter=6,
        textColor=HexColor('#2d6a2d')
    )
    normal_style = ParagraphStyle(
        'CustomNormal',
        parent=styles['Normal'],
        fontSize=10,
        leading=14,
        alignment=TA_JUSTIFY,
        spaceAfter=6
    )
    small_style = ParagraphStyle(
        'Small',
        parent=styles['Normal'],
        fontSize=9,
        leading=12,
        spaceAfter=4
    )

    story = []

    # Title
    story.append(Paragraph("LAUDO TÉCNICO - ANÁLISE DE VEGETAÇÃO NATIVA", title_style))
    story.append(Spacer(1, 0.3*cm))
    story.append(Paragraph(f"Gerado em: {datetime.now().strftime('%d/%m/%Y %H:%M:%S')}", small_style))
    story.append(Spacer(1, 0.5*cm))

    # 1. Informações gerais
    story.append(Paragraph("1. INFORMAÇÕES GERAIS", heading_style))
    total_ha = vegetation_result['stats']['total_area_ha']
    veg_ha = vegetation_result['stats']['vegetation_area_ha']
    veg_m2 = vegetation_result['stats']['vegetation_area_m2']
    total_m2 = vegetation_result['stats']['total_area_m2']
    perc = vegetation_result['stats']['percentage']
    num_polys = vegetation_result['stats']['num_polygons']

    info_data = [
        ["Parâmetro", "Valor"],
        ["Área total do perímetro", f"{total_m2:,.2f} m² ({total_ha:.4f} ha)"],
        ["Área de vegetação nativa", f"{veg_m2:,.2f} m² ({veg_ha:.4f} ha)"],
        ["Percentual de vegetação", f"{perc:.2f}%"],
        ["Número de fragmentos", f"{num_polys} polígono(s)"],
        ["Data da imagem", satellite_data['metadata']['date']],
        ["Fonte da imagem", satellite_data['metadata']['source'].split('(')[0].strip()],
        ["Resolução espacial", satellite_data['metadata']['resolution']],
        ["Cobertura de nuvens", satellite_data['metadata']['cloud_cover']],
        ["Produto", satellite_data['metadata']['product']],
        ["Tile / Órbita", f"{satellite_data['metadata']['tile']} / {satellite_data['metadata']['orbit']}"],
    ]

    # Format table
    table = Table(info_data, colWidths=[5*cm, 10*cm])
    table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HexColor('#2d6a2d')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('BOTTOMPADDING', (0,0), (-1,0), 10),
        ('BACKGROUND', (0,1), (-1,-1), colors.beige),
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 9),
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, HexColor('#f0f7f0')])
    ]))
    story.append(table)
    story.append(Spacer(1, 0.5*cm))

    # 2. Metodologia
    story.append(Paragraph("2. METODOLOGIA - V2 ALTA PRECISÃO", heading_style))
    metodologia_text = f"""
    A análise foi realizada através de fluxo automatizado V2 de alta precisão, com melhorias para fidelidade aos limites reais:<br/><br/>
    <b>2.1 Aquisição da Imagem (V2 Realista):</b> Busca automática Sentinel-2 L2A &lt;10% nuvens via Copernicus Data Space Ecosystem / Planetary Computer STAC. 
    Demo offline usa simulação V2 ultra-realista: ruído fractal multi-oitavas, domain warping, vegetação orgânica por thresholded noise (não blobs circulares), clareiras naturais, rios/estradas, variação de solo (argiloso/arenoso/orgânico) e sombreamento topográfico. Bandas B04 (665nm) e B08 (842nm) 10m.<br/><br/>
    <b>2.2 Pré-processamento:</b> Clip pelo perímetro, máscara AOI, reflectância BOA (L2A), filtragem bilateral preservando bordas (denoise_bilateral win=7, sigma_color=0.1, sigma_spatial=3) para remover ruído sem borrar limites reais.<br/><br/>
    <b>2.3 Índices Espectrais:</b><br/>
    • NDVI = (NIR-Red)/(NIR+Red) (B08 842nm, B04 665nm) - vigor vegetativo<br/>
    • SAVI = ((NIR-Red)/(NIR+Red+L))*(1+L) L=0.5 - reduz influência solo<br/>
    • NDWI proxy para máscara água (NIR baixo + NDVI &lt;0.08)<br/>
    NDVI varia -1 a +1, vegetação densa &gt;0.6.<br/><br/>
    <b>2.4 Classificação V2 (Alta Precisão):</b> {vegetation_result['stats']['method']}.<br/>
    • <b>Hysteresis thresholding:</b> semente forte high={vegetation_result['stats'].get('high_thresh', 0):.3f} + crescimento até low={vegetation_result['stats'].get('low_thresh', 0):.3f} dentro de máscara permissiva, via reconstrução morfológica - evita falsos isolados e mantém conectividade de fragmentos reais.<br/>
    • <b>SAVI:</b> exige SAVI&gt;{vegetation_result['stats'].get('savi_thresh', 0.2):.2f} para confirmar vegetação, reduzindo confusão com solo exposto.<br/>
    • <b>Água:</b> máscara NDVI&lt;0.08 e NIR&lt;0.15 removida.<br/>
    • <b>Morfologia com reconstrução:</b> opening disco 2, closing 3, remove_small_objects min {80} px (0.03% área), remove_small_holes 150px, closing 5 + opening 2, reconstrução para recuperar bordas.<br/>
    • <b>Filtro forma:</b> regionprops solidity&gt;0.25, eccentricity&lt;0.995, extent&gt;0.12, compactness&gt;0.02 - remove linhas finas (estradas/cercas) e ruído recortado.<br/>
    • <b>Refinamento gradiente RGB:</b> Sobel em grayscale, borda vegetação ajustada para coincidir com bordas reais: se gradiente forte &gt;0.45 e NDVI&lt;high remove, se gradiente fraco &lt;0.25 e NDVI&gt;low adiciona, com limite &lt;25% mudança área.<br/>
    Limiar base Otsu: <b>{vegetation_result['stats']['threshold']:.3f}</b>, SAVI médio veg: {vegetation_result['stats'].get('mean_savi_veg', 0):.3f}, desvio NDVI veg: {vegetation_result['stats'].get('std_veg', 0):.3f}.<br/><br/>
    <b>2.5 Vetorização Suavizada Anti-Quadriculado V2:</b> Marching squares sub-pixel, lon/lat, Chaikin 2 iterações (25%/75%), simplify 2.5e-6° (~0.25m) preserve_topology, buffer round 1.0e-5° (~1m) join_style=ROUND quad_segs=8, make_valid, unary_union, filtro 5e-9°² (~50m²). Prioriza fidelidade aos limites reais visíveis, evita polígonos quadrados.<br/><br/>
    <b>2.6 Cálculo de Áreas:</b> Web Mercator EPSG:3857 planimétrico + cos(lat) fallback, m² e ha por fragmento.<br/>
    """
    story.append(Paragraph(metodologia_text, normal_style))
    story.append(Spacer(1, 0.5*cm))

    # 3. Critérios e Confiabilidade
    story.append(Paragraph("3. CRITÉRIOS E CONFIABILIDADE - V2", heading_style))
    criteria_text = f"""
    <b>Data da Imagem:</b> {satellite_data['metadata']['date']} (mais recente baixa nebulosidade)<br/>
    <b>Resolução Espacial:</b> {satellite_data['metadata']['resolution']}<br/>
    <b>Fonte:</b> {satellite_data['metadata']['source']}<br/>
    <b>Critérios V2 Alta Precisão:</b><br/>
    • Hysteresis NDVI: low {vegetation_result['stats'].get('low_thresh', 0):.3f} / high {vegetation_result['stats'].get('high_thresh', 0):.3f} (base Otsu {vegetation_result['stats']['threshold']:.3f})<br/>
    • SAVI &gt; {vegetation_result['stats'].get('savi_thresh', 0.2):.2f} (médio veg {vegetation_result['stats'].get('mean_savi_veg', 0):.3f})<br/>
    • NDVI médio veg: {vegetation_result['stats']['mean_ndvi_veg']:.3f} ± {vegetation_result['stats'].get('std_veg', 0):.3f}<br/>
    • NDVI médio não-veg: {vegetation_result['stats']['mean_ndvi_non_veg']:.3f}<br/>
    • Separação espectral: {vegetation_result['stats']['separation']:.3f}<br/>
    • Água removida: NDVI&lt;0.08 &amp; NIR&lt;0.15<br/>
    • Morfologia: reconstrução + filtro forma (solidity&gt;0.25, eccentricity&lt;0.995, compactness&gt;0.02)<br/>
    • Refinamento borda: gradiente RGB Sobel, ajuste &lt;25% área<br/>
    • Validação: coerência espacial + textura dossel<br/><br/>
    <b>Nível de Confiabilidade:</b> {vegetation_result['stats']['confidence']}<br/>
    Baseado em separação espectral, desvio padrão baixo veg (&lt;0.12 alta confiança), SAVI alto, qualidade imagem nuvens {satellite_data['metadata']['cloud_cover']}, coerência espacial. NDVI&gt;0.6 + SAVI&gt;0.35 = vegetação densa alta confiança. Bordas com NDVI próximo low/high = confiança moderada.<br/><br/>
    <b>Melhorias V2 para Realismo:</b> Simulação V2 com fractais, domain warping, vegetação orgânica thresholded (não circular), clareiras, rios, 3 tipos solo, sombreamento topográfico. Classificação V2 reduz falsos positivos de solo exposto, cultura, água, estradas via SAVI + filtro forma + gradiente RGB. Geometria final segue bordas reais visíveis na imagem, não apenas pixel.<br/><br/>
    <b>Limitações:</b> Mesmo V2 pode confundir cultura densa (soja, milho) com nativa; para CAR/licenciamento validar campo e usar série temporal Sentinel-2 + CBERS/Planet. Em produção, usar cena real L2A, não simulação.<br/>
    """
    story.append(Paragraph(criteria_text, normal_style))
    story.append(Spacer(1, 0.5*cm))

    # 4. Imagens
    story.append(Paragraph("4. RESULTADOS VISUAIS", heading_style))
    story.append(Paragraph("4.1 Imagem de Satélite (RGB - Simulação Sentinel-2)", small_style))

    # Add images if exist
    def add_image_to_story(image_path, width=14*cm, caption=""):
        if os.path.exists(image_path):
            try:
                img = RLImage(image_path, width=width, height=width*0.8)  # approximate
                # Preserve aspect ratio
                from PIL import Image as PILImage
                pil = PILImage.open(image_path)
                w, h = pil.size
                aspect = h / w
                img.drawHeight = width * aspect
                img.drawWidth = width
                story.append(img)
                if caption:
                    story.append(Paragraph(f"<i>{caption}</i>", small_style))
                story.append(Spacer(1, 0.3*cm))
                return True
            except Exception as e:
                print(f"Failed to add image {image_path}: {e}")
                story.append(Paragraph(f"[Imagem não disponível: {os.path.basename(image_path)}]", small_style))
                return False
        else:
            story.append(Paragraph(f"[Imagem não encontrada: {image_path}]", small_style))
            return False

    rgb_path = satellite_data['rgb_path']
    ndvi_path = satellite_data['ndvi_vis_path']
    overlay_path = os.path.join(job_dir, "mapa_final_overlay.png")
    veg_overlay_path = os.path.join(job_dir, "vegetation_overlay.png")

    add_image_to_story(rgb_path, caption=f"Imagem RGB simulada Sentinel-2 L2A - Data: {satellite_data['metadata']['date']} - Resolução: 10m - Tile: {satellite_data['metadata']['tile']}")

    story.append(Paragraph("4.2 Mapa NDVI (Índice de Vegetação)", small_style))
    add_image_to_story(ndvi_path, caption="Visualização NDVI - Tons verdes indicam maior vigor vegetativo (NDVI alto)")

    story.append(Paragraph("4.3 Vegetação Detectada sobreposta à imagem", small_style))
    if os.path.exists(veg_overlay_path):
        add_image_to_story(veg_overlay_path, caption="Overlay de vegetação nativa detectada (verde) sobre imagem RGB")
    else:
        add_image_to_story(rgb_path, caption="Overlay não disponível, exibindo RGB")

    story.append(PageBreak())

    story.append(Paragraph("4.4 Mapa Final - Perímetro e Vegetação", heading_style))
    if os.path.exists(overlay_path):
        add_image_to_story(overlay_path, width=16*cm, caption="Mapa final sobrepondo perímetro original (vermelho) e vegetação nativa detectada (verde). A geometria final foi suavizada para acompanhar limites reais, evitando aspecto quadriculado.")
    else:
        story.append(Paragraph("Mapa final não disponível.", small_style))

    story.append(Spacer(1, 0.5*cm))

    # 5. Tabela de fragmentos
    story.append(Paragraph("5. DETALHAMENTO DOS FRAGMENTOS", heading_style))
    frag_data = [["ID", "Área (m²)", "Área (ha)", "Classe"]]
    for idx, poly in enumerate(vegetation_result['vegetation_polygons'][:20]):  # limit to 20 for PDF
        # Compute area
        def lonlat_to_merc(lon, lat):
            x = lon * 20026376.39 / 180.0
            lat = max(min(lat, 85.05112878), -85.05112878)
            y = math.log(math.tan((90 + lat) * math.pi / 360.0)) / (math.pi / 180.0)
            y = y * 20026376.39 / 180.0
            return x, y
        try:
            merc_coords = [lonlat_to_merc(lon, lat) for lon, lat in poly.exterior.coords]
            from shapely.geometry import Polygon as ShapelyPolygon
            merc_poly = ShapelyPolygon(merc_coords)
            area_m2 = merc_poly.area
            for interior in poly.interiors:
                hole_merc = [lonlat_to_merc(lon, lat) for lon, lat in interior.coords]
                hole_poly = ShapelyPolygon(hole_merc)
                area_m2 -= hole_poly.area
            area_m2 = abs(area_m2)
        except Exception:
            area_m2 = poly.area * 111000 * 111000
        frag_data.append([str(idx+1), f"{area_m2:.2f}", f"{area_m2/10000:.4f}", "Vegetação Nativa"])

    if len(vegetation_result['vegetation_polygons']) > 20:
        frag_data.append(["...", "...", "...", f"+ {len(vegetation_result['vegetation_polygons'])-20} fragmentos adicionais"])

    frag_table = Table(frag_data, colWidths=[2*cm, 4*cm, 4*cm, 5*cm])
    frag_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), HexColor('#2d6a2d')),
        ('TEXTCOLOR', (0,0), (-1,0), colors.white),
        ('ALIGN', (0,0), (-1,-1), 'CENTER'),
        ('FONTNAME', (0,0), (-1,0), 'Helvetica-Bold'),
        ('FONTSIZE', (0,0), (-1,0), 10),
        ('BOTTOMPADDING', (0,0), (-1,0), 10),
        ('GRID', (0,0), (-1,-1), 0.5, colors.grey),
        ('FONTNAME', (0,1), (-1,-1), 'Helvetica'),
        ('FONTSIZE', (0,1), (-1,-1), 8),
        ('ROWBACKGROUNDS', (0,1), (-1,-1), [colors.white, HexColor('#f0f7f0')])
    ]))
    story.append(frag_table)
    story.append(Spacer(1, 0.5*cm))

    # 6. Conclusões e recomendações
    story.append(Paragraph("6. CONCLUSÃO E RECOMENDAÇÕES", heading_style))
    conclusao = f"""
    Foi identificada área de vegetação nativa totalizando <b>{veg_ha:.4f} ha ({veg_m2:,.2f} m²)</b>, correspondente a <b>{perc:.2f}%</b> da área total do perímetro analisado ({total_ha:.4f} ha).<br/><br/>
    A classificação apresentou confiabilidade <b>{vegetation_result['stats']['confidence']}</b>, com base na separação espectral NDVI e qualidade da imagem.<br/><br/>
    Recomendações:<br/>
    • Validar em campo os limites detectados, especialmente bordas com NDVI próximo ao limiar ({vegetation_result['stats']['threshold']:.3f});<br/>
    • Para fins de CAR ou licenciamento ambiental, complementar com imagens de maior resolução (ex: Planet 3m, CBERS-4A 2m) e vistoria;<br/>
    • Monitorar temporalmente usando série Sentinel-2 para avaliar dinâmica de regeneração/supressão;<br/>
    • Em ambiente de produção, o sistema buscará automaticamente cenas reais Sentinel-2 via Copernicus Data Space Ecosystem, garantindo rastreabilidade e atualidade.<br/><br/>
    <b>Nota Técnica:</b> Este laudo foi gerado por sistema automatizado com simulação realista de imagem Sentinel-2 para demonstração offline. 
    A metodologia (NDVI, Otsu, morfologia, vetorização suavizada com Chaikin + buffer) reproduz fielmente o fluxo de produção, 
    priorizando precisão espacial e fidelidade aos limites reais da vegetação, evitando polígonos excessivamente simplificados ou com bordas quadradas.<br/>
    """
    story.append(Paragraph(conclusao, normal_style))

    story.append(Spacer(1, 1*cm))
    story.append(Paragraph(f"Responsável Técnico: Sistema Automatizado de Análise de Vegetação<br/>Data do Laudo: {datetime.now().strftime('%d/%m/%Y')}<br/>Versão: 1.0 - Sentinel-2 + NDVI + Vetorização Suavizada", small_style))

    # Build PDF
    doc.build(story)

    return pdf_path

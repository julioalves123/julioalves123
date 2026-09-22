import xml.etree.ElementTree as ET
from shapely.geometry import Polygon, MultiPolygon, mapping, shape
from shapely.ops import unary_union
import math
import re

KML_NS = {'kml': 'http://www.opengis.net/kml/2.2'}

def _parse_coordinates(coord_text):
    """Parse KML coordinates string into list of (lon, lat) tuples."""
    coords = []
    # Clean and split
    coord_text = coord_text.strip()
    # Split by whitespace or newline
    parts = re.split(r'\s+', coord_text)
    for part in parts:
        if not part:
            continue
        vals = part.split(',')
        if len(vals) >= 2:
            try:
                lon = float(vals[0])
                lat = float(vals[1])
                coords.append((lon, lat))
            except ValueError:
                continue
    return coords

def parse_kml_content(kml_content: str):
    """
    Parse KML content and extract polygons.
    Returns dict with polygons, geojson, bbox, area, etc.
    """
    # Try to handle KML without namespace as well
    try:
        root = ET.fromstring(kml_content.encode('utf-8') if isinstance(kml_content, str) else kml_content)
    except Exception as e:
        raise ValueError(f"Erro ao ler KML: {e}")

    # Find all coordinates in Placemark -> Polygon -> outerBoundaryIs
    # Use iterative search without namespace first, then with
    polygons = []

    # Method 1: try with namespace
    # Search for all Polygon elements
    def find_polygons_ns():
        polys = []
        for polygon_elem in root.findall('.//kml:Polygon', KML_NS):
            outer = polygon_elem.find('.//kml:outerBoundaryIs/kml:LinearRing/kml:coordinates', KML_NS)
            if outer is not None and outer.text:
                coords = _parse_coordinates(outer.text)
                if len(coords) >= 3:
                    # Ensure closed
                    if coords[0] != coords[-1]:
                        coords.append(coords[0])
                    try:
                        poly = Polygon(coords)
                        if not poly.is_valid:
                            poly = poly.buffer(0)
                        if poly.is_valid and poly.area > 0:
                            polys.append(poly)
                    except Exception:
                        continue
            # Check inner boundaries (holes)
            # For simplicity, holes will be handled if we parse them
            # inner boundaries
            inners = polygon_elem.findall('.//kml:innerBoundaryIs/kml:LinearRing/kml:coordinates', KML_NS)
            # If we have inners, we need to reconstruct polygon with holes
            # Our current approach already created poly without holes; let's try better parsing for holes
            # Re-parse with holes
            if outer is not None and outer.text and inners:
                try:
                    outer_coords = _parse_coordinates(outer.text)
                    holes = []
                    for inner_elem in inners:
                        if inner_elem.text:
                            hole_coords = _parse_coordinates(inner_elem.text)
                            if len(hole_coords) >= 3:
                                holes.append(hole_coords)
                    if outer_coords:
                        if outer_coords[0] != outer_coords[-1]:
                            outer_coords.append(outer_coords[0])
                        poly_with_holes = Polygon(outer_coords, holes)
                        if not poly_with_holes.is_valid:
                            poly_with_holes = poly_with_holes.buffer(0)
                        if poly_with_holes.is_valid and poly_with_holes.area > 0:
                            # Replace last added if exists
                            if polys:
                                polys[-1] = poly_with_holes
                            else:
                                polys.append(poly_with_holes)
                except Exception:
                    pass
        return polys

    def find_polygons_no_ns():
        polys = []
        # Search without namespace
        for polygon_elem in root.iter():
            if polygon_elem.tag.endswith('Polygon'):
                # Find outerBoundary
                outer = None
                inners = []
                for child in polygon_elem.iter():
                    if child.tag.endswith('outerBoundaryIs'):
                        for sub in child.iter():
                            if sub.tag.endswith('coordinates') and sub.text:
                                outer = sub.text
                    if child.tag.endswith('innerBoundaryIs'):
                        for sub in child.iter():
                            if sub.tag.endswith('coordinates') and sub.text:
                                inners.append(sub.text)
                if outer:
                    outer_coords = _parse_coordinates(outer)
                    holes = []
                    for inner_text in inners:
                        hole_coords = _parse_coordinates(inner_text)
                        if len(hole_coords) >= 3:
                            holes.append(hole_coords)
                    if len(outer_coords) >= 3:
                        if outer_coords[0] != outer_coords[-1]:
                            outer_coords.append(outer_coords[0])
                        try:
                            if holes:
                                poly = Polygon(outer_coords, holes)
                            else:
                                poly = Polygon(outer_coords)
                            if not poly.is_valid:
                                poly = poly.buffer(0)
                            if poly.is_valid and poly.area > 0:
                                polys.append(poly)
                        except Exception:
                            continue
        return polys

    polygons = find_polygons_ns()
    if not polygons:
        polygons = find_polygons_no_ns()

    # Also try MultiGeometry and Placemark with LineString that could be polygon?
    # If still no polygons, try to find any coordinates that form a closed ring in Placemarks
    if not polygons:
        # Fallback: search all coordinates tags under Placemark
        for placemark in root.findall('.//kml:Placemark', KML_NS):
            coord_elem = placemark.find('.//kml:coordinates', KML_NS)
            if coord_elem is not None and coord_elem.text:
                coords = _parse_coordinates(coord_elem.text)
                if len(coords) >= 3:
                    if coords[0] != coords[-1]:
                        coords.append(coords[0])
                    try:
                        poly = Polygon(coords)
                        if not poly.is_valid:
                            poly = poly.buffer(0)
                        if poly.is_valid and poly.area > 0:
                            polygons.append(poly)
                    except Exception:
                        continue
        if not polygons:
            # No NS fallback
            for elem in root.iter():
                if elem.tag.endswith('Placemark'):
                    for sub in elem.iter():
                        if sub.tag.endswith('coordinates') and sub.text:
                            coords = _parse_coordinates(sub.text)
                            if len(coords) >= 4:  # need closed
                                if coords[0] != coords[-1]:
                                    coords.append(coords[0])
                                try:
                                    poly = Polygon(coords)
                                    if not poly.is_valid:
                                        poly = poly.buffer(0)
                                    if poly.is_valid and poly.area > 0:
                                        polygons.append(poly)
                                except Exception:
                                    continue

    if not polygons:
        raise ValueError("Nenhum polígono válido encontrado no KML. Verifique se o arquivo contém um perímetro em formato Polygon.")

    # Merge if multiple polygons overlapping? Keep as MultiPolygon but also compute union for area
    # For processing we need a single merged perimeter or multiple? We'll union for bbox and area, but keep original list
    try:
        union_poly = unary_union(polygons)
    except Exception:
        union_poly = polygons[0]

    # Ensure union is Polygon or MultiPolygon
    if isinstance(union_poly, Polygon):
        merged_polygons = [union_poly]
        bbox_poly = union_poly
    elif isinstance(union_poly, MultiPolygon):
        merged_polygons = list(union_poly.geoms)
        bbox_poly = union_poly
    else:
        merged_polygons = polygons
        bbox_poly = union_poly

    # Compute bbox
    minx, miny, maxx, maxy = bbox_poly.bounds  # lon, lat

    # Compute area in m2 approximated via Web Mercator projection
    # Convert lon/lat to EPSG:3857 approx
    def lonlat_to_merc(lon, lat):
        # Web Mercator
        x = lon * 20026376.39 / 180.0
        # Clamp lat
        lat = max(min(lat, 85.05112878), -85.05112878)
        y = math.log(math.tan((90 + lat) * math.pi / 360.0)) / (math.pi / 180.0)
        y = y * 20026376.39 / 180.0
        return x, y

    def polygon_area_m2(poly):
        # Transform exterior and interiors to mercator and compute area
        try:
            # exterior
            merc_coords = [lonlat_to_merc(lon, lat) for lon, lat in poly.exterior.coords]
            merc_poly = Polygon(merc_coords)
            area = merc_poly.area
            # subtract holes
            for interior in poly.interiors:
                hole_merc = [lonlat_to_merc(lon, lat) for lon, lat in interior.coords]
                hole_poly = Polygon(hole_merc)
                area -= hole_poly.area
            return abs(area)
        except Exception:
            # fallback using geodesic approximation: area in degrees * (111km)^2 * cos(lat)
            # Rough
            centroid_lat = poly.centroid.y
            # 1 degree lat ~ 111km, lon ~ 111km * cos(lat)
            lat_factor = 111000.0
            lon_factor = 111000.0 * math.cos(math.radians(centroid_lat))
            # Scale area from degrees to m2
            # poly.area is in degrees^2, so multiply by lat_factor*lon_factor
            return poly.area * lat_factor * lon_factor

    total_area_m2 = 0
    for poly in merged_polygons:
        total_area_m2 += polygon_area_m2(poly)

    # Centroid
    centroid = bbox_poly.centroid
    centroid_lon, centroid_lat = centroid.x, centroid.y

    # GeoJSON for frontend
    geojson_features = []
    for poly in merged_polygons:
        geojson_features.append({
            "type": "Feature",
            "properties": {"type": "perimetro"},
            "geometry": mapping(poly)
        })

    geojson = {
        "type": "FeatureCollection",
        "features": geojson_features
    }

    return {
        "polygons": merged_polygons,  # list of shapely Polygons
        "union": bbox_poly,
        "geojson": geojson,
        "bbox": (minx, miny, maxx, maxy),  # (min_lon, min_lat, max_lon, max_lat)
        "centroid": (centroid_lon, centroid_lat),
        "area_m2": total_area_m2,
        "area_ha": total_area_m2 / 10000.0,
        "num_polygons": len(merged_polygons)
    }

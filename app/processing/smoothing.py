import numpy as np
from shapely.geometry import Polygon, LinearRing, mapping
from shapely.ops import unary_union
import math

def chaikin_smooth(coords, iterations=2):
    """
    Chaikin corner cutting algorithm for smoothing polygon.
    coords: list of (x,y) tuples, closed (first==last) or not.
    Returns smoothed coords.
    """
    if len(coords) < 3:
        return coords

    # Ensure not closed for processing (we'll handle closure)
    is_closed = coords[0] == coords[-1]
    if is_closed:
        coords = coords[:-1]

    for _ in range(iterations):
        new_coords = []
        n = len(coords)
        for i in range(n):
            p0 = np.array(coords[i])
            p1 = np.array(coords[(i+1) % n])
            # Chaikin: create two new points at 25% and 75%
            q = 0.75 * p0 + 0.25 * p1
            r = 0.25 * p0 + 0.75 * p1
            new_coords.append(tuple(q))
            new_coords.append(tuple(r))
        coords = new_coords

    # Close
    if coords and coords[0] != coords[-1]:
        coords.append(coords[0])
    return coords

def smooth_polygon(polygon, chaikin_iterations=2, simplify_tolerance=0.000005, buffer_distance=0.000015):
    """
    Smooth polygon to avoid pixelated appearance.
    Steps:
    - Chaikin smoothing
    - Simplify with low tolerance preserving topology
    - Buffer smoothing (positive then negative) to round corners
    - Make valid
    """
    if polygon.is_empty or not polygon.is_valid:
        try:
            polygon = polygon.buffer(0)
        except Exception:
            return polygon

    # For polygons with holes, smooth exterior and interiors separately
    try:
        exterior_coords = list(polygon.exterior.coords)
        smoothed_exterior = chaikin_smooth(exterior_coords, iterations=chaikin_iterations)

        smoothed_holes = []
        for interior in polygon.interiors:
            hole_coords = list(interior.coords)
            smoothed_hole = chaikin_smooth(hole_coords, iterations=chaikin_iterations)
            # Ensure hole is valid (at least 4 points)
            if len(smoothed_hole) >= 4:
                smoothed_holes.append(smoothed_hole)

        # Create new polygon
        if len(smoothed_exterior) >= 4:
            try:
                new_poly = Polygon(smoothed_exterior, smoothed_holes)
            except Exception:
                new_poly = Polygon(smoothed_exterior)
        else:
            new_poly = polygon

        # Simplify with very small tolerance to keep detail but remove collinear points
        # Tolerance in degrees: 0.00001 ~ 1.1m
        try:
            new_poly = new_poly.simplify(simplify_tolerance, preserve_topology=True)
        except Exception:
            pass

        # Buffer smoothing: small positive then negative to smooth jagged edges
        # This is key to avoid quadriculado
        if buffer_distance and buffer_distance > 0:
            try:
                # First buffer outward then inward, using join_style round
                # join_style=1 is round, 2 is mitre, 3 is bevel
                buffered = new_poly.buffer(buffer_distance, join_style=1, cap_style=1, quad_segs=8)
                smoothed = buffered.buffer(-buffer_distance*0.9, join_style=1, cap_style=1, quad_segs=8)
                # If smoothing made it invalid or empty, keep previous
                if not smoothed.is_empty and smoothed.is_valid and smoothed.area > new_poly.area * 0.5:
                    new_poly = smoothed
            except Exception:
                pass

        # Final make valid
        if not new_poly.is_valid:
            try:
                new_poly = new_poly.buffer(0)
            except Exception:
                pass

        # If resulting is MultiPolygon, take largest or keep as is
        if new_poly.geom_type == 'MultiPolygon':
            # Keep largest by area or all if reasonable
            # For vegetation we want to keep all, but this function is for single polygon
            # So return union or largest
            try:
                # If multiple, merge and keep
                new_poly = unary_union(new_poly)
                if new_poly.geom_type == 'MultiPolygon':
                    # Return largest
                    largest = max(new_poly.geoms, key=lambda p: p.area)
                    return largest
            except Exception:
                pass
            return new_poly

        return new_poly

    except Exception as e:
        # Fallback return original
        return polygon

def smooth_polygons(polygons, **kwargs):
    """Smooth list of polygons."""
    smoothed = []
    for poly in polygons:
        try:
            s = smooth_polygon(poly, **kwargs)
            if s and not s.is_empty and s.is_valid:
                # Filter very small polygons (less than ~ 50m2)
                # Area in degrees^2, rough filter later in m2
                if s.area > 1e-10:
                    smoothed.append(s)
        except Exception:
            continue
    return smoothed

def polygon_to_geojson_feature(polygon, properties=None):
    if properties is None:
        properties = {}
    return {
        "type": "Feature",
        "properties": properties,
        "geometry": mapping(polygon)
    }

/*
 * @namespace PolyUtil
 * Various utility functions for polygon geometries.
 */

L.PolyUtil = {};

/* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
 * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgeman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
 * Used by Leaflet to only show polygon points that are on the screen or near, increasing
 * performance. Note that polygon points needs different algorithm for clipping
 * than polyline, so there's a seperate method for it.
 */
L.PolyUtil.clipPolygon = function (points, bounds, round) {
	var clippedPoints,
	    edges = [1, 4, 2, 8],
	    i, j, k,
	    a, b,
	    len, edge, p,
	    lu = L.LineUtil;

	for (i = 0, len = points.length; i < len; i++) {
		points[i]._code = lu._getBitCode(points[i], bounds);
	}

	// for each edge (left, bottom, right, top)
	for (k = 0; k < 4; k++) {
		edge = edges[k];
		clippedPoints = [];

		for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
			a = points[i];
			b = points[j];

			// if a is inside the clip window
			if (!(a._code & edge)) {
				// if b is outside the clip window (a->b goes out of screen)
				if (b._code & edge) {
					p = lu._getEdgeIntersection(b, a, edge, bounds, round);
					p._code = lu._getBitCode(p, bounds);
					clippedPoints.push(p);
				}
				clippedPoints.push(a);

			// else if b is inside the clip window (a->b enters the screen)
			} else if (!(b._code & edge)) {
				p = lu._getEdgeIntersection(b, a, edge, bounds, round);
				p._code = lu._getBitCode(p, bounds);
				clippedPoints.push(p);
			}
		}
		points = clippedPoints;
	}

	return points;
};

/* @function ringContains(points: Point[], point: Point): Boolean
 * Returns `true` if `point` is inside the ring defined by `points`.
 * @alternative
 * @function ringContains(latlngs: LatLng[], latlng: LatLng, map: Map): Boolean
 * Returns `true` if the `map` projection of `latlng` is inside the ring defined by
 * projected `latlngs`.
 */
L.PolyUtil.ringContains = function (objs, obj, map) {
	var point, points;

	if (objs[0] instanceof L.Point && obj instanceof L.Point) {
		point = obj;
		points = objs;
	} else if (map && objs[0] instanceof L.LatLng && obj instanceof L.LatLng) {
		point = map.project(obj);
		points = [];
		for (var j = 0; j < objs.length; j++) {
			points.push(map.project(objs[j]));
		}
	} else {
		throw new Error('Incompatible input arguments.');
	}

	// Based on the winding number (http://geomalgorithms.com/a03-_inclusion.html)
	var wn = 0;

	for (var i = 0, len = points.length; i < len; ++i) {
		// through all ring edges (last edge linked back to the first node)
		var next = (i < len - 1) ? i + 1 : 0;
		if (points[i].y <= point.y) {
			if ((points[next].y > point.y) &&
					(L.LineUtil.pointToLineOrientation(point, points[i], points[next]) > 0)) {
				// upward crossing with point on the "left" of current ring edge
				++wn;
			}
		} else if ((points[next].y <= point.y) &&
							 (L.LineUtil.pointToLineOrientation(point, points[i], points[next]) < 0)) {
			// downward crossing with point on the "right" of current ring edge
			--wn;
		}
	}
	return (wn !== 0);
};

import * as LineUtil from './LineUtil.js';
import {LatLng} from '../geo/LatLng.js';
import {Point} from './Point.js';
/*
 * @namespace PolyUtil
 * Various utility functions for polygon geometries.
 */

/* @function clipPolygon(points: Point[], bounds: Bounds, round?: Boolean): Point[]
 * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgman algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)).
 * Used by Leaflet to only show polygon points that are on the screen or near, increasing
 * performance. Note that polygon points needs different algorithm for clipping
 * than polyline, so there's a separate method for it.
 */
export function clipPolygon(points, bounds, round) {
	let clippedPoints,
	i, j, k,
	a, b,
	len, edge, p;
	const edges = [1, 4, 2, 8];

	for (i = 0, len = points.length; i < len; i++) {
		points[i]._code = LineUtil._getBitCode(points[i], bounds);
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
					p = LineUtil._getEdgeIntersection(b, a, edge, bounds, round);
					p._code = LineUtil._getBitCode(p, bounds);
					clippedPoints.push(p);
				}
				clippedPoints.push(a);

			// else if b is inside the clip window (a->b enters the screen)
			} else if (!(b._code & edge)) {
				p = LineUtil._getEdgeIntersection(b, a, edge, bounds, round);
				p._code = LineUtil._getBitCode(p, bounds);
				clippedPoints.push(p);
			}
		}
		points = clippedPoints;
	}

	return points;
}

/* @function polygonCenter(latlngs: LatLng[], crs: CRS): LatLng
 * Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the passed LatLngs (first ring) from a polygon.
 */
export function polygonCenter(latlngs, crs) {
	// points relative to the first one, to avoid floating point errors on tiny polygons with large projected coordinates
	const points = LineUtil._projectRing(latlngs, crs),
	origin = points[0].clone(),
	len = points.length;

	for (const p of points) { p._subtract(origin); }

	let area = 0, x = 0, y = 0;

	// polygon centroid algorithm
	for (let i = 0, j = len - 1; i < len; j = i++) {
		const p1 = points[i],
		p2 = points[j],
		f = p1.y * p2.x - p2.y * p1.x;

		x += (p1.x + p2.x) * f;
		y += (p1.y + p2.y) * f;
		area += f;
	}

	// area is 0 when the polygon is so small that all points are on the same pixel
	return crs.unproject(area === 0 ? origin : new Point(x / (3 * area), y / (3 * area))._add(origin));
}

/* @function centroid(latlngs: LatLng[]): LatLng
 * Returns the 'center of mass' of the passed LatLngs.
 */
export function centroid(coords) {
	let latSum = 0;
	let lngSum = 0;
	let len = 0;
	for (const coord of coords) {
		const latlng = new LatLng(coord);
		latSum += latlng.lat;
		lngSum += latlng.lng;
		len++;
	}
	return new LatLng([latSum / len, lngSum / len]);
}

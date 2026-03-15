import * as LineUtil from './LineUtil.js';
import {LatLng} from '../geo/LatLng.js';
import {Point} from './Point.js';
import {LatLngBounds} from '../geo/LatLngBounds.js';
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
	let i, j, p1, p2, f, area, x, y, center;

	if (!latlngs || latlngs.length === 0) {
		throw new Error('latlngs not passed');
	}

	if (!LineUtil.isFlat(latlngs)) {
		console.warn('latlngs are not flat! Only the first ring will be used');
		latlngs = latlngs[0];
	}

	let centroidLatLng = new LatLng([0, 0]);

	const bounds = new LatLngBounds(latlngs);
	const areaBounds = bounds.getNorthWest().distanceTo(bounds.getSouthWest()) * bounds.getNorthEast().distanceTo(bounds.getNorthWest());
	// tests showed that below 1700 rounding errors are happening
	if (areaBounds < 1700) {
		// getting a inexact center, to move the latlngs near to [0, 0] to prevent rounding errors
		centroidLatLng = centroid(latlngs);
	}

	const len = latlngs.length;
	const points = [];
	for (i = 0; i < len; i++) {
		const latlng = new LatLng(latlngs[i]);
		points.push(crs.project(new LatLng([latlng.lat - centroidLatLng.lat, latlng.lng - centroidLatLng.lng])));
	}

	area = x = y = 0;

	// polygon centroid algorithm;
	for (i = 0, j = len - 1; i < len; j = i++) {
		p1 = points[i];
		p2 = points[j];

		f = p1.y * p2.x - p2.y * p1.x;
		x += (p1.x + p2.x) * f;
		y += (p1.y + p2.y) * f;
		area += f * 3;
	}

	if (area === 0) {
		// Polygon is so small that all points are on same pixel.
		center = points[0];
	} else {
		center = [x / area, y / area];
	}

	const latlngCenter = crs.unproject(new Point(center));
	return new LatLng([latlngCenter.lat + centroidLatLng.lat, latlngCenter.lng + centroidLatLng.lng]);
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

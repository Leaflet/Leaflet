// @ts-check
import * as LineUtil from './LineUtil.js';
import {LatLng} from '../geo/LatLng.js';
import {Point} from './Point.js';

/**
 * @import {Bounds} from './Bounds.js'
 * @import {CRS} from '../geo/crs/CRS.js'
 * @import {LatLngExpression} from '../types.js'
 */

/**
 * Various utility functions for polygon geometries.
 * @module PolyUtil
 */

/**
 * Clips the polygon geometry defined by the given `points` by the given bounds (using the [Sutherland-Hodgman
 * algorithm](https://en.wikipedia.org/wiki/Sutherland%E2%80%93Hodgman_algorithm)). Used by Leaflet to only
 * show polygon points that are on the screen or near, increasing performance. Note that polygon points needs
 * different algorithm for clipping than polyline, so there's a separate method for it.
 * @param {Point[]} points
 * @param {Bounds} bounds
 * @param {boolean} [round]
 * @returns {Point[]}
 */
export function clipPolygon(points, bounds, round) {
	// left, bottom, right, top
	for (const edge of [1, 4, 2, 8]) {
		if (!points.length) { break; }

		/** @type {Point[]} */
		const clippedPoints = [];
		let b = points[points.length - 1],
		bOut = _isOutside(b, edge, bounds);

		for (const a of points) {
			const aOut = _isOutside(a, edge, bounds);
			// a->b crosses the edge
			if (aOut !== bOut) {
				clippedPoints.push(LineUtil._getEdgeIntersection(b, a, edge, bounds, round));
			}
			if (!aOut) {
				clippedPoints.push(a);
			}
			b = a;
			bOut = aOut;
		}
		points = clippedPoints;
	}

	return points;
}

/**
 * Whether the point is outside the given edge of the bounds; the edge is a `LineUtil` clipping bit code.
 * @param {Point} p
 * @param {number} edge
 * @param {Bounds} bounds
 */
function _isOutside(p, edge, bounds) {
	return edge === 1 ? p.x < bounds.min.x :
		edge === 2 ? p.x > bounds.max.x :
		edge === 4 ? p.y < bounds.min.y : p.y > bounds.max.y;
}

/**
 * Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid))
 * of the passed LatLngs (first ring) from a polygon.
 * @param {LatLngExpression[]} latlngs
 * @param {typeof CRS} crs
 * @returns {LatLng}
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

/**
 * Returns the 'center of mass' of the passed LatLngs.
 * @param {LatLngExpression[]} coords
 * @returns {LatLng}
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

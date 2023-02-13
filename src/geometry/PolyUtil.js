import * as LineUtil from './LineUtil';
import {toLatLng} from '../geo/LatLng';
import {toPoint} from './Point';
import {toLatLngBounds} from '../geo/LatLngBounds';
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
	var clippedPoints,
	    edges = [1, 4, 2, 8],
	    i, j, k,
	    a, b,
	    len, edge, p;

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
	var i, j, p1, p2, f, area, x, y, center;

	if (!latlngs || latlngs.length === 0) {
		throw new Error('latlngs not passed');
	}

	if (!LineUtil.isFlat(latlngs)) {
		console.warn('latlngs are not flat! Only the first ring will be used');
		latlngs = latlngs[0];
	}

	var centroidLatLng = toLatLng([0, 0]);

	var bounds = toLatLngBounds(latlngs);
	var areaBounds = bounds.getNorthWest().distanceTo(bounds.getSouthWest()) * bounds.getNorthEast().distanceTo(bounds.getNorthWest());
	// tests showed that below 1700 rounding errors are happening
	if (areaBounds < 1700) {
		// getting a inexact center, to move the latlngs near to [0, 0] to prevent rounding errors
		centroidLatLng = centroid(latlngs);
	}

	var len = latlngs.length;
	var points = [];
	for (i = 0; i < len; i++) {
		var latlng = toLatLng(latlngs[i]);
		points.push(crs.project(toLatLng([latlng.lat - centroidLatLng.lat, latlng.lng - centroidLatLng.lng])));
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

	var latlngCenter = crs.unproject(toPoint(center));
	return toLatLng([latlngCenter.lat + centroidLatLng.lat, latlngCenter.lng + centroidLatLng.lng]);
}

/* @function centroid(latlngs: LatLng[]): LatLng
 * Returns the 'center of mass' of the passed LatLngs.
 */
export function centroid(coords) {
	var latSum = 0;
	var lngSum = 0;
	var len = 0;
	for (var i = 0; i < coords.length; i++) {
		var latlng = toLatLng(coords[i]);
		latSum += latlng.lat;
		lngSum += latlng.lng;
		len++;
	}
	return toLatLng([latSum / len, lngSum / len]);
}

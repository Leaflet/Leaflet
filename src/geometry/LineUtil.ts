import {Point} from './Point';
import {PointReturnImpl} from './PointReturnImpl';
import * as Util from '../core/Util';
import {LatLng} from "../geo";
import {Object , ReturnType} from "typescript";// no List no ArrayList no Serializable

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type LatLngReturnType = ReturnType<typeof LatLng>;
type PointReturnImplType = ReturnType<typeof PointReturnImpl>;
type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;


/*
 * @namespace LineUtil
 *
 * constious utility functions for polyline points processing, used by Leaflet internally to make polylines lightning-fast.
 */

// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
// Improves rendering performance dramatically by lessening the number of points to draw.

// @function simplify(points: Point[], tolerance: Number): Point[]
// Dramatically reduces the number of points in a polyline while retaining
// its shape and returns a new array of simplified points, using the
// [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
// Used for a huge performance boost when processing/displaying Leaflet polylines for
// each zoom level and also reducing visual noise. tolerance affects the amount of
// simplification (lesser value means higher quality but slower and with more points).
// Also released as a separated micro-library [Simplify.tsc](http://mourner.github.com/simplify-js/).
export function simplify(points:PointReturnImplType[], tolerance:NumberReturnType):PointReturnImplType[] {

	if (!tolerance || !points.length) {
		return points.slice();
	}

	const sqTolerance = tolerance * tolerance;

	    // stage 1: vertex reduction
	    points = _reducePoints(points, sqTolerance);

	    // stage 2: Douglas-Peucker simplification
	    points = _simplifyDP(points, sqTolerance);

	return points;
}

// @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
// Returns the distance between point `p` and segment `p1` to `p2`.
export function pointToSegmentDistance(p:PointReturnImpl, p1:PointReturnImpl, p2:PointReturnImpl): NumberReturnType {
	return Math.sqrt(_sqClosestPointOnSegment(p, p1, p2, true));
}

// @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
// Returns the closest point from a point `p` on a segment `p1` to `p2`.
export function closestPointOnSegment(p:PointReturnImpl, p1:PointReturnImpl, p2:PointReturnImpl):NumberReturnType {
	return _sqClosestPointOnSegment(p, p1, p2);
}

// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
function _simplifyDP(points:PointReturnImpl[], sqTolerance:NumberReturnType):[] {

	const len = points.length;
	const ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array;
	const markers = new ArrayConstructor(len);

	markers[0] = markers[len - 1] = 1;

	_simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

	// const i;
	const newPoints = [];

	for (const i in markers[i]) {
		if (markers[i]) {
			newPoints.push(points[i]);
		}
	}

	return newPoints;
}

function _simplifyDPStep(points:PointReturnImpl[], markers, sqTolerance:NumberReturnType, first, last):void {

	const maxSqDist = 0;
	const index;
	// const i;
	const sqDist;

	// for loop diferentiation map test fail
	// sqDist = _sqClosestPointOnSegment(points.map(points[first],first+1, points[last]), true);

	for (const i = first + 1; i <= last - 1; i++) {
		sqDist = _sqClosestPointOnSegment(points[i], points[first], points[last], true);

		if (sqDist > maxSqDist) {
			index = i;
			maxSqDist = sqDist;
		}
	}

	if (maxSqDist > sqTolerance) {
		markers[index] = 1;

		_simplifyDPStep(points, markers, sqTolerance, first, index);
		_simplifyDPStep(points, markers, sqTolerance, index, last);
	}
}

// reduce points that are too close to each other to a single point
function _reducePoints(points, sqTolerance) {
	const reducedPoints = [points[0]];

	for (const i = 1, prev = 0, len = points.length; i < len; i++) {
		if (_sqDist(points[i], points[prev]) > sqTolerance) {
			reducedPoints.push(points[i]);
			prev = i;
		}
	}
	if (prev < len - 1) {
		reducedPoints.push(points[len - 1]);
	}
	return reducedPoints;
}

const _lastCode;

// @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
// Clips the segment a to b by rectangular bounds with the
// [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
// (modifying the segment points directly!). Used by Leaflet to only show polyline
// points that are on the screen or near, increasing performance.
export function clipSegment(a, b, bounds, useLastCode, round) {
	const codeA = useLastCode ? _lastCode : _getBitCode(a, bounds),
	    codeB = _getBitCode(b, bounds),

	    codeOut, p, newCode;

	    // save 2nd code to avoid calculating it on the next segment
	    _lastCode = codeB;

	while (true) {
		// if a,b is inside the clip window (trivial accept)
		if (!(codeA | codeB)) {
			return [a, b];
		}

		// if a,b is outside the clip window (trivial reject)
		if (codeA & codeB) {
			return false;
		}

		// other cases
		codeOut = codeA || codeB;
		p = _getEdgeIntersection(a, b, codeOut, bounds, round);
		newCode = _getBitCode(p, bounds);

		if (codeOut === codeA) {
			a = p;
			codeA = newCode;
		} else {
			b = p;
			codeB = newCode;
		}
	}
}

export function _getEdgeIntersection(a, b, code, bounds, round) {
	const dx = b.x - a.x,
	    dy = b.y - a.y,
	    min = bounds.min,
	    max = bounds.max,
	    x, y;

	if (code & 8) { // top
		x = a.x + dx * (max.y - a.y) / dy;
		y = max.y;

	} else if (code & 4) { // bottom
		x = a.x + dx * (min.y - a.y) / dy;
		y = min.y;

	} else if (code & 2) { // right
		x = max.x;
		y = a.y + dy * (max.x - a.x) / dx;

	} else if (code & 1) { // left
		x = min.x;
		y = a.y + dy * (min.x - a.x) / dx;
	}

	return new Point(x, y, round);
}

export function _getBitCode(p, bounds) {
	const code = 0;

	if (p.x < bounds.min.x) { // left
		code |= 1;
	} else if (p.x > bounds.max.x) { // right
		code |= 2;
	}

	if (p.y < bounds.min.y) { // bottom
		code |= 4;
	} else if (p.y > bounds.max.y) { // top
		code |= 8;
	}

	return code;
}

// square distance (to avoid unnecessary Math.sqrt calls)
function _sqDist(p1, p2) {
	const dx = p2.x - p1.x,
	    dy = p2.y - p1.y;
	return dx * dx + dy * dy;
}

// return closest point on segment or distance to that point
export function _sqClosestPointOnSegment(p:PointReturnImpl, p1:PointReturnImpl, p2:PointReturnImpl, sqDist:NumberReturnType):PointReturnImpl {
	const x:NumberReturnType = p1.x;
	const y:NumberReturnType = p1.y;
	const dx:NumberReturnType = p2.x - x;
	const dy:NumberReturnType = p2.y - y;
	const dot:NumberReturnType = dx * dx + dy * dy;
	const t:NumberReturnType;

	if (dot > 0) {
		t = ((p.x - x) * dx + (p.y - y) * dy) / dot;

		if (t > 1) {
			x = p2.x;
			y = p2.y;
		} else if (t > 0) {
			x += dx * t;
			y += dy * t;
		}
	}

	dx = p.x - x;
	dy = p.y - y;

	return sqDist ? dx * dx + dy * dy : new Point(x, y);
}


// @function isFlat(latlngs: LatLng[]): Boolean
// Returns true if `latlngs` is a flat array, false is nested.
export function isFlat(latlngs:LatLngReturnType[] | LatLngReturnType[][]): boolean {
	return !Util.isArray(latlngs[0]) || (typeof latlngs[0][0] !== 'object' && typeof latlngs[0][0] !== 'undefined');
}

export function _flat(latlngs:LatLngReturnType):boolean {
	console.warn('Deprecated use of _flat, please use L.LineUtil.isFlat instead.');
	return isFlat(latlngs);
}

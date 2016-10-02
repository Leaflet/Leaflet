/*
 * @namespace LineUtil
 *
 * Various utility functions for polyine points processing, used by Leaflet internally to make polylines lightning-fast.
 */

L.LineUtil = {

	// Simplify polyline with vertex reduction and Douglas-Peucker simplification.
	// Improves rendering performance dramatically by lessening the number of points to draw.

	// @function simplify(points: Point[], tolerance: Number): Point[]
	// Dramatically reduces the number of points in a polyline while retaining
	// its shape and returns a new array of simplified points, using the
	// [Douglas-Peucker algorithm](http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm).
	// Used for a huge performance boost when processing/displaying Leaflet polylines for
	// each zoom level and also reducing visual noise. tolerance affects the amount of
	// simplification (lesser value means higher quality but slower and with more points).
	// Also released as a separated micro-library [Simplify.js](http://mourner.github.com/simplify-js/).
	simplify: function (points, tolerance) {
		if (!tolerance || !points.length) {
			return points.slice();
		}

		var sqTolerance = tolerance * tolerance;

		// stage 1: vertex reduction
		points = this._reducePoints(points, sqTolerance);

		// stage 2: Douglas-Peucker simplification
		points = this._simplifyDP(points, sqTolerance);

		return points;
	},

	// @function pointToSegmentDistance(p: Point, p1: Point, p2: Point): Number
	// Returns the distance between point `p` and segment `p1` to `p2`.
	pointToSegmentDistance:  function (p, p1, p2) {
		return Math.sqrt(this._sqClosestPointOnSegment(p, p1, p2, true));
	},

	// @function closestPointOnSegment(p: Point, p1: Point, p2: Point): Number
	// Returns the closest point from a point `p` on a segment `p1` to `p2`.
	closestPointOnSegment: function (p, p1, p2) {
		return this._sqClosestPointOnSegment(p, p1, p2);
	},

	// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
	_simplifyDP: function (points, sqTolerance) {

		var len = points.length,
		    ArrayConstructor = typeof Uint8Array !== undefined + '' ? Uint8Array : Array,
		    markers = new ArrayConstructor(len);

		markers[0] = markers[len - 1] = 1;

		this._simplifyDPStep(points, markers, sqTolerance, 0, len - 1);

		var i,
		    newPoints = [];

		for (i = 0; i < len; i++) {
			if (markers[i]) {
				newPoints.push(points[i]);
			}
		}

		return newPoints;
	},

	_simplifyDPStep: function (points, markers, sqTolerance, first, last) {

		var maxSqDist = 0,
		    index, i, sqDist;

		for (i = first + 1; i <= last - 1; i++) {
			sqDist = this._sqClosestPointOnSegment(points[i], points[first], points[last], true);

			if (sqDist > maxSqDist) {
				index = i;
				maxSqDist = sqDist;
			}
		}

		if (maxSqDist > sqTolerance) {
			markers[index] = 1;

			this._simplifyDPStep(points, markers, sqTolerance, first, index);
			this._simplifyDPStep(points, markers, sqTolerance, index, last);
		}
	},

	// reduce points that are too close to each other to a single point
	_reducePoints: function (points, sqTolerance) {
		var reducedPoints = [points[0]];

		for (var i = 1, prev = 0, len = points.length; i < len; i++) {
			if (this._sqDist(points[i], points[prev]) > sqTolerance) {
				reducedPoints.push(points[i]);
				prev = i;
			}
		}
		if (prev < len - 1) {
			reducedPoints.push(points[len - 1]);
		}
		return reducedPoints;
	},


	// @function clipSegment(a: Point, b: Point, bounds: Bounds, useLastCode?: Boolean, round?: Boolean): Point[]|Boolean
	// Clips the segment a to b by rectangular bounds with the
	// [Cohen-Sutherland algorithm](https://en.wikipedia.org/wiki/Cohen%E2%80%93Sutherland_algorithm)
	// (modifying the segment points directly!). Used by Leaflet to only show polyline
	// points that are on the screen or near, increasing performance.
	clipSegment: function (a, b, bounds, useLastCode, round) {
		var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
		    codeB = this._getBitCode(b, bounds),

		    codeOut, p, newCode;

		// save 2nd code to avoid calculating it on the next segment
		this._lastCode = codeB;

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
			p = this._getEdgeIntersection(a, b, codeOut, bounds, round);
			newCode = this._getBitCode(p, bounds);

			if (codeOut === codeA) {
				a = p;
				codeA = newCode;
			} else {
				b = p;
				codeB = newCode;
			}
		}
	},

	_getEdgeIntersection: function (a, b, code, bounds, round) {
		var dx = b.x - a.x,
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

		return new L.Point(x, y, round);
	},

	_getBitCode: function (p, bounds) {
		var code = 0;

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
	},

	// square distance (to avoid unnecessary Math.sqrt calls)
	_sqDist: function (p1, p2) {
		var dx = p2.x - p1.x,
		    dy = p2.y - p1.y;
		return dx * dx + dy * dy;
	},

	// return closest point on segment or distance to that point
	_sqClosestPointOnSegment: function (p, p1, p2, sqDist) {
		var x = p1.x,
		    y = p1.y,
		    dx = p2.x - x,
		    dy = p2.y - y,
		    dot = dx * dx + dy * dy,
		    t;

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

		return sqDist ? dx * dx + dy * dy : new L.Point(x, y);
	}
};

/*
 * L.LineUtil contains different utility functions for line segments 
 * and polylines (clipping, simplification, distances, etc.)
 */

L.LineUtil = {
	/*
	 * Simplify polyline with vertex reduction and Douglas-Peucker simplification.
	 * Improves rendering performance dramatically by lessening the number of points to draw.
	 */
	simplify: function(/*Point[]*/ points, /*Number*/ tolerance) {
		if (!tolerance) return points.slice();
		
		// stage 1: vertex reduction
		points = this.reducePoints(points, tolerance);
		
		// stage 2: Douglas-Peucker simplification
		points = this.simplifyDP(points, tolerance);
		
		return points; 
	},
	
	// distance from a point to a segment between two points
	pointToSegmentDistance:  function(/*Point*/ p, /*Point*/ p1, /*Point*/ p2) {
		return Math.sqrt(this._sqPointToSegmentDist(p, p1, p2));	
	},
	
	// Douglas-Peucker simplification, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
	simplifyDP: function(points, tol) {
		var maxDist2 = 0,
			index = 0,
			t2 = tol * tol;

		for (var i = 1, len = points.length, dist2; i < len - 1; i++) {
			dist2 = this._sqPointToSegmentDist(points[i], points[0], points[len - 1]);
			if (dist2 > maxDist2) {
				index = i;
				maxDist2 = dist2;
			}
		}
		
		if (maxDist2 >= t2) {
			var part1 = points.slice(0, index),
				part2 = points.slice(index),
				simplifiedPart1 = this.simplifyDP(part1, tol).slice(0, len - 2),
				simplifiedPart2 = this.simplifyDP(part2, tol);
			
			return simplifiedPart1.concat(simplifiedPart2);
		} else {
			return [points[0], points[len - 1]];
		}
	},
	
	// reduce points that are too close to each other to a single point
	reducePoints: function(points, tol) {
		var reducedPoints = [points[0]],
			t2 = tol * tol;
		
		for (var i = 1, prev = 0, len = points.length; i < len; i++) {
			if (this._sqDist(points[i], points[prev]) < t2) continue;
			reducedPoints.push(points[i]);
			prev = i;
		}
		if (prev < len - 1) {
			reducedPoints.push(points[len - 1]);
		}
		return reducedPoints;
	},
	
	/*
	 * Cohen-Sutherland line clipping algorithm.
	 * Used to avoid rendering parts of a polyline that are not currently visible.
	 */
	clipSegment: function(a, b, bounds, useLastCode) {
		var min = bounds.min,
			max = bounds.max;
		
		var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
			codeB = this._getBitCode(b, bounds);
		
		// save 2nd code to avoid calculating it on the next segment
		this._lastCode = codeB;
		
		while (true) {
			// if a,b is inside the clip window (trivial accept)
			if (!(codeA | codeB)) {
				return [a, b];
			// if a,b is outside the clip window (trivial reject)
			} else if (codeA & codeB) {
				return false;
			// other cases
			} else {
				var codeOut = codeA || codeB,
					p = this._getEdgeIntersection(a, b, codeOut, bounds),
					newCode = this._getBitCode(p, bounds);
				
				if (codeOut == codeA) {
					a = p;
					codeA = newCode;
				} else {
					b = p;
					codeB = newCode;
				}
			}
		}
	},
	
	_getEdgeIntersection: function(a, b, code, bounds) {
		var dx = b.x - a.x,
			dy = b.y - a.y,
			min = bounds.min,
			max = bounds.max;
		
		if (code & 8) { // top
			return new L.Point(a.x + dx * (max.y - a.y) / dy, max.y);
		} else if (code & 4) { // bottom
			return new L.Point(a.x + dx * (min.y - a.y) / dy, min.y);
		} else if (code & 2){ // right
			return new L.Point(max.x, a.y + dy * (max.x - a.x) / dx);
		} else if (code & 1) { // left
			return new L.Point(min.x, a.y + dy * (min.x - a.x) / dx);
		}
	},
	
	_getBitCode: function(/*Point*/ p, bounds) {
		var code = 0;
		
		if (p.x < bounds.min.x) code |= 1; // left
		else if (p.x > bounds.max.x) code |= 2; // right
		if (p.y < bounds.min.y) code |= 4; // bottom
		else if (p.y > bounds.max.y) code |= 8; // top
		
		return code;
	},
	
	// square distance (to avoid unnecessary Math.sqrt calls)
	_sqDist: function(p1, p2) {
		var dx = p2.x - p1.x,
			dy = p2.y - p1.y;
		return dx * dx + dy * dy;
	},
	
	// square distance from point to a segment
	_sqPointToSegmentDist: function(p, p1, p2) {
		var x2 = p2.x - p1.x,
			y2 = p2.y - p1.y;
		
		if (!x2 && !y2) return this._sqDist(p, p1);
		
		var dot = (p.x - p1.x) * x2 + (p.y - p1.y) * y2,
			t = dot / this._sqDist(p1, p2);
		
		if (t < 0) return this._sqDist(p, p1);
		if (t > 1) return this._sqDist(p, p2);
		
		var proj = new L.Point(p1.x + x2 * t, p1.y + y2 * t);
		return this._sqDist(p, proj);
	}	
};
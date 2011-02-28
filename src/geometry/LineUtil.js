
L.LineUtil = {
	simplify: function(points, tolerance) {
		if (!tolerance) return points.slice();
		
		var t2 = tolerance * tolerance;
		
		// stage 1: vertex reduction
		points = this._reducePoints(points, t2);
		
		// stage 2: Douglas-Peucker simplification
		points = this._dpSimplify(points, t2);
		
		return points; 
	},
	
	pointToSegmentDistance:  function(p, p1, p2) {
		return Math.sqrt(this._sqPointToSegmentDist(p, p1, p2));
	},
	
	// Douglas-Peucker simplification algorithm, see http://en.wikipedia.org/wiki/Douglas-Peucker_algorithm
	_dpSimplify: function(points, t2) {
		var maxDist2 = 0,
			index = 0;

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
				simplifiedPart1 = this._dpSimplify(part1, t2).slice(0, len - 2),
				simplifiedPart2 = this._dpSimplify(part2, t2);
			
			return simplifiedPart1.concat(simplifiedPart2);
		} else {
			return [points[0], points[len - 1]];
		}
	},
	
	// reduce points that are too close to each other to a single point
	_reducePoints: function(points, t2) {
		var reducedPoints = [points[0]];
		
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
	
	_sqDist: function(p1, p2) {
		var dx = p2.x - p1.x,
			dy = p2.y - p1.y;
		return dx * dx + dy * dy;
	},
	
	_sqPointToSegmentDist: function(p, p1, p2) {
		var x2 = p2.x - p1.x,
			y2 = p2.y - p1.y,
			dot = (p.x - p1.x) * x2 + (p.y - p1.y) * y2,
			t = dot / this._sqDist(p1, p2);
		
		if (t < 0) return this._sqDist(p, p1);
		if (t > 1) return this._sqDist(p, p2);
		
		var proj = new L.Point(p1.x + x2 * t, p1.y + y2 * t);
		return this._sqDist(p, proj);
	}, 
	
	clipSegment: function(a, b, bounds, useLastCode) {
		var min = bounds.min,
			max = bounds.max;
		
		var codeA = useLastCode ? this._lastCode : this._getBitCode(a, bounds),
			codeB = this._getBitCode(b, bounds);
		
		// save 2nd code to avoid calculating it on the next segment
		this._lastCode = codeB;
		
		while (true) {
			if (!(codeA | codeB)) {
				return [a, b];
			} else if (codeA & codeB) {
				return false;
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
		
		if (code & 8) {
			return new L.Point(a.x + dx * (max.y - a.y) / dy, max.y);
		} else if (code & 4) {
			return new L.Point(a.x + dx * (min.y - a.y) / dy, min.y);
		} else if (code & 2){
			return new L.Point(max.x, a.y + dy * (max.x - a.x) / dx);
		} else if (code & 1) {
			return new L.Point(min.x, a.y + dy * (min.x - a.x) / dx);
		}
	},
	
	_getBitCode: function(/*Point*/ p, bounds) {
		var code = 0;
		
		if (p.x < bounds.min.x) code |= 1;
		else if (p.x > bounds.max.x) code |= 2;
		if (p.y < bounds.min.y) code |= 4;
		else if (p.y > bounds.max.y) code |= 8;
		
		return code;
	},
	
	clipPolygon: function(points, bounds) {
		var min = bounds.min,
			max = bounds.max,
			clippedPoints = [],
			codes = [],
			i, j, len, edgeId, code;
		
		for (i = 0, len = points.length; i < len; i++) {
			codes[i] = this._getBitCode(points[i]);
		}
		for (edgeId = 0; edgeId < 4; edgeId++) {
			code = 1 << edgeId;
			for (i = 0, len = points.length, j = len - 1; i < len; j = i++) {
				if (!(codes[j] & code)) {
					if (!(codes[i] & code)) {
						clippedPoints.push(points[i]);
					} else {
						clippedPoints.push(this._getEdgeIntersection(points[j], points[i], code, bounds));
					}
				} else if (!(codes[i] & code)) {
					clippedPoints.push(this._getEdgeIntersection(points[j], points[i], code, bounds));
					clippedPoints.push(points[i]);
				}
			}
			points = clippedPoints;
			clippedPoints = [];
		}
		return points;
	}
};
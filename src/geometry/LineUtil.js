L.LineUtil = {};

L.Util.extend(L.LineUtil, {
	simplify: function(points, tolerance) {
		if (!tolerance) return points.slice();
		
		var t2 = tolerance * tolerance;
		
		// stage 1: vertex reduction
		points = this._reducePoints(points, t2);
		
		// stage 2: Douglas-Peucker simplification
		points = this._dpSimplify(points, t2);
		
		return points; 
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
		var l2 = this._sqDist(p1, p2);
		
		if (l2 == 0) return this._sqDist(p, p1);
		
		var x1 = p.x - p1.x,
			x2 = p2.x - p1.x,
			y1 = p.y - p1.y,
			y2 = p2.y - p1.y,
			dot = x1 * x2 + y1 * y2,
			t = dot / l2;
		
		if (t < 0) return this._sqDist(p, p1);
		if (t > 1) return this._sqDist(p, p2);
		
		var proj = new L.Point(p1.x + x2 * t, p1.y + y2 * t);
		return this._sqDist(p, proj);
	}
});

L.Util.extend(L.LineUtil, {
	// Liang-Barsky line clipping algorithm
	clipSegment: function(a, b, bounds) {
		var tMin = 0,
			tMax = 1,
			dx = b.x - a.x,
			dy = b.y - a.y;
		
		function clip(p, q) {
			if (p === 0) {
				return (q >= 0);
			} else {
				var r = q/p;
				if (p < 0) {
					if (r > tMax) { return false; }
					else if (r > tMin) { tMin = r; }
				} else {
					if (r < tMin) { return false; }
					else if (r < tMax) { tMax = r; }
				}
				return true;
			}
		}
		
		if (	clip(-dx, a.x - bounds.min.x) && 
				clip( dx, bounds.max.x - a.x) && 
				clip(-dy, a.y - bounds.min.y) && 
				clip( dy, bounds.max.y - a.y)) {
			if (tMax < 1) {
				b = new L.Point(
						a.x + dx * tMax,
						a.y + dy * tMax);
			}
			if (tMin > 0) {
				a = new L.Point(
						a.x + dx * tMin,
						a.y + dy * tMin);
			}
			return [a, b];
		}
		return false;
	}
});
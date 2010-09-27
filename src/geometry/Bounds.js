/*
 * L.Bounds represents a rectangular area on the screen in pixel coordinates.
 */

L.Bounds = L.Class.extend({
	initialize: function(min, max) {	//(Point, Point) or Point[]
		var points = (min instanceof Array ? min : [min, max]);
		for (var i = 0, len = points.length; i < len; i++) {
			this.extend(points[i]);
		}
	},

	// extend the bounds to contain the given point
	extend: function(/*Point*/ point) {
		if (!this.min && !this.max) {
			this.min = new L.Point(point.x, point.y);
			this.max = new L.Point(point.x, point.y);
		} else {
			this.min.x = Math.min(point.x, this.min.x);
			this.max.x = Math.max(point.x, this.max.x);
			this.min.y = Math.min(point.y, this.min.y);
			this.max.y = Math.max(point.y, this.max.y);
		}
	},
	
	getCenter: function(round)/*->Point*/ {
		return new L.Point(
				(this.min.x + this.max.x) / 2, 
				(this.min.y + this.max.y) / 2, round);
	},
	
	contains: function(/*Bounds*/ bounds)/*->Boolean*/ {
		return (bounds.min.x >= this.min.x) && 
				(bounds.max.x <= this.max.x) &&
				(bounds.min.y >= this.min.y) && 
				(bounds.max.y <= this.max.y);
	}
});
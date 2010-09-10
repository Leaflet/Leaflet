/*
 * CM.Point represents a point with x and y coordinates.
 */

L.Point = function(/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};

L.Point.prototype = {
	add: function(point) {
		return L.Point(this.x + point.x, this.y + point.y);
	},
		
	subtract: function(point) {
		return L.Point(this.x - point.x, this.y - point.y);
	},
	
	divideBy: function(num, round) {
		return L.Point(this.x/2, this.y/2, round);
	}
};
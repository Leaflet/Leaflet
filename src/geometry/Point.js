/*
 * CM.Point represents a point with x and y coordinates.
 */

L.Point = function(/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};

L.Point.prototype = {
	add: function(point) {
		return new L.Point(this.x + point.x, this.y + point.y);
	},
		
	subtract: function(point) {
		return new L.Point(this.x - point.x, this.y - point.y);
	},
	
	divideBy: function(num, round) {
		return new L.Point(this.x/num, this.y/num, round);
	}
};
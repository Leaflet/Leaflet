/*
 * CM.Point represents a point with x and y coordinates.
 */

L.Point = function(/*Number*/ x, /*Number*/ y, /*Boolean*/ round) {
	this.x = (round ? Math.round(x) : x);
	this.y = (round ? Math.round(y) : y);
};
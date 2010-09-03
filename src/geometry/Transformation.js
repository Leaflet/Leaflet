/*
 * L.Transformation is an utility class to perform simple point transformations through a 2d-matrix. 
 */

L.Transformation = L.Class.extend({
	initialize: function(/*Number*/ a, /*Number*/ b, /*Number*/ c, /*Number*/ d) {
		this._a = a;
		this._b = b;
		this._c = c;
		this._d = d;
	},

	transform: function(/*Point*/ point, /*Number*/ scale) /*-> Point*/ {	
		scale = scale || 1;
		return new L.Point(
			scale * (this._a * point.x + this._b), 
			scale * (this._c * point.y + this._d));
	},
	
	untransform: function(/*Point*/ point, /*Number*/ scale) /*-> Point*/ {
		scale = scale || 1;
		return new L.Point(
			((point.x - this._b) / this._a) / scale,
			((point.y - this._d) / this._c) / scale);
	}
});
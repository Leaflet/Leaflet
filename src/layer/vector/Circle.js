/*
 * L.Circle is a circle overlay (with a certain radius in meters).
 */

L.Circle = L.Ellipse.extend({
	initialize: function (latlng, radius, options) {
		L.Ellipse.prototype.initialize.apply(this, [latlng, L.point(radius, radius), options]);
	},

	setRadius: function (radius) {
		this._mRadiusX = radius;
		this._mRadiusY = radius;
		return this.redraw();
	},

	getRadius: function () {
		return this._mRadiusX;
	}
});

L.circle = function (latlng, radius, options) {
	return new L.Circle(latlng, radius, options);
};

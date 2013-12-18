/*
 * L.Circle is a circle overlay (with a certain radius in meters).
 * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion)
 */

L.Circle = L.CircleMarker.extend({

	initialize: function (latlng, radius, options) {
		L.setOptions(this, options);
		this._latlng = L.latLng(latlng);
		this._mRadius = radius;
	},

	setRadius: function (radius) {
		this._mRadius = radius;
		return this.redraw();
	},

	getRadius: function () {
		return this._mRadius;
	},

	getBounds: function () {
		var rlng = this._getLngRadius(),
		    rlat = this._getLatRadius(),
		    latlng = this._latlng;

		return new L.LatLngBounds(
			[latlng.lat - rlat, latlng.lng - rlng],
			[latlng.lat + rlat, latlng.lng + rlng]);
	},

	setStyle: L.Path.prototype.setStyle,

	// TODO Earth hardcoded, move into projection code!
	_project: function () {
		var lngRadius = this._getLngRadius(),
		    latlng = this._latlng,
		    pointLeft = this._map.latLngToLayerPoint([latlng.lat, latlng.lng - lngRadius]);

		this._point = this._map.latLngToLayerPoint(latlng);
		this._radius = Math.max(this._point.x - pointLeft.x, 1);
		this._updateBounds();
	},

	_getLatRadius: function () {
		return (this._mRadius / 40075017) * 360;
	},

	_getLngRadius: function () {
		return this._getLatRadius() / Math.cos((Math.PI / 180) * this._latlng.lat);
	}
});

L.circle = function (latlng, radius, options) {
	return new L.Circle(latlng, radius, options);
};

/*
 * L.Circle is a circle overlay (with a certain radius in meters).
 */

L.Circle = L.Path.extend({

	options: {
		fill: true
	},

	initialize: function (latlng, radius, options) {
		L.setOptions(this, options);
		this._latlng = L.latLng(latlng);
		this._mRadius = radius;
	},

	setLatLng: function (latlng) {
		this._latlng = L.latLng(latlng);
		return this.redraw();
	},

	getLatLng: function () {
		return this._latlng;
	},

	setRadius: function (radius) {
		this._mRadius = radius;
		return this.redraw();
	},

	getRadius: function () {
		return this._mRadius;
	},

	getBounds: function () {
		var lngRadius = this._getLngRadius(),
		    latRadius = (this._mRadius / 40075017) * 360,
		    latlng = this._latlng;

		return new L.LatLngBounds(
			[latlng.lat - latRadius, latlng.lng - lngRadius],
			[latlng.lat + latRadius, latlng.lng + lngRadius]);
	},

	_update: function () {
		if (!this._map) { return; }

		this._renderer._updateCircle(this);
	},

	// TODO Earth hardcoded, move into projection code!

	_project: function () {
		var lngRadius = this._getLngRadius(),
		    latlng = this._latlng,
		    pointLeft = this._map.latLngToLayerPoint([latlng.lat, latlng.lng - lngRadius]);

		this._point = this._map.latLngToLayerPoint(latlng);
		this._radius = Math.max(this._point.x - pointLeft.x, 1);
	},

	_getLatRadius: function () {
		return (this._mRadius / 40075017) * 360;
	},

	_getLngRadius: function () {
		return this._getLatRadius() / Math.cos((Math.PI / 180) * this._latlng.lat);
	},

	_empty: function () {
		var b = this._renderer._bounds,
		    r = this._radius + (this.options.stroke ? this.options.weight / 2 : 0),
		    p = this._point;

		return p.x - r > b.max.x || p.y - r > b.max.y ||
		       p.x + r < b.min.x || p.y + r < b.min.y;
	}
});

L.circle = function (latlng, radius, options) {
	return new L.Circle(latlng, radius, options);
};

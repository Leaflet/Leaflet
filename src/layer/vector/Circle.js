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
		var half = [this._radius, this._radius];

		return new L.LatLngBounds(
			this._map.layerPointToLatLng(this._point.subtract(half)),
			this._map.layerPointToLatLng(this._point.add(half)));
	},

	setStyle: L.Path.prototype.setStyle,

	_project: function () {
		var crs = this._map.options.crs,
		    p1 = crs.project(this._latlng),
		    latlng2 = crs.unproject(p1.subtract([this._mRadius, 0]));

		var pointLeft = this._map.latLngToLayerPoint(latlng2);

		this._point = this._map.latLngToLayerPoint(this._latlng);
		this._radius = Math.max(this._point.x - pointLeft.x, 1);

		this._updateBounds();
	}
});

L.circle = function (latlng, radius, options) {
	return new L.Circle(latlng, radius, options);
};

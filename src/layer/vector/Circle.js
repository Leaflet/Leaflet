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
		var half = [this._radius, this._radiusY];

		return new L.LatLngBounds(
			this._map.layerPointToLatLng(this._point.subtract(half)),
			this._map.layerPointToLatLng(this._point.add(half)));
	},

	setStyle: L.Path.prototype.setStyle,

	_project: function () {

		var lng = this._latlng.lng,
		    map = this._map,

		    latR = 360 * this._mRadius / (2 * L.CRS.Earth.R * Math.PI),
		    top = map.latLngToLayerPoint([this._latlng.lat + latR, lng]),
		    bottom = map.latLngToLayerPoint([this._latlng.lat - latR, lng]),
		    p = this._point = top.add(bottom).divideBy(2),
		    newLat = map.layerPointToLatLng(p).lat,
		    lngR = latR / Math.cos(newLat * Math.PI / 180),
		    left = map.latLngToLayerPoint([newLat, lng - lngR]);

		this._radius = Math.max(p.x - left.x, 1);
		this._radiusY = Math.max(p.y - top.y, 1);

		this._updateBounds();
	}
});

L.circle = function (latlng, radius, options) {
	return new L.Circle(latlng, radius, options);
};

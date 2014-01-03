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

		var rad = Math.PI / 180,
		    lng = this._latlng.lng,
		    lat = this._latlng.lat,
		    map = this._map,

		    latR = (this._mRadius / L.CRS.Earth.R) / rad,
		    top = map.project([lat + latR, lng]),
		    bottom = map.project([lat - latR, lng]),
		    p = top.add(bottom).divideBy(2),
		    lat2 = map.unproject(p).lat,

		    lngR = Math.acos((Math.cos(latR * rad) - Math.sin(lat * rad) * Math.sin(lat2 * rad)) /
		            (Math.cos(lat * rad) * Math.cos(lat2 * rad))) / rad || 0,
		    left = map.project([lat2, lng - lngR]);

		this._point = p.subtract(map.getPixelOrigin());
		this._radius = Math.max(Math.round(p.x - left.x), 1);
		this._radiusY = Math.max(Math.round(p.y - top.y), 1);

		this._updateBounds();
	}
});

L.circle = function (latlng, radius, options) {
	return new L.Circle(latlng, radius, options);
};

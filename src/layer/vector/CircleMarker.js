/*
 * L.CircleMarker is a circle overlay with a permanent pixel radius.
 */

L.CircleMarker = L.Path.extend({

	options: {
		fill: true,
		radius: 10
	},

	initialize: function (latlng, options) {
		L.setOptions(this, options);
		this._latlng = L.latLng(latlng);
		this._radius = this.options.radius;
	},

	setLatLng: function (latlng) {
		this._latlng = L.latLng(latlng);
		// TODO move out to Popup?
		if (this._popup) {
			this._popup.setLatLng(latlng);
		}
		return this.redraw();
	},

	getLatLng: function () {
		return this._latlng;
	},

	setRadius: function (radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	},

	getRadius: function () {
		return this._radius;
	},

	setStyle : function (options) {
		this._radius = options && options.radius || this._radius;
		L.Path.prototype.setStyle.call(this, options);
	},

	_project: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
	},

	_update: function () {
		if (this._map) {
			this._renderer._updateCircle(this);
		}
	},

	_empty: function () {
		var b = this._renderer._bounds,
		    r = this._radius + (this.options.stroke ? this.options.weight / 2 : 0),
		    p = this._point;

		return p.x - r > b.max.x || p.y - r > b.max.y ||
		       p.x + r < b.min.x || p.y + r < b.min.y;
	}
});

L.circleMarker = function (latlng, options) {
	return new L.CircleMarker(latlng, options);
};

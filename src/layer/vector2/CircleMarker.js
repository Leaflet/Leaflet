/*
 * L.CircleMarker is a circle overlay with a permanent pixel radius.
 */

// TODO make Circle extend CircleMarker, not the other way?

L.CircleMarker = L.Circle.extend({
	options: {
		fill: true,
		radius: 10,
		weight: 2
	},

	initialize: function (latlng, options) {
		L.setOptions(this, options);
		this._latlng = L.latLng(latlng);
		this._radius = this.options.radius;
	},

	_project: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
	},

	_updateStyle : function () {
		this._radius = this.options.radius;
		L.Circle.prototype._updateStyle.call(this);
	},

	setRadius: function (radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	},

	getRadius: function () {
		return this._radius;
	}
});

L.circleMarker = function (latlng, options) {
	return new L.CircleMarker(latlng, options);
};

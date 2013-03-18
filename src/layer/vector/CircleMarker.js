/*
 * L.CircleMarker is a circle overlay with a permanent pixel radius.
 */

L.CircleMarker = L.Circle.extend({
	options: {
		radius: 10,
		weight: 2
	},

	initialize: function (latlng, options) {
		L.Circle.prototype.initialize.call(this, latlng, null, options);
		this._radius = this.options.radius;
	},

	projectLatlngs: function () {
		this._point = this._map.latLngToLayerPoint(this._latlng);
	},

	_updateStyle : function () {
		L.Circle.prototype._updateStyle.call(this);
		this.setRadius(this.options.radius, true);
	},

	setRadius: function (radius, noRedraw) {
		this.options.radius = this._radius = radius;
		return noRedraw ? this : this.redraw();
	}
});

L.circleMarker = function (latlng, options) {
	return new L.CircleMarker(latlng, options);
};

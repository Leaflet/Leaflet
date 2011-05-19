/*
 * L.CircleMarker is a circle overlay with a permanent pixel radius. 
 */

L.CircleMarker = L.Circle.extend({
	initialize: function(latlng, radius, options) {
		L.Circle.prototype.initialize.apply(this, arguments);
		this._radius = radius;
	},
	
	projectLatlngs: function() {
		this._point = this._map.latLngToLayerPoint(this._latlng);
	}
});
/*
 * L.Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds
 */

L.Rectangle = L.Polygon.extend({
	initialize: function (latLngBounds, options) {
		L.Polygon.prototype.initialize.call(this, this._boundsToLatLngs(latLngBounds), options);
	},

	setBounds: function (latLngBounds) {
		this.setLatLngs(this._boundsToLatLngs(latLngBounds));
	},

	_boundsToLatLngs: function (latLngBounds) {
		latLngBounds = L.latLngBounds(latLngBounds);
	    return [
	        latLngBounds.getSouthWest(),
	        latLngBounds.getNorthWest(),
	        latLngBounds.getNorthEast(),
	        latLngBounds.getSouthEast(),
	        latLngBounds.getSouthWest()
	    ];
	}
});

L.rectangle = function (latLngBounds, options) {
	return new L.Rectangle(latLngBounds, options);
};

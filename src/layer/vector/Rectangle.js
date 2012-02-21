/*
 * L.Rectangle extends Polygon and creates a rectangle when passed at LatLngBounds
 */

L.Rectangle = L.Polygon.extend({
	initialize: function (latLngBounds, options) {
		var latlngs = [
			latLngBounds.getSouthWest(),
			latLngBounds.getNorthWest(),
			latLngBounds.getNorthEast(),
			latLngBounds.getSouthEast(),
			latLngBounds.getSouthWest()
		];
		L.Polygon.prototype.initialize.call(this, latlngs, options);
	},

	setBounds: function (latLngBounds) {
		this.setLatLngs([
			latLngBounds.getSouthWest(),
			latLngBounds.getNorthWest(),
			latLngBounds.getNorthEast(),
			latLngBounds.getSouthEast(),
			latLngBounds.getSouthWest()
		]);
	}
});

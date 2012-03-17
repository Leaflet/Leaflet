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
	
	getBounds: function () {
	    var latLngs = this.getLatLngs();
	  
	    return new L.LatLngBounds(latLngs[0], latLngs[2]);
	},
	
	_boundsToLatLngs: function (latLngBounds) {
	    return [
            latLngBounds.getSouthWest(),
            latLngBounds.getNorthWest(),
            latLngBounds.getNorthEast(),
            latLngBounds.getSouthEast(),
            latLngBounds.getSouthWest()
	    ];
	}
});

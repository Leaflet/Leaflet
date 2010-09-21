/*
 * L.LatLngBounds represents a rectangular area on the map in geographical coordinates.
 */

L.LatLngBounds = L.Class.extend({
	initialize: function(southWest, northEast) {	// (LatLng, LatLng) or (LatLng[])
		var latlngs = (southWest instanceof Array ? southWest : [southWest, northEast]);
		for (var i = 0, len = latlngs.length; i < len; i++) {
			this.extend(latlngs[i]);
		}
	},
	
	// extend the bounds to contain the given point
	extend: function(/*LatLng*/ latlng) {
		if (!this.southWest && !this.northEast) {
			this.southWest = new L.LatLng(latlng.lat, latlng.lng);
			this.northEast = new L.LatLng(latlng.lat, latlng.lng);
		} else {
			this.southWest.lat = Math.min(latlng.lat, this.southWest.lat);
			this.southWest.lng = Math.min(latlng.lng, this.southWest.lng);
			this.northEast.lat = Math.max(latlng.lat, this.northEast.lat);
			this.northEast.lng = Math.max(latlng.lng, this.northEast.lng);
		}
	},
	
	getCenter: function() /*-> LatLng*/ {
		return new L.LatLng(
				(this.southWest.lat + this.northEast.lat) / 2, 
				(this.southWest.lng + this.northEast.lng) / 2);
	},
	
	contains: function(/*LatLngBounds*/ bounds) /*-> Boolean*/ {
		var sw = this.southWest,
			ne = this.northEast,
			sw2 = bounds.southWest,
			ne2 = bounds.northEast;
		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
				(sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
	}
});

//TODO International date line?
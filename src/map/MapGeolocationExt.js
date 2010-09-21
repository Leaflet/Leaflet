L.Map.include({
	locate: function() {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
					L.Util.bind(this._handleGeolocationResponse, this),
					L.Util.bind(this._handleGeolocationError, this));
		}
		return this;
	},
	
	_handleGeolocationError: function(error) {
		this.fire('locationerror', {message: error.message});
	},
	
	_handleGeolocationResponse: function(pos) {
		var latAccuracy = 180 * pos.coords.accuracy / 4e7,
			lngAccuracy = latAccuracy * 2,
			lat = pos.coords.latitude,
			lng = pos.coords.longitude;
		
		var sw = new L.LatLng(lat - latAccuracy, lng - lngAccuracy),
			ne = new L.LatLng(lat + latAccuracy, lng + lngAccuracy),
			bounds = new L.LatLngBounds(sw, ne);
		
		this.fitBounds(bounds);
		
		this.fire('locationfound', {
			latlng: new L.LatLng(lat, lng), 
			bounds: bounds
		});
	}
});
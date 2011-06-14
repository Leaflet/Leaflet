/*
 * Provides L.Map with convenient shortcuts for W3C geolocation.
 */

L.Map.include({
	locate: function(/*Object*/ options) {
		// W3C Geolocation API Spec position options, http://dev.w3.org/geo/api/spec-source.html#position-options
		var opts = {timeout: 10000};
		L.Util.extend(opts, options);
		
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
					L.Util.bind(this._handleGeolocationResponse, this),
					L.Util.bind(this._handleGeolocationError, this),
					opts);
		} else {
			this.fire('locationerror', {
				code: 0,
				message: "Geolocation not supported."
			});
		}
		return this;
	},
	
	locateAndSetView: function(maxZoom, options) {
		this._setViewOnLocate = true;
		this._maxLocateZoom = maxZoom || Infinity;
		return this.locate(options);
	},
	
	_handleGeolocationError: function(error) {
		var c = error.code,
			message = (c == 1 ? "permission denied" : 
				(c == 2 ? "position unavailable" : "timeout"));
		
		if (this._setViewOnLocate) {
			this.fitWorld();
			this._setViewOnLocate = false;
		}
		
		this.fire('locationerror', {
			code: c,
			message: "Geolocation error: " + message + "." 
		});
	},
	
	_handleGeolocationResponse: function(pos) {
		var latAccuracy = 180 * pos.coords.accuracy / 4e7,
			lngAccuracy = latAccuracy * 2,
			lat = pos.coords.latitude,
			lng = pos.coords.longitude;
		
		var sw = new L.LatLng(lat - latAccuracy, lng - lngAccuracy),
			ne = new L.LatLng(lat + latAccuracy, lng + lngAccuracy),
			bounds = new L.LatLngBounds(sw, ne);
		
		if (this._setViewOnLocate) {
			var zoom = Math.min(this.getBoundsZoom(bounds), this._maxLocateZoom);
			this.setView(bounds.getCenter(), zoom);
			this._setViewOnLocate = false;
		}
		
		this.fire('locationfound', {
			latlng: new L.LatLng(lat, lng), 
			bounds: bounds,
			accuracy: pos.coords.accuracy
		});
	}
});
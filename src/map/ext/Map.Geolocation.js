/*
 * Provides L.Map with convenient shortcuts for W3C geolocation.
 */

L.Map.include({
	_defaultLocateOptions: {
		watch: false,
		setView: false,
		maxZoom: Infinity,
		timeout: 10000,
		maximumAge: 0,
		enableHighAccuracy: false
	},

	locate: function (/*Object*/ options) {

		options = this._locationOptions = L.Util.extend(this._defaultLocateOptions, options);

		if (!navigator.geolocation) {
			return this.fire('locationerror', {
				code: 0,
				message: "Geolocation not supported."
			});
		}

		var onResponse = L.Util.bind(this._handleGeolocationResponse, this),
			onError = L.Util.bind(this._handleGeolocationError, this);

		if (options.watch) {
			this._locationWatchId = navigator.geolocation.watchPosition(onResponse, onError, options);
		} else {
			navigator.geolocation.getCurrentPosition(onResponse, onError, options);
		}
		return this;
	},

	stopLocate: function () {
		if (navigator.geolocation) {
			navigator.geolocation.clearWatch(this._locationWatchId);
		}
		return this;
	},

	_handleGeolocationError: function (error) {
		var c = error.code,
			message =
				(c === 1 ? "permission denied" :
				(c === 2 ? "position unavailable" : "timeout"));

		if (this._locationOptions.setView && !this._loaded) {
			this.fitWorld();
		}

		this.fire('locationerror', {
			code: c,
			message: "Geolocation error: " + message + "."
		});
	},

	_handleGeolocationResponse: function (pos) {
		var latAccuracy = 180 * pos.coords.accuracy / 4e7,
			lngAccuracy = latAccuracy * 2,

			lat = pos.coords.latitude,
			lng = pos.coords.longitude,
			latlng = new L.LatLng(lat, lng),

			sw = new L.LatLng(lat - latAccuracy, lng - lngAccuracy),
			ne = new L.LatLng(lat + latAccuracy, lng + lngAccuracy),
			bounds = new L.LatLngBounds(sw, ne),

			options = this._locationOptions;

		if (options.setView) {
			var zoom = Math.min(this.getBoundsZoom(bounds), options.maxZoom);
			this.setView(latlng, zoom);
		}

		this.fire('locationfound', {
			latlng: latlng,
			bounds: bounds,
			accuracy: pos.coords.accuracy
		});
	}
});

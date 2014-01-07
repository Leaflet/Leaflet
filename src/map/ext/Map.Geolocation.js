/*
 * Provides L.Map with convenient shortcuts for using browser geolocation features.
 */
L.Map.IpProvider = {};
L.Map.IpProvider.None = null;
L.Map.IpProvider.FreeGeoIp = {
	url: 'http://freegeoip.net/json/',
	cbParam: 'callback',
	buildLocationObject: function(data) {
		if (!data) {
			return null;
		}

		return {
			coords: {
				latitude: data.latitude,
				longitude: data.longitude
			}
		};
	}
};
L.Map.IpProvider.GeoPlugin = {
	url: 'http://www.geoplugin.net/json.gp',
	cbParam: 'jsoncallback',
	buildLocationObject: function(data) {
		if (!data) {
			return null;
		}

		return {
			coords: {
				latitude: data.geoplugin_latitude,
				longitude: data.geoplugin_longitude
			}
		};
	}
};
L.Map.IpProvider.Wikimedia = {
	url: 'http://geoiplookup.wikimedia.org/',
	cbParam: '',
	buildLocationObject: function() {
		var data = window.Geo,
			result = {
			coords: {
				latitude: data.lat,
				longitude: data.lon
			}
		};

		delete window.Geo;
		return result;
	}
};

L.Map.include({
	_defaultLocateOptions: {
		ipProvider: L.Map.IpProvider.Null,
		timeout: 10000,
		watch: false
		// setView: false
		// maxZoom: <Number>
		// maximumAge: 0
		// enableHighAccuracy: false
	},

	locate: function (/*Object*/ options) {
		options = this._locateOptions = L.extend(this._defaultLocateOptions, options);

		if (!navigator.geolocation && !options.ipProvider) {
			this._handleGeolocationError({
				code: 0,
				message: 'Geolocation not supported.'
			});
			return this;
		}

		var onResponse = L.bind(this._handleGeolocationResponse, this),
			onError = L.bind((options.ipProvider) ? this._fallbackToIp : this._handleGeolocationError, this);

		if (options.watch) {
			this._locationWatchId =
					navigator.geolocation.watchPosition(onResponse, onError, options);
		} else {
			navigator.geolocation.getCurrentPosition(onResponse, onError, options);
		}

		return this;
	},

	stopLocate: function () {
		if (navigator.geolocation) {
			navigator.geolocation.clearWatch(this._locationWatchId);
		}
		if (this._locateOptions) {
			this._locateOptions.setView = false;
		}
		return this;
	},

	_fallbackToIp: function (errMsg) {
		 if (!this._locateOptions.ipProvider) {
			 this._handleGeolocationError(errMsg);
			 return;
		 }

		 var onResponse = L.bind(this._handleGeolocationResponse, this),
			 onError = L.bind(this._handleGeolocationError, this);

		 this._locateByIP(onResponse, onError, this._locateOptions.ipProvider);
	},

	_handleGeolocationError: function (error) {
		var c = error.code,
		    message = error.message ||
		            (c === 1 ? 'permission denied' :
		            (c === 2 ? 'position unavailable' : 'timeout'));

		if (this._locateOptions.setView && !this._loaded) {
			this.fitWorld();
		}

		this.fire('locationerror', {
			code: c,
			message: 'Geolocation error: ' + message + '.'
		});
	},

	_handleGeolocationResponse: function (pos) {
		var lat = pos.coords.latitude,
		    lng = pos.coords.longitude,
		    latlng = new L.LatLng(lat, lng),

		    latAccuracy = pos.ipBased ? 0 : 180 * pos.coords.accuracy / 40075017,
		    lngAccuracy = pos.ipBased ? 0 : latAccuracy / Math.cos((Math.PI / 180) * lat),

		    bounds = L.latLngBounds(
		            [lat - latAccuracy, lng - lngAccuracy],
		            [lat + latAccuracy, lng + lngAccuracy]),

		    options = this._locateOptions;

		var data = {latlng: latlng};
		var zoom = 1;

		if (pos.ipBased) {
			// since we use ip based location we do not zoom in very close (because of bad accuracy)...
			// ... we make a guess with zoom level 9
			zoom = 9;
			data.timestamp = new Date().getTime();
		} else {
			zoom = this.getBoundsZoom(bounds);
			data = L.extend(data, {
				bounds: bounds,
				timestamp: pos.timestamp
			});
		}

		if (options.setView) {
			this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
		}

		for (var i in pos.coords) {
			if (typeof pos.coords[i] === 'number') {
				data[i] = pos.coords[i];
			}
		}

		this.fire('locationfound', data);
	},

	_handleIpResponse: function(data, responseCallback, errorCallback) {
		window.cbObject = null;
		delete window.cbObject;

		var pos = this._locateOptions.ipProvider.buildLocationObject(data);
		if (pos === null) {
			if (errorCallback) { errorCallback('Could not get location.'); }
		} else if (responseCallback) {
			pos.ipBased = true;
			responseCallback(pos);
		}
	},

	_locateByIP: function(responseCallback, errorCallback, source) {
		var handlerFn = L.bind(function(data) {
			this._handleIpResponse(data, responseCallback, errorCallback);
		}, this);

		if (source.cbParam === undefined || source.cbParam === null || source.cbParam === '') {
			this._loadScript(source.url, handlerFn);
			return;
		}

		window.cbObject = {};
		window.cbObject.fn = handlerFn;
		this._loadScript(source.url + '?' + source.cbParam + '= window.cbObject.fn');
	},

	_loadScript: function(url, callback, type) {
		var script = document.createElement('script');
		script.type = (type === undefined) ? 'text/javascript' : type;

		if (typeof callback === 'function') {
			if (script.readyState) {
				script.onreadystatechange = function () {
					if (script.readyState === 'loaded' || script.readyState === 'complete') {
						script.onreadystatechange = null;
						callback();
					}
				};
			} else {
				script.onload = function () { callback(); };
			}
		}

		script.src = url;
		document.getElementsByTagName('head')[0].appendChild(script);
	}
});

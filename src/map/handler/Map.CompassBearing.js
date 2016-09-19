/*
 * L.Map.CompassBearing will rotate the map according to a smartphone's compass.
 */

L.Map.CompassBearing = L.Handler.extend({

	initialize: function(map) {
		if (!window.DeviceOrientationEvent) {
			this._capable = false;
			return;
		}
		this._capable = true;
		this._map = map;

		this._throttled = L.Util.throttle(this._onDeviceOrientation, 1000, this);
	},

	addHooks: function () {
		if (this._capable && this._map._rotate) {
			L.DomEvent.on(window, 'deviceorientation', this._throttled, this);
		}
	},

	removeHooks: function () {
		if (this._capable && this._map._rotate) {
			L.DomEvent.off(window, 'deviceorientation', this._throttled, this);
		}
	},

	_onDeviceOrientation: function(event) {
		if (event.alpha !== null) {
			this._map.setBearing(event.alpha - window.orientation);
		}
	}
});

// @section Handlers
// @property compassBearing: Handler
// Compass bearing handler.
L.Map.addInitHook('addHandler', 'compassBearing', L.Map.CompassBearing);

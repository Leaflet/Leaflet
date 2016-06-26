/*
 * L.Map.CompassBearing will rotate the map according to a smartphone's compass.
 */

L.Map.CompassBearing = L.Handler.extend({

	initialize: function(map) {
		this._capable = false;
		if (!map._rotate){
			return;
		}
		this._map = map;

		if (!window.DeviceOrientationEvent) { return; }

		this._probing = true;
		this._throttled = L.Util.throttle(this._onDeviceOrientation, 100, this);

		L.DomEvent.on(window, 'deviceorientation', this._probe, this);
		window.setTimeout(this._cancelProbe.bind(this), 1000);
	},

	addHooks: function () {
		if (this._capable) {
// 			alert('Tracking compass');
			L.DomEvent.on(window, 'deviceorientation', this._throttled, this);
		} else if (!this._probing) {
// 			alert('Not tracking compass');
			this._enabled = false;
		} else {
// 			console.log('Waiting for feature probing');
		}
	},

	removeHooks: function () {
		if (this._capable) {
			L.DomEvent.off(window, 'deviceorientation', this._throttled, this);
		}
	},

	_onDeviceOrientation: function(ev) {
		if (ev.absolute && this._enabled) {
			this._map.setBearing(ev.alpha);
		}
	},

	_probe: function(ev) {
// 		console.log('Probed deviceOrientation', ev);
		L.DomEvent.off(window, 'deviceorientation', this._probe, this);
		this._capable = true;
		if (this._enabled) {
			this.addHooks();
		}
	},

	_cancelProbe: function(ev) {
		L.DomEvent.off(window, 'deviceorientation', this._probe, this);

// 		if (!this._capable) {
// 			alert('No device orientation');
// 		}

		this._probing = false;
	}
});

// @section Handlers
// @property compassBearing: Handler
// Compass bearing handler.
L.Map.addInitHook('addHandler', 'compassBearing', L.Map.CompassBearing);

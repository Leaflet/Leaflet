import {Map} from '../Map';
import {Handler} from '../../core/Handler';
import * as DomEvent from '../../dom/DomEvent';
import * as Util from '../../core/Util';

/*
 * L.Map.CompassBearing will rotate the map according to a smartphone's compass.
 */

Map.CompassBearing = Handler.extend({

	initialize: function (map) {
		if (!window.DeviceOrientationEvent) {
			this._capable = false;
			return;
		}
		this._capable = true;
		this._map = map;

		this._throttled = Util.throttle(this._onDeviceOrientation, 1000, this);
	},

	addHooks: function () {
		if (this._capable && this._map._rotate) {
			DomEvent.on(window, 'deviceorientation', this._throttled, this);
		}
	},

	removeHooks: function () {
		if (this._capable && this._map._rotate) {
			DomEvent.off(window, 'deviceorientation', this._throttled, this);
		}
	},

	_onDeviceOrientation: function (event) {
		if (event.alpha !== null) {
			this._map.setBearing(event.alpha - window.orientation);
		}
	}
});

// @section Handlers
// @property compassBearing: Handler
// Compass bearing handler.
Map.addInitHook('addHandler', 'compassBearing', Map.CompassBearing);

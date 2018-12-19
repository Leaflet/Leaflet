import {Map} from '../Map';
import {Handler} from '../../core/Handler';
/*
 * L.Handler.TouchRotate is used by L.Map to add two-finger rotation gestures.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Touch interaction options
	// @option touchRotate: Boolean|String = *
	// Whether the map can be rotated with a two-finger rotation gesture
	touchRotate: false
});

export var TouchRotate = Handler.extend({
	addHooks: function () {
		this._map.touchGestures.enable();
		this._map.touchGestures.rotate = true;
	},

	removeHooks: function () {
		this._map.touchGestures.rotate = false;
	}
});

// @section Handlers
// @property touchZoom: Handler
// Touch rotate handler.
Map.addInitHook('addHandler', 'touchRotate', TouchRotate);

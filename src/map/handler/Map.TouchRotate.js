/*
 * L.Handler.TouchRotate is used by L.Map to add two-finger rotation gestures.
 */

// @namespace Map
// @section Interaction Options
L.Map.mergeOptions({
	// @section Touch interaction options
	// @option touchRotate: Boolean|String = *
	// Whether the map can be rotated with a two-finger rotation gesture
	touchRotate: false
});

L.Map.TouchRotate = L.Handler.extend({
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
L.Map.addInitHook('addHandler', 'touchRotate', L.Map.TouchRotate);

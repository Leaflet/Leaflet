import {Map} from '../Map.js';
import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';

/*
 * L.Handler.ScrollWheelZoom is used by L.Map to enable mouse scroll wheel zoom on the map.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Mouse wheel options
	// @option scrollWheelZoom: Boolean|String = true
	// Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
	// it will zoom to the center of the view regardless of where the mouse was.
	scrollWheelZoom: true,

	// @option maxWheelZoomSpeed: Number = 10
	// The maximum rate at which the map zoom may change due to scrolling, in
	// zoom levels per second.
	maxWheelZoomSpeed: 10,

	// @option wheelTimeout: Number = 1000
	// The duration of mouse wheel inactivity, in milliseconds, after which
	// accumulated inertia is discarded.
	wheelTimeout: 1000,

	// @option wheelPxPerZoomLevel: Number = 60
	// How many scroll pixels (as reported by [L.DomEvent.getWheelDelta](#domevent-getwheeldelta))
	// mean a change of one full zoom level. Smaller values will make wheel-zooming
	// faster (and vice versa).
	wheelPxPerZoomLevel: 60
});

export const ScrollWheelZoom = Handler.extend({
	addHooks() {
		DomEvent.on(this._map._container, 'wheel', this._onWheelScroll, this);

		this._inertia = 0;
		this._timeAtLastZoom = 0;
	},

	removeHooks() {
		DomEvent.off(this._map._container, 'wheel', this._onWheelScroll, this);
		clearTimeout(this._timer);
	},

	_onWheelScroll(e) {
		const map = this._map;
		const wheelDelta = DomEvent.getWheelDelta(e);
		const elapsed = Date.now() - this._timeAtLastZoom;

		// If this is the beginning of a gesture, or if the gesture has changed
		// direction, discard any accumulated inertia.
		if (
			elapsed > map.options.wheelTimeout ||
			(wheelDelta > 0 && this._inertia < 0) ||
			(wheelDelta < 0 && this._inertia > 0)
		) {
			this._inertia = 0;
			this._timeAtLastZoom = Date.now();
		}
		this._inertia += wheelDelta / map.options.wheelPxPerZoomLevel;
		const max = map.options.maxWheelZoomSpeed * elapsed / 1000;
		const delta = Number.isFinite(max) ?
			(
				this._inertia < 0 ?
					Math.max(this._inertia, -max) :
					Math.min(this._inertia, max)
			) :
			this._inertia; // unclamped
		const mapZoom = map.getZoom();
		const zoom = map._limitZoom(mapZoom + delta); // clamp and snap
		if (zoom !== mapZoom && !map._animatingZoom) {
			this._inertia -= zoom - mapZoom; // consume some inertia
			const center = map.options.scrollWheelZoom === 'center' ?
				map.getCenter() :
				map.mouseEventToContainerPoint(e);
			map.setZoomAround(center, zoom);
			this._timeAtLastZoom = Date.now();
		}

		DomEvent.stop(e);
	}
});

// @section Handlers
// @property scrollWheelZoom: Handler
// Scroll wheel zoom handler.
Map.addInitHook('addHandler', 'scrollWheelZoom', ScrollWheelZoom);

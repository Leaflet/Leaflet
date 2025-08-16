import {Map} from '../Map.js';
import {Handler} from '../../core/Handler.js';

/*
 * Handler.DoubleClickZoom is used to handle double-click zoom on the map, enabled by default.
 */

// @namespace Map
// @section Interaction Options

Map.mergeOptions({
	// @option doubleClickZoom: Boolean|String = true
	// Whether the map can be zoomed in by double clicking on it and
	// zoomed out by double clicking while holding shift. If passed
	// `'center'`, double-click zoom will zoom to the center of the
	//  view regardless of where the pointer was.
	doubleClickZoom: true
});

export class DoubleClickZoom extends Handler {
	addHooks() {
		this._map.on('dblclick', this._onDoubleClick, this);
	}

	removeHooks() {
		this._map.off('dblclick', this._onDoubleClick, this);
	}

	_onDoubleClick(e) {
		const map = this._map,
		oldZoom = map.getZoom(),
		delta = map.options.zoomDelta,
		zoom = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;

		if (map.options.doubleClickZoom === 'center') {
			map.setZoom(zoom);
		} else {
			map.setZoomAround(e.containerPoint, zoom);
		}
	}
}

// @section Handlers
//
// Map properties include interaction handlers that allow you to control
// interaction behavior in runtime, enabling or disabling certain features such
// as dragging or touch zoom (see `Handler` methods). For example:
//
// ```js
// map.doubleClickZoom.disable();
// ```
//
// @property doubleClickZoom: Handler
// Double click zoom handler.
Map.addInitHook('addHandler', 'doubleClickZoom', DoubleClickZoom);

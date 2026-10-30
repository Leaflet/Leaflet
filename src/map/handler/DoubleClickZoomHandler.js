import {Handler} from '../../core/Handler.js';

/** @import {LeafletPointerEvent} from '../../types.js' */

// Handles double-click zoom on the map, enabled by default.
export class DoubleClickZoomHandler extends Handler {
	addHooks() {
		this._map.on('dblclick', this._onDoubleClick, this);
	}

	removeHooks() {
		this._map.off('dblclick', this._onDoubleClick, this);
	}

	/** @param {LeafletPointerEvent} e */
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

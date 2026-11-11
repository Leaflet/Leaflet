import {Handler} from '../../core/Handler.js';

/** @import {LeafletPointerEvent} from '../../types.js' */

/** Zooms in on double click, and out on Shift-double click (`map.doubleClickZoom`), enabled by default. */
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
		oldZoom = map._targetZoom(),
		delta = map.options.zoomDelta,
		zoom = e.originalEvent.shiftKey ? oldZoom - delta : oldZoom + delta;

		const options = {originalEvent: e.originalEvent};
		if (map.options.doubleClickZoom === 'center') {
			map.setZoom(zoom, options);
		} else {
			map.setZoomAround(e.containerPoint, zoom, options);
		}
	}
}

import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';

/*
 * Handler.ScrollWheelZoom is used by Map to enable mouse scroll wheel zoom on the map.
 */

export class ScrollWheelZoomHandler extends Handler {
	addHooks() {
		DomEvent.on(this._map._container, 'wheel', this._onWheelScroll, this);

		this._delta = 0;
	}

	removeHooks() {
		DomEvent.off(this._map._container, 'wheel', this._onWheelScroll, this);
		clearTimeout(this._timer);
	}

	_onWheelScroll(e) {
		const delta = DomEvent.getWheelDelta(e);

		const debounce = this._map.options.wheelDebounceTime;

		this._delta += delta;
		// resolving the container point reads layout, so defer it to _performZoom
		this._lastEvent = e;

		if (!this._startTime) {
			this._startTime = Date.now();
		}

		const left = Math.max(debounce - (Date.now() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(this._performZoom.bind(this), left);

		DomEvent.stop(e);
	}

	_performZoom() {
		const map = this._map,
		zoom = map.getZoom(),
		snap = this._map.options.zoomSnap ?? 0;

		map._stop(); // stop panning and fly animations if any

		// map the delta with a sigmoid function to -4..4 range leaning on -1..1
		const d2 = this._delta / (this._map.options.wheelPxPerZoomLevel * 4),
		d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
		d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
		delta = map._limitZoom(zoom + (this._delta > 0 ? d4 : -d4)) - zoom;

		this._delta = 0;
		this._startTime = null;

		if (!delta || map._zoomInputBlocked()) { return; }

		if (map.options.scrollWheelZoom === 'center') {
			map.setZoom(zoom + delta);
		} else {
			map.setZoomAround(map.pointerEventToContainerPoint(this._lastEvent), zoom + delta);
		}
	}
}

// @ts-check
import {Handler} from '../../core/Handler.js';
import * as DomUtil from '../../dom/DomUtil.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {LatLngBounds} from '../../geo/LatLngBounds.js';
import {Bounds} from '../../geometry/Bounds.js';

/**
 * @typedef {Object} BoxZoomEventProps
 * @property {LatLngBounds} boxZoomBounds The geographical bounds of the box the map zooms to.
 */

/** @import {Point} from '../../geometry/Point.js' */

// Adds shift-drag zoom interaction to the map (zoom to a selected bounding box), enabled by default.
export class BoxZoomHandler extends Handler {
	addHooks() {
		DomEvent.on(this._map._container, 'pointerdown', this._onPointerDown, this);
	}

	removeHooks() {
		DomEvent.off(this._map._container, 'pointerdown', this._onPointerDown, this);
	}

	moved() {
		return this._moved;
	}

	_resetState() {
		clearTimeout(this._resetStateTimeout);
		this._moved = false;
	}

	/** @param {typeof DomEvent.on} onOff */
	_toggleListeners(onOff) {
		onOff(this._map._container, {
			contextmenu: DomEvent.stop,
			pointermove: this._onPointerMove,
			pointerup: this._onPointerUp
		}, this);
		onOff(document, 'keydown', this._onKeyDown, this);
	}

	/** @param {PointerEvent} e */
	_onPointerDown(e) {
		if (!e.shiftKey || (e.button !== 0)) { return false; }

		// also cancels a deferred reset that hasn't run yet, which would interrupt the interaction and orphan a box
		this._resetState();

		// stops both text selection and native image drag in every engine without restyling the page; it also
		// suppresses compatibility mouse events, which is fine for a press that is already a box zoom gesture
		DomEvent.preventDefault(e);

		/** @type {Point} */
		this._startPoint = this._map.pointerEventToContainerPoint(e);

		this._toggleListeners(DomEvent.on);
	}

	/** @param {PointerEvent} e */
	_onPointerMove(e) {
		const map = this._map;

		if (!this._moved) {
			this._moved = true;

			/** @type {HTMLDivElement} */
			this._box = DomUtil.create('div', 'leaflet-zoom-box', map._container);
			map._container.classList.add('leaflet-crosshair');

			map.fire('boxzoomstart');
		}

		/** @type {Point} */
		this._point = map.pointerEventToContainerPoint(e);

		const bounds = new Bounds(this._point, this._startPoint),
		size = bounds.getSize();

		DomUtil.setPosition(this._box, bounds.min);

		this._box.style.width  = `${size.x}px`;
		this._box.style.height = `${size.y}px`;
	}

	_finish() {
		if (this._moved) {
			this._box.remove();
			this._map._container.classList.remove('leaflet-crosshair');
		}

		this._toggleListeners(DomEvent.off);
	}

	/** @param {PointerEvent} e */
	_onPointerUp(e) {
		if (e.button !== 0) { return; }

		this._finish();

		if (!this._moved) { return; }
		// Postpone to next JS tick so internal click event handling
		// still see it as "moved".
		this._resetStateTimeout = setTimeout(() => this._resetState(), 0);

		const bounds = new LatLngBounds(
			this._map.containerPointToLatLng(this._startPoint),
			this._map.containerPointToLatLng(this._point));

		// a tiny box can collapse to a single LatLng at very high zoom, which fits at an Infinity zoom when no layer
		// limits it; unlike fitBounds before a tile layer is added, no layer will come along to clamp it (#6709)
		if (this._map.getBoundsZoom(bounds) !== Infinity) {
			this._map.fitBounds(bounds);
		}
		this._map.fire('boxzoomend', {boxZoomBounds: bounds});
	}

	/** @param {KeyboardEvent} e */
	_onKeyDown(e) {
		if (e.code === 'Escape') {
			this._finish();
			this._resetState();
		}
	}
}

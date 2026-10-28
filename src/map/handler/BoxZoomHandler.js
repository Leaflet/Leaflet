import {Handler} from '../../core/Handler.js';
import * as DomUtil from '../../dom/DomUtil.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {LatLngBounds} from '../../geo/LatLngBounds.js';
import {Bounds} from '../../geometry/Bounds.js';

/*
 * Handler.BoxZoom is used to add shift-drag zoom interaction to the map
 * (zoom to a selected bounding box), enabled by default.
 */

export class BoxZoomHandler extends Handler {
	static initHooks = true;

	constructor(map) {
		super(map);
		this._container = map._container;
		this._pane = map._panes.overlayPane;
		this._resetStateTimeout = 0;
		map.on('unload', this._destroy, this);

		this.callInitHooks();
	}

	addHooks() {
		DomEvent.on(this._container, 'pointerdown', this._onPointerDown, this);
	}

	removeHooks() {
		DomEvent.off(this._container, 'pointerdown', this._onPointerDown, this);
	}

	moved() {
		return this._moved;
	}

	_destroy() {
		this._pane.remove();
		delete this._pane;
	}

	_resetState() {
		this._resetStateTimeout = 0;
		this._moved = false;
	}

	_clearDeferredResetState() {
		if (this._resetStateTimeout !== 0) {
			clearTimeout(this._resetStateTimeout);
			this._resetStateTimeout = 0;
		}
	}

	_onPointerDown(e) {
		if (!e.shiftKey || (e.button !== 0)) { return false; }

		// Clear the deferred resetState if it hasn't executed yet, otherwise it
		// will interrupt the interaction and orphan a box element in the container.
		this._clearDeferredResetState();
		this._resetState();

		// stops both text selection and native image drag in every engine without restyling the page; it also
		// suppresses compatibility mouse events, which is fine for a press that is already a box zoom gesture
		DomEvent.preventDefault(e);

		this._startPoint = this._map.pointerEventToContainerPoint(e);

		DomEvent.on(this._container, {
			contextmenu: DomEvent.stop,
			pointermove: this._onPointerMove,
			pointerup: this._onPointerUp,
			keydown: this._onKeyDown
		}, this);
		DomEvent.on(document, 'keydown', this._onKeyDown, this);
	}

	_onPointerMove(e) {
		if (!this._moved) {
			this._moved = true;

			this._box = DomUtil.create('div', 'leaflet-zoom-box', this._container);
			this._container.classList.add('leaflet-crosshair');

			this._map.fire('boxzoomstart');
		}

		this._point = this._map.pointerEventToContainerPoint(e);

		const bounds = new Bounds(this._point, this._startPoint),
		size = bounds.getSize();

		DomUtil.setPosition(this._box, bounds.min);

		this._box.style.width  = `${size.x}px`;
		this._box.style.height = `${size.y}px`;
	}

	_finish() {
		if (this._moved) {
			this._box.remove();
			this._container.classList.remove('leaflet-crosshair');
		}

		DomEvent.off(this._container, {
			contextmenu: DomEvent.stop,
			pointermove: this._onPointerMove,
			pointerup: this._onPointerUp,
		}, this);
		DomEvent.off(document, 'keydown', this._onKeyDown, this);
	}

	_onPointerUp(e) {
		if (e.button !== 0) { return; }

		this._finish();

		if (!this._moved) { return; }
		// Postpone to next JS tick so internal click event handling
		// still see it as "moved".
		this._clearDeferredResetState();
		this._resetStateTimeout = setTimeout(this._resetState.bind(this), 0);

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

	_onKeyDown(e) {
		if (e.code === 'Escape') {
			this._finish();
			this._clearDeferredResetState();
			this._resetState();
		}
	}
}

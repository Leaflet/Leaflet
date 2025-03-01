import {Map} from '../Map.js';
import {Handler} from '../../core/Handler.js';
import * as DomUtil from '../../dom/DomUtil.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {LatLngBounds} from '../../geo/LatLngBounds.js';
import {Bounds} from '../../geometry/Bounds.js';

/*
 * L.Handler.BoxZoom is used to add shift-drag zoom interaction to the map
 * (zoom to a selected bounding box), enabled by default.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @option boxZoom: Boolean = true
	// Whether the map can be zoomed to a rectangular area specified by
	// dragging the pointer while pressing the shift key.
	boxZoom: true
});

export const BoxZoom = Handler.extend({
	initialize(map) {
		this._map = map;
		this._container = map._container;
		this._pane = map._panes.overlayPane;
		this._resetStateTimeout = 0;
		map.on('unload', this._destroy, this);
	},

	addHooks() {
		DomEvent.on(this._container, 'pointerdown', this._onPointerDown, this);
	},

	removeHooks() {
		DomEvent.off(this._container, 'pointerdown', this._onPointerDown, this);
	},

	moved() {
		return this._moved;
	},

	_destroy() {
		this._pane.remove();
		delete this._pane;
	},

	_resetState() {
		this._resetStateTimeout = 0;
		this._moved = false;
	},

	_clearDeferredResetState() {
		if (this._resetStateTimeout !== 0) {
			clearTimeout(this._resetStateTimeout);
			this._resetStateTimeout = 0;
		}
	},

	_onPointerDown(e) {
		if (!e.shiftKey || (e.button !== 0)) { return false; }

		// Clear the deferred resetState if it hasn't executed yet, otherwise it
		// will interrupt the interaction and orphan a box element in the container.
		this._clearDeferredResetState();
		this._resetState();

		DomUtil.disableTextSelection();
		DomUtil.disableImageDrag();

		this._startPoint = this._map.mouseEventToContainerPoint(e);

		DomEvent.on(document, {
			contextmenu: DomEvent.stop,
			pointermove: this._onPointerMove,
			pointerup: this._onPointerUp,
			keydown: this._onKeyDown
		}, this);
	},

	_onPointerMove(e) {
		if (!this._moved) {
			this._moved = true;

			this._box = DomUtil.create('div', 'leaflet-zoom-box', this._container);
			this._container.classList.add('leaflet-crosshair');

			this._map.fire('boxzoomstart');
		}

		this._point = this._map.mouseEventToContainerPoint(e);

		const bounds = new Bounds(this._point, this._startPoint),
		    size = bounds.getSize();

		DomUtil.setPosition(this._box, bounds.min);

		this._box.style.width  = `${size.x}px`;
		this._box.style.height = `${size.y}px`;
	},

	_finish() {
		if (this._moved) {
			this._box.remove();
			this._container.classList.remove('leaflet-crosshair');
		}

		DomUtil.enableTextSelection();
		DomUtil.enableImageDrag();

		DomEvent.off(document, {
			contextmenu: DomEvent.stop,
			pointermove: this._onPointerMove,
			pointerup: this._onPointerUp,
			keydown: this._onKeyDown
		}, this);
	},

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

		this._map
			.fitBounds(bounds)
			.fire('boxzoomend', {boxZoomBounds: bounds});
	},

	_onKeyDown(e) {
		if (e.code === 'Escape') {
			this._finish();
			this._clearDeferredResetState();
			this._resetState();
		}
	}
});

// @section Handlers
// @property boxZoom: Handler
// Box (shift-drag with pointer) zoom handler.
Map.addInitHook('addHandler', 'boxZoom', BoxZoom);

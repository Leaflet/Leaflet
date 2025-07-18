import {Map} from '../Map.js';
import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';
import * as PointerEvents from '../../dom/DomEvent.PointerEvents.js';

/*
 * Handler.PinchZoom is used by Map to add pinch zoom on supported mobile browsers.
 */

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Touch interaction options
	// @option pinchZoom: Boolean|String = *
	// Whether the map can be zoomed by touch-dragging with two fingers. If
	// passed `'center'`, it will zoom to the center of the view regardless of
	// where the touch events (fingers) were. Enabled for touch-capable web
	// browsers.
	pinchZoom: true,

	// @option bounceAtZoomLimits: Boolean = true
	// Set it to false if you don't want the map to zoom beyond min/max zoom
	// and then bounce back when pinch-zooming.
	bounceAtZoomLimits: true
});

export class PinchZoom extends Handler {
	addHooks() {
		this._map._container.classList.add('leaflet-touch-zoom');
		DomEvent.on(this._map._container, 'pointerdown', this._onPointerStart, this);
	}

	removeHooks() {
		this._map._container.classList.remove('leaflet-touch-zoom');
		DomEvent.off(this._map._container, 'pointerdown', this._onPointerStart, this);
	}

	_onPointerStart(e) {
		const map = this._map;

		const pointers = PointerEvents.getPointers();
		if (pointers.length !== 2 || map._animatingZoom || this._zooming) { return; }

		const p1 = map.pointerEventToContainerPoint(pointers[0]),
		p2 = map.pointerEventToContainerPoint(pointers[1]);

		this._centerPoint = map.getSize()._divideBy(2);
		this._startLatLng = map.containerPointToLatLng(this._centerPoint);
		if (map.options.pinchZoom !== 'center') {
			this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
		}

		this._startDist = p1.distanceTo(p2);
		this._startZoom = map.getZoom();

		this._moved = false;
		this._zooming = true;

		map._stop();

		DomEvent.on(document, 'pointermove', this._onPointerMove, this);
		DomEvent.on(document, 'pointerup pointercancel', this._onPointerEnd, this);

		DomEvent.preventDefault(e);
	}

	_onPointerMove(e) {
		const pointers = PointerEvents.getPointers();
		if (pointers.length !== 2 || !this._zooming) { return; }

		const map = this._map,
		p1 = map.pointerEventToContainerPoint(pointers[0]),
		p2 = map.pointerEventToContainerPoint(pointers[1]),
		scale = p1.distanceTo(p2) / this._startDist;

		this._zoom = map.getScaleZoom(scale, this._startZoom);

		if (!map.options.bounceAtZoomLimits && (
			(this._zoom < map.getMinZoom() && scale < 1) ||
			(this._zoom > map.getMaxZoom() && scale > 1))) {
			this._zoom = map._limitZoom(this._zoom);
		}

		if (map.options.pinchZoom === 'center') {
			this._center = this._startLatLng;
			if (scale === 1) { return; }
		} else {
			// Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
			const delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
			if (scale === 1 && delta.x === 0 && delta.y === 0) { return; }
			this._center = map.unproject(map.project(this._pinchStartLatLng, this._zoom).subtract(delta), this._zoom);
		}

		if (!this._moved) {
			map._moveStart(true, false);
			this._moved = true;
		}

		cancelAnimationFrame(this._animRequest);

		const moveFn = map._move.bind(map, this._center, this._zoom, {pinch: true, round: false}, undefined);
		this._animRequest = requestAnimationFrame(moveFn.bind(this));

		DomEvent.preventDefault(e);
	}

	_onPointerEnd() {
		if (!this._moved || !this._zooming) {
			this._zooming = false;
			return;
		}

		this._zooming = false;
		cancelAnimationFrame(this._animRequest);

		DomEvent.off(document, 'pointermove', this._onPointerMove, this);
		DomEvent.off(document, 'pointerup pointercancel', this._onPointerEnd, this);

		// Pinch updates GridLayers' levels only when zoomSnap is off, so zoomSnap becomes noUpdate.
		if (this._map.options.zoomAnimation) {
			this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, this._map.options.zoomSnap);
		} else {
			this._map._resetView(this._center, this._map._limitZoom(this._zoom));
		}
	}
}

// @section Handlers
// @property pinchZoom: Handler
// Pinch zoom handler.
Map.addInitHook('addHandler', 'pinchZoom', PinchZoom);

// Deprecated - Backward compatibility touchZoom
Map.addInitHook(function () {
	this.touchZoom = this.pinchZoom;

	if (this.options.touchZoom !== undefined) {
		console.warn('Map: touchZoom option is deprecated and will be removed in future versions. Use pinchZoom instead.');
		this.options.pinchZoom = this.options.touchZoom;
		delete this.options.touchZoom;
	}
	if (this.options.pinchZoom) {
		this.pinchZoom.enable();
	} else {
		this.pinchZoom.disable();
	}
});

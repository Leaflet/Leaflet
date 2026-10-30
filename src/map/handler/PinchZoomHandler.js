import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {getPointers} from '../../dom/DomEventUtil.js';
import * as DomUtil from '../../dom/DomUtil.js';
import {Point} from '../../geometry/Point.js';

/** @import {LatLng} from '../../geo/LatLng.js' */

// Adds pinch zoom on touch devices, enabled by default.
export class PinchZoomHandler extends Handler {
	addHooks() {
		this._map._container.classList.add('leaflet-touch-zoom');
		DomEvent.on(this._map._container, 'pointerdown', this._onPointerStart, this);
	}

	removeHooks() {
		this._map._container.classList.remove('leaflet-touch-zoom');
		DomEvent.off(this._map._container, 'pointerdown', this._onPointerStart, this);
		DomEvent.off(this._map._container, 'pointermove', this._onPointerMove, this);
		DomEvent.off(this._map._container, 'pointerup pointercancel', this._onPointerEnd, this);
	}

	/** @param {PointerEvent} e */
	_onPointerStart(e) {
		const map = this._map;

		const pointers = getPointers();
		if (pointers.length !== 2 || map._animatingZoom || this._zooming) { return; }

		const p1 = map.pointerEventToContainerPoint(pointers[0]);
		const p2 = map.pointerEventToContainerPoint(pointers[1]);
		const {x, y} = DomUtil.getScale(map._container);

		// the container doesn't move during a pinch, so keep its client offset and CSS scale to avoid reading layout on every move
		/** @type {Point} */
		this._containerScale = new Point(x, y);
		/** @type {Point} */
		this._containerOrigin = new Point(pointers[0].clientX, pointers[0].clientY)._subtract(p1.scaleBy(this._containerScale));

		/** @type {Point} */
		this._centerPoint = map.getSize()._divideBy(2);
		/** @type {LatLng} */
		this._startLatLng = map.containerPointToLatLng(this._centerPoint);
		if (map.options.pinchZoom !== 'center') {
			/** @type {LatLng} */
			this._pinchStartLatLng = map.containerPointToLatLng(p1.add(p2)._divideBy(2));
		}

		/** @type {number} */
		this._startDist = p1.distanceTo(p2);
		/** @type {number} */
		this._startZoom = map.getZoom();

		this._moved = false;
		this._zooming = true;

		map._stop();

		DomEvent.on(this._map._container, 'pointermove', this._onPointerMove, this);
		DomEvent.on(this._map._container, 'pointerup pointercancel', this._onPointerEnd, this);

		e.preventDefault();
	}

	/** @param {PointerEvent} e */
	_onPointerMove(e) {
		const pointers = getPointers();
		if (pointers.length !== 2 || !this._zooming) { return; }

		const map = this._map,
		p1 = this._toContainerPoint(pointers[0]),
		p2 = this._toContainerPoint(pointers[1]),
		scale = p1.distanceTo(p2) / this._startDist;

		/** @type {number} */
		this._zoom = map.getScaleZoom(scale, this._startZoom);

		if (!map.options.bounceAtZoomLimits && (
			(this._zoom < map.getMinZoom() && scale < 1) ||
			(this._zoom > map.getMaxZoom() && scale > 1))) {
			this._zoom = map._limitZoom(this._zoom);
		}

		if (map.options.pinchZoom === 'center') {
			/** @type {LatLng} */
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
		/** @type {number} */
		this._animRequest = requestAnimationFrame(moveFn.bind(this));

		e.preventDefault();
	}

	/** @param {PointerEvent} e */
	_toContainerPoint(e) {
		return new Point(e.clientX, e.clientY)._subtract(this._containerOrigin).unscaleBy(this._containerScale);
	}

	_onPointerEnd() {
		DomEvent.off(this._map._container, 'pointermove', this._onPointerMove, this);
		DomEvent.off(this._map._container, 'pointerup pointercancel', this._onPointerEnd, this);

		if (!this._moved || !this._zooming) {
			this._zooming = false;
			return;
		}

		this._zooming = false;
		cancelAnimationFrame(this._animRequest);

		// Pinch updates GridLayers' levels only when zoomSnap is off, so zoomSnap becomes noUpdate.
		if (this._map._zoomAnimated) {
			this._map._animateZoom(this._center, this._map._limitZoom(this._zoom), true, !!this._map.options.zoomSnap);
		} else {
			this._map._resetView(this._center, this._map._limitZoom(this._zoom));
		}
	}
}

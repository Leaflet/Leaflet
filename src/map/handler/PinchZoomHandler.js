import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {getPointers} from '../../dom/DomEventUtil.js';
import * as DomUtil from '../../dom/DomUtil.js';
import {Point} from '../../geometry/Point.js';
import {pinchVelocity, recordPinchZoom, snapPinchZoom} from './pinchSnap.js';

/** @import {LatLng} from '../../geo/LatLng.js' */
/** @import {ZoomSample} from './pinchSnap.js' */

/** Zooms with a two-finger pinch on touch devices (`map.pinchZoom`), enabled by default. */
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
		if (pointers.length !== 2 || this._zooming) { return; }

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
		const pinchPoint = map.options.pinchZoom === 'center' ? this._centerPoint : p1.add(p2)._divideBy(2);
		/** @type {LatLng} */
		this._pinchStartLatLng = map.containerPointToLatLng(pinchPoint);
		/** @type {Point} */
		this._pinchOffset = pinchPoint.subtract(this._centerPoint);

		/** @type {number} */
		this._startDist = p1.distanceTo(p2);
		/** @type {number} */
		this._startZoom = map.getZoom();
		/** @type {number} */
		this._zoom = this._startZoom;
		/** @type {ZoomSample[]} */
		this._zoomSamples = [];
		recordPinchZoom(this._zoomSamples, this._zoom, e.timeStamp);

		this._zooming = true;

		map._stop();
		// a pinch takes over a running zoom animation from the view it's at, and the move goes on
		this._moved = map._stopZoomAnim(true);

		DomEvent.on(map._container, 'pointermove', this._onPointerMove, this);
		DomEvent.on(map._container, 'pointerup pointercancel', this._onPointerEnd, this);

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
		recordPinchZoom(this._zoomSamples, this._zoom, e.timeStamp);

		if (map.options.pinchZoom !== 'center') {
			// Get delta from pinch to center, so centerLatLng is delta applied to initial pinchLatLng
			const delta = p1._add(p2)._divideBy(2)._subtract(this._centerPoint);
			if (scale === 1 && delta.equals(this._pinchOffset)) { return; }
			this._pinchOffset = delta;
		} else if (scale === 1) { return; }

		if (!this._moved) {
			map._moveStart(true, false, e);
			this._moved = true;
		}
		map._pinchTo(this._pinchStartLatLng, this._pinchOffset, this._zoom);

		e.preventDefault();
	}

	/** @param {PointerEvent} e */
	_toContainerPoint(e) {
		return new Point(e.clientX, e.clientY)._subtract(this._containerOrigin).unscaleBy(this._containerScale);
	}

	/** @param {PointerEvent} e */
	_onPointerEnd(e) {
		DomEvent.off(this._map._container, 'pointermove', this._onPointerMove, this);
		DomEvent.off(this._map._container, 'pointerup pointercancel', this._onPointerEnd, this);

		if (!this._moved || !this._zooming) {
			this._zooming = false;
			return;
		}

		this._zooming = false;

		const map = this._map,
		now = e.timeStamp,
		zoom = snapPinchZoom(map, this._zoomSamples, now);

		// keep the location between the fingers in place while snapping, carrying on at the pinch's speed
		map._animateZoom(this._pinchStartLatLng, this._pinchOffset, zoom,
			{continued: true, velocity: pinchVelocity(this._zoomSamples, now)});
	}
}

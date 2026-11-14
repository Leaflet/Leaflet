import * as DomEvent from '../../dom/DomEvent.js';
import {getPointers} from '../../dom/DomEventUtil.js';
import * as DomUtil from '../../dom/DomUtil.js';
import {Point} from '../../geometry/Point.js';
import {PinchGestureHandler, pinchVelocity, recordPinchZoom} from './PinchGestureHandler.js';

/** Zooms with a two-finger pinch on touch devices (`map.pinchZoom`), enabled by default. */
export class PinchZoomHandler extends PinchGestureHandler {
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

		/** @type {number} */
		this._startDist = p1.distanceTo(p2);
		// a pinch takes over a running zoom animation from the view it's at, and the move goes on
		/** @type {boolean} */
		this._moved = this._startPinch(map.options.pinchZoom === 'center' ? undefined : p1.add(p2)._divideBy(2));
		recordPinchZoom(this._zoomSamples, this._startZoom, e.timeStamp);

		this._zooming = true;

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

		let zoom = map.getScaleZoom(scale, this._startZoom);

		if (!map.options.bounceAtZoomLimits && (
			(zoom < map.getMinZoom() && scale < 1) ||
			(zoom > map.getMaxZoom() && scale > 1))) {
			zoom = map._limitZoom(zoom);
		}
		recordPinchZoom(this._zoomSamples, zoom, e.timeStamp);

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
		map._pinchTo(this._pinchLatLng, this._pinchOffset, zoom);

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

		// keep the location between the fingers in place while snapping, carrying on at the pinch's speed
		const now = e.timeStamp;
		this._snapPinch(now, pinchVelocity(this._zoomSamples, now));
	}
}

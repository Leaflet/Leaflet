import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {recordPinchZoom, snapPinchZoom} from './pinchSnap.js';

/** @import {LatLng} from '../../geo/LatLng.js' */
/** @import {Point} from '../../geometry/Point.js' */
/** @import {ZoomSample} from './pinchSnap.js' */

// how long a trackpad pinch can pause before it counts as ended and the zoom snaps
const pinchEndDelay = 200;

/**
 * Zooms with the mouse scroll wheel (`map.scrollWheelZoom`), enabled by default. Also handles trackpad pinch, which
 * browsers report as `ctrlKey` wheel events.
 */
export class ScrollWheelZoomHandler extends Handler {
	addHooks() {
		DomEvent.on(this._map._container, 'wheel', this._onWheelScroll, this);

		/** @type {number} */
		this._delta = 0;
	}

	removeHooks() {
		DomEvent.off(this._map._container, 'wheel', this._onWheelScroll, this);
		clearTimeout(this._timer);
		clearTimeout(this._pinchTimer);
		cancelAnimationFrame(this._animRequest);
		if (this._pinching) { this._map._subpixelOrigin = false; }
		this._pinching = false;
	}

	/** @param {WheelEvent} e */
	_onWheelScroll(e) {
		DomEvent.stop(e);

		// a pinch comes as small fractional pixel deltas, while ctrl+wheel on a mouse gives whole notches of 100+ px
		if (e.ctrlKey && !e.deltaMode && (this._pinching || e.deltaY % 1 && Math.abs(e.deltaY) < 50)) {
			this._onPinch(e);
			return;
		}

		const delta = DomEvent.getWheelDelta(e);

		const debounce = this._map.options.wheelDebounceTime;

		this._delta += delta;
		// resolving the container point reads layout, so defer it to _performZoom
		/** @type {WheelEvent} */
		this._lastEvent = e;

		if (!this._startTime) {
			this._startTime = Date.now();
		}

		const left = Math.max(debounce - (Date.now() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(this._performZoom.bind(this), left);
	}

	_performZoom() {
		const map = this._map,
		zoom = map.getZoom(),
		snap = map.options.zoomSnap ?? 0;

		map._stop(); // stop panning and fly animations if any

		// map the delta with a sigmoid function to -4..4 range leaning on -1..1
		const d2 = this._delta / (map.options.wheelPxPerZoomLevel * 4),
		d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
		d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
		// with reduced motion, only zooms by up to one level are animated, so a hard scroll is capped to that
		d5 = map._prefersReducedMotion() ? Math.min(d4, 1) : d4,
		delta = map._limitZoom(zoom + (this._delta > 0 ? d5 : -d5)) - zoom;

		this._delta = 0;
		this._startTime = null;

		if (!delta || map._zoomInputBlocked()) { return; }

		const options = {originalEvent: this._lastEvent};
		if (map.options.scrollWheelZoom === 'center') {
			map.setZoom(zoom + delta, options);
		} else {
			map.setZoomAround(map.pointerEventToContainerPoint(this._lastEvent), zoom + delta, options);
		}
	}

	/** @param {WheelEvent} e */
	_onPinch(e) {
		const map = this._map;

		if (!this._pinching) {
			if (map._zoomInputBlocked()) { return; }

			map._stop();
			clearTimeout(this._timer);
			this._delta = 0;
			this._startTime = null;

			/** @type {number} */
			this._startZoom = map.getZoom();
			/** @type {number} */
			this._pinchScale = 1;
			/** @type {ZoomSample[]} */
			this._zoomSamples = [];
			const centerPoint = map.getSize()._divideBy(2),
			// the pointer stays put during a trackpad pinch, so resolve it (reading layout) only once
			pinchPoint = map.options.scrollWheelZoom === 'center' ? centerPoint : map.pointerEventToContainerPoint(e);
			/** @type {Point} */
			this._pinchOffset = pinchPoint.subtract(centerPoint);
			/** @type {LatLng} */
			this._pinchLatLng = map.containerPointToLatLng(pinchPoint);

			this._pinching = true;
			map._moveStart(true, false, e);
			// keep layers from jittering against the zoom, like during flyTo; the end of the pinch snaps them again
			map._subpixelOrigin = true;
		}

		// browsers set deltaY to -100 times the natural log of the pinch scale change since the last event
		this._pinchScale *= Math.exp(-e.deltaY / 100);

		let zoom = map.getScaleZoom(this._pinchScale, this._startZoom);
		if (!map.options.bounceAtZoomLimits) {
			zoom = Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), zoom));
		}
		/** @type {number} */
		this._zoom = zoom;
		recordPinchZoom(this._zoomSamples, zoom);

		const center = map._centerAround(this._pinchLatLng, this._pinchOffset, zoom);

		cancelAnimationFrame(this._animRequest);
		/** @type {number} */
		this._animRequest = requestAnimationFrame(() => map._move(center, zoom, {pinch: true}));

		clearTimeout(this._pinchTimer);
		/** @type {ReturnType<typeof setTimeout>} */
		this._pinchTimer = setTimeout(this._endPinch.bind(this), pinchEndDelay);
	}

	_endPinch() {
		this._pinching = false;
		clearTimeout(this._pinchTimer);
		cancelAnimationFrame(this._animRequest);

		const map = this._map,
		// there's no end event, so measure the direction from the last wheel event rather than from the timeout
		zoom = snapPinchZoom(map, this._zoomSamples, this._zoomSamples[this._zoomSamples.length - 1].time),
		center = map._centerAround(this._pinchLatLng, this._pinchOffset, zoom);
		map._subpixelOrigin = false;

		// same as the end of a touch pinch: GridLayers only follow it without zoomSnap, so zoomSnap becomes noUpdate
		if (map._zoomAnimated) {
			map._animateZoom(center, zoom, !!map.options.zoomSnap);
		} else {
			map._resetView(center, zoom, false, map._moveEvent);
		}
	}
}

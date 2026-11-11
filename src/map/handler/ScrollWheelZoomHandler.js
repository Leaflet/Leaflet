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
			this._onPinch(e, e.deltaY / 100);
			return;
		}

		// a trackpad scroll follows the fingers like a pinch, at half its rate (as in MapLibre)
		const deltaY = this._classify(e);
		if (this._kind === 'trackpad') {
			this._onPinch(e, deltaY / 200);
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
			/** @type {boolean} */
			this._continued = this._gap < 100;
		}

		const left = Math.max(debounce - (Date.now() - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(this._performZoom.bind(this), left);
	}

	// Tells a mouse wheel from a trackpad the way MapLibre does, once per gesture (a 400 ms pause starts a new one):
	// mouse wheels on macOS send multiples of 4.000244140625, trackpads send tiny deltas, and otherwise the time to
	// the next event decides (if none comes before the wheel debounce ends, it's a wheel). Returns the pixel delta,
	// including that of the first event of the gesture if it was held back undecided.
	/** @param {WheelEvent} e */
	_classify(e) {
		const now = Date.now(),
		gap = now - (this._lastWheelTime ?? -Infinity);
		let deltaY = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;
		this._lastWheelTime = now;
		/** @type {number} */
		this._gap = gap;

		if (deltaY && deltaY % 4.000244140625 === 0) {
			this._kind = 'wheel';
		} else if (deltaY && Math.abs(deltaY) < 4) {
			this._kind = 'trackpad';
		} else if (gap > 400) {
			this._kind = null;
		} else if (!this._kind) {
			this._kind = Math.abs(gap * deltaY) < 200 ? 'trackpad' : 'wheel';
		}

		if (this._kind === 'trackpad' && this._held) { deltaY += this._held; }
		this._held = this._kind ? 0 : deltaY;
		return deltaY;
	}

	_performZoom() {
		const map = this._map,
		pixels = this._delta;

		this._kind ??= 'wheel';
		this._held = 0;
		this._delta = 0;
		this._startTime = null;

		// notches add up from where a running zoom is heading, but a spin going on without a pause waits for it to end
		if (this._continued && map._animatingZoom) { return; }

		// count from where a running zoom animation is heading, so that notches add up
		const zoom = map._targetZoom(),
		snap = map.options.zoomSnap ?? 0;

		map._stop(); // stop panning and fly animations if any

		// map the delta with a sigmoid function to -4..4 range leaning on -1..1
		const d2 = pixels / (map.options.wheelPxPerZoomLevel * 4),
		d3 = 4 * Math.log(2 / (1 + Math.exp(-Math.abs(d2)))) / Math.LN2,
		d4 = snap ? Math.ceil(d3 / snap) * snap : d3,
		// with reduced motion, only zooms by up to one level are animated, so a hard scroll is capped to that
		d5 = map._prefersReducedMotion() ? Math.min(d4, 1) : d4,
		delta = map._limitZoom(zoom + (pixels > 0 ? d5 : -d5)) - zoom;

		if (!delta || map._zoomInputBlocked()) { return; }

		const options = {originalEvent: this._lastEvent};
		if (map.options.scrollWheelZoom === 'center') {
			map.setZoom(zoom + delta, options);
		} else {
			map.setZoomAround(map.pointerEventToContainerPoint(this._lastEvent), zoom + delta, options);
		}
	}

	/**
	 * @param {WheelEvent} e
	 * @param {number} logScale the natural log of the zoom out scale since the last event
	 */
	_onPinch(e, logScale) {
		const map = this._map;

		if (!this._pinching) {
			if (map._zoomInputBlocked()) { return; }

			map._stop();
			// a pinch takes over a running zoom animation, e.g. the snap of a pinch that paused for too long
			const takeOver = map._stopZoomAnim(true);
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
			if (!takeOver) { map._moveStart(true, false, e); }
			// keep layers from jittering against the zoom, like during flyTo; the end of the pinch snaps them again
			map._subpixelOrigin = true;
		}

		// browsers set a pinch's deltaY to -100 times the natural log of the scale change since the last event
		this._pinchScale *= Math.exp(-logScale);

		let zoom = map.getScaleZoom(this._pinchScale, this._startZoom);
		// a scroll stops at the zoom limits like a wheel, as does a pinch without bounce, and turning back zooms at once
		if (!e.ctrlKey || !map.options.bounceAtZoomLimits) {
			const limited = Math.max(map.getMinZoom(), Math.min(map.getMaxZoom(), zoom));
			if (limited !== zoom) {
				this._startZoom = zoom = limited;
				this._pinchScale = 1;
			}
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
		zoom = snapPinchZoom(map, this._zoomSamples, this._zoomSamples[this._zoomSamples.length - 1].time);

		// the map has been still for pinchEndDelay, so the snap starts at rest
		if (map._zoomAnimated) {
			map._animateZoom(this._pinchLatLng, this._pinchOffset, zoom, {continued: true});
		} else {
			map._subpixelOrigin = false;
			map._resetView(map._centerAround(this._pinchLatLng, this._pinchOffset, zoom), zoom, false, map._moveEvent);
		}
	}
}

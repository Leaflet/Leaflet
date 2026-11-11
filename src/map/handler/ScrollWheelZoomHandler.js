import * as DomEvent from '../../dom/DomEvent.js';
import {PinchGestureHandler, pinchVelocity, recordPinchZoom} from './PinchGestureHandler.js';

/** @import {ZoomSample} from './PinchGestureHandler.js' */

// a trackpad gesture has no end event (but for a pinch in Safari), so it ends after a pause of a few times the usual
// gap between its events (a frame or so), within these bounds in ms
const endGaps = 4, minEndDelay = 50, maxEndDelay = 200;

// after a flick, macOS keeps sending scroll momentum that slows down at a steady rate (a time constant of ~150 ms in
// Chrome and Safari), its tiny last deltas going on for ~300 ms after the zoom looks still; so once a fast scroll
// (over 4 levels/s) has slowed down to 2.5 levels/s, the snap takes over from there, aiming where the momentum ends
const coastPeak = 4e-3, coastSpeed = 2.5e-3, coastDecay = 150;

/**
 * Zooms with the mouse scroll wheel (`map.scrollWheelZoom`), enabled by default. Also handles trackpad pinch, which
 * browsers report as `ctrlKey` wheel events.
 */
export class ScrollWheelZoomHandler extends PinchGestureHandler {
	addHooks() {
		DomEvent.on(this._map._container, 'wheel', this._onWheelScroll, this);
		DomEvent.on(this._map._container, 'gestureend', this._onGestureEnd, this);

		/** @type {number} */
		this._delta = 0;
	}

	removeHooks() {
		DomEvent.off(this._map._container, 'wheel', this._onWheelScroll, this);
		DomEvent.off(this._map._container, 'gestureend', this._onGestureEnd, this);
		clearTimeout(this._timer);
		clearTimeout(this._pinchTimer);
		cancelAnimationFrame(this._endRequest);
		if (this._pinching) {
			cancelAnimationFrame(this._map._pinchFrame);
			this._map._setZooming(false);
		}
		this._pinching = false;
	}

	/** @param {WheelEvent} e */
	_onWheelScroll(e) {
		DomEvent.stop(e);

		// time the gaps between events by when their input happened, which is steadier than when they come
		const time = e.timeStamp;
		/** @type {number} */
		this._gap = time - (this._lastTime ?? -Infinity);
		/** @type {number} */
		this._lastTime = time;

		// a pinch comes as small fractional pixel deltas, while ctrl+wheel on a mouse gives whole notches of 100+ px
		if (e.ctrlKey && !e.deltaMode && (this._pinching || e.deltaY % 1 && Math.abs(e.deltaY) < 50)) {
			// Safari sends one more tiny wheel event right after gestureend, which would start a new pinch
			if (!this._pinching && time - this._gestureEndTime < 50) { return; }
			this._onPinch(e, e.deltaY / 100);
			return;
		}

		const deltaY = this._classify(e);
		if (this._kind === 'trackpad') {
			this._onScroll(e, deltaY);
			return;
		}

		const delta = DomEvent.getWheelDelta(e);

		const debounce = this._map.options.wheelDebounceTime;

		this._delta += delta;
		// resolving the container point reads layout, so defer it to _performZoom
		/** @type {WheelEvent} */
		this._lastEvent = e;

		if (!this._startTime) {
			this._startTime = time;
			/** @type {boolean} */
			this._continued = this._gap < 100;
		}

		const left = Math.max(debounce - (time - this._startTime), 0);

		clearTimeout(this._timer);
		this._timer = setTimeout(this._performZoom.bind(this), left);
	}

	// Tells a mouse wheel from a trackpad the way MapLibre does, once per gesture (a 400 ms pause starts a new one):
	// mouse wheels on macOS send multiples of 4.000244140625, trackpads send tiny deltas, and otherwise the time to
	// the next event decides (if none comes before the wheel debounce ends, it's a wheel). Returns the pixel delta,
	// including that of the first event of the gesture if it was held back undecided.
	/** @param {WheelEvent} e */
	_classify(e) {
		const gap = this._gap;
		let deltaY = e.deltaMode === 1 ? e.deltaY * 40 : e.deltaY;

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

	/**
	 * A trackpad scroll follows the fingers like a pinch, at half its rate (as in MapLibre).
	 * @param {WheelEvent} e
	 * @param {number} deltaY
	 */
	_onScroll(e, deltaY) {
		if (this._gap > 100) { this._coast = null; }
		if (!this._pinching && !this._coast) {
			/** @type {ZoomSample[]} */
			this._flow = [];
			/** @type {number} */
			this._peakSpeed = 0;
		}
		// the scroll's own zoom, which goes on adding up while the snap replaces the momentum
		const flow = this._flow, time = e.timeStamp;
		recordPinchZoom(flow, (flow.at(-1)?.zoom ?? 0) - deltaY / (200 * Math.LN2), time);
		const speed = pinchVelocity(flow, time),
		coast = this._coast;

		// the snap replaces the rest of the momentum, unless the fingers push again or turn back
		if (coast) {
			const expected = coast.speed * Math.exp((coast.time - e.timeStamp) / coastDecay);
			if (speed * coast.speed >= 0 && Math.abs(speed) < Math.max(2 * Math.abs(expected), 1e-3)) { return; }
			this._coast = null;
		}

		this._onPinch(e, deltaY / 200);

		if (Math.abs(speed) > Math.abs(this._peakSpeed)) { this._peakSpeed = speed; }
		const peak = Math.abs(this._peakSpeed);
		if (this._pinching && peak > coastPeak && Math.abs(speed) < Math.min(coastSpeed, 0.4 * peak) &&
				speed * this._peakSpeed > 0) {
			/** @type {{time: number, speed: number} | null} */
			this._coast = {time: e.timeStamp, speed};
			this._endPinch(speed, speed * coastDecay);
		}
	}

	_performZoom() {
		const map = this._map,
		pixels = this._delta;

		this._kind ??= 'wheel';
		this._held = 0;
		this._delta = 0;
		this._startTime = null;

		// a spin going on without a pause waits for a running zoom to end
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

		if (this._pinching) {
			this._gaps.push(this._gap);
			if (this._gaps.length > 8) { this._gaps.shift(); }
		} else {
			if (map._zoomInputBlocked()) { return; }

			clearTimeout(this._timer);
			this._delta = 0;
			this._startTime = null;

			// the pointer stays put during a trackpad pinch, so resolve it (reading layout) only once; a pinch takes over
			// a running zoom animation, e.g. the snap of a pinch that paused for too long
			const takeOver = this._startPinch(
				map.options.scrollWheelZoom === 'center' ? undefined : map.pointerEventToContainerPoint(e));
			/** @type {number} */
			this._pinchScale = 1;
			/** @type {number[]} */
			this._gaps = [];

			this._pinching = true;
			if (!takeOver) { map._moveStart(true, false, e); }
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
		recordPinchZoom(this._zoomSamples, zoom, e.timeStamp);

		map._pinchTo(this._pinchLatLng, this._pinchOffset, zoom);

		/** @type {boolean} */
		this._ctrlPinch = e.ctrlKey;

		clearTimeout(this._pinchTimer);
		cancelAnimationFrame(this._endRequest);
		/** @type {ReturnType<typeof setTimeout>} */
		this._pinchTimer = setTimeout(this._onPinchPause.bind(this), this._endDelay());
	}

	_endDelay() {
		const gaps = Float64Array.from(this._gaps).sort();
		if (!gaps.length) { return maxEndDelay; }
		return Math.min(Math.max(endGaps * gaps[gaps.length >> 1], minEndDelay), maxEndDelay);
	}

	// after a long frame, the events that came during it are handled at the start of the next one (in Chrome), so end
	// only if that frame brings none, rather than snapping between them and having the gesture take over again
	_onPinchPause() {
		/** @type {number} */
		this._endRequest = requestAnimationFrame(() => this._endPinch());
	}

	/**
	 * Safari tells when the fingers lift off a pinch, so it can snap at once, carrying on at the fingers' speed.
	 * @param {Event} e
	 */
	_onGestureEnd(e) {
		/** @type {number} */
		this._gestureEndTime = e.timeStamp;
		if (this._pinching && this._ctrlPinch) { this._endPinch(pinchVelocity(this._zoomSamples, e.timeStamp)); }
	}

	/**
	 * @param {number} [velocity] how fast the gesture was zooming at the end, in levels per ms
	 * @param {number} [ahead] how much further it would have gone on its own
	 */
	_endPinch(velocity = 0, ahead = 0) {
		this._pinching = false;
		clearTimeout(this._pinchTimer);
		cancelAnimationFrame(this._endRequest);

		// measure the direction up to the last wheel event rather than to the end of a pause after it
		const samples = this._zoomSamples;
		this._snapPinch(samples[samples.length - 1].time, velocity, ahead);
	}
}

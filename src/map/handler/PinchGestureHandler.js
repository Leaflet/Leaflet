import {Handler} from '../../core/Handler.js';

/** @import {LatLng} from '../../geo/LatLng.js' */
/** @import {Point} from '../../geometry/Point.js' */

/** @typedef {{time: number, zoom: number}} ZoomSample */

// how far back from the end of a gesture to look for the direction it was heading and its speed
const directionWindow = 100;

// a snap going on in the gesture's direction eases out from its speed, for at most this long
const maxEaseOut = 500;

/**
 * Records the zoom of a gesture for its speed and direction, dropping samples too old to matter.
 * @param {ZoomSample[]} samples
 * @param {number} zoom
 * @param {number} time the input event's `timeStamp`, which is when the input happened rather than when the event
 *   came (Chrome hands out events in uneven batches)
 */
export function recordPinchZoom(samples, zoom, time) {
	while (samples.length && time - samples[0].time > directionWindow) { samples.shift(); }
	samples.push({time, zoom});
}

/**
 * Returns how fast a gesture was zooming, in levels per ms, over its last moments before `endTime`.
 * @param {ZoomSample[]} samples
 * @param {number} endTime
 */
export function pinchVelocity(samples, endTime) {
	const first = samples.find(s => endTime - s.time <= directionWindow),
	last = samples[samples.length - 1];
	return first ? (last.zoom - first.zoom) / Math.max(endTime - first.time, 8) : 0;
}

/**
 * The common part of a pinch on a touchscreen or a trackpad (and a trackpad's two-finger scroll): the zoom follows the
 * fingers around a point that stays in place, then snaps to a `zoomSnap` level.
 */
export class PinchGestureHandler extends Handler {
	/**
	 * Starts a pinch around `point` (in container pixels, the center if not given), stopping a pan or a flight first.
	 * Returns whether it took over a running zoom animation, which leaves the move going.
	 * @param {Point} [point]
	 */
	_startPinch(point) {
		const map = this._map;
		map._stop();
		const takeOver = map._stopZoomAnim(true);

		/** @type {Point} */
		this._centerPoint = map.getSize()._divideBy(2);
		point ??= this._centerPoint;
		/** @type {LatLng} */
		this._pinchLatLng = map.containerPointToLatLng(point);
		/** @type {Point} */
		this._pinchOffset = point.subtract(this._centerPoint);
		/** @type {number} */
		this._startZoom = map.getZoom();
		/** @type {ZoomSample[]} */
		this._zoomSamples = [];
		return takeOver;
	}

	/**
	 * Snaps the zoom a pinch ended at, leaning to where it was heading: a quarter of a `zoomSnap` step past a level in
	 * that direction goes on to the next one, so a deliberate pinch isn't undone and a slight one doesn't jump a level.
	 * Going on in that direction, the snap eases out from `velocity`; otherwise it takes longer the further it goes, so
	 * that small ones end before they read as a separate step.
	 * @param {number} endTime when the pinch ended, so that a pause before letting go leaves no direction
	 * @param {number} velocity how fast it was zooming at the end, in levels per ms
	 * @param {number} [ahead] how much further the zoom is expected to go on its own, e.g. with scroll momentum
	 */
	_snapPinch(endTime, velocity, ahead = 0) {
		const map = this._map,
		samples = this._zoomSamples,
		snap = map.options.zoomSnap,
		direction = pinchVelocity(samples, endTime);
		let zoom = samples[samples.length - 1].zoom + ahead;

		// a pinch slower than 0.1 levels/s at the end has no direction
		if (snap && Math.abs(direction) > 1e-4) {
			const steps = zoom / snap,
			from = direction > 0 ? Math.floor(steps) : Math.ceil(steps);
			if (Math.abs(steps - from) >= 0.25) { zoom = (from + Math.sign(direction)) * snap; }
		}
		zoom = map._limitZoom(zoom);

		const dz = zoom - map._zoom,
		duration = velocity * dz > 0 ? Math.min(3 * dz / velocity, maxEaseOut) : Math.min(Math.max(250 * Math.sqrt(Math.abs(dz) / 0.5), 120), 250);
		map._animateZoom(this._pinchLatLng, this._pinchOffset, zoom, {continued: true, velocity, duration});
	}
}

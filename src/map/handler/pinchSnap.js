/** @import {LeafletMap} from '../Map.js' */

/** @typedef {{time: number, zoom: number}} ZoomSample */

// how far back from the end of a pinch to look for the direction it was heading and its speed
const directionWindow = 100;

/**
 * Records the zoom of a pinch for `snapPinchZoom`, dropping samples too old to matter.
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
 * Snaps the zoom a pinch ended at, leaning to where it was heading: a quarter of a `zoomSnap` step past a level in
 * that direction goes on to the next one, so a deliberate pinch isn't undone and a slight one doesn't jump a level.
 * @param {LeafletMap} map
 * @param {ZoomSample[]} samples
 * @param {number} endTime when the pinch ended, so that a pause before letting go leaves no direction
 * @param {number} [ahead] how much further the zoom is expected to go on its own, e.g. with scroll momentum
 */
export function snapPinchZoom(map, samples, endTime, ahead = 0) {
	const snap = map.options.zoomSnap,
	zoom = samples[samples.length - 1].zoom + ahead,
	first = samples.find(s => endTime - s.time <= directionWindow),
	change = first ? zoom - first.zoom : 0;

	if (snap && Math.abs(change) > 0.01) {
		const steps = zoom / snap,
		from = change > 0 ? Math.floor(steps) : Math.ceil(steps);
		if (Math.abs(steps - from) >= 0.25) {
			return map._limitZoom((from + Math.sign(change)) * snap);
		}
	}
	return map._limitZoom(zoom);
}

/**
 * Returns how fast a pinch was zooming, in levels per ms, over its last moments before `endTime`.
 * @param {ZoomSample[]} samples
 * @param {number} endTime
 */
export function pinchVelocity(samples, endTime) {
	const first = samples.find(s => endTime - s.time <= directionWindow),
	last = samples[samples.length - 1];
	return first ? (last.zoom - first.zoom) / Math.max(endTime - first.time, 8) : 0;
}

/**
 * Returns how long a snap by `distance` zoom levels takes: small ones end before they read as a separate step.
 * @param {number} distance
 */
export function snapDuration(distance) {
	return Math.min(Math.max(250 * Math.sqrt(distance / 0.5), 120), 250);
}

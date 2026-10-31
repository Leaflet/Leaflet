import {Polygon} from './Polygon.js';
import {LatLngBounds} from '../../geo/LatLngBounds.js';

/** @import {InteractiveLayerEventMap, LatLngBoundsExpression, PolylineOptions} from '../../types.js' */

/**
 * A class for drawing rectangle overlays on a map. Extends `Polygon`.
 * @example
 * ```js
 * // define rectangle geographical bounds
 * const bounds = [[54.559322, -5.767822], [56.1210604, -3.021240]];
 *
 * // create an orange rectangle
 * new Rectangle(bounds, {color: "#ff7800", weight: 1}).addTo(map);
 *
 * // zoom the map to the rectangle bounds
 * map.fitBounds(bounds);
 * ```
 * @template {PolylineOptions} [O=PolylineOptions]
 * @template {InteractiveLayerEventMap} [E=InteractiveLayerEventMap]
 * @extends {Polygon<O, E>}
 */
export class Rectangle extends Polygon {
	static initHooks = true;

	/**
	 * Instantiates a rectangle object given geographical bounds, and an optional options object.
	 * @param {LatLngBoundsExpression} latLngBounds
	 * @param {NoInfer<Partial<O>>} [options]
	 */
	constructor(latLngBounds, options) {
		super(boundsToLatLngs(latLngBounds), options);
		this.callInitHooks();
	}

	/**
	 * Redraws the rectangle with the passed bounds.
	 * @param {LatLngBoundsExpression} latLngBounds
	 */
	setBounds(latLngBounds) {
		return this.setLatLngs(boundsToLatLngs(latLngBounds));
	}
}

/** @param {LatLngBoundsExpression} latLngBounds */
function boundsToLatLngs(latLngBounds) {
	latLngBounds = new LatLngBounds(latLngBounds);
	return [
		latLngBounds.getSouthWest(),
		latLngBounds.getNorthWest(),
		latLngBounds.getNorthEast(),
		latLngBounds.getSouthEast()
	];
}

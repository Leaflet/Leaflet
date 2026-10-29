import {Polygon} from './Polygon.js';
import {LatLngBounds} from '../../geo/LatLngBounds.js';

/*
 * Rectangle extends Polygon and creates a rectangle when passed a LatLngBounds object.
 */

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
 */
export class Rectangle extends Polygon {
	static initHooks = true;

	/**
	 * @param {LatLngBounds} latLngBounds
	 * @param {PolylineOptions} [options]
	 */
	constructor(latLngBounds, options) {
		super(boundsToLatLngs(latLngBounds), options);
		this.callInitHooks();
	}

	/**
	 * Redraws the rectangle with the passed bounds.
	 * @param {LatLngBounds} latLngBounds
	 * @returns {this}
	 */
	setBounds(latLngBounds) {
		return this.setLatLngs(boundsToLatLngs(latLngBounds));
	}
}

function boundsToLatLngs(latLngBounds) {
	latLngBounds = new LatLngBounds(latLngBounds);
	return [
		latLngBounds.getSouthWest(),
		latLngBounds.getNorthWest(),
		latLngBounds.getNorthEast(),
		latLngBounds.getSouthEast()
	];
}

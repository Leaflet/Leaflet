import {CRS} from './CRS.js';
import {haversineDistance} from '../LatLng.js';

/** @import {LatLng} from '../LatLng.js' */

/**
 * The base for CRSs that cover the whole earth, such as `EPSG3857` and `EPSG4326`: the longitude wraps around at
 * ±180°, the scale doubles on each zoom level, and `distance()` returns meters. Extend it with your own `code`,
 * `projection` and `transformation`.
 */
export class EarthCRS extends CRS {
	static wrapLng = /** @type {[number, number] | undefined} */ ([-180, 180]);

	/**
	 * The mean Earth radius in meters used by [`distance`](#earthcrs-distance), as recommended by the International
	 * Union of Geodesy and Geophysics (see https://rosettacode.org/wiki/Haversine_formula).
	 */
	static R = 6371000;

	/**
	 * Returns the distance in meters between two geographical points, using the Haversine approximation.
	 * @param {LatLng} latlng1
	 * @param {LatLng} latlng2
	 */
	static distance(latlng1, latlng2) {
		return haversineDistance(latlng1, latlng2, this.R);
	}
}

import {CRS} from './CRS.js';
import {haversineDistance} from '../LatLng.js';

/** @import {LatLng} from '../LatLng.js' */

/**
 * Serves as the base for CRS that are global such that they cover the earth. Can only be used as the base for other
 * CRS and cannot be used directly, since it does not have a `code`, `projection` or `transformation`. `distance()`
 * returns meters.
 */
export class EarthCRS extends CRS {
	/** @type {[number, number]} */
	static wrapLng = [-180, 180];

	// Mean Earth Radius, as recommended for use by
	// the International Union of Geodesy and Geophysics,
	// see https://rosettacode.org/wiki/Haversine_formula
	static R = 6371000;

	/**
	 * Returns the distance in meters between two geographical points, using the Haversine approximation.
	 * @param {LatLng} latlng1
	 * @param {LatLng} latlng2
	 * @returns {number}
	 */
	static distance(latlng1, latlng2) {
		return haversineDistance(latlng1, latlng2, this.R);
	}
}

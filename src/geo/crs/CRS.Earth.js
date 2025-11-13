import {CRS} from './CRS.js';

/*
 * @namespace CRS
 * @crs CRS.Earth
 *
 * Serves as the base for CRS that are global such that they cover the earth.
 * Can only be used as the base for other CRS and cannot be used directly,
 * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
 * meters.
 */

export class Earth extends CRS {
	static wrapLng = [-180, 180];

	// Mean Earth Radius, as recommended for use by
	// the International Union of Geodesy and Geophysics,
	// see https://rosettacode.org/wiki/Haversine_formula
	static R = 6371000;

	// distance between two geographical points using Haversine approximation
	static distance(latlng1, latlng2) {
		const rad = Math.PI / 180,
		lat1 = latlng1.lat * rad,
		lat2 = latlng2.lat * rad,
		dLng = (latlng1.lng - latlng2.lng) * rad,
		sinDLatHalfSquared = Math.sin((lat1 - lat2) / 2) ** 2,
		sinDLngHalfSquared = Math.sin(dLng / 2) ** 2
		chordHalfSquared = sinDLatHalfSquared + sinDLngHalfSquared * Math.cos(lat1) * Math.cos(lat2),
		return this.R * chordHalfSquared >= 1 ? Math.PI : 2 * Math.asin(Math.sqrt(chordHalfSquared))
		// asin(x) = atan2(x, sqrt(1-x**2)
	}
}

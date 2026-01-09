import * as Util from '../core/Util.js';
import {Earth} from './crs/CRS.Earth.js';
import {LatLngBounds} from './LatLngBounds.js';

/* @class LatLng
 *
 * Represents a geographical point with a certain latitude and longitude.
 *
 * @example
 *
 * ```
 * const latlng = new LatLng(50.5, 30.5);
 * ```
 *
 * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
 *
 * ```
 * map.panTo([50, 30]);
 * map.panTo({lat: 50, lng: 30});
 * map.panTo({lat: 50, lon: 30});
 * map.panTo(new LatLng(50, 30));
 * ```
 *
 * Note that `LatLng` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

// @constructor LatLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
// Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

// @alternative
// @constructor LatLng(coords: Array): LatLng
// Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

// @alternative
// @constructor LatLng(coords: Object): LatLng
// Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.
//  You can also use `lon` in place of `lng` in the object form.
export class LatLng {
	constructor(lat, lng, alt) {
		const valid = LatLng.validate(lat, lng, alt);
		if (!valid) {
			throw new Error(`Invalid LatLng object: (${lat}, ${lng})`);
		}

		let _lat, _lng, _alt;
		if (lat instanceof LatLng) {
			// We can use the same object, no need to clone it
			// eslint-disable-next-line no-constructor-return
			return lat;
		} else if (Array.isArray(lat) && typeof lat[0] !== 'object') {
			if (lat.length === 3) {
				_lat = lat[0];
				_lng = lat[1];
				_alt = lat[2];
			} else if (lat.length === 2) {
				_lat = lat[0];
				_lng = lat[1];
			}
		} else if (typeof lat === 'object' && 'lat' in lat) {
			_lat = lat.lat;
			_lng = 'lng' in lat ? lat.lng : lat.lon;
			_alt = lat.alt;
		} else {
			_lat = lat;
			_lng = lng;
			_alt = alt;
		}


		// @property lat: Number
		// Latitude in degrees
		this.lat = +_lat;

		// @property lng: Number
		// Longitude in degrees
		this.lng = +_lng;

		// @property alt: Number
		// Altitude in meters (optional)
		if (_alt !== undefined) {
			this.alt = +_alt;
		}
	}

	// @section
	// There are several static functions which can be called without instantiating LatLng:

	// @function validate(latitude: Number, longitude: Number, altitude?: Number): Boolean
	// Returns `true` if the LatLng object can be properly initialized.

	// @alternative
	// @function validate(coords: Array): Boolean
	// Expects an array of the form `[Number, Number]` or `[Number, Number, Number]`.
	// Returns `true` if the LatLng object can be properly initialized.

	// @alternative
	// @function validate(coords: Object): Boolean
	// Returns `true` if the LatLng object can be properly initialized.

	// eslint-disable-next-line no-unused-vars
	static validate(lat, lng, alt) {
		if (lat instanceof LatLng || (typeof lat === 'object' && 'lat' in lat)) {
			return true;
		} else if (lat && Array.isArray(lat) && typeof lat[0] !== 'object') {
			if (lat.length === 3 || lat.length === 2) {
				return true;
			}
			return false;
		} else if ((lat || lat === 0) && (lng || lng === 0)) {
			return true;
		}
		return false;
	}


	// @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
	// Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
	equals(obj, maxMargin) {
		if (!obj) { return false; }

		obj = new LatLng(obj);

		const margin = Math.max(
			Math.abs(this.lat - obj.lat),
			Math.abs(this.lng - obj.lng));

		return margin <= (maxMargin ?? 1.0E-9);
	}

	// @method toString(precision?: Number): String
	// Returns a string representation of the point (for debugging purposes).
	toString(precision) {
		return `LatLng(${Util.formatNum(this.lat, precision)}, ${Util.formatNum(this.lng, precision)})`;
	}

	// @method distanceTo(otherLatLng: LatLng): Number
	// Returns the distance (in meters) to the given `LatLng` calculated using the [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula).
	distanceTo(other) {
		return Earth.distance(this, new LatLng(other));
	}

	// @method wrap(): LatLng
	// Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
	wrap() {
		return Earth.wrapLatLng(this);
	}

	// @method toBounds(sizeInMeters: Number): LatLngBounds
	// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
	toBounds(sizeInMeters) {
		const latAccuracy = 180 * sizeInMeters / 40075017,
		lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

		return new LatLngBounds(
			[this.lat - latAccuracy, this.lng - lngAccuracy],
			[this.lat + latAccuracy, this.lng + lngAccuracy]);
	}

	// @method clone(): LatLng
	// Returns a copy of the current LatLng.
	clone() {
		// to skip the validation in the constructor we need to initialize with 0 and then set the values later
		const latlng = new LatLng(0, 0);
		latlng.lat = this.lat;
		latlng.lng = this.lng;
		latlng.alt = this.alt;
		return latlng;
	}
};


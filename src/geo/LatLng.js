import * as Util from '../core/Util';
import {Earth} from './crs/CRS.Earth';
import {toLatLngBounds} from './LatLngBounds';
import {_checkNumber} from '../core/Util';

/* @class LatLng
 * @aka L.LatLng
 *
 * Represents a geographical point with a certain latitude and longitude.
 *
 * @example
 *
 * ```
 * var latlng = L.latLng(50.5, 30.5);
 * ```
 *
 * All Leaflet methods that accept LatLng objects also accept them in a simple Array form and simple object form (unless noted otherwise), so these lines are equivalent:
 *
 * ```
 * map.panTo([50, 30]);
 * map.panTo({lon: 30, lat: 50});
 * map.panTo({lat: 50, lng: 30});
 * map.panTo(L.latLng(50, 30));
 * ```
 *
 * Note that `LatLng` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

export function LatLng(lat, lng, alt) {
	if (lat instanceof LatLng) {
		return lat;
	}
	if (Util.isArray(lat) && typeof lat[0] !== 'object') {
		if (lat.length === 3) {
			return new LatLng(lat[0], lat[1], lat[2]);
		}
		if (lat.length === 2) {
			return new LatLng(lat[0], lat[1]);
		}
	}
	if (typeof lat === 'object' && 'lat' in lat) {
		var _lng = 'lng' in lat ? lat.lng : lat.lon;
		if ('alt' in lat) {
			return new LatLng(lat.lat, _lng, lat.alt);
		}
		return new LatLng(lat.lat, _lng);
	}

	// @property lat: Number
	// Latitude in degrees
	this.lat = _checkNumber(lat);

	// @property lng: Number
	// Longitude in degrees
	this.lng = _checkNumber(lng);

	// @property alt: Number
	// Altitude in meters (optional)
	if (arguments.length === 3 && typeof alt !== 'undefined') {
		this.alt = _checkNumber(alt);
	}
}

LatLng.prototype = {
	// @method equals(otherLatLng: LatLng, maxMargin?: Number): Boolean
	// Returns `true` if the given `LatLng` point is at the same position (within a small margin of error). The margin of error can be overridden by setting `maxMargin` to a small number.
	equals: function (obj, maxMargin) {
		if (!obj) { return false; }

		obj = toLatLng(obj);

		var margin = Math.max(
		        Math.abs(this.lat - obj.lat),
		        Math.abs(this.lng - obj.lng));

		return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
	},

	// @method toString(): String
	// Returns a string representation of the point (for debugging purposes).
	toString: function (precision) {
		return 'LatLng(' +
		        Util.formatNum(this.lat, precision) + ', ' +
		        Util.formatNum(this.lng, precision) + ')';
	},

	// @method distanceTo(otherLatLng: LatLng): Number
	// Returns the distance (in meters) to the given `LatLng` calculated using the [Spherical Law of Cosines](https://en.wikipedia.org/wiki/Spherical_law_of_cosines).
	distanceTo: function (other) {
		return Earth.distance(this, toLatLng(other));
	},

	// @method wrap(): LatLng
	// Returns a new `LatLng` object with the longitude wrapped so it's always between -180 and +180 degrees.
	wrap: function () {
		return Earth.wrapLatLng(this);
	},

	// @method toBounds(sizeInMeters: Number): LatLngBounds
	// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
	toBounds: function (sizeInMeters) {
		var latAccuracy = 180 * sizeInMeters / 40075017,
		    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

		return toLatLngBounds(
		        [this.lat - latAccuracy, this.lng - lngAccuracy],
		        [this.lat + latAccuracy, this.lng + lngAccuracy]);
	},

	clone: function () {
		return new LatLng(this.lat, this.lng, this.alt);
	}
};



// @factory L.latLng(latitude: Number, longitude: Number, altitude?: Number): LatLng
// Creates an object representing a geographical point with the given latitude and longitude (and optionally altitude).

// @alternative
// @factory L.latLng(coords: Array): LatLng
// Expects an array of the form `[Number, Number]` or `[Number, Number, Number]` instead.

// @alternative
// @factory L.latLng(coords: Object): LatLng
// Expects an plain object of the form `{lat: Number, lng: Number}` or `{lat: Number, lng: Number, alt: Number}` instead.

export function toLatLng(lat, lng, alt) {
	if (arguments.length === 3) {
		return new LatLng(lat, lng, alt);
	}
	return new LatLng(lat, lng);
}

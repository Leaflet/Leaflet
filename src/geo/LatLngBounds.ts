/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import {LatLng, toLatLng} from './LatLng';

import {Object, ReturnType, HTMLElement} from 'typescript';
import {Point} from "../geometry";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type LatLngReturnType = ReturnType<typeof LatLng>;
type LatLngBoundsReturnType = ReturnType<typeof LatLngBounds>;
type HTMLElementReturnType = ReturnType<typeof HTMLElement>;
type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type pointReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

type LayerReturnType = ReturnType<typeof  FeatureGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
// type LayerGroupReturnType = ReturnType<typeof  LayerGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

// type PointReturnType = ReturnType<typeof Point>;
// type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
// type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
// type roundReturnType = ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
// type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

// type numberAuxX = ReturnType<typeof Object.Number>;

// type numberAuxY = ReturnType<typeof Object.Number>;

/*
 * @class LatLngBounds
 * @aka L.LatLngBounds
 *
 * Represents a rectangular geographical area on a map.
 *
 * @example
 *
 * ```tsc
 * var corner1 = L.latLng(40.712, -74.227),
 * corner2 = L.latLng(40.774, -74.125),
 * bounds = L.latLngBounds(corner1, corner2);
 * ```
 *
 * All Leaflet methods that accept LatLngBounds objects also accept them in a simple Array form (unless noted otherwise), so the bounds example above can be passed like this:
 *
 * ```tsc
 * map.fitBounds([
 * 	[40.712, -74.227],
 * 	[40.774, -74.125]
 * ]);
 * ```
 *
 * Caution: if the area crosses the antimeridian (often confused with the International Date Line), you must specify corners _outside_ the [-180, 180] degrees longitude range.
 *
 * Note that `LatLngBounds` does not inherit from Leaflet's `Class` object,
 * which means new classes can't inherit from it, and new methods
 * can't be added to it with the `include` function.
 */

export function LatLngBounds(corner1:NumberReturnType, corner2:NumberReturnType):LatLngReturnType|LatLngReturnType[] { // (LatLng, LatLng) or (LatLng[])
	if (!corner1) { return; }

	const latlngs = corner2 ? [corner1, corner2] : corner1;

	for (let i = 0, len = latlngs.length; i < len; i++) {
		this.extend(latlngs[i]);
	}
}

LatLngBounds.prototype = {

	// @method extend(latlng: LatLng): this
	// Extend the bounds to contain the given point

	// @alternative
	// @method extend(otherBounds: LatLngBounds): this
	// Extend the bounds to contain the given bounds
	extend: function (obj: LatLngReturnType | LatLngBoundsReturnType) {
		const sw = this._southWest;
		const ne = this._northEast;
		const sw2;
		const ne2;

		if (obj instanceof LatLng) {
			sw2 = obj;
			ne2 = obj;

		} else if (obj instanceof LatLngBounds) {
			sw2 = obj._southWest;
			ne2 = obj._northEast;

			if (!sw2 || !ne2) { return this; }

		} else {
			return obj ? this.extend(toLatLng(obj) || toLatLngBounds(obj)) : this;
		}

		if (!sw && !ne) {
			this._southWest = new LatLng(sw2.lat, sw2.lng);
			this._northEast = new LatLng(ne2.lat, ne2.lng);
		} else {
			sw.lat = Math.min(sw2.lat, sw.lat);
			sw.lng = Math.min(sw2.lng, sw.lng);
			ne.lat = Math.max(ne2.lat, ne.lat);
			ne.lng = Math.max(ne2.lng, ne.lng);
		}

		return this;
	},

	// @method pad(bufferRatio: Number): LatLngBounds
	// Returns bounds created by extending or retracting the current bounds by a given ratio in each direction.
	// For example, a ratio of 0.5 extends the bounds by 50% in each direction.
	// Negative values will retract the bounds.
	pad: function (bufferRatio:NumberReturnType): LatLngBoundsReturnType {
		const sw = this._southWest;
		const ne = this._northEast;
		const heightBuffer = Math.abs(sw.lat - ne.lat) * bufferRatio;
		const widthBuffer = Math.abs(sw.lng - ne.lng) * bufferRatio;

		return new LatLngBounds(
		        new LatLng(sw.lat - heightBuffer, sw.lng - widthBuffer),
		        new LatLng(ne.lat + heightBuffer, ne.lng + widthBuffer));
	},

	// @method getCenter(): LatLng
	// Returns the center point of the bounds.
	getCenter: function (): LatLngReturnType {
		return new LatLng(
		        (this._southWest.lat + this._northEast.lat) / 2,
		        (this._southWest.lng + this._northEast.lng) / 2);
	},

	// @method getSouthWest(): LatLng
	// Returns the south-west point of the bounds.
	getSouthWest: function (): LatLngReturnType {
		return this._southWest;
	},

	// @method getNorthEast(): LatLng
	// Returns the north-east point of the bounds.
	getNorthEast: function (): LatLngReturnType {
		return this._northEast;
	},

	// @method getNorthWest(): LatLng
	// Returns the north-west point of the bounds.
	getNorthWest: function (): LatLngReturnType {
		return new LatLng(this.getNorth(), this.getWest());
	},

	// @method getSouthEast(): LatLng
	// Returns the south-east point of the bounds.
	getSouthEast: function (): LatLngReturnType {
		return new LatLng(this.getSouth(), this.getEast());
	},

	// @method getWest(): Number
	// Returns the west longitude of the bounds
	getWest: function (): NumberReturnType {
		return this._southWest.lng;
	},

	// @method getSouth(): Number
	// Returns the south latitude of the bounds
	getSouth: function (): NumberReturnType {
		return this._southWest.lat;
	},

	// @method getEast(): Number
	// Returns the east longitude of the bounds
	getEast: function (): NumberReturnType {
		return this._northEast.lng;
	},

	// @method getNorth(): Number
	// Returns the north latitude of the bounds
	getNorth: function (): NumberReturnType {
		return this._northEast.lat;
	},

	// @method contains(otherBounds: LatLngBounds): Boolean
	// Returns `true` if the rectangle contains the given one.

	// @alternative
	// @method contains (latlng: LatLng): Boolean
	// Returns `true` if the rectangle contains the given point.
	contains: function (obj:LatLngBoundsReturnType|LatLngReturnType):LatLngBoundsReturnType|LatLngReturnType { // (LatLngBounds) or (LatLng) -> Boolean
		if (typeof obj[0] === 'number' || obj instanceof LatLng || 'lat' in obj) {
			obj = toLatLng(obj);
		} else {
			obj = toLatLngBounds(obj);
		}

		const sw = this._southWest;
		const ne = this._northEast;
		const sw2;
		const ne2;

		if (obj instanceof LatLngBounds) {
			sw2 = obj.getSouthWest();
			ne2 = obj.getNorthEast();
		} else {
			sw2 = ne2 = obj;
		}

		return (sw2.lat >= sw.lat) && (ne2.lat <= ne.lat) &&
		       (sw2.lng >= sw.lng) && (ne2.lng <= ne.lng);
	},

	// @method intersects(otherBounds: LatLngBounds): Boolean
	// Returns `true` if the rectangle intersects the given bounds. Two bounds intersect if they have at least one point in common.
	intersects: function (bounds: LatLngBoundsReturnType[]):boolean {
		bounds = toLatLngBounds(bounds);

		const sw = this._southWest;
		const ne = this._northEast;
		const sw2 = bounds.getSouthWest();
		const ne2 = bounds.getNorthEast();

		latIntersects = (ne2.lat >= sw.lat) && (sw2.lat <= ne.lat);
		lngIntersects = (ne2.lng >= sw.lng) && (sw2.lng <= ne.lng);

		return latIntersects && lngIntersects;
	},

	// @method overlaps(otherBounds: LatLngBounds): Boolean
	// Returns `true` if the rectangle overlaps the given bounds. Two bounds overlap if their intersection is an area.
	overlaps: function (bounds) {
		bounds = toLatLngBounds(bounds);

		const sw = this._southWest;
		const ne = this._northEast;
		const sw2 = bounds.getSouthWest();
		const ne2 = bounds.getNorthEast();

		latOverlaps = (ne2.lat > sw.lat) && (sw2.lat < ne.lat);
		lngOverlaps = (ne2.lng > sw.lng) && (sw2.lng < ne.lng);

		return latOverlaps && lngOverlaps;
	},

	// @method toBBoxString(): String
	// Returns a string with bounding box coordinates in a 'southwest_lng,southwest_lat,northeast_lng,northeast_lat' format. Useful for sending requests to web services that return geo data.
	toBBoxString: function (): StringReturnType {
		return [this.getWest(), this.getSouth(), this.getEast(), this.getNorth()].join(',');
	},

	// @method equals(otherBounds: LatLngBounds, maxMargin?: Number): Boolean
	// Returns `true` if the rectangle is equivalent (within a small margin of error) to the given bounds. The margin of error can be overridden by setting `maxMargin` to a small number.
	equals: function (bounds, maxMargin) {
		if (!bounds) { return false; }

		bounds = toLatLngBounds(bounds);

		return this._southWest.equals(bounds.getSouthWest(), maxMargin) &&
		       this._northEast.equals(bounds.getNorthEast(), maxMargin);
	},

	// @method isValid(): Boolean
	// Returns `true` if the bounds are properly initialized.
	isValid: function ():boolean {
		return !!(this._southWest && this._northEast);
	}
};

// TODO International date line?

// @factory L.latLngBounds(corner1: LatLng, corner2: LatLng)
// Creates a `LatLngBounds` object by defining two diagonally opposite corners of the rectangle.

// @alternative
// @factory L.latLngBounds(latlngs: LatLng[])
// Creates a `LatLngBounds` object defined by the geographical points it contains. Very useful for zooming the map to fit a particular set of locations with [`fitBounds`](#map-fitbounds).
export function toLatLngBounds(a: LatLngReturnType, b: LatLngReturnType) {
	if (a instanceof LatLngBounds) {
		return a;
	}
	return new LatLngBounds(a, b);
}
export function toLatLngBounds(latlngs: LatLngReturnType[]):LatLngReturnType {
	if (latlngs[0] instanceof LatLngBounds) {
		return latlngs[0];
	}
	return new LatLngBounds(latlngs[0], latlngs[1]);
}

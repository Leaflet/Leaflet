
import {Bounds} from '../../geometry/Bounds.js';
import {LatLng} from '../LatLng.js';
import {LatLngBounds} from '../LatLngBounds.js';
import * as Util from '../../core/Util.js';

/*
 * @namespace CRS
 * @crs CRS.Base
 * Object that defines coordinate reference systems for projecting
 * geographical points into pixel (screen) coordinates and back (and to
 * coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services). See
 * [spatial reference system](https://en.wikipedia.org/wiki/Spatial_reference_system).
 *
 * Leaflet defines the most usual CRSs by default. If you want to use a
 * CRS not defined by default, take a look at the
 * [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
 *
 * Note that the CRS instances do not inherit from Leaflet's `Class` object,
 * and can't be instantiated. Also, new classes can't inherit from them,
 * and methods can't be added to them with the `include` function.
 */

export class CRS {
	static projection = undefined;
	static transformation = undefined;

	// @method latLngToPoint(latlng: LatLng, zoom: Number): Point
	// Projects geographical coordinates into pixel coordinates for a given zoom.
	static latLngToPoint(latlng, zoom) {
		const projectedPoint = this.projection.project(latlng),
		scale = this.scale(zoom);

		return this.transformation._transform(projectedPoint, scale);
	}

	// @method pointToLatLng(point: Point, zoom: Number): LatLng
	// The inverse of `latLngToPoint`. Projects pixel coordinates on a given
	// zoom into geographical coordinates.
	static pointToLatLng(point, zoom) {
		const scale = this.scale(zoom),
		untransformedPoint = this.transformation.untransform(point, scale);

		return this.projection.unproject(untransformedPoint);
	}

	// @method project(latlng: LatLng): Point
	// Projects geographical coordinates into coordinates in units accepted for
	// this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
	static project(latlng) {
		return this.projection.project(latlng);
	}

	// @method unproject(point: Point): LatLng
	// Given a projected coordinate returns the corresponding LatLng.
	// The inverse of `project`.
	static unproject(point) {
		return this.projection.unproject(point);
	}

	// @method scale(zoom: Number): Number
	// Returns the scale used when transforming projected coordinates into
	// pixel coordinates for a particular zoom. For example, it returns
	// `256 * 2^zoom` for Mercator-based CRS.
	static scale(zoom) {
		return 256 * 2 ** zoom;
	}

	// @method zoom(scale: Number): Number
	// Inverse of `scale()`, returns the zoom level corresponding to a scale
	// factor of `scale`.
	static zoom(scale) {
		return Math.log(scale / 256) / Math.LN2;
	}

	// @method getProjectedBounds(zoom: Number): Bounds
	// Returns the projection's bounds scaled and transformed for the provided `zoom`.
	static getProjectedBounds(zoom) {
		if (this.infinite) { return null; }

		const b = this.projection.bounds,
		s = this.scale(zoom),
		min = this.transformation.transform(b.min, s),
		max = this.transformation.transform(b.max, s);

		return new Bounds(min, max);
	}

	// @method distance(latlng1: LatLng, latlng2: LatLng): Number
	// Returns the distance between two geographical coordinates.

	// @property code: String
	// Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`)
	//
	// @property wrapLng: Number[]
	// An array of two numbers defining whether the longitude (horizontal) coordinate
	// axis wraps around a given range and how. Defaults to `[-180, 180]` in most
	// geographical CRSs. If `undefined`, the longitude axis does not wrap around.
	//
	// @property wrapLat: Number[]
	// Like `wrapLng`, but for the latitude (vertical) axis.

	// wrapLng: [min, max],
	// wrapLat: [min, max],

	// @property infinite: Boolean
	// If true, the coordinate space will be unbounded (infinite in both axes)
	static infinite = false;

	// @method wrapLatLng(latlng: LatLng): LatLng
	// Returns a `LatLng` where lat and lng has been wrapped according to the
	// CRS's `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
	static wrapLatLng(latlng) {
		latlng = new LatLng(latlng);
		const lng = this.wrapLng ? Util.wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
		lat = this.wrapLat ? Util.wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
		alt = latlng.alt;

		return new LatLng(lat, lng, alt);
	}

	// @method wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds
	// Returns a `LatLngBounds` with the same size as the given one, ensuring
	// that its center is within the CRS's bounds.
	static wrapLatLngBounds(bounds) {
		bounds = new LatLngBounds(bounds);
		const center = bounds.getCenter(),
		newCenter = this.wrapLatLng(center),
		latShift = center.lat - newCenter.lat,
		lngShift = center.lng - newCenter.lng;

		if (latShift === 0 && lngShift === 0) {
			return bounds;
		}

		const sw = bounds.getSouthWest(),
		ne = bounds.getNorthEast(),
		newSw = new LatLng(sw.lat - latShift, sw.lng - lngShift),
		newNe = new LatLng(ne.lat - latShift, ne.lng - lngShift);

		return new LatLngBounds(newSw, newNe);
	}
}

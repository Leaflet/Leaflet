import {Bounds} from '../../geometry/Bounds.js';
import {LatLng} from '../LatLng.js';
import {LatLngBounds} from '../LatLngBounds.js';
import * as Util from '../../core/Util.js';

/**
 * @import {Point} from '../../geometry/Point.js'
 * @import {Transformation} from '../../geometry/Transformation.js'
 * @import {LatLngExpression} from '../LatLng.js'
 * @import {LatLngBoundsExpression} from '../LatLngBounds.js'
 */

/**
 * An object with methods for projecting geographical coordinates of the world onto a flat surface (and back). See
 * [Map projection](https://en.wikipedia.org/wiki/Map_projection). Leaflet comes with `LonLatProjection`,
 * `MercatorProjection` and `SphericalMercatorProjection` out of the box.
 *
 * Note that the projection instances do not inherit from Leaflet's `Class` object, and can't be instantiated. Also,
 * new classes can't inherit from them, and methods can't be added to them with the `include` function.
 * @typedef {Object} Projection
 * @property {Bounds} bounds The bounds (specified in CRS units) where the projection is valid.
 * @property {(latlng: LatLng) => Point} project Projects geographical coordinates into a 2D point. Only accepts
 *   actual `LatLng` instances, not arrays.
 * @property {(point: Point) => LatLng} unproject The inverse of `project`. Projects a 2D point into a geographical
 *   location. Only accepts actual `Point` instances, not arrays.
 */

/**
 * Object that defines coordinate reference systems for projecting geographical points into pixel (screen)
 * coordinates and back (and to coordinates in other units for [WMS](https://en.wikipedia.org/wiki/Web_Map_Service)
 * services). See [spatial reference system](https://en.wikipedia.org/wiki/Spatial_reference_system).
 *
 * Leaflet defines the most usual CRSs by default. If you want to use a CRS not defined by default, take a look at
 * the [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin.
 *
 * Note that the CRS instances do not inherit from Leaflet's `Class` object, and can't be instantiated. Also, new
 * classes can't inherit from them, and methods can't be added to them with the `include` function.
 */
export class CRS {
	/**
	 * Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`).
	 * @type {string | undefined}
	 */
	static code;

	/**
	 * The projection the CRS uses to turn geographical coordinates into projected ones.
	 * @type {Projection}
	 */
	static projection;

	/**
	 * The transformation the CRS uses to turn projected coordinates into pixels at zoom 0.
	 * @type {Transformation}
	 */
	static transformation;

	/**
	 * An array of two numbers defining whether the longitude (horizontal) coordinate axis wraps around a given range
	 * and how. Defaults to `[-180, 180]` in most geographical CRSs. If `undefined`, the longitude axis does not wrap.
	 * @type {[number, number] | undefined}
	 */
	static wrapLng;

	/**
	 * Like `wrapLng`, but for the latitude (vertical) axis.
	 * @type {[number, number] | undefined}
	 */
	static wrapLat;

	/**
	 * Returns the distance between two geographical coordinates.
	 * @type {(latlng1: LatLng, latlng2: LatLng) => number}
	 */
	static distance;

	/**
	 * Projects geographical coordinates into pixel coordinates for a given zoom.
	 * @param {LatLng} latlng
	 * @param {number} zoom
	 * @returns {Point}
	 */
	static latLngToPoint(latlng, zoom) {
		const projectedPoint = this.projection.project(latlng),
		scale = this.scale(zoom);

		return this.transformation._transform(projectedPoint, scale);
	}

	/**
	 * The inverse of `latLngToPoint`. Projects pixel coordinates on a given zoom into geographical coordinates.
	 * @param {Point} point
	 * @param {number} zoom
	 * @returns {LatLng}
	 */
	static pointToLatLng(point, zoom) {
		const scale = this.scale(zoom),
		untransformedPoint = this.transformation.untransform(point, scale);

		return this.projection.unproject(untransformedPoint);
	}

	/**
	 * Projects geographical coordinates into coordinates in units accepted for
	 * this CRS (e.g. meters for EPSG:3857, for passing it to WMS services).
	 * @param {LatLng} latlng
	 * @returns {Point}
	 */
	static project(latlng) {
		return this.projection.project(latlng);
	}

	/**
	 * Given a projected coordinate returns the corresponding LatLng. The inverse of `project`.
	 * @param {Point} point
	 * @returns {LatLng}
	 */
	static unproject(point) {
		return this.projection.unproject(point);
	}

	/**
	 * Returns the scale used when transforming projected coordinates into pixel coordinates for
	 * a particular zoom. For example, it returns `256 * 2^zoom` for Mercator-based CRS.
	 * @param {number} zoom
	 * @returns {number}
	 */
	static scale(zoom) {
		return 256 * 2 ** zoom;
	}

	/**
	 * Inverse of `scale()`, returns the zoom level corresponding to a scale factor of `scale`.
	 * @param {number} scale
	 * @returns {number}
	 */
	static zoom(scale) {
		return Math.log(scale / 256) / Math.LN2;
	}

	/**
	 * Returns the projection's bounds scaled and transformed for the provided `zoom`.
	 * @param {number} zoom
	 * @returns {Bounds | null}
	 */
	static getProjectedBounds(zoom) {
		if (this.infinite) { return null; }

		const b = this.projection.bounds,
		s = this.scale(zoom),
		min = this.transformation.transform(b.min, s),
		max = this.transformation.transform(b.max, s);

		return new Bounds(min, max);
	}

	/**
	 * If true, the coordinate space will be unbounded (infinite in both axes)
	 * @type {boolean}
	 */
	static infinite = false;

	/**
	 * Returns a `LatLng` where lat and lng has been wrapped according to the CRS's
	 * `wrapLat` and `wrapLng` properties, if they are outside the CRS's bounds.
	 * @param {LatLngExpression} latlng
	 * @returns {LatLng}
	 */
	static wrapLatLng(latlng) {
		latlng = new LatLng(latlng);
		const lng = this.wrapLng ? Util.wrapNum(latlng.lng, this.wrapLng, true) : latlng.lng,
		lat = this.wrapLat ? Util.wrapNum(latlng.lat, this.wrapLat, true) : latlng.lat,
		alt = latlng.alt;

		return new LatLng(lat, lng, alt);
	}

	/**
	 * Returns a `LatLngBounds` with the same size as the given one,
	 * ensuring that its center is within the CRS's bounds.
	 * @param {LatLngBoundsExpression} bounds
	 * @returns {LatLngBounds}
	 */
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

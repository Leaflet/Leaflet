import {Path} from './Path.js';
import * as Util from '../../core/Util.js';
import * as LineUtil from '../../geometry/LineUtil.js';
import {LatLng} from '../../geo/LatLng.js';
import {LatLngBounds} from '../../geo/LatLngBounds.js';
import {Bounds} from '../../geometry/Bounds.js';
import {Point} from '../../geometry/Point.js';
import {latLngsToCoords, getFeature} from '../GeoJSONUtil.js';

/** @import {Feature, Geometry, LineString, MultiLineString} from 'geojson' */
/** @import {Defaults, InteractiveLayerEventMap, LatLngExpression, NestedCoords, PolylineDefaults, PolylineOptions} from '../../types.js' */

const defaultOptions = {
	/**
	 * How much to simplify the polyline on each zoom level (Douglas–Peucker epsilon, in pixels). Higher values
	 * mean faster rendering but less accuracy; lower values mean more accuracy but slower rendering.
	 */
	smoothFactor: 0.5,

	/** Disable polyline clipping. */
	noClip: false
};

/** @typedef {typeof defaultOptions} PolylineDefaultsValues */

/**
 * A class for drawing polyline overlays on a map. Extends `Path`.
 * @example
 * ```js
 * // create a red polyline from an array of LatLng points
 * const latlngs = [
 * 	[45.51, -122.68],
 * 	[37.77, -122.43],
 * 	[34.04, -118.2]
 * ];
 *
 * const polyline = new Polyline(latlngs, {color: 'red'}).addTo(map);
 *
 * // zoom the map to the polyline
 * map.fitBounds(polyline.getBounds());
 * ```
 *
 * You can also pass a multi-dimensional array to represent a `MultiPolyline` shape:
 *
 * ```js
 * // create a red polyline from an array of arrays of LatLng points
 * const latlngs = [
 * 	[[45.51, -122.68],
 * 	 [37.77, -122.43],
 * 	 [34.04, -118.2]],
 * 	[[40.78, -73.91],
 * 	 [41.83, -87.62],
 * 	 [32.76, -96.72]]
 * ];
 * ```
 * @template {PolylineOptions} [O=PolylineOptions]
 * @template {InteractiveLayerEventMap} [E=InteractiveLayerEventMap]
 * @template {Geometry} [G=LineString | MultiLineString] the geometry `toGeoJSON` returns
 * @extends {Path<O & PolylineDefaults, E>}
 */
export class Polyline extends Path {

	static initHooks = true;

	/** @type {Defaults<PolylineOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Instantiates a polyline object given an array of geographical points and optionally an options object. You
	 * can create a `Polyline` object with multiple separate lines (`MultiPolyline`) by passing an array of arrays
	 * of geographic points.
	 * @param {NestedCoords<LatLngExpression>} latlngs
	 * @param {NoInfer<Partial<O>>} [options]
	 */
	constructor(latlngs, options) {
		super();

		Util.setOptions(this, options);
		this._setLatLngs(latlngs);

		this.callInitHooks();
	}

	/**
	 * Returns an array of the points in the path, or nested arrays of points in case of multi-polyline.
	 * @returns {NestedCoords<LatLng>}
	 */
	getLatLngs() {
		return this._latlngs;
	}

	/**
	 * Replaces all the points in the polyline with the given array of geographical points.
	 * @param {NestedCoords<LatLngExpression>} latlngs
	 */
	setLatLngs(latlngs) {
		this._setLatLngs(latlngs);
		return this.redraw();
	}

	/** Returns `true` if the Polyline has no LatLngs. */
	isEmpty() {
		return !this._latlngs.length;
	}

	/**
	 * Returns the point closest to `p` on the Polyline, with its `distance` to `p`, or `null` when the polyline
	 * has no points on the screen.
	 * @param {Point} p
	 */
	closestLayerPoint(p) {
		p = new Point(p);
		let minDistance = Infinity,
		/** @type {Point | null} */
		minPoint = null,
		p1, p2;
		const closest = LineUtil._sqClosestPointOnSegment;

		for (const points of this._parts) {
			for (let i = 1, len = points.length; i < len; i++) {
				p1 = points[i - 1];
				p2 = points[i];

				const sqDist = closest(p, p1, p2, true);

				if (sqDist < minDistance) {
					minDistance = sqDist;
					minPoint = closest(p, p1, p2);
				}
			}
		}
		return minPoint && Object.assign(minPoint, {distance: Math.sqrt(minDistance)});
	}

	/** Returns the center ([centroid](https://en.wikipedia.org/wiki/Centroid)) of the polyline. */
	getCenter() {
		// throws error when not yet added to map as this center calculation requires projected coordinates
		if (!this._map) {
			throw new Error('Must add layer to map before using getCenter()');
		}
		return LineUtil.polylineCenter(this._defaultShape(), this._map.options.crs);
	}

	/** Returns the `LatLngBounds` of the path. */
	getBounds() {
		return this._bounds;
	}

	/**
	 * Adds a given point to the polyline. By default, adds to the first ring of the polyline
	 * in case of a multi-polyline, but can be overridden by passing a specific ring as a LatLng
	 * array (that you can earlier access with [`getLatLngs`](#polyline-getlatlngs)).
	 * @param {LatLngExpression} latlng
	 * @param {LatLng[]} [latlngs]
	 */
	addLatLng(latlng, latlngs) {
		latlngs ??= this._defaultShape();
		latlng = new LatLng(latlng);
		latlngs.push(/** @type {LatLng} */ (latlng));
		this._bounds.extend(latlng);
		return this.redraw();
	}

	/**
	 * Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given
	 * `precision`. Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation
	 * of the polyline (as a GeoJSON `LineString` or `MultiLineString` Feature).
	 * @param {number | false} [precision]
	 * @returns {Feature<G>}
	 */
	toGeoJSON(precision) {
		const multi = !LineUtil.isFlat(this._latlngs);

		const coords = latLngsToCoords(this._latlngs, 0, false, precision);

		return getFeature(this, /** @type {G} */ ({
			type: `${multi ? 'Multi' : ''}LineString`,
			coordinates: coords
		}));
	}

	/** @param {NestedCoords<LatLngExpression>} latlngs */
	_setLatLngs(latlngs) {
		/** @type {LatLngBounds} */
		this._bounds = new LatLngBounds();
		/** @type {NestedCoords<LatLng>} */
		this._latlngs = this._convertLatLngs(latlngs);
	}

	/** @returns {LatLng[]} */

	_defaultShape() {
		return LineUtil.isFlat(this._latlngs) ? this._latlngs : /** @type {LatLng[]} */ (this._latlngs[0]);
	}

	// recursively convert latlngs input into actual LatLng instances; calculate bounds along the way
	/**
	 * @param {NestedCoords<LatLngExpression>} latlngs
	 * @returns {NestedCoords<LatLng>}
	 */
	_convertLatLngs(latlngs) {
		if (!LineUtil.isFlat(latlngs)) {
			return /** @type {NestedCoords<LatLng>} */ (latlngs.map(ring => this._convertLatLngs(ring)));
		}
		const result = [];
		for (let i = 0, len = latlngs.length; i < len; i++) {
			result[i] = new LatLng(latlngs[i]);
			this._bounds.extend(result[i]);
		}
		return result;
	}

	_project() {
		const pxBounds = new Bounds();
		/** @type {Point[][]} */
		this._rings = [];
		this._projectLatlngs(this._latlngs, this._rings, pxBounds);

		if (this._bounds.isValid() && pxBounds.isValid()) {
			/** @type {Bounds | undefined} */
			this._rawPxBounds = pxBounds;
			this._updateBounds();
		}
	}

	_updateBounds() {
		const w = this._clickTolerance(),
		p = new Point(w, w);

		if (!this._rawPxBounds) {
			return;
		}

		this._pxBounds = new Bounds([
			this._rawPxBounds.min.subtract(p),
			this._rawPxBounds.max.add(p)
		]);
	}

	// recursively turns latlngs into a set of rings with projected coordinates
	/**
	 * @param {NestedCoords<LatLng>} latlngs
	 * @param {Point[][]} result
	 * @param {Bounds} projectedBounds
	 */
	_projectLatlngs(latlngs, result, projectedBounds) {
		if (LineUtil.isFlat(latlngs)) {
			const ring = latlngs.map(latlng => this._map.latLngToLayerPoint(latlng));
			ring.forEach(r => projectedBounds.extend(r));
			result.push(ring);
		} else {
			latlngs.forEach(latlng => this._projectLatlngs(latlng, result, projectedBounds));
		}
	}

	// clip polyline by renderer bounds so that we have less to render for performance
	_clipPoints() {
		const bounds = this._renderer._bounds;

		/** @type {Point[][]} */
		this._parts = [];
		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
			return;
		}

		if (this.options.noClip) {
			this._parts = this._rings;
			return;
		}

		const parts = this._parts;
		let i, j, k, len, len2, segment, points;

		for (i = 0, k = 0, len = this._rings.length; i < len; i++) {
			points = this._rings[i];

			for (j = 0, len2 = points.length; j < len2 - 1; j++) {
				segment = LineUtil.clipSegment(points[j], points[j + 1], bounds, !!j);

				if (!segment) { continue; }

				parts[k] ??= [];
				parts[k].push(segment[0]);

				// if segment goes out of screen, or it's the last one, it's the end of the line part
				if ((segment[1] !== points[j + 1]) || (j === len2 - 2)) {
					parts[k].push(segment[1]);
					k++;
				}
			}
		}
	}

	// simplify each clipped part of the polyline for performance
	_simplifyPoints() {
		const parts = this._parts,
		tolerance = this.options.smoothFactor;

		for (let i = 0, len = parts.length; i < len; i++) {
			parts[i] = LineUtil.simplify(parts[i], tolerance);
		}
	}

	_update() {
		if (!this._map) { return; }

		this._clipPoints();
		this._simplifyPoints();
		this._updatePath();
	}

	_updatePath() {
		this._renderer._updatePoly(this);
	}

	// Needed by the `Canvas` renderer for interactivity
	/**
	 * @param {Point} p
	 * @param {boolean} [closed]
	 */
	_containsPoint(p, closed) {
		let i, j, k, len, len2, part;
		const w = this._clickTolerance();

		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

		// hit detection for polylines
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				if (!closed && (j === 0)) { continue; }

				if (LineUtil.pointToSegmentDistance(p, part[k], part[j]) <= w) {
					return true;
				}
			}
		}
		return false;
	}
}

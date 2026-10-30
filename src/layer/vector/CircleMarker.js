import {Path} from './Path.js';
import * as Util from '../../core/Util.js';
import {LatLng} from '../../geo/LatLng.js';
import {Bounds} from '../../geometry/Bounds.js';
import {pointToGeoJSON} from '../GeoJSONUtil.js';

/** @import {Feature, Point as GeoJSONPoint} from 'geojson' */
/** @import {CircleMarkerEventMap, CircleMarkerOptions, Defaults, LatLngExpression, MarkerMoveEvent, PathOptions,
 *    PointExpression} from '../../types.js' */
/** @import {Point} from '../../geometry/Point.js' */

/** @satisfies {Defaults<PathOptions>} */
const defaultOptions = {
	fill: true,

	/** Radius of the circle marker, in CSS pixels. */
	radius: 10
};

/** @typedef {typeof defaultOptions} CircleMarkerDefaults */

/**
 * @typedef {Object} CircleMarkerEvents
 * @property {MarkerMoveEvent} move Fired when the marker is moved via [`setLatLng`](#circlemarker-setlatlng). Old
 *   and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
 */

/**
 * A circle of a fixed size with radius specified in CSS pixels. Extends `Path`.
 * @template {CircleMarkerOptions} [O=CircleMarkerOptions]
 * @template {CircleMarkerEventMap} [E=CircleMarkerEventMap]
 * @extends {Path<O, E>}
 */
export class CircleMarker extends Path {

	static initHooks = true;

	/** @type {Defaults<CircleMarkerOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Instantiates a circle marker object given a geographical point, and an optional options object.
	 * @param {LatLngExpression} latlng
	 * @param {Partial<O>} [options]
	 */
	constructor(latlng, options) {
		super();

		Util.setOptions(this, options);
		this._latlng = new LatLng(latlng);
		this._radius = this.options.radius;

		this.callInitHooks();
	}

	/**
	 * Sets the position of a circle marker to a new location.
	 * @param {LatLngExpression} latlng
	 */
	setLatLng(latlng) {
		const oldLatLng = this._latlng;
		this._latlng = new LatLng(latlng);
		this.redraw();

		return this.fire('move', {oldLatLng, latlng: this._latlng});
	}

	/** Returns the current geographical position of the circle marker */
	getLatLng() {
		return this._latlng;
	}

	/**
	 * Sets the radius of a circle marker. Units are in CSS pixels (meters for a `Circle`).
	 * @param {number} radius
	 */
	setRadius(radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	}

	/** Returns the current radius of the circle. Units are in CSS pixels (meters for a `Circle`). */
	getRadius() {
		return this._radius;
	}

	/** @param {Partial<O>} options */
	setStyle(options) {
		super.setStyle(options);
		if (options?.radius !== undefined) {
			this.setRadius(options.radius);
		}
		return this;
	}

	/**
	 * Coordinates values are rounded with [`formatNum`](#util-formatnum) function with
	 * given `precision`. Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON)
	 * representation of the circle marker (as a GeoJSON `Point` Feature).
	 * @param {number | false} [precision]
	 * @returns {Feature<GeoJSONPoint>}
	 */
	toGeoJSON(precision) {
		return pointToGeoJSON(this, precision);
	}

	_project() {
		// snapped to whole pixels: subpixel precision is invisible on markers but slows down rendering many of them
		/** @type {Point} */
		this._point = this._map.latLngToLayerPoint(this._latlng)._round();
		/** @type {number} */
		this._pxRadius = this._radius;
		this._updateBounds();
	}

	_updateBounds() {
		const r = this._pxRadius,
		r2 = this._pxRadiusY ?? r,
		w = this._clickTolerance(),
		p = /** @type {PointExpression} */ ([r + w, r2 + w]);
		this._pxBounds = new Bounds(this._point.subtract(p), this._point.add(p));
	}

	_update() {
		if (this._map) {
			this._updatePath();
		}
	}

	_updatePath() {
		this._renderer._updateCircle(this);
	}

	_empty() {
		return this._pxRadius && !this._renderer._bounds.intersects(/** @type {Bounds} */ (this._pxBounds));
	}

	// Needed by the `Canvas` renderer for interactivity
	/** @param {Point} p */
	_containsPoint(p) {
		return p.distanceTo(this._point) <= this._pxRadius + this._clickTolerance();
	}
}

import {Path} from './Path.js';
import * as Util from '../../core/Util.js';
import {LatLng} from '../../geo/LatLng.js';
import {Bounds} from '../../geometry/Bounds.js';
import {pointToGeoJSON} from '../GeoJSONUtil.js';

const defaultOptions = {
	fill: true,

	/** Radius of the circle marker, in CSS pixels */
	radius: 10
};


/**
 * @typedef {Object} CircleMarkerEvents
 * @property {LeafletEvent} move Fired when the marker is moved via [`setLatLng`](#circlemarker-setlatlng). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
 */

/** A circle of a fixed size with radius specified in CSS pixels. Extends `Path`. */
export class CircleMarker extends Path {

	static initHooks = true;

	static defaultOptions = defaultOptions;

	/**
	 * Instantiates a circle marker object given a geographical point, and an optional options object.
	 * @param {LatLng} latlng
	 * @param {CircleMarkerOptions} [options]
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
	 * @param {LatLng} latLng
	 * @returns {this}
	 */
	setLatLng(latlng) {
		const oldLatLng = this._latlng;
		this._latlng = new LatLng(latlng);
		this.redraw();

		return this.fire('move', {oldLatLng, latlng: this._latlng});
	}

	/**
	 * Returns the current geographical position of the circle marker
	 * @returns {LatLng}
	 */
	getLatLng() {
		return this._latlng;
	}

	/**
	 * Sets the radius of a circle marker. Units are in CSS pixels.
	 * @param {number} radius
	 * @returns {this}
	 */
	setRadius(radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	}

	/**
	 * Returns the current radius of the circle. Units are in CSS pixels.
	 * @returns {number}
	 */
	getRadius() {
		return this._radius;
	}

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
	 * @returns {object}
	 */
	toGeoJSON(precision) {
		return pointToGeoJSON(this, precision);
	}

	_project() {
		// snapped to whole pixels: subpixel precision is invisible on markers but slows down rendering many of them
		this._point = this._map.latLngToLayerPoint(this._latlng)._round();
		this._pxRadius = this._radius;
		this._updateBounds();
	}

	_updateBounds() {
		const r = this._pxRadius,
		r2 = this._pxRadiusY ?? r,
		w = this._clickTolerance(),
		p = [r + w, r2 + w];
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
		return this._pxRadius && !this._renderer._bounds.intersects(this._pxBounds);
	}

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint(p) {
		return p.distanceTo(this._point) <= this._pxRadius + this._clickTolerance();
	}
}

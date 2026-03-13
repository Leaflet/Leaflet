import {Path} from './Path.js';
import * as Util from '../../core/Util.js';
import {LatLng} from '../../geo/LatLng.js';
import {Bounds} from '../../geometry/Bounds.js';


/*
 * @class CircleMarker
 * @inherits Path
 *
 * A circle of a fixed size with radius specified in CSS pixels. Extends `Path`.
 */

// @constructor CircleMarker(latlng: LatLng, options?: CircleMarker options)
// Instantiates a circle marker object given a geographical point, and an optional options object.
export class CircleMarker extends Path {

	static {
		// @section
		// @aka CircleMarker options
		this.setDefaultOptions({
			fill: true,

			// @option radius: Number = 10
			// Radius of the circle marker, in CSS pixels
			radius: 10
		});
	}

	initialize(latlng, options) {
		Util.setOptions(this, options);
		this._latlng = new LatLng(latlng);
		this._radius = this.options.radius;
	}

	// @method setLatLng(latLng: LatLng): this
	// Sets the position of a circle marker to a new location.
	setLatLng(latlng) {
		const oldLatLng = this._latlng;
		this._latlng = new LatLng(latlng);
		this.redraw();

		// @event move: Event
		// Fired when the marker is moved via [`setLatLng`](#circlemarker-setlatlng). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
		return this.fire('move', {oldLatLng, latlng: this._latlng});
	}

	// @method getLatLng(): LatLng
	// Returns the current geographical position of the circle marker
	getLatLng() {
		return this._latlng;
	}

	// @method setRadius(radius: Number): this
	// Sets the radius of a circle marker. Units are in CSS pixels.
	setRadius(radius) {
		this.options.radius = this._radius = radius;
		return this.redraw();
	}

	// @method getRadius(): Number
	// Returns the current radius of the circle. Units are in CSS pixels.
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

	_project() {
		this._point = this._map.latLngToLayerPoint(this._latlng);
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

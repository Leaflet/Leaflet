import {CircleMarker} from './CircleMarker.js';
import {LatLngBounds} from '../../geo/LatLngBounds.js';
import {EarthCRS} from '../../geo/crs/EarthCRS.js';


/**
 * A class for drawing circle overlays on a map with radius specified in meters. Extends `CircleMarker`.
 *
 * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion).
 * @example
 * ```js
 * new Circle([50.5, 30.5], {radius: 200}).addTo(map);
 * ```
 */
export class Circle extends CircleMarker {

	static initHooks = true;

	/**
	 * Instantiates a circle object given a geographical point,
	 * and an options object which contains the circle radius.
	 * @param {LatLng} latlng
	 * @param {CircleOptions} [options]
	 */
	constructor(latlng, options) {
		super(latlng, options);

		if (isNaN(this.options.radius)) { throw new Error('Circle radius cannot be NaN'); }

		/**
		 * Radius of the circle, in meters.
		 * @type {number}
		 */

		this.callInitHooks();
	}

	/**
	 * Sets the radius of a circle. Units are in meters.
	 * @param {number} radius
	 * @returns {this}
	 */
	/**
	 * Returns the current radius of a circle. Units are in meters.
	 * @returns {number}
	 */

	/**
	 * Returns the `LatLngBounds` of the path. When the circle isn't on a map, they're approximated on a sphere.
	 * @returns {LatLngBounds}
	 */
	getBounds() {
		if (!this._map) { return this._latlng.toBounds(this._radius * 2); }

		const half = [this._pxRadius, this._pxRadiusY ?? this._pxRadius];

		return new LatLngBounds(
			this._map.layerPointToLatLng(this._point.subtract(half)),
			this._map.layerPointToLatLng(this._point.add(half)));
	}

	_project() {

		const lng = this._latlng.lng,
		lat = this._latlng.lat,
		map = this._map,
		crs = map.options.crs;

		if (crs.distance === EarthCRS.distance) {
			const d = Math.PI / 180,
			latR = (this._radius / EarthCRS.R) / d,
			top = map.project([lat + latR, lng]),
			bottom = map.project([lat - latR, lng]),
			p = top.add(bottom).divideBy(2),
			lat2 = map.unproject(p).lat;
			// Longitude span from the haversine form of the spherical law of cosines. The plain acos() form
			// loses precision for radii of about a metre and less, where cos(latR) is too close to 1 (#6120).
			let lngR = 2 * Math.asin(Math.sqrt(
				(Math.sin(latR * d / 2) ** 2 - Math.sin((lat2 - lat) * d / 2) ** 2) /
				(Math.cos(lat * d) * Math.cos(lat2 * d)))) / d;

			if (isNaN(lngR) || lngR === 0) {
				lngR = latR / Math.cos(Math.PI / 180 * lat); // Fallback for edge case, #2425
			}

			this._point = p.subtract(map.getPixelOrigin());
			this._pxRadius = isNaN(lngR) ? 0 : p.x - map.project([lat2, lng - lngR]).x;
			this._pxRadiusY = p.y - top.y;

		} else {
			const latlng2 = crs.unproject(crs.project(this._latlng).subtract([this._radius, 0]));

			this._point = map.latLngToLayerPoint(this._latlng);
			this._pxRadius = Math.abs(this._point.x - map.latLngToLayerPoint(latlng2).x);
		}

		this._updateBounds();
	}
}

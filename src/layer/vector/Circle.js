import {CircleMarker} from './CircleMarker.js';
import {LatLngBounds} from '../../geo/LatLngBounds.js';
import {EarthCRS} from '../../geo/crs/EarthCRS.js';


/*
 * @class Circle
 * @inherits CircleMarker
 *
 * A class for drawing circle overlays on a map with radius specified in meters. Extends `CircleMarker`.
 *
 * It's an approximation and starts to diverge from a real circle closer to poles (due to projection distortion).
 *
 * @example
 *
 * ```js
 * new Circle([50.5, 30.5], {radius: 200}).addTo(map);
 * ```
 */

// @constructor Circle(latlng: LatLng, options?: CircleMarker options)
// Instantiates a circle object given a geographical point, and an options object
// which contains the circle radius.
export class Circle extends CircleMarker {

	initialize(latlng, options) {
		super.initialize(latlng, options);

		if (isNaN(this.options.radius)) { throw new Error('Circle radius cannot be NaN'); }
	}

	// @method getBounds(): LatLngBounds
	// Returns the `LatLngBounds` of the path.
	getBounds() {
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
			let lngR = Math.acos((Math.cos(latR * d) - Math.sin(lat * d) * Math.sin(lat2 * d)) /
				        (Math.cos(lat * d) * Math.cos(lat2 * d))) / d;

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

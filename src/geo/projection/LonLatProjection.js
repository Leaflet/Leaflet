// @ts-check
import {LatLng} from '../LatLng.js';
import {Bounds} from '../../geometry/Bounds.js';
import {Point} from '../../geometry/Point.js';

/** @import {LatLngExpression, PointExpression} from '../../types.js' */

/**
 * Equirectangular, or Plate Carree projection — the most simple projection, mostly used by GIS enthusiasts. Directly
 * maps `x` as longitude, and `y` as latitude. Also suitable for flat worlds, e.g. game maps. Used by the `EPSG:4326`
 * and `Simple` CRS.
 */
export const LonLatProjection = {
	/** @param {LatLngExpression} latlng */
	project(latlng) {
		latlng = new LatLng(latlng);
		return new Point(latlng.lng, latlng.lat);
	},

	/** @param {PointExpression} point */
	unproject(point) {
		point = new Point(point);
		return new LatLng(point.y, point.x);
	},

	bounds: /* @__PURE__ */ new Bounds([-180, -90], [180, 90])
};

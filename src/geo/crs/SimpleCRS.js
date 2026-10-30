// @ts-check
import {CRS} from './CRS.js';
import {LonLatProjection} from '../projection/LonLatProjection.js';
import {Transformation} from '../../geometry/Transformation.js';

/** @import {LatLng} from '../LatLng.js' */

/**
 * A simple CRS that maps longitude and latitude into `x` and `y` directly. May be used for maps of flat surfaces
 * (e.g. game maps). Note that the `y` axis should still be inverted (going from bottom to top). `distance()` returns
 * simple euclidean distance.
 */
export class SimpleCRS extends CRS {
	static projection = LonLatProjection;
	static transformation = /* @__PURE__ */ new Transformation(1, 0, -1, 0);

	/** @param {number} zoom */
	static scale(zoom) {
		return 2 ** zoom;
	}

	/** @param {number} scale */
	static zoom(scale) {
		return Math.log(scale) / Math.LN2;
	}

	/**
	 * @param {LatLng} latlng1
	 * @param {LatLng} latlng2
	 */
	static distance(latlng1, latlng2) {
		const dx = latlng2.lng - latlng1.lng,
		dy = latlng2.lat - latlng1.lat;

		return Math.sqrt(dx * dx + dy * dy);
	}

	static infinite = true;
}

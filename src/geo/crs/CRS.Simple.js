import {CRS} from './CRS.js';
import {LonLat} from '../projection/Projection.LonLat.js';
import {toTransformation} from '../../geometry/Transformation.js';
import * as Util from '../../core/Util.js';

/*
 * @namespace CRS
 * @crs L.CRS.Simple
 *
 * A simple CRS that maps longitude and latitude into `x` and `y` directly.
 * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
 * axis should still be inverted (going from bottom to top). `distance()` returns
 * simple euclidean distance.
 */

export const Simple = Util.extend({}, CRS, {
	projection: LonLat,
	transformation: toTransformation(1, 0, -1, 0),

	scale(zoom) {
		return Math.pow(2, zoom);
	},

	zoom(scale) {
		return Math.log(scale) / Math.LN2;
	},

	distance(latlng1, latlng2) {
		const dx = latlng2.lng - latlng1.lng,
		    dy = latlng2.lat - latlng1.lat;

		return Math.sqrt(dx * dx + dy * dy);
	},

	infinite: true
});

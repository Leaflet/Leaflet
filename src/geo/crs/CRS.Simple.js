import {CRS} from './CRS.js';
import {LonLat} from '../projection/Projection.LonLat.js';
import {Transformation} from '../../geometry/Transformation.js';

/*
 * @namespace CRS
 * @crs CRS.Simple
 *
 * A simple CRS that maps longitude and latitude into `x` and `y` directly.
 * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
 * axis should still be inverted (going from bottom to top). `distance()` returns
 * simple euclidean distance.
 */

export class Simple extends CRS {
	static projection = LonLat;
	static transformation = new Transformation(1, 0, -1, 0);

	static scale(zoom) {
		return 2 ** zoom;
	}

	static zoom(scale) {
		return Math.log(scale) / Math.LN2;
	}

	static distance(latlng1, latlng2) {
		const dx = latlng2.lng - latlng1.lng,
		dy = latlng2.lat - latlng1.lat;

		return Math.sqrt(dx * dx + dy * dy);
	}

	static infinite = true;
}

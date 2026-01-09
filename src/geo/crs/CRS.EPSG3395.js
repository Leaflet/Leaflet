import {Earth} from './CRS.Earth.js';
import {Mercator} from '../projection/Projection.Mercator.js';
import {Transformation} from '../../geometry/Transformation.js';

/*
 * @namespace CRS
 * @crs CRS.EPSG3395
 *
 * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
 */
export class EPSG3395 extends Earth {
	static code = 'EPSG:3395';
	static projection = Mercator;

	static transformation = (() => {
		const scale = 0.5 / (Math.PI * Mercator.R);
		return new Transformation(scale, 0.5, -scale, 0.5);
	})();
}

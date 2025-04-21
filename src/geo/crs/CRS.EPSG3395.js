import {Earth} from './CRS.Earth.js';
import {Mercator} from '../projection/Projection.Mercator.js';
import {Transformation} from '../../geometry/Transformation.js';

/*
 * @namespace CRS
 * @crs CRS.EPSG3395
 *
 * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
 */
export const EPSG3395 = {
	...Earth,
	code: 'EPSG:3395',
	projection: Mercator,

	transformation: (() => {
		const scale = 0.5 / (Math.PI * Mercator.R);
		return new Transformation(scale, 0.5, -scale, 0.5);
	})()
};

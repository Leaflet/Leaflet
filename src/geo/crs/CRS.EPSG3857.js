import {Earth} from './CRS.Earth.js';
import {SphericalMercator} from '../projection/Projection.SphericalMercator.js';
import {toTransformation} from '../../geometry/Transformation.js';

/*
 * @namespace CRS
 * @crs L.CRS.EPSG3857
 *
 * The most common CRS for online maps, used by almost all free and commercial
 * tile providers. Uses Spherical Mercator projection. Set in by default in
 * Map's `crs` option.
 */

export class EPSG3857 extends Earth {
	static code = 'EPSG:3857';
	static projection = SphericalMercator;

	static transformation = (() => {
		const scale = 0.5 / (Math.PI * SphericalMercator.R);
		return toTransformation(scale, 0.5, -scale, 0.5);
	})();
}

export class EPSG900913 extends EPSG3857 {
	static code = 'EPSG:900913';
}

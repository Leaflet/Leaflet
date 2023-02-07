import {Earth} from './CRS.Earth.js';
import {SphericalMercator} from '../projection/Projection.SphericalMercator.js';
import {toTransformation} from '../../geometry/Transformation.js';
import * as Util from '../../core/Util.js';

/*
 * @namespace CRS
 * @crs L.CRS.EPSG3857
 *
 * The most common CRS for online maps, used by almost all free and commercial
 * tile providers. Uses Spherical Mercator projection. Set in by default in
 * Map's `crs` option.
 */

export const EPSG3857 = Util.extend({}, Earth, {
	code: 'EPSG:3857',
	projection: SphericalMercator,

	transformation: (function () {
		const scale = 0.5 / (Math.PI * SphericalMercator.R);
		return toTransformation(scale, 0.5, -scale, 0.5);
	}())
});

export const EPSG900913 = Util.extend({}, EPSG3857, {
	code: 'EPSG:900913'
});

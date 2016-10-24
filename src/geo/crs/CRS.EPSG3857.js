import {Earth} from './CRS.Earth';
import {SphericalMercator} from '../projection/Projection.SphericalMercator';
import {Transformation} from '../../geometry/Transformation';
import * as Util from '../../core/Util';

/*
 * @namespace CRS
 * @crs L.CRS.EPSG3857
 *
 * The most common CRS for online maps, used by almost all free and commercial
 * tile providers. Uses Spherical Mercator projection. Set in by default in
 * Map's `crs` option.
 */

export var EPSG3857 = Util.extend({}, Earth, {
	code: 'EPSG:3857',
	projection: SphericalMercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * SphericalMercator.R);
		return new Transformation(scale, 0.5, -scale, 0.5);
	}())
});

export var EPSG900913 = Util.extend({}, EPSG3857, {
	code: 'EPSG:900913'
});

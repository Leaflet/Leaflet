import {Earth} from './CRS.Earth';
import {Mercator} from '../projection/Projection.Mercator';
import {Transformation} from '../../geometry/Transformation';
import * as Util from '../../core/Util';

/*
 * @namespace CRS
 * @crs L.CRS.EPSG3395
 *
 * Rarely used by some commercial tile providers. Uses Elliptical Mercator projection.
 */
export var EPSG3395 = Util.extend({}, Earth, {
	code: 'EPSG:3395',
	projection: Mercator,

	transformation: (function () {
		var scale = 0.5 / (Math.PI * Mercator.R);
		return new Transformation(scale, 0.5, -scale, 0.5);
	}())
});

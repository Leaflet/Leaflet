import {Earth} from './CRS.Earth';
import {LonLat} from '../projection/Projection.LonLat';
import {Transformation} from '../../geometry/Transformation';
import {extend} from '../../core/Util';

/*
 * @namespace CRS
 * @crs L.CRS.EPSG4326
 *
 * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
 */

export var EPSG4326 = extend({}, Earth, {
	code: 'EPSG:4326',
	projection: LonLat,
	transformation: new Transformation(1 / 180, 1, -1 / 180, 0.5)
});

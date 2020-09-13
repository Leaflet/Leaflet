import {CRS} from './CRS';
import * as Util from '../../core/Util';
import {R, distance, wrapLng} from './CRS.Earth.distance';

/*
 * @namespace CRS
 * @crs L.CRS.Earth
 *
 * Serves as the base for CRS that are global such that they cover the earth.
 * Can only be used as the base for other CRS and cannot be used directly,
 * since it does not have a `code`, `projection` or `transformation`. `distance()` returns
 * meters.
 */

export var Earth = Util.extend({}, CRS, {
	wrapLng: wrapLng,
	R: R,
	distance: distance
});

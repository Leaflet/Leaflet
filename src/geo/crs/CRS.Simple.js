import {CRS} from './CRS';
import {LonLat} from '../projection/Projection.LonLat';
import {toTransformation} from '../../geometry/Transformation';
import * as Util from '../../core/Util';
import {toLatLngBounds} from '../LatLngBounds';

/*
 * @namespace CRS
 * @crs L.CRS.Simple
 *
 * A simple CRS that maps longitude and latitude into `x` and `y` directly.
 * May be used for maps of flat surfaces (e.g. game maps). Note that the `y`
 * axis should still be inverted (going from bottom to top). `distance()` returns
 * simple euclidean distance.
 */

export var Simple = Util.extend({}, CRS, {
	projection: LonLat,
	transformation: toTransformation(1, 0, -1, 0),

	scale: function (zoom) {
		return Math.pow(2, zoom);
	},

	zoom: function (scale) {
		return Math.log(scale) / Math.LN2;
	},

	distance: function (latlng1, latlng2) {
		var dx = latlng2.lng - latlng1.lng,
		    dy = latlng2.lat - latlng1.lat;

		return Math.sqrt(dx * dx + dy * dy);
	},

	// @method extendLatLng(latLng: LatLng, size: Number): LatLngBounds
	// Returns a new `LatLngBounds` object in which each boundary is `size/2` meters apart from the `LatLng`.
	extendLatLng: function (latLng, size) {
		var halfSize = size / 2;

		return toLatLngBounds(
			[latLng.lat - halfSize, latLng.lng - halfSize],
			[latLng.lat + halfSize, latLng.lng + halfSize]);
	},

	infinite: true
});

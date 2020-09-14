import {LatLng}  from './LatLng';
import {toLatLngBounds} from './LatLngBounds';

// @method toBounds(sizeInMeters: Number): LatLngBounds
// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
LatLng.prototype.toBounds = function (sizeInMeters) {
	var latAccuracy = 180 * sizeInMeters / 40075017,
		    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

	return toLatLngBounds(
		        [this.lat - latAccuracy, this.lng - lngAccuracy],
		        [this.lat + latAccuracy, this.lng + lngAccuracy]);
};

// // @method toBounds(sizeInMeters: Number): LatLngBounds
// 	// Returns a new `LatLngBounds` object in which each boundary is `sizeInMeters/2` meters apart from the `LatLng`.
// 	toBounds: function (sizeInMeters) {
// 		var latAccuracy = 180 * sizeInMeters / 40075017,
// 		    lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

// 		return toLatLngBounds(
// 		        [this.lat - latAccuracy, this.lng - lngAccuracy],
// 		        [this.lat + latAccuracy, this.lng + lngAccuracy]);
// 	},

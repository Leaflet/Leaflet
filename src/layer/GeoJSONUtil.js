import * as Util from '../core/Util.js';
import {LatLng} from '../geo/LatLng.js';
import * as LineUtil from '../geometry/LineUtil.js';

// Shared by `GeoJSON` and the `toGeoJSON` methods of the layers it creates, which can't import `GeoJSON.js` without a cycle.

export function latLngToCoords(latlng, precision) {
	latlng = new LatLng(latlng);
	return latlng.alt !== undefined ?
		[Util.formatNum(latlng.lng, precision), Util.formatNum(latlng.lat, precision), Util.formatNum(latlng.alt, precision)] :
		[Util.formatNum(latlng.lng, precision), Util.formatNum(latlng.lat, precision)];
}

export function latLngsToCoords(latlngs, levelsDeep, close, precision) {
	// Check for flat arrays required to ensure unbalanced arrays are correctly converted in recursion
	const coords = latlngs.map(latlng => (levelsDeep ?
		latLngsToCoords(latlng, LineUtil.isFlat(latlng) ? 0 : levelsDeep - 1, close, precision) :
		latLngToCoords(latlng, precision)));

	if (!levelsDeep && close && coords.length > 0) {
		coords.push(coords[0].slice());
	}

	return coords;
}

export function getFeature(layer, newGeometry) {
	return layer.feature ?
		{...layer.feature, geometry: newGeometry} :
		asFeature(newGeometry);
}

export function asFeature(geojson) {
	if (geojson.type === 'Feature' || geojson.type === 'FeatureCollection') {
		return geojson;
	}

	return {
		type: 'Feature',
		properties: {},
		geometry: geojson
	};
}

export function pointToGeoJSON(layer, precision) {
	return getFeature(layer, {
		type: 'Point',
		coordinates: latLngToCoords(layer.getLatLng(), precision)
	});
}

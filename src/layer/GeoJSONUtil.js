// @ts-check
import * as Util from '../core/Util.js';
import {LatLng} from '../geo/LatLng.js';
import * as LineUtil from '../geometry/LineUtil.js';

/** @import {Feature, FeatureCollection, GeoJsonObject, Geometry, Point, Position} from 'geojson' */
/** @import {LatLngExpression} from '../types.js' */

// Shared by `GeoJSON` and the `toGeoJSON` methods of the layers it creates, which can't import `GeoJSON.js` without a cycle.

/**
 * @param {LatLngExpression} latlng
 * @param {number | false} [precision]
 * @returns {Position}
 */
export function latLngToCoords(latlng, precision) {
	latlng = new LatLng(latlng);
	return latlng.alt !== undefined ?
		[Util.formatNum(latlng.lng, precision), Util.formatNum(latlng.lat, precision), Util.formatNum(latlng.alt, precision)] :
		[Util.formatNum(latlng.lng, precision), Util.formatNum(latlng.lat, precision)];
}

/**
 * @param {any[]} latlngs
 * @param {number} [levelsDeep]
 * @param {boolean} [close]
 * @param {number | false} [precision]
 * @returns {any[]}
 */
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

/**
 * @template {Geometry} G
 * @param {{feature?: Feature}} layer
 * @param {G} newGeometry
 * @returns {Feature<G>}
 */
export function getFeature(layer, newGeometry) {
	return layer.feature ?
		{...layer.feature, geometry: newGeometry} :
		asFeature(newGeometry);
}

/**
 * @template {Geometry} G
 * @overload
 * @param {G | Feature<G>} geojson
 * @returns {Feature<G>}
 */
/**
 * @overload
 * @param {GeoJsonObject} geojson
 * @returns {Feature | FeatureCollection}
 */
/** @param {any} geojson */
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

/**
 * @param {{feature?: Feature, getLatLng(): LatLng}} layer
 * @param {number | false} [precision]
 * @returns {Feature<Point>}
 */
export function pointToGeoJSON(layer, precision) {
	return getFeature(layer, {
		type: 'Point',
		coordinates: latLngToCoords(layer.getLatLng(), precision)
	});
}

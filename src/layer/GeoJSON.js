// @ts-check
import {FeatureGroup} from './FeatureGroup.js';
import {Marker} from './marker/Marker.js';
import {Polyline} from './vector/Polyline.js';
import {Polygon} from './vector/Polygon.js';
import {LatLng} from '../geo/LatLng.js';
import {latLngToCoords, latLngsToCoords, getFeature, asFeature} from './GeoJSONUtil.js';

/** @import {Feature, GeoJSON as GeoJSONData, Geometry, Point as GeoJSONPoint, Position} from 'geojson' */
/** @import {FeatureGroupEventMap, GeoJSONOptions, PathOptions} from '../types.js' */
/** @import {Layer} from './Layer.js' */
/** @import {MemberLayer} from './LayerGroup.js' */

// GeoJSON keeps each created layer's own options there, for `resetStyle`; plugins like leaflet-realtime set it on
// layers they create themselves before calling `resetStyle`, so it stays a plain property
/** @typedef {Layer & {defaultOptions: object}} StyledLayer */

/**
 * A function returning the `Path` options for a GeoJSON feature.
 * @typedef {(feature: Feature<Geometry, any>) => Partial<PathOptions>} StyleFunction
 */

/**
 * @typedef {Object} GeoJSONEventProps
 * @property {Layer} layer The layer for the GeoJSON feature that is being added to the map.
 * @property {{[name: string]: any} | null} properties GeoJSON properties of the feature.
 * @property {string} geometryType GeoJSON geometry type of the feature.
 * @property {string | number} [id] GeoJSON ID of the feature (if present).
 */

/**
 * Represents a GeoJSON object or an array of GeoJSON objects. Allows you to
 * parse GeoJSON data and display it on the map. Extends `FeatureGroup`.
 * @example
 * ```js
 * new GeoJSON(data, {
 * 	style: function (feature) {
 * 		return {color: feature.properties.color};
 * 	}
 * }).bindPopup(function (layer) {
 * 	return layer.feature.properties.description;
 * }).addTo(map);
 * ```
 * @categoryDescription Methods
 * There are several static functions which can be called without instantiating GeoJSON:
 * @template {GeoJSONOptions} [O=GeoJSONOptions]
 * @template {FeatureGroupEventMap} [E=FeatureGroupEventMap]
 * @extends {FeatureGroup<O, E>}
 */
export class GeoJSON extends FeatureGroup {

	static initHooks = true;

	/**
	 * Creates a GeoJSON layer. Optionally accepts an object in [GeoJSON format](https://tools.ietf.org/html/rfc7946)
	 * to display on the map (you can alternatively add it later with `addData` method) and an `options` object.
	 * @param {GeoJSONData | GeoJSONData[] | null} [geojson]
	 * @param {Partial<O>} [options]
	 */
	constructor(geojson, options) {
		super(undefined, options);

		if (geojson) {
			this.addData(geojson);
		}

		this.callInitHooks();
	}

	/**
	 * Adds a GeoJSON object to the layer.
	 * @param {GeoJSONData | GeoJSONData[]} geojson
	 * @returns {this}
	 */
	addData(geojson) {
		if (Array.isArray(geojson) || 'features' in geojson) {
			for (const data of Array.isArray(geojson) ? geojson : geojson.features) {
				this.addData(data);
			}
			return this;
		}

		const options = this.options;
		const feature = GeoJSON.asFeature(geojson);

		if (!feature.geometry || (options.filter && !options.filter(feature))) { return this; }

		const layer = GeoJSON.geometryToLayer(feature, options);
		if (!layer) {
			return this;
		}
		layer.feature = feature;

		/** @type {StyledLayer} */ (layer).defaultOptions = layer.options;
		this.resetStyle(layer);

		if (options.onEachFeature) {
			options.onEachFeature(feature, layer);
		}

		return this.addLayer(layer);
	}

	/**
	 * Resets the given vector layer's style to the original GeoJSON style, useful for resetting style after
	 * hover events. If `layer` is omitted, the style of all features in the current layer is reset.
	 * @param {Layer} [layer]
	 * @returns {this}
	 */
	resetStyle(layer) {
		if (layer === undefined) {
			return this.eachLayer(this.resetStyle, this);
		}
		// reset any custom styles
		layer.options = Object.create(/** @type {StyledLayer} */ (layer).defaultOptions);
		this._setLayerStyle(layer, this.options.style);
		return this;
	}

	/**
	 * Changes styles of GeoJSON vector layers with the given style function.
	 * @param {Partial<PathOptions> | StyleFunction} style
	 * @returns {this}
	 */
	setStyle(style) {
		return this.eachLayer(layer => this._setLayerStyle(layer, style));
	}

	/**
	 * @param {MemberLayer} layer
	 * @param {Partial<PathOptions> | StyleFunction} [style]
	 */
	_setLayerStyle(layer, style) {
		if (layer.setStyle) {
			if (typeof style === 'function') {
				style = style(/** @type {Feature} */ (layer.feature));
			}
			layer.setStyle(style);
		}
	}

	/**
	 * Creates a `Layer` from a given GeoJSON feature. Can use a custom [`pointToLayer`](#geojson-pointtolayer)
	 * and/or [`coordsToLatLng`](#geojson-coordstolatlng) functions if provided as options. Returns `null` for a
	 * feature without a geometry.
	 * @param {GeoJSONData} geojson
	 * @param {Partial<GeoJSONOptions>} [options]
	 * @returns {Layer | null}
	 */
	static geometryToLayer(geojson, options) {

		const geometry = geojson.type === 'Feature' ? geojson.geometry : geojson,
		coords = /** @type {any} */ (geometry)?.coordinates,
		/** @type {Layer[]} */
		layers = [],
		pointToLayer = options?.pointToLayer,
		_coordsToLatLng = options?.coordsToLatLng ?? GeoJSON.coordsToLatLng;
		let latlng, latlngs;

		if (!geometry) {
			return null;
		}

		switch (geometry.type) {
		case 'Point':
			latlng = _coordsToLatLng(coords);
			return GeoJSON._pointToLayer(pointToLayer, geojson, latlng, options);

		case 'MultiPoint':
			for (const coord of coords) {
				latlng = _coordsToLatLng(coord);
				layers.push(GeoJSON._pointToLayer(pointToLayer, geojson, latlng, options));
			}
			return new FeatureGroup(layers);

		case 'LineString':
		case 'MultiLineString':
			latlngs = GeoJSON.coordsToLatLngs(coords, geometry.type === 'LineString' ? 0 : 1, _coordsToLatLng);
			return new Polyline(latlngs, options);

		case 'Polygon':
		case 'MultiPolygon':
			latlngs = GeoJSON.coordsToLatLngs(coords, geometry.type === 'Polygon' ? 1 : 2, _coordsToLatLng);
			return new Polygon(latlngs, options);

		case 'GeometryCollection':
			for (const g of geometry.geometries) {
				const geoLayer = GeoJSON.geometryToLayer({
					geometry: g,
					type: 'Feature',
					properties: /** @type {Feature} */ (geojson).properties
				}, options);

				if (geoLayer) {
					// so toGeoJSON exports MultiPoint and GeometryCollection members with their own type
					geoLayer.feature = GeoJSON.asFeature(g);
					layers.push(geoLayer);
				}
			}
			return new FeatureGroup(layers);

		case 'FeatureCollection':
			for (const f of geometry.features) {
				const featureLayer = GeoJSON.geometryToLayer(f, options);

				if (featureLayer) {
					layers.push(featureLayer);
				}
			}
			return new FeatureGroup(layers);

		default:
			throw new Error('Invalid GeoJSON object.');
		}
	}

	/**
	 * @param {GeoJSONOptions['pointToLayer']} pointToLayerFn
	 * @param {GeoJSONData} geojson
	 * @param {LatLng} latlng
	 * @param {Partial<GeoJSONOptions>} [options]
	 * @returns {Layer}
	 */
	static _pointToLayer(pointToLayerFn, geojson, latlng, options) {
		return pointToLayerFn ?
			pointToLayerFn(/** @type {Feature<GeoJSONPoint>} */ (geojson), latlng) :
			new Marker(latlng, /** @type {any} */ (options?.markersInheritOptions && options));
	}

	/**
	 * Creates a `LatLng` object from an array of 2 numbers (longitude, latitude)
	 * or 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
	 * @param {Position} coords
	 * @returns {LatLng}
	 */
	static coordsToLatLng(coords) {
		return new LatLng(coords[1], coords[0], coords[2]);
	}

	/**
	 * Creates a multidimensional array of `LatLng`s from a GeoJSON coordinates array. `levelsDeep` specifies
	 * the nesting level (0 is for an array of points, 1 for an array of arrays of points, etc., 0 by
	 * default). Can use a custom [`coordsToLatLng`](#geojson-coordstolatlng) function.
	 * @param {any[]} coords
	 * @param {number} [levelsDeep]
	 * @param {(coords: Position) => LatLng} [coordsToLatLng]
	 * @returns {any[]}
	 */
	static coordsToLatLngs(coords, levelsDeep, coordsToLatLng) {
		return coords.map(coord => (levelsDeep ?
			GeoJSON.coordsToLatLngs(coord, levelsDeep - 1, coordsToLatLng) :
			(coordsToLatLng || GeoJSON.coordsToLatLng)(coord)));
	}

	/**
	 * Reverse of [`coordsToLatLng`](#geojson-coordstolatlng) Coordinates
	 * values are rounded with [`formatNum`](#util-formatnum) function.
	 */
	static latLngToCoords = latLngToCoords;

	/**
	 * Reverse of [`coordsToLatLngs`](#geojson-coordstolatlngs) `close` determines whether the first point
	 * should be appended to the end of the array to close the feature, only used when `levelsDeep` is 0.
	 * False by default. Coordinates values are rounded with [`formatNum`](#util-formatnum) function.
	 */
	static latLngsToCoords = latLngsToCoords;

	/** Returns GeoJSON geometries/features of layer with new GeoJSON geometry. */
	static getFeature = getFeature;

	/** Normalize GeoJSON geometries/features into GeoJSON features. */
	static asFeature = asFeature;

}

import {Layer} from './Layer.js';
import * as Util from '../core/Util.js';
import {getFeature, asFeature} from './GeoJSONUtil.js';

/** @import {Feature, FeatureCollection, MultiPoint, Position} from 'geojson' */
/** @import {InteractiveLayerEventMap, InteractiveLayerOptions} from '../types.js' */
/** @import {LatLng} from '../geo/LatLng.js' */
/** @import {LatLngBounds} from '../geo/LatLngBounds.js' */
/** @import {LeafletMap} from '../map/Map.js' */
/** @import {Marker} from './marker/Marker.js' */

// a layer with the methods that only some layers have, which groups call when present
/**
 * @typedef {Layer & {
 *   setZIndex?(zIndex: number): unknown,
 *   setStyle?(style?: object): unknown,
 *   bringToFront?(): unknown,
 *   bringToBack?(): unknown,
 *   getBounds?(): LatLngBounds,
 *   getLatLng?(): LatLng,
 *   toGeoJSON?(precision?: number | false): Feature | FeatureCollection
 * }} MemberLayer
 */

/**
 * Used to group several layers and handle them as one. If you add it to the map, any layers added
 * or removed from the group will be added/removed on the map as well. Extends `Layer`.
 * @example
 * ```js
 * new LayerGroup([marker1, marker2])
 * 	.addLayer(polyline)
 * 	.addTo(map);
 * ```
 * @template {InteractiveLayerOptions} [O=InteractiveLayerOptions]
 * @template {InteractiveLayerEventMap} [E=InteractiveLayerEventMap]
 * @extends {Layer<O, E>}
 */
export class LayerGroup extends Layer {

	static initHooks = true;

	/**
	 * Create a layer group, optionally given an initial set of layers and an `options` object.
	 * @param {Layer[]} [layers]
	 * @param {Partial<O>} [options]
	 */
	constructor(layers, options) {
		super();

		Util.setOptions(this, options);

		/** @type {{[id: number]: Layer}} */
		this._layers = {};

		for (const layer of layers ?? []) {
			this.addLayer(layer);
		}

		this.callInitHooks();
	}

	/**
	 * Adds the given layer to the group.
	 * @param {Layer} layer
	 * @returns {this}
	 */
	addLayer(layer) {
		const id = this.getLayerId(layer);

		this._layers[id] = layer;

		this._map?.addLayer(layer);

		return this;
	}

	/**
	 * Removes the given layer, or the layer with the given internal ID, from the group.
	 * @param {Layer | number} layer
	 * @returns {this}
	 */
	removeLayer(layer) {
		const id = typeof layer === 'number' ? layer : this.getLayerId(layer);

		if (this._map && this._layers[id]) {
			this._map.removeLayer(this._layers[id]);
		}

		delete this._layers[id];

		return this;
	}

	/**
	 * Returns `true` if the given layer, or the layer with the given internal ID, is currently added to the group.
	 * @param {Layer | number} layer
	 * @returns {boolean}
	 */
	hasLayer(layer) {
		const layerId = typeof layer === 'number' ? layer : this.getLayerId(layer);
		return layerId in this._layers;
	}

	/**
	 * Removes all the layers from the group.
	 * @returns {this}
	 */
	clearLayers() {
		return this.eachLayer(this.removeLayer, this);
	}

	/** @param {LeafletMap} map */
	onAdd(map) {
		this.eachLayer(map.addLayer, map);
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		this.eachLayer(map.removeLayer, map);
	}

	/**
	 * Iterates over the layers of the group, optionally specifying context of the iterator function.
	 * ```js
	 * group.eachLayer(layer => layer.bindPopup('Hello'));
	 * ```
	 * @param {(layer: Layer) => void} method
	 * @param {any} [context]
	 * @returns {this}
	 */
	eachLayer(method, context) {
		for (const layer of Object.values(this._layers)) {
			method.call(context, layer);
		}
		return this;
	}

	/**
	 * Returns the layer with the given internal ID.
	 * @param {number} id
	 * @returns {Layer | undefined}
	 */
	getLayer(id) {
		return this._layers[id];
	}

	/**
	 * Returns an array of all the layers added to the group.
	 * @returns {Layer[]}
	 */
	getLayers() {
		/** @type {Layer[]} */
		const layers = [];
		this.eachLayer(layers.push, layers);
		return layers;
	}

	/**
	 * Calls `setZIndex` on every layer contained in this group, passing the z-index.
	 * @param {number} zIndex
	 * @returns {this}
	 */
	setZIndex(zIndex) {
		return this.eachLayer(l => /** @type {MemberLayer} */ (l).setZIndex?.(zIndex));
	}

	/**
	 * Returns the internal ID for a layer
	 * @param {Layer} layer
	 * @returns {number}
	 */
	getLayerId(layer) {
		return Util.stamp(layer);
	}

	/**
	 * @param {number | false} [precision]
	 * @returns {Feature<MultiPoint>}
	 */
	toMultiPoint(precision) {
		/** @type {Position[]} */
		const coords = [];

		this.eachLayer((layer) => {
			coords.push(/** @type {Marker} */ (layer).toGeoJSON(precision).geometry.coordinates);
		});

		return getFeature(this, {
			type: 'MultiPoint',
			coordinates: coords
		});
	}

	/**
	 * Coordinates values are rounded with [`formatNum`](#util-formatnum) function with given `precision`.
	 * Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON) representation of the layer group
	 * (as a GeoJSON `FeatureCollection`, `GeometryCollection`, or `MultiPoint`).
	 * @param {number | false} [precision]
	 * @returns {Feature | FeatureCollection}
	 */
	toGeoJSON(precision) {

		const type = this.feature?.geometry?.type;

		if (type === 'MultiPoint') {
			return this.toMultiPoint(precision);
		}

		const isGeometryCollection = type === 'GeometryCollection',
		/** @type {any[]} */
		jsons = [];

		this.eachLayer((/** @type {MemberLayer} */ layer) => {
			if (layer.toGeoJSON) {
				const json = layer.toGeoJSON(precision);
				if (isGeometryCollection) {
					jsons.push(/** @type {Feature} */ (json).geometry);
				} else {
					const feature = asFeature(json);
					// Squash nested feature collections
					if (feature.type === 'FeatureCollection') {
						jsons.push(...feature.features);
					} else {
						jsons.push(feature);
					}
				}
			}
		});

		if (isGeometryCollection) {
			return getFeature(this, {
				geometries: jsons,
				type: 'GeometryCollection'
			});
		}

		return {
			type: 'FeatureCollection',
			features: jsons
		};
	}
}


import {Layer} from './Layer.js';
import * as Util from '../core/Util.js';
import {getFeature, asFeature} from './GeoJSONUtil.js';

/**
 * Used to group several layers and handle them as one. If you add it to the map, any layers added
 * or removed from the group will be added/removed on the map as well. Extends `Layer`.
 * @example
 * ```js
 * new LayerGroup([marker1, marker2])
 * 	.addLayer(polyline)
 * 	.addTo(map);
 * ```
 * @todo inherits Interactive layer
 */
export class LayerGroup extends Layer {

	static initHooks = true;

	/**
	 * Create a layer group, optionally given an initial set of layers and an `options` object.
	 * @param {Layer[]} [layers]
	 * @param {object} [options]
	 */
	constructor(layers, options) {
		super();

		Util.setOptions(this, options);

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
	 * Removes the given layer from the group.
	 * @overload
	 * @param {Layer} layer
	 * @returns {this}
	 */
	/**
	 * Removes the layer with the given internal ID from the group.
	 * @overload
	 * @param {number} id
	 * @returns {this}
	 */
	removeLayer(layer) {
		const id = layer in this._layers ? layer : this.getLayerId(layer);

		if (this._map && this._layers[id]) {
			this._map.removeLayer(this._layers[id]);
		}

		delete this._layers[id];

		return this;
	}

	/**
	 * Returns `true` if the given layer is currently added to the group.
	 * @overload
	 * @param {Layer} layer
	 * @returns {boolean}
	 */
	/**
	 * Returns `true` if the given internal ID is currently added to the group.
	 * @overload
	 * @param {number} id
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

	onAdd(map) {
		this.eachLayer(map.addLayer, map);
	}

	onRemove(map) {
		this.eachLayer(map.removeLayer, map);
	}

	/**
	 * Iterates over the layers of the group, optionally specifying context of the iterator function.
	 * ```js
	 * group.eachLayer(layer => layer.bindPopup('Hello'));
	 * ```
	 * @param {Function} fn
	 * @param {object} [context]
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
	 * @returns {Layer}
	 */
	getLayer(id) {
		return this._layers[id];
	}

	/**
	 * Returns an array of all the layers added to the group.
	 * @returns {Layer[]}
	 */
	getLayers() {
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
		return this.eachLayer(l => l.setZIndex?.(zIndex));
	}

	/**
	 * Returns the internal ID for a layer
	 * @param {Layer} layer
	 * @returns {number}
	 */
	getLayerId(layer) {
		return Util.stamp(layer);
	}

	toMultiPoint(precision) {
		const coords = [];

		this.eachLayer((layer) => {
			coords.push(layer.toGeoJSON(precision).geometry.coordinates);
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
	 * @returns {object}
	 */
	toGeoJSON(precision) {

		const type = this.feature?.geometry?.type;

		if (type === 'MultiPoint') {
			return this.toMultiPoint(precision);
		}

		const isGeometryCollection = type === 'GeometryCollection',
		jsons = [];

		this.eachLayer((layer) => {
			if (layer.toGeoJSON) {
				const json = layer.toGeoJSON(precision);
				if (isGeometryCollection) {
					jsons.push(json.geometry);
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

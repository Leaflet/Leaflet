
import {Layer} from './Layer.js';
import * as Util from '../core/Util.js';
import {toLatLngBounds} from '../geo/LatLngBounds.js';

/*
 * @class LayerGroup
 * @aka L.LayerGroup
 * @inherits Interactive layer
 *
 * Used to group several layers and handle them as one. If you add it to the map,
 * any layers added or removed from the group will be added/removed on the map as
 * well. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * L.layerGroup([marker1, marker2])
 * 	.addLayer(polyline)
 * 	.addTo(map);
 * ```
 */

export const LayerGroup = Layer.extend({

	initialize(layers, options) {
		Util.setOptions(this, options);

		this._layers = {};

		let i, len;

		if (layers) {
			for (i = 0, len = layers.length; i < len; i++) {
				this.addLayer(layers[i]);
			}
		}
	},

	// @method addLayer(layer: Layer): this
	// Adds the given layer to the group.
	addLayer(layer) {
		const id = this.getLayerId(layer);

		this._layers[id] = layer;

		if (this._map) {
			this._map.addLayer(layer);
		}

		return this;
	},

	// @method removeLayer(layer: Layer): this
	// Removes the given layer from the group.
	// @alternative
	// @method removeLayer(id: Number): this
	// Removes the layer with the given internal ID from the group.
	removeLayer(layer) {
		const id = layer in this._layers ? layer : this.getLayerId(layer);

		if (this._map && this._layers[id]) {
			this._map.removeLayer(this._layers[id]);
		}

		delete this._layers[id];

		return this;
	},

	// @method hasLayer(layer: Layer): Boolean
	// Returns `true` if the given layer is currently added to the group.
	// @alternative
	// @method hasLayer(id: Number): Boolean
	// Returns `true` if the given internal ID is currently added to the group.
	hasLayer(layer) {
		const layerId = typeof layer === 'number' ? layer : this.getLayerId(layer);
		return layerId in this._layers;
	},

	// @method clearLayers(): this
	// Removes all the layers from the group.
	clearLayers() {
		return this.eachLayer(this.removeLayer, this);
	},

	// @method invoke(methodName: String, …): this
	// Calls `methodName` on every layer contained in this group, passing any
	// additional parameters. Has no effect if the layers contained do not
	// implement `methodName`.
	invoke(methodName, ...args) {
		let i, layer;

		for (i in this._layers) {
			layer = this._layers[i];

			if (layer[methodName]) {
				layer[methodName].apply(layer, args);
			}
		}

		return this;
	},

	onAdd(map) {
		this.eachLayer(map.addLayer, map);
	},

	onRemove(map) {
		this.eachLayer(map.removeLayer, map);
	},

	// @method eachLayer(fn: Function, context?: Object): this
	// Iterates over the layers of the group, optionally specifying context of the iterator function.
	// ```js
	// group.eachLayer(function (layer) {
	// 	layer.bindPopup('Hello');
	// });
	// ```
	eachLayer(method, context) {
		for (const i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	// @method getLayer(id: Number): Layer
	// Returns the layer with the given internal ID.
	getLayer(id) {
		return this._layers[id];
	},

	// @method getLayers(): Layer[]
	// Returns an array of all the layers added to the group.
	getLayers() {
		const layers = [];
		this.eachLayer(layers.push, layers);
		return layers;
	},

	// @method setZIndex(zIndex: Number): this
	// Calls `setZIndex` on every layer contained in this group, passing the z-index.
	setZIndex(zIndex) {
		return this.invoke('setZIndex', zIndex);
	},

	// @method getLayerId(layer: Layer): Number
	// Returns the internal ID for a layer
	getLayerId(layer) {
		return Util.stamp(layer);
	},

	// @method getBounds(): LatLngBounds
	// Returns the LatLngBounds of the Layer Group (created from bounds and coordinates of its children).
	getBounds(visitedIds = new Set()) {
		const bounds = toLatLngBounds();

		for (const layerId in this._layers) {
			const layer = this._layers[layerId];
			if (visitedIds.has(layerId)) {
				continue;
			}

			visitedIds.add(layerId);
			if (layer instanceof LayerGroup || layer.getBounds) {
				bounds.extend(layer.getBounds(visitedIds));
			} else if (layer.getLatLngs) {
				bounds.extend(layer.getLatLngs());
			} else if (layer.getLatLng) {
				bounds.extend(layer.getLatLng());
			}
		}
		return bounds;
	}
});


// @factory L.layerGroup(layers?: Layer[], options?: Object)
// Create a layer group, optionally given an initial set of layers and an `options` object.
export const layerGroup = function (layers, options) {
	return new LayerGroup(layers, options);
};

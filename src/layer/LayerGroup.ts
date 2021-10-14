/* eslint-disable prefer-rest-params */
/* eslint-disable @typescript-eslint/unbound-method */
/* eslint-disable prefer-spread */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

import {Layer} from './Layer';
import * as Util from '../core/Util';

import {Object, ReturnType} from 'typescript';
import {Point} from "../geometry";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

type LayerReturnType = ReturnType<typeof  FeatureGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type LayerGroupReturnType = ReturnType<typeof  LayerGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

type PointReturnType = ReturnType<typeof Point>;
type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
type roundReturnType = ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

type numberAuxX = ReturnType<typeof Object.Number>;

type numberAuxY = ReturnType<typeof Object.Number>;

/*
 * @class LayerGroup
 * @aka L.LayerGroup
 * @inherits Layer
 *
 * Used to group several layers and handle them as one. If you add it to the map,
 * any layers added or removed from the group will be added/removed on the map as
 * well. Extends `Layer`.
 *
 * @example
 *
 * ```tsc
 * L.layerGroup([marker1, marker2])
 * 	.addLayer(polyline)
 * 	.addTo(map);
 * ```
 */

export const LayerGroup = Layer.extend({

	initialize: function (layers, options) {
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
	addLayer: function (layer) {
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
	removeLayer: function (layer) {
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
	hasLayer: function (layer) {
		if (!layer) { return false; }
		const layerId = typeof layer === 'number' ? layer : this.getLayerId(layer);
		return layerId in this._layers;
	},

	// @method clearLayers(): this
	// Removes all the layers from the group.
	clearLayers: function () {
		return this.eachLayer(this.removeLayer, this);
	},

	// @method invoke(methodName: String, …): this
	// Calls `methodName` on every layer contained in this group, passing any
	// additional parameters. Has no effect if the layers contained do not
	// implement `methodName`.
	invoke: function (methodName) {
		const args = Array.prototype.slice.call(arguments, 1);
		const i
		const layer;

		for (i in this._layers) {
			layer = this._layers[i];

			if (layer[methodName]) {
				layer[methodName].apply(layer, args);
			}
		}

		return this;
	},

	onAdd: function (map) {
		this.eachLayer(map.addLayer, map);
	},

	onRemove: function (map) {
		this.eachLayer(map.removeLayer, map);
	},

	// @method eachLayer(fn: Function, context?: Object): this
	// Iterates over the layers of the group, optionally specifying context of the iterator function.
	// ```tsc
	// group.eachLayer(function (layer) {
	// 	layer.bindPopup('Hello');
	// });
	// ```
	eachLayer: function (method, context) {
		for (const i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	// @method getLayer(id: Number): Layer
	// Returns the layer with the given internal ID.
	getLayer: function (id) {
		return this._layers[id];
	},

	// @method getLayers(): Layer[]
	// Returns an array of all the layers added to the group.
	getLayers: function (): LayerReturnType[] {
		const layers = [];
		this.eachLayer(layers.push, layers);
		return layers;
	},

	// @method setZIndex(zIndex: Number): this
	// Calls `setZIndex` on every layer contained in this group, passing the z-index.
	setZIndex: function (zIndex:NumberReturnType) {
		return this.invoke('setZIndex', zIndex);
	},

	// @method getLayerId(layer: Layer): Number
	// Returns the internal ID for a layer
	getLayerId: function (layer:LayerReturnType) {
		return Util.stamp(layer);
	}
});


// @factory L.layerGroup(layers?: Layer[], options?: Object)
// Create a layer group, optionally given an initial set of layers and an `options` object.
export const layerGroup = function (layers:LayerReturnType[], options):LayerGroupReturnType {
	return new LayerGroup(layers, options);
};

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
import {FeatureGroup} from "./FeatureGroup";
import {LatLngBounds} from "../geo";
import {layers} from "../control/Control.Layers";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type ObjectReturnType = ReturnType<typeof Object>;
type FunctionReturnType = ReturnType<typeof Function>;
type MapReturnType = ReturnType<typeof Map>;
type LatLngBoundsReturnType= ReturnType<typeof LatLngBounds>;
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
// 12 IANA Considerations Optional parameters:  n/a
	initialize: function (layers:LayerReturnType, options:NumberReturnType):LatLngBoundsReturnType|void {
		Util.setOptions(this, options);

		this._layers = {};

		// const i;
		// const len;

		if (layers) {
			for (const i in layers) {
				this.addLayer(layers[i]);
			}
		}
	},

	// @method addLayer(layer: Layer): this
	// Adds the given layer to the group.
	addLayer: function (layer:LayerReturnType) {
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
	removeLayer: function (layer:LayerReturnType) {
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
	hasLayer: function (layer:LayerReturnType):boolean {
		if (!layer) { return false; }
		const layerId = typeof layer === 'number' ? layer : this.getLayerId(layer);
		return layerId in this._layers;
	},

	// @method clearLayers(): this
	// Removes all the layers from the group.
	clearLayers: function ():LayerReturnType {
		return this.eachLayer(this.removeLayer, this);
	},

	// @method invoke(methodName: String, …): this
	// Calls `methodName` on every layer contained in this group, passing any
	// additional parameters. Has no effect if the layers contained do not
	// implement `methodName`.
	invoke: function (methodName:StringReturnType):StringReturnType {
		const args = Array.prototype.slice.call(arguments, 1);
		// const i;
		let layer:StringReturnType[];

		for (const i in this._layers) {
			layer = this._layers[i];

			if (layer[methodName]) {
				layer[methodName].apply(layer, args);
			}
		}

		return this;
	},

	onAdd: function (map:MapReturnType) {
		this.eachLayer(map.addLayer, map);
	},

	onRemove: function (map:MapReturnType) {
		this.eachLayer(map.removeLayer, map);
	},

	// @method eachLayer(fn: Function, context?: Object): this
	// Iterates over the layers of the group, optionally specifying context of the iterator function.
	// ```tsc
	// group.eachLayer(function (layer) {
	// 	layer.bindPopup('Hello');
	// });
	// ```
	eachLayer: function (method:FunctionReturnType, context:ObjectReturnType):LayerReturnType {
		for (const i in this._layers) {
			method.call(context, this._layers[i]);
		}
		return this;
	},

	// @method getLayer(id: Number): Layer
	// Returns the layer with the given internal ID.
	getLayer: function (id:NumberReturnType) {
		return this._layers[id];
	},

	// @method getLayers(): Layer[]
	// Returns an array of all the layers added to the group.
	getLayers: function (): LayerReturnType[] {
		// let layers:LayerReturnType = [];
		this.eachLayer(layers.push, this.layers);
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
export const layerGroup = function (layers:LayerReturnType[], options:NumberReturnType):LayerGroupReturnType {
	// https://datatracker.ietf.org/doc/html/rfc7946
	// 12 IANA Considerations Optional parameters:  n/a
	return new LayerGroup(layers, options);
};

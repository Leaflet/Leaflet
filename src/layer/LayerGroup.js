import { Layer } from "./Layer.js";
import * as Util from "../core/Util.js";

/*
 * @class LayerGroup
 * @inherits Interactive layer
 *
 * Used to group several layers and handle them as one. If you add it to the map,
 * any layers added or removed from the group will be added/removed on the map as
 * well. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * new LayerGroup([marker1, marker2])
 * 	.addLayer(polyline)
 * 	.addTo(map);
 * ```
 */

// @constructor LayerGroup(layers?: Layer[], options?: Object)
// Create a layer group, optionally given an initial set of layers and an `options` object.
export class LayerGroup extends Layer {
  initialize(layers, options) {
    // for compatibility of code using `LayerGroup.extend`
    Util.setOptions(this, options);

    this._layers = {};

    for (const layer of layers ?? []) {
      this.addLayer(layer);
    }
  }

  // @method addLayer(layer: Layer): this
  // Adds the given layer to the group.
  addLayer(layer) {
    const id = this.getLayerId(layer);

    this._layers[id] = layer;

    this._map?.addLayer(layer);

    return this;
  }

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
  }

  // @method hasLayer(layer: Layer): Boolean
  // Returns `true` if the given layer is currently added to the group.
  // @alternative
  // @method hasLayer(id: Number): Boolean
  // Returns `true` if the given internal ID is currently added to the group.
  hasLayer(layer) {
    const layerId = typeof layer === "number" ? layer : this.getLayerId(layer);
    return layerId in this._layers;
  }

  // @method clearLayers(): this
  // Removes all the layers from the group.
  clearLayers() {
    return this.eachLayer(this.removeLayer, this);
  }

  onAdd(map) {
    this.eachLayer(map.addLayer, map);
  }

  onRemove(map) {
    this.eachLayer(map.removeLayer, map);
  }

  // @method eachLayer(fn: Function, context?: Object): this
  // Iterates over the layers of the group, optionally specifying context of the iterator function.
  // ```js
  // group.eachLayer(layer => layer.bindPopup('Hello'));
  // ```
  eachLayer(method, context) {
    for (const layer of Object.values(this._layers)) {
      method.call(context, layer);
    }
    return this;
  }

  // @method getLayer(id: Number): Layer
  // Returns the layer with the given internal ID.
  getLayer(id) {
    return this._layers[id];
  }

  // @method getLayers(): Layer[]
  // Returns an array of all the layers added to the group.
  getLayers() {
    const layers = [];
    this.eachLayer(layers.push, layers);
    return layers;
  }

  // @method setZIndex(zIndex: Number): this
  // Calls `setZIndex` on every layer contained in this group, passing the z-index.
  setZIndex(zIndex) {
    return this.eachLayer((l) => l.setZIndex?.(zIndex));
  }

  // @method getLayerId(layer: Layer): Number
  // Returns the internal ID for a layer
  getLayerId(layer) {
    return Util.stamp(layer);
  }
}

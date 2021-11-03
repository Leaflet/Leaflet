import { Map } from "../map/Map";
import { Layer } from "../Layer";
import { ControlOptions, Control } from "./Control";

export interface LayersOptions extends ControlOptions {
  collapsed?: boolean | undefined;
  autoZIndex?: boolean | undefined;
  hideSingleBase?: boolean | undefined;
  /**
   * Whether to sort the layers. When `false`, layers will keep the order in which they were added to the control.
   */
  sortLayers?: boolean | undefined;
  /**
   * A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
   * that will be used for sorting the layers, when `sortLayers` is `true`. The function receives both the
   * [`L.Layer`](https://leafletjs.com/reference.html#layer) instances and their names, as in
   * `sortFunction(layerA, layerB, nameA, nameB)`. By default, it sorts layers alphabetically by their name.
   */
  sortFunction?:
    | ((layerA: Layer, layerB: Layer, nameA: string, nameB: string) => number)
    | undefined;
}

export type LayersObject = Record<string, Layer>;

export class Layers extends Control {
  constructor(
    baseLayers?: LayersObject,
    overlays?: LayersObject,
    options?: LayersOptions
  );
  addBaseLayer(layer: Layer, name: string): this;
  addOverlay(layer: Layer, name: string): this;
  removeLayer(layer: Layer): this;
  expand(): this;
  collapse(): this;
  options: LayersOptions;
  onAdd(map: Map): HTMLElement;
  onRemove(map: Map): void;
}

export function layers(
  baseLayers?: LayersObject,
  overlays?: LayersObject,
  options?: LayersOptions
): Layers;

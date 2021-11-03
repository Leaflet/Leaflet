import { Evented, EventMap, LeafletEvent } from "../core/Events";
import { Map } from "../map/Map";
import {
  LayerOptions,
  LayerGroup,
  Content,
  Popup,
  PopupOptions,
  Tooltip,
  TooltipOptions,
  PopupEvent,
  TooltipEvent,
} from "../Leaflet";
import { LatLngExpression } from "../geo/LatLng";


export interface LayerOptions {
  pane?: string | undefined;
  attribution?: string | undefined;
}


interface LayerEventMap extends EventMap {
  add: LeafletEvent;
  remove: LeafletEvent;
  // Popup events
  popupopen: PopupEvent;
  popupclose: PopupEvent;
  // Tooltip events
  tooltipopen: TooltipEvent;
  tooltipclose: TooltipEvent;
}

export class Layer extends Evented<LayerEventMap> {
  constructor(options?: LayerOptions);
  addTo(map: Map | LayerGroup): this;
  remove(): this;
  removeFrom(map: Map): this;
  getPane(name?: string): HTMLElement | undefined;

  // Popup methods
  bindPopup(
    content: ((layer: Layer) => Content) | Content | Popup,
    options?: PopupOptions
  ): this;
  unbindPopup(): this;
  openPopup(latlng?: LatLngExpression): this;
  closePopup(): this;
  togglePopup(): this;
  isPopupOpen(): boolean;
  setPopupContent(content: Content | Popup): this;
  getPopup(): Popup | undefined;

  // Tooltip methods
  bindTooltip(
    content: ((layer: Layer) => Content) | Tooltip | Content,
    options?: TooltipOptions
  ): this;
  unbindTooltip(): this;
  openTooltip(latlng?: LatLngExpression): this;
  closeTooltip(): this;
  toggleTooltip(): this;
  isTooltipOpen(): boolean;
  setTooltipContent(content: Content | Tooltip): this;
  getTooltip(): Tooltip | undefined;

  // Extension methods
  onAdd(map: Map): this;
  onRemove(map: Map): this;
  getEvents?(): { [name: string]: (event: LeafletEvent) => void };
  getAttribution?(): string | null;
  beforeAdd?(map: Map): this;

  protected _map: Map;
}

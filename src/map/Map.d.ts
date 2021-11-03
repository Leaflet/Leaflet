import { Evented, EventMap, LeafletEvent } from "../core/Events";
import {
  MapOptions,
  Path,
  Renderer,
  Popup,
  Content,
  Tooltip,
  PopupOptions,
  TooltipOptions,
  ZoomPanOptions,
  PanOptions,
  PanInsideOptions,
  ZoomOptions,
  LocateOptions,
  FitBoundsOptions,
  InvalidateSizeOptions,
  DefaultMapPanes,
  LayersControlEvent,
  LayerEvent,
  ResizeEvent,
  PopupEvent,
  TooltipEvent,
  ErrorEvent,
  LocationEvent,
  LeafletMouseEvent,
  LeafletKeyboardEvent,
  ZoomAnimEvent,
} from "../Leaflet";
import { Bounds } from "../geometry/Bounds";
import {
    Point,
    PointExpression
} from "../geometry/Point";
import {
    LatLngExpression, LatLngBoundsExpression, LatLng,
    LatLngBounds
} from "../geo/LatLng";
import { Control } from "../control";
import { Layer } from "../Layer";
import { Handler } from "../Handler";

export interface MapEventMap extends EventMap {
  // Layer Events
  baselayerchange: LayersControlEvent;
  overlayadd: LayersControlEvent;
  overlayremove: LayersControlEvent;
  layeradd: LayerEvent;
  layerremove: LayerEvent;
  // Map state change Events
  zoomlevelschange: LeafletEvent;
  resize: ResizeEvent;
  unload: LeafletEvent;
  viewreset: LeafletEvent;
  load: LeafletEvent;
  zoomstart: LeafletEvent;
  movestart: LeafletEvent;
  zoom: LeafletEvent;
  move: LeafletEvent;
  zoomend: LeafletEvent;
  moveen: LeafletEvent;
  // Popup Events
  popupopen: PopupEvent;
  popupclose: PopupEvent;
  autopanstart: LeafletEvent;
  // Tooltip events
  tooltipopen: TooltipEvent;
  tooltipclose: TooltipEvent;
  // Location events
  locationerror: ErrorEvent;
  locationfound: LocationEvent;
  // Interactrion events
  click: LeafletMouseEvent;
  dblclick: LeafletMouseEvent;
  mousedown: LeafletMouseEvent;
  mouseup: LeafletMouseEvent;
  mouseover: LeafletMouseEvent;
  mouseout: LeafletMouseEvent;
  mousemove: LeafletMouseEvent;
  contextmenu: LeafletMouseEvent;
  keypress: LeafletKeyboardEvent;
  keydown: LeafletKeyboardEvent;
  keyup: LeafletKeyboardEvent;
  preclick: LeafletMouseEvent;
  // Other Events
  zoomanim: ZoomAnimEvent;
}

export class Map extends Evented<MapEventMap> {
  constructor(element: string | HTMLElement, options?: MapOptions);
  getRenderer(layer: Path): Renderer;

  // Methods for layers and controls
  addControl(control: Control): this;
  removeControl(control: Control): this;
  addLayer(layer: Layer): this;
  removeLayer(layer: Layer): this;
  hasLayer(layer: Layer): boolean;
  eachLayer(fn: (layer: Layer) => void, context?: any): this;
  openPopup(popup: Popup): this;
  openPopup(
    content: Content,
    latlng: LatLngExpression,
    options?: PopupOptions
  ): this;
  closePopup(popup?: Popup): this;
  openTooltip(tooltip: Tooltip): this;
  openTooltip(
    content: Content,
    latlng: LatLngExpression,
    options?: TooltipOptions
  ): this;
  closeTooltip(tooltip?: Tooltip): this;

  // Methods for modifying map state
  setView(
    center: LatLngExpression,
    zoom?: number,
    options?: ZoomPanOptions
  ): this;
  setZoom(zoom: number, options?: ZoomPanOptions): this;
  zoomIn(delta?: number, options?: ZoomOptions): this;
  zoomOut(delta?: number, options?: ZoomOptions): this;
  setZoomAround(
    position: Point | LatLngExpression,
    zoom: number,
    options?: ZoomOptions
  ): this;
  fitBounds(bounds: LatLngBoundsExpression, options?: FitBoundsOptions): this;
  fitWorld(options?: FitBoundsOptions): this;
  panTo(latlng: LatLngExpression, options?: PanOptions): this;
  panBy(offset: PointExpression, options?: PanOptions): this;
  setMaxBounds(bounds: LatLngBoundsExpression): this;
  setMinZoom(zoom: number): this;
  setMaxZoom(zoom: number): this;
  panInside(latLng: LatLngExpression, options?: PanInsideOptions): this;
  panInsideBounds(bounds: LatLngBoundsExpression, options?: PanOptions): this;
  /**
   * Boolean for animate or advanced ZoomPanOptions
   */
  invalidateSize(options?: boolean | InvalidateSizeOptions): this;
  stop(): this;
  flyTo(
    latlng: LatLngExpression,
    zoom?: number,
    options?: ZoomPanOptions
  ): this;
  flyToBounds(bounds: LatLngBoundsExpression, options?: FitBoundsOptions): this;

  // Other methods
  addHandler(name: string, HandlerClass: typeof Handler): this; // Alternatively, HandlerClass: new(map: Map) => Handler
  remove(): this;
  createPane(name: string, container?: HTMLElement): HTMLElement;
  /**
   * Name of the pane or the pane as HTML-Element
   */
  getPane(pane: string | HTMLElement): HTMLElement | undefined;
  getPanes(): { [name: string]: HTMLElement } & DefaultMapPanes;
  getContainer(): HTMLElement;
  whenReady(fn: () => void, context?: any): this;

  // Methods for getting map state
  getCenter(): LatLng;
  getZoom(): number;
  getBounds(): LatLngBounds;
  getMinZoom(): number;
  getMaxZoom(): number;
  getBoundsZoom(
    bounds: LatLngBoundsExpression,
    inside?: boolean,
    padding?: Point
  ): number;
  getSize(): Point;
  getPixelBounds(): Bounds;
  getPixelOrigin(): Point;
  getPixelWorldBounds(zoom?: number): Bounds;

  // Conversion methods
  getZoomScale(toZoom: number, fromZoom?: number): number;
  getScaleZoom(scale: number, fromZoom?: number): number;
  project(latlng: LatLngExpression, zoom?: number): Point;
  unproject(point: PointExpression, zoom?: number): LatLng;
  layerPointToLatLng(point: PointExpression): LatLng;
  latLngToLayerPoint(latlng: LatLngExpression): Point;
  wrapLatLng(latlng: LatLngExpression): LatLng;
  wrapLatLngBounds(bounds: LatLngBounds): LatLngBounds;
  distance(latlng1: LatLngExpression, latlng2: LatLngExpression): number;
  containerPointToLayerPoint(point: PointExpression): Point;
  containerPointToLatLng(point: PointExpression): LatLng;
  layerPointToContainerPoint(point: PointExpression): Point;
  latLngToContainerPoint(latlng: LatLngExpression): Point;
  mouseEventToContainerPoint(ev: MouseEvent): Point;
  mouseEventToLayerPoint(ev: MouseEvent): Point;
  mouseEventToLatLng(ev: MouseEvent): LatLng;

  // Geolocation methods
  locate(options?: LocateOptions): this;
  stopLocate(): this;

  // Properties
  attributionControl: Control.Attribution;
  boxZoom: Handler;
  doubleClickZoom: Handler;
  dragging: Handler;
  keyboard: Handler;
  scrollWheelZoom: Handler;
  tap?: Handler | undefined;
  touchZoom: Handler;
  zoomControl: Control.Zoom;

  options: MapOptions;
}

/**
 * ID of a HTML-Element as string or the HTML-ELement itself
 */
export function map(element: string | HTMLElement, options?: MapOptions): Map;

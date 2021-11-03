// Type definitions for Leaflet.js 1.7
// Project: https://github.com/Leaflet/Leaflet
// Definitions by: Alejandro Sánchez <https://github.com/alejo90>
//                 Arne Schubert <https://github.com/atd-schubert>
//                 Michael Auer <https://github.com/mcauer>
//                 Roni Karilkar <https://github.com/ronikar>
//                 Sandra Frischmuth <https://github.com/sanfrisc>
//                 Vladimir Dashukevich <https://github.com/life777>
//                 Henry Thasler <https://github.com/henrythasler>
//                 Colin Doig <https://github.com/captain-igloo>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 2.3

export as namespace L;

//@ts-ignore
import * as geojson from "geojson";
import { LeafletEvent } from "./core/Events";
import { Handler } from "./core/Handler";
import { Map } from "./map/Map";
import { Layer, LayerOptions } from "./Layer";
import { LatLngExpression, LatLngBoundsExpression, LatLngBounds, LatLng } from "./geo/LatLng";
import { PointExpression, Point, Coords } from "./geometry/Point";
export { Map, map } from "./map/Map";
export * from './control'
export * from './core'
export * from './dom'
export * from './geo'
export * from './geometry'

/** A constant that represents the Leaflet version in use. */
export const version: string;
export interface InteractiveLayerOptions extends LayerOptions {
  interactive?: boolean | undefined;
  bubblingMouseEvents?: boolean | undefined;
}

export interface GridLayerOptions {
  tileSize?: number | Point | undefined;
  opacity?: number | undefined;
  updateWhenIdle?: boolean | undefined;
  updateWhenZooming?: boolean | undefined;
  updateInterval?: number | undefined;
  attribution?: string | undefined;
  zIndex?: number | undefined;
  bounds?: LatLngBoundsExpression | undefined;
  minZoom?: number | undefined;
  maxZoom?: number | undefined;
  /**
   * Maximum zoom number the tile source has available. If it is specified, the tiles on all zoom levels higher than
   * `maxNativeZoom` will be loaded from `maxNativeZoom` level and auto-scaled.
   */
  maxNativeZoom?: number | undefined;
  /**
   * Minimum zoom number the tile source has available. If it is specified, the tiles on all zoom levels lower than
   * `minNativeZoom` will be loaded from `minNativeZoom` level and auto-scaled.
   */
  minNativeZoom?: number | undefined;
  noWrap?: boolean | undefined;
  pane?: string | undefined;
  className?: string | undefined;
  keepBuffer?: number | undefined;
}

export type DoneCallback = (error?: Error, tile?: HTMLElement) => void;

export interface InternalTiles {
  [key: string]: {
    active?: boolean | undefined;
    coords: Coords;
    current: boolean;
    el: HTMLElement;
    loaded?: Date | undefined;
    retain?: boolean | undefined;
  };
}

export class GridLayer extends Layer {
  constructor(options?: GridLayerOptions);
  bringToFront(): this;
  bringToBack(): this;
  getContainer(): HTMLElement | null;
  setOpacity(opacity: number): this;
  setZIndex(zIndex: number): this;
  isLoading(): boolean;
  redraw(): this;
  getTileSize(): Point;

  protected createTile(coords: Coords, done: DoneCallback): HTMLElement;
  protected _tileCoordsToKey(coords: Coords): string;
  protected _wrapCoords(parameter: Coords): Coords;

  protected _tiles: InternalTiles;
  protected _tileZoom?: number | undefined;
}

export function gridLayer(options?: GridLayerOptions): GridLayer;

export interface TileLayerOptions extends GridLayerOptions {
  id?: string | undefined;
  accessToken?: string | undefined;
  minZoom?: number | undefined;
  maxZoom?: number | undefined;
  maxNativeZoom?: number | undefined;
  minNativeZoom?: number | undefined;
  subdomains?: string | string[] | undefined;
  errorTileUrl?: string | undefined;
  zoomOffset?: number | undefined;
  tms?: boolean | undefined;
  zoomReverse?: boolean | undefined;
  detectRetina?: boolean | undefined;
  crossOrigin?: CrossOrigin | undefined;
  // [name: string]: any;
  // You are able add additional properties, but it makes this interface uncheckable.
  // See: https://github.com/DefinitelyTyped/DefinitelyTyped/issues/15313
  // Example:
  // tileLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png?{foo}&{bar}&{abc}', {foo: 'bar', bar: (data: any) => 'foo', abc: () => ''});
}

export class TileLayer extends GridLayer {
  constructor(urlTemplate: string, options?: TileLayerOptions);
  setUrl(url: string, noRedraw?: boolean): this;
  getTileUrl(coords: L.Coords): string;

  protected _tileOnLoad(done: L.DoneCallback, tile: HTMLElement): void;
  protected _tileOnError(
    done: L.DoneCallback,
    tile: HTMLElement,
    e: Error
  ): void;
  protected _abortLoading(): void;
  protected _getZoomForUrl(): number;

  options: TileLayerOptions;
}

export function tileLayer(
  urlTemplate: string,
  options?: TileLayerOptions
): TileLayer;

export namespace TileLayer {
  class WMS extends TileLayer {
    constructor(baseUrl: string, options: WMSOptions);
    setParams(params: WMSParams, noRedraw?: boolean): this;

    wmsParams: WMSParams;
    options: WMSOptions;
  }
}

export interface WMSOptions extends TileLayerOptions {
  layers?: string | undefined;
  styles?: string | undefined;
  format?: string | undefined;
  transparent?: boolean | undefined;
  version?: string | undefined;
  crs?: CRS | undefined;
  uppercase?: boolean | undefined;
}

export interface WMSParams {
  format?: string | undefined;
  layers: string;
  request?: string | undefined;
  service?: string | undefined;
  styles?: string | undefined;
  version?: string | undefined;
  transparent?: boolean | undefined;
  width?: number | undefined;
  height?: number | undefined;
}

export namespace tileLayer {
  function wms(baseUrl: string, options?: WMSOptions): TileLayer.WMS;
}

export type CrossOrigin = boolean | string;

export interface ImageOverlayOptions extends InteractiveLayerOptions {
  opacity?: number | undefined;
  alt?: string | undefined;
  interactive?: boolean | undefined;
  attribution?: string | undefined;
  crossOrigin?: CrossOrigin | undefined;
  errorOverlayUrl?: string | undefined;
  zIndex?: number | undefined;
  className?: string | undefined;
}

export class ImageOverlay extends Layer {
  constructor(
    imageUrl: string,
    bounds: LatLngBoundsExpression,
    options?: ImageOverlayOptions
  );
  setOpacity(opacity: number): this;
  bringToFront(): this;
  bringToBack(): this;
  setUrl(url: string): this;

  /** Update the bounds that this ImageOverlay covers */
  setBounds(bounds: LatLngBounds): this;

  /** Changes the zIndex of the image overlay */
  setZIndex(value: number): this;

  /** Get the bounds that this ImageOverlay covers */
  getBounds(): LatLngBounds;

  /** Get the img element that represents the ImageOverlay on the map */
  getElement(): HTMLImageElement | undefined;

  options: ImageOverlayOptions;
}

export function imageOverlay(
  imageUrl: string,
  bounds: LatLngBoundsExpression,
  options?: ImageOverlayOptions
): ImageOverlay;

export class SVGOverlay extends Layer {
  /** SVGOverlay doesn't extend ImageOverlay because SVGOverlay.getElement returns SVGElement */
  constructor(
    svgImage: string | SVGElement,
    bounds: LatLngBoundsExpression,
    options?: ImageOverlayOptions
  );
  setOpacity(opacity: number): this;
  bringToFront(): this;
  bringToBack(): this;
  setUrl(url: string): this;

  /** Update the bounds that this SVGOverlay covers */
  setBounds(bounds: LatLngBounds): this;

  /** Changes the zIndex of the image overlay */
  setZIndex(value: number): this;

  /** Get the bounds that this SVGOverlay covers */
  getBounds(): LatLngBounds;

  /** Get the img element that represents the SVGOverlay on the map */
  getElement(): SVGElement | undefined;

  options: ImageOverlayOptions;
}

export function svgOverlay(
  svgImage: string | SVGElement,
  bounds: LatLngBoundsExpression,
  options?: ImageOverlayOptions
): SVGOverlay;

export interface VideoOverlayOptions extends ImageOverlayOptions {
  /** Whether the video starts playing automatically when loaded. */
  autoplay?: boolean | undefined;
  /** Whether the video will loop back to the beginning when played. */
  loop?: boolean | undefined;
  /**
   * Whether the video will save aspect ratio after the projection. Relevant for supported browsers. See
   * [browser compatibility](https://developer.mozilla.org/en-US/docs/Web/CSS/object-fit)
   */
  keepAspectRatio?: boolean | undefined;
  /** Whether the video starts on mute when loaded. */
  muted?: boolean | undefined;
}

export class VideoOverlay extends Layer {
  /** VideoOverlay doesn't extend ImageOverlay because VideoOverlay.getElement returns HTMLImageElement */
  constructor(
    video: string | string[] | HTMLVideoElement,
    bounds: LatLngBoundsExpression,
    options?: VideoOverlayOptions
  );
  setOpacity(opacity: number): this;
  bringToFront(): this;
  bringToBack(): this;
  setUrl(url: string): this;

  /** Update the bounds that this VideoOverlay covers */
  setBounds(bounds: LatLngBounds): this;

  /** Get the bounds that this VideoOverlay covers */
  getBounds(): LatLngBounds;

  /** Get the video element that represents the VideoOverlay on the map */
  getElement(): HTMLVideoElement | undefined;

  options: VideoOverlayOptions;
}

export function videoOverlay(
  video: string | string[] | HTMLVideoElement,
  bounds: LatLngBoundsExpression,
  options?: VideoOverlayOptions
): VideoOverlay;

export type LineCapShape = "butt" | "round" | "square" | "inherit";

export type LineJoinShape = "miter" | "round" | "bevel" | "inherit";

export type FillRule = "nonzero" | "evenodd" | "inherit";

export interface PathOptions extends InteractiveLayerOptions {
  stroke?: boolean | undefined;
  color?: string | undefined;
  weight?: number | undefined;
  opacity?: number | undefined;
  lineCap?: LineCapShape | undefined;
  lineJoin?: LineJoinShape | undefined;
  dashArray?: string | number[] | undefined;
  dashOffset?: string | undefined;
  fill?: boolean | undefined;
  fillColor?: string | undefined;
  fillOpacity?: number | undefined;
  fillRule?: FillRule | undefined;
  renderer?: Renderer | undefined;
  className?: string | undefined;
}

export abstract class Path extends Layer {
  redraw(): this;
  setStyle(style: PathOptions): this;
  bringToFront(): this;
  bringToBack(): this;
  getElement(): Element | undefined;

  options: PathOptions;
}

export interface PolylineOptions extends PathOptions {
  smoothFactor?: number | undefined;
  noClip?: boolean | undefined;
}

export class Polyline<
  T extends geojson.GeometryObject =
    | geojson.LineString
    | geojson.MultiLineString,
  P = any
> extends Path {
  constructor(
    latlngs: LatLngExpression[] | LatLngExpression[][],
    options?: PolylineOptions
  );
  toGeoJSON(precision?: number): geojson.Feature<T, P>;
  getLatLngs(): LatLng[] | LatLng[][] | LatLng[][][];
  setLatLngs(
    latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][]
  ): this;
  isEmpty(): boolean;
  getCenter(): LatLng;
  getBounds(): LatLngBounds;
  addLatLng(
    latlng: LatLngExpression | LatLngExpression[],
    latlngs?: LatLng[]
  ): this;
  closestLayerPoint(p: Point): Point;

  feature?: geojson.Feature<T, P> | undefined;
  options: PolylineOptions;
}

export function polyline(
  latlngs: LatLngExpression[] | LatLngExpression[][],
  options?: PolylineOptions
): Polyline;

export class Polygon<P = any> extends Polyline<
  geojson.Polygon | geojson.MultiPolygon,
  P
> {
  constructor(
    latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][],
    options?: PolylineOptions
  );
}

export function polygon(
  latlngs: LatLngExpression[] | LatLngExpression[][] | LatLngExpression[][][],
  options?: PolylineOptions
): Polygon;

export class Rectangle<P = any> extends Polygon<P> {
  constructor(latLngBounds: LatLngBoundsExpression, options?: PolylineOptions);
  setBounds(latLngBounds: LatLngBoundsExpression): this;
}

export function rectangle(
  latLngBounds: LatLngBoundsExpression,
  options?: PolylineOptions
): Rectangle;

export interface CircleMarkerOptions extends PathOptions {
  radius?: number | undefined;
}

export class CircleMarker<P = any> extends Path {
  constructor(latlng: LatLngExpression, options?: CircleMarkerOptions);
  toGeoJSON(precision?: number): geojson.Feature<geojson.Point, P>;
  setLatLng(latLng: LatLngExpression): this;
  getLatLng(): LatLng;
  setRadius(radius: number): this;
  getRadius(): number;

  options: CircleMarkerOptions;
  feature?: geojson.Feature<geojson.Point, P> | undefined;
}

export function circleMarker(
  latlng: LatLngExpression,
  options?: CircleMarkerOptions
): CircleMarker;

export class Circle<P = any> extends CircleMarker<P> {
  constructor(latlng: LatLngExpression, options?: CircleMarkerOptions);
  constructor(
    latlng: LatLngExpression,
    radius: number,
    options?: CircleMarkerOptions
  ); // deprecated!
  getBounds(): LatLngBounds;
}

export function circle(
  latlng: LatLngExpression,
  options?: CircleMarkerOptions
): Circle;
export function circle(
  latlng: LatLngExpression,
  radius: number,
  options?: CircleMarkerOptions
): Circle; // deprecated!

export interface RendererOptions extends LayerOptions {
  padding?: number | undefined;
  tolerance?: number | undefined;
}

export class Renderer extends Layer {
  constructor(options?: RendererOptions);

  options: RendererOptions;
}

export class SVG extends Renderer {}

export namespace SVG {
  function create(name: string): SVGElement;

  function pointsToPath(rings: PointExpression[], close: boolean): string;
}

export function svg(options?: RendererOptions): SVG;

export class Canvas extends Renderer {}

export function canvas(options?: RendererOptions): Canvas;

/**
 * Used to group several layers and handle them as one.
 * If you add it to the map, any layers added or removed from the group will be
 * added/removed on the map as well. Extends Layer.
 */
export class LayerGroup<P = any> extends Layer {
  constructor(layers?: Layer[], options?: LayerOptions);

  /**
   * Returns a GeoJSON representation of the layer group (as a GeoJSON GeometryCollection, GeoJSONFeatureCollection or Multipoint).
   */
  toGeoJSON(
    precision?: number
  ):
    | geojson.FeatureCollection<geojson.GeometryObject, P>
    | geojson.Feature<geojson.MultiPoint, P>
    | geojson.GeometryCollection;

  /**
   * Adds the given layer to the group.
   */
  addLayer(layer: Layer): this;

  /**
   * Removes the layer with the given internal ID or the given layer from the group.
   */
  removeLayer(layer: number | Layer): this;

  /**
   * Returns true if the given layer is currently added to the group.
   */
  hasLayer(layer: Layer): boolean;

  /**
   * Removes all the layers from the group.
   */
  clearLayers(): this;

  /**
   * Calls methodName on every layer contained in this group, passing any additional parameters.
   * Has no effect if the layers contained do not implement methodName.
   */
  invoke(methodName: string, ...params: any[]): this;

  /**
   * Iterates over the layers of the group,
   * optionally specifying context of the iterator function.
   */
  eachLayer(fn: (layer: Layer) => void, context?: any): this;

  /**
   * Returns the layer with the given internal ID.
   */
  getLayer(id: number): Layer | undefined;

  /**
   * Returns an array of all the layers added to the group.
   */
  getLayers(): Layer[];

  /**
   * Calls setZIndex on every layer contained in this group, passing the z-index.
   */
  setZIndex(zIndex: number): this;

  /**
   * Returns the internal ID for a layer
   */
  getLayerId(layer: Layer): number;

  feature?:
    | geojson.FeatureCollection<geojson.GeometryObject, P>
    | geojson.Feature<geojson.MultiPoint, P>
    | geojson.GeometryCollection
    | undefined;
}

/**
 * Create a layer group, optionally given an initial set of layers and an `options` object.
 */
export function layerGroup(
  layers?: Layer[],
  options?: LayerOptions
): LayerGroup;

/**
 * Extended LayerGroup that also has mouse events (propagated from
 * members of the group) and a shared bindPopup method.
 */
export class FeatureGroup<P = any> extends LayerGroup<P> {
  /**
   * Sets the given path options to each layer of the group that has a setStyle method.
   */
  setStyle(style: PathOptions): this;

  /**
   * Brings the layer group to the top of all other layers
   */
  bringToFront(): this;

  /**
   * Brings the layer group to the top [sic] of all other layers
   */
  bringToBack(): this;

  /**
   * Returns the LatLngBounds of the Feature Group (created from
   * bounds and coordinates of its children).
   */
  getBounds(): LatLngBounds;
}

/**
 * Create a feature group, optionally given an initial set of layers.
 */
export function featureGroup(
  layers?: Layer[],
  options?: LayerOptions
): FeatureGroup;

export type StyleFunction<P = any> = (
  feature?: geojson.Feature<geojson.GeometryObject, P>
) => PathOptions;

export interface GeoJSONOptions<P = any> extends InteractiveLayerOptions {
  /**
   * A Function defining how GeoJSON points spawn Leaflet layers.
   * It is internally called when data is added, passing the GeoJSON point
   * feature and its LatLng.
   *
   * The default is to spawn a default Marker:
   *
   * ```
   * function(geoJsonPoint, latlng) {
   *     return L.marker(latlng);
   * }
   * ```
   */
  pointToLayer?(
    geoJsonPoint: geojson.Feature<geojson.Point, P>,
    latlng: LatLng
  ): Layer; // should import GeoJSON typings

  /**
   * PathOptions or a Function defining the Path options for styling GeoJSON lines and polygons,
   * called internally when data is added.
   *
   * The default value is to not override any defaults:
   *
   * ```
   * function (geoJsonFeature) {
   *     return {}
   * }
   * ```
   */
  style?: PathOptions | StyleFunction<P> | undefined;

  /**
   * A Function that will be called once for each created Feature, after it
   * has been created and styled. Useful for attaching events and popups to features.
   *
   * The default is to do nothing with the newly created layers:
   *
   * ```
   * function (feature, layer) {}
   * ```
   */
  onEachFeature?(
    feature: geojson.Feature<geojson.GeometryObject, P>,
    layer: Layer
  ): void;

  /**
   * A Function that will be used to decide whether to show a feature or not.
   *
   * The default is to show all features:
   *
   * ```
   * function (geoJsonFeature) {
   *     return true;
   * }
   * ```
   */
  filter?(geoJsonFeature: geojson.Feature<geojson.GeometryObject, P>): boolean;

  /**
   * A Function that will be used for converting GeoJSON coordinates to LatLngs.
   * The default is the coordsToLatLng static method.
   */
  coordsToLatLng?(coords: [number, number] | [number, number, number]): LatLng; // check if LatLng has an altitude property

  /** Whether default Markers for "Point" type Features inherit from group options. */
  markersInheritOptions?: boolean | undefined;
}

/**
 * Represents a GeoJSON object or an array of GeoJSON objects.
 * Allows you to parse GeoJSON data and display it on the map. Extends FeatureGroup.
 */
export class GeoJSON<P = any> extends FeatureGroup<P> {
  /**
   * Creates a Layer from a given GeoJSON feature. Can use a custom pointToLayer
   * and/or coordsToLatLng functions if provided as options.
   */
  static geometryToLayer<P = any>(
    featureData: geojson.Feature<geojson.GeometryObject, P>,
    options?: GeoJSONOptions<P>
  ): Layer;

  /**
   * Creates a LatLng object from an array of 2 numbers (longitude, latitude) or
   * 3 numbers (longitude, latitude, altitude) used in GeoJSON for points.
   */
  static coordsToLatLng(
    coords: [number, number] | [number, number, number]
  ): LatLng;

  /**
   * Creates a multidimensional array of LatLngs from a GeoJSON coordinates array.
   * levelsDeep specifies the nesting level (0 is for an array of points, 1 for an array of
   * arrays of points, etc., 0 by default).
   * Can use a custom coordsToLatLng function.
   */
  static coordsToLatLngs(
    coords: any[],
    levelsDeep?: number,
    coordsToLatLng?: (
      coords: [number, number] | [number, number, number]
    ) => LatLng
  ): any[]; // Using any[] to avoid artificially limiting valid calls

  /**
   * Reverse of coordsToLatLng
   */
  static latLngToCoords(
    latlng: LatLng
  ): [number, number] | [number, number, number];

  /**
   * Reverse of coordsToLatLngs closed determines whether the first point should be
   * appended to the end of the array to close the feature, only used when levelsDeep is 0.
   * False by default.
   */
  static latLngsToCoords(
    latlngs: any[],
    levelsDeep?: number,
    closed?: boolean
  ): any[]; // Using any[] to avoid artificially limiting valid calls

  /**
   * Normalize GeoJSON geometries/features into GeoJSON features.
   */
  static asFeature<P = any>(
    geojson: geojson.Feature<geojson.GeometryObject, P> | geojson.GeometryObject
  ): geojson.Feature<geojson.GeometryObject, P>;

  constructor(geojson?: geojson.GeoJsonObject, options?: GeoJSONOptions<P>);
  /**
   * Adds a GeoJSON object to the layer.
   */
  addData(data: geojson.GeoJsonObject): this;

  /**
   * Resets the given vector layer's style to the original GeoJSON style,
   * useful for resetting style after hover events.
   */
  resetStyle(layer?: Layer): this;

  /**
   * Same as FeatureGroup's setStyle method, but style-functions are also
   * allowed here to set the style according to the feature.
   */
  setStyle(style: PathOptions | StyleFunction<P>): this;

  options: GeoJSONOptions<P>;
}

/**
 * Creates a GeoJSON layer.
 *
 * Optionally accepts an object in GeoJSON format to display on the
 * map (you can alternatively add it later with addData method) and
 * an options object.
 */
export function geoJSON<P = any>(
  geojson?: geojson.GeoJsonObject,
  options?: GeoJSONOptions<P>
): GeoJSON<P>;

export type Zoom = boolean | "center";

export interface MapOptions {
  preferCanvas?: boolean | undefined;

  // Control options
  attributionControl?: boolean | undefined;
  zoomControl?: boolean | undefined;

  // Interaction options
  closePopupOnClick?: boolean | undefined;
  zoomSnap?: number | undefined;
  zoomDelta?: number | undefined;
  trackResize?: boolean | undefined;
  boxZoom?: boolean | undefined;
  doubleClickZoom?: Zoom | undefined;
  dragging?: boolean | undefined;

  // Map state options
  crs?: CRS | undefined;
  center?: LatLngExpression | undefined;
  zoom?: number | undefined;
  minZoom?: number | undefined;
  maxZoom?: number | undefined;
  layers?: Layer[] | undefined;
  maxBounds?: LatLngBoundsExpression | undefined;
  renderer?: Renderer | undefined;

  // Animation options
  fadeAnimation?: boolean | undefined;
  markerZoomAnimation?: boolean | undefined;
  transform3DLimit?: number | undefined;
  zoomAnimation?: boolean | undefined;
  zoomAnimationThreshold?: number | undefined;

  // Panning inertia options
  inertia?: boolean | undefined;
  inertiaDeceleration?: number | undefined;
  inertiaMaxSpeed?: number | undefined;
  easeLinearity?: number | undefined;
  worldCopyJump?: boolean | undefined;
  maxBoundsViscosity?: number | undefined;

  // Keyboard navigation options
  keyboard?: boolean | undefined;
  keyboardPanDelta?: number | undefined;

  // Mousewheel options
  scrollWheelZoom?: Zoom | undefined;
  wheelDebounceTime?: number | undefined;
  wheelPxPerZoomLevel?: number | undefined;

  // Touch interaction options
  tap?: boolean | undefined;
  tapTolerance?: number | undefined;
  touchZoom?: Zoom | undefined;
  bounceAtZoomLimits?: boolean | undefined;
}

export interface DivOverlayOptions {
  offset?: PointExpression | undefined;
  zoomAnimation?: boolean | undefined;
  className?: string | undefined;
  pane?: string | undefined;
}

export abstract class DivOverlay extends Layer {
  constructor(options?: DivOverlayOptions, source?: Layer);
  getLatLng(): LatLng | undefined;
  setLatLng(latlng: LatLngExpression): this;
  getContent(): Content | ((source: Layer) => Content) | undefined;
  setContent(htmlContent: ((source: Layer) => Content) | Content): this;
  getElement(): HTMLElement | undefined;
  update(): void;
  isOpen(): boolean;
  bringToFront(): this;
  bringToBack(): this;

  options: DivOverlayOptions;
}

export interface PopupOptions extends DivOverlayOptions {
  maxWidth?: number | undefined;
  minWidth?: number | undefined;
  maxHeight?: number | undefined;
  keepInView?: boolean | undefined;
  closeButton?: boolean | undefined;
  autoPan?: boolean | undefined;
  autoPanPaddingTopLeft?: PointExpression | undefined;
  autoPanPaddingBottomRight?: PointExpression | undefined;
  autoPanPadding?: PointExpression | undefined;
  autoClose?: boolean | undefined;
  closeOnClick?: boolean | undefined;
  closeOnEscapeKey?: boolean | undefined;
}

export type Content = string | HTMLElement;

export class Popup extends DivOverlay {
  constructor(options?: PopupOptions, source?: Layer);
  openOn(map: Map): this;

  options: PopupOptions;
}

export function popup(options?: PopupOptions, source?: Layer): Popup;

export type Direction = "right" | "left" | "top" | "bottom" | "center" | "auto";

export interface TooltipOptions extends DivOverlayOptions {
  pane?: string | undefined;
  offset?: PointExpression | undefined;
  direction?: Direction | undefined;
  permanent?: boolean | undefined;
  sticky?: boolean | undefined;
  interactive?: boolean | undefined;
  opacity?: number | undefined;
}

export class Tooltip extends DivOverlay {
  constructor(options?: TooltipOptions, source?: Layer);
  setOpacity(val: number): void;

  options: TooltipOptions;
}

export function tooltip(options?: TooltipOptions, source?: Layer): Tooltip;

export interface ZoomOptions {
  animate?: boolean | undefined;
}

export interface PanOptions {
  animate?: boolean | undefined;
  duration?: number | undefined;
  easeLinearity?: number | undefined;
  noMoveStart?: boolean | undefined;
}

// This is not empty, it extends two interfaces into one...
export interface ZoomPanOptions extends ZoomOptions, PanOptions {}

export interface InvalidateSizeOptions extends ZoomPanOptions {
  debounceMoveend?: boolean | undefined;
  pan?: boolean | undefined;
}

export interface FitBoundsOptions extends ZoomOptions, PanOptions {
  paddingTopLeft?: PointExpression | undefined;
  paddingBottomRight?: PointExpression | undefined;
  padding?: PointExpression | undefined;
  maxZoom?: number | undefined;
}

export interface PanInsideOptions {
  paddingTopLeft?: PointExpression | undefined;
  paddingBottomRight?: PointExpression | undefined;
  padding?: PointExpression | undefined;
}

export interface LocateOptions {
  watch?: boolean | undefined;
  setView?: boolean | undefined;
  maxZoom?: number | undefined;
  timeout?: number | undefined;
  maximumAge?: number | undefined;
  enableHighAccuracy?: boolean | undefined;
}

export interface LeafletMouseEvent extends LeafletEvent {
  latlng: LatLng;
  layerPoint: Point;
  containerPoint: Point;
  originalEvent: MouseEvent;
}

export interface LeafletKeyboardEvent extends LeafletEvent {
  originalEvent: KeyboardEvent;
}

export interface LocationEvent extends LeafletEvent {
  latlng: LatLng;
  bounds: LatLngBounds;
  accuracy: number;
  altitude: number;
  altitudeAccuracy: number;
  heading: number;
  speed: number;
  timestamp: number;
}

export interface ErrorEvent extends LeafletEvent {
  message: string;
  code: number;
}

export interface LayerEvent extends LeafletEvent {
  layer: Layer;
}

export interface LayersControlEvent extends LayerEvent {
  name: string;
}

export interface TileEvent extends LeafletEvent {
  tile: HTMLImageElement;
  coords: Coords;
}

export interface TileErrorEvent extends TileEvent {
  error: Error;
}

export interface ResizeEvent extends LeafletEvent {
  oldSize: Point;
  newSize: Point;
}

export interface GeoJSONEvent extends LeafletEvent {
  layer: Layer;
  properties: any;
  geometryType: string;
  id: string;
}

export interface PopupEvent extends LeafletEvent {
  popup: Popup;
}

export interface TooltipEvent extends LeafletEvent {
  tooltip: Tooltip;
}

export interface DragEndEvent extends LeafletEvent {
  distance: number;
}

export interface ZoomAnimEvent extends LeafletEvent {
  center: LatLng;
  zoom: number;
  noUpdate: boolean;
}

export interface DefaultMapPanes {
  mapPane: HTMLElement;
  tilePane: HTMLElement;
  overlayPane: HTMLElement;
  shadowPane: HTMLElement;
  markerPane: HTMLElement;
  tooltipPane: HTMLElement;
  popupPane: HTMLElement;
}

export interface BaseIconOptions extends LayerOptions {
  iconUrl?: string | undefined;
  iconRetinaUrl?: string | undefined;
  iconSize?: PointExpression | undefined;
  iconAnchor?: PointExpression | undefined;
  popupAnchor?: PointExpression | undefined;
  tooltipAnchor?: PointExpression | undefined;
  shadowUrl?: string | undefined;
  shadowRetinaUrl?: string | undefined;
  shadowSize?: PointExpression | undefined;
  shadowAnchor?: PointExpression | undefined;
  className?: string | undefined;
}

export interface IconOptions extends BaseIconOptions {
  iconUrl: string;
}

export class Icon<T extends BaseIconOptions = IconOptions> extends Layer {
  constructor(options: T);
  createIcon(oldIcon?: HTMLElement): HTMLElement;
  createShadow(oldIcon?: HTMLElement): HTMLElement;

  options: T;
}

export namespace Icon {
  interface DefaultIconOptions extends BaseIconOptions {
    imagePath?: string | undefined;
  }

  class Default extends Icon<DefaultIconOptions> {
    static imagePath?: string | undefined;
    constructor(options?: DefaultIconOptions);
  }
}

export function icon(options: IconOptions): Icon;

export interface DivIconOptions extends BaseIconOptions {
  html?: string | HTMLElement | false | undefined;
  bgPos?: PointExpression | undefined;
  iconSize?: PointExpression | undefined;
  iconAnchor?: PointExpression | undefined;
  popupAnchor?: PointExpression | undefined;
  className?: string | undefined;
}

export class DivIcon extends Icon<DivIconOptions> {
  constructor(options?: DivIconOptions);
}

export function divIcon(options?: DivIconOptions): DivIcon;

export interface MarkerOptions extends InteractiveLayerOptions {
  icon?: Icon | DivIcon | undefined;
  /** Whether the marker is draggable with mouse/touch or not. */
  draggable?: boolean | undefined;
  /** Whether the marker can be tabbed to with a keyboard and clicked by pressing enter. */
  keyboard?: boolean | undefined;
  /** Text for the browser tooltip that appear on marker hover (no tooltip by default). */
  title?: string | undefined;
  /** Text for the `alt` attribute of the icon image (useful for accessibility). */
  alt?: string | undefined;
  /** Option for putting the marker on top of all others (or below). */
  zIndexOffset?: number | undefined;
  /** The opacity of the marker. */
  opacity?: number | undefined;
  /** If `true`, the marker will get on top of others when you hover the mouse over it. */
  riseOnHover?: boolean | undefined;
  /** The z-index offset used for the `riseOnHover` feature. */
  riseOffset?: number | undefined;
  /** `Map pane` where the markers shadow will be added. */
  shadowPane?: string | undefined;
  /** Whether to pan the map when dragging this marker near its edge or not. */
  autoPan?: boolean | undefined;
  /** Distance (in pixels to the left/right and to the top/bottom) of the map edge to start panning the map. */
  autoPanPadding?: PointExpression | undefined;
  /** Number of pixels the map should pan by. */
  autoPanSpeed?: number | undefined;
}

export class Marker<P = any> extends Layer {
  constructor(latlng: LatLngExpression, options?: MarkerOptions);
  toGeoJSON(precision?: number): geojson.Feature<geojson.Point, P>;
  getLatLng(): LatLng;
  setLatLng(latlng: LatLngExpression): this;
  setZIndexOffset(offset: number): this;
  getIcon(): Icon | DivIcon;
  setIcon(icon: Icon | DivIcon): this;
  setOpacity(opacity: number): this;
  getElement(): HTMLElement | undefined;

  // Properties
  options: MarkerOptions;
  dragging?: Handler | undefined;
  feature?: geojson.Feature<geojson.Point, P> | undefined;

  protected _shadow: HTMLElement | undefined;
}

export function marker(
  latlng: LatLngExpression,
  options?: MarkerOptions
): Marker;


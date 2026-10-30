// Public types that JSDoc can't express. Options and event maps are interfaces rather than JSDoc typedefs (type
// aliases), since only interfaces merge with a plugin's `declare module 'leaflet'` augmentation.

import type {Feature, Geometry, Point as GeoJSONPoint, Position} from 'geojson';
import type {Evented} from './core/Events.js';
import type {DraggableDefaults, DraggableEvents} from './dom/Draggable.js';
import type {LatLng} from './geo/LatLng.js';
import type {LatLngBounds} from './geo/LatLngBounds.js';
import type {Bounds} from './geometry/Bounds.js';
import type {Point} from './geometry/Point.js';
import type {BlanketOverlayDefaults} from './layer/BlanketOverlay.js';
import type {DivOverlayDefaults, DivOverlayEvents} from './layer/DivOverlay.js';
import type {ImageOverlayDefaults, ImageOverlayEvents} from './layer/ImageOverlay.js';
import type {Layer} from './layer/Layer.js';
import type {FeatureGroupEvents} from './layer/FeatureGroup.js';
import type {DefaultIconDefaults} from './layer/marker/DefaultIcon.js';
import type {DivIconDefaults} from './layer/marker/DivIcon.js';
import type {IconDefaults} from './layer/marker/Icon.js';
import type {MarkerDefaults, MarkerDragEvents, MarkerEvents} from './layer/marker/Marker.js';
import type {LayerDefaults, LayerEvents, LayerPopupEvents, LayerTooltipEvents} from './layer/LayerBase.js';
import type {Popup, PopupDefaults} from './layer/Popup.js';
import type {VideoOverlayDefaults, VideoOverlayEvents} from './layer/VideoOverlay.js';
import type {GridLayerDefaults, GridLayerEvents, GridLevel, GridTile} from './layer/tile/GridLayer.js';
import type {TileLayerDefaults, TileLayerEvents} from './layer/tile/TileLayer.js';
import type {WMSParamsDefaults, WMSTileLayerDefaults} from './layer/tile/WMSTileLayer.js';
import type {Tooltip, TooltipDefaults} from './layer/Tooltip.js';
import type {CanvasDefaults, DrawOrder} from './layer/vector/Canvas.js';
import type {CircleMarker, CircleMarkerDefaults, CircleMarkerEvents} from './layer/vector/CircleMarker.js';
import type {Path, PathDefaults} from './layer/vector/Path.js';
import type {Polyline, PolylineDefaults} from './layer/vector/Polyline.js';
import type {Renderer, RendererEvents} from './layer/vector/Renderer.js';
import type {AttributionControl} from './control/AttributionControl.js';
import type {BoxZoomHandler} from './map/handler/BoxZoomHandler.js';
import type {DoubleClickZoomHandler} from './map/handler/DoubleClickZoomHandler.js';
import type {DragHandler} from './map/handler/DragHandler.js';
import type {KeyboardHandler} from './map/handler/KeyboardHandler.js';
import type {PinchZoomHandler} from './map/handler/PinchZoomHandler.js';
import type {ScrollWheelZoomHandler} from './map/handler/ScrollWheelZoomHandler.js';
import type {TapHoldHandler} from './map/handler/TapHoldHandler.js';
import type {LeafletMap, MapDefaults, MapInteractionEvents, MapLayerEvents, MapLocationEvents, MapOtherEvents,
	MapPopupEvents, MapStateEvents, MapTooltipEvents} from './map/Map.js';

export type {Listener, ListenerMap} from './core/Events.js';

/** The type of a class's `static defaultOptions`: some of its options, plus anything a subclass adds. */
export type Defaults<O> = Partial<O> & {[key: string]: unknown};

export interface DraggableOptions extends DraggableDefaults {}
export interface DraggableEventMap extends DraggableEvents {}

export interface LayerOptions extends LayerDefaults {}
export interface LayerEventMap extends LayerEvents, LayerPopupEvents, LayerTooltipEvents {}

/**
 * Some `Layer`s can be made interactive - when the user interacts with such a layer, pointer events like `click`
 * and `pointerover` can be handled. Use the [event handling methods](#evented-method) to handle these events.
 */
export interface InteractiveLayerOptions extends LayerOptions {
	/**
	 * If `false`, the layer will not emit pointer events and will act as a part of the underlying map.
	 * @default true
	 */
	interactive: boolean;
	/**
	 * When `true`, a pointer event on this layer will trigger the same event on the map (unless
	 * [`DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
	 * @default true
	 */
	bubblingPointerEvents: boolean;
}

/** @category Pointer events */
export interface InteractiveLayerEventMap extends LayerEventMap {
	/** Fired when the user clicks (or taps) the layer. */
	click: LeafletPointerEvent;
	/** Fired when the user double-clicks (or double-taps) the layer. */
	dblclick: LeafletPointerEvent;
	/** Fired when the user pushes the pointer on the layer. */
	pointerdown: LeafletPointerEvent;
	/** Fired when the user releases the pointer pushed on the layer. */
	pointerup: LeafletPointerEvent;
	/** Fired when the pointer enters the layer. */
	pointerover: LeafletPointerEvent;
	/** Fired when the pointer leaves the layer. */
	pointerout: LeafletPointerEvent;
	/**
	 * Fired when the user right-clicks on the layer, prevents default browser context menu from showing if there
	 * are listeners on this event. Also fired on mobile when the user holds a single touch for a second (also
	 * called long press).
	 */
	contextmenu: LeafletPointerEvent;
}

export interface DivOverlayOptions extends InteractiveLayerOptions, DivOverlayDefaults {}
export interface DivOverlayEventMap extends InteractiveLayerEventMap, DivOverlayEvents {}

export interface PopupOptions extends DivOverlayOptions, PopupDefaults {
	/**
	 * Set it if you want to override the default behavior of the popup closing when user clicks on the map.
	 * Defaults to the map's [`closePopupOnClick`](#map-closepopuponclick) option.
	 * @default *
	 */
	closeOnClick?: boolean;
}

export interface TooltipOptions extends DivOverlayOptions, TooltipDefaults {}

// Subclass defaults that override inherited options are checked with `@satisfies` and left out here, so that the
// option keeps the parent's type rather than the narrower one of its default value.
export interface IconOptions extends IconDefaults {}
export interface DivIconOptions extends IconOptions, Omit<DivIconDefaults, keyof IconOptions> {}
export interface DefaultIconOptions extends IconOptions, Omit<DefaultIconDefaults, keyof IconOptions> {}

export interface MarkerOptions extends InteractiveLayerOptions, MarkerDefaults {}
export interface MarkerEventMap extends InteractiveLayerEventMap, MarkerEvents, MarkerDragEvents {}

export interface FeatureGroupEventMap extends InteractiveLayerEventMap, FeatureGroupEvents {}

export interface BlanketOverlayOptions extends LayerOptions, BlanketOverlayDefaults {}

export interface ImageOverlayOptions extends InteractiveLayerOptions, ImageOverlayDefaults {}
export interface ImageOverlayEventMap extends InteractiveLayerEventMap, ImageOverlayEvents {}

export interface VideoOverlayOptions extends ImageOverlayOptions, VideoOverlayDefaults {}
export interface VideoOverlayEventMap extends ImageOverlayEventMap, VideoOverlayEvents {}

export interface RendererOptions extends BlanketOverlayOptions {}
export interface RendererEventMap extends LayerEventMap, RendererEvents {}
export interface CanvasOptions extends RendererOptions, CanvasDefaults {}

export interface PathOptions extends InteractiveLayerOptions, PathDefaults {
	/**
	 * Custom class name set on an element. Only for SVG renderer. Applied when the element is created;
	 * [`setStyle`](#path-setstyle) does not update it afterwards.
	 */
	className?: string;
	_dashArray?: number[] | null; // parsed from `dashArray` by `Canvas`
}

export interface PolylineOptions extends PathOptions, PolylineDefaults {}

export interface CircleMarkerOptions extends PathOptions, Omit<CircleMarkerDefaults, keyof PathOptions> {}
export interface CircleMarkerEventMap extends InteractiveLayerEventMap, CircleMarkerEvents {}

export interface CircleOptions extends CircleMarkerOptions {
	/** Radius of the circle, in meters. */
	radius: number;
}

/** A function returning the `Path` options for a GeoJSON feature. */
export type StyleFunction = (feature: Feature<Geometry, any>) => Partial<PathOptions>;

// The callbacks use method syntax, so a callback typed with the user's own feature properties is accepted.
export interface GeoJSONOptions extends InteractiveLayerOptions {
	/**
	 * A function defining how GeoJSON points spawn Leaflet layers. It is internally called when data is added,
	 * passing the GeoJSON point feature and its `LatLng`. The default is to spawn a default `Marker`:
	 * ```js
	 * function(geoJsonPoint, latlng) {
	 * 	return new Marker(latlng);
	 * }
	 * ```
	 */
	pointToLayer?(geoJsonPoint: Feature<GeoJSONPoint, any>, latlng: LatLng): Layer;
	/**
	 * `Path` options, or a function returning them for a feature, for styling GeoJSON lines and polygons. Called
	 * internally when data is added. The default value is to not override any defaults:
	 * ```js
	 * function (geoJsonFeature) {
	 * 	return {}
	 * }
	 * ```
	 */
	style?: Partial<PathOptions> | StyleFunction;
	/**
	 * A function that will be called once for each created `Feature`, after it has been created and styled.
	 * Useful for attaching events and popups to features. It will receive the `feature` as the first argument and
	 * its corresponding spawned `layer` from [`asFeature`](#geojson-asFeature) as the second. The default is to do
	 * nothing with the newly created layers:
	 * ```js
	 * function (feature, layer) {}
	 * ```
	 */
	onEachFeature?(feature: Feature<Geometry, any>, layer: Layer): void;
	/**
	 * A function that will be used to decide whether to include a feature or not. The default is to include all
	 * features:
	 * ```js
	 * function (geoJsonFeature) {
	 * 	return true;
	 * }
	 * ```
	 * Note: dynamically changing the `filter` option will have effect only on newly added data. It will _not_
	 * re-evaluate already included features.
	 */
	filter?(geoJsonFeature: Feature<Geometry, any>): boolean;
	/**
	 * A function that will be used for converting GeoJSON coordinates to `LatLng`s. The default is the
	 * `coordsToLatLng` static method.
	 */
	coordsToLatLng?(coords: Position): LatLng;
	/**
	 * Whether default Markers for "Point" type Features inherit from group options.
	 * @default false
	 */
	markersInheritOptions?: boolean;
}

/** A `Point` with the tile's zoom level as `z`, as `createTile` and `getTileUrl` get it. */
export interface Coords extends Point {
	z: number;
}

/** The callback `createTile` gets: call it once the tile is ready, with an error if it failed to load. */
export type DoneCallback = (error?: unknown, tile?: HTMLElement) => void;

export interface GridLayerOptions extends LayerOptions, GridLayerDefaults {}
export interface GridLayerEventMap extends LayerEventMap, GridLayerEvents {}

export interface TileLayerOptions extends GridLayerOptions, Omit<TileLayerDefaults, keyof GridLayerOptions> {
	/**
	 * The maximum zoom level up to which this layer will be displayed (inclusive).
	 * @default 18
	 */
	maxZoom: number;
	[key: string]: unknown; // custom keys of the URL template
}
export interface TileLayerEventMap extends GridLayerEventMap, TileLayerEvents {}

/** The WMS request parameters, with any options that `WMSTileLayer` doesn't know. */
export interface WMSParams extends WMSParamsDefaults {
	[key: string]: unknown;
}
export interface WMSTileLayerOptions extends TileLayerOptions, WMSTileLayerDefaults, Partial<WMSParamsDefaults> {}

export interface MapOptions extends MapDefaults {
	/** @deprecated Use `pinchZoom`. */
	touchZoom?: boolean | 'center';
}
export interface MapEventMap extends MapLayerEvents, MapPopupEvents, MapTooltipEvents, MapStateEvents,
	MapLocationEvents, MapInteractionEvents, MapOtherEvents {}

/** Options for the `Map` methods that change the zoom level. */
export interface ZoomOptions {
	/**
	 * If not specified, zoom animation will happen if the zoom origin is inside the current view, and if the user
	 * prefers reduced motion, only when zooming by at most one level. If `true`, the map will attempt animating
	 * zoom disregarding where zoom origin is and the user's reduced motion preference. Setting `false` will make it
	 * always reset the view completely without animation.
	 */
	animate?: boolean;
}

/** Options for the `Map` methods that change the center of the map. */
export interface PanOptions {
	/**
	 * If `true`, panning will always be animated if possible, even if the user prefers reduced motion. If `false`,
	 * it will not animate panning, either resetting the map view if panning more than a screen away, or just
	 * setting a new offset for the map pane (except for `panBy` which always does the latter). If not specified,
	 * panning is animated, except for pans longer than half the map size when the user prefers reduced motion.
	 */
	animate?: boolean;
	/**
	 * Duration of animated panning, in seconds.
	 * @default 0.25
	 */
	duration?: number;
	/**
	 * The curvature factor of panning animation easing (third parameter of the [Cubic Bezier curve](https://cubic-bezier.com/)).
	 * 1.0 means linear animation, and the smaller this number, the more bowed the curve.
	 * @default 0.25
	 */
	easeLinearity?: number;
	/**
	 * If `true`, panning won't fire `movestart` event on start (used internally for panning inertia).
	 * @default false
	 */
	noMoveStart?: boolean;
}

/** Options for the `Map` methods that change both the center and the zoom level. */
export interface ZoomPanOptions extends ZoomOptions, PanOptions {
	/** If `true`, the view is reset without animation. */
	reset?: boolean;
	/** Options for the zoom part of the change, taking precedence over `animate`. */
	zoom?: ZoomOptions;
	/** Options for the pan part of the change, taking precedence over `animate` and `duration`. */
	pan?: PanOptions;
}

export interface InvalidateSizeOptions extends ZoomOptions, PanOptions {
	/**
	 * If `false`, panning will not occur.
	 * @default true
	 */
	pan?: boolean;
	/**
	 * If `true`, it will delay `moveend` event so that it doesn't happen often even if the method is called many
	 * times in a row.
	 * @default false
	 */
	debounceMoveend?: boolean;
}

export interface PaddingOptions {
	/**
	 * Sets the amount of padding in the top left corner of a map container that shouldn't be accounted for when
	 * setting the view to fit bounds. Useful if you have some control overlays on the map like a sidebar and you
	 * don't want them to obscure objects you're zooming to.
	 * @default [0, 0]
	 */
	paddingTopLeft?: PointExpression;
	/**
	 * The same for the bottom right corner of the map.
	 * @default [0, 0]
	 */
	paddingBottomRight?: PointExpression;
	/**
	 * Equivalent of setting both top left and bottom right padding to the same value.
	 * @default [0, 0]
	 */
	padding?: PointExpression;
}

export interface PanInsideOptions extends PanOptions, PaddingOptions {}

export interface FitBoundsOptions extends ZoomPanOptions, PaddingOptions {
	/** The maximum possible zoom to use. */
	maxZoom?: number;
}

/** Options for `Map`'s geolocation methods. */
export interface LocateOptions {
	/**
	 * If `true`, starts continuous watching of location changes (instead of detecting it once) using W3C
	 * `watchPosition` method. You can later stop watching using `map.stopLocate()` method.
	 * @default false
	 */
	watch?: boolean;
	/**
	 * If `true`, automatically sets the map view to the user location with respect to detection accuracy, or to
	 * world view if geolocation failed.
	 * @default false
	 */
	setView?: boolean;
	/**
	 * The maximum zoom for automatic view setting when using `setView` option.
	 * @default Infinity
	 */
	maxZoom?: number;
	/**
	 * Number of milliseconds to wait for a response from geolocation before firing a `locationerror` event.
	 * @default 10000
	 */
	timeout?: number;
	/**
	 * Maximum age of detected location. If less than this amount of milliseconds passed since last geolocation
	 * response, `locate` will return a cached location.
	 * @default 0
	 */
	maximumAge?: number;
	/**
	 * Enables high accuracy, see [description in the W3C spec](https://w3c.github.io/geolocation-api/#enablehighaccuracy-member).
	 * @default false
	 */
	enableHighAccuracy?: boolean;
}

/** A `Point`, or its array (`[x, y]`) or object (`{x, y}`) form. */
export type PointExpression = Point | [number, number] | {x: number, y: number};

/** A `Bounds`, or an array of the points it should contain (usually two opposite corners). */
export type BoundsExpression = Bounds | PointExpression[];

/** A `LatLng`, or its array (`[lat, lng]`, `[lat, lng, alt]`) or object (`{lat, lng}`, `{lat, lon}`) form. */
export type LatLngExpression = LatLng | [number, number, number?] |
	{lat: number, lng: number, alt?: number} | {lat: number, lon: number, alt?: number};

/** A `LatLngBounds`, or an array of the points it should contain (usually two opposite corners). */
export type LatLngBoundsExpression = LatLngBounds | LatLngExpression[];

/**
 * An object with methods for projecting geographical coordinates of the world onto a flat surface (and back). See
 * [Map projection](https://en.wikipedia.org/wiki/Map_projection).
 *
 * Note that the projection instances do not inherit from Leaflet's `Class` object, and can't be instantiated. Also,
 * new classes can't inherit from them, and methods can't be added to them with the `include` function.
 */
export interface Projection {
	/** The bounds (specified in CRS units) where the projection is valid. */
	bounds: Bounds;
	/** Projects geographical coordinates into a 2D point. Only accepts actual `LatLng` instances, not arrays. */
	project(latlng: LatLng): Point;
	/**
	 * The inverse of `project`. Projects a 2D point into a geographical location. Only accepts actual `Point`
	 * instances, not arrays.
	 */
	unproject(point: Point): LatLng;
}

/** A listener for an event without a known event object type. */
export type LeafletEventHandlerFn = (event: LeafletEvent & {[key: string]: any}) => void;

/**
 * Whenever a class inheriting from `Evented` fires an event, a listener function will be called with an event
 * argument, which is a plain object containing information about the event. For example:
 *
 * ```js
 * map.on('click', function(ev) {
 *     alert(ev.latlng); // ev is an event object (PointerEvent in this case)
 * });
 * ```
 *
 * The information available depends on the event type. This is the base event object: all other event objects
 * contain these properties too.
 */
export interface LeafletEvent {
	/** The event type (e.g. `'click'`). */
	type: string;
	/**
	 * The object that fired the event. For propagated events, the last object in the propagation chain that fired
	 * the event.
	 */
	target: Evented<any, any>;
	/** The object that originally fired the event. For non-propagated events, this will be the same as the `target`. */
	sourceTarget: Evented<any, any>;
	/** For propagated events, the last object that propagated the event to its event parent. */
	propagatedFrom?: Evented<any, any>;
}

export interface LeafletKeyboardEvent extends LeafletEvent {
	/**
	 * The original [DOM `KeyboardEvent`](https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent) that
	 * triggered this Leaflet event.
	 */
	originalEvent: KeyboardEvent;
}

export interface LeafletPointerEvent extends LeafletEvent {
	/** The geographical point where the pointer event occurred. */
	latlng: LatLng;
	/** Pixel coordinates of the point where the pointer event occurred relative to the map layer. */
	layerPoint: Point;
	/** Pixel coordinates of the point where the pointer event occurred relative to the map container. */
	containerPoint: Point;
	/**
	 * The original [DOM `MouseEvent`](https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent) or
	 * [DOM `PointerEvent`](https://developer.mozilla.org/en-US/docs/Web/API/PointerEvent) that triggered this
	 * Leaflet event.
	 */
	originalEvent: PointerEvent | MouseEvent;
}

export interface LocationEvent extends LeafletEvent {
	/** Detected geographical location of the user. */
	latlng: LatLng;
	/** Geographical bounds of the area user is located in (with respect to the accuracy of location). */
	bounds: LatLngBounds;
	/** Accuracy of location in meters. */
	accuracy: number;
	/** Height of the position above the WGS84 ellipsoid in meters. */
	altitude: number | null;
	/** Accuracy of altitude in meters. */
	altitudeAccuracy: number | null;
	/** The direction of travel in degrees counting clockwise from true North. */
	heading: number | null;
	/** Current velocity in meters per second. */
	speed: number | null;
	/** The time when the position was acquired. */
	timestamp: number;
}

export interface ErrorEvent extends LeafletEvent {
	/** Error message. */
	message: string;
	/** Error code (if applicable). */
	code: number;
}

export interface LayerEvent extends LeafletEvent {
	/** The layer that was added or removed. */
	layer: Layer;
}

export interface LayersControlEvent extends LayerEvent {
	/** The name of the layer that was added or removed. */
	name: string;
}

export interface TileEvent extends LeafletEvent {
	/** The tile element (image). */
	tile: HTMLElement;
	/** Point object with the tile's `x`, `y`, and `z` (zoom level) coordinates. */
	coords: Coords;
}

export interface TileErrorEvent extends TileEvent {
	/** Error passed to the tile's `done()` callback. */
	error: unknown;
}

export interface ResizeEvent extends LeafletEvent {
	/** The old size before resize event. */
	oldSize: Point;
	/** The new size after the resize event. */
	newSize: Point;
}

export interface GeoJSONEvent extends LeafletEvent {
	/** The layer for the GeoJSON feature that is being added to the map. */
	layer: Layer;
	/** GeoJSON properties of the feature. */
	properties: {[name: string]: any} | null;
	/** GeoJSON geometry type of the feature. */
	geometryType: string;
	/** GeoJSON ID of the feature (if present). */
	id?: string | number;
}

export interface PopupEvent extends LeafletEvent {
	/** The popup that was opened or closed. */
	popup: Popup;
}

export interface TooltipEvent extends LeafletEvent {
	/** The tooltip that was opened or closed. */
	tooltip: Tooltip;
}

export interface DragEndEvent extends LeafletEvent {
	/** The distance in pixels the draggable element was moved by. */
	distance: number;
}

export interface MarkerMoveEvent extends LeafletEvent {
	/** The previous position of the marker. */
	oldLatLng: LatLng;
	/** The new position of the marker. */
	latlng: LatLng;
}

export interface ZoomAnimEvent extends LeafletEvent {
	/** The current center of the map. */
	center: LatLng;
	/** The current zoom level of the map. */
	zoom: number;
	/** Whether layers should update their contents due to this event. */
	noUpdate: boolean;
}

export interface WorldCopyJumpEvent extends LeafletEvent {
	/** The signed number of world widths by which the map pane moved. */
	worlds: number;
}

declare module './core/Events.js' {
	interface Evented<O extends object = object, E extends object = {}> {
		_events?: {[type: string]: Array<{fn: Function, ctx: any, once?: boolean}>};
		_eventParents?: {[id: number]: Evented<any, any>};
		_firingCount?: number;
	}
}

declare module './layer/LayerBase.js' {
	interface LayerBase {
		_map: LeafletMap;
		_mapToAdd?: LeafletMap | null;
		_zoomAnimated?: boolean;

		/**
		 * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should
		 * belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
		 * @category Extension methods
		 * @uninheritable
		 */
		onAdd(map: LeafletMap): void;
		/**
		 * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners
		 * previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
		 * @category Extension methods
		 * @uninheritable
		 */
		onRemove(map: LeafletMap): void;
		/**
		 * This optional method should return an object like `{ viewreset: this._reset }` for [`on`](#evented-on).
		 * The event handlers in this object will be automatically added and removed from the map with your layer.
		 * @category Extension methods
		 * @uninheritable
		 */
		getEvents?(): {[type: string]: (e: any) => void};
		/**
		 * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map,
		 * before events are initialized, without waiting until the map is in a usable state. Use for early
		 * initialization only.
		 * @category Extension methods
		 * @uninheritable
		 */
		beforeAdd?(map: LeafletMap): void;
	}
}

declare module './layer/Layer.js' {
	interface Layer {
		_popup?: Popup | null;
		_tooltip?: Tooltip | null;
		// implemented by subclasses, checked by bound popups and tooltips
		_latlng?: LatLng;
		_getPopupAnchor?(): PointExpression;
		_getTooltipAnchor?(): PointExpression;
		getElement?(): Element | null | undefined;
		eachLayer?(fn: (layer: Layer) => void, context?: any): unknown;
		feature?: Feature; // set by `GeoJSON` on the layers it creates
	}
}

declare module './layer/DivOverlay.js' {
	interface DivOverlay {
		// created by the subclass's `_initLayout`
		_container: HTMLElement;
		_contentNode: HTMLElement;
		_containerWidth: number;
		_containerHeight: number;
		_containerLeft: number;
		_containerBottom: number;
		_initLayout(): void;
		_updateLayout(): void;
		_adjustPan(): void;
		_animateZoom(e: ZoomAnimEvent): void;
	}
}

declare module './layer/tile/GridLayer.js' {
	interface GridLayer {
		_abortLoading?(): void; // implemented by `TileLayer`
		// hooks for subclasses
		_onUpdateLevel(z: number): void;
		_onRemoveLevel(z: number): void;
		_onCreateLevel(level: GridLevel): void;
		_onOpaqueTile(tile: GridTile): void;
	}
}

declare module './layer/vector/Renderer.js' {
	interface Renderer {
		_layers: {[id: number]: Path}; // created lazily
		// implemented by `SVG` and `Canvas`, called by paths
		_initPath(layer: Path<any, any>): void;
		_addPath(layer: Path<any, any>): void;
		_removePath(layer: Path<any, any>): void;
		_updatePath(layer: Path<any, any>): void;
		_updateStyle(layer: Path<any, any>): void;
		_bringToFront(layer: Path<any, any>): void;
		_bringToBack(layer: Path<any, any>): void;
		_updatePoly(layer: Polyline<any, any, any>, closed?: boolean): void;
		_updateCircle(layer: CircleMarker<any, any>): void;
	}
}

declare module './layer/vector/Canvas.js' {
	interface Canvas {
		_container: HTMLCanvasElement;
		_ctxScale: number;
	}
}

declare module './layer/vector/Path.js' {
	interface Path {
		_path: SVGElement; // created by `SVG`
		_order?: DrawOrder; // created by `Canvas`
		_pxBounds?: Bounds;
		// implemented by subclasses
		_project(): void;
		_update(): void;
		_updatePath(): void;
		_updateBounds(): void;
		_containsPoint(p: Point): boolean;
	}
}

declare module './layer/vector/CircleMarker.js' {
	interface CircleMarker {
		_pxRadiusY?: number; // set by `Circle`
	}
}

declare module './map/Map.js' {
	interface LeafletMap {
		_popup?: Popup; // the last popup opened with `openOn`, set by `Popup`
		_renderer?: Renderer; // the default renderer, created lazily by `getRenderer`

		/**
		 * The attribution control (only available if the [`attributionControl` option](#map-attributioncontrol)
		 * was `true` when creating the map).
		 * @category Controls
		 */
		attributionControl?: AttributionControl;

		// created by `addHandler` in the constructor
		/**
		 * Box (shift-drag with pointer) zoom handler.
		 * @category Handlers
		 */
		boxZoom: BoxZoomHandler;
		/**
		 * Double click zoom handler.
		 * @category Handlers
		 */
		doubleClickZoom: DoubleClickZoomHandler;
		/**
		 * Map dragging handler.
		 * @category Handlers
		 */
		dragging: DragHandler;
		/**
		 * Keyboard navigation handler.
		 * @category Handlers
		 */
		keyboard: KeyboardHandler;
		/**
		 * Scroll wheel zoom handler.
		 * @category Handlers
		 */
		scrollWheelZoom: ScrollWheelZoomHandler;
		/**
		 * Long tap handler to simulate `contextmenu` event (useful in mobile Safari).
		 * @category Handlers
		 */
		tapHold: TapHoldHandler;
		/**
		 * Pinch zoom handler.
		 * @category Handlers
		 */
		pinchZoom: PinchZoomHandler;
	}
}

declare module './geometry/Point.js' {
	interface Point {
		_code: number; // clipping bit code, set by `PolyUtil.clipPolygon`
	}
}

declare module './geo/crs/CRS.js' {
	namespace CRS {
		/** Standard code name of the CRS passed into WMS services (e.g. `'EPSG:3857'`). */
		let code: string | undefined;
		/**
		 * An array of two numbers defining whether the longitude (horizontal) coordinate axis wraps around a given
		 * range and how. Defaults to `[-180, 180]` in most geographical CRSs. If `undefined`, the longitude axis does
		 * not wrap around.
		 */
		let wrapLng: [number, number] | undefined;
		/** Like `wrapLng`, but for the latitude (vertical) axis. */
		let wrapLat: [number, number] | undefined;
		/** Returns the distance between two geographical coordinates. */
		function distance(latlng1: LatLng, latlng2: LatLng): number;
	}
}

declare module './core/Handler.js' {
	interface Handler {
		/**
		 * Called when the handler is enabled, should add event hooks.
		 * @category Extension methods
		 */
		addHooks(): void;
		/**
		 * Called when the handler is disabled, should remove the event hooks added previously.
		 * @category Extension methods
		 */
		removeHooks(): void;
	}
}

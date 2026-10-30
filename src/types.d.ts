// Public types that JSDoc can't express. Options, event maps and event objects are interfaces rather than JSDoc
// typedefs (type aliases), since only interfaces merge with a plugin's `declare module 'leaflet'` augmentation;
// their members are documented in typedefs next to the code they belong to, and the interfaces here only extend them.

import type {Feature, Geometry, Point as GeoJSONPoint, Position} from 'geojson';
import type {Evented, LeafletEventProps} from './core/Events.js';
import type {DragEndEventProps, DraggableDefaults, DraggableEvents} from './dom/Draggable.js';
import type {LatLng} from './geo/LatLng.js';
import type {LatLngBounds} from './geo/LatLngBounds.js';
import type {Bounds} from './geometry/Bounds.js';
import type {Point, PointExpression} from './geometry/Point.js';
import type {BlanketOverlayDefaults} from './layer/BlanketOverlay.js';
import type {DivOverlayDefaults, DivOverlayEvents} from './layer/DivOverlay.js';
import type {ImageOverlayDefaults, ImageOverlayEvents} from './layer/ImageOverlay.js';
import type {InteractiveLayerEvents, InteractiveLayerProps, Layer} from './layer/Layer.js';
import type {FeatureGroupEvents} from './layer/FeatureGroup.js';
import type {GeoJSONEventProps, StyleFunction} from './layer/GeoJSON.js';
import type {DefaultIconDefaults} from './layer/marker/DefaultIcon.js';
import type {DivIconDefaults} from './layer/marker/DivIcon.js';
import type {IconDefaults} from './layer/marker/Icon.js';
import type {MarkerDefaults, MarkerDragEvents, MarkerEvents, MarkerMoveEventProps} from './layer/marker/Marker.js';
import type {LayerDefaults, LayerEvents, LayerPopupEvents, LayerTooltipEvents} from './layer/LayerBase.js';
import type {Popup, PopupDefaults, PopupEventProps, PopupProps} from './layer/Popup.js';
import type {VideoOverlayDefaults, VideoOverlayEvents} from './layer/VideoOverlay.js';
import type {GridLayerDefaults, GridLayerEvents, GridLevel, GridTile, TileErrorEventProps, TileEventProps}
	from './layer/tile/GridLayer.js';
import type {TileLayerDefaults, TileLayerEvents} from './layer/tile/TileLayer.js';
import type {WMSParamsDefaults, WMSTileLayerDefaults} from './layer/tile/WMSTileLayer.js';
import type {Tooltip, TooltipDefaults, TooltipEventProps} from './layer/Tooltip.js';
import type {CanvasDefaults, DrawOrder} from './layer/vector/Canvas.js';
import type {CircleMarker, CircleMarkerDefaults, CircleMarkerEvents} from './layer/vector/CircleMarker.js';
import type {Path, PathDefaults} from './layer/vector/Path.js';
import type {Polyline, PolylineDefaults} from './layer/vector/Polyline.js';
import type {Renderer, RendererEvents} from './layer/vector/Renderer.js';
import type {AttributionControl, AttributionControlDefaults} from './control/AttributionControl.js';
import type {ControlDefaults} from './control/Control.js';
import type {LayersControlDefaults, LayersControlEventProps} from './control/LayersControl.js';
import type {ScaleControlDefaults} from './control/ScaleControl.js';
import type {ZoomControlDefaults} from './control/ZoomControl.js';
import type {BoxZoomEventProps, BoxZoomHandler} from './map/handler/BoxZoomHandler.js';
import type {DoubleClickZoomHandler} from './map/handler/DoubleClickZoomHandler.js';
import type {DragHandler} from './map/handler/DragHandler.js';
import type {KeyboardHandler} from './map/handler/KeyboardHandler.js';
import type {PinchZoomHandler} from './map/handler/PinchZoomHandler.js';
import type {ScrollWheelZoomHandler} from './map/handler/ScrollWheelZoomHandler.js';
import type {TapHoldHandler} from './map/handler/TapHoldHandler.js';
import type {ErrorEventProps, FitBoundsProps, InvalidateSizeProps, LayerEventProps, LeafletKeyboardEventProps,
	LeafletMap, LeafletPointerEventProps, LocateProps, LocationEventProps, MapDefaults, MapHandlerEvents,
	MapInteractionEvents, MapLayerEvents, MapLocationEvents, MapOtherEvents, MapPopupEvents, MapStateEvents,
	MapTooltipEvents, PaddingProps, PanProps, ResizeEventProps, WorldCopyJumpEventProps, ZoomAnimEventProps, ZoomPanProps,
	ZoomProps} from './map/Map.js';

export type {Defaults} from './core/Class.js';
export type {LeafletEventHandlerFn, Listener, ListenerMap} from './core/Events.js';
export type {PointExpression} from './geometry/Point.js';
export type {BoundsExpression} from './geometry/Bounds.js';
export type {LatLngExpression} from './geo/LatLng.js';
export type {LatLngBoundsExpression} from './geo/LatLngBounds.js';
export type {Projection} from './geo/crs/CRS.js';
export type {Coords, DoneCallback} from './layer/tile/GridLayer.js';
export type {StyleFunction} from './layer/GeoJSON.js';
export type {ControlPosition} from './control/Control.js';

export interface DraggableOptions extends DraggableDefaults {}
export interface DraggableEventMap extends DraggableEvents {}

export interface LayerOptions extends LayerDefaults {}
export interface LayerEventMap extends LayerEvents, LayerPopupEvents, LayerTooltipEvents {}

/**
 * Some `Layer`s can be made interactive - when the user interacts with such a layer, pointer events like `click`
 * and `pointerover` can be handled. Use the [event handling methods](#evented-method) to handle these events.
 */
export interface InteractiveLayerOptions extends LayerOptions, InteractiveLayerProps {}

export interface InteractiveLayerEventMap extends LayerEventMap, InteractiveLayerEvents {}

export interface DivOverlayOptions extends InteractiveLayerOptions, DivOverlayDefaults {}
export interface DivOverlayEventMap extends InteractiveLayerEventMap, DivOverlayEvents {}

export interface PopupOptions extends DivOverlayOptions, PopupDefaults, PopupProps {}

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
}

export interface PolylineOptions extends PathOptions, PolylineDefaults {}

export interface CircleMarkerOptions extends PathOptions, Omit<CircleMarkerDefaults, keyof PathOptions> {}
export interface CircleMarkerEventMap extends InteractiveLayerEventMap, CircleMarkerEvents {}

export interface CircleOptions extends CircleMarkerOptions {
	/** Radius of the circle, in meters. */
	radius: number;
}

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
	MapLocationEvents, MapInteractionEvents, MapHandlerEvents, MapOtherEvents {}

/** Options for the `Map` methods that change the zoom level. */
export interface ZoomOptions extends ZoomProps {}
/** Options for the `Map` methods that change the center of the map. */
export interface PanOptions extends PanProps {}
/** Options for the `Map` methods that change both the center and the zoom level. */
export interface ZoomPanOptions extends ZoomOptions, PanOptions, ZoomPanProps {}
export interface InvalidateSizeOptions extends ZoomOptions, PanOptions, InvalidateSizeProps {}
export interface PaddingOptions extends PaddingProps {}
export interface PanInsideOptions extends PanOptions, PaddingOptions {}
export interface FitBoundsOptions extends ZoomPanOptions, PaddingOptions, FitBoundsProps {}
/** Options for `Map`'s geolocation methods. */
export interface LocateOptions extends LocateProps {}

export interface ControlOptions extends ControlDefaults {}
export interface ZoomControlOptions extends ControlOptions, Omit<ZoomControlDefaults, keyof ControlOptions> {}
export interface AttributionControlOptions extends ControlOptions,
	Omit<AttributionControlDefaults, keyof ControlOptions> {}
export interface ScaleControlOptions extends ControlOptions, Omit<ScaleControlDefaults, keyof ControlOptions> {}
export interface LayersControlOptions extends ControlOptions, Omit<LayersControlDefaults, keyof ControlOptions> {}

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
export interface LeafletEvent extends LeafletEventProps {}
export interface LeafletKeyboardEvent extends LeafletEvent, LeafletKeyboardEventProps {}
export interface LeafletPointerEvent extends LeafletEvent, LeafletPointerEventProps {}
export interface LocationEvent extends LeafletEvent, LocationEventProps {}
export interface ErrorEvent extends LeafletEvent, ErrorEventProps {}
export interface LayerEvent extends LeafletEvent, LayerEventProps {}
export interface LayersControlEvent extends LayerEvent, LayersControlEventProps {}
export interface TileEvent extends LeafletEvent, TileEventProps {}
export interface TileErrorEvent extends TileEvent, TileErrorEventProps {}
export interface ResizeEvent extends LeafletEvent, ResizeEventProps {}
export interface GeoJSONEvent extends LeafletEvent, GeoJSONEventProps {}
export interface PopupEvent extends LeafletEvent, PopupEventProps {}
export interface TooltipEvent extends LeafletEvent, TooltipEventProps {}
export interface DragEndEvent extends LeafletEvent, DragEndEventProps {}
export interface BoxZoomEvent extends LeafletEvent, BoxZoomEventProps {}
export interface MarkerMoveEvent extends LeafletEvent, MarkerMoveEventProps {}
export interface ZoomAnimEvent extends LeafletEvent, ZoomAnimEventProps {}
export interface WorldCopyJumpEvent extends LeafletEvent, WorldCopyJumpEventProps {}

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
		_dashArray?: number[] | null; // `dashArray` parsed by `Canvas`
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

declare module './dom/Draggable.js' {
	interface Draggable {
		_absPos?: Point; // the unwrapped position, set by the map drag handler with `worldCopyJump`
	}
}

declare module './control/Control.js' {
	interface Control<O extends ControlOptions = ControlOptions> {
		_map: LeafletMap;
		_container: HTMLElement;

		/**
		 * Should return the container DOM element for the control and add listeners
		 * on relevant map events. Called on [`control.addTo(map)`](#control-addto).
		 * @category Extension methods
		 * @uninheritable
		 */
		onAdd(map: LeafletMap): HTMLElement;
		/**
		 * Optional method. Should contain all clean up code that removes the listeners previously added in
		 * [`onAdd`](#control-onadd). Called on [`control.remove()`](#control-remove).
		 * @category Extension methods
		 * @uninheritable
		 */
		onRemove?(map: LeafletMap): void;
	}
}

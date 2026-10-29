// Public types that JSDoc can't express. Options and event maps are interfaces rather than JSDoc typedefs (type
// aliases), since only interfaces merge with a plugin's `declare module 'leaflet'` augmentation.

import type {Feature} from 'geojson';
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
import type {Tooltip, TooltipDefaults} from './layer/Tooltip.js';
import type {LeafletMap} from './map/Map.js';

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
	coords: Point;
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

declare module './map/Map.js' {
	interface LeafletMap {
		_popup?: Popup; // the last popup opened with `openOn`, set by `Popup`
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

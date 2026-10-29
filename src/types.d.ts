// Public types that JSDoc can't express. Options and event maps are interfaces rather than JSDoc typedefs (type
// aliases), since only interfaces merge with a plugin's `declare module 'leaflet'` augmentation.

import type {Evented} from './core/Events.js';
import type {LatLng} from './geo/LatLng.js';
import type {LatLngBounds} from './geo/LatLngBounds.js';
import type {Bounds} from './geometry/Bounds.js';
import type {Point} from './geometry/Point.js';
import type {Layer} from './layer/Layer.js';
import type {Popup} from './layer/Popup.js';
import type {Tooltip} from './layer/Tooltip.js';

export type {Listener, ListenerMap} from './core/Events.js';

/** The type of a class's `static defaultOptions`: some of its options, plus anything a subclass adds. */
export type Defaults<O> = Partial<O> & {[key: string]: unknown};

/** A `Point`, or its array (`[x, y]`) or object (`{x, y}`) form. */
export type PointExpression = Point | [number, number] | {x: number, y: number};

/** A `Bounds`, or an array of the points it should contain (usually two opposite corners). */
export type BoundsExpression = Bounds | PointExpression[];

/** A `LatLng`, or its array (`[lat, lng]`, `[lat, lng, alt]`) or object (`{lat, lng}`, `{lat, lon}`) form. */
export type LatLngExpression = LatLng | [number, number, number?] |
	{lat: number, lng: number, alt?: number} | {lat: number, lon: number, alt?: number};

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

declare module './geometry/Point.js' {
	interface Point {
		_code: number; // clipping bit code, set by `PolyUtil.clipPolygon`
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

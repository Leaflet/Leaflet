// @ts-check
import * as Util from '../core/Util.js';
import {Evented} from '../core/Events.js';
import {EPSG3857} from '../geo/crs/EPSG3857.js';
import {Point} from '../geometry/Point.js';
import {Bounds} from '../geometry/Bounds.js';
import {LatLng} from '../geo/LatLng.js';
import {LatLngBounds} from '../geo/LatLngBounds.js';
import * as DomEvent from '../dom/DomEvent.js';
import * as DomUtil from '../dom/DomUtil.js';
import {PosAnimation} from '../dom/PosAnimation.js';
import * as PointerEvents from '../dom/DomEvent.PointerEvents.js';
import {AttributionControl} from '../control/AttributionControl.js';
import {ZoomControl} from '../control/ZoomControl.js';
import {Popup} from '../layer/Popup.js';
import {Tooltip} from '../layer/Tooltip.js';
import {BoxZoomHandler} from './handler/BoxZoomHandler.js';
import {DoubleClickZoomHandler} from './handler/DoubleClickZoomHandler.js';
import {DragHandler} from './handler/DragHandler.js';
import {KeyboardHandler} from './handler/KeyboardHandler.js';
import {ScrollWheelZoomHandler} from './handler/ScrollWheelZoomHandler.js';
import {TapHoldHandler} from './handler/TapHoldHandler.js';
import {PinchZoomHandler} from './handler/PinchZoomHandler.js';

/** @import {Defaults, ErrorEvent, FitBoundsOptions, InvalidateSizeOptions, LatLngBoundsExpression, LatLngExpression,
 *    LayerEvent, LayersControlEvent, LeafletEvent, LeafletKeyboardEvent, LeafletPointerEvent, LocateOptions,
 *    LocationEvent, MapEventMap, MapOptions, PanInsideOptions, PanOptions, PointExpression, PopupEvent, PopupOptions,
 *    ResizeEvent, TooltipEvent, TooltipOptions, WorldCopyJumpEvent, ZoomAnimEvent, ZoomOptions, ZoomPanOptions}
 *    from '../types.js' */
/** @import {CRS} from '../geo/crs/CRS.js' */
/** @import {Control} from '../control/Control.js' */
/** @import {Handler} from '../core/Handler.js' */
/** @import {Layer} from '../layer/Layer.js' */
/** @import {LayerBase} from '../layer/LayerBase.js' */
/** @import {GridLayer} from '../layer/tile/GridLayer.js' */
/** @import {Path} from '../layer/vector/Path.js' */
/** @import {Renderer} from '../layer/vector/Renderer.js' */

// matches the zoom transition in leaflet.css
const zoomAnimDuration = 250;

const defaultOptions = {
	/**
	 * The [Coordinate Reference System](#crs) to use. Don't change this if you're not sure what it means.
	 * @category Map State Options
	 * @type {typeof CRS}
	 */
	crs: EPSG3857,

	/**
	 * Initial geographic center of the map
	 * @category Map State Options
	 * @type {LatLngExpression | undefined}
	 */
	center: undefined,

	/**
	 * Initial map zoom level
	 * @category Map State Options
	 * @type {number | undefined}
	 */
	zoom: undefined,

	/**
	 * Minimum zoom level of the map. If not specified and at least one `GridLayer` or `TileLayer`
	 * is in the map, the lowest of their `minZoom` options will be used instead.
	 * @category Map State Options
	 * @type {number | undefined}
	 */
	minZoom: undefined,

	/**
	 * Maximum zoom level of the map. If not specified and at least one `GridLayer` or `TileLayer`
	 * is in the map, the highest of their `maxZoom` options will be used instead.
	 * @category Map State Options
	 * @type {number | undefined}
	 */
	maxZoom: undefined,

	/**
	 * Array of layers that will be added to the map initially
	 * @category Map State Options
	 * @type {Layer[]}
	 */
	layers: [],

	/**
	 * When this option is set, the map restricts the view to the given geographical bounds,
	 * bouncing the user back if the user tries to pan outside the view. To set the restriction
	 * dynamically, use [`setMaxBounds`](#map-setmaxbounds) method.
	 * @category Map State Options
	 * @type {LatLngBoundsExpression | null}
	 */
	maxBounds: null,

	/**
	 * The default method for drawing vector layers on the map. A new `SVG` renderer
	 * by default; pass `new Canvas()` to draw them on a canvas instead.
	 * @category Map State Options
	 * @type {Renderer | undefined}
	 */
	renderer: undefined,


	/**
	 * Whether the map zoom animation is enabled.
	 * @category Animation Options
	 */
	zoomAnimation: true,

	/**
	 * Won't animate zoom if the zoom difference exceeds this value (or 1 if the user prefers
	 * [reduced
	 * motion](https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/prefers-reduced-motion) and
	 * `animate: true` isn't passed).
	 * @category Animation Options
	 */
	zoomAnimationThreshold: 4,

	/**
	 * Whether the tile and popup fade animation is enabled.
	 * @category Animation Options
	 */
	fadeAnimation: true,

	/**
	 * Whether markers animate their zoom with the zoom animation, if
	 * disabled they will disappear for the length of the animation.
	 * @category Animation Options
	 */
	markerZoomAnimation: true,

	/**
	 * Defines the maximum size of a CSS translation transform. The default value should not be changed
	 * unless a web browser positions layers in the wrong place after doing a large `panBy`.
	 * @category Animation Options
	 */
	transform3DLimit: 8388608, // Precision limit of a 32-bit float

	/**
	 * Forces the map's zoom level to always be a multiple of this, particularly right after a
	 * [`fitBounds()`](#map-fitbounds) or a pinch-zoom. By default, the zoom level snaps to the
	 * nearest integer; lower values (e.g. `0.5` or `0.1`) allow for greater granularity. A value
	 * of `0` means the zoom level will not be snapped after `fitBounds` or a pinch-zoom.
	 * @category Interaction Options
	 */
	zoomSnap: 1,

	/**
	 * Controls how much the map's zoom level will change after a [`zoomIn()`](#map-zoomin),
	 * [`zoomOut()`](#map-zoomout), pressing `+` or `-` on the keyboard, or using the [zoom controls](#control-zoom).
	 * Values smaller than `1` (e.g. `0.5`) allow for greater granularity.
	 * @category Interaction Options
	 */
	zoomDelta: 1,

	/**
	 * Whether the map automatically handles browser window resize to update itself.
	 * @category Interaction Options
	 */
	trackResize: true,

	/**
	 * Set it to `false` if you don't want popups to close when user clicks the map.
	 * @category Interaction Options
	 */
	closePopupOnClick: true,

	/**
	 * Whether the map can be zoomed to a rectangular area specified
	 * by dragging the pointer while pressing the shift key.
	 * @category Interaction Options
	 */
	boxZoom: true,

	/**
	 * Whether the map can be zoomed in by double clicking on it and zoomed out by
	 * double clicking while holding shift. If passed `'center'`, double-click zoom
	 * will zoom to the center of the view regardless of where the pointer was.
	 * @category Interaction Options
	 * @type {boolean | 'center'}
	 */
	doubleClickZoom: true,

	/**
	 * Whether the map is draggable with pointer or not.
	 * @category Interaction Options
	 */
	dragging: true,

	/**
	 * If enabled, panning of the map will have an inertia effect where the map builds
	 * momentum while dragging and continues moving in the same direction for some
	 * time. Feels especially nice on touch devices. Enabled by default.
	 * @category Panning Inertia Options
	 */
	inertia: true,

	/**
	 * The rate with which the inertial movement slows down, in pixels/second².
	 * @category Panning Inertia Options
	 */
	inertiaDeceleration: 3400, // px/s^2

	/**
	 * Max speed of the inertial movement, in pixels/second.
	 * @category Panning Inertia Options
	 */
	inertiaMaxSpeed: 1400, // px/s

	/**
	 * @category Panning Inertia Options
	 */
	easeLinearity: 0.2,

	/**
	 * With this option enabled, the map tracks when you pan to another "copy" of the world and seamlessly
	 * jumps to the original one so that all overlays like markers and vector layers are still visible. A
	 * map with an infinite CRS, such as `SimpleCRS`, does not jump, as it has no copies of the world.
	 * @category Panning Inertia Options
	 */
	worldCopyJump: false,

	/**
	 * If `maxBounds` is set, this option will control how solid the bounds are when dragging
	 * the map around. The default value of `0.0` allows the user to drag outside the bounds at
	 * normal speed, higher values will slow down map dragging outside bounds, and `1.0` makes
	 * the bounds fully solid, preventing the user from dragging outside the bounds.
	 * @category Panning Inertia Options
	 */
	maxBoundsViscosity: 0.0,

	/**
	 * Makes the map focusable and allows users to navigate the map with keyboard arrows and `+`/`-` keys.
	 * @category Keyboard Navigation Options
	 */
	keyboard: true,

	/**
	 * Amount of pixels to pan when pressing an arrow key.
	 * @category Keyboard Navigation Options
	 */
	keyboardPanDelta: 80,

	/**
	 * Sets the `aria-keyshortcuts` attribute of the map container. ARIA names keys by what they type
	 * on a given layout, so `true` uses the names for a US English layout, which can be wrong for pages
	 * in other languages; pass a string to set the value for your audience's layout instead.
	 * @category Keyboard Navigation Options
	 * @type {boolean | string}
	 */
	ariaKeyShortcuts: false,

	/**
	 * Whether the map can be zoomed by using the mouse wheel. If passed `'center'`,
	 * it will zoom to the center of the view regardless of where the pointer was.
	 * @category Mouse wheel options
	 * @type {boolean | 'center'}
	 */
	scrollWheelZoom: true,

	/**
	 * Limits the rate at which a wheel can fire (in milliseconds). By default,
	 * the user can't zoom via wheel more often than once per 40 ms.
	 * @category Mouse wheel options
	 */
	wheelDebounceTime: 40,

	/**
	 * How many scroll pixels (as reported by [DomEvent.getWheelDelta](#domevent-getwheeldelta)) mean a
	 * change of one full zoom level. Smaller values will make wheel-zooming faster (and vice versa).
	 * @category Mouse wheel options
	 */
	wheelPxPerZoomLevel: 60,

	/**
	 * Fires a `contextmenu` event on a long touch press. iOS Safari doesn't fire one natively.
	 * @category Touch interaction options
	 */
	tapHold: true,

	/**
	 * The max number of pixels a user can shift his finger during touch for it to be considered a valid tap.
	 * @category Touch interaction options
	 */
	tapTolerance: 15,

	/**
	 * Whether the map can be zoomed by touch-dragging with two fingers. If passed `'center'`, it will zoom to the
	 * center of the view regardless of where the touch events (fingers) were. Enabled for touch-capable web
	 * browsers.
	 * @category Touch interaction options
	 * @type {boolean | 'center'}
	 */
	pinchZoom: true,

	/**
	 * Set it to false if you don't want the map to zoom beyond min/max zoom and then bounce back when pinch-zooming.
	 * @category Touch interaction options
	 */
	bounceAtZoomLimits: true,

	/**
	 * Whether a [zoom control](#control-zoom) is added to the map by default.
	 * @category Control options
	 */
	zoomControl: true,

	/**
	 * Whether a [attribution control](#control-attribution) is added to the map by default.
	 * @category Control options
	 */
	attributionControl: true
};

/** @typedef {typeof defaultOptions} MapDefaults */

/**
 * The map or a layer receiving DOM events, duck-typed for markers.
 * @typedef {Evented<any, any> & {getLatLng?(): LatLng, _pxRadius?: number,
 *    dragging?: {enabled(): boolean, moved(): unknown}}} DOMEventTarget
 */

/**
 * Layer events
 * @typedef {Object} MapLayerEvents
 * @property {LayersControlEvent} baselayerchange Fired when the base layer is changed through the [layers control](#control-layers).
 * @property {LayersControlEvent} overlayadd Fired when an overlay is selected through the [layers control](#control-layers).
 * @property {LayersControlEvent} overlayremove Fired when an overlay is deselected through the [layers control](#control-layers).
 * @property {LayerEvent} layeradd Fired when a new layer is added to the map.
 * @property {LayerEvent} layerremove Fired when some layer is removed from the map
 */

/**
 * Popup events
 * @typedef {Object} MapPopupEvents
 * @property {PopupEvent} popupopen Fired when a popup is opened in the map
 * @property {PopupEvent} popupclose Fired when a popup in the map is closed
 * @property {LeafletEvent} autopanstart Fired when the map starts autopanning when opening a popup.
 */

/**
 * Tooltip events
 * @typedef {Object} MapTooltipEvents
 * @property {TooltipEvent} tooltipopen Fired when a tooltip is opened in the map.
 * @property {TooltipEvent} tooltipclose Fired when a tooltip in the map is closed.
 */

/**
 * Map state change events
 * @typedef {Object} MapStateEvents
 * @property {ResizeEvent} resize Fired when the map is resized.
 * @property {LeafletEvent} unload Fired when the map is destroyed with [remove](#map-remove) method.
 * @property {LeafletEvent} viewreset Fired when the map needs to redraw its content (this usually happens on map zoom or load). Very useful for creating custom overlays.
 * @property {LeafletEvent} load Fired when the map is initialized (when its center and zoom are set for the first time).
 * @property {LeafletEvent} zoomstart Fired when the map zoom is about to change (e.g. before zoom animation).
 * @property {LeafletEvent} movestart Fired when the view of the map starts changing (e.g. user starts dragging the map).
 * @property {LeafletEvent} zoom Fired repeatedly during any change in zoom level, including zoom and fly animations.
 * @property {LeafletEvent} move Fired repeatedly during any movement of the map, including pan and fly animations.
 * @property {LeafletEvent} zoomend Fired when the map zoom changed, after any animations.
 * @property {LeafletEvent} moveend Fired when the center of the map stops changing (e.g. user stopped dragging the map or after non-centered zoom).
 * @property {WorldCopyJumpEvent} worldcopyjump Fired when [`worldCopyJump`](#map-worldcopyjump) moves the map pane by one or more world widths.
 * @property {LeafletEvent} zoomlevelschange Fired when the number of zoomlevels on the map is changed due to adding or removing a layer.
 */

/**
 * Location events
 * @typedef {Object} MapLocationEvents
 * @property {ErrorEvent} locationerror Fired when geolocation (using the [`locate`](#map-locate) method) failed.
 * @property {LocationEvent} locationfound Fired when geolocation (using the [`locate`](#map-locate) method) went successfully.
 */

/**
 * Interaction events
 * @typedef {Object} MapInteractionEvents
 * @property {LeafletPointerEvent} click Fired when the user clicks (or taps) the map.
 * @property {LeafletPointerEvent} dblclick Fired when the user double-clicks (or double-taps) the map.
 * @property {LeafletPointerEvent} pointerdown Fired when the user pushes the pointer on the map.
 * @property {LeafletPointerEvent} pointerup Fired when the user releases the pointer on the map.
 * @property {LeafletPointerEvent} pointerover Fired when the pointer enters the map.
 * @property {LeafletPointerEvent} pointerout Fired when the pointer leaves the map.
 * @property {LeafletPointerEvent} pointermove Fired while the pointer moves over the map.
 * @property {LeafletPointerEvent} contextmenu Fired when the user pushes the right mouse button on the map, prevents default browser context menu from showing if there are listeners on this event. Also fired on mobile when the user holds a single touch for a second (also called long press).
 * @property {LeafletKeyboardEvent} keydown Fired when the user presses a key from the keyboard while the map is focused.
 * @property {LeafletKeyboardEvent} keyup Fired when the user releases a key from the keyboard while the map is focused.
 * @property {LeafletPointerEvent} preclick Fired before pointer click on the map (sometimes useful when you want something to happen on click before any existing click handlers start running).
 */

/**
 * Other Events
 * @typedef {Object} MapOtherEvents
 * @property {ZoomAnimEvent} zoomanim Fired at least once per zoom animation. For continuous zoom, like pinch zooming, fired once per frame during zoom.
 */

/**
 * The central class of the API — it is used to create a map on a page and manipulate it.
 * @example
 * ```js
 * // initialize the map on the "map" div with a given center and zoom
 * const map = new LeafletMap('map', {
 * 	center: [51.505, -0.09],
 * 	zoom: 13
 * });
 * ```
 * @categoryDescription Handlers
 * Map properties include interaction handlers that allow you to control interaction behavior in runtime,
 * enabling or disabling certain features such as dragging or touch zoom (see `Handler` methods). For example:
 *
 * ```js
 * map.doubleClickZoom.disable();
 * ```
 * @categoryDescription Panes
 * Panes are DOM elements used to control the ordering of layers on the map. You can access panes with
 * [`map.getPane`](#map-getpane) or [`map.getPanes`](#map-getpanes) methods. New panes can be created with the
 * [`map.createPane`](#map-createpane) method.
 *
 * Every map has the following default panes that differ only in zIndex.
 *
 * | Pane | zIndex | Description |
 * | --- | --- | --- |
 * | `mapPane` | `'auto'` | Pane that contains all other map panes |
 * | `tilePane` | `200` | Pane for `GridLayer`s and `TileLayer`s |
 * | `overlayPane` | `400` | Pane for vectors (`Path`s, like `Polyline`s and `Polygon`s), `ImageOverlay`s and `VideoOverlay`s |
 * | `shadowPane` | `500` | Pane for overlay shadows (e.g. `Marker` shadows) |
 * | `markerPane` | `600` | Pane for `Icon`s of `Marker`s |
 * | `tooltipPane` | `650` | Pane for `Tooltip`s |
 * | `popupPane` | `700` | Pane for `Popup`s |
 * @extends {Evented<MapOptions, MapEventMap>}
 */
export class LeafletMap extends Evented {

	static initHooks = true;

	/** @type {Defaults<MapOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Instantiates a map object given the DOM ID of a `<div>` element (or the element itself)
	 * and optionally an object literal with `Map options`.
	 * @param {string | HTMLElement} id
	 * @param {Partial<MapOptions>} [options]
	 */
	constructor(id, options) {
		super();

		options = Util.setOptions(this, options);

		// Make sure to assign internal flags at the beginning,
		// to avoid inconsistent state in some edge cases.
		/** @type {Handler[]} */
		this._handlers = [];
		/** @type {{[id: number]: LayerBase}} */
		this._layers = {};
		/** @type {{[id: number]: GridLayer}} */
		this._zoomBoundLayers = {};
		this._sizeChanged = true;

		this._initContainer(id);
		this._initLayout();

		this._initEvents();

		if (options.maxBounds) {
			this.setMaxBounds(options.maxBounds);
		}

		if (options.zoom !== undefined) {
			/** @type {number} */
			this._zoom = this._limitZoom(options.zoom);
		}

		if (options.center && options.zoom !== undefined) {
			this.setView(new LatLng(options.center), options.zoom, {reset: true});
		}

		if (options.attributionControl) {
			new AttributionControl().addTo(this);
		}
		if (options.zoomControl) {
			/**
			 * The default zoom control (only available if the [`zoomControl`
			 * option](#map-zoomcontrol) was `true` when creating the map).
			 * @category Controls
			 * @type {ZoomControl | undefined}
			 */
			this.zoomControl = new ZoomControl();
			this.addControl(this.zoomControl);
		}

		if (options.touchZoom !== undefined) {
			// To be removed in leaflet 3
			console.warn('Map: touchZoom option is deprecated and will be removed in future versions. Use pinchZoom instead.');
			options.pinchZoom = options.touchZoom;
			delete options.touchZoom;
		}

		if (/** @type {any} */ (options).preferCanvas !== undefined) {
			console.error('Map: preferCanvas option has been removed. Use renderer: new Canvas() instead.');
		}

		this.addHandler('boxZoom', BoxZoomHandler);
		this.addHandler('doubleClickZoom', DoubleClickZoomHandler);
		this.addHandler('dragging', DragHandler);
		this.addHandler('keyboard', KeyboardHandler);
		this.addHandler('scrollWheelZoom', ScrollWheelZoomHandler);
		this.addHandler('tapHold', TapHoldHandler);
		this.addHandler('pinchZoom', PinchZoomHandler);
		/** @deprecated Use `pinchZoom`. */
		this.touchZoom = this.pinchZoom;

		this.callInitHooks();

		this._zoomAnimated = this.options.zoomAnimation;

		// zoom transitions run with the same duration for all layers, so if one of transitionend events
		// happens after starting zoom animation (propagating to the map pane), we know that it ended globally
		if (this._zoomAnimated) {
			this._createAnimProxy();
		}

		this._addLayers(this.options.layers);
	}

	/**
	 * Sets the view of the map (geographical center and zoom) with the given animation options.
	 * @category Methods for modifying map state
	 * @param {LatLngExpression} center
	 * @param {number} [zoom]
	 * @param {ZoomPanOptions} [options]
	 * @returns {this}
	 */
	setView(center, zoom, options) {

		zoom = zoom === undefined ? this._zoom : this._limitZoom(zoom);
		const latlng = this._limitCenter(new LatLng(center), zoom, this.options.maxBounds);
		options ??= {};

		this._stop();

		if (this._loaded && !options.reset) {

			if (options.animate !== undefined) {
				options.zoom = {animate: options.animate, ...options.zoom};
				options.pan = {animate: options.animate, duration: options.duration, ...options.pan};
			}

			// try animating pan or zoom
			const moved = (this._zoom !== zoom) ?
				this._tryAnimatedZoom && this._tryAnimatedZoom(latlng, zoom, options.zoom) :
				this._tryAnimatedPan(latlng, options.pan);

			if (moved) {
				// prevent resize handler call, the view will refresh after animation anyway
				clearTimeout(this._sizeTimer);
				return this;
			}
		}

		// animation didn't start, just reset the map view
		this._resetView(latlng, zoom, options.pan?.noMoveStart);

		return this;
	}

	/**
	 * Sets the zoom of the map.
	 * @category Methods for modifying map state
	 * @param {number} zoom
	 * @param {ZoomOptions} [options]
	 * @returns {this}
	 */
	setZoom(zoom, options) {
		if (!this._loaded) {
			this._zoom = zoom;
			return this;
		}
		return this.setView(this.getCenter(), zoom, {zoom: options});
	}

	/**
	 * Increases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
	 * @category Methods for modifying map state
	 * @param {number} [delta]
	 * @param {ZoomOptions} [options]
	 * @returns {this}
	 */
	zoomIn(delta, options) {
		delta ??= this.options.zoomDelta;
		return this.setZoom(this._zoom + delta, options);
	}

	/**
	 * Decreases the zoom of the map by `delta` ([`zoomDelta`](#map-zoomdelta) by default).
	 * @category Methods for modifying map state
	 * @param {number} [delta]
	 * @param {ZoomOptions} [options]
	 * @returns {this}
	 */
	zoomOut(delta, options) {
		delta ??= this.options.zoomDelta;
		return this.setZoom(this._zoom - delta, options);
	}

	/**
	 * Zooms the map while keeping a specified geographical point on the map stationary
	 * (e.g. used internally for scroll zoom and double-click zoom).
	 * @category Methods for modifying map state
	 * @overload
	 * @param {LatLngExpression} latlng
	 * @param {number} zoom
	 * @param {ZoomOptions} [options]
	 * @returns {this}
	 */
	/**
	 * Zooms the map while keeping a specified pixel on the map (relative to the top-left corner) stationary.
	 * @overload
	 * @param {Point} offset
	 * @param {number} zoom
	 * @param {ZoomOptions} [options]
	 * @returns {this}
	 */
	/**
	 * @param {LatLngExpression | Point} latlng
	 * @param {number} zoom
	 * @param {ZoomOptions} [options]
	 */
	setZoomAround(latlng, zoom, options) {
		// work in unrounded projected coordinates so that zooming back and forth around the same point
		// doesn't accumulate pixel rounding errors (amplified by the zoom scale) and drift the view
		const center = this.project(this.getCenter()),
		offset = latlng instanceof Point ?
			latlng.subtract(this.getSize().divideBy(2)) :
			this.project(latlng).subtract(center),
		newCenter = this.unproject(center.add(offset.multiplyBy(1 - 1 / this.getZoomScale(zoom))));

		return this.setView(newCenter, zoom, {zoom: options});
	}

	/**
	 * @param {LatLngBoundsExpression | {getBounds(): LatLngBounds}} bounds
	 * @param {FitBoundsOptions} [options]
	 */
	_getBoundsCenterZoom(bounds, options) {

		options ??= {};
		bounds = 'getBounds' in bounds ? bounds.getBounds() : new LatLngBounds(bounds);

		const paddingTL = new Point(options.paddingTopLeft || options.padding || [0, 0]),
		paddingBR = new Point(options.paddingBottomRight || options.padding || [0, 0]);

		let zoom = this.getBoundsZoom(bounds, false, paddingTL.add(paddingBR));

		zoom = (typeof options.maxZoom === 'number') ? Math.min(options.maxZoom, zoom) : zoom;

		if (zoom === Infinity) {
			return {
				center: bounds.getCenter(),
				zoom
			};
		}

		const paddingOffset = paddingBR.subtract(paddingTL).divideBy(2),

		swPoint = this.project(bounds.getSouthWest(), zoom),
		nePoint = this.project(bounds.getNorthEast(), zoom),
		center = this.unproject(swPoint.add(nePoint).divideBy(2).add(paddingOffset), zoom);

		return {
			center,
			zoom
		};
	}

	/**
	 * Sets a map view that contains the given geographical bounds with the maximum zoom level possible.
	 * @category Methods for modifying map state
	 * @param {LatLngBoundsExpression} bounds
	 * @param {FitBoundsOptions} [options]
	 * @returns {this}
	 */
	fitBounds(bounds, options) {

		bounds = new LatLngBounds(bounds);

		if (!bounds.isValid()) {
			throw new Error('Bounds are not valid.');
		}

		const target = this._getBoundsCenterZoom(bounds, options);
		return this.setView(target.center, target.zoom, options);
	}

	/**
	 * Sets a map view that mostly contains the whole world with the maximum zoom level possible.
	 * @category Methods for modifying map state
	 * @param {FitBoundsOptions} [options]
	 * @returns {this}
	 */
	fitWorld(options) {
		return this.fitBounds([[-90, -180], [90, 180]], options);
	}

	/**
	 * Pans the map to a given center.
	 * @category Methods for modifying map state
	 * @param {LatLngExpression} center
	 * @param {PanOptions} [options]
	 * @returns {this}
	 */
	panTo(center, options) {
		return this.setView(center, this._zoom, {pan: options});
	}

	/**
	 * Pans the map by a given number of pixels (animated unless `animate: false` is passed, or the user
	 * prefers reduced motion and the pan is longer than half the map size without `animate: true`).
	 * @category Methods for modifying map state
	 * @param {PointExpression} offset
	 * @param {PanOptions} [options]
	 * @returns {this}
	 */
	panBy(offset, options) {
		offset = new Point(offset).round();
		options ??= {};

		if (!offset.x && !offset.y) {
			return this.fire('moveend');
		}
		// If we pan too far, Chrome gets issues with tiles
		// and makes them disappear or appear in the wrong place (slightly offset) #2602
		const size = this.getSize();
		if (options.animate !== true && !size.contains(offset)) {
			const center = this.unproject(this.project(this.getCenter()).add(offset));
			this._resetView(this.options.worldCopyJump ? this.wrapLatLng(center) : center, this.getZoom());
			return this;
		}

		if (!this._panAnim) {
			this._panAnim = new PosAnimation();

			this._panAnim.on({
				'step': this._onPanTransitionStep,
				'end': this._onPanTransitionEnd
			}, this);
		}

		// don't fire movestart if animating inertia
		if (!options.noMoveStart) {
			this.fire('movestart');
		}

		// with reduced motion, only short pans are animated unless animate: true is specified
		const tooFarForReducedMotion = this._prefersReducedMotion() && !size.divideBy(2).contains(offset);
		if (options.animate === true || (options.animate !== false && !tooFarForReducedMotion)) {
			this._mapPane.classList.add('leaflet-pan-anim');

			const newPos = this._getMapPanePos().subtract(offset).round();
			this._panAnim.run(this._mapPane, newPos, options.duration || 0.25, options.easeLinearity);
		} else {
			this._rawPanBy(offset);
			this._wrapWorldCopy();
			this.fire('move').fire('moveend');
		}

		return this;
	}

	/**
	 * Sets the view of the map (geographical center and zoom) performing a smooth pan-zoom
	 * animation. If the user prefers reduced motion (and `animate: true` isn't passed),
	 * it behaves like `setView` instead, only animating short pans and zooms.
	 * @category Methods for modifying map state
	 * @param {LatLngExpression} targetCenter
	 * @param {number} [targetZoom]
	 * @param {ZoomPanOptions} [options]
	 * @returns {this}
	 */
	flyTo(targetCenter, targetZoom, options) {

		options ??= {};
		if (options.animate === false) {
			return this.setView(targetCenter, targetZoom, {...options, zoom: {...options.zoom, animate: false}});
		}
		if (options.animate !== true && this._prefersReducedMotion()) {
			return this.setView(targetCenter, targetZoom, options);
		}

		this._stop();

		targetZoom = targetZoom === undefined ? this._zoom : this._limitZoom(targetZoom);
		const center = this._limitCenter(new LatLng(targetCenter), targetZoom, this.options.maxBounds);

		const from = this.project(this.getCenter()),
		to = this.project(center),
		size = this.getSize(),
		startZoom = this._zoom;

		const w0 = Math.max(size.x, size.y),
		w1 = w0 * this.getZoomScale(startZoom, targetZoom),
		u1 = (to.distanceTo(from)) || 1,
		rho = 1.42,
		rho2 = rho * rho;

		/** @param {number} i */
		function r(i) {
			const s1 = i ? -1 : 1,
			s2 = i ? w1 : w0,
			t1 = w1 * w1 - w0 * w0 + s1 * rho2 * rho2 * u1 * u1,
			b1 = 2 * s2 * rho2 * u1;

			return -Math.asinh(t1 / b1);
		}

		const r0 = r(0);

		/** @param {number} s */
		function u(s) { return w0 * (Math.cosh(r0) * Math.tanh(r0 + rho * s) - Math.sinh(r0)) / rho2; }

		/** @param {number} t */
		function easeOut(t) { return 1 - (1 - t) ** 1.5; }

		const start = Date.now(),
		S = (r(1) - r0) / rho,
		duration = options.duration ? 1000 * options.duration : 1000 * S * 0.8;

		const frame = () => {
			const t = (Date.now() - start) / duration,
			s = easeOut(t) * S;

			if (t <= 1) {
				/** @type {number} */
				this._flyToFrame = requestAnimationFrame(frame);

				this._move(
					this.unproject(from.add(to.subtract(from).multiplyBy(u(s) / u1)), startZoom),
					this.getScaleZoom(Math.cosh(r0 + rho * s) / Math.cosh(r0), startZoom),
					{flyTo: true});

			} else {
				// the last step shifts the pixel origin even at the same zoom, and layers like GridLayer only
				// re-anchor on 'zoom' (#9438)
				const zoomChanged = this._zoom !== targetZoom;
				this._move(center, targetZoom);
				if (!zoomChanged) { this.fire('zoom'); }
				this._moveEnd(true);
			}
		};

		this._moveStart(true, options.noMoveStart);

		frame();
		return this;
	}

	/**
	 * Sets the view of the map with a smooth animation like [`flyTo`](#map-flyto),
	 * but takes a bounds parameter like [`fitBounds`](#map-fitbounds).
	 * @category Methods for modifying map state
	 * @param {LatLngBoundsExpression} bounds
	 * @param {FitBoundsOptions} [options]
	 * @returns {this}
	 */
	flyToBounds(bounds, options) {
		const target = this._getBoundsCenterZoom(bounds, options);
		return this.flyTo(target.center, target.zoom, options);
	}

	/**
	 * Restricts the map view to the given bounds (see the [maxBounds](#map-maxbounds) option).
	 * Call it without arguments to remove the restriction.
	 * @category Methods for modifying map state
	 * @param {LatLngBoundsExpression} [bounds]
	 * @returns {this}
	 */
	setMaxBounds(bounds) {
		// empty (so invalid) when called without bounds
		bounds = new LatLngBounds(/** @type {LatLngBoundsExpression} */ (bounds));

		if (this.listens('moveend', this._panInsideMaxBounds)) {
			this.off('moveend', this._panInsideMaxBounds);
		}

		if (!bounds.isValid()) {
			this.options.maxBounds = null;
			return this;
		}

		this.options.maxBounds = bounds;

		if (this._loaded) {
			this._panInsideMaxBounds();
		}

		return this.on('moveend', this._panInsideMaxBounds);
	}

	/**
	 * Sets the lower limit for the available zoom levels (see the [minZoom](#map-minzoom) option).
	 * @category Methods for modifying map state
	 * @param {number} zoom
	 * @returns {this}
	 */
	setMinZoom(zoom) {
		const oldZoom = this.options.minZoom;
		this.options.minZoom = zoom;

		if (this._loaded && oldZoom !== zoom) {
			this.fire('zoomlevelschange');

			if (this.getZoom() < this.options.minZoom) {
				return this.setZoom(zoom);
			}
		}

		return this;
	}

	/**
	 * Sets the upper limit for the available zoom levels (see the [maxZoom](#map-maxzoom) option).
	 * @category Methods for modifying map state
	 * @param {number} zoom
	 * @returns {this}
	 */
	setMaxZoom(zoom) {
		const oldZoom = this.options.maxZoom;
		this.options.maxZoom = zoom;

		if (this._loaded && oldZoom !== zoom) {
			this.fire('zoomlevelschange');

			if (this.getZoom() > this.options.maxZoom) {
				return this.setZoom(zoom);
			}
		}

		return this;
	}

	/**
	 * Pans the map to the closest view that would lie inside the given bounds (if it's
	 * not already), controlling the animation using the options specific, if any.
	 * @category Methods for modifying map state
	 * @param {LatLngBoundsExpression} bounds
	 * @param {PanOptions} [options]
	 * @returns {this}
	 */
	panInsideBounds(bounds, options) {
		this._enforcingBounds = true;
		const center = this.getCenter(),
		newCenter = this._limitCenter(center, this._zoom, new LatLngBounds(bounds));

		if (!center.equals(newCenter)) {
			this.panTo(newCenter, options);
		}

		this._enforcingBounds = false;
		return this;
	}

	/**
	 * Pans the map the minimum amount to make the `latlng` visible. Use padding options
	 * to fit the display to more restricted bounds. If `latlng` is already within
	 * the (optionally padded) display bounds, the map will not be panned.
	 * @category Methods for modifying map state
	 * @param {LatLngExpression} latlng
	 * @param {PanInsideOptions} [options]
	 * @returns {this}
	 */
	panInside(latlng, options) {
		options ??= {};

		const paddingTL = new Point(options.paddingTopLeft || options.padding || [0, 0]),
		paddingBR = new Point(options.paddingBottomRight || options.padding || [0, 0]),
		pixelCenter = this.project(this.getCenter()),
		pixelPoint = this.project(latlng),
		pixelBounds = this.getPixelBounds(),
		paddedBounds = new Bounds([pixelBounds.min.add(paddingTL), pixelBounds.max.subtract(paddingBR)]),
		paddedSize = paddedBounds.getSize();

		if (!paddedBounds.contains(pixelPoint)) {
			this._enforcingBounds = true;
			const centerOffset = pixelPoint.subtract(paddedBounds.getCenter());
			const offset = paddedBounds.extend(pixelPoint).getSize().subtract(paddedSize);
			pixelCenter.x += centerOffset.x < 0 ? -offset.x : offset.x;
			pixelCenter.y += centerOffset.y < 0 ? -offset.y : offset.y;
			this.panTo(this.unproject(pixelCenter), options);
			this._enforcingBounds = false;
		}
		return this;
	}

	/**
	 * Checks if the map container size changed and updates the map if so — call it after you've changed
	 * the map size dynamically, also animating pan by default. If `options.pan` is `false`, panning
	 * will not occur. If `options.debounceMoveend` is `true`, it will delay `moveend` event so that
	 * it doesn't happen often even if the method is called many times in a row. `true` is a shorthand
	 * for `{animate: true}`.
	 * @category Methods for modifying map state
	 * @param {InvalidateSizeOptions | boolean} [options]
	 * @returns {this}
	 */
	invalidateSize(options) {
		if (!this._loaded) { return this; }

		options = {
			animate: false,
			pan: true,
			...(options === true ? {animate: true} : options)
		};

		const oldSize = this.getSize();
		this._sizeChanged = true;
		this._lastCenter = null;

		const newSize = this.getSize(),
		oldCenter = oldSize.divideBy(2).round(),
		newCenter = newSize.divideBy(2).round(),
		offset = oldCenter.subtract(newCenter);

		if (!offset.x && !offset.y) { return this; }

		if (options.animate && options.pan) {
			this.panBy(offset);

		} else {
			if (options.pan) {
				this._rawPanBy(offset);
			}

			this.fire('move');

			if (options.debounceMoveend) {
				clearTimeout(this._sizeTimer);
				this._sizeTimer = setTimeout(this.fire.bind(this, 'moveend'), 200);
			} else {
				this.fire('moveend');
			}
		}

		return this.fire('resize', {
			oldSize,
			newSize
		});
	}

	/**
	 * Stops the currently running `panTo` or `flyTo` animation, if any.
	 * @category Methods for modifying map state
	 * @returns {this}
	 */
	stop() {
		this.setZoom(this._limitZoom(this._zoom));
		if (!this.options.zoomSnap) {
			this.fire('viewreset');
		}
		return this._stop();
	}

	/**
	 * Tries to locate the user using the Geolocation API, firing a [`locationfound`](#map-locationfound) event
	 * with location data on success or a [`locationerror`](#map-locationerror) event on failure, and optionally
	 * sets the map view to the user's location with respect to detection accuracy (or to the world view if
	 * geolocation failed). Note that, if your page doesn't use HTTPS, this method will fail in modern browsers
	 * ([Chrome 50 and
	 * newer](https://sites.google.com/a/chromium.org/dev/Home/chromium-security/deprecating-powerful-features-on-insecure-origins))
	 * See `Locate options` for more details.
	 * @category Geolocation methods
	 * @param {LocateOptions} [options]
	 * @returns {this}
	 */
	locate(options) {

		/** @type {LocateOptions} */
		this._locateOptions = options = {
			timeout: 10000,
			watch: false,
			// setView: false
			// maxZoom: <Number>
			// maximumAge: 0
			// enableHighAccuracy: false
			...options
		};

		if (!('geolocation' in navigator)) {
			this._handleGeolocationError({
				code: 0,
				message: 'Geolocation not supported.'
			});
			return this;
		}

		const onResponse = this._handleGeolocationResponse.bind(this),
		onError = this._handleGeolocationError.bind(this);

		if (options.watch) {
			if (this._locationWatchId !== undefined) {
				navigator.geolocation.clearWatch(this._locationWatchId);
			}
			/** @type {number} */
			this._locationWatchId = navigator.geolocation.watchPosition(onResponse, onError, options);
		} else {
			navigator.geolocation.getCurrentPosition(onResponse, onError, options);
		}
		return this;
	}

	/**
	 * Stops watching location previously initiated by `map.locate({watch: true})` and
	 * aborts resetting the map view if map.locate was called with `{setView: true}`.
	 * @category Geolocation methods
	 * @returns {this}
	 */
	stopLocate() {
		navigator.geolocation?.clearWatch?.(this._locationWatchId);
		if (this._locateOptions) {
			this._locateOptions.setView = false;
		}
		return this;
	}

	/** @param {{code: number, message: string}} error */
	_handleGeolocationError(error) {
		if (!this._container._leaflet_id) { return; }

		const c = error.code,
		message = error.message ||
		            (c === 1 ? 'permission denied' :
		            (c === 2 ? 'position unavailable' : 'timeout'));

		if (this._locateOptions.setView && !this._loaded) {
			this.fitWorld();
		}

		this.fire('locationerror', {
			code: c,
			message: `Geolocation error: ${message}.`
		});
	}

	/** @param {GeolocationPosition} pos */
	_handleGeolocationResponse(pos) {
		if (!this._container._leaflet_id) { return; }

		const lat = pos.coords.latitude,
		lng = pos.coords.longitude,
		latlng = new LatLng(lat, lng),
		bounds = latlng.toBounds(pos.coords.accuracy * 2),
		options = this._locateOptions;

		if (options.setView) {
			const zoom = this.getBoundsZoom(bounds);
			this.setView(latlng, options.maxZoom ? Math.min(zoom, options.maxZoom) : zoom);
		}

		/** @type {{[key: string]: unknown}} */
		const data = {
			latlng,
			bounds,
			timestamp: pos.timestamp
		};

		for (const i in pos.coords) { // do not use Object.keys here to access getters of GeolocationCoordinates
			const value = pos.coords[/** @type {keyof GeolocationCoordinates} */ (i)];
			if (typeof value === 'number') {
				data[i] = value;
			}
		}

		this.fire('locationfound', data);
	}

	/**
	 * Adds the given layer to the map
	 * @category Methods for Layers and Controls
	 * @param {LayerBase<any, any>} layer
	 * @returns {this}
	 */
	addLayer(layer) {
		if (!layer._layerAdd) {
			throw new Error('The provided object is not a Layer.');
		}

		const id = Util.stamp(layer);
		if (this._layers[id]) { return this; }
		this._layers[id] = layer;

		layer._mapToAdd = this;

		if (layer.beforeAdd) {
			layer.beforeAdd(this);
		}

		this.whenReady(layer._layerAdd, layer);

		return this;
	}

	/**
	 * Removes the given layer from the map.
	 * @category Methods for Layers and Controls
	 * @param {LayerBase<any, any>} layer
	 * @returns {this}
	 */
	removeLayer(layer) {
		const id = Util.stamp(layer);

		if (!this._layers[id]) { return this; }

		if (this._loaded) {
			layer.onRemove(this);
		}

		delete this._layers[id];

		if (this._loaded) {
			this.fire('layerremove', {layer});
			layer.fire('remove');
		}

		/** @type {any} */ (layer)._map = layer._mapToAdd = null;

		return this;
	}

	/**
	 * Returns `true` if the given layer is currently added to the map
	 * @category Methods for Layers and Controls
	 * @param {LayerBase<any, any>} layer
	 * @returns {boolean}
	 */
	hasLayer(layer) {
		return Util.stamp(layer) in this._layers;
	}

	/**
	 * Iterates over the layers of the map, optionally specifying context of the iterator function.
	 * ```
	 * map.eachLayer(function(layer){
	 *     layer.bindPopup('Hello');
	 * });
	 * ```
	 * @category Methods for Layers and Controls
	 * @param {(layer: LayerBase) => void} method
	 * @param {any} [context]
	 * @returns {this}
	 */
	eachLayer(method, context) {
		for (const layer of Object.values(this._layers)) {
			method.call(context, layer);
		}
		return this;
	}

	/**
	 * Opens the specified popup while closing the previously opened
	 * (to make sure only one is opened at one time for usability).
	 * @category Methods for Layers and Controls
	 * @overload
	 * @param {Popup} popup
	 * @returns {this}
	 */
	/**
	 * Creates a popup with the specified content and options and opens it in the given point on a map. String
	 * content is rendered as HTML; sanitize untrusted input or pass an `HTMLElement` with safe `textContent`
	 * instead.
	 * @overload
	 * @param {string | HTMLElement} content
	 * @param {LatLngExpression} latlng
	 * @param {Partial<PopupOptions>} [options]
	 * @returns {this}
	 */
	/**
	 * @param {Popup | string | HTMLElement} popup
	 * @param {LatLngExpression} [latlng]
	 * @param {Partial<PopupOptions>} [options]
	 */
	openPopup(popup, latlng, options) {
		this._initOverlay(Popup, popup, latlng, options)
			.openOn(this);

		return this;
	}

	/**
	 * Closes the popup previously opened with [openPopup](#map-openpopup) (or the given one).
	 * @category Methods for Layers and Controls
	 * @param {Popup} [popup]
	 * @returns {this}
	 */
	closePopup(popup) {
		popup = arguments.length ? popup : this._popup;
		popup?.close();
		return this;
	}

	/**
	 * Opens the specified tooltip.
	 * @category Methods for Layers and Controls
	 * @overload
	 * @param {Tooltip} tooltip
	 * @returns {this}
	 */
	/**
	 * Creates a tooltip with the specified content and options and open it. String content is rendered
	 * as HTML; sanitize untrusted input or pass an `HTMLElement` with safe `textContent` instead.
	 * @overload
	 * @param {string | HTMLElement} content
	 * @param {LatLngExpression} latlng
	 * @param {Partial<TooltipOptions>} [options]
	 * @returns {this}
	 */
	/**
	 * @param {Tooltip | string | HTMLElement} tooltip
	 * @param {LatLngExpression} [latlng]
	 * @param {Partial<TooltipOptions>} [options]
	 */
	openTooltip(tooltip, latlng, options) {
		this._initOverlay(Tooltip, tooltip, latlng, options)
			.openOn(this);

		return this;
	}

	/**
	 * Closes the tooltip given as parameter.
	 * @category Methods for Layers and Controls
	 * @param {Tooltip} tooltip
	 * @returns {this}
	 */
	closeTooltip(tooltip) {
		tooltip.close();
		return this;
	}

	/**
	 * @template {Popup | Tooltip} T
	 * @param {new (options?: Partial<PopupOptions & TooltipOptions>) => T} OverlayClass
	 * @param {T | string | HTMLElement} content
	 * @param {LatLngExpression} [latlng]
	 * @param {Partial<PopupOptions & TooltipOptions>} [options]
	 */
	_initOverlay(OverlayClass, content, latlng, options) {
		const overlay = content instanceof OverlayClass ? content :
			new OverlayClass(options).setContent(/** @type {string | HTMLElement} */ (content));
		if (latlng) {
			overlay.setLatLng(latlng);
		}
		return overlay;
	}

	/**
	 * Adds the given control to the map
	 * @category Methods for Layers and Controls
	 * @param {Control} control
	 * @returns {this}
	 */
	addControl(control) {
		control.addTo(this);
		return this;
	}

	/**
	 * Removes the given control from the map
	 * @category Methods for Layers and Controls
	 * @param {Control} control
	 * @returns {this}
	 */
	removeControl(control) {
		control.remove();
		return this;
	}

	/**
	 * Returns the instance of `Renderer` that should be used to render the given `Path`. It will ensure that the
	 * `renderer` options of the map and paths are respected, and that the renderers do exist on the map.
	 * @category Methods for Layers and Controls
	 * @param {Path<any, any>} layer
	 * @returns {Renderer}
	 */
	getRenderer(layer) {
		const renderer = layer.options.renderer ?? this._getPaneRenderer(layer) ?? this.options.renderer ??
			(this._renderer ??= layer._createRenderer());

		if (!this.hasLayer(renderer)) {
			this.addLayer(renderer);
		}
		return renderer;
	}

	/** @param {Path<any, any>} layer */
	_getPaneRenderer(layer) {
		const name = layer.options.pane;
		if (name === 'overlayPane' || name === undefined) {
			return;
		}

		let renderer = this._paneRenderers[name];
		if (!renderer) {
			// custom panes get a renderer of the same kind as the map's default one, so Canvas maps stay Canvas
			const RendererClass = /** @type {typeof Renderer | undefined} */ (this.options.renderer?.constructor);
			renderer = RendererClass ?
				new RendererClass({...this.options.renderer?.options, pane: name}) :
				layer._createRenderer({pane: name});
			this._paneRenderers[name] = renderer;
		}
		return renderer;
	}

	/**
	 * Adds a new `Handler` to the map, given its name and constructor function.
	 * @category Other Methods
	 * @param {string} name
	 * @param {new (map: LeafletMap) => Handler} HandlerClass
	 * @returns {this}
	 */
	addHandler(name, HandlerClass) {
		if (!HandlerClass) { return this; }

		const handler = /** @type {any} */ (this)[name] = new HandlerClass(this);

		this._handlers.push(handler);

		if (/** @type {any} */ (this.options)[name]) {
			handler.enable();
		}

		return this;
	}

	/**
	 * Destroys the map and clears all related event listeners.
	 * @category Other Methods
	 * @returns {this}
	 */
	remove() {

		this._initEvents(true);
		if (this.options.maxBounds) { this.off('moveend', this._panInsideMaxBounds); }

		if (this._containerId !== this._container._leaflet_id) {
			throw new Error('Map container is being reused by another instance');
		}

		delete this._container._leaflet_id;
		delete this._containerId;

		if (this._locationWatchId !== undefined) {
			this.stopLocate();
		}

		this._stop();

		PointerEvents.disablePointerDetection(this._container);
		this._mapPane.remove();

		this._controlContainer.remove();
		delete /** @type {any} */ (this)._controlCorners;
		delete /** @type {any} */ (this)._controlContainer;
		cancelAnimationFrame(this._resizeRequest);

		for (const handler of this._handlers) {
			handler.disable();
		}

		clearTimeout(this._transitionEndTimer);
		clearTimeout(this._sizeTimer);

		if (this._loaded) {
			this.fire('unload');
		}

		for (const layer of Object.values(this._layers)) {
			layer.remove();
		}
		for (const pane of Object.values(this._panes)) {
			pane.remove();
		}


		this._layers = {};
		this._panes = {};
		delete /** @type {any} */ (this)._mapPane;
		delete this._renderer;

		return this;
	}

	/**
	 * Creates a new [map pane](#map-pane) with the given name if it doesn't exist already, then returns it.
	 * The pane is created as a child of `container`, or as a child of the main map pane if not set.
	 * @category Other Methods
	 * @param {string} name
	 * @param {HTMLElement} [container]
	 * @returns {HTMLElement}
	 */
	createPane(name, container) {
		const className = `leaflet-pane${name ? ` leaflet-${name.replace('Pane', '')}-pane` : ''}`,
		pane = DomUtil.create('div', className, container || this._mapPane);

		if (name) {
			this._panes[name] = pane;
		}
		return pane;
	}

	/**
	 * Returns the geographical center of the map view
	 * @category Methods for Getting Map State
	 * @returns {LatLng}
	 */
	getCenter() {
		this._checkIfLoaded();

		if (this._lastCenter && this._getMapPanePos().equals(this._lastCenterPanePos)) {
			return this._lastCenter.clone();
		}
		return this.layerPointToLatLng(this._getCenterLayerPoint());
	}

	/**
	 * Returns the current zoom level of the map view
	 * @category Methods for Getting Map State
	 * @returns {number}
	 */
	getZoom() {
		return this._zoom;
	}

	/**
	 * Returns the geographical bounds visible in the current map view
	 * @category Methods for Getting Map State
	 * @returns {LatLngBounds}
	 */
	getBounds() {
		const bounds = this.getPixelBounds(),
		sw = this.unproject(bounds.getBottomLeft()),
		ne = this.unproject(bounds.getTopRight());

		return new LatLngBounds(sw, ne);
	}

	/**
	 * Returns the minimum zoom level of the map (if set in the `minZoom`
	 * option of the map or of any layers), or `0` by default.
	 * @category Methods for Getting Map State
	 * @returns {number}
	 */
	getMinZoom() {
		return this.options.minZoom ?? this._layersMinZoom ?? 0;
	}

	/**
	 * Returns the maximum zoom level of the map (if set in the `maxZoom` option of the map or of any layers).
	 * @category Methods for Getting Map State
	 * @returns {number}
	 */
	getMaxZoom() {
		return this.options.maxZoom ?? this._layersMaxZoom ?? Infinity;
	}

	/**
	 * Returns the maximum zoom level on which the given bounds fit to the map view in its entirety.
	 * If `inside` (optional) is set to `true`, the method instead returns the minimum zoom
	 * level on which the map view fits into the given bounds in its entirety.
	 * @category Methods for Getting Map State
	 * @param {LatLngBoundsExpression} bounds
	 * @param {boolean} [inside]
	 * @param {PointExpression} [padding]
	 * @returns {number}
	 */
	getBoundsZoom(bounds, inside, padding) {
		bounds = new LatLngBounds(bounds);
		padding = new Point(padding ?? [0, 0]);

		let zoom = this.getZoom() ?? 0;
		const min = this.getMinZoom(),
		max = this.getMaxZoom(),
		nw = bounds.getNorthWest(),
		se = bounds.getSouthEast(),
		size = this.getSize().subtract(padding),
		boundsSize = new Bounds(this.project(se, zoom), this.project(nw, zoom)).getSize(),
		snap = this.options.zoomSnap,
		scalex = size.x / boundsSize.x,
		scaley = size.y / boundsSize.y,
		scale = inside ? Math.max(scalex, scaley) : Math.min(scalex, scaley);

		zoom = this.getScaleZoom(scale, zoom);

		if (snap) {
			zoom = Math.round(zoom / (snap / 100)) * (snap / 100); // don't jump if within 1% of a snap level
			zoom = inside ? Math.ceil(zoom / snap) * snap : Math.floor(zoom / snap) * snap;
		}

		return Math.max(min, Math.min(max, zoom));
	}

	/**
	 * Returns the current size of the map container (in pixels).
	 * @category Methods for Getting Map State
	 * @returns {Point}
	 */
	getSize() {
		if (!this._size || this._sizeChanged) {
			/** @type {Point} */
			this._size = new Point(
				this._container.clientWidth || 0,
				this._container.clientHeight || 0);

			this._sizeChanged = false;
		}
		return this._size.clone();
	}

	/**
	 * Returns the bounds of the current map view in projected pixel coordinates (sometimes useful in layer and
	 * overlay implementations). If `center` and `zoom` is omitted, the map's current zoom level and center is used.
	 * @category Methods for Getting Map State
	 * @param {LatLng} [center]
	 * @param {number} [zoom]
	 * @returns {Bounds}
	 */
	getPixelBounds(center, zoom) {
		const topLeftPoint = this._getTopLeftPoint(center, zoom);
		return new Bounds(topLeftPoint, topLeftPoint.add(this.getSize()));
	}

	/**
	 * Returns the projected pixel coordinates of the top left point of the
	 * map layer (useful in custom layer and overlay implementations).
	 * @category Methods for Getting Map State
	 * @returns {Point}
	 */
	getPixelOrigin() {
		this._checkIfLoaded();
		return this._pixelOrigin;
	}

	/**
	 * Returns the world's bounds in pixel coordinates for zoom level `zoom`.
	 * If `zoom` is omitted, the map's current zoom level is used.
	 * @category Methods for Getting Map State
	 * @param {number} [zoom]
	 * @returns {Bounds | null}
	 */
	getPixelWorldBounds(zoom) {
		return this.options.crs.getProjectedBounds(zoom ?? this.getZoom());
	}

	/**
	 * Returns a [map pane](#map-pane), given its name or its HTML element (its identity).
	 * @category Other Methods
	 * @param {string | HTMLElement} pane
	 * @returns {HTMLElement}
	 */
	getPane(pane) {
		return typeof pane === 'string' ? this._panes[pane] : pane;
	}

	/**
	 * Returns a plain object containing the names of all [panes](#map-pane) as keys and the panes as values.
	 * @category Other Methods
	 * @returns {{[name: string]: HTMLElement}}
	 */
	getPanes() {
		return this._panes;
	}

	/**
	 * Returns the HTML element that contains the map.
	 * @category Other Methods
	 * @returns {HTMLElement}
	 */
	getContainer() {
		return this._container;
	}


	/**
	 * Returns the scale factor to be applied to a map transition from zoom level
	 * `fromZoom` to `toZoom`. Used internally to help with zoom animations.
	 * @category Conversion Methods
	 * @param {number} toZoom
	 * @param {number} [fromZoom]
	 * @returns {number}
	 */
	getZoomScale(toZoom, fromZoom) {
		// TODO replace with universal implementation after refactoring projections
		const crs = this.options.crs;
		fromZoom ??= this._zoom;
		return crs.scale(toZoom) / crs.scale(fromZoom);
	}

	/**
	 * Returns the zoom level that the map would end up at, if it is at `fromZoom` level and everything
	 * is scaled by a factor of `scale`. Inverse of [`getZoomScale`](#map-getZoomScale).
	 * @category Conversion Methods
	 * @param {number} scale
	 * @param {number} [fromZoom]
	 * @returns {number}
	 */
	getScaleZoom(scale, fromZoom) {
		const crs = this.options.crs;
		fromZoom ??= this._zoom;
		const zoom = crs.zoom(scale * crs.scale(fromZoom));
		return isNaN(zoom) ? Infinity : zoom;
	}

	/**
	 * Projects a geographical coordinate `LatLng` according to the projection of the map's CRS, then scales it
	 * according to `zoom` and the CRS's `Transformation`. The result is pixel coordinate relative to the CRS origin.
	 * @category Conversion Methods
	 * @param {LatLngExpression} latlng
	 * @param {number} [zoom]
	 * @returns {Point}
	 */
	project(latlng, zoom) {
		zoom ??= this._zoom;
		return this.options.crs.latLngToPoint(new LatLng(latlng), zoom);
	}

	/**
	 * Inverse of [`project`](#map-project).
	 * @category Conversion Methods
	 * @param {PointExpression} point
	 * @param {number} [zoom]
	 * @returns {LatLng}
	 */
	unproject(point, zoom) {
		zoom ??= this._zoom;
		return this.options.crs.pointToLatLng(new Point(point), zoom);
	}

	/**
	 * Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin), returns
	 * the corresponding geographical coordinate (for the current zoom level).
	 * @category Conversion Methods
	 * @param {PointExpression} point
	 * @returns {LatLng}
	 */
	layerPointToLatLng(point) {
		const projectedPoint = new Point(point).add(this.getPixelOrigin());
		return this.unproject(projectedPoint);
	}

	/**
	 * Given a geographical coordinate, returns the corresponding pixel
	 * coordinate relative to the [origin pixel](#map-getpixelorigin).
	 * @category Conversion Methods
	 * @param {LatLngExpression} latlng
	 * @returns {Point}
	 */
	latLngToLayerPoint(latlng) {
		return this.project(new LatLng(latlng))._subtract(this.getPixelOrigin());
	}

	/**
	 * Returns a `LatLng` where `lat` and `lng` has been wrapped according to the map's CRS's `wrapLat`
	 * and `wrapLng` properties, if they are outside the CRS's bounds. By default this means longitude
	 * is wrapped around the dateline so its value is between -180 and +180 degrees.
	 * @category Conversion Methods
	 * @param {LatLngExpression} latlng
	 * @returns {LatLng}
	 */
	wrapLatLng(latlng) {
		return this.options.crs.wrapLatLng(new LatLng(latlng));
	}

	/**
	 * Returns a `LatLngBounds` with the same size as the given one, ensuring that its center is within the
	 * CRS's bounds. By default this means the center longitude is wrapped around the dateline so its value
	 * is between -180 and +180 degrees, and the majority of the bounds overlaps the CRS's bounds.
	 * @category Conversion Methods
	 * @param {LatLngBoundsExpression} bounds
	 * @returns {LatLngBounds}
	 */
	wrapLatLngBounds(bounds) {
		return this.options.crs.wrapLatLngBounds(new LatLngBounds(bounds));
	}

	/**
	 * Returns the distance between two geographical coordinates according
	 * to the map's CRS. By default this measures distance in meters.
	 * @category Conversion Methods
	 * @param {LatLngExpression} latlng1
	 * @param {LatLngExpression} latlng2
	 * @returns {number}
	 */
	distance(latlng1, latlng2) {
		return this.options.crs.distance(new LatLng(latlng1), new LatLng(latlng2));
	}

	/**
	 * Given a pixel coordinate relative to the map container, returns the corresponding
	 * pixel coordinate relative to the [origin pixel](#map-getpixelorigin).
	 * @category Conversion Methods
	 * @param {PointExpression} point
	 * @returns {Point}
	 */
	containerPointToLayerPoint(point) {
		return new Point(point).subtract(this._getMapPanePos());
	}

	/**
	 * Given a pixel coordinate relative to the [origin pixel](#map-getpixelorigin),
	 * returns the corresponding pixel coordinate relative to the map container.
	 * @category Conversion Methods
	 * @param {PointExpression} point
	 * @returns {Point}
	 */
	layerPointToContainerPoint(point) {
		return new Point(point).add(this._getMapPanePos());
	}

	/**
	 * Given a pixel coordinate relative to the map container, returns the corresponding
	 * geographical coordinate (for the current zoom level).
	 * @category Conversion Methods
	 * @param {PointExpression} point
	 * @returns {LatLng}
	 */
	containerPointToLatLng(point) {
		const layerPoint = this.containerPointToLayerPoint(new Point(point));
		return this.layerPointToLatLng(layerPoint);
	}

	/**
	 * Given a geographical coordinate, returns the corresponding pixel coordinate relative to the map container.
	 * @category Conversion Methods
	 * @param {LatLngExpression} latlng
	 * @returns {Point}
	 */
	latLngToContainerPoint(latlng) {
		return this.layerPointToContainerPoint(this.latLngToLayerPoint(new LatLng(latlng)));
	}

	/**
	 * Given a PointerEvent object, returns the pixel coordinate relative
	 * to the map container where the event took place.
	 * @category Conversion Methods
	 * @param {PointerEvent | MouseEvent} e
	 * @returns {Point}
	 */
	pointerEventToContainerPoint(e) {
		return DomEvent.getPointerPosition(e, this._container);
	}

	/**
	 * Given a PointerEvent object, returns the pixel coordinate relative to
	 * the [origin pixel](#map-getpixelorigin) where the event took place.
	 * @category Conversion Methods
	 * @param {PointerEvent | MouseEvent} e
	 * @returns {Point}
	 */
	pointerEventToLayerPoint(e) {
		return this.containerPointToLayerPoint(this.pointerEventToContainerPoint(e));
	}

	/**
	 * Given a PointerEvent object, returns geographical coordinate where the event took place.
	 * @category Conversion Methods
	 * @param {PointerEvent | MouseEvent} e
	 * @returns {LatLng}
	 */
	pointerEventToLatLng(e) {
		return this.layerPointToLatLng(this.pointerEventToLayerPoint(e));
	}


	// map initialization methods

	/** @param {string | HTMLElement} id */
	_initContainer(id) {
		/** @type {(HTMLElement & {_leaflet_id?: number}) | null} */
		const container = DomUtil.get(id);

		if (!container) {
			throw new Error('Map container not found.');
		} else if (container._leaflet_id) {
			throw new Error('Map container is already initialized.');
		}
		/** @type {HTMLElement & {_leaflet_id?: number}} */
		this._container = container;

		PointerEvents.enablePointerDetection(container);
		DomEvent.on(container, 'scroll', this._onScroll, this);
		this._containerId = Util.stamp(container);

	}

	_initLayout() {
		const container = this._container;

		this._fadeAnimated = this.options.fadeAnimation;

		// leaflet-touch and leaflet-retina have no rules in leaflet.css, but plugin stylesheets still target them
		const classes = ['leaflet-container', 'leaflet-touch'];

		if (window.devicePixelRatio > 1) { classes.push('leaflet-retina'); }
		if (this._fadeAnimated) { classes.push('leaflet-fade-anim'); }

		container.classList.add(...classes);

		const {position} = getComputedStyle(container);

		if (position !== 'absolute' && position !== 'relative' && position !== 'fixed' && position !== 'sticky') {
			container.style.position = 'relative';
		}

		this._initPanes();
		this._initControlPos();
	}

	_initControlPos() {
		/** @type {{[position: string]: HTMLElement}} */
		const corners = {},
		l = 'leaflet-',
		container = DomUtil.create('div', `${l}control-container`, this._container);

		for (const v of ['top', 'bottom']) {
			for (const h of ['left', 'right']) {
				corners[v + h] = DomUtil.create('div', `${l + v} ${l}${h}`, container);
			}
		}
		/** @type {{[position: string]: HTMLElement}} */
		this._controlCorners = corners;
		/** @type {HTMLElement} */
		this._controlContainer = container;
	}

	_initPanes() {
		/** @type {{[name: string]: HTMLElement}} */
		const panes = {};
		/** @type {{[name: string]: HTMLElement}} */
		this._panes = panes;
		/** @type {{[pane: string]: Renderer}} */
		this._paneRenderers = {};

		/** @type {HTMLElement} */
		this._mapPane = this.createPane('mapPane', this._container);
		DomUtil.setPosition(this._mapPane, new Point(0, 0));

		this.createPane('tilePane');
		this.createPane('overlayPane');
		this.createPane('shadowPane');
		this.createPane('markerPane');
		this.createPane('tooltipPane');
		this.createPane('popupPane');

		if (!this.options.markerZoomAnimation) {
			panes.markerPane.classList.add('leaflet-zoom-hide');
			panes.shadowPane.classList.add('leaflet-zoom-hide');
		}
	}


	// private methods that modify map state
	/**
	 * @param {LatLng} center
	 * @param {number} zoom
	 * @param {boolean} [noMoveStart]
	 */
	_resetView(center, zoom, noMoveStart) {
		const loading = !this._loaded;
		this._loaded = true;
		zoom = this._limitZoom(zoom);

		// before the pane reset, so that listeners still see the current view
		this.fire('viewprereset', {center, zoom});

		DomUtil.setPosition(this._mapPane, new Point(0, 0));

		const zoomChanged = this._zoom !== zoom;
		if (zoomChanged && !loading) {
			/** @type {number} */
			this._instantZoomEnd = Date.now() + zoomAnimDuration;
		}
		this
			._moveStart(zoomChanged, noMoveStart)
			._move(center, zoom)
			._moveEnd(zoomChanged);

		this.fire('viewreset');

		if (loading) {
			this.fire('load');
		}
	}

	/**
	 * @param {boolean} zoomChanged
	 * @param {boolean} [noMoveStart]
	 */
	_moveStart(zoomChanged, noMoveStart) {
		if (zoomChanged) {
			this.fire('zoomstart');
		}
		if (!noMoveStart) {
			this.fire('movestart');
		}
		return this;
	}

	/**
	 * @param {LatLng} center
	 * @param {number} [zoom]
	 * @param {{flyTo?: boolean, pinch?: boolean}} [data]
	 * @param {boolean} [suppressEvent]
	 */
	_move(center, zoom, data, suppressEvent) {
		if (zoom === undefined) {
			zoom = this._zoom;
		}
		const zoomChanged = this._zoom !== zoom;

		this._zoom = zoom;
		/** @type {LatLng | null} */
		this._lastCenter = center;
		/** @type {Point} */
		this._lastCenterPanePos = this._getMapPanePos();
		/** @type {Point} */
		this._pixelOrigin = this._getNewPixelOrigin(center);

		if (!suppressEvent) {
			if (zoomChanged || (data?.pinch)) {	// Always fire 'zoom' if pinching because #3530
				this.fire('zoom', data);
			}

			this.fire('move', data);
		} else if (data?.pinch) {	// Always fire 'zoom' if pinching because #3530
			this.fire('zoom', data);
		}
		return this;
	}

	/** @param {boolean} zoomChanged */
	_moveEnd(zoomChanged) {
		if (zoomChanged) {
			this.fire('zoomend');
		}

		return this.fire('moveend');
	}

	_stop() {
		cancelAnimationFrame(this._flyToFrame);
		cancelAnimationFrame(this._zoomAnimFrame);
		this._panAnim?.stop();
		return this;
	}

	/** @param {PointExpression} offset */
	_rawPanBy(offset) {
		DomUtil.setPosition(this._mapPane, this._getMapPanePos().subtract(offset));
	}

	// Shifts a map pane position by whole world widths to bring the view center back into the original world, moving
	// the pane and firing `worldcopyjump` if that makes it jump from where it is now.
	_wrapWorldCopy(pos = this._getMapPanePos()) {
		// an infinite CRS has no world to wrap around, and no pixel world bounds either
		if (!this._loaded || !this.options.worldCopyJump || this.options.crs.infinite) { return pos; }

		const width = /** @type {Bounds} */ (this.getPixelWorldBounds()).getSize().x,
		x = pos.x - width * Math.round((pos.x + this.latLngToLayerPoint([0, 0]).x - this.getSize().x / 2) / width),
		worlds = Math.round((x - this._getMapPanePos().x) / width);

		pos = new Point(x, pos.y);

		if (worlds) {
			DomUtil.setPosition(this._mapPane, pos);

			this.fire('worldcopyjump', {worlds});
		}
		return pos;
	}

	/** @param {Layer | Layer[]} [layers] */
	_addLayers(layers) {
		layers = layers ? (Array.isArray(layers) ? layers : [layers]) : [];

		for (const layer of layers) {
			this.addLayer(layer);
		}
	}

	/** @param {GridLayer} layer */
	_addZoomLimit(layer) {
		if (!isNaN(/** @type {number} */ (layer.options.maxZoom)) || !isNaN(layer.options.minZoom)) {
			this._zoomBoundLayers[Util.stamp(layer)] = layer;
			this._updateZoomLevels();
		}
	}

	/** @param {GridLayer} layer */
	_removeZoomLimit(layer) {
		const id = Util.stamp(layer);

		if (this._zoomBoundLayers[id]) {
			delete this._zoomBoundLayers[id];
			this._updateZoomLevels();
		}
	}

	_updateZoomLevels() {
		let minZoom = Infinity,
		maxZoom = -Infinity;
		const oldZoomSpan = this._getZoomSpan();

		for (const l of Object.values(this._zoomBoundLayers)) {
			const options = l.options;
			minZoom = Math.min(minZoom, options.minZoom ?? Infinity);
			maxZoom = Math.max(maxZoom, options.maxZoom ?? -Infinity);
		}

		this._layersMaxZoom = maxZoom === -Infinity ? undefined : maxZoom;
		this._layersMinZoom = minZoom === Infinity ? undefined : minZoom;

		if (oldZoomSpan !== this._getZoomSpan()) {
			this.fire('zoomlevelschange');
		}

		if (this.options.maxZoom === undefined && this._layersMaxZoom && this.getZoom() > this._layersMaxZoom) {
			this.setZoom(this._layersMaxZoom);
		}
		if (this.options.minZoom === undefined && this._layersMinZoom && this.getZoom() < this._layersMinZoom) {
			this.setZoom(this._layersMinZoom);
		}
	}

	_getZoomSpan() {
		return this.getMaxZoom() - this.getMinZoom();
	}

	_panInsideMaxBounds() {
		if (!this._enforcingBounds) {
			this.panInsideBounds(/** @type {LatLngBoundsExpression} */ (this.options.maxBounds));
		}
	}

	_checkIfLoaded() {
		if (!this._loaded) {
			throw new Error('Set map center and zoom first.');
		}
	}

	// DOM event handling
	/** @param {boolean} [remove] */
	_initEvents(remove) {
		/** @type {{[id: number]: DOMEventTarget}} */
		this._targets = {};
		this._targets[Util.stamp(this._container)] = this;

		const onOff = remove ? DomEvent.off : DomEvent.on;

		onOff(this._container, 'click dblclick pointerdown pointerup ' +
			'pointerover pointerout pointermove contextmenu keydown keyup', this._handleDOMEvent, this);

		if (this.options.trackResize) {
			if (!remove) {
				if (!this._resizeObserver) {
					/** @type {ResizeObserver} */
					this._resizeObserver = new ResizeObserver(this._onResize.bind(this));
				}
				this._resizeObserver.observe(this._container);
			} else {
				this._resizeObserver.disconnect();
			}
		}

		if (this.options.transform3DLimit) {
			if (remove) {
				this.off('moveend', this._onMoveEnd);
			} else {
				this.on('moveend', this._onMoveEnd);
			}
		}
	}

	_onResize() {
		cancelAnimationFrame(this._resizeRequest);
		/** @type {number} */
		this._resizeRequest = requestAnimationFrame(() => { this.invalidateSize({debounceMoveend: true}); });
	}

	_onScroll() {
		this._container.scrollTop  = 0;
		this._container.scrollLeft = 0;
	}

	_onMoveEnd() {
		const pos = this._getMapPanePos();
		if (Math.max(Math.abs(pos.x), Math.abs(pos.y)) >= this.options.transform3DLimit) {
			// https://bugzilla.mozilla.org/show_bug.cgi?id=1203873 but Webkit also have
			// a pixel offset on very high values, see: https://jsfiddle.net/dg6r5hhb/
			this._resetView(this.getCenter(), this.getZoom());
		}
	}

	/**
	 * @param {Event} e
	 * @param {string} type
	 */
	_findEventTargets(e, type) {
		/** @type {DOMEventTarget[]} */
		let targets = [];
		let target,
		src = /** @type {Node | null} */ (e.target),
		dragging = false;
		const isHover = type === 'pointerout' || type === 'pointerover';

		while (src) {
			target = this._targets[Util.stamp(src)];
			if (target && (type === 'click' || type === 'preclick') && this._draggableMoved(target)) {
				// Prevent firing click after you just dragged an object.
				dragging = true;
				break;
			}
			if (target && target.listens(type, true)) {
				if (isHover && !DomEvent.isExternalTarget(src, /** @type {MouseEvent} */ (e))) { break; }
				targets.push(target);
				if (isHover) { break; }
			}
			if (src === this._container) { break; }
			src = src.parentNode;
		}
		if (!targets.length && !dragging && !isHover && this.listens(type, true)) {
			targets = [this];
		}
		return targets;
	}

	/** @param {Node | null} el */
	_isClickDisabled(el) {
		while (el && el !== this._container) {
			if (/** @type {any} */ (el)['_leaflet_disable_click'] || !el.parentNode) { return true; }
			el = el.parentNode;
		}
	}

	/** @param {Event} e */
	_handleDOMEvent(e) {
		const el = /** @type {Element & {_leaflet_disable_events?: boolean}} */ (e.target);
		if (!this._loaded || el['_leaflet_disable_events'] || e.type === 'click' && this._isClickDisabled(el)) {
			return;
		}

		this._fireDOMEvent(e, e.type);
	};

	static _pointerEvents = ['click', 'dblclick', 'pointerover', 'pointerout', 'contextmenu'];

	/**
	 * @param {Event} e
	 * @param {string} type
	 * @param {DOMEventTarget[] | false} [canvasTargets]
	 */
	_fireDOMEvent(e, type, canvasTargets) {

		if (type === 'click') {
			// Fire a synthetic 'preclick' event which propagates up (mainly for closing popups).
			this._fireDOMEvent(e, 'preclick', canvasTargets);
		}

		// Find the layer the event is propagating from and its parents.
		let targets = this._findEventTargets(e, type);

		if (canvasTargets) {
			// pick only targets with listeners
			const filtered = canvasTargets.filter(t => t.listens(type, true));
			targets = [...filtered, ...targets];
		}

		if (!targets.length) { return; }

		if (type === 'contextmenu') {
			e.preventDefault();
		}

		const target = targets[0];
		/**
		 * @type {{originalEvent: Event & {_stopped?: boolean},
		 *    containerPoint?: Point, layerPoint?: Point, latlng?: LatLng}}
		 */
		const data = {
			originalEvent: e
		};

		if (e.type !== 'keydown' && e.type !== 'keyup') {
			const latlng = (!target._pxRadius || target._pxRadius <= 10) && target.getLatLng?.();
			data.containerPoint = latlng ?
				this.latLngToContainerPoint(latlng) : this.pointerEventToContainerPoint(/** @type {MouseEvent} */ (e));
			data.layerPoint = this.containerPointToLayerPoint(data.containerPoint);
			data.latlng = latlng || this.layerPointToLatLng(data.layerPoint);
		}

		for (const t of targets) {
			t.fire(type, data, true);
			// bubblingMouseEvents is the Leaflet 1 name of the option
			const bubbling = t.options.bubblingMouseEvents ?? t.options.bubblingPointerEvents;
			if (data.originalEvent._stopped ||
				(bubbling === false && LeafletMap._pointerEvents.includes(type))) { return; }
		}
	}

	/** @param {DOMEventTarget} obj */
	_draggableMoved(obj) {
		obj = obj.dragging?.enabled() ? obj : this;
		return obj.dragging?.moved() || this.boxZoom?.moved();
	}

	/**
	 * Runs the given function `fn` when the map gets initialized with a view (center and zoom) and at least
	 * one layer, or immediately if it's already initialized, optionally passing a function context.
	 * @category Other Methods
	 * @param {(e: {target: LeafletMap}) => void} callback
	 * @param {any} [context]
	 * @returns {this}
	 */
	whenReady(callback, context) {
		if (this._loaded) {
			callback.call(context || this, {target: this});
		} else {
			this.on('load', callback, context);
		}
		return this;
	}


	// private methods for getting map state

	_getMapPanePos() {
		return DomUtil.getPosition(this._mapPane);
	}

	/**
	 * @param {LatLngExpression} [center]
	 * @param {number} [zoom]
	 */
	_getTopLeftPoint(center, zoom) {
		const pixelOrigin = center && zoom !== undefined ?
			this._getNewPixelOrigin(center, zoom) :
			this.getPixelOrigin();
		return pixelOrigin.subtract(this._getMapPanePos());
	}

	/**
	 * @param {LatLngExpression} center
	 * @param {number} [zoom]
	 */
	_getNewPixelOrigin(center, zoom) {
		const viewHalf = this.getSize()._divideBy(2);
		return this.project(center, zoom)._subtract(viewHalf)._add(this._getMapPanePos())._round();
	}

	/**
	 * @param {LatLngExpression} latlng
	 * @param {number} zoom
	 * @param {LatLngExpression} center
	 */
	_latLngToNewLayerPoint(latlng, zoom, center) {
		const topLeft = this._getNewPixelOrigin(center, zoom);
		return this.project(latlng, zoom)._subtract(topLeft);
	}

	// layer point of the current center
	_getCenterLayerPoint() {
		return this.containerPointToLayerPoint(this.getSize()._divideBy(2));
	}

	// offset of the specified place to the current center in pixels
	/** @param {LatLngExpression} latlng */
	_getCenterOffset(latlng) {
		return this.latLngToLayerPoint(latlng)._round()._subtract(this._getCenterLayerPoint());
	}

	// adjust center for view to get inside bounds
	/**
	 * @param {LatLng} center
	 * @param {number} zoom
	 * @param {LatLngBoundsExpression | null} [bounds]
	 */
	_limitCenter(center, zoom, bounds) {

		if (!bounds) { return center; }

		const centerPoint = this.project(center, zoom),
		viewHalf = this.getSize().divideBy(2),
		viewBounds = new Bounds(centerPoint.subtract(viewHalf), centerPoint.add(viewHalf)),
		offset = this._getBoundsOffset(viewBounds, bounds, zoom);

		// If offset is less than a pixel, ignore.
		// This prevents unstable projections from getting into
		// an infinite loop of tiny offsets.
		if (Math.abs(offset.x) <= 1 && Math.abs(offset.y) <= 1) {
			return center;
		}

		return this.unproject(centerPoint.add(offset), zoom);
	}

	// not cached, so that a preference changed mid-session applies right away
	_prefersReducedMotion() {
		return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	}

	// adjust offset for view to get inside bounds
	/**
	 * @param {Point} offset
	 * @param {LatLngBoundsExpression | null} [bounds]
	 */
	_limitOffset(offset, bounds) {
		if (!bounds) { return offset; }

		const viewBounds = this.getPixelBounds(),
		newBounds = new Bounds(viewBounds.min.add(offset), viewBounds.max.add(offset));

		return offset.add(this._getBoundsOffset(newBounds, bounds));
	}

	// returns offset needed for pxBounds to get inside maxBounds at a specified zoom
	/**
	 * @param {Bounds} pxBounds
	 * @param {LatLngBoundsExpression} maxBounds
	 * @param {number} [zoom]
	 */
	_getBoundsOffset(pxBounds, maxBounds, zoom) {
		// `setMaxBounds` makes the option a `LatLngBounds`
		const bounds = /** @type {LatLngBounds} */ (maxBounds),
		projectedMaxBounds = new Bounds(
			this.project(bounds.getNorthEast(), zoom),
			this.project(bounds.getSouthWest(), zoom)
		),
		minOffset = projectedMaxBounds.min.subtract(pxBounds.min),
		maxOffset = projectedMaxBounds.max.subtract(pxBounds.max),

		dx = this._rebound(minOffset.x, -maxOffset.x),
		dy = this._rebound(minOffset.y, -maxOffset.y);

		return new Point(dx, dy);
	}

	/**
	 * @param {number} left
	 * @param {number} right
	 */
	_rebound(left, right) {
		return left + right > 0 ?
			Math.round(left - right) / 2 :
			Math.max(0, Math.ceil(left)) - Math.max(0, Math.floor(right));
	}

	/** @param {number} zoom */
	_limitZoom(zoom) {
		const min = this.getMinZoom(),
		max = this.getMaxZoom(),
		snap = this.options.zoomSnap;
		if (snap) {
			zoom = Math.round(zoom / snap) * snap;
		}
		return Math.max(min, Math.min(max, zoom));
	}

	_onPanTransitionStep() {
		this.fire('move');
	}

	_onPanTransitionEnd() {
		this._mapPane.classList.remove('leaflet-pan-anim');
		this._wrapWorldCopy();
		this.fire('moveend');
	}

	/**
	 * @param {LatLng} center
	 * @param {PanOptions} [options]
	 */
	_tryAnimatedPan(center, options) {
		// difference between the new and current centers in pixels
		const offset = this._getCenterOffset(center)._trunc();

		// don't animate too far unless animate: true specified in options
		if (options?.animate !== true && !this.getSize().contains(offset)) { return false; }

		this.panBy(offset, options);

		return true;
	}

	_createAnimProxy() {
		/** @type {HTMLElement} */
		this._proxy = DomUtil.create('div', 'leaflet-proxy leaflet-zoom-animated');
		this._panes.mapPane.appendChild(this._proxy);

		this.on('zoomanim', this._animateProxyZoom, this);
		this.on('load moveend', this._animMoveEnd, this);

		DomEvent.on(this._proxy, 'transitionend', this._catchTransitionEnd, this);
	}

	/** @param {ZoomAnimEvent} e */
	_animateProxyZoom(e) {
		const transform = this._proxy.style.transform;

		DomUtil.setTransform(
			this._proxy,
			this.project(e.center, e.zoom),
			this.getZoomScale(e.zoom, 1),
		);

		// workaround for case when transform is the same and so transitionend event is not fired
		if (transform === this._proxy.style.transform && this._animatingZoom) {
			this._onZoomTransitionEnd();
		}
	}

	_animMoveEnd() {
		const c = this.getCenter();
		const z = this.getZoom();



		DomUtil.setTransform(
			this._proxy,
			this.project(c, z),
			this.getZoomScale(z, 1),
		);
	}

	/** @param {TransitionEvent} e */
	_catchTransitionEnd(e) {
		if (this._animatingZoom && e.propertyName.includes('transform')) {
			this._onZoomTransitionEnd();
		}
	}

	_nothingToAnimate() {
		return !this._container.getElementsByClassName('leaflet-zoom-animated').length;
	}

	// an animated zoom drops zooms from input until it ends, so hold them as long after an instant zoom too,
	// or a trackpad swipe or a held key zooms several times as far
	_zoomInputBlocked() {
		return this._animatingZoom || Date.now() < this._instantZoomEnd;
	}

	/**
	 * @param {LatLng} center
	 * @param {number} zoom
	 * @param {ZoomPanOptions} [options]
	 */
	_tryAnimatedZoom(center, zoom, options) {

		if (this._animatingZoom) { return true; }

		options ??= {};

		// don't animate if disabled, not supported or zoom difference is too large (over 1 with reduced motion,
		// unless animate: true is specified)
		const threshold = this.options.zoomAnimationThreshold,
		maxZoomDiff = this._prefersReducedMotion() && options.animate !== true ? Math.min(threshold, 1) : threshold;
		if (!this._zoomAnimated || options.animate === false || this._nothingToAnimate() ||
		        Math.abs(zoom - this._zoom) > maxZoomDiff) { return false; }

		// offset is the pixel coords of the zoom origin relative to the current center
		const scale = this.getZoomScale(zoom),
		offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

		// don't animate if the zoom origin isn't within one screen from the current center, unless forced
		if (options.animate !== true && !this.getSize().contains(offset)) { return false; }

		/** @type {number} */
		this._zoomAnimFrame = requestAnimationFrame(() => {
			this._zoomAnimFrame = 0;
			this
				._moveStart(true, options.noMoveStart ?? false)
				._animateZoom(center, zoom, true);
		});

		return true;
	}

	/**
	 * @param {LatLng} center
	 * @param {number} zoom
	 * @param {boolean} [startAnim]
	 * @param {boolean} [noUpdate]
	 */
	_animateZoom(center, zoom, startAnim, noUpdate) {
		if (!this._mapPane) { return; }

		if (startAnim) {
			this._animatingZoom = true;

			// remember what center/zoom to set after animation
			/** @type {LatLng} */
			this._animateToCenter = center;
			/** @type {number} */
			this._animateToZoom = zoom;

			this._mapPane.classList.add('leaflet-zoom-anim');
		}

		this.fire('zoomanim', {
			center,
			zoom,
			noUpdate
		});

		if (!this._tempFireZoomEvent) {
			this._tempFireZoomEvent = this._zoom !== this._animateToZoom;
		}

		this._move(this._animateToCenter, this._animateToZoom, undefined, true);

		// Work around webkit not firing 'transitionend', see https://github.com/Leaflet/Leaflet/issues/3689, 2693
		this._transitionEndTimer = setTimeout(this._onZoomTransitionEnd.bind(this), zoomAnimDuration);
	}

	_onZoomTransitionEnd() {
		if (!this._animatingZoom) { return; }

		this._mapPane?.classList.remove('leaflet-zoom-anim');

		this._animatingZoom = false;

		this._move(this._animateToCenter, this._animateToZoom, undefined, true);

		if (this._tempFireZoomEvent) {
			this.fire('zoom');
		}
		delete this._tempFireZoomEvent;

		this.fire('move');

		this._moveEnd(true);
	}
}

export {LeafletMap as Map};

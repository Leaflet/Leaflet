// @ts-check
import {Layer} from './Layer.js';
import * as DomUtil from '../dom/DomUtil.js';
import * as Util from '../core/Util.js';
import * as DomEvent from '../dom/DomEvent.js';
import {Bounds} from '../geometry/Bounds.js';

/** @import {BlanketOverlayOptions, Defaults, LayerEventMap, ZoomAnimEvent} from '../types.js' */
/** @import {LatLng} from '../geo/LatLng.js' */
/** @import {Point} from '../geometry/Point.js' */

const defaultOptions = {
	/**
	 * How much to extend the clip area around the map view (relative to its size), e.g. 0.1 would be 10% of map
	 * view in each direction.
	 */
	padding: 0.1,

	/**
	 * When `false`, the blanket will update its position only when the map state settles (*after* a pan/zoom
	 * animation). When `true`, it will update when the map state changes (*during* pan/zoom animations)
	 */
	continuous: false,
};

/** @typedef {typeof defaultOptions} BlanketOverlayDefaults */

/**
 * Represents an HTML element that covers ("blankets") the entire surface of the map.
 *
 * Do not use this class directly. It's meant for `Renderer`, and for plugins that rely on one single HTML element.
 * @categoryDescription Subclass interface
 * Subclasses must define the following methods:
 * @template {BlanketOverlayOptions} [O=BlanketOverlayOptions]
 * @template {LayerEventMap} [E=LayerEventMap]
 * @extends {Layer<O, E>}
 */
export class BlanketOverlay extends Layer {

	static initHooks = true;

	/** @type {Defaults<BlanketOverlayOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Creates a blanket overlay with the given options.
	 * @param {Partial<O>} [options]
	 */
	constructor(options) {
		super();
		Util.setOptions(this, options);
		this.callInitHooks();
	}

	onAdd() {
		if (!this._container) {
			this._initContainer(); // defined by renderer implementations

			// always keep transform-origin as 0 0, #8794
			/** @type {HTMLElement} */ (this._container).classList.add('leaflet-zoom-animated');
		}

		this.getPane().appendChild(this._container);
		this._resizeContainer();
		this._onMoveEnd();
	}

	onRemove() {
		this._destroyContainer();
	}

	getEvents() {
		/** @type {{[type: string]: (e: any) => void}} */
		const events = {
			viewreset: this._reset,
			zoom: this._onZoom,
			moveend: this._onMoveEnd,
			resize: this._resizeContainer,
			zoomend: this._onZoomEnd,
			zoomanim: this._onAnimZoom
		};
		if (this.options.continuous) {
			events.move = this._onMoveEnd;
		}
		return events;
	}

	/** @param {ZoomAnimEvent} ev */
	_onAnimZoom(ev) {
		this._updateTransform(ev.center, ev.zoom);
	}

	_onZoom() {
		this._updateTransform(this._map.getCenter(), this._map.getZoom());
	}

	/**
	 * @param {LatLng} center
	 * @param {number} zoom
	 */
	_updateTransform(center, zoom) {
		const scale = this._map.getZoomScale(zoom, this._zoom),
		viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding),
		currentCenterPoint = this._map.project(this._center, zoom),
		topLeftOffset = viewHalf.multiplyBy(-scale)._add(currentCenterPoint)
			._subtract(this._map._getNewPixelOrigin(center, zoom))
			._round();

		DomUtil.setTransform(this._container, topLeftOffset, scale);
	}

	_onMoveEnd() {
		// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
		const p = this.options.padding,
		size = this._map.getSize(),
		min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

		/** @type {Bounds} */
		this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());

		/** @type {LatLng} */
		this._center = this._map.getCenter();
		/** @type {number} */
		this._zoom = this._map.getZoom();
		this._updateTransform(this._center, this._zoom);

		this._onSettled();
	}

	_reset() {
		this._onSettled();
		this._updateTransform(this._center, this._zoom);
		this._onViewReset();
	}

	/**
	 * Must initialize the HTML element to use as blanket, and store it as `this._container`. The base
	 * implementation creates a blank `<div>`.
	 * @category Subclass interface
	 * @uninheritable
	 */
	_initContainer() {
		/** @type {HTMLElement | SVGElement} */
		this._container = DomUtil.create('div');
	}

	/**
	 * Must destroy the HTML element in `this._container` and free any other resources. The base implementation
	 * destroys the element and removes any event handlers attached to it.
	 * @category Subclass interface
	 * @uninheritable
	 */
	_destroyContainer() {
		DomEvent.off(this._container);
		this._container.remove();
		delete /** @type {any} */ (this)._container;
	}

	/**
	 * The base implementation resizes the container (based on the map's size and taking into account the
	 * padding), returning the new size in CSS pixels.
	 *
	 * Subclass implementations shall reset container parameters and data structures as needed.
	 * @category Subclass interface
	 * @returns {Point}
	 * @uninheritable
	 */
	_resizeContainer() {
		const p = this.options.padding,
		size = this._map.getSize().multiplyBy(1 + p * 2).round();
		this._container.style.width = `${size.x}px`;
		this._container.style.height = `${size.y}px`;
		return size;
	}

	/**
	 * (Optional) Runs on the map's `zoomend` event.
	 * @category Subclass interface
	 * @uninheritable
	 */
	_onZoomEnd() {}

	/**
	 * (Optional) Runs on the map's `viewreset` event.
	 * @category Subclass interface
	 * @uninheritable
	 */
	_onViewReset() {}

	/**
	 * Runs whenever the map state settles after changing (at the end of pan/zoom animations, etc). This should
	 * trigger the bulk of any rendering logic.
	 *
	 * If the `continuous` option is set to `true`, then this also runs on any map state change (including
	 * *during* pan/zoom animations).
	 * @category Subclass interface
	 * @uninheritable
	 */
	_onSettled() {}
}

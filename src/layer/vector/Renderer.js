import {BlanketOverlay} from '../BlanketOverlay.js';
import * as Util from '../../core/Util.js';

/** @import {LatLngExpression, LeafletEvent, RendererEventMap, RendererOptions} from '../../types.js' */
/** @import {Point} from '../../geometry/Point.js' */
/** @import {LeafletMap} from '../../map/Map.js' */

/**
 * @typedef {Object} RendererEvents
 * @property {LeafletEvent} update Fired when the renderer updates its bounds, center and zoom, for example when its
 * map has moved.
 */

/**
 * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the DOM container of the renderer,
 * its bounds, and its zoom animation.
 *
 * A `Renderer` works as an implicit layer group for all `Path`s - the renderer itself can be added or removed
 * to the map. All paths use a renderer, which can be implicit (the map will decide the type of renderer and
 * use it automatically) or explicit (using the [`renderer`](#path-renderer) option of the path).
 *
 * Do not use this class directly, use `SVG` and `Canvas` instead.
 *
 * The `continuous` option inherited from `BlanketOverlay` cannot be set to `true` (otherwise, renderers get out of
 * place during a pinch-zoom operation).
 * @constructorDescription Creates a renderer with the given options.
 * @template {RendererOptions} [O=RendererOptions]
 * @template {RendererEventMap} [E=RendererEventMap]
 * @extends {BlanketOverlay<O, E>}
 */
export class Renderer extends BlanketOverlay {

	static initHooks = true;

	/** @param {NoInfer<Partial<O>>} [options] */
	constructor(options) {
		super(/** @type {Partial<O>} */ ({...options, continuous: false}));
		Util.stamp(this);
		this._layers ??= {};
		this.callInitHooks();
	}

	/** @param {LeafletMap} map */
	onAdd(map) {
		this._setPathView();
		super.onAdd(map);
		this.on('update', this._updatePaths, this);
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		super.onRemove(map);
		this.off('update', this._updatePaths, this);
		// removed during a view reset, it won't get the viewreset that ends the postponing
		this._postponeUpdatePaths = false;
	}

	getEvents() {
		const events = super.getEvents();
		events.viewprereset = this._onViewPreReset;
		return events;
	}

	// A view reset fires zoomend and moveend before viewreset, so leave projecting and updating paths to viewreset,
	// which does each once
	_onViewPreReset() {
		/** @type {boolean} */
		this._postponeUpdatePaths = true;
	}

	_onZoomEnd() {
		if (this._postponeUpdatePaths) { return; }
		this._setPathView();
		for (const layer of Object.values(this._layers)) {
			layer._project();
		}
	}

	// Paths are projected with the zoom and pixel origin the renderer was last drawn at, which lag behind the map's
	// during zoom animation and pinch, so that paths changed or added meanwhile line up with the rest.
	_setPathView() {
		/** @type {number} */
		this._pathZoom = this._map.getZoom();
		/** @type {Point} */
		this._pathOrigin = this._map.getPixelOrigin();
	}

	/** @param {LatLngExpression} latlng */
	_latLngToLayerPoint(latlng) {
		return this._map.project(latlng, this._pathZoom)._subtract(this._pathOrigin);
	}

	_updatePaths() {
		if (this._postponeUpdatePaths) { return; }
		for (const layer of Object.values(this._layers)) {
			layer._update();
		}
	}

	_reset() {
		super._reset();
		this._postponeUpdatePaths = false;
		this._updatePaths();
	}

	_onViewReset() {
		this._setPathView();
		for (const layer of Object.values(this._layers)) {
			layer._project();
		}
	}

	_onSettled() {
		this._update();
	}

	// Subclasses are responsible of implementing `_update()`. It should fire
	// the 'update' event whenever appropriate (before/after rendering).
	_update() {}

}

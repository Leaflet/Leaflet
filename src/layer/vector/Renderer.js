// @ts-check
import {BlanketOverlay} from '../BlanketOverlay.js';
import * as Util from '../../core/Util.js';

/** @import {LeafletEvent, RendererEventMap, RendererOptions} from '../../types.js' */
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
 * @template {RendererOptions} [O=RendererOptions]
 * @template {RendererEventMap} [E=RendererEventMap]
 * @extends {BlanketOverlay<O, E>}
 */
export class Renderer extends BlanketOverlay {

	static initHooks = true;

	/** @param {Partial<O>} [options] */
	constructor(options) {
		super(/** @type {Partial<O>} */ ({...options, continuous: false}));
		Util.stamp(this);
		this._layers ??= {};
		this.callInitHooks();
	}

	/** @param {LeafletMap} map */
	onAdd(map) {
		super.onAdd(map);
		this.on('update', this._updatePaths, this);
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		super.onRemove(map);
		this.off('update', this._updatePaths, this);
	}

	_onZoomEnd() {
		// When a zoom ends, the "origin pixel" changes. Internal coordinates
		// of paths are relative to the origin pixel and therefore need to
		// be recalculated.
		for (const layer of Object.values(this._layers)) {
			layer._project();
		}
	}

	_updatePaths() {
		for (const layer of Object.values(this._layers)) {
			layer._update();
		}
	}

	_onViewReset() {
		for (const layer of Object.values(this._layers)) {
			layer._reset();
		}
	}

	_onSettled() {
		this._update();
	}

	// Subclasses are responsible of implementing `_update()`. It should fire
	// the 'update' event whenever appropriate (before/after rendering).
	_update() {}

}

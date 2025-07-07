import {BlanketOverlay} from '../BlanketOverlay.js';
import * as Util from '../../core/Util.js';

/*
 * @class Renderer
 * @inherits BlanketOverlay
 *
 * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the
 * DOM container of the renderer, its bounds, and its zoom animation.
 *
 * A `Renderer` works as an implicit layer group for all `Path`s - the renderer
 * itself can be added or removed to the map. All paths use a renderer, which can
 * be implicit (the map will decide the type of renderer and use it automatically)
 * or explicit (using the [`renderer`](#path-renderer) option of the path).
 *
 * Do not use this class directly, use `SVG` and `Canvas` instead.
 *
 * The `continuous` option inherited from `BlanketOverlay` cannot be set to `true`
 * (otherwise, renderers get out of place during a pinch-zoom operation).
 *
 * @event update: Event
 * Fired when the renderer updates its bounds, center and zoom, for example when
 * its map has moved
 */

export class Renderer extends BlanketOverlay {

	initialize(options) {
		Util.setOptions(this, {...options, continuous: false});
		Util.stamp(this);
		this._layers ??= {};
	}

	onAdd(map) {
		super.onAdd(map);
		this.on('update', this._updatePaths, this);
	}

	onRemove() {
		super.onRemove();
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

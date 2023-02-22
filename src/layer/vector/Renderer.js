import {BlanketOverlay} from '../BlanketOverlay.js';
import * as Util from '../../core/Util.js';
import {Bounds} from '../../geometry/Bounds.js';

/*
 * @class Renderer
 * @inherits BlanketOverlay
 * @aka L.Renderer
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
 * @event update: Event
 * Fired when the renderer updates its bounds, center and zoom, for example when
 * its map has moved
 */

export const Renderer = BlanketOverlay.extend({

	initialize(options) {
		Util.setOptions(this, options);
		Util.stamp(this);
		this._layers = this._layers || {};
	},

	onAdd() {
		BlanketOverlay.prototype.onAdd.call(this);
		this.on('update', this._updatePaths, this);
	},

	onRemove() {
		BlanketOverlay.prototype.onRemove.call(this);
		this.off('update', this._updatePaths, this);
	},

	_onZoomEnd() {
		for (const id in this._layers) {
			this._layers[id]._project();
		}
	},

	_updatePaths() {
		for (const id in this._layers) {
			this._layers[id]._update();
		}
	},

	_onViewReset() {
		for (const id in this._layers) {
			this._layers[id]._reset();
		}
	},

	_update() {
		// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
		// Subclasses are responsible of firing the 'update' event.
		const p = this.options.padding,
		    size = this._map.getSize(),
		    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

		this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());

		this._center = this._map.getCenter();
		this._zoom = this._map.getZoom();
	}
});

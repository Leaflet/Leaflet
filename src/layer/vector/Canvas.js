import {Renderer} from './Renderer.js';
import * as Util from '../../core/Util.js';
import {Bounds} from '../../geometry/Bounds.js';

/** @import {CanvasDefaults, CanvasOptions, Defaults, RendererEventMap} from '../../types.js' */
/** @import {LeafletMap} from '../../map/Map.js' */
/** @import {Point} from '../../geometry/Point.js' */
/** @import {CircleMarker} from './CircleMarker.js' */
/** @import {Path} from './Path.js' */
/** @import {Polyline} from './Polyline.js' */

const defaultOptions = {
	/** How much to extend the click tolerance around a path/object on the map. */
	tolerance: 0
};

/** @typedef {typeof defaultOptions} CanvasDefaultsValues */

// a node of the linked list of paths in drawing order
/** @typedef {{layer: Path, prev?: DrawOrder | null, next?: DrawOrder | null}} DrawOrder */

const DASH_SEPARATOR_RE = /[, ]+/;

/**
 * Allows vector layers to be displayed with [`<canvas>`](https://developer.mozilla.org/docs/Web/API/Canvas_API).
 * Inherits `Renderer`.
 * @constructorDescription Creates a Canvas renderer with the given options.
 * @example
 * Use Canvas by default for all paths in the map:
 *
 * ```js
 * const map = new LeafletMap('map', {
 * 	renderer: new Canvas()
 * });
 * ```
 *
 * Use a Canvas renderer with extra padding for specific vector geometries:
 *
 * ```js
 * const map = new LeafletMap('map');
 * const myRenderer = new Canvas({ padding: 0.5 });
 * const line = new Polyline( coordinates, { renderer: myRenderer } );
 * const circle =  new Circle( center, { renderer: myRenderer, radius: 100 } );
 * ```
 * @template {CanvasOptions} [O=CanvasOptions]
 * @template {RendererEventMap} [E=RendererEventMap]
 * @extends {Renderer<O & CanvasDefaults, E>}
 */
export class Canvas extends Renderer {

	/** @type {Defaults<CanvasOptions>} */
	static defaultOptions = defaultOptions;

	getEvents() {
		const events = super.getEvents();
		events.viewprereset = this._onViewPreReset;
		return events;
	}

	_onViewPreReset() {
		// Set a flag so that a viewprereset+moveend+viewreset only updates&redraws once
		/** @type {boolean} */
		this._postponeUpdatePaths = true;
	}

	/** @param {LeafletMap} map */
	onAdd(map) {
		super.onAdd(map);

		// the map hit-tests canvas renderers topmost first: by pane z-index, then DOM order
		const z = (/** @type {Canvas} */ r) => +getComputedStyle(/** @type {Element} */ (r._container.parentNode)).zIndex || 0;
		map._canvases.push(this);
		map._canvases.sort((a, b) => z(b) - z(a) || 1 - (a._container.compareDocumentPosition(b._container) & 2));

		// Redraw vectors since canvas is cleared upon removal,
		// in case of removing the renderer itself from the map.
		this._draw();
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		super.onRemove(map);
		map._canvases = map._canvases.filter(r => r !== this);
	}

	_initContainer() {
		const container = this._container = document.createElement('canvas');

		/** @type {CanvasRenderingContext2D} */
		this._ctx = /** @type {CanvasRenderingContext2D} */ (container.getContext('2d'));
	}

	_destroyContainer() {
		cancelAnimationFrame(/** @type {number} */ (this._redrawRequest));
		/** @type {number | null} */
		this._redrawRequest = null;
		delete /** @type {any} */ (this)._ctx;
		super._destroyContainer();
	}

	_resizeContainer() {
		const size = super._resizeContainer();
		const m = this._ctxScale = window.devicePixelRatio;

		// set canvas size (also clearing it); use double size on retina
		this._container.width = m * size.x;
		this._container.height = m * size.y;
		return size;
	}

	_updatePaths() {
		if (this._postponeUpdatePaths) { return; }

		/** @type {Bounds | null} */
		this._redrawBounds = null;
		for (const layer of Object.values(this._layers)) {
			layer._update();
		}
		this._redraw();
	}

	_update() {
		if (this._map._animatingZoom && this._bounds) { return; }

		const b = this._bounds,
		s = this._ctxScale;

		// translate so we use the same path coordinates after canvas element moves
		this._ctx.setTransform(
			s, 0, 0, s,
			-b.min.x * s,
			-b.min.y * s);

		// Tell paths to redraw themselves
		this.fire('update');
	}

	_reset() {
		super._reset();

		if (this._postponeUpdatePaths) {
			this._postponeUpdatePaths = false;
			this._updatePaths();
		}
	}

	/** @param {Path} layer */
	_initPath(layer) {
		this._updateDashArray(layer);
		this._layers[Util.stamp(layer)] = layer;

		this._append(layer._order = {layer});
	}

	/** @param {Path} layer */
	_addPath(layer) {
		this._requestRedraw(layer);
	}

	/** @param {Path} layer */
	_removePath(layer) {
		this._unlink(/** @type {DrawOrder} */ (layer._order));
		delete layer._order;

		delete this._layers[Util.stamp(layer)];

		this._requestRedraw(layer);
	}

	/** @param {Path} layer */
	_updatePath(layer) {
		// Redraw the union of the layer's old pixel
		// bounds and the new pixel bounds.
		this._extendRedrawBounds(layer);
		layer._project();
		layer._update();
		// The redraw will extend the redraw bounds
		// with the new pixel bounds.
		this._requestRedraw(layer);
	}

	/** @param {Path} layer */
	_updateStyle(layer) {
		this._updateDashArray(layer);
		this._requestRedraw(layer);
	}

	/** @param {Path} layer */
	_updateDashArray(layer) {
		if (typeof layer.options.dashArray === 'string') {
			const parts = layer.options.dashArray.split(DASH_SEPARATOR_RE);
			// Ignore dash array containing invalid lengths
			layer._dashArray = parts.map(n => Number(n)).filter(n => !isNaN(n));
		} else {
			layer._dashArray = layer.options.dashArray;
		}
	}

	/** @param {Path} layer */
	_requestRedraw(layer) {
		if (!this._map) { return; }

		this._extendRedrawBounds(layer);
		this._redrawRequest ??= requestAnimationFrame(this._redraw.bind(this));
	}

	/** @param {Path} layer */
	_extendRedrawBounds(layer) {
		if (layer._pxBounds) {
			const padding = (+layer.options.weight || 0) + 1;
			this._redrawBounds ??= new Bounds();
			this._redrawBounds.extend(layer._pxBounds.min.subtract([padding, padding]));
			this._redrawBounds.extend(layer._pxBounds.max.add([padding, padding]));
		}
	}

	_redraw() {
		// drop a pending frame on a synchronous redraw, so it can't run after removal
		cancelAnimationFrame(/** @type {number} */ (this._redrawRequest));
		this._redrawRequest = null;

		if (this._redrawBounds) {
			this._redrawBounds.min._floor();
			this._redrawBounds.max._ceil();
		}

		this._clear(); // clear layers in redraw bounds
		this._draw(); // draw layers

		this._redrawBounds = null;
	}

	_clear() {
		const bounds = this._redrawBounds;
		if (bounds) {
			const size = bounds.getSize();
			this._ctx.clearRect(bounds.min.x, bounds.min.y, size.x, size.y);
		} else {
			this._ctx.save();
			this._ctx.setTransform(1, 0, 0, 1, 0, 0);
			this._ctx.clearRect(0, 0, this._container.width, this._container.height);
			this._ctx.restore();
		}
	}

	_draw() {
		let layer;
		const bounds = this._redrawBounds;
		this._ctx.save();
		if (bounds) {
			const size = bounds.getSize();
			this._ctx.beginPath();
			this._ctx.rect(bounds.min.x, bounds.min.y, size.x, size.y);
			this._ctx.clip();
		}

		/** @type {boolean} */
		this._drawing = true;

		for (let order = this._drawFirst; order; order = order.next) {
			layer = order.layer;
			if (!bounds || layer._pxBounds?.intersects(bounds)) {
				layer._updatePath();
			}
		}

		this._drawing = false;

		this._ctx.restore();  // Restore state before clipping.
	}

	/**
	 * @param {Polyline} layer
	 * @param {boolean} [closed]
	 */
	_updatePoly(layer, closed) {
		if (!this._drawing) { return; }

		const parts = layer._parts,
		ctx = this._ctx;

		if (!parts.length) { return; }

		ctx.beginPath();

		parts.forEach((p0) => {
			p0.forEach((p, j) => {
				ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
			});
			if (closed) {
				ctx.closePath();
			}
		});

		this._fillStroke(ctx, layer);

		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	}

	/** @param {CircleMarker} layer */
	_updateCircle(layer) {

		if (!this._drawing || layer._empty()) { return; }

		const {x, y} = layer._point,
		ctx = this._ctx,
		r = Math.max(Math.round(layer._pxRadius), 1),
		ry = Math.max(Math.round(layer._pxRadiusY ?? r), 1);

		ctx.beginPath();
		// arc is faster for circles in Chrome and Firefox, ellipse for everything else
		if (ry === r) {
			ctx.arc(x, y, r, 0, Math.PI * 2);
		} else {
			ctx.ellipse(x, y, r, ry, 0, 0, Math.PI * 2);
		}

		this._fillStroke(ctx, layer);
	}

	/**
	 * @param {CanvasRenderingContext2D} ctx
	 * @param {Path} layer
	 */
	_fillStroke(ctx, layer) {
		const options = layer.options;

		if (options.fill) {
			ctx.globalAlpha = options.fillOpacity;
			ctx.fillStyle = options.fillColor ?? options.color;
			ctx.fill(options.fillRule || 'evenodd');
		}

		if (options.stroke && +options.weight !== 0) {
			ctx.lineDashOffset = Number(options.dashOffset ?? 0);
			ctx.setLineDash(layer._dashArray ?? []);
			ctx.globalAlpha = options.opacity;
			ctx.lineWidth = options.weight;
			ctx.strokeStyle = options.color;
			ctx.lineCap = options.lineCap;
			ctx.lineJoin = options.lineJoin;
			ctx.stroke();
		}
	}

	// Canvas obviously doesn't have pointer events for individual drawn objects,
	// so the map calls this on its own pointer events to find what's under the pointer

	/**
	 * Returns the topmost interactive layer under the pointer.
	 * @param {MouseEvent} e
	 * @param {boolean} [click] Skip layers that were just dragged, so the drag doesn't end with a click.
	 */
	_layerAt(e, click) {
		const point = this._map.pointerEventToLayerPoint(e);

		for (let order = this._drawLast; order; order = order.prev) {
			const layer = order.layer;
			if (layer.options.interactive && layer._containsPoint(point) && !(click && this._map._draggableMoved(layer))) {
				return layer;
			}
		}
	}

	/** @param {Path} layer */
	_bringToFront(layer) {
		const order = layer._order;
		if (order?.next) { // unless already last
			this._unlink(order);
			this._append(order);
			this._requestRedraw(layer);
		}
	}

	/** @param {Path} layer */
	_bringToBack(layer) {
		const order = layer._order;
		if (order?.prev) { // unless already first
			this._unlink(order);
			order.prev = null;
			order.next = this._drawFirst;
			/** @type {DrawOrder} */ (this._drawFirst).prev = order;
			this._drawFirst = order;
			this._requestRedraw(layer);
		}
	}

	/** @param {DrawOrder} order */
	_append(order) {
		order.prev = this._drawLast;
		order.next = null;
		if (this._drawLast) { this._drawLast.next = order; }
		/** @type {DrawOrder | null | undefined} */
		this._drawLast = order;
		this._drawFirst ??= order;
	}

	/** @param {DrawOrder} order */
	_unlink({prev, next}) {
		if (next) {
			next.prev = prev;
		} else {
			this._drawLast = prev;
		}
		if (prev) {
			prev.next = next;
		} else {
			this._drawFirst = next;
		}
	}
}

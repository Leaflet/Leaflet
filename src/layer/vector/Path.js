// @ts-check
import {Layer} from '../Layer.js';
import {SVG} from './SVG.js';
import * as Util from '../../core/Util.js';

/** @import {CanvasOptions, Defaults, InteractiveLayerEventMap, PathOptions, RendererOptions} from '../../types.js' */
/** @import {LeafletMap} from '../../map/Map.js' */
/** @import {Renderer} from './Renderer.js' */

const defaultOptions = {
	/** Whether to draw stroke along the path. Set it to `false` to disable borders on polygons or circles. */
	stroke: true,

	/** Stroke color */
	color: '#3388ff',

	/** Stroke width in pixels */
	weight: 3,

	/** Stroke opacity */
	opacity: 1,

	/**
	 * A string that defines [shape to be used at the
	 * end](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linecap) of the stroke.
	 * @type {'butt' | 'round' | 'square'}
	 */
	lineCap: 'round',

	/**
	 * A string that defines [shape to be used at the
	 * corners](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-linejoin) of the stroke.
	 * @type {'miter' | 'round' | 'bevel'}
	 */
	lineJoin: 'round',

	/**
	 * A string (or an array of numbers) that defines the stroke [dash
	 * pattern](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dasharray).
	 * @type {string | number[] | null}
	 */
	dashArray: null,

	/**
	 * A string that defines the [distance into the dash pattern to start the
	 * dash](https://developer.mozilla.org/docs/Web/SVG/Attribute/stroke-dashoffset).
	 * @type {string | null}
	 */
	dashOffset: null,

	/** Whether to fill the path with color. Set it to `false` to disable filling on polygons or circles. */
	fill: false,

	/**
	 * Fill color. Defaults to the value of the [`color`](#path-color) option.
	 * @type {string | null}
	 */
	fillColor: null,

	/** Fill opacity. */
	fillOpacity: 0.2,

	/**
	 * A string that defines [how the inside of a
	 * shape](https://developer.mozilla.org/docs/Web/SVG/Attribute/fill-rule) is determined.
	 * @type {'nonzero' | 'evenodd'}
	 */
	fillRule: 'evenodd',

	// Option inherited from "Interactive layer" abstract class
	interactive: true,

	/**
	 * When `true`, a pointer event on this path will trigger the same event on the map
	 * (unless [`DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
	 */
	bubblingPointerEvents: true,

	/**
	 * Use this specific instance of `Renderer` for this path. If not set, the path uses the map's
	 * [renderer](#map-renderer), which is `SVG` by default. If set, it overrides the `pane` option.
	 * @type {Renderer | undefined}
	 */
	renderer: undefined
};

/** @typedef {typeof defaultOptions} PathDefaults */

/**
 * An abstract class that contains options and constants shared between vector overlays (Polygon, Polyline,
 * Circle). Do not use it directly. Extends `Layer`.
 * @template {PathOptions} [O=PathOptions]
 * @template {InteractiveLayerEventMap} [E=InteractiveLayerEventMap]
 * @extends {Layer<O, E>}
 */
export class Path extends Layer {

	/** @type {Defaults<PathOptions>} */
	static defaultOptions = defaultOptions;

	/** @param {LeafletMap} map */
	beforeAdd(map) {
		// Renderer is set here because we need to call renderer.getEvents
		// before this.getEvents.
		/** @type {Renderer} */
		this._renderer = map.getRenderer(this);
	}

	onAdd() {
		this._renderer._initPath(this);
		this._reset();
		this._renderer._addPath(this);
	}

	onRemove() {
		this._renderer._removePath(this);
	}

	/**
	 * Redraws the layer. Sometimes useful after you changed the coordinates that the path uses.
	 * @returns {this}
	 */
	redraw() {
		if (this._map) {
			this._renderer._updatePath(this);
		}
		return this;
	}

	/**
	 * Changes the appearance of a Path based on the options in the `Path options` object. Note that
	 * [`className`](#path-classname) is an exception: it is applied only when the path element is created,
	 * so passing it here updates the option but leaves the element's class unchanged.
	 * @param {Partial<O>} style
	 * @returns {this}
	 */
	setStyle(style) {
		Util.setOptions(this, style);
		if (this._renderer) {
			this._renderer._updateStyle(this);
			if (this.options.stroke && style && Object.hasOwn(style, 'weight')) {
				this._updateBounds();
			}
		}
		return this;
	}

	/**
	 * Brings the layer to the top of all path layers.
	 * @returns {this}
	 */
	bringToFront() {
		this._renderer?._bringToFront(this);
		return this;
	}

	/**
	 * Brings the layer to the bottom of all path layers.
	 * @returns {this}
	 */
	bringToBack() {
		this._renderer?._bringToBack(this);
		return this;
	}

	/**
	 * Returns the SVG element of the path, or `undefined` when it's drawn on a `Canvas`.
	 * @returns {SVGElement | undefined}
	 */
	getElement() {
		return this._path;
	}

	/**
	 * @param {Partial<RendererOptions>} [options]
	 * @returns {Renderer}
	 */
	_createRenderer(options) {
		return new SVG(options);
	}

	// popups open where the path was clicked, so another click moves them
	_togglesPopupOnClick() {
		return false;
	}

	_reset() {
		// defined in child classes
		this._project();
		this._update();
	}

	_clickTolerance() {
		// used when doing hit detection for Canvas layers
		return (this.options.stroke ? this.options.weight / 2 : 0) +
		  (/** @type {Partial<CanvasOptions>} */ (this._renderer.options).tolerance || 0);
	}
}

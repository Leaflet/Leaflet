// @ts-check
import {Layer} from './Layer.js';
import * as Util from '../core/Util.js';
import {LatLngBounds} from '../geo/LatLngBounds.js';
import {Bounds} from '../geometry/Bounds.js';
import * as DomUtil from '../dom/DomUtil.js';

/** @import {Defaults, ImageOverlayEventMap, ImageOverlayOptions, LatLngBoundsExpression, LeafletEvent,
 *    ZoomAnimEvent} from '../types.js' */
/** @import {LatLng} from '../geo/LatLng.js' */

const defaultOptions = {
	/** The opacity of the image overlay. */
	opacity: 1,

	/** Text for the `alt` attribute of the image (useful for accessibility). */
	alt: '',

	/** If `true`, the image overlay will emit [pointer events](#interactive-layer) when clicked or hovered. */
	interactive: false,

	/**
	 * Whether the crossOrigin attribute will be added to the image. If a String is provided, the image will have
	 * its crossOrigin attribute set to the String provided. This is needed if you want to access image pixel data.
	 * Refer to [CORS Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid
	 * String values.
	 * @type {boolean | string}
	 */
	crossOrigin: false,

	/** URL to the overlay image to show in place of the overlay that failed to load. */
	errorOverlayUrl: '',

	/**
	 * The explicit [zIndex](https://developer.mozilla.org/docs/Web/CSS/CSS_Positioning/Understanding_z_index)
	 * of the overlay layer.
	 */
	zIndex: 1,

	/** A custom class name to assign to the image. Empty by default. */
	className: '',

	/**
	 * Tells the browser whether to decode the image in a synchronous fashion, as per the [`decoding`
	 * HTML attribute](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/decoding). If
	 * the image overlay is flickering when being added/removed, set this option to `'sync'`.
	 * @type {'sync' | 'async' | 'auto'}
	 */
	decoding: 'auto'
};

/** @typedef {typeof defaultOptions} ImageOverlayDefaults */

/**
 * @typedef {Object} ImageOverlayEvents
 * @property {LeafletEvent} load Fired when the ImageOverlay layer has loaded its image.
 * @property {LeafletEvent} error Fired when the ImageOverlay layer fails to load its image.
 */

/**
 * Used to load and display a single image over specific bounds of the map. Extends `Layer`.
 * @example
 * ```js
 * const imageUrl = 'https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
 * 	imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
 * new ImageOverlay(imageUrl, imageBounds).addTo(map);
 * ```
 * @template {ImageOverlayOptions} [O=ImageOverlayOptions]
 * @template {ImageOverlayEventMap} [E=ImageOverlayEventMap]
 * @template {HTMLElement | SVGElement} [El=HTMLImageElement] the overlay's element
 * @template [S=string | El] what the overlay is created from
 * @extends {Layer<O, E>}
 */
export class ImageOverlay extends Layer {

	static initHooks = true;

	/** @type {Defaults<ImageOverlayOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Instantiates an image overlay object given the URL of the image (or an image element) and the geographical
	 * bounds it is tied to.
	 * @param {NoInfer<S>} url
	 * @param {LatLngBoundsExpression} bounds
	 * @param {Partial<O>} [options]
	 */
	constructor(url, bounds, options) {
		super();

		/** @type {S | string} */
		this._url = url;
		this._bounds = new LatLngBounds(bounds);

		Util.setOptions(this, options);

		this.callInitHooks();
	}

	onAdd() {
		if (!this._image) {
			this._initImage();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}

		if (this.options.interactive) {
			this._image.classList.add('leaflet-interactive');
			this.addInteractiveTarget(this._image);
		}

		this.getPane().appendChild(this._image);
		this._reset();
	}

	onRemove() {
		this._image.remove();
		if (this.options.interactive) {
			this.removeInteractiveTarget(this._image);
		}
	}

	/**
	 * Sets the opacity of the overlay.
	 * @param {number} opacity
	 * @returns {this}
	 */
	setOpacity(opacity) {
		this.options.opacity = opacity;

		if (this._image) {
			this._updateOpacity();
		}
		return this;
	}

	/**
	 * @param {{opacity?: number}} styleOpts
	 * @returns {this}
	 */
	setStyle(styleOpts) {
		if (styleOpts.opacity) {
			this.setOpacity(styleOpts.opacity);
		}
		return this;
	}

	/**
	 * Brings the layer to the top of all overlays.
	 * @returns {this}
	 */
	bringToFront() {
		if (this._map) {
			DomUtil.toFront(this._image);
		}
		return this;
	}

	/**
	 * Brings the layer to the bottom of all overlays.
	 * @returns {this}
	 */
	bringToBack() {
		if (this._map) {
			DomUtil.toBack(this._image);
		}
		return this;
	}

	/**
	 * Changes the URL of the image.
	 * @param {string} url
	 * @returns {this}
	 */
	setUrl(url) {
		this._url = url;

		if (this._image) {
			/** @type {HTMLImageElement} */ (this._image).src = url;
		}
		return this;
	}

	/**
	 * Update the bounds that this ImageOverlay covers.
	 * @param {LatLngBoundsExpression} bounds
	 * @returns {this}
	 */
	setBounds(bounds) {
		this._bounds = new LatLngBounds(bounds);

		if (this._map) {
			this._reset();
		}
		return this;
	}

	getEvents() {
		return {
			zoom: this._reset,
			viewreset: this._reset,
			zoomanim: this._animateZoom
		};
	}

	/**
	 * Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
	 * @param {number} value
	 * @returns {this}
	 */
	setZIndex(value) {
		this.options.zIndex = value;
		this._updateZIndex();
		return this;
	}

	/**
	 * Get the bounds that this ImageOverlay covers.
	 * @returns {LatLngBounds}
	 */
	getBounds() {
		return this._bounds;
	}

	/**
	 * Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
	 * used by this overlay (for `VideoOverlay` and `SVGOverlay`, their `<video>` or `<svg>` element).
	 * @returns {El}
	 */
	getElement() {
		return this._image;
	}

	_initImage() {
		const url = /** @type {string | HTMLImageElement} */ (this._url),
		wasElementSupplied = url instanceof HTMLImageElement,
		img = wasElementSupplied ? url : DomUtil.create('img');

		/** @type {El} */
		this._image = /** @type {any} */ (img);

		img.classList.add('leaflet-image-layer', 'leaflet-zoom-animated');
		if (this.options.className) { img.classList.add(...Util.splitWords(this.options.className)); }

		img.onload = this.fire.bind(this, 'load');
		img.onerror = this._overlayOnError.bind(this);

		if (this.options.crossOrigin || this.options.crossOrigin === '') {
			// the DOM types leave out '', which is how the attribute spells 'anonymous'
			img.crossOrigin = /** @type {HTMLImageElement['crossOrigin']} */ (this.options.crossOrigin === true ? '' : this.options.crossOrigin);
		}

		img.decoding = this.options.decoding;

		if (this.options.zIndex) {
			this._updateZIndex();
		}

		if (wasElementSupplied) {
			this._url = img.src;
			return;
		}

		img.src = url;
		img.alt = this.options.alt;
	}

	/** @param {ZoomAnimEvent} e */
	_animateZoom(e) {
		const scale = this._map.getZoomScale(e.zoom),
		offset = this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center);

		DomUtil.setTransform(this._image, offset, scale);
	}

	_reset() {
		const image = this._image,
		bounds = new Bounds(
			this._map.latLngToLayerPoint(this._bounds.getNorthWest())._round(),
			this._map.latLngToLayerPoint(this._bounds.getSouthEast())._round()),
		size = bounds.getSize();

		DomUtil.setPosition(image, bounds.min);

		image.style.width  = `${size.x}px`;
		image.style.height = `${size.y}px`;
	}

	_updateOpacity() {
		this._image.style.opacity = `${this.options.opacity}`;
	}

	_updateZIndex() {
		if (this._image && this.options.zIndex !== undefined && this.options.zIndex !== null) {
			this._image.style.zIndex = `${this.options.zIndex}`;
		}
	}

	_overlayOnError() {
		this.fire('error');

		const errorUrl = this.options.errorOverlayUrl;
		if (errorUrl && this._url !== errorUrl) {
			this._url = errorUrl;
			/** @type {HTMLImageElement} */ (this._image).src = errorUrl;
		}
	}

	/**
	 * Returns the center of the ImageOverlay.
	 * @returns {LatLng}
	 */
	getCenter() {
		return this._bounds.getCenter();
	}
}

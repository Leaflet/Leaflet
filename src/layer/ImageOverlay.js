import {Layer} from './Layer.js';
import * as Util from '../core/Util.js';
import {LatLngBounds} from '../geo/LatLngBounds.js';
import {Point} from '../geometry/Point.js';
import * as DomUtil from '../dom/DomUtil.js';

/** @import {Defaults, ImageOverlayDefaults, ImageOverlayEventMap, ImageOverlayOptions, LatLngBoundsExpression,
 *    LeafletEvent} from '../types.js' */
/** @import {LatLng} from '../geo/LatLng.js' */
/** @import {LeafletMap} from '../map/Map.js' */

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
	decoding: 'auto',

	/**
	 * How much to extend the clip area around the map view (relative to its size), e.g. 0.5 would be 50% of map
	 * view in each direction. Higher values show less of the overlay's clipped edges when panning or zooming out,
	 * but use more memory, which can crash mobile browsers with many overlays.
	 */
	padding: 0.5
};

/** @typedef {typeof defaultOptions} ImageOverlayDefaultsValues */

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
 * @extends {Layer<O & ImageOverlayDefaults, E>}
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
	 * @param {NoInfer<Partial<O>>} [options]
	 */
	constructor(url, bounds, options) {
		super();

		/** @type {S | string} */
		this._url = url;
		this._bounds = new LatLngBounds(bounds);

		Util.setOptions(this, options);

		this.callInitHooks();
	}

	/** @param {LeafletMap} map */
	onAdd(map) {
		if (!this._image) {
			this._initImage();

			// clips the element to the view, so the browser never composites an element far larger than the screen
			/** @type {HTMLDivElement} */
			this._clip = DomUtil.create('div', 'leaflet-image-layer-clip leaflet-zoom-animated');
			this._clip.append(this._image);
			this._updateZIndex();

			if (this.options.opacity < 1) {
				this._updateOpacity();
			}
		}

		if (this.options.interactive) {
			this._image.classList.add('leaflet-interactive');
			this.addInteractiveTarget(this._image);
		}

		this.getPane().append(this._clip);
		this._reset();
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		this._clip.remove();
		if (this.options.interactive) {
			this.removeInteractiveTarget(this._image);
		}
	}

	/**
	 * Sets the opacity of the overlay.
	 * @param {number} opacity
	 */
	setOpacity(opacity) {
		this.options.opacity = opacity;

		if (this._image) {
			this._updateOpacity();
		}
		return this;
	}

	/**
	 * Sets the opacity of the overlay from a style object, so that `FeatureGroup`'s `setStyle` applies to it too.
	 * @param {{opacity?: number}} styleOpts
	 */
	setStyle(styleOpts) {
		if (styleOpts.opacity != null) {
			this.setOpacity(styleOpts.opacity);
		}
		return this;
	}

	/** Brings the layer to the top of all overlays. */
	bringToFront() {
		if (this._map) {
			DomUtil.toFront(this._clip);
		}
		return this;
	}

	/** Brings the layer to the bottom of all overlays. */
	bringToBack() {
		if (this._map) {
			DomUtil.toBack(this._clip);
		}
		return this;
	}

	/**
	 * Changes the URL of the image.
	 * @param {string} url
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
			moveend: this._reset
		};
	}

	/**
	 * Changes the [zIndex](#imageoverlay-zindex) of the image overlay.
	 * @param {number} value
	 */
	setZIndex(value) {
		this.options.zIndex = value;
		this._updateZIndex();
		return this;
	}

	/** Get the bounds that this ImageOverlay covers. */
	getBounds() {
		return this._bounds;
	}

	/**
	 * Returns the instance of [`HTMLImageElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement)
	 * used by this overlay (for `VideoOverlay` and `SVGOverlay`, their `<video>` or `<svg>` element).
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

		img.classList.add('leaflet-image-layer');
		if (this.options.className) { img.classList.add(...Util.splitWords(this.options.className)); }

		img.onload = this.fire.bind(this, 'load');
		img.onerror = this._overlayOnError.bind(this);

		if (this.options.crossOrigin || this.options.crossOrigin === '') {
			// the DOM types leave out '', which is how the attribute spells 'anonymous'
			img.crossOrigin = /** @type {HTMLImageElement['crossOrigin']} */ (this.options.crossOrigin === true ? '' : this.options.crossOrigin);
		}

		img.decoding = this.options.decoding;

		if (wasElementSupplied) {
			this._url = img.src;
			return;
		}

		img.src = url;
		img.alt = this.options.alt;
	}

	_reset() {
		const image = this._image,
		clip = this._clip,
		map = this._map,
		min = map._snapLayerPoint(map.latLngToLayerPoint(this._bounds.getNorthWest())),
		max = map._snapLayerPoint(map.latLngToLayerPoint(this._bounds.getSouthEast())),
		size = map.getSize(),
		padding = this.options.padding,
		viewMin = map.containerPointToLayerPoint(size.multiplyBy(-padding)).round(),
		viewMax = viewMin.add(size.multiplyBy(1 + 2 * padding)).round(),
		clipMin = new Point(Math.max(min.x, viewMin.x), Math.max(min.y, viewMin.y)),
		clipMax = new Point(Math.min(max.x, viewMax.x), Math.min(max.y, viewMax.y));

		DomUtil.setPosition(clip, clipMin);
		clip.style.width  = `${Math.max(0, clipMax.x - clipMin.x)}px`;
		clip.style.height = `${Math.max(0, clipMax.y - clipMin.y)}px`;

		DomUtil.setPosition(image, min.subtract(clipMin), true);
		image.style.width  = `${max.x - min.x}px`;
		image.style.height = `${max.y - min.y}px`;
	}

	_updateOpacity() {
		this._image.style.opacity = `${this.options.opacity}`;
	}

	_updateZIndex() {
		if (this._clip && this.options.zIndex != null) {
			this._clip.style.zIndex = `${this.options.zIndex}`;
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

	/** Returns the center of the ImageOverlay. */
	getCenter() {
		return this._bounds.getCenter();
	}

	// like on paths, popups open where the overlay was clicked, so another click moves them
	_togglesPopupOnClick() {
		return false;
	}
}

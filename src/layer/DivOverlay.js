// @ts-check
import {LayerBase} from './LayerBase.js';
import * as Util from '../core/Util.js';
import {LatLng} from '../geo/LatLng.js';
import {Point} from '../geometry/Point.js';
import * as DomUtil from '../dom/DomUtil.js';

/** @import {Defaults, DivOverlayEventMap, DivOverlayOptions, LatLngExpression, LeafletEvent, PointExpression, ZoomAnimEvent} from '../types.js' */
/** @import {LatLngBounds} from '../geo/LatLngBounds.js' */
/** @import {LeafletMap} from '../map/Map.js' */
/** @import {Layer} from './Layer.js' */

/**
 * Content of a popup or tooltip: HTML, an element, or a function that gets the layer it's bound to and returns
 * either.
 * @typedef {string | HTMLElement | ((layer: Layer) => string | HTMLElement)} OverlayContent
 */

const defaultOptions = {
	/** If true, the popup/tooltip will listen to the pointer events. */
	interactive: false,

	/**
	 * The offset of the overlay position.
	 * @type {PointExpression}
	 */
	offset: [0, 0],

	/** A custom CSS class name to assign to the overlay. */
	className: '',

	/**
	 * Sets the HTML content of the overlay while initializing. If a function is passed the source layer will be
	 * passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
	 * String content is rendered as HTML; sanitize untrusted input or pass an `HTMLElement` with safe `textContent`
	 * instead.
	 * @type {OverlayContent}
	 */
	content: ''
};

/** @typedef {typeof defaultOptions} DivOverlayDefaults */

/**
 * @category DivOverlay events
 * @typedef {Object} DivOverlayEvents
 * @property {LeafletEvent} contentupdate Fired when the content of the overlay is updated
 */

/**
 * Base model for Popup and Tooltip. Inherit from it for custom overlays like plugins.
 * @template {DivOverlayOptions} [O=DivOverlayOptions]
 * @template {DivOverlayEventMap} [E=DivOverlayEventMap]
 * @extends {LayerBase<O, E>}
 */
export class DivOverlay extends LayerBase {

	static initHooks = true;

	/** @type {Defaults<DivOverlayOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Instantiates the overlay given an optional `options` object that describes its appearance and location and
	 * an optional `source` layer it's bound to.
	 * @overload
	 * @param {Partial<O>} [options]
	 * @param {Layer} [source]
	 */
	/**
	 * Instantiates the overlay given `latlng` where it will open and an optional `options` object that describes
	 * its appearance and location.
	 * @overload
	 * @param {LatLng | [number, number, number?]} latlng
	 * @param {Partial<O>} [options]
	 */
	/**
	 * @param {Partial<O> | LatLng | [number, number, number?]} [options]
	 * @param {any} [source]
	 */
	constructor(options, source) {
		super();

		if (options instanceof LatLng || Array.isArray(options)) {
			this._latlng = new LatLng(options);
			Util.setOptions(this, source);
		} else {
			Util.setOptions(this, options);
			/** @type {Layer | undefined} */
			this._source = source;
		}
		if (this.options.content) {
			/** @type {OverlayContent | undefined} */
			this._content = this.options.content;
		}

		this.callInitHooks();
	}

	/**
	 * Adds the overlay to the map. Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
	 * @param {LeafletMap} map
	 * @returns {this}
	 */
	openOn(map) {
		map = arguments.length ? map : /** @type {Layer} */ (this._source)._map; // experimental, not the part of public api
		if (!map.hasLayer(this)) {
			map.addLayer(this);
		}
		return this;
	}

	/**
	 * Closes the overlay. Alternative to `map.closePopup(popup)`/`.closeTooltip(tooltip)`
	 * and `layer.closePopup()`/`.closeTooltip()`.
	 * @returns {this}
	 */
	close() {
		this._map?.removeLayer(this);
		return this;
	}

	/**
	 * Opens or closes the overlay bound to layer depending on its current state. Argument may be omitted
	 * only for overlay bound to layer. Alternative to `layer.togglePopup()`/`.toggleTooltip()`.
	 * @param {Layer} [layer]
	 * @returns {this}
	 */
	toggle(layer) {
		if (this._map) {
			this.close();
		} else {
			if (arguments.length) {
				this._source = layer;
			} else {
				layer = this._source;
			}
			this._prepareOpen();

			// open the overlay on the map
			this.openOn(/** @type {Layer} */ (layer)._map);
		}
		return this;
	}

	/** @param {LeafletMap} map */
	onAdd(map) {
		if (!this._container) {
			this._initLayout();
		}

		if (map._fadeAnimated) {
			this._container.style.opacity = '0';
		}

		clearTimeout(this._removeTimeout);
		this.getPane().appendChild(this._container);
		this.update();

		if (map._fadeAnimated) {
			this._container.style.opacity = '1';
		}

		this.bringToFront();

		if (this.options.interactive) {
			this._container.classList.add('leaflet-interactive');
			this.addInteractiveTarget(this._container);
		}
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		if (map._fadeAnimated) {
			this._container.style.opacity = '0';
			/** @type {ReturnType<typeof setTimeout> | undefined} */
			this._removeTimeout = setTimeout(() => this._container.remove(), 200);
		} else {
			this._container.remove();
		}

		if (this.options.interactive) {
			this._container.classList.remove('leaflet-interactive');
			this.removeInteractiveTarget(this._container);
		}
	}

	/**
	 * Returns the geographical point of the overlay.
	 * @returns {LatLng | undefined}
	 */
	getLatLng() {
		return this._latlng;
	}

	/**
	 * Sets the geographical point where the overlay will open.
	 * @param {LatLngExpression} latlng
	 * @returns {this}
	 */
	setLatLng(latlng) {
		this._latlng = new LatLng(latlng);
		if (this._map) {
			this._updatePosition();
			this._adjustPan();
		}
		return this;
	}

	/**
	 * Returns the content of the overlay.
	 * @returns {OverlayContent | undefined}
	 */
	getContent() {
		return this._content;
	}

	/**
	 * Sets the HTML content of the overlay. A `String` argument is rendered as HTML; if it may contain
	 * untrusted input, sanitize it (e.g. with DOMPurify) or pass an `HTMLElement` with safe `textContent`
	 * instead. If a function is passed the source layer will be passed to the function. The function
	 * should return a `String` or `HTMLElement` to be used in the overlay.
	 * @param {OverlayContent} content
	 * @returns {this}
	 */
	setContent(content) {
		this._content = content;
		this.update();
		return this;
	}

	/**
	 * Returns the HTML container of the overlay.
	 * @returns {HTMLElement | undefined}
	 */
	getElement() {
		return this._container;
	}

	/**
	 * Updates the overlay content, layout and position. Useful for updating
	 * the overlay after something inside changed, e.g. image loaded.
	 */
	update() {
		if (!this._map) { return; }

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	}

	/** @returns {{[type: string]: (e: any) => void}} */
	getEvents() {
		return {
			zoom: this._updatePosition,
			viewreset: this._updatePosition,
			zoomanim: this._animateZoom
		};
	}

	/**
	 * Returns `true` when the overlay is visible on the map.
	 * @returns {boolean}
	 */
	isOpen() {
		return !!this._map && this._map.hasLayer(this);
	}

	/**
	 * Brings this overlay in front of other overlays (in the same map pane).
	 * @returns {this}
	 */
	bringToFront() {
		if (this._map) {
			DomUtil.toFront(this._container);
		}
		return this;
	}

	/**
	 * Brings this overlay to the back of other overlays (in the same map pane).
	 * @returns {this}
	 */
	bringToBack() {
		if (this._map) {
			DomUtil.toBack(this._container);
		}
		return this;
	}

	// prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
	/** @param {LatLngExpression} [latlng] */
	_prepareOpen(latlng) {
		const layer = /** @type {Layer} */ (this._source);
		if (!layer._map) { return false; }

		const source = /** @type {Layer & {getCenter?: () => LatLng, getLatLng?: () => LatLng,
			getBounds?: () => LatLngBounds} | undefined} */ (layer._getOverlaySource());
		if (!source) { return false; } // Unable to get source layer.
		this._source = source;

		if (!latlng) {
			if (source.getCenter) {
				latlng = source.getCenter();
			} else if (source.getLatLng) {
				latlng = source.getLatLng();
			} else if (source.getBounds) {
				latlng = source.getBounds().getCenter();
			} else {
				throw new Error('Unable to get source layer LatLng.');
			}
		}
		this.setLatLng(latlng);

		if (this._map) {
			// update the overlay (content, layout, etc...)
			this.update();
		}

		return true;
	}

	_updateContent() {
		if (!this._content) { return; }

		const node = this._contentNode;
		// a standalone overlay passes itself
		const content = (typeof this._content === 'function') ?
			this._content(this._source ?? /** @type {any} */ (this)) : this._content;

		if (typeof content === 'string') {
			node.innerHTML = content;
		} else {
			while (node.hasChildNodes()) {
				node.removeChild(/** @type {ChildNode} */ (node.firstChild));
			}
			node.appendChild(content);
		}

		this.fire('contentupdate');
	}

	_updatePosition() {
		if (!this._map) { return; }

		const pos = this._map.latLngToLayerPoint(/** @type {LatLng} */ (this._latlng))._round(),
		offset = new Point(this.options.offset);

		DomUtil.setPosition(this._container, pos.add(this._getAnchor()));

		const bottom = this._containerBottom = -offset.y,
		left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

		// bottom position the overlay in case the height of the overlay changes (images loading etc)
		this._container.style.bottom = `${bottom}px`;
		this._container.style.left = `${left}px`;
	}

	/** @returns {PointExpression} */
	_getAnchor() {
		return [0, 0];
	}

}

import {LayerBase} from './LayerBase.js';
import * as Util from '../core/Util.js';
import {LatLng} from '../geo/LatLng.js';
import {Point} from '../geometry/Point.js';
import * as DomUtil from '../dom/DomUtil.js';

const defaultOptions = {
	/** If true, the popup/tooltip will listen to the pointer events. */
	interactive: false,

	/** The offset of the overlay position. */
	offset: [0, 0],

	/** A custom CSS class name to assign to the overlay. */
	className: '',

	/**
	 * `Map pane` where the overlay will be added.
	 * @type {string}
	 */
	pane: undefined,

	/**
	 * Sets the HTML content of the overlay while initializing. If a function is passed the source layer will be
	 * passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
	 * String content is rendered as HTML; sanitize untrusted input or pass an `HTMLElement` with safe `textContent`
	 * instead.
	 */
	content: ''
};

/**
 * DivOverlay events
 * @typedef {Object} DivOverlayDivOverlayEvents
 * @property {LeafletEvent} contentupdate Fired when the content of the overlay is updated
 */

/**
 * Base model for Popup and Tooltip. Inherit from it for custom overlays like plugins.
 * @todo inherits Interactive layer
 */
export class DivOverlay extends LayerBase {

	static initHooks = true;

	static defaultOptions = defaultOptions;

	constructor(options, source) {
		super();

		if (options instanceof LatLng || Array.isArray(options)) {
			this._latlng = new LatLng(options);
			Util.setOptions(this, source);
		} else {
			Util.setOptions(this, options);
			this._source = source;
		}
		if (this.options.content) {
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
		map = arguments.length ? map : this._source._map; // experimental, not the part of public api
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
			this.openOn(layer._map);
		}
		return this;
	}

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

	onRemove(map) {
		if (map._fadeAnimated) {
			this._container.style.opacity = '0';
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
	 * @returns {LatLng}
	 */
	getLatLng() {
		return this._latlng;
	}

	/**
	 * Sets the geographical point where the overlay will open.
	 * @param {LatLng} latlng
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
	 * @returns {string | HTMLElement | Function}
	 */
	getContent() {
		return this._content;
	}

	/**
	 * Sets the HTML content of the overlay. A `String` argument is rendered as HTML; if it may contain
	 * untrusted input, sanitize it (e.g. with DOMPurify) or pass an `HTMLElement` with safe `textContent`
	 * instead. If a function is passed the source layer will be passed to the function. The function
	 * should return a `String` or `HTMLElement` to be used in the overlay.
	 * @param {string | HTMLElement | Function} htmlContent
	 * @returns {this}
	 */
	setContent(content) {
		this._content = content;
		this.update();
		return this;
	}

	/**
	 * Returns the HTML container of the overlay.
	 * @returns {HTMLElement}
	 */
	getElement() {
		return this._container;
	}

	/**
	 * Updates the overlay content, layout and position. Useful for updating
	 * the overlay after something inside changed, e.g. image loaded.
	 * @returns {null}
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
	_prepareOpen(latlng) {
		if (!this._source._map) { return false; }

		const source = this._source._getOverlaySource();
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
		const content = (typeof this._content === 'function') ? this._content(this._source ?? this) : this._content;

		if (typeof content === 'string') {
			node.innerHTML = content;
		} else {
			while (node.hasChildNodes()) {
				node.removeChild(node.firstChild);
			}
			node.appendChild(content);
		}

		this.fire('contentupdate');
	}

	_updatePosition() {
		if (!this._map) { return; }

		const pos = this._map.latLngToLayerPoint(this._latlng)._round(),
		offset = new Point(this.options.offset);

		DomUtil.setPosition(this._container, pos.add(this._getAnchor()));

		const bottom = this._containerBottom = -offset.y,
		left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

		// bottom position the overlay in case the height of the overlay changes (images loading etc)
		this._container.style.bottom = `${bottom}px`;
		this._container.style.left = `${left}px`;
	}

	_getAnchor() {
		return [0, 0];
	}

}

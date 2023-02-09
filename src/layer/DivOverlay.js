import {Map} from '../map/Map.js';
import {Layer} from './Layer.js';
import {FeatureGroup} from './FeatureGroup.js';
import * as Util from '../core/Util.js';
import {toLatLng, LatLng} from '../geo/LatLng.js';
import {toPoint} from '../geometry/Point.js';
import * as DomUtil from '../dom/DomUtil.js';

/*
 * @class DivOverlay
 * @inherits Interactive layer
 * @aka L.DivOverlay
 * Base model for L.Popup and L.Tooltip. Inherit from it for custom overlays like plugins.
 */

// @namespace DivOverlay
export const DivOverlay = Layer.extend({

	// @section
	// @aka DivOverlay options
	options: {
		// @option interactive: Boolean = false
		// If true, the popup/tooltip will listen to the mouse events.
		interactive: false,

		// @option offset: Point = Point(0, 0)
		// The offset of the overlay position.
		offset: [0, 0],

		// @option className: String = ''
		// A custom CSS class name to assign to the overlay.
		className: '',

		// @option pane: String = undefined
		// `Map pane` where the overlay will be added.
		pane: undefined,

		// @option content: String|HTMLElement|Function = ''
		// Sets the HTML content of the overlay while initializing. If a function is passed the source layer will be
		// passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
		content: ''
	},

	initialize(options, source) {
		if (options && (options instanceof LatLng || Array.isArray(options))) {
			this._latlng = toLatLng(options);
			Util.setOptions(this, source);
		} else {
			Util.setOptions(this, options);
			this._source = source;
		}
		if (this.options.content) {
			this._content = this.options.content;
		}
	},

	// @method openOn(map: Map): this
	// Adds the overlay to the map.
	// Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
	openOn(map) {
		map = arguments.length ? map : this._source._map; // experimental, not the part of public api
		if (!map.hasLayer(this)) {
			map.addLayer(this);
		}
		return this;
	},

	// @method close(): this
	// Closes the overlay.
	// Alternative to `map.closePopup(popup)`/`.closeTooltip(tooltip)`
	// and `layer.closePopup()`/`.closeTooltip()`.
	close() {
		if (this._map) {
			this._map.removeLayer(this);
		}
		return this;
	},

	// @method toggle(layer?: Layer): this
	// Opens or closes the overlay bound to layer depending on its current state.
	// Argument may be omitted only for overlay bound to layer.
	// Alternative to `layer.togglePopup()`/`.toggleTooltip()`.
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
	},

	onAdd(map) {
		this._zoomAnimated = map._zoomAnimated;

		if (!this._container) {
			this._initLayout();
		}

		if (map._fadeAnimated) {
			this._container.style.opacity = 0;
		}

		clearTimeout(this._removeTimeout);
		this.getPane().appendChild(this._container);
		this.update();

		if (map._fadeAnimated) {
			this._container.style.opacity = 1;
		}

		this.bringToFront();

		if (this.options.interactive) {
			this._container.classList.add('leaflet-interactive');
			this.addInteractiveTarget(this._container);
		}
	},

	onRemove(map) {
		if (map._fadeAnimated) {
			this._container.style.opacity = 0;
			this._removeTimeout = setTimeout(() => this._container.remove(), 200);
		} else {
			this._container.remove();
		}

		if (this.options.interactive) {
			this._container.classList.remove('leaflet-interactive');
			this.removeInteractiveTarget(this._container);
		}
	},

	// @namespace DivOverlay
	// @method getLatLng: LatLng
	// Returns the geographical point of the overlay.
	getLatLng() {
		return this._latlng;
	},

	// @method setLatLng(latlng: LatLng): this
	// Sets the geographical point where the overlay will open.
	setLatLng(latlng) {
		this._latlng = toLatLng(latlng);
		if (this._map) {
			this._updatePosition();
			this._adjustPan();
		}
		return this;
	},

	// @method getContent: String|HTMLElement
	// Returns the content of the overlay.
	getContent() {
		return this._content;
	},

	// @method setContent(htmlContent: String|HTMLElement|Function): this
	// Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
	// The function should return a `String` or `HTMLElement` to be used in the overlay.
	setContent(content) {
		this._content = content;
		this.update();
		return this;
	},

	// @method getElement: String|HTMLElement
	// Returns the HTML container of the overlay.
	getElement() {
		return this._container;
	},

	// @method update: null
	// Updates the overlay content, layout and position. Useful for updating the overlay after something inside changed, e.g. image loaded.
	update() {
		if (!this._map) { return; }

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	},

	getEvents() {
		const events = {
			zoom: this._updatePosition,
			viewreset: this._updatePosition
		};

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}
		return events;
	},

	// @method isOpen: Boolean
	// Returns `true` when the overlay is visible on the map.
	isOpen() {
		return !!this._map && this._map.hasLayer(this);
	},

	// @method bringToFront: this
	// Brings this overlay in front of other overlays (in the same map pane).
	bringToFront() {
		if (this._map) {
			DomUtil.toFront(this._container);
		}
		return this;
	},

	// @method bringToBack: this
	// Brings this overlay to the back of other overlays (in the same map pane).
	bringToBack() {
		if (this._map) {
			DomUtil.toBack(this._container);
		}
		return this;
	},

	// prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
	_prepareOpen(latlng) {
		let source = this._source;
		if (!source._map) { return false; }

		if (source instanceof FeatureGroup) {
			source = null;
			const layers = this._source._layers;
			for (const id in layers) {
				if (layers[id]._map) {
					source = layers[id];
					break;
				}
			}
			if (!source) { return false; } // Unable to get source layer.

			// set overlay source to this layer
			this._source = source;
		}

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
	},

	_updateContent() {
		if (!this._content) { return; }

		const node = this._contentNode;
		const content = (typeof this._content === 'function') ? this._content(this._source || this) : this._content;

		if (typeof content === 'string') {
			node.innerHTML = content;
		} else {
			while (node.hasChildNodes()) {
				node.removeChild(node.firstChild);
			}
			node.appendChild(content);
		}

		// @namespace DivOverlay
		// @section DivOverlay events
		// @event contentupdate: Event
		// Fired when the content of the overlay is updated
		this.fire('contentupdate');
	},

	_updatePosition() {
		if (!this._map) { return; }

		const pos = this._map.latLngToLayerPoint(this._latlng),
		      anchor = this._getAnchor();
		let offset = toPoint(this.options.offset);

		if (this._zoomAnimated) {
			DomUtil.setPosition(this._container, pos.add(anchor));
		} else {
			offset = offset.add(pos).add(anchor);
		}

		const bottom = this._containerBottom = -offset.y,
		    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

		// bottom position the overlay in case the height of the overlay changes (images loading etc)
		this._container.style.bottom = `${bottom}px`;
		this._container.style.left = `${left}px`;
	},

	_getAnchor() {
		return [0, 0];
	}

});

Map.include({
	_initOverlay(OverlayClass, content, latlng, options) {
		let overlay = content;
		if (!(overlay instanceof OverlayClass)) {
			overlay = new OverlayClass(options).setContent(content);
		}
		if (latlng) {
			overlay.setLatLng(latlng);
		}
		return overlay;
	}
});


Layer.include({
	_initOverlay(OverlayClass, old, content, options) {
		let overlay = content;
		if (overlay instanceof OverlayClass) {
			Util.setOptions(overlay, options);
			overlay._source = this;
		} else {
			overlay = (old && !options) ? old : new OverlayClass(options, this);
			overlay.setContent(content);
		}
		return overlay;
	}
});

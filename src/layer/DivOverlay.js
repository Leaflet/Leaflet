import {Map} from '../map/Map';
import {Layer} from './Layer';
import {FeatureGroup} from './FeatureGroup';
import * as Util from '../core/Util';
import {toLatLng} from '../geo/LatLng';
import {toPoint} from '../geometry/Point';
import * as DomUtil from '../dom/DomUtil';

/*
 * @class DivOverlay
 * @inherits Interactive layer
 * @aka L.DivOverlay
 * Base model for L.Popup and L.Tooltip. Inherit from it for custom overlays like plugins.
 */

// @namespace DivOverlay
export var DivOverlay = Layer.extend({

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
		pane: undefined
	},

	initialize: function (options, source) {
		Util.setOptions(this, options);

		this._source = source;
	},

	// @method openOn(map: Map): this
	// Adds the overlay to the map.
	// Alternative to `map.openPopup(popup)`/`.openTooltip(tooltip)`.
	openOn: function (map) {
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
	close: function () {
		if (this._map) {
			this._map.removeLayer(this);
		}
		return this;
	},

	// @method toggle(layer?: Layer): this
	// Opens or closes the overlay bound to layer depending on its current state.
	// Argument may be omitted only for overlay bound to layer.
	// Alternative to `layer.togglePopup()`/`.toggleTooltip()`.
	toggle: function (layer) {
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

	onAdd: function (map) {
		this._zoomAnimated = map._zoomAnimated;

		if (!this._container) {
			this._initLayout();
		}

		if (map._fadeAnimated) {
			DomUtil.setOpacity(this._container, 0);
		}

		clearTimeout(this._removeTimeout);
		this.getPane().appendChild(this._container);
		this.update();

		if (map._fadeAnimated) {
			DomUtil.setOpacity(this._container, 1);
		}

		this.bringToFront();

		if (this.options.interactive) {
			DomUtil.addClass(this._container, 'leaflet-interactive');
			this.addInteractiveTarget(this._container);
		}
	},

	onRemove: function (map) {
		if (map._fadeAnimated) {
			DomUtil.setOpacity(this._container, 0);
			this._removeTimeout = setTimeout(Util.bind(DomUtil.remove, undefined, this._container), 200);
		} else {
			DomUtil.remove(this._container);
		}

		if (this.options.interactive) {
			DomUtil.removeClass(this._container, 'leaflet-interactive');
			this.removeInteractiveTarget(this._container);
		}
	},

	// @namespace DivOverlay
	// @method getLatLng: LatLng
	// Returns the geographical point of the overlay.
	getLatLng: function () {
		return this._latlng;
	},

	// @method setLatLng(latlng: LatLng): this
	// Sets the geographical point where the overlay will open.
	setLatLng: function (latlng) {
		this._latlng = toLatLng(latlng);
		if (this._map) {
			this._updatePosition();
			this._adjustPan();
		}
		return this;
	},

	// @method getContent: String|HTMLElement
	// Returns the content of the overlay.
	getContent: function () {
		return this._content;
	},

	// @method setContent(htmlContent: String|HTMLElement|Function): this
	// Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function.
	// The function should return a `String` or `HTMLElement` to be used in the overlay.
	setContent: function (content) {
		this._content = content;
		this.update();
		return this;
	},

	// @method getElement: String|HTMLElement
	// Returns the HTML container of the overlay.
	getElement: function () {
		return this._container;
	},

	// @method update: null
	// Updates the overlay content, layout and position. Useful for updating the overlay after something inside changed, e.g. image loaded.
	update: function () {
		if (!this._map) { return; }

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	},

	getEvents: function () {
		var events = {
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
	isOpen: function () {
		return !!this._map && this._map.hasLayer(this);
	},

	// @method bringToFront: this
	// Brings this overlay in front of other overlays (in the same map pane).
	bringToFront: function () {
		if (this._map) {
			DomUtil.toFront(this._container);
		}
		return this;
	},

	// @method bringToBack: this
	// Brings this overlay to the back of other overlays (in the same map pane).
	bringToBack: function () {
		if (this._map) {
			DomUtil.toBack(this._container);
		}
		return this;
	},

	// prepare bound overlay to open: update latlng pos / content source (for FeatureGroup)
	_prepareOpen: function (latlng) {
		var source = this._source;
		if (!source._map) { return false; }

		if (source instanceof FeatureGroup) {
			source = null;
			var layers = this._source._layers;
			for (var id in layers) {
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

	_updateContent: function () {
		if (!this._content) { return; }

		var node = this._contentNode;
		var content = (typeof this._content === 'function') ? this._content(this._source || this) : this._content;

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

	_updatePosition: function () {
		if (!this._map) { return; }

		var pos = this._map.latLngToLayerPoint(this._latlng),
		    offset = toPoint(this.options.offset),
		    anchor = this._getAnchor();

		if (this._zoomAnimated) {
			DomUtil.setPosition(this._container, pos.add(anchor));
		} else {
			offset = offset.add(pos).add(anchor);
		}

		var bottom = this._containerBottom = -offset.y,
		    left = this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x;

		// bottom position the overlay in case the height of the overlay changes (images loading etc)
		this._container.style.bottom = bottom + 'px';
		this._container.style.left = left + 'px';
	},

	_getAnchor: function () {
		return [0, 0];
	}

});

Map.include({
	_initOverlay: function (OverlayClass, content, latlng, options) {
		var overlay = content;
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
	_initOverlay: function (OverlayClass, old, content, options) {
		var overlay = content;
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

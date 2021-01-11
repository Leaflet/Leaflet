import {Layer} from './Layer';
import {FeatureGroup} from './FeatureGroup';
import * as Util from '../core/Util';
import {toLatLng} from '../geo/LatLng';
import {toPoint} from '../geometry/Point';
import * as DomUtil from '../dom/DomUtil';

/*
 * @class DivOverlay
 * @inherits Layer
 * @aka L.DivOverlay
 * Base model for L.Popup and L.Tooltip. Inherit from it for custom overlays like plugins.
 */

// @namespace DivOverlay
export var DivOverlay = Layer.extend({

	// @section
	// @aka DivOverlay options
	options: {
		// @option offset: Point = Point(0, 7)
		// The offset of the overlay position. Useful to control the anchor
		// of the overlay when opening it on some overlays.
		offset: [0, 7],

		// @option className: String = ''
		// A custom CSS class name to assign to the overlay.
		className: '',

		// @option pane: String = 'popupPane'
		// `Map pane` where the overlay will be added.
		pane: 'popupPane',

		// @option content: String = ''
		// Sets the HTML content of the overlay while initializing. If a function is passed the source layer will be passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
		content: '',
	},

	initialize: function (options, source) {
		Util.setOptions(this, options);

		if (source instanceof L.LatLng || Util.isArray(source)) {
			this._latlng = toLatLng(source);
		} else {
			this._source = source;
		}
		if (this.options.content) {
			this._content = this.options.content;
		}
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
	},

	onRemove: function (map) {
		if (map._fadeAnimated) {
			DomUtil.setOpacity(this._container, 0);
			this._removeTimeout = setTimeout(Util.bind(DomUtil.remove, undefined, this._container), 200);
		} else {
			DomUtil.remove(this._container);
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
	// Sets the HTML content of the overlay. If a function is passed the source layer will be passed to the function. The function should return a `String` or `HTMLElement` to be used in the overlay.
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
	// Brings this overlay in front of other overlay (in the same map pane).
	bringToFront: function () {
		if (this._map) {
			DomUtil.toFront(this._container);
		}
		return this;
	},

	// @method bringToBack: this
	// Brings this overlay to the back of other overlay (in the same map pane).
	bringToBack: function () {
		if (this._map) {
			DomUtil.toBack(this._container);
		}
		return this;
	},

	_prepareOpen: function (parent, layer, latlng) {
		if (!(layer instanceof Layer)) {
			latlng = layer;
			layer = parent;
		}

		if (layer instanceof FeatureGroup) {
			for (var id in parent._layers) {
				layer = parent._layers[id];
				break;
			}
		}

		if (!latlng) {
			if (layer.getCenter) {
				latlng = layer.getCenter();
			} else if (layer.getLatLng) {
				latlng = layer.getLatLng();
			} else if (layer.getBounds) {
				latlng = layer.getBounds().getCenter();
			} else {
				throw new Error('Unable to get source layer LatLng.');
			}
		}

		// set overlay source to this layer
		this._source = layer;

		// update the overlay (content, layout, ect...)
		this.update();

		return latlng;
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
		if (!this._map || !this._latlng) { return; }

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

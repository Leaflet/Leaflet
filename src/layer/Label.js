/*
 * @class Label
 * @inherits PopupBase
 * @aka L.Label
 * Used to display small texts on top of map layers.
 *
 * @example
 *
 * ```js
 * marker.bindLabel("my label text").openLabel();
 * ```
 * Note about label offset. Leaflet takes two options in consideration
 * for computing label offseting:
 * - the `offset` Label option: it defaults to [6, -6], because the label
 *   tip is 6px width and height. Remember to change this value if you override
 *   the tip in CSS.
 * - the `labelAnchor` Icon option: this will only be considered for Marker. You
 *   should adapt this value if you use a custom icon.
 */


// @namespace Label
L.Label = L.PopupBase.extend({

	// @section
	// @aka Label options
	options: {
		// @option pane: String = 'labelPane'
		// `Map pane` where the label will be added.
		pane: 'labelPane',

		// @option offset: Point = Point(6, -6)
		// The offset of the label position. Update it if you customize the
		// label tip in CSS.
		offset: [6, -6],

		// @option direction: String = 'right'
		// Direction where to open the label. Possible values are: `right`, `left`,
		// `top`, `bottom`, `center`, `auto`.
		// `auto` will dynamicaly switch between `right` and `left` according to the label
		// position on the map.
		direction: 'right',

		// @option permanent: Boolean = false
		// Whether to open the label permanently or only on mouseover.
		permanent: false,

		// @option sticky: Boolean = false
		// If true, the label will follow the mouse instead of being fixed at the feature center.
		sticky: false,

		// @option interactive: Boolean = false
		// If true, the label will listen to the feature events.
		interactive: false,

		// @option opacity: Number = 1.0
		// Label container opacity.
		opacity: 0.8
	},

	onAdd: function (map) {
		L.PopupBase.prototype.onAdd.call(this, map);
		this.setOpacity(this.options.opacity);

		// @namespace Map
		// @section Label events
		// @event labelopen: LabelEvent
		// Fired when a label is opened in the map.
		map.fire('labelopen', {label: this});

		if (this._source) {
			// @namespace Layer
			// @section Label events
			// @event labelopen: LabelEvent
			// Fired when a label bound to this layer is opened.
			this._source.fire('labelopen', {label: this}, true);
		}
	},

	onRemove: function (map) {
		L.PopupBase.prototype.onRemove.call(this, map);

		// @namespace Map
		// @section Label events
		// @event labelclose: LabelEvent
		// Fired when a label in the map is closed.
		map.fire('labelclose', {label: this});

		if (this._source) {
			// @namespace Layer
			// @section Label events
			// @event labelclose: LabelEvent
			// Fired when a label bound to this layer is closed.
			this._source.fire('labelclose', {label: this}, true);
		}
	},

	_close: function () {
		if (this._map) {
			this._map.closeLabel(this);
		}
	},

	_initLayout: function () {
		var prefix = 'leaflet-label',
		    className = prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

		this._contentNode = this._container = L.DomUtil.create('div', className);
	},

	_updateLayout: function () {},

	_adjustPan: function () {},

	_updatePosition: function () {
		var map = this._map,
		    pos = map.latLngToLayerPoint(this._latlng),
		    container = this._container,
		    centerPoint = map.latLngToContainerPoint(map.getCenter()),
		    labelPoint = map.layerPointToContainerPoint(pos),
		    direction = this.options.direction,
		    labelWidth = container.offsetWidth,
		    labelHeight = container.offsetHeight,
		    offset = L.point(this.options.offset),
		    anchor = this._getAnchor();

		if (direction === 'top') {
			pos = pos.add(L.point(-labelWidth / 2, -labelHeight + offset.y + anchor.y));
		} else if (direction === 'bottom') {
			pos = pos.subtract(L.point(labelWidth / 2, offset.y));
		} else if (direction === 'center') {
			pos = pos.subtract(L.point(labelWidth / 2, labelHeight / 2 - anchor.y));
		} else if (direction === 'right' || direction === 'auto' && labelPoint.x < centerPoint.x) {
			direction = 'right';
			pos = pos.add([offset.x + anchor.x, anchor.y - labelHeight / 2]);
		} else {
			direction = 'left';
			pos = pos.subtract(L.point(offset.x + labelWidth + anchor.x, labelHeight / 2 - anchor.y));
		}

		L.DomUtil.removeClass(container, 'leaflet-label-right');
		L.DomUtil.removeClass(container, 'leaflet-label-left');
		L.DomUtil.removeClass(container, 'leaflet-label-top');
		L.DomUtil.removeClass(container, 'leaflet-label-bottom');
		L.DomUtil.addClass(container, 'leaflet-label-' + direction);
		L.DomUtil.setPosition(container, pos);
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._container) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	_animateZoom: function (e) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), offset;
		if (this.options.offset) {
			offset = L.point(this.options.offset);
			pos = pos.add(offset);
		}
		L.DomUtil.setPosition(this._container, pos);
	},

	_getAnchor: function () {
		// Where should we anchor the label on the source layer?
		return L.point(this._source._getLabelAnchor && !this.options.sticky ? this._source._getLabelAnchor() : [0, 0]);
	}

});

// @namespace Label
// @factory L.label(options?: Label options, source?: Layer)
// Instantiates a Label object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the label with a reference to the Layer to which it refers.
L.label = function (options, source) {
	return new L.Label(options, source);
};

// @namespace Map
// @section Methods for Layers and Controls
L.Map.include({

	// @method openLabel(label: Label): this
	// Opens the specified label.
	// @alternative
	// @method openLabel(content: String|HTMLElement, latlng: LatLng, options?: Label options): this
	// Creates a label with the specified content and options and open it.
	openLabel: function (label, latlng, options) {
		if (!(label instanceof L.Label)) {
			label = new L.Label(options).setContent(label);
		}

		if (latlng) {
			label.setLatLng(latlng);
		}

		if (this.hasLayer(label)) {
			return this;
		}

		return this.addLayer(label);
	},

	// @method closeLabel(label?: Label): this
	// Closes the label given as parameter.
	closeLabel: function (label) {
		if (label) {
			this.removeLayer(label);
		}
		return this;
	}

});

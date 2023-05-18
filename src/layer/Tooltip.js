import {DivOverlay} from './DivOverlay';
import {toPoint} from '../geometry/Point';
import {Map} from '../map/Map';
import {Layer} from './Layer';
import * as DomUtil from '../dom/DomUtil';
import * as DomEvent from '../dom/DomEvent';
import * as Util from '../core/Util';
import {FeatureGroup} from './FeatureGroup';

/*
 * @class Tooltip
 * @inherits DivOverlay
 * @aka L.Tooltip
 * Used to display small texts on top of map layers.
 *
 * @example
 * If you want to just bind a tooltip to marker:
 *
 * ```js
 * marker.bindTooltip("my tooltip text").openTooltip();
 * ```
 * Path overlays like polylines also have a `bindTooltip` method.
 *
 * A tooltip can be also standalone:
 *
 * ```js
 * var tooltip = L.tooltip()
 * 	.setLatLng(latlng)
 * 	.setContent('Hello world!<br />This is a nice tooltip.')
 * 	.addTo(map);
 * ```
 * or
 * ```js
 * var tooltip = L.tooltip(latlng, {content: 'Hello world!<br />This is a nice tooltip.'})
 * 	.addTo(map);
 * ```
 *
 *
 * Note about tooltip offset. Leaflet takes two options in consideration
 * for computing tooltip offsetting:
 * - the `offset` Tooltip option: it defaults to [0, 0], and it's specific to one tooltip.
 *   Add a positive x offset to move the tooltip to the right, and a positive y offset to
 *   move it to the bottom. Negatives will move to the left and top.
 * - the `tooltipAnchor` Icon option: this will only be considered for Marker. You
 *   should adapt this value if you use a custom icon.
 */


// @namespace Tooltip
export var Tooltip = DivOverlay.extend({

	// @section
	// @aka Tooltip options
	options: {
		// @option pane: String = 'tooltipPane'
		// `Map pane` where the tooltip will be added.
		pane: 'tooltipPane',

		// @option offset: Point = Point(0, 0)
		// Optional offset of the tooltip position.
		offset: [0, 0],

		// @option direction: String = 'auto'
		// Direction where to open the tooltip. Possible values are: `right`, `left`,
		// `top`, `bottom`, `center`, `auto`.
		// `auto` will dynamically switch between `right` and `left` according to the tooltip
		// position on the map.
		direction: 'auto',

		// @option permanent: Boolean = false
		// Whether to open the tooltip permanently or only on mouseover.
		permanent: false,

		// @option sticky: Boolean = false
		// If true, the tooltip will follow the mouse instead of being fixed at the feature center.
		sticky: false,

		// @option opacity: Number = 0.9
		// Tooltip container opacity.
		opacity: 0.9
	},

	onAdd: function (map) {
		DivOverlay.prototype.onAdd.call(this, map);
		this.setOpacity(this.options.opacity);

		// @namespace Map
		// @section Tooltip events
		// @event tooltipopen: TooltipEvent
		// Fired when a tooltip is opened in the map.
		map.fire('tooltipopen', {tooltip: this});

		if (this._source) {
			this.addEventParent(this._source);

			// @namespace Layer
			// @section Tooltip events
			// @event tooltipopen: TooltipEvent
			// Fired when a tooltip bound to this layer is opened.
			this._source.fire('tooltipopen', {tooltip: this}, true);
		}
	},

	onRemove: function (map) {
		DivOverlay.prototype.onRemove.call(this, map);

		// @namespace Map
		// @section Tooltip events
		// @event tooltipclose: TooltipEvent
		// Fired when a tooltip in the map is closed.
		map.fire('tooltipclose', {tooltip: this});

		if (this._source) {
			this.removeEventParent(this._source);

			// @namespace Layer
			// @section Tooltip events
			// @event tooltipclose: TooltipEvent
			// Fired when a tooltip bound to this layer is closed.
			this._source.fire('tooltipclose', {tooltip: this}, true);
		}
	},

	getEvents: function () {
		var events = DivOverlay.prototype.getEvents.call(this);

		if (!this.options.permanent) {
			events.preclick = this.close;
		}

		return events;
	},

	_initLayout: function () {
		var prefix = 'leaflet-tooltip',
		    className = prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

		this._contentNode = this._container = DomUtil.create('div', className);

		this._container.setAttribute('role', 'tooltip');
		this._container.setAttribute('id', 'leaflet-tooltip-' + Util.stamp(this));
	},

	_updateLayout: function () {},

	_adjustPan: function () {},

	_setPosition: function (pos) {
		var subX, subY,
		    map = this._map,
		    container = this._container,
		    centerPoint = map.latLngToContainerPoint(map.getCenter()),
		    tooltipPoint = map.layerPointToContainerPoint(pos),
		    direction = this.options.direction,
		    tooltipWidth = container.offsetWidth,
		    tooltipHeight = container.offsetHeight,
		    offset = toPoint(this.options.offset),
		    anchor = this._getAnchor();

		if (direction === 'top') {
			subX = tooltipWidth / 2;
			subY = tooltipHeight;
		} else if (direction === 'bottom') {
			subX = tooltipWidth / 2;
			subY = 0;
		} else if (direction === 'center') {
			subX = tooltipWidth / 2;
			subY = tooltipHeight / 2;
		} else if (direction === 'right') {
			subX = 0;
			subY = tooltipHeight / 2;
		} else if (direction === 'left') {
			subX = tooltipWidth;
			subY = tooltipHeight / 2;
		} else if (tooltipPoint.x < centerPoint.x) {
			direction = 'right';
			subX = 0;
			subY = tooltipHeight / 2;
		} else {
			direction = 'left';
			subX = tooltipWidth + (offset.x + anchor.x) * 2;
			subY = tooltipHeight / 2;
		}

		pos = pos.subtract(toPoint(subX, subY, true)).add(offset).add(anchor);

		DomUtil.removeClass(container, 'leaflet-tooltip-right');
		DomUtil.removeClass(container, 'leaflet-tooltip-left');
		DomUtil.removeClass(container, 'leaflet-tooltip-top');
		DomUtil.removeClass(container, 'leaflet-tooltip-bottom');
		DomUtil.addClass(container, 'leaflet-tooltip-' + direction);
		DomUtil.setPosition(container, pos);
	},

	_updatePosition: function () {
		var pos = this._map.latLngToLayerPoint(this._latlng);
		this._setPosition(pos);
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._container) {
			DomUtil.setOpacity(this._container, opacity);
		}
	},

	_animateZoom: function (e) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center);
		this._setPosition(pos);
	},

	_getAnchor: function () {
		// Where should we anchor the tooltip on the source layer?
		return toPoint(this._source && this._source._getTooltipAnchor && !this.options.sticky ? this._source._getTooltipAnchor() : [0, 0]);
	}

});

// @namespace Tooltip
// @factory L.tooltip(options?: Tooltip options, source?: Layer)
// Instantiates a `Tooltip` object given an optional `options` object that describes its appearance and location and an optional `source` object that is used to tag the tooltip with a reference to the Layer to which it refers.
// @alternative
// @factory L.tooltip(latlng: LatLng, options?: Tooltip options)
// Instantiates a `Tooltip` object given `latlng` where the tooltip will open and an optional `options` object that describes its appearance and location.
export var tooltip = function (options, source) {
	return new Tooltip(options, source);
};

// @namespace Map
// @section Methods for Layers and Controls
Map.include({

	// @method openTooltip(tooltip: Tooltip): this
	// Opens the specified tooltip.
	// @alternative
	// @method openTooltip(content: String|HTMLElement, latlng: LatLng, options?: Tooltip options): this
	// Creates a tooltip with the specified content and options and open it.
	openTooltip: function (tooltip, latlng, options) {
		this._initOverlay(Tooltip, tooltip, latlng, options)
		  .openOn(this);

		return this;
	},

	// @method closeTooltip(tooltip: Tooltip): this
	// Closes the tooltip given as parameter.
	closeTooltip: function (tooltip) {
		tooltip.close();
		return this;
	}

});

/*
 * @namespace Layer
 * @section Tooltip methods example
 *
 * All layers share a set of methods convenient for binding tooltips to it.
 *
 * ```js
 * var layer = L.Polygon(latlngs).bindTooltip('Hi There!').addTo(map);
 * layer.openTooltip();
 * layer.closeTooltip();
 * ```
 */

// @section Tooltip methods
Layer.include({

	// @method bindTooltip(content: String|HTMLElement|Function|Tooltip, options?: Tooltip options): this
	// Binds a tooltip to the layer with the passed `content` and sets up the
	// necessary event listeners. If a `Function` is passed it will receive
	// the layer as the first argument and should return a `String` or `HTMLElement`.
	bindTooltip: function (content, options) {

		if (this._tooltip && this.isTooltipOpen()) {
			this.unbindTooltip();
		}

		this._tooltip = this._initOverlay(Tooltip, this._tooltip, content, options);
		this._initTooltipInteractions();

		if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
			this.openTooltip();
		}

		return this;
	},

	// @method unbindTooltip(): this
	// Removes the tooltip previously bound with `bindTooltip`.
	unbindTooltip: function () {
		if (this._tooltip) {
			this._initTooltipInteractions(true);
			this.closeTooltip();
			this._tooltip = null;
		}
		return this;
	},

	_initTooltipInteractions: function (remove) {
		if (!remove && this._tooltipHandlersAdded) { return; }
		var onOff = remove ? 'off' : 'on',
		    events = {
			remove: this.closeTooltip,
			move: this._moveTooltip
		    };
		if (!this._tooltip.options.permanent) {
			events.mouseover = this._openTooltip;
			events.mouseout = this.closeTooltip;
			events.click = this._openTooltip;
			if (this._map) {
				this._addFocusListeners();
			} else {
				events.add = this._addFocusListeners;
			}
		} else {
			events.add = this._openTooltip;
		}
		if (this._tooltip.options.sticky) {
			events.mousemove = this._moveTooltip;
		}
		this[onOff](events);
		this._tooltipHandlersAdded = !remove;
	},

	// @method openTooltip(latlng?: LatLng): this
	// Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
	openTooltip: function (latlng) {
		if (this._tooltip) {
			if (!(this instanceof FeatureGroup)) {
				this._tooltip._source = this;
			}
			if (this._tooltip._prepareOpen(latlng)) {
				// open the tooltip on the map
				this._tooltip.openOn(this._map);

				if (this.getElement) {
					this._setAriaDescribedByOnLayer(this);
				} else if (this.eachLayer) {
					this.eachLayer(this._setAriaDescribedByOnLayer, this);
				}
			}
		}
		return this;
	},

	// @method closeTooltip(): this
	// Closes the tooltip bound to this layer if it is open.
	closeTooltip: function () {
		if (this._tooltip) {
			return this._tooltip.close();
		}
	},

	// @method toggleTooltip(): this
	// Opens or closes the tooltip bound to this layer depending on its current state.
	toggleTooltip: function () {
		if (this._tooltip) {
			this._tooltip.toggle(this);
		}
		return this;
	},

	// @method isTooltipOpen(): boolean
	// Returns `true` if the tooltip bound to this layer is currently open.
	isTooltipOpen: function () {
		return this._tooltip.isOpen();
	},

	// @method setTooltipContent(content: String|HTMLElement|Tooltip): this
	// Sets the content of the tooltip bound to this layer.
	setTooltipContent: function (content) {
		if (this._tooltip) {
			this._tooltip.setContent(content);
		}
		return this;
	},

	// @method getTooltip(): Tooltip
	// Returns the tooltip bound to this layer.
	getTooltip: function () {
		return this._tooltip;
	},

	_addFocusListeners: function () {
		if (this.getElement) {
			this._addFocusListenersOnLayer(this);
		} else if (this.eachLayer) {
			this.eachLayer(this._addFocusListenersOnLayer, this);
		}
	},

	_addFocusListenersOnLayer: function (layer) {
		var el = typeof layer.getElement === 'function' && layer.getElement();
		if (el) {
			DomEvent.on(el, 'focus', function () {
				this._tooltip._source = layer;
				this.openTooltip();
			}, this);
			DomEvent.on(el, 'blur', this.closeTooltip, this);
		}
	},

	_setAriaDescribedByOnLayer: function (layer) {
		var el = typeof layer.getElement === 'function' && layer.getElement();
		if (el) {
			el.setAttribute('aria-describedby', this._tooltip._container.id);
		}
	},


	_openTooltip: function (e) {
		if (!this._tooltip || !this._map) {
			return;
		}

		// If the map is moving, we will show the tooltip after it's done.
		if (this._map.dragging && this._map.dragging.moving() && !this._openOnceFlag) {
			this._openOnceFlag = true;
			var that = this;
			this._map.once('moveend', function () {
				that._openOnceFlag = false;
				that._openTooltip(e);
			});
			return;
		}

		this._tooltip._source = e.layer || e.target;

		this.openTooltip(this._tooltip.options.sticky ? e.latlng : undefined);
	},

	_moveTooltip: function (e) {
		var latlng = e.latlng, containerPoint, layerPoint;
		if (this._tooltip.options.sticky && e.originalEvent) {
			containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
			layerPoint = this._map.containerPointToLayerPoint(containerPoint);
			latlng = this._map.layerPointToLatLng(layerPoint);
		}
		this._tooltip.setLatLng(latlng);
	}
});

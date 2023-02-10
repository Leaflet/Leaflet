import {Layer} from '../Layer.js';
import {IconDefault} from './Icon.Default.js';
import * as Util from '../../core/Util.js';
import {toLatLng as latLng} from '../../geo/LatLng.js';
import {toPoint as point} from '../../geometry/Point.js';
import * as DomUtil from '../../dom/DomUtil.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {MarkerDrag} from './Marker.Drag.js';

/*
 * @class Marker
 * @inherits Interactive layer
 * @aka L.Marker
 * L.Marker is used to display clickable/draggable icons on the map. Extends `Layer`.
 *
 * @example
 *
 * ```js
 * L.marker([50.5, 30.5]).addTo(map);
 * ```
 */

export const Marker = Layer.extend({

	// @section
	// @aka Marker options
	options: {
		// @option icon: Icon = *
		// Icon instance to use for rendering the marker.
		// See [Icon documentation](#L.Icon) for details on how to customize the marker icon.
		// If not specified, a common instance of `L.Icon.Default` is used.
		icon: new IconDefault(),

		// Option inherited from "Interactive layer" abstract class
		interactive: true,

		// @option keyboard: Boolean = true
		// Whether the marker can be tabbed to with a keyboard and clicked by pressing enter.
		keyboard: true,

		// @option title: String = ''
		// Text for the browser tooltip that appear on marker hover (no tooltip by default).
		// [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
		title: '',

		// @option alt: String = 'Marker'
		// Text for the `alt` attribute of the icon image.
		// [Useful for accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
		alt: 'Marker',

		// @option zIndexOffset: Number = 0
		// By default, marker images zIndex is set automatically based on its latitude. Use this option if you want to put the marker on top of all others (or below), specifying a high value like `1000` (or high negative value, respectively).
		zIndexOffset: 0,

		// @option opacity: Number = 1.0
		// The opacity of the marker.
		opacity: 1,

		// @option riseOnHover: Boolean = false
		// If `true`, the marker will get on top of others when you hover the mouse over it.
		riseOnHover: false,

		// @option riseOffset: Number = 250
		// The z-index offset used for the `riseOnHover` feature.
		riseOffset: 250,

		// @option pane: String = 'markerPane'
		// `Map pane` where the markers icon will be added.
		pane: 'markerPane',

		// @option shadowPane: String = 'shadowPane'
		// `Map pane` where the markers shadow will be added.
		shadowPane: 'shadowPane',

		// @option bubblingMouseEvents: Boolean = false
		// When `true`, a mouse event on this marker will trigger the same event on the map
		// (unless [`L.DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
		bubblingMouseEvents: false,

		// @option autoPanOnFocus: Boolean = true
		// When `true`, the map will pan whenever the marker is focused (via
		// e.g. pressing `tab` on the keyboard) to ensure the marker is
		// visible within the map's bounds
		autoPanOnFocus: true,

		// @section Draggable marker options
		// @option draggable: Boolean = false
		// Whether the marker is draggable with mouse/touch or not.
		draggable: false,

		// @option autoPan: Boolean = false
		// Whether to pan the map when dragging this marker near its edge or not.
		autoPan: false,

		// @option autoPanPadding: Point = Point(50, 50)
		// Distance (in pixels to the left/right and to the top/bottom) of the
		// map edge to start panning the map.
		autoPanPadding: [50, 50],

		// @option autoPanSpeed: Number = 10
		// Number of pixels the map should pan by.
		autoPanSpeed: 10
	},

	/* @section
	 *
	 * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup methods](#Popup) like bindPopup() you can also use the following methods:
	 */

	initialize(latlng, options) {
		Util.setOptions(this, options);
		this._latlng = latLng(latlng);
	},

	onAdd(map) {
		this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

		if (this._zoomAnimated) {
			map.on('zoomanim', this._animateZoom, this);
		}

		this._initIcon();
		this.update();
	},

	onRemove(map) {
		if (this.dragging && this.dragging.enabled()) {
			this.options.draggable = true;
			this.dragging.removeHooks();
		}
		delete this.dragging;

		if (this._zoomAnimated) {
			map.off('zoomanim', this._animateZoom, this);
		}

		this._removeIcon();
		this._removeShadow();
	},

	getEvents() {
		return {
			zoom: this.update,
			viewreset: this.update
		};
	},

	// @method getLatLng: LatLng
	// Returns the current geographical position of the marker.
	getLatLng() {
		return this._latlng;
	},

	// @method setLatLng(latlng: LatLng): this
	// Changes the marker position to the given point.
	setLatLng(latlng) {
		const oldLatLng = this._latlng;
		this._latlng = latLng(latlng);
		this.update();

		// @event move: Event
		// Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
		return this.fire('move', {oldLatLng, latlng: this._latlng});
	},

	// @method setZIndexOffset(offset: Number): this
	// Changes the [zIndex offset](#marker-zindexoffset) of the marker.
	setZIndexOffset(offset) {
		this.options.zIndexOffset = offset;
		return this.update();
	},

	// @method getIcon: Icon
	// Returns the current icon used by the marker
	getIcon() {
		return this.options.icon;
	},

	// @method setIcon(icon: Icon): this
	// Changes the marker icon.
	setIcon(icon) {

		this.options.icon = icon;

		if (this._map) {
			this._initIcon();
			this.update();
		}

		if (this._popup) {
			this.bindPopup(this._popup, this._popup.options);
		}

		return this;
	},

	getElement() {
		return this._icon;
	},

	update() {

		if (this._icon && this._map) {
			const pos = this._map.latLngToLayerPoint(this._latlng).round();
			this._setPos(pos);
		}

		return this;
	},

	_initIcon() {
		const options = this.options,
		    classToAdd = `leaflet-zoom-${this._zoomAnimated ? 'animated' : 'hide'}`;

		const icon = options.icon.createIcon(this._icon);
		let addIcon = false;

		// if we're not reusing the icon, remove the old one and init new one
		if (icon !== this._icon) {
			if (this._icon) {
				this._removeIcon();
			}
			addIcon = true;

			if (options.title) {
				icon.title = options.title;
			}

			if (icon.tagName === 'IMG') {
				icon.alt = options.alt || '';
			}
		}

		icon.classList.add(classToAdd);

		if (options.keyboard) {
			icon.tabIndex = '0';
			icon.setAttribute('role', 'button');
		}

		this._icon = icon;

		if (options.riseOnHover) {
			this.on({
				mouseover: this._bringToFront,
				mouseout: this._resetZIndex
			});
		}

		if (this.options.autoPanOnFocus) {
			DomEvent.on(icon, 'focus', this._panOnFocus, this);
		}

		const newShadow = options.icon.createShadow(this._shadow);
		let addShadow = false;

		if (newShadow !== this._shadow) {
			this._removeShadow();
			addShadow = true;
		}

		if (newShadow) {
			newShadow.classList.add(classToAdd);
			newShadow.alt = '';
		}
		this._shadow = newShadow;


		if (options.opacity < 1) {
			this._updateOpacity();
		}


		if (addIcon) {
			this.getPane().appendChild(this._icon);
		}
		this._initInteraction();
		if (newShadow && addShadow) {
			this.getPane(options.shadowPane).appendChild(this._shadow);
		}
	},

	_removeIcon() {
		if (this.options.riseOnHover) {
			this.off({
				mouseover: this._bringToFront,
				mouseout: this._resetZIndex
			});
		}

		if (this.options.autoPanOnFocus) {
			DomEvent.off(this._icon, 'focus', this._panOnFocus, this);
		}

		this._icon.remove();
		this.removeInteractiveTarget(this._icon);

		this._icon = null;
	},

	_removeShadow() {
		if (this._shadow) {
			this._shadow.remove();
		}
		this._shadow = null;
	},

	_setPos(pos) {

		if (this._icon) {
			DomUtil.setPosition(this._icon, pos);
		}

		if (this._shadow) {
			DomUtil.setPosition(this._shadow, pos);
		}

		this._zIndex = pos.y + this.options.zIndexOffset;

		this._resetZIndex();
	},

	_updateZIndex(offset) {
		if (this._icon) {
			this._icon.style.zIndex = this._zIndex + offset;
		}
	},

	_animateZoom(opt) {
		const pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center).round();

		this._setPos(pos);
	},

	_initInteraction() {

		if (!this.options.interactive) { return; }

		this._icon.classList.add('leaflet-interactive');

		this.addInteractiveTarget(this._icon);

		if (MarkerDrag) {
			let draggable = this.options.draggable;
			if (this.dragging) {
				draggable = this.dragging.enabled();
				this.dragging.disable();
			}

			this.dragging = new MarkerDrag(this);

			if (draggable) {
				this.dragging.enable();
			}
		}
	},

	// @method setOpacity(opacity: Number): this
	// Changes the opacity of the marker.
	setOpacity(opacity) {
		this.options.opacity = opacity;
		if (this._map) {
			this._updateOpacity();
		}

		return this;
	},

	_updateOpacity() {
		const opacity = this.options.opacity;

		if (this._icon) {
			this._icon.style.opacity = opacity;
		}

		if (this._shadow) {
			this._shadow.style.opacity = opacity;
		}
	},

	_bringToFront() {
		this._updateZIndex(this.options.riseOffset);
	},

	_resetZIndex() {
		this._updateZIndex(0);
	},

	_panOnFocus() {
		const map = this._map;
		if (!map) { return; }

		const iconOpts = this.options.icon.options;
		const size = iconOpts.iconSize ? point(iconOpts.iconSize) : point(0, 0);
		const anchor = iconOpts.iconAnchor ? point(iconOpts.iconAnchor) : point(0, 0);

		map.panInside(this._latlng, {
			paddingTopLeft: anchor,
			paddingBottomRight: size.subtract(anchor)
		});
	},

	_getPopupAnchor() {
		return this.options.icon.options.popupAnchor;
	},

	_getTooltipAnchor() {
		return this.options.icon.options.tooltipAnchor;
	}
});


// factory L.marker(latlng: LatLng, options? : Marker options)

// @factory L.marker(latlng: LatLng, options? : Marker options)
// Instantiates a Marker object given a geographical point and optionally an options object.
export function marker(latlng, options) {
	return new Marker(latlng, options);
}

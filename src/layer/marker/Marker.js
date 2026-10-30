// @ts-check
import {Layer} from '../Layer.js';
import {DefaultIcon} from './DefaultIcon.js';
import * as Util from '../../core/Util.js';
import {LatLng} from '../../geo/LatLng.js';
import {Point} from '../../geometry/Point.js';
import * as DomUtil from '../../dom/DomUtil.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {MarkerDrag} from './Marker.Drag.js';
import {pointToGeoJSON} from '../GeoJSONUtil.js';

/** @import {Feature, Point as GeoJSONPoint} from 'geojson' */
/** @import {Defaults, DragEndEvent, LatLngExpression, LeafletEvent, MarkerEventMap, MarkerMoveEvent, MarkerOptions,
 *    PointExpression, ZoomAnimEvent} from '../../types.js' */
/** @import {LeafletMap} from '../../map/Map.js' */
/** @import {Icon} from './Icon.js' */

const defaultOptions = {
	/**
	 * Icon instance to use for rendering the marker. See [Icon documentation](#Icon) for details on how
	 * to customize the marker icon. If not specified, a common instance of `DefaultIcon` is used.
	 * @type {Icon}
	 */
	icon: /* @__PURE__ */ new DefaultIcon(),

	// Option inherited from "Interactive layer" abstract class
	interactive: true,

	/** Whether the marker can be tabbed to with a keyboard and, if interactive, clicked by pressing Enter or Space. */
	keyboard: true,

	/**
	 * Text for the browser tooltip that appear on marker hover (no tooltip by default). [Useful for
	 * accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
	 */
	title: '',

	/**
	 * Text for the `alt` attribute of the icon image. [Useful for
	 * accessibility](https://leafletjs.com/examples/accessibility/#markers-must-be-labelled).
	 */
	alt: 'Marker',

	/**
	 * By default, marker images zIndex is set automatically based on its latitude. Use
	 * this option if you want to put the marker on top of all others (or below), specifying
	 * a high value like `1000` (or high negative value, respectively).
	 */
	zIndexOffset: 0,

	/** The opacity of the marker. */
	opacity: 1,

	/**
	 * Rotation of the marker icon in degrees, clockwise, around the icon anchor. A rotated marker, even at 0°, has
	 * no shadow, since the shadow of an upright pin looks wrong under a tilted one. `null` means no rotation.
	 * @type {number | null}
	 */
	rotation: null,

	/** If `true`, the marker will get on top of others when you hover the pointer over it. */
	riseOnHover: false,

	/** The z-index offset used for the `riseOnHover` feature. */
	riseOffset: 250,

	/** `Map pane` where the markers icon will be added. */
	pane: 'markerPane',

	/** `Map pane` where the markers shadow will be added. */
	shadowPane: 'shadowPane',

	/**
	 * When `true`, a pointer event on this marker will trigger the same event on the
	 * map (unless [`DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
	 */
	bubblingPointerEvents: false,

	/**
	 * When `true`, the map will pan whenever the marker is focused (via e.g. pressing
	 * `tab` on the keyboard) to ensure the marker is visible within the map's bounds
	 */
	autoPanOnFocus: true,

	/**
	 * Whether the marker is draggable with pointer or not.
	 * @category Draggable marker options
	 */
	draggable: false,

	/**
	 * Whether to pan the map when dragging this marker near its edge or not.
	 * @category Draggable marker options
	 */
	autoPan: false,

	/**
	 * Distance (in pixels to the left/right and to the top/bottom) of the map edge to start panning the map.
	 * @category Draggable marker options
	 * @type {PointExpression}
	 */
	autoPanPadding: [50, 50],

	/**
	 * Number of pixels the map should pan by.
	 * @category Draggable marker options
	 */
	autoPanSpeed: 10
};

/** @typedef {typeof defaultOptions} MarkerDefaults */

/**
 * @typedef {Object} MarkerEvents
 * @property {MarkerMoveEvent} move Fired when the marker is moved via [`setLatLng`](#marker-setlatlng) or by
 *   [dragging](#marker-dragging). Old and new coordinates are included in event arguments as `oldLatLng`, `latlng`.
 */

/**
 * @category Dragging events
 * @typedef {Object} MarkerDragEvents
 * @property {LeafletEvent} dragstart Fired when the user starts dragging the marker.
 * @property {LeafletEvent} movestart Fired when the marker starts moving (because of dragging).
 * @property {MarkerMoveEvent} drag Fired repeatedly while the user drags the marker.
 * @property {DragEndEvent} dragend Fired when the user stops dragging the marker.
 * @property {LeafletEvent} moveend Fired when the marker stops moving (because of dragging).
 */

/**
 * @typedef {Object} MarkerMoveEventProps
 * @property {LatLng} oldLatLng The previous position of the marker.
 * @property {LatLng} latlng The new position of the marker.
 */

/**
 * Marker is used to display clickable/draggable icons on the map. Extends `Layer`.
 * @example
 * ```js
 * new Marker([50.5, 30.5]).addTo(map);
 * ```
 * @categoryDescription Methods
 * In addition to [shared layer methods](#Layer) like `addTo()` and `remove()` and [popup
 * methods](#Popup) like bindPopup() you can also use the following methods:
 * @categoryDescription Interaction handlers
 * Interaction handlers are properties of a marker instance that allow you to control interaction behavior in
 * runtime, enabling or disabling certain features such as dragging (see `Handler` methods). Example:
 *
 * ```js
 * marker.dragging.disable();
 * ```
 * @template {MarkerOptions} [O=MarkerOptions]
 * @template {MarkerEventMap} [E=MarkerEventMap]
 * @extends {Layer<O, E>}
 */
export class Marker extends Layer {

	static initHooks = true;

	/** @type {Defaults<MarkerOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Instantiates a Marker object given a geographical point and optionally an options object.
	 * @param {LatLngExpression} latlng
	 * @param {Partial<O>} [options]
	 */
	constructor(latlng, options) {
		super();

		Util.setOptions(this, options);
		this._latlng = new LatLng(latlng);

		this.callInitHooks();
	}

	/** @param {LeafletMap} map */
	onAdd(map) {
		this._zoomAnimated = this._zoomAnimated && map.options.markerZoomAnimation;

		if (this._zoomAnimated) {
			map.on('zoomanim', this._animateZoom, this);
		}

		this._initIcon();
		this.update();
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		if (this.dragging) {
			// remember whether dragging is on or off (`dragging.disable()`) for when the marker is added again
			this.options.draggable = this.dragging.enabled();
			if (this.options.draggable) { this.dragging.removeHooks(); }
		}
		delete this.dragging;

		if (this._zoomAnimated) {
			map.off('zoomanim', this._animateZoom, this);
		}

		this._removeIcon();
		this._removeShadow();
	}

	/** @returns {{[type: string]: (e: any) => void}} */
	getEvents() {
		return {
			zoom: this.update,
			viewreset: this.update
		};
	}

	/**
	 * Returns the current geographical position of the marker.
	 * @returns {LatLng}
	 */
	getLatLng() {
		return this._latlng;
	}

	/**
	 * Changes the marker position to the given point.
	 * @param {LatLngExpression} latlng
	 * @returns {this}
	 */
	setLatLng(latlng) {
		const oldLatLng = this._latlng;
		this._latlng = new LatLng(latlng);
		this.update();

		return this.fire('move', {oldLatLng, latlng: this._latlng});
	}

	/**
	 * Changes the [zIndex offset](#marker-zindexoffset) of the marker.
	 * @param {number} offset
	 * @returns {this}
	 */
	setZIndexOffset(offset) {
		this.options.zIndexOffset = offset;
		return this.update();
	}

	/**
	 * Returns the current icon used by the marker
	 * @returns {Icon}
	 */
	getIcon() {
		return this.options.icon;
	}

	/**
	 * Changes the marker icon.
	 * @param {Icon} icon
	 * @returns {this}
	 */
	setIcon(icon) {

		this.options.icon = icon;

		if (this._map) {
			this._initIcon();
			this.update();
		}

		return this;
	}

	/**
	 * Returns the instance of [`HTMLElement`](https://developer.mozilla.org/docs/Web/API/HTMLElement)
	 * used by Marker layer.
	 * @returns {HTMLElement | null | undefined}
	 */
	getElement() {
		return this._icon;
	}

	/**
	 * Updates the marker position on the map, e.g. after changing its `zIndexOffset` option directly.
	 * @returns {this}
	 */
	update() {

		if (this._icon && this._map) {
			const pos = this._map.latLngToLayerPoint(this._latlng)._round();
			this._setPos(pos);
		}

		return this;
	}

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

			if (icon instanceof HTMLImageElement) {
				icon.alt = options.alt ?? '';
			}
		}

		icon.classList.add(classToAdd);

		if (options.keyboard) {
			icon.tabIndex = 0;
			if (options.interactive) {
				icon.setAttribute('role', 'button');
				DomEvent.on(icon, 'keydown', this._onKeyDown, this);
			}
		}

		/** @type {HTMLElement | null | undefined} */
		this._icon = icon;

		if (options.riseOnHover) {
			this.on({
				pointerover: this._bringToFront,
				pointerout: this._resetZIndex
			});
		}

		if (this.options.autoPanOnFocus) {
			DomEvent.on(icon, 'focus', this._panOnFocus, this);
		}

		const newShadow = options.icon.createShadow?.(this._shadow) ?? null;
		let addShadow = false;

		if (newShadow !== this._shadow) {
			this._removeShadow();
			addShadow = true;
		}

		if (newShadow) {
			newShadow.classList.add(classToAdd);
			newShadow.alt = '';
		}
		/** @type {HTMLImageElement | null | undefined} */
		this._shadow = newShadow;


		if (options.opacity < 1) {
			this._updateOpacity();
		}


		if (addIcon) {
			this.getPane().appendChild(icon);
		}
		this._initInteraction();
		if (newShadow && addShadow) {
			this.getPane(options.shadowPane).appendChild(newShadow);
		}
	}

	_removeIcon() {
		if (this.options.riseOnHover) {
			this.off({
				pointerover: this._bringToFront,
				pointerout: this._resetZIndex
			});
		}

		const icon = /** @type {HTMLElement} */ (this._icon);
		if (this.options.autoPanOnFocus) {
			DomEvent.off(icon, 'focus', this._panOnFocus, this);
		}
		DomEvent.off(icon, 'keydown', this._onKeyDown, this);

		icon.remove();
		this.removeInteractiveTarget(icon);

		this._icon = null;
	}

	_removeShadow() {
		this._shadow?.remove();
		this._shadow = null;
	}

	/** @param {Point} pos */
	_setPos(pos) {
		this._positionElements(pos);

		/** @type {number} */
		this._zIndex = pos.y + this.options.zIndexOffset;

		this._resetZIndex();
	}

	/** @param {Point} pos */
	_positionElements(pos) {
		const rotation = this.options.rotation;

		if (this._icon) {
			DomUtil.setPosition(this._icon, pos);
			if (rotation != null) {
				this._icon.style.transform += ` rotate(${rotation}deg)`;
			}
		}

		if (this._shadow) {
			DomUtil.setPosition(this._shadow, pos);
			this._shadow.style.display = rotation == null ? '' : 'none';
		}
	}

	/** @param {number} offset */
	_updateZIndex(offset) {
		if (this._icon) {
			this._icon.style.zIndex = `${this._zIndex + offset}`;
		}
	}

	/** @param {ZoomAnimEvent} opt */
	_animateZoom(opt) {
		const pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center)._round();

		this._setPos(pos);
	}

	_initInteraction() {

		if (!this.options.interactive) { return; }

		const icon = /** @type {HTMLElement} */ (this._icon);
		icon.classList.add('leaflet-interactive');

		this.addInteractiveTarget(icon);

		if (MarkerDrag) {
			// When the icon element is reused, the drag handler still refers to it. Keep that handler, because
			// replacing it ends a drag in progress and forgets that the marker has just been dragged.
			if (this.dragging?._draggable?._element === icon) {
				// the icon has reset the class names of the element
				icon.classList.toggle('leaflet-marker-draggable', this.dragging.enabled());
				return;
			}

			let draggable = this.options.draggable;
			if (this.dragging) {
				draggable = this.dragging.enabled();
				this.dragging.disable();
			}

			/**
			 * Marker dragging handler. Only valid when the marker is on the map (Otherwise set
			 * [`marker.options.draggable`](#marker-draggable)).
			 * @category Interaction handlers
			 * @type {MarkerDrag | undefined}
			 */
			this.dragging = new MarkerDrag(this);

			if (draggable) {
				this.dragging.enable();
			}
		}
	}

	/**
	 * Returns the current [rotation](#marker-rotation) of the marker in degrees.
	 * @returns {number | null}
	 */
	getRotation() {
		return this.options.rotation;
	}

	/**
	 * Changes the [rotation](#marker-rotation) of the marker; `null` removes it.
	 * @param {number | null} rotation
	 * @returns {this}
	 */
	setRotation(rotation) {
		this.options.rotation = rotation;
		// mid-zoom, the icon is transitioning to a position that update() can't compute yet; the zoom end applies it
		if (this._icon && !this._map._animatingZoom) {
			this._positionElements(DomUtil.getPosition(this._icon));
			this._popup?._updatePosition();
			this._tooltip?._updatePosition();
		}
		return this;
	}

	/**
	 * Changes the opacity of the marker.
	 * @param {number} opacity
	 * @returns {this}
	 */
	setOpacity(opacity) {
		this.options.opacity = opacity;
		if (this._map) {
			this._updateOpacity();
		}

		return this;
	}

	/**
	 * Coordinates values are rounded with [`formatNum`](#util-formatnum) function
	 * with given `precision`. Returns a [`GeoJSON`](https://en.wikipedia.org/wiki/GeoJSON)
	 * representation of the marker (as a GeoJSON `Point` Feature).
	 * @category Other methods
	 * @param {number | false} [precision]
	 * @returns {Feature<GeoJSONPoint>}
	 */
	toGeoJSON(precision) {
		return pointToGeoJSON(this, precision);
	}

	_updateOpacity() {
		const opacity = this.options.opacity;

		if (this._icon) {
			this._icon.style.opacity = `${opacity}`;
		}

		if (this._shadow) {
			this._shadow.style.opacity = `${opacity}`;
		}
	}

	_bringToFront() {
		this._updateZIndex(this.options.riseOffset);
	}

	_resetZIndex() {
		this._updateZIndex(0);
	}

	/** @param {KeyboardEvent} e */
	_onKeyDown(e) {
		// a key pressed on a focusable element inside a DivIcon (e.g. a <button>) already clicks it natively
		if (e.target === this._icon && !e.repeat && (e.key === 'Enter' || e.key === ' ')) {
			e.preventDefault(); // stop Space from scrolling the page
			this._icon?.click();
		}
	}

	_panOnFocus() {
		const map = this._map;
		if (!map) { return; }

		const icon = /** @type {HTMLElement} */ (this._icon),
		style = getComputedStyle(icon),
		anchor = new Point(-parseFloat(style.marginLeft) || 0, -parseFloat(style.marginTop) || 0),
		size = new Point(icon.offsetWidth, icon.offsetHeight);

		map.panInside(this._latlng, {
			paddingTopLeft: anchor,
			paddingBottomRight: size.subtract(anchor)
		});
	}

	_getPopupAnchor() {
		return this._rotateAnchor(this.options.icon.options.popupAnchor);
	}

	_getTooltipAnchor() {
		return this._rotateAnchor(this.options.icon.options.tooltipAnchor);
	}

	/**
	 * Anchors are offsets from the icon anchor, which is also the rotation origin.
	 * @param {PointExpression} anchor
	 * @returns {PointExpression}
	 */
	_rotateAnchor(anchor) {
		const angle = (this.options.rotation ?? 0) * Math.PI / 180;
		if (!angle || !anchor) { return anchor; }

		const {x, y} = new Point(anchor),
		cos = Math.cos(angle),
		sin = Math.sin(angle);
		return new Point(x * cos - y * sin, x * sin + y * cos);
	}
}

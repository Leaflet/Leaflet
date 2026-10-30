// @ts-check
import {DivOverlay} from './DivOverlay.js';
import * as DomEvent from '../dom/DomEvent.js';
import * as DomUtil from '../dom/DomUtil.js';
import {Point} from '../geometry/Point.js';

/** @import {Defaults, DivOverlayEventMap, PointExpression, PopupOptions, ZoomAnimEvent} from '../types.js' */
/** @import {LatLng} from '../geo/LatLng.js' */
/** @import {LeafletMap} from '../map/Map.js' */
/** @import {Layer} from './Layer.js' */

const defaultOptions = {
	/** `Map pane` where the popup will be added. */
	pane: 'popupPane',

	/**
	 * The offset of the popup position.
	 * @type {PointExpression}
	 */
	offset: [0, 7],

	/** Max width of the popup, in pixels. */
	maxWidth: 300,

	/** Min width of the popup, in pixels. */
	minWidth: 50,

	/**
	 * If set, creates a scrollable container of the given height inside a popup if its content exceeds it.
	 * The scrollable container can be styled using the `leaflet-popup-scrolled` CSS class selector.
	 * @type {number | null}
	 */
	maxHeight: null,

	/** Set it to `false` if you don't want the map to do panning animation to fit the opened popup. */
	autoPan: true,

	/**
	 * The margin between the popup and the top left corner of the map view after autopanning was performed.
	 * @type {PointExpression | null}
	 */
	autoPanPaddingTopLeft: null,

	/**
	 * The margin between the popup and the bottom right corner of the map view after autopanning was performed.
	 * @type {PointExpression | null}
	 */
	autoPanPaddingBottomRight: null,

	/**
	 * Equivalent of setting both top left and bottom right autopan padding to the same value.
	 * @type {PointExpression}
	 */
	autoPanPadding: [5, 5],

	/** Set it to `true` if you want to prevent users from panning the popup off of the screen while it is open. */
	keepInView: false,

	/** Controls the presence of a close button in the popup. */
	closeButton: true,

	/** Specifies the 'aria-label' attribute of the close button. */
	closeButtonLabel: 'Close popup',

	/**
	 * Set it to `false` if you want to override the default behavior
	 * of the popup closing when another popup is opened.
	 */
	autoClose: true,

	/** Set it to `false` if you want to override the default behavior of the ESC key for closing of the popup. */
	closeOnEscapeKey: true,

	/** A custom CSS class name to assign to the popup. */
	className: '',

	/**
	 * Whether the popup shall react to changes in the size of its contents
	 * (e.g. when an image inside the popup loads) and reposition itself.
	 */
	trackResize: true,
};

/** @typedef {typeof defaultOptions} PopupDefaults */


/**
 * Used to open popups in certain places of the map. Use [Map.openPopup](#map-openpopup)
 * to open popups while making sure that only one popup is open at one time (recommended
 * for usability), or use [Map.addLayer](#map-addlayer) to open as many as you want.
 * @example
 * If you want to just bind a popup to marker click and then open it, it's really easy:
 *
 * ```js
 * marker.bindPopup(popupContent).openPopup();
 * ```
 * Path overlays like polylines also have a `bindPopup` method.
 *
 * A popup can be also standalone:
 *
 * ```js
 * const popup = new Popup()
 * 	.setLatLng(latlng)
 * 	.setContent('<p>Hello world!<br />This is a nice popup.</p>')
 * 	.openOn(map);
 * ```
 * or
 * ```js
 * const popup = new Popup(latlng, {content: '<p>Hello world!<br />This is a nice popup.</p>'})
 * 	.openOn(map);
 * ```
 *
 * **Security note.** Popup string content is rendered as HTML. If your content
 * may include untrusted input (e.g. data from users or external APIs), sanitize
 * it with a library like [DOMPurify](https://github.com/cure53/DOMPurify), or
 * build a DOM element using `textContent` to render it as plain text:
 *
 * ```js
 * const el = document.createElement('div');
 * el.textContent = untrustedString;
 * marker.bindPopup(el);
 * ```
 *
 * @template {PopupOptions} [O=PopupOptions]
 * @template {DivOverlayEventMap} [E=DivOverlayEventMap]
 * @extends {DivOverlay<O, E>}
 */
export class Popup extends DivOverlay {

	/** @type {Defaults<PopupOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Alternative to `map.openPopup(popup)`. Adds the popup to the map and closes the previous one.
	 * @param {LeafletMap} map
	 * @returns {this}
	 */
	openOn(map) {
		map = arguments.length ? map : /** @type {Layer} */ (this._source)._map; // experimental, not the part of public api

		if (!map.hasLayer(this) && map._popup && map._popup.options.autoClose) {
			map.removeLayer(map._popup);
		}
		map._popup = this;

		return super.openOn(map);
	}

	/** @param {LeafletMap} map */
	onAdd(map) {
		super.onAdd(map);

		map.fire('popupopen', {popup: this});

		if (this._source) {
			this._source.fire('popupopen', {popup: this}, true);
			// For non-path layers, we toggle the popup when clicking
			// again the layer, so prevent the map to reopen it.
			if (this._source._togglesPopupOnClick()) {
				/** @type {Layer<any, any>} */ (this._source).on('preclick', DomEvent.stopPropagation);
			}
		}
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		super.onRemove(map);

		map.fire('popupclose', {popup: this});

		if (this._source) {
			this._source.fire('popupclose', {popup: this}, true);
			if (this._source._togglesPopupOnClick()) {
				/** @type {Layer<any, any>} */ (this._source).off('preclick', DomEvent.stopPropagation);
			}
		}
	}

	getEvents() {
		const events = super.getEvents();

		if (this.options.closeOnClick ?? this._map.options.closePopupOnClick) {
			events.preclick = this.close;
		}

		if (this.options.keepInView) {
			events.moveend = this._adjustPan;
		}

		return events;
	}

	_initLayout() {
		const prefix = 'leaflet-popup',
		container = this._container = DomUtil.create('div', `${prefix} ${this.options.className || ''} leaflet-zoom-animated`);

		const wrapper = this._wrapper = DomUtil.create('div', `${prefix}-content-wrapper`, container);
		this._contentNode = DomUtil.create('div', `${prefix}-content`, wrapper);

		DomEvent.disableClickPropagation(container);
		DomEvent.disableScrollPropagation(this._contentNode);
		DomEvent.on(container, 'contextmenu', DomEvent.stopPropagation);

		this._tipContainer = DomUtil.create('div', `${prefix}-tip-container`, container);
		this._tip = DomUtil.create('div', `${prefix}-tip`, this._tipContainer);

		if (this.options.closeButton) {
			const closeButton = this._closeButton = DomUtil.create('a', `${prefix}-close-button`, container);
			closeButton.setAttribute('role', 'button'); // overrides the implicit role=link of <a> elements #7399
			closeButton.setAttribute('aria-label', this.options.closeButtonLabel);

			closeButton.href = '#close';
			closeButton.innerHTML = '<span aria-hidden="true">&#215;</span>';

			DomEvent.on(closeButton, 'click', (ev) => {
				ev.preventDefault();
				this.close();
			});
		}


		if (this.options.trackResize) {
			this._resizeObserver = new ResizeObserver(() => {
				if (!this._map) { return; }
				this._updateLayout();
				this._updatePosition();
				this._adjustPan();
			});

			this._resizeObserver.observe(this._contentNode);
		}
	}

	_updateLayout() {
		const container = this._contentNode,
		style = container.style;

		style.maxWidth = `${this.options.maxWidth}px`;
		style.minWidth = `${this.options.minWidth}px`;
		style.height = '';

		const height = container.offsetHeight,
		maxHeight = this.options.maxHeight,
		scrolledClass = 'leaflet-popup-scrolled';

		if (maxHeight && height > maxHeight) {
			style.height = `${maxHeight}px`;
			container.classList.add(scrolledClass);
		} else {
			container.classList.remove(scrolledClass);
		}

		this._containerWidth = this._container.offsetWidth;
		this._containerHeight = this._container.offsetHeight;
	}

	/** @param {ZoomAnimEvent} e */
	_animateZoom(e) {
		const pos = this._map._latLngToNewLayerPoint(/** @type {LatLng} */ (this._latlng), e.zoom, e.center),
		anchor = this._getAnchor();
		DomUtil.setPosition(this._container, pos.add(anchor));
	}

	_adjustPan() {
		if (!this.options.autoPan) { return; }
		this._map._panAnim?.stop();

		// Stopping the pan fires `moveend`, whose listeners may have removed this popup.
		if (!this._map) { return; }

		// We can endlessly recurse if keepInView is set and the view resets.
		// Let's guard against that by exiting early if we're responding to our own autopan.
		if (this._autopanning) {
			this._autopanning = false;
			return;
		}

		const map = this._map,
		marginBottom = parseInt(getComputedStyle(this._container).marginBottom, 10) || 0,
		containerHeight = this._containerHeight + marginBottom,
		containerWidth = this._containerWidth,
		layerPos = new Point(this._containerLeft, -containerHeight - this._containerBottom);

		layerPos._add(DomUtil.getPosition(this._container));

		const containerPos = map.layerPointToContainerPoint(layerPos),
		padding = new Point(this.options.autoPanPadding),
		paddingTL = new Point(this.options.autoPanPaddingTopLeft ?? padding),
		paddingBR = new Point(this.options.autoPanPaddingBottomRight ?? padding),
		size = map.getSize();
		let dx = 0,
		dy = 0;

		if (containerPos.x + containerWidth + paddingBR.x > size.x) { // right
			dx = containerPos.x + containerWidth - size.x + paddingBR.x;
		}
		if (containerPos.x - dx - paddingTL.x < 0) { // left
			dx = containerPos.x - paddingTL.x;
		}
		if (containerPos.y + containerHeight + paddingBR.y > size.y) { // bottom
			dy = containerPos.y + containerHeight - size.y + paddingBR.y;
		}
		if (containerPos.y - dy - paddingTL.y < 0) { // top
			dy = containerPos.y - paddingTL.y;
		}

		if (dx || dy) {
			// Track that we're autopanning, as this function will be re-ran on moveend
			if (this.options.keepInView) {
				this._autopanning = true;
			}

			map
				.fire('autopanstart')
				.panBy([dx, dy]);
		}
	}

	_getAnchor() {
		// Where should we anchor the popup on the source layer?
		return new Point(this._source?._getPopupAnchor ? this._source._getPopupAnchor() : [0, 0]);
	}

}

import {LayerBase} from './LayerBase.js';
import {Popup} from './Popup.js';
import {Tooltip} from './Tooltip.js';
import * as DomEvent from '../dom/DomEvent.js';
import * as Util from '../core/Util.js';

/** @import {LatLngExpression, LayerEventMap, LayerOptions, LeafletEvent, LeafletPointerEvent, MarkerMoveEvent, PopupOptions, TooltipOptions} from '../types.js' */
/** @import {LatLng} from '../geo/LatLng.js' */
/** @import {OverlayContent} from './DivOverlay.js' */

// the focus listener a tooltip added to each layer element, to remove it when the tooltip is unbound or rebound
/** @type {WeakMap<Element, () => void>} */
const focusHandlers = new WeakMap();

/**
 * Events that bound popups and tooltips listen to, with the event objects they expect if a layer fires them.
 * @typedef {Object} OverlayTriggerEvents
 * @property {LeafletPointerEvent} [click]
 * @property {LeafletPointerEvent} [pointermove]
 * @property {MarkerMoveEvent} [move]
 */

/**
 * @typedef {Object} InteractiveLayerProps
 * @property {boolean} interactive If `false`, the layer will not emit pointer events and will
 *   act as a part of the underlying map.
 * @property {boolean} bubblingPointerEvents When `true`, a pointer event on this layer will trigger the
 *   same event on the map (unless [`DomEvent.stopPropagation`](#domevent-stoppropagation) is used).
 */

/**
 * @category Pointer events
 * @typedef {Object} InteractiveLayerEvents
 * @property {LeafletPointerEvent} click Fired when the user clicks (or taps) the layer.
 * @property {LeafletPointerEvent} preclick Fired right before `click`, for something that
 *   should happen before any `click` listener runs.
 * @property {LeafletPointerEvent} dblclick Fired when the user double-clicks (or double-taps) the layer.
 * @property {LeafletPointerEvent} pointerdown Fired when the user pushes the pointer on the layer.
 * @property {LeafletPointerEvent} pointerup Fired when the user releases the pointer pushed on the layer.
 * @property {LeafletPointerEvent} pointerover Fired when the pointer enters the layer.
 * @property {LeafletPointerEvent} pointerout Fired when the pointer leaves the layer.
 * @property {LeafletPointerEvent} contextmenu Fired when the user right-clicks on the layer,
 *   prevents default browser context menu from showing if there are listeners on this event. Also
 *   fired on mobile when the user holds a single touch for a second (also called long press).
 */

/**
 * A set of methods from the Layer base class that all Leaflet layers use. Inherits all methods, options and events
 * from `Evented`.
 *
 * @example
 * ```js
 * const layer = new Marker(latlng).addTo(map);
 * layer.addTo(map);
 * layer.remove();
 * ```
 *
 * @categoryDescription Methods
 * Classes extending `Layer` will inherit the following methods:
 *
 * @categoryDescription Popup methods
 * All layers share a set of methods convenient for binding popups to it.
 *
 * ```js
 * const layer = new Polygon(latlngs).bindPopup('Hi There!').addTo(map);
 * layer.openPopup();
 * layer.closePopup();
 * ```
 *
 * Popups will also be automatically opened when the layer is clicked on and closed when the layer is removed from
 * the map or another popup is opened.
 *
 * @categoryDescription Tooltip methods
 * All layers share a set of methods convenient for binding tooltips to it.
 *
 * ```js
 * const layer = new Polygon(latlngs).bindTooltip('Hi There!').addTo(map);
 * layer.openTooltip();
 * layer.closeTooltip();
 * ```
 *
 * @categoryDescription Extension methods
 * Every layer should extend from `Layer` and (re-)implement the following methods.
 *
 * @template {LayerOptions} [O=LayerOptions]
 * @template {LayerEventMap & OverlayTriggerEvents} [E=LayerEventMap]
 * @extends {LayerBase<O, E>}
 */
export class Layer extends LayerBase {

	/**
	 * Binds a popup to the layer with the passed `content` and sets up the necessary event listeners. A
	 * `String` argument is rendered as HTML; if it may contain untrusted input, sanitize it (e.g. with
	 * DOMPurify) or pass an `HTMLElement` with safe `textContent` instead. If a `Function` is passed it
	 * will receive the layer as the first argument and should return a `String` or `HTMLElement`.
	 * @category Popup methods
	 * @param {OverlayContent | Popup} content
	 * @param {Partial<PopupOptions>} [options]
	 */
	bindPopup(content, options) {
		/** @type {Popup | null | undefined} */
		this._popup = this._initOverlay(Popup, this._popup, content, options);
		this.on({
			click: this._openPopup,
			remove: this.closePopup,
			move: this._movePopup
		});

		return this;
	}

	/**
	 * Removes the popup previously bound with `bindPopup`.
	 * @category Popup methods
	 */
	unbindPopup() {
		if (this._popup) {
			this.off({
				click: this._openPopup,
				remove: this.closePopup,
				move: this._movePopup
			});
			this._popup = null;
		}
		return this;
	}

	/**
	 * Opens the bound popup at the specified `latlng` or at the default popup anchor if no `latlng` is passed.
	 * @category Popup methods
	 * @param {LatLngExpression} [latlng]
	 * @returns {this}
	 */
	openPopup(latlng) {
		if (this._popup) {
			// groups keep the member layer the popup was last opened on
			if (this._getOverlaySource() === this) {
				this._popup._source = this;
			}
			if (this._popup._prepareOpen(latlng || this._latlng)) {
				// open the popup on the map
				this._popup.openOn(this._map);
			}
		}
		return this;
	}

	/**
	 * Closes the popup bound to this layer if it is open.
	 * @category Popup methods
	 */
	closePopup() {
		this._popup?.close();
		return this;
	}

	/**
	 * Opens or closes the popup bound to this layer depending on its current state.
	 * @category Popup methods
	 */
	togglePopup() {
		this._popup?.toggle(this);
		return this;
	}

	/**
	 * Returns `true` if the popup bound to this layer is currently open.
	 * @category Popup methods
	 */
	isPopupOpen() {
		return this._popup?.isOpen() ?? false;
	}

	/**
	 * Sets the content of the popup bound to this layer. String content is rendered as HTML;
	 * sanitize untrusted input or pass an `HTMLElement` with safe `textContent` instead.
	 * @category Popup methods
	 * @param {OverlayContent} content
	 */
	setPopupContent(content) {
		this._popup?.setContent(content);
		return this;
	}

	/**
	 * Returns the popup bound to this layer.
	 * @category Popup methods
	 * @returns {Popup | null | undefined}
	 */
	getPopup() {
		return this._popup;
	}

	/** @param {LeafletPointerEvent} e */
	_openPopup(e) {
		if (!this._popup || !this._map) {
			return;
		}
		// prevent map click
		DomEvent.stopPropagation(e);

		const target = /** @type {Layer} */ (e.propagatedFrom ?? e.target);
		if (this._popup._source === target && target._togglesPopupOnClick()) {
			// treat it like a marker and figure out
			// if we should toggle it open/closed
			if (this._map.hasLayer(this._popup)) {
				this.closePopup();
			} else {
				this.openPopup(e.latlng);
			}
			return;
		}
		this._popup._source = target;
		this.openPopup(e.latlng);
	}

	/** @param {{latlng: LatLng}} e */
	_movePopup(e) {
		/** @type {Popup} */ (this._popup).setLatLng(e.latlng);
	}

	/**
	 * Binds a tooltip to the layer with the passed `content` and sets up the necessary event listeners.
	 * A `String` argument is rendered as HTML; if it may contain untrusted input, sanitize it (e.g. with
	 * DOMPurify) or pass an `HTMLElement` with safe `textContent` instead. If a `Function` is passed it
	 * will receive the layer as the first argument and should return a `String` or `HTMLElement`.
	 * @category Tooltip methods
	 * @param {OverlayContent | Tooltip} content
	 * @param {Partial<TooltipOptions>} [options]
	 */
	bindTooltip(content, options) {
		// an open tooltip is replaced, a closed one reused
		const old = this.isTooltipOpen() ? null : this._tooltip;

		// the handlers depend on the old options, so they go before the new ones are applied
		if (this._tooltip) {
			this.unbindTooltip();
		}

		/** @type {Tooltip | null | undefined} */
		this._tooltip = this._initOverlay(Tooltip, old, content, options);
		this._initTooltipInteractions();

		if (this._tooltip.options.permanent && this._map && this._map.hasLayer(this)) {
			this.openTooltip();
		}

		return this;
	}

	/**
	 * Removes the tooltip previously bound with `bindTooltip`.
	 * @category Tooltip methods
	 */
	unbindTooltip() {
		if (this._tooltip) {
			this._initTooltipInteractions(true);
			this.closeTooltip();
			this._tooltip = null;
		}
		return this;
	}

	/** @param {boolean} [remove] */
	_initTooltipInteractions(remove) {
		const {permanent, sticky} = /** @type {Tooltip} */ (this._tooltip).options,
		events = /** @type {{[type: string]: (e: any) => void}} */ ({
			remove: this.closeTooltip,
			move: this._moveTooltip
		});
		if (permanent) {
			events.add = this._openTooltip;
		} else {
			events.pointerover = this._openTooltip;
			events.pointerout = this.closeTooltip;
			events.click = this._openTooltip;
			// layer elements can be recreated on every add
			events.add = this._toggleFocusListeners;
			if (this._map) {
				this._toggleFocusListeners(!remove);
			}
		}
		if (sticky) {
			events.pointermove = this._moveTooltip;
		}
		this[remove ? 'off' : 'on'](events);
	}

	/**
	 * Opens the bound tooltip at the specified `latlng` or at the default tooltip anchor if no `latlng` is passed.
	 * @category Tooltip methods
	 * @param {LatLngExpression} [latlng]
	 * @returns {this}
	 */
	openTooltip(latlng) {
		if (this._tooltip) {
			// groups keep the member layer the tooltip was last opened on
			if (this._getOverlaySource() === this) {
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
	}

	/**
	 * Closes the tooltip bound to this layer if it is open.
	 * @category Tooltip methods
	 */
	closeTooltip() {
		this._tooltip?.close();
		return this;
	}

	/**
	 * Opens or closes the tooltip bound to this layer depending on its current state.
	 * @category Tooltip methods
	 */
	toggleTooltip() {
		this._tooltip?.toggle(this);
		return this;
	}

	/**
	 * Returns `true` if the tooltip bound to this layer is currently open.
	 * @category Tooltip methods
	 */
	isTooltipOpen() {
		return this._tooltip?.isOpen() ?? false;
	}

	/**
	 * Sets the content of the tooltip bound to this layer. String content is rendered as HTML;
	 * sanitize untrusted input or pass an `HTMLElement` with safe `textContent` instead.
	 * @category Tooltip methods
	 * @param {OverlayContent} content
	 */
	setTooltipContent(content) {
		this._tooltip?.setContent(content);
		return this;
	}

	/**
	 * Returns the tooltip bound to this layer.
	 * @category Tooltip methods
	 * @returns {Tooltip | null | undefined}
	 */
	getTooltip() {
		return this._tooltip;
	}

	/** @param {unknown} add also the `add` listener, so any truthy argument adds */
	_toggleFocusListeners(add) {
		if (this.getElement) {
			this._addFocusListenersOnLayer(this, !add);
		} else if (this.eachLayer) {
			this.eachLayer(layer => this._addFocusListenersOnLayer(layer, !add), this);
		}
	}

	/**
	 * @param {Layer} layer
	 * @param {boolean} remove
	 */
	_addFocusListenersOnLayer(layer, remove) {
		const el = layer.getElement?.();
		if (!el) { return; }

		const oldHandler = focusHandlers.get(el);
		if (oldHandler) { DomEvent.off(el, 'focus', oldHandler, this); }

		if (remove) {
			focusHandlers.delete(el);
			DomEvent.off(el, 'blur', this.closeTooltip, this);
			return;
		}

		const handler = () => {
			if (this._tooltip) {
				this._tooltip._source = layer;
				this.openTooltip();
			}
		};
		focusHandlers.set(el, handler);
		DomEvent.on(el, 'focus', handler, this);
		DomEvent.on(el, 'blur', this.closeTooltip, this);
	}

	/** @param {Layer} layer */
	_setAriaDescribedByOnLayer(layer) {
		const el = layer.getElement?.();
		el?.setAttribute?.('aria-describedby', /** @type {Tooltip} */ (this._tooltip)._container.id);
	}


	/** @param {LeafletEvent & {latlng?: LatLng}} e */
	_openTooltip(e) {
		if (!this._tooltip || !this._map) {
			return;
		}

		// If the map is moving, we will show the tooltip after it's done.
		if (this._map.dragging?.moving()) {
			if (e.type === 'add' && !this._moveEndOpensTooltip) {
				this._moveEndOpensTooltip = true;
				this._map.once('moveend', () => {
					this._moveEndOpensTooltip = false;
					this._openTooltip(e);
				});
			}
			return;
		}

		this._tooltip._source = /** @type {Layer} */ (e.propagatedFrom ?? e.target);

		this.openTooltip(this._tooltip.options.sticky ? e.latlng : undefined);
	}

	/** @param {{latlng: LatLng, originalEvent?: PointerEvent | MouseEvent}} e */
	_moveTooltip(e) {
		let latlng = e.latlng, containerPoint, layerPoint;
		const tooltip = /** @type {Tooltip} */ (this._tooltip);
		if (tooltip.options.sticky && e.originalEvent) {
			containerPoint = this._map.pointerEventToContainerPoint(e.originalEvent);
			layerPoint = this._map.containerPointToLayerPoint(containerPoint);
			latlng = this._map.layerPointToLatLng(layerPoint);
		}
		tooltip.setLatLng(latlng);
	}

	/**
	 * @template {Popup | Tooltip} T
	 * @param {new (options?: any, source?: Layer) => T} OverlayClass
	 * @param {T | null | undefined} old
	 * @param {OverlayContent | T} content
	 * @param {object} [options]
	 */
	_initOverlay(OverlayClass, old, content, options) {
		let overlay = content;
		if (overlay instanceof OverlayClass) {
			Util.setOptions(/** @type {{options: object}} */ (overlay), options);
			overlay._source = this;
		} else {
			overlay = (old && !options) ? old : new OverlayClass(options, this);
			overlay.setContent(/** @type {OverlayContent} */ (content));
		}
		return overlay;
	}

	// Returns the layer a bound popup or tooltip opens on, or nothing if there's none on the map.
	// `FeatureGroup` overrides it to pick one of its own layers.
	/** @returns {Layer | undefined} */
	_getOverlaySource() {
		return this;
	}

	// Whether clicking the layer again closes its open popup. `Path` overrides it to
	// move the popup to the new click position instead.
	_togglesPopupOnClick() {
		return true;
	}
}

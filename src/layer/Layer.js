import {LayerBase} from './LayerBase.js';
import {Popup} from './Popup.js';
import {Tooltip} from './Tooltip.js';
import * as DomEvent from '../dom/DomEvent.js';
import * as Util from '../core/Util.js';

export class Layer extends LayerBase {

	/**
	 * Binds a popup to the layer with the passed `content` and sets up the necessary event listeners. A
	 * `String` argument is rendered as HTML; if it may contain untrusted input, sanitize it (e.g. with
	 * DOMPurify) or pass an `HTMLElement` with safe `textContent` instead. If a `Function` is passed it
	 * will receive the layer as the first argument and should return a `String` or `HTMLElement`.
	 * @category Popup methods
	 * @param {string | HTMLElement | Function | Popup} content
	 * @param {PopupOptions} [options]
	 * @returns {this}
	 */
	bindPopup(content, options) {
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
	 * @returns {this}
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
	 * @param {LatLng} [latlng]
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
	 * @returns {this}
	 */
	closePopup() {
		this._popup?.close();
		return this;
	}

	/**
	 * Opens or closes the popup bound to this layer depending on its current state.
	 * @category Popup methods
	 * @returns {this}
	 */
	togglePopup() {
		this._popup?.toggle(this);
		return this;
	}

	/**
	 * Returns `true` if the popup bound to this layer is currently open.
	 * @category Popup methods
	 * @returns {boolean}
	 */
	isPopupOpen() {
		return this._popup?.isOpen() ?? false;
	}

	/**
	 * Sets the content of the popup bound to this layer. String content is rendered as HTML;
	 * sanitize untrusted input or pass an `HTMLElement` with safe `textContent` instead.
	 * @category Popup methods
	 * @param {string | HTMLElement | Popup} content
	 * @returns {this}
	 */
	setPopupContent(content) {
		this._popup?.setContent(content);
		return this;
	}

	/**
	 * Returns the popup bound to this layer.
	 * @category Popup methods
	 * @returns {Popup}
	 */
	getPopup() {
		return this._popup;
	}

	_openPopup(e) {
		if (!this._popup || !this._map) {
			return;
		}
		// prevent map click
		DomEvent.stopPropagation(e);

		const target = e.propagatedFrom ?? e.target;
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

	_movePopup(e) {
		this._popup.setLatLng(e.latlng);
	}

	/**
	 * Binds a tooltip to the layer with the passed `content` and sets up the necessary event listeners.
	 * A `String` argument is rendered as HTML; if it may contain untrusted input, sanitize it (e.g. with
	 * DOMPurify) or pass an `HTMLElement` with safe `textContent` instead. If a `Function` is passed it
	 * will receive the layer as the first argument and should return a `String` or `HTMLElement`.
	 * @category Tooltip methods
	 * @param {string | HTMLElement | Function | Tooltip} content
	 * @param {TooltipOptions} [options]
	 * @returns {this}
	 */
	bindTooltip(content, options) {
		// an open tooltip is replaced, a closed one reused
		const old = this.isTooltipOpen() ? null : this._tooltip;

		// the handlers depend on the old options, so they go before the new ones are applied
		if (this._tooltip) {
			this.unbindTooltip();
		}

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
	 * @returns {this}
	 */
	unbindTooltip() {
		if (this._tooltip) {
			this._initTooltipInteractions(true);
			this.closeTooltip();
			this._tooltip = null;
		}
		return this;
	}

	_initTooltipInteractions(remove) {
		const {permanent, sticky} = this._tooltip.options,
		events = {
			remove: this.closeTooltip,
			move: this._moveTooltip
		};
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
	 * @param {LatLng} [latlng]
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
	 * @returns {this}
	 */
	closeTooltip() {
		this._tooltip?.close();
		return this;
	}

	/**
	 * Opens or closes the tooltip bound to this layer depending on its current state.
	 * @category Tooltip methods
	 * @returns {this}
	 */
	toggleTooltip() {
		this._tooltip?.toggle(this);
		return this;
	}

	/**
	 * Returns `true` if the tooltip bound to this layer is currently open.
	 * @category Tooltip methods
	 * @returns {boolean}
	 */
	isTooltipOpen() {
		return this._tooltip?.isOpen() ?? false;
	}

	/**
	 * Sets the content of the tooltip bound to this layer. String content is rendered as HTML;
	 * sanitize untrusted input or pass an `HTMLElement` with safe `textContent` instead.
	 * @category Tooltip methods
	 * @param {string | HTMLElement | Tooltip} content
	 * @returns {this}
	 */
	setTooltipContent(content) {
		this._tooltip?.setContent(content);
		return this;
	}

	/**
	 * Returns the tooltip bound to this layer.
	 * @category Tooltip methods
	 * @returns {Tooltip}
	 */
	getTooltip() {
		return this._tooltip;
	}

	// also the `add` listener, so any truthy argument adds
	_toggleFocusListeners(add) {
		if (this.getElement) {
			this._addFocusListenersOnLayer(this, !add);
		} else if (this.eachLayer) {
			this.eachLayer(layer => this._addFocusListenersOnLayer(layer, !add), this);
		}
	}

	_addFocusListenersOnLayer(layer, remove) {
		const el = typeof layer.getElement === 'function' && layer.getElement();
		if (el) {
			const toggle = remove ? DomEvent.off : DomEvent.on;
			if (!remove) {
				// Remove focus listener, if already existing
				el._leaflet_focus_handler && DomEvent.off(el, 'focus', el._leaflet_focus_handler, this);

				// eslint-disable-next-line camelcase
				el._leaflet_focus_handler = () => {
					if (this._tooltip) {
						this._tooltip._source = layer;
						this.openTooltip();
					}
				};
			}

			el._leaflet_focus_handler && toggle(el, 'focus', el._leaflet_focus_handler, this);
			toggle(el, 'blur', this.closeTooltip, this);

			if (remove) {
				delete el._leaflet_focus_handler;
			}
		}
	}

	_setAriaDescribedByOnLayer(layer) {
		const el = typeof layer.getElement === 'function' && layer.getElement();
		el?.setAttribute?.('aria-describedby', this._tooltip._container.id);
	}


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

		this._tooltip._source = e.propagatedFrom ?? e.target;

		this.openTooltip(this._tooltip.options.sticky ? e.latlng : undefined);
	}

	_moveTooltip(e) {
		let latlng = e.latlng, containerPoint, layerPoint;
		if (this._tooltip.options.sticky && e.originalEvent) {
			containerPoint = this._map.pointerEventToContainerPoint(e.originalEvent);
			layerPoint = this._map.containerPointToLayerPoint(containerPoint);
			latlng = this._map.layerPointToLatLng(layerPoint);
		}
		this._tooltip.setLatLng(latlng);
	}

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

	// Returns the layer a bound popup or tooltip opens on, or nothing if there's none on the map.
	// `FeatureGroup` overrides it to pick one of its own layers.
	_getOverlaySource() {
		return this;
	}

	// Whether clicking the layer again closes its open popup. `Path` overrides it to
	// move the popup to the new click position instead.
	_togglesPopupOnClick() {
		return true;
	}
}

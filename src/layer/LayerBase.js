import {Evented} from '../core/Events.js';
import * as Util from '../core/Util.js';

/** @import {Defaults, LayerDefaults, LayerEventMap, LayerOptions, LeafletEvent, PopupEvent, TooltipEvent} from '../types.js' */
/** @import {LeafletMap} from '../map/Map.js' */

// Classes extending `Layer` will inherit the following options:
const defaultOptions = {
	/**
	 * By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding
	 * this option will cause the layer to be placed on another pane by default. Not effective if
	 * the `renderer` option is set (the `renderer` option will override the `pane` option).
	 */
	pane: 'overlayPane',

	/**
	 * String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes
	 * the layer data and is often a legal obligation towards copyright holders and tile providers.
	 * @type {string | null}
	 */
	attribution: null,

	bubblingPointerEvents: true
};

/** @typedef {typeof defaultOptions} LayerDefaultsValues */

/**
 * A `LayerGroup` that can hold layers of type `L`: groups type their members as `Layer`, so a popup or a tooltip
 * isn't one.
 * @template L
 * @typedef {{addLayer(layer: L): unknown, removeLayer(layer: L): unknown}} LayerContainer
 */

/**
 * @typedef {Object} LayerEvents
 * @property {LeafletEvent} add Fired after the layer is added to a map
 * @property {LeafletEvent} remove Fired after the layer is removed from a map
 */

/**
 * @category Popup events
 * @typedef {Object} LayerPopupEvents
 * @property {PopupEvent} popupopen Fired when a popup bound to this layer is opened
 * @property {PopupEvent} popupclose Fired when a popup bound to this layer is closed
 */

/**
 * @category Tooltip events
 * @typedef {Object} LayerTooltipEvents
 * @property {TooltipEvent} tooltipopen Fired when a tooltip bound to this layer is opened.
 * @property {TooltipEvent} tooltipclose Fired when a tooltip bound to this layer is closed.
 */

/**
 * @template {LayerOptions} [O=LayerOptions]
 * @template {LayerEventMap} [E=LayerEventMap]
 * @extends {Evented<O & LayerDefaults, E>}
 */
export class LayerBase extends Evented {

	/** @type {Defaults<LayerOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Adds the layer to the given map or layer group.
	 * @param {LeafletMap | LayerContainer<this>} map
	 */
	addTo(map) {
		map.addLayer(this);
		return this;
	}

	/** Removes the layer from the map it is currently active on. */
	remove() {
		return this.removeFrom(this._map || this._mapToAdd);
	}

	/**
	 * Removes the layer from the given map
	 * @overload
	 * @param {LeafletMap} map
	 * @returns {this}
	 */
	/**
	 * Removes the layer from the given `LayerGroup`
	 * @overload
	 * @param {LayerContainer<this>} group
	 * @returns {this}
	 */
	/** @param {LeafletMap | LayerContainer<this>} [obj] */
	removeFrom(obj) {
		obj?.removeLayer(this);
		return this;
	}

	/**
	 * Returns the `HTMLElement` representing the named pane on the
	 * map. If `name` is omitted, returns the pane for this layer.
	 * @param {string} [name]
	 */
	getPane(name) {
		return this._map.getPane(name ? (/** @type {any} */ (this.options)[name] || name) : this.options.pane);
	}

	/** @param {HTMLElement | SVGElement} targetEl */
	addInteractiveTarget(targetEl) {
		this._map._targets[Util.stamp(targetEl)] = this;
		return this;
	}

	/** @param {HTMLElement | SVGElement} targetEl */
	removeInteractiveTarget(targetEl) {
		delete this._map._targets[Util.stamp(targetEl)];
		return this;
	}

	/** Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution). */
	getAttribution() {
		return this.options.attribution;
	}

	/** @param {{target: LeafletMap}} e */
	_layerAdd(e) {
		const map = e.target;

		// check in case layer gets added and then removed before the map is ready
		if (!map.hasLayer(this)) { return; }

		this._map = map;
		this._zoomAnimated = map._zoomAnimated;

		if (this.getEvents) {
			const events = this.getEvents();
			map.on(events, this);
			this.once('remove', () => map.off(events, this));
		}

		this.onAdd(map);

		this.fire('add');
		map.fire('layeradd', {layer: this});
	}
}

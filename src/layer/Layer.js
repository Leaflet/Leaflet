import {Evented} from '../core/Events.js';
import * as Util from '../core/Util.js';

/*
 * @class Layer
 * @inherits Evented
 * @aka ILayer
 *
 * A set of methods from the Layer base class that all Leaflet layers use.
 * Inherits all methods, options and events from `Evented`.
 *
 * @example
 *
 * ```js
 * const layer = new Marker(latlng).addTo(map);
 * layer.addTo(map);
 * layer.remove();
 * ```
 *
 * @event add: Event
 * Fired after the layer is added to a map
 *
 * @event remove: Event
 * Fired after the layer is removed from a map
 */


export class Layer extends Evented {

	// Classes extending `Layer` will inherit the following options:
	static defaultOptions = {
		// @option pane: String = 'overlayPane'
		// By default the layer will be added to the map's [overlay pane](#map-overlaypane). Overriding this option will cause the layer to be placed on another pane by default.
		// Not effective if the `renderer` option is set (the `renderer` option will override the `pane` option).
		pane: 'overlayPane',

		// @option attribution: String = null
		// String to be shown in the attribution control, e.g. "© OpenStreetMap contributors". It describes the layer data and is often a legal obligation towards copyright holders and tile providers.
		attribution: null,

		bubblingPointerEvents: true
	};

	/* @section
	 * Classes extending `Layer` will inherit the following methods:
	 *
	 * @method addTo(map: LeafletMap|LayerGroup): this
	 * Adds the layer to the given map or layer group.
	 */
	addTo(map) {
		map.addLayer(this);
		return this;
	}

	// @method remove: this
	// Removes the layer from the map it is currently active on.
	remove() {
		return this.removeFrom(this._map || this._mapToAdd);
	}

	// @method removeFrom(map: LeafletMap): this
	// Removes the layer from the given map
	//
	// @alternative
	// @method removeFrom(group: LayerGroup): this
	// Removes the layer from the given `LayerGroup`
	removeFrom(obj) {
		obj?.removeLayer(this);
		return this;
	}

	// @method getPane(name? : String): HTMLElement
	// Returns the `HTMLElement` representing the named pane on the map. If `name` is omitted, returns the pane for this layer.
	getPane(name) {
		return this._map.getPane(name ? (this.options[name] || name) : this.options.pane);
	}

	addInteractiveTarget(targetEl) {
		this._map._targets[Util.stamp(targetEl)] = this;
		return this;
	}

	removeInteractiveTarget(targetEl) {
		delete this._map._targets[Util.stamp(targetEl)];
		return this;
	}

	// @method getAttribution: String
	// Used by the `attribution control`, returns the [attribution option](#gridlayer-attribution).
	getAttribution() {
		return this.options.attribution;
	}

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

/* @section Extension methods
 * @uninheritable
 *
 * Every layer should extend from `Layer` and (re-)implement the following methods.
 *
 * @method onAdd(map: LeafletMap): this
 * Should contain code that creates DOM elements for the layer, adds them to `map panes` where they should belong and puts listeners on relevant map events. Called on [`map.addLayer(layer)`](#map-addlayer).
 *
 * @method onRemove(map: LeafletMap): this
 * Should contain all clean up code that removes the layer's elements from the DOM and removes listeners previously added in [`onAdd`](#layer-onadd). Called on [`map.removeLayer(layer)`](#map-removelayer).
 *
 * @method getEvents(): Object
 * This optional method should return an object like `{ viewreset: this._reset }` for [`on`](#evented-on). The event handlers in this object will be automatically added and removed from the map with your layer.
 *
 * @method getAttribution(): String
 * This optional method should return a string containing HTML to be shown on the `Attribution control` whenever the layer is visible.
 *
 * @method beforeAdd(map: LeafletMap): this
 * Optional method. Called on [`map.addLayer(layer)`](#map-addlayer), before the layer is added to the map, before events are initialized, without waiting until the map is in a usable state. Use for early initialization only.
 */

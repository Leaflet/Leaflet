import {Class} from './Class.js';

/** @import {LeafletMap} from '../map/Map.js' */

/**
 * Abstract class for map interaction handlers, used to inject interaction features like dragging into classes
 * like `Map` and `Marker`.
 *
 * @categoryDescription Extension methods
 * Classes inheriting from `Handler` must implement the two following methods:
 *
 * @categoryDescription Functions
 * There is static function which can be called without instantiating Handler:
 */
export class Handler extends Class {
	static initHooks = true;

	/** @param {LeafletMap} map */
	constructor(map) {
		super();
		this._map = map;
		this.callInitHooks();
	}

	/**
	 * Enables the handler
	 * @returns {this}
	 */
	enable() {
		if (this._enabled) { return this; }

		this._enabled = true;
		this.addHooks();
		return this;
	}

	/**
	 * Disables the handler
	 * @returns {this}
	 */
	disable() {
		if (!this._enabled) { return this; }

		this._enabled = false;
		this.removeHooks();
		return this;
	}

	/**
	 * Returns `true` if the handler is enabled
	 * @returns {boolean}
	 */
	enabled() {
		return !!this._enabled;
	}

	/**
	 * Called when the handler is enabled, should add event hooks.
	 * @category Extension methods
	 */
	addHooks() {}

	/**
	 * Called when the handler is disabled, should remove the event hooks added previously.
	 * @category Extension methods
	 */
	removeHooks() {}

	/**
	 * Adds a new Handler to the given map with the given name.
	 * @category Functions
	 * @template {typeof Handler} C
	 * @this {C}
	 * @param {LeafletMap} map
	 * @param {string} name
	 * @returns {C}
	 */
	static addTo(map, name) {
		map.addHandler(name, this);
		return this;
	}
}

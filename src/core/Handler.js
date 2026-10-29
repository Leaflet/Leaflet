import {Class} from './Class.js';

/*
	Handler is a base class for handler classes that are used internally to inject
	interaction features like dragging to classes like Map and Marker.
*/

/**
 * Abstract class for map interaction handlers
 * @categoryDescription Extension methods
 * Classes inheriting from `Handler` must implement the two following methods:
 */
export class Handler extends Class {
	static initHooks = true;

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
	/**
	 * Called when the handler is disabled, should remove the event hooks added previously.
	 * @category Extension methods
	 */

	/**
	 * Adds a new Handler to the given map with the given name.
	 * @category There is static function which can be called without instantiating Handler:
	 * @param {LeafletMap} map
	 * @param {string} name
	 * @returns {this}
	 */
	static addTo(map, name) {
		map.addHandler(name, this);
		return this;
	}
}

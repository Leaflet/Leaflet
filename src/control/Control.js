import {Class} from '../core/Class.js';
import * as Util from '../core/Util.js';

/** @import {ControlDefaults, ControlOptions, Defaults} from '../types.js' */
/** @import {LeafletMap} from '../map/Map.js' */

const defaultOptions = {
	/**
	 * The position of the control (one of the map corners). Possible values
	 * are `'topleft'`, `'topright'`, `'bottomleft'` or `'bottomright'`
	 * @type {ControlPosition}
	 */
	position: 'topright'
};

/** @typedef {typeof defaultOptions} ControlDefaultsValues */

/**
 * One of the map corners a control can be placed in.
 * @typedef {'topleft' | 'topright' | 'bottomleft' | 'bottomright'} ControlPosition
 */

/**
 * Base class for map controls such as `ZoomControl`, `AttributionControl`, `LayersControl` and `ScaleControl`, which
 * handles positioning them. Extend it to create your own controls.
 * @categoryDescription Methods
 * Classes extending Control will inherit the following methods:
 *
 * @categoryDescription Extension methods
 * Every control should extend from `Control` and (re-)implement the following methods.
 * @template {ControlOptions} [O=ControlOptions]
 * @extends {Class<O & ControlDefaults>}
 */
export class Control extends Class {

	static initHooks = true;

	/** @type {Defaults<ControlOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Creates a control with the given options.
	 * @param {NoInfer<Partial<O>>} [options]
	 */
	constructor(options) {
		super();
		Util.setOptions(this, options);
		this.callInitHooks();
	}

	/** Returns the position of the control. */
	getPosition() {
		return this.options.position;
	}

	/**
	 * Sets the position of the control.
	 * @param {ControlPosition} position
	 */
	setPosition(position) {
		const map = this._map;

		map?.removeControl(this);

		this.options.position = position;

		map?.addControl(this);

		return this;
	}

	/**
	 * Returns the HTMLElement that contains the control.
	 * @returns {HTMLElement | undefined}
	 */
	getContainer() {
		return this._container;
	}

	/**
	 * Adds the control to the given map.
	 * @param {LeafletMap} map
	 */
	addTo(map) {
		this.remove();
		this._map = map;

		const container = this._container = this.onAdd(map),
		pos = this.getPosition(),
		corner = map._controlCorners[pos];

		container.classList.add('leaflet-control');

		if (pos.includes('bottom')) {
			corner.prepend(container);
		} else {
			corner.append(container);
		}

		this._map.on('unload', this.remove, this);

		return this;
	}

	/** Removes the control from the map it is currently active on. */
	remove() {
		if (!this._map) {
			return this;
		}

		this._container.remove();

		this.onRemove?.(this._map);

		this._map.off('unload', this.remove, this);
		/** @type {any} */ (this)._map = null;

		return this;
	}
}

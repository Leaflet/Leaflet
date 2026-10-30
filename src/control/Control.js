
import {Class} from '../core/Class.js';
import * as Util from '../core/Util.js';

const defaultOptions = {
	/**
	 * The position of the control (one of the map corners). Possible values
	 * are `'topleft'`, `'topright'`, `'bottomleft'` or `'bottomright'`
	 */
	position: 'topright'
};

/**
 * Control is a base class for implementing map controls. Handles
 * positioning. All other controls extend from this class.
 * @categoryDescription Methods
 * Classes extending Control will inherit the following methods:
 */
export class Control extends Class {

	static initHooks = true;

	static defaultOptions = defaultOptions;


	constructor(options) {
		super();
		Util.setOptions(this, options);
		this.callInitHooks();
	}

	/**
	 * Returns the position of the control.
	 * @returns {string}
	 */
	getPosition() {
		return this.options.position;
	}

	/**
	 * Sets the position of the control.
	 * @param {string} position
	 * @returns {this}
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
	 * @returns {HTMLElement}
	 */
	getContainer() {
		return this._container;
	}

	/**
	 * Adds the control to the given map.
	 * @param {LeafletMap} map
	 * @returns {this}
	 */
	addTo(map) {
		this.remove();
		this._map = map;

		const container = this._container = this.onAdd(map),
		pos = this.getPosition(),
		corner = map._controlCorners[pos];

		container.classList.add('leaflet-control');

		if (pos.includes('bottom')) {
			corner.insertBefore(container, corner.firstChild);
		} else {
			corner.appendChild(container);
		}

		this._map.on('unload', this.remove, this);

		return this;
	}

	/**
	 * Removes the control from the map it is currently active on.
	 * @returns {this}
	 */
	remove() {
		if (!this._map) {
			return this;
		}

		this._container.remove();

		if (this.onRemove) {
			this.onRemove(this._map);
		}

		this._map.off('unload', this.remove, this);
		this._map = null;

		return this;
	}

	_refocusOnMap(e) {
		// We exclude keyboard-click event to keep the focus on the control for accessibility.
		// The position of keyboard-click events are x=0 and y=0.
		if (this._map && e && !(e.screenX === 0 && e.screenY === 0)) {
			this._map.getContainer().focus({preventScroll: true, focusVisible: false});
		}
	}
}

/**
 * Should return the container DOM element for the control and add listeners on
 * relevant map events. Called on [`control.addTo(map)`](#control-addTo).
 * @category Extension methods
 * @param {LeafletMap} map
 * @returns {HTMLElement}
 * @uninheritable
 */
/**
 * Optional method. Should contain all clean up code that removes the listeners previously
 * added in [`onAdd`](#control-onadd). Called on [`control.remove()`](#control-remove).
 * @category Extension methods
 * @param {LeafletMap} map
 * @uninheritable
 */

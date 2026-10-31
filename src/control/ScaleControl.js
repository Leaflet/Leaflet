import {Control} from './Control.js';
import * as DomUtil from '../dom/DomUtil.js';

/** @import {ControlOptions, Defaults, ScaleControlDefaults, ScaleControlOptions} from '../types.js' */
/** @import {LeafletMap} from '../map/Map.js' */

/** @satisfies {Defaults<ControlOptions>} */
const defaultOptions = {
	/**
	 * The position of the control (one of the map corners). Possible values
	 * are `'topleft'`, `'topright'`, `'bottomleft'` or `'bottomright'`
	 */
	position: 'bottomleft',

	/**
	 * Maximum width of the control in pixels. The width is set
	 * dynamically to show round values (e.g. 100, 200, 500).
	 */
	maxWidth: 100,

	/** Whether to show the metric scale line (m/km). */
	metric: true,

	/** Whether to show the imperial scale line (mi/ft). */
	imperial: true,

	/**
	 * If `true`, the control is updated on [`moveend`](#map-moveend), otherwise
	 * it's always up-to-date (updated on [`move`](#map-move)).
	 */
	updateWhenIdle: false
};

/** @typedef {typeof defaultOptions} ScaleControlDefaultsValues */

/**
 * A simple scale control that shows the scale of the current center of screen
 * in metric (m/km) and imperial (mi/ft) systems. Extends `Control`.
 * @example
 * ```js
 * new ScaleControl().addTo(map);
 * ```
 * @template {ScaleControlOptions} [O=ScaleControlOptions]
 * @extends {Control<O & ScaleControlDefaults>}
 */
export class ScaleControl extends Control {

	/** @type {Defaults<ScaleControlOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * @param {LeafletMap} map
	 * @returns {HTMLElement}
	 */
	onAdd(map) {
		const className = 'leaflet-control-scale',
		container = DomUtil.create('div', className),
		options = this.options;

		this._addScales(options, `${className}-line`, container);

		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		map.whenReady(this._update, this);

		return container;
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	}

	/**
	 * @param {ScaleControlOptions} options
	 * @param {string} className
	 * @param {HTMLElement} container
	 */
	_addScales(options, className, container) {
		if (options.metric) {
			/** @type {HTMLElement} */
			this._mScale = DomUtil.create('div', className, container);
		}
		if (options.imperial) {
			/** @type {HTMLElement} */
			this._iScale = DomUtil.create('div', className, container);
		}
	}

	_update() {
		const map = this._map,
		y = map.getSize().y / 2;

		const maxMeters = map.distance(
			map.containerPointToLatLng([0, y]),
			map.containerPointToLatLng([this.options.maxWidth, y]));

		this._updateScales(maxMeters);
	}

	/** @param {number} maxMeters */
	_updateScales(maxMeters) {
		if (this.options.metric && maxMeters) {
			this._updateMetric(maxMeters);
		}
		if (this.options.imperial && maxMeters) {
			this._updateImperial(maxMeters);
		}
	}

	/** @param {number} maxMeters */
	_updateMetric(maxMeters) {
		const meters = this._getRoundNum(maxMeters),
		label = meters < 1000 ? `${meters} m` : `${meters / 1000} km`;

		this._updateScale(this._mScale, label, meters / maxMeters);
	}

	/** @param {number} maxMeters */
	_updateImperial(maxMeters) {
		const maxFeet = maxMeters * 3.2808399;
		let maxMiles, miles, feet;

		if (maxFeet > 5280) {
			maxMiles = maxFeet / 5280;
			miles = this._getRoundNum(maxMiles);
			this._updateScale(this._iScale, `${miles} mi`, miles / maxMiles);

		} else {
			feet = this._getRoundNum(maxFeet);
			this._updateScale(this._iScale, `${feet} ft`, feet / maxFeet);
		}
	}

	/**
	 * @param {HTMLElement} scale
	 * @param {string} text
	 * @param {number} ratio
	 */
	_updateScale(scale, text, ratio) {
		scale.style.width = `${Math.round(this.options.maxWidth * ratio)}px`;
		scale.innerHTML = text;
	}

	/** @param {number} num */
	_getRoundNum(num) {
		const pow10 = 10 ** ((`${Math.floor(num)}`).length - 1);
		let d = num / pow10;

		d = d >= 10 ? 10 :
			d >= 5 ? 5 :
			d >= 3 ? 3 :
			d >= 2 ? 2 : 1;

		return pow10 * d;
	}
}

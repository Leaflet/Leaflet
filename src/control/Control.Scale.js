
import {Control} from './Control.js';
import * as DomUtil from '../dom/DomUtil.js';

/*
 * @class Control.Scale
 * @aka L.Control.Scale
 * @inherits Control
 *
 * A simple scale control that shows the scale of the current center of screen in metric (m/km) and imperial (mi/ft) systems. Extends `Control`.
 *
 * @example
 *
 * ```js
 * L.control.scale().addTo(map);
 * ```
 */

export const Scale = Control.extend({
	// @section
	// @aka Control.Scale options
	options: {
		// @option position: String = 'bottomleft'
		// The position of the control (one of the map corners). Possible values are `'topleft'`,
		// `'topright'`, `'bottomleft'` or `'bottomright'`
		position: 'bottomleft',

		// @option maxWidth: Number = 100
		// Maximum width of the control in pixels. The width is set dynamically to show round values (e.g. 100, 200, 500).
		maxWidth: 100,

		// @option metric: Boolean = True
		// Whether to show the metric scale line (m/km).
		metric: true,

		// @option imperial: Boolean = True
		// Whether to show the imperial scale line (mi/ft).
		imperial: true

		// @option updateWhenIdle: Boolean = false
		// If `true`, the control is updated on [`moveend`](#map-moveend), otherwise it's always up-to-date (updated on [`move`](#map-move)).
	},

	onAdd(map) {
		const className = 'leaflet-control-scale',
		    container = DomUtil.create('div', className),
		    options = this.options;

		this._addScales(options, `${className}-line`, container);

		map.on(options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
		map.whenReady(this._update, this);

		return container;
	},

	onRemove(map) {
		map.off(this.options.updateWhenIdle ? 'moveend' : 'move', this._update, this);
	},

	_addScales(options, className, container) {
		if (options.metric) {
			this._mScale = DomUtil.create('div', className, container);
		}
		if (options.imperial) {
			this._iScale = DomUtil.create('div', className, container);
		}
	},

	_update() {
		const map = this._map,
		    y = map.getSize().y / 2;

		const maxMeters = map.distance(
			map.containerPointToLatLng([0, y]),
			map.containerPointToLatLng([this.options.maxWidth, y]));

		this._updateScales(maxMeters);
	},

	_updateScales(maxMeters) {
		if (this.options.metric && maxMeters) {
			this._updateMetric(maxMeters);
		}
		if (this.options.imperial && maxMeters) {
			this._updateImperial(maxMeters);
		}
	},

	_updateMetric(maxMeters) {
		const meters = this._getRoundNum(maxMeters),
		    label = meters < 1000 ? `${meters} m` : `${meters / 1000} km`;

		this._updateScale(this._mScale, label, meters / maxMeters);
	},

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
	},

	_updateScale(scale, text, ratio) {
		scale.style.width = `${Math.round(this.options.maxWidth * ratio)}px`;
		scale.innerHTML = text;
	},

	_getRoundNum(num) {
		const pow10 = Math.pow(10, (`${Math.floor(num)}`).length - 1);
		let d = num / pow10;

		d = d >= 10 ? 10 :
		    d >= 5 ? 5 :
		    d >= 3 ? 3 :
		    d >= 2 ? 2 : 1;

		return pow10 * d;
	}
});


// @factory L.control.scale(options?: Control.Scale options)
// Creates an scale control with the given options.
export const scale = function (options) {
	return new Scale(options);
};

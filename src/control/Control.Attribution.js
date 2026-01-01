
import {Control} from './Control.js';
import {LeafletMap} from '../map/Map.js';
import * as Util from '../core/Util.js';
import * as DomEvent from '../dom/DomEvent.js';
import * as DomUtil from '../dom/DomUtil.js';

const ukrainianFlag = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>';


/*
 * @class Control.Attribution
 * @inherits Control
 *
 * The attribution control allows you to display attribution data in a small text box on a map. It is put on the map by default unless you set its [`attributionControl` option](#map-attributioncontrol) to `false`, and it fetches attribution texts from layers with the [`getAttribution` method](#layer-getattribution) automatically. Extends Control.
 */

// @namespace Control.Attribution
// @constructor Control.Attribution(options: Control.Attribution options)
// Creates an attribution control.
export class Attribution extends Control {

	static {
		// @section
		// @aka Control.Attribution options
		this.setDefaultOptions({
			// @option position: String = 'bottomright'
			// The position of the control (one of the map corners). Possible values are `'topleft'`,
			// `'topright'`, `'bottomleft'` or `'bottomright'`
			position: 'bottomright',

			// @option prefix: String|false = 'Leaflet'
			// The HTML text shown before the attributions. Pass `false` to disable.
			prefix: `<a target="_blank" href="https://leafletjs.com" title="A JavaScript library for interactive maps">${ukrainianFlag}Leaflet</a>`
		});
	}

	constructor(options) {
		super();
		Util.setOptions(this, options);

		this._attributions = {};
	}

	onAdd(map) {
		map.attributionControl = this;
		this._container = DomUtil.create('div', 'leaflet-control-attribution');
		DomEvent.disableClickPropagation(this._container);

		// TODO ugly, refactor
		for (const layer of Object.values(map._layers)) {
			if (layer.getAttribution) {
				this.addAttribution(layer.getAttribution());
			}
		}

		this._update();

		map.on('layeradd', this._addAttribution, this);

		return this._container;
	}

	onRemove(map) {
		map.off('layeradd', this._addAttribution, this);
	}

	_addAttribution(ev) {
		if (ev.layer.getAttribution) {
			this.addAttribution(ev.layer.getAttribution());
			ev.layer.once('remove', () => this.removeAttribution(ev.layer.getAttribution()));
		}
	}

	// @method setPrefix(prefix: String|false): this
	// The HTML text shown before the attributions. Pass `false` to disable.
	setPrefix(prefix) {
		this.options.prefix = prefix;
		this._update();
		return this;
	}

	// @method addAttribution(text: String): this
	// Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
	addAttribution(text) {
		if (!text) { return this; }

		if (!this._attributions[text]) {
			this._attributions[text] = 0;
		}
		this._attributions[text]++;

		this._update();

		return this;
	}

	// @method removeAttribution(text: String): this
	// Removes an attribution text.
	removeAttribution(text) {
		if (!text) { return this; }

		if (this._attributions[text]) {
			this._attributions[text]--;
			this._update();
		}

		return this;
	}

	_update() {
		if (!this._map) { return; }

		const attribs = Object.keys(this._attributions).filter(i => this._attributions[i]);

		const prefixAndAttribs = [];

		if (this.options.prefix) {
			prefixAndAttribs.push(this.options.prefix);
		}
		if (attribs.length) {
			prefixAndAttribs.push(attribs.join(', '));
		}

		this._container.innerHTML = prefixAndAttribs.join(' <span aria-hidden="true">|</span> ');
	}
}

// @namespace LeafletMap
// @section Control options
// @option attributionControl: Boolean = true
// Whether a [attribution control](#control-attribution) is added to the map by default.
LeafletMap.mergeOptions({
	attributionControl: true
});

LeafletMap.addInitHook(function () {
	if (this.options.attributionControl) {
		new Attribution().addTo(this);
	}
});

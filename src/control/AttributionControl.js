import {Control} from './Control.js';
import * as DomEvent from '../dom/DomEvent.js';
import * as DomUtil from '../dom/DomUtil.js';

/** @import {AttributionControlOptions, ControlOptions, Defaults} from '../types.js' */
/** @import {LayerBase} from '../layer/LayerBase.js' */
/** @import {LeafletMap} from '../map/Map.js' */

const ukrainianFlag = '<svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="12" height="8" viewBox="0 0 12 8" class="leaflet-attribution-flag"><path fill="#4C7BE1" d="M0 0h12v4H0z"/><path fill="#FFD500" d="M0 4h12v3H0z"/><path fill="#E0BC00" d="M0 7h12v1H0z"/></svg>';

/** @satisfies {Defaults<ControlOptions>} */
const defaultOptions = {
	/**
	 * The position of the control (one of the map corners). Possible values
	 * are `'topleft'`, `'topright'`, `'bottomleft'` or `'bottomright'`
	 */
	position: 'bottomright',

	/**
	 * The HTML text shown before the attributions. Pass `false` to disable.
	 * @type {string | false}
	 */
	prefix: `<a target="_blank" href="https://leafletjs.com" title="A JavaScript library for interactive maps">${ukrainianFlag}Leaflet</a>`
};

/** @typedef {typeof defaultOptions} AttributionControlDefaults */

/**
 * The attribution control allows you to display attribution data in a small text box on a map. It is put
 * on the map by default unless you set its [`attributionControl` option](#map-attributioncontrol) to
 * `false`, and it fetches attribution texts from layers with the [`getAttribution`
 * method](#layer-getattribution) automatically. Extends `Control`.
 * @template {AttributionControlOptions} [O=AttributionControlOptions]
 * @extends {Control<O>}
 */
export class AttributionControl extends Control {

	static initHooks = true;

	/** @type {Defaults<AttributionControlOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Creates an attribution control.
	 * @param {Partial<O>} [options]
	 */
	constructor(options) {
		super(options);

		/** @type {{[text: string]: number}} */
		this._attributions = {};
		/** @type {Map<LayerBase, string>} */
		this._layerAttributions = new Map();
		this.callInitHooks();
	}

	/** @param {LeafletMap} map */
	onAdd(map) {
		map.attributionControl = this;
		this._container = DomUtil.create('div', 'leaflet-control-attribution');
		DomEvent.disableClickPropagation(this._container);

		// before the map is loaded, layers already added to it will still fire layeradd once it loads
		if (map._loaded) {
			map.eachLayer(layer => this._addLayer({layer}));
		}

		this._update();

		map.on({layeradd: this._addLayer, layerremove: this._removeLayer}, this);

		return this._container;
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		map.off({layeradd: this._addLayer, layerremove: this._removeLayer}, this);

		for (const layer of this._layerAttributions.keys()) {
			this._removeLayer({layer});
		}
	}

	/** @param {{layer: LayerBase}} e */
	_addLayer({layer}) {
		const text = layer.getAttribution?.();
		if (!text || this._layerAttributions.has(layer)) { return; }

		this._layerAttributions.set(layer, text);
		this.addAttribution(text);
	}

	/** @param {{layer: LayerBase}} e */
	_removeLayer({layer}) {
		// a layer without an attribution has no entry here, and `removeAttribution` skips the `undefined`
		this.removeAttribution(/** @type {string} */ (this._layerAttributions.get(layer)));
		this._layerAttributions.delete(layer);
	}

	/**
	 * Sets the HTML text shown before the attributions. Pass `false` to disable.
	 * @param {string | false} prefix
	 */
	setPrefix(prefix) {
		this.options.prefix = prefix;
		this._update();
		return this;
	}

	/**
	 * Adds an attribution text (e.g. `'&copy; OpenStreetMap contributors'`).
	 * @param {string} text
	 */
	addAttribution(text) {
		if (!text) { return this; }

		if (!this._attributions[text]) {
			this._attributions[text] = 0;
		}
		this._attributions[text]++;

		this._update();

		return this;
	}

	/**
	 * Removes an attribution text.
	 * @param {string} text
	 */
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

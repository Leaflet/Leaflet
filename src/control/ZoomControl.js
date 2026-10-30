
import {Control} from './Control.js';
import * as DomUtil from '../dom/DomUtil.js';
import * as DomEvent from '../dom/DomEvent.js';

const defaultOptions = {
	/**
	 * The position of the control (one of the map corners). Possible values
	 * are `'topleft'`, `'topright'`, `'bottomleft'` or `'bottomright'`
	 */
	position: 'topleft',

	/** The text set on the 'zoom in' button. */
	zoomInText: '<span aria-hidden="true">+</span>',

	/** The title set on the 'zoom in' button. */
	zoomInTitle: 'Zoom in',

	/** </span>' The text set on the 'zoom out' button. */
	zoomOutText: '<span aria-hidden="true">&#x2212;</span>',

	/** The title set on the 'zoom out' button. */
	zoomOutTitle: 'Zoom out'
};

/**
 * Creates a zoom control
 * @param {ZoomControlOptions} options
 */

/**
 * A basic zoom control with two buttons (zoom in and zoom out). It is put on the map by default
 * unless you set its [`zoomControl` option](#map-zoomcontrol) to `false`. Extends `Control`.
 */
export class ZoomControl extends Control {

	static defaultOptions = defaultOptions;

	onAdd(map) {
		const zoomName = 'leaflet-control-zoom',
		container = DomUtil.create('div', `${zoomName} leaflet-bar`),
		options = this.options;

		this._zoomInButton  = this._createButton(options.zoomInText, options.zoomInTitle,
			`${zoomName}-in`,  container, e => this._zoom(e, 1));
		this._zoomOutButton = this._createButton(options.zoomOutText, options.zoomOutTitle,
			`${zoomName}-out`, container, e => this._zoom(e, -1));

		this._updateDisabled();
		map.on('zoomend zoomlevelschange', this._updateDisabled, this);

		return container;
	}

	onRemove(map) {
		map.off('zoomend zoomlevelschange', this._updateDisabled, this);
	}

	disable() {
		this._disabled = true;
		this._updateDisabled();
		return this;
	}

	enable() {
		this._disabled = false;
		this._updateDisabled();
		return this;
	}

	_zoom(e, dir) {
		const map = this._map;
		if (!this._disabled && (dir > 0 ? map._zoom < map.getMaxZoom() : map._zoom > map.getMinZoom())) {
			map.zoomIn(dir * map.options.zoomDelta * (e.shiftKey ? 3 : 1));
		}
	}

	_createButton(html, title, className, container, fn) {
		const link = DomUtil.create('a', className, container);
		link.innerHTML = html;
		link.href = '#';
		link.title = title;

		/*
		 * Will force screen readers like VoiceOver to read this as "Zoom in - button"
		 */
		link.setAttribute('role', 'button');
		link.setAttribute('aria-label', title);

		DomEvent.disableClickPropagation(link);
		DomEvent.on(link, 'click', (e) => {
			DomEvent.stop(e);
			fn.call(this, e);
			this._refocusOnMap(e);
		});

		return link;
	}

	_updateDisabled() {
		const map = this._map;
		for (const [button, limit] of [[this._zoomInButton, map.getMaxZoom()], [this._zoomOutButton, map.getMinZoom()]]) {
			const disabled = this._disabled || map._zoom === limit;
			button.classList.toggle('leaflet-disabled', disabled);
			button.setAttribute('aria-disabled', disabled);
		}
	}
}

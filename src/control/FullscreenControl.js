import {Control} from './Control.js';
import * as DomUtil from '../dom/DomUtil.js';
import * as DomEvent from '../dom/DomEvent.js';

/** @import {ControlOptions, Defaults, FullscreenControlDefaults, FullscreenControlOptions} from '../types.js' */
/** @import {LeafletMap} from '../map/Map.js' */

/** @satisfies {Defaults<ControlOptions>} */
const defaultOptions = {
	/**
	 * The position of the control (one of the map corners). Possible values
	 * are `'topleft'`, `'topright'`, `'bottomleft'` or `'bottomright'`
	 */
	position: 'topleft',

	/** The text set on the button while the map is not fullscreen. */
	enterText: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 5V1h4m4 0h4v4m0 4v4H9m-4 0H1V9"/></svg>',

	/** The title set on the button while the map is not fullscreen. */
	enterTitle: 'Enter fullscreen',

	/** The text set on the button while the map is fullscreen. */
	exitText: '<svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M5 1v4H1m8-4v4h4m0 4H9v4m-4 0V9H1"/></svg>',

	/** The title set on the button while the map is fullscreen. */
	exitTitle: 'Exit fullscreen',

	/**
	 * The element to make fullscreen, e.g. a parent that also holds a sidebar. Defaults to the map container.
	 * @type {HTMLElement | undefined}
	 */
	container: undefined,

	/**
	 * Whether to always fill the window with CSS instead of using the Fullscreen API. The control falls back to
	 * this where the API isn't available, e.g. on iPhone or in an iframe without `allow="fullscreen"`.
	 */
	pseudo: false
};

/** @typedef {typeof defaultOptions} FullscreenControlDefaultsValues */

/**
 * A button that toggles fullscreen mode for the map, using the Fullscreen API where available and filling the
 * window otherwise. The map fires `enterfullscreen` and `exitfullscreen` when the mode changes. Extends `Control`.
 *
 * @example
 * ```js
 * new FullscreenControl().addTo(map);
 * ```
 * @template {FullscreenControlOptions} [O=FullscreenControlOptions]
 * @extends {Control<O & FullscreenControlDefaults>}
 */
export class FullscreenControl extends Control {

	/** @type {Defaults<FullscreenControlOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * @param {LeafletMap} map
	 * @returns {HTMLElement}
	 */
	onAdd(map) {
		const container = DomUtil.create('div', 'leaflet-control-fullscreen leaflet-bar'),
		link = this._link = DomUtil.create('a', '', container);

		link.href = '#';
		link.setAttribute('role', 'button');

		/** @type {HTMLElement} */
		this._target = this.options.container ?? map.getContainer();
		/** @type {boolean} */
		this._fullscreen = false;
		this._update();

		DomEvent.disableClickPropagation(link);
		DomEvent.on(link, 'click', (e) => {
			DomEvent.stop(e);
			this.toggle();
			this._refocusOnMap(/** @type {MouseEvent} */ (e));
		});
		DomEvent.on(this._target, 'fullscreenchange', this._onFullscreenChange, this);

		return container;
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		// a native exit fires fullscreenchange after the listener below is gone, so reset the state synchronously
		this.setFullscreen(false);
		this._setPseudo(false);
		DomEvent.off(this._target, 'fullscreenchange', this._onFullscreenChange, this);
	}

	/** Returns `true` if the map is in fullscreen mode. */
	isFullscreen() {
		return this._fullscreen;
	}

	/** Enters fullscreen mode, or exits it if the map is already fullscreen. */
	toggle() {
		return this.setFullscreen(!this._fullscreen);
	}

	/**
	 * Enters fullscreen mode if `on` is `true`, or exits it otherwise. Does nothing if the map is already in that mode.
	 * @param {boolean} on
	 */
	setFullscreen(on) {
		if (on === this._fullscreen) { return this; }
		if (!on) {
			if (this._pseudo) { this._setPseudo(false); } else { document.exitFullscreen(); }
		} else if (this.options.pseudo || !document.fullscreenEnabled) {
			this._setPseudo(true);
		} else {
			this._target.requestFullscreen().catch(() => this._setPseudo(true));
		}
		return this;
	}

	/** @param {boolean} on */
	_setPseudo(on) {
		this._pseudo = on;
		this._target.classList.toggle('leaflet-pseudo-fullscreen', on);
		(on ? DomEvent.on : DomEvent.off)(document, 'keydown', this._onKeyDown, this);
		this._setFullscreen(on);
	}

	/** @param {KeyboardEvent} e */
	_onKeyDown(e) {
		// a popup closed by the same Escape prevents default first, since the map container is below the document
		if (e.key === 'Escape' && !e.defaultPrevented) { this._setPseudo(false); }
	}

	_onFullscreenChange() {
		this._setFullscreen(document.fullscreenElement === this._target);
	}

	/** @param {boolean} on */
	_setFullscreen(on) {
		if (on === this._fullscreen) { return; }
		this._fullscreen = on;
		this._update();
		this._map.fire(on ? 'enterfullscreen' : 'exitfullscreen');
	}

	_update() {
		const link = /** @type {HTMLAnchorElement} */ (this._link),
		{options} = this,
		title = this._fullscreen ? options.exitTitle : options.enterTitle;

		link.innerHTML = this._fullscreen ? options.exitText : options.enterText;
		link.title = title;
		link.setAttribute('aria-label', title);
		this._map.getContainer().classList.toggle('leaflet-fullscreen-on', this._fullscreen);
	}
}

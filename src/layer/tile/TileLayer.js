import {GridLayer} from './GridLayer.js';
import * as Util from '../../core/Util.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {Point} from '../../geometry/Point.js';

/** @import {Coords, Defaults, DoneCallback, GridLayerOptions, TileEvent, TileLayerDefaults, TileLayerEventMap,
 *    TileLayerOptions} from '../../types.js' */

/** @satisfies {Defaults<GridLayerOptions>} */
const defaultOptions = {
	/** The minimum zoom level down to which this layer will be displayed (inclusive). */
	minZoom: 0,

	/** The maximum zoom level up to which this layer will be displayed (inclusive). */
	maxZoom: 18,

	/**
	 * Subdomains of the tile service. Can be passed in the form of one string
	 * (where each letter is a subdomain name) or an array of strings.
	 * @type {string | string[]}
	 */
	subdomains: 'abc',

	/** URL to the tile image to show in place of the tile that failed to load. */
	errorTileUrl: '',

	/** The zoom number used in tile URLs will be offset with this value. */
	zoomOffset: 0,

	/**
	 * If `true`, inverses Y axis numbering for tiles (turn this on for
	 * [TMS](https://en.wikipedia.org/wiki/Tile_Map_Service) services).
	 */
	tms: false,

	/** If set to true, the zoom number used in tile URLs will be reversed (`maxZoom - zoom` instead of `zoom`) */
	zoomReverse: false,

	/**
	 * If `true` and user is on a retina display, it will request four tiles of half the specified
	 * size and a bigger zoom level in place of one to utilize the high resolution.
	 */
	detectRetina: false,

	/**
	 * Whether the crossOrigin attribute will be added to the tiles. If a String is provided,
	 * all tiles will have their crossOrigin attribute set to the String provided. This is needed
	 * if you want to access tile pixel data. Refer to [CORS
	 * Settings](https://developer.mozilla.org/en-US/docs/Web/HTML/CORS_settings_attributes) for valid String values.
	 * @type {boolean | string}
	 */
	crossOrigin: false,

	/**
	 * Sets the tiles' `referrerPolicy` attribute set to the String provided. See
	 * [`HTMLImageElement.referrerPolicy`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLImageElement/referrerPolicy)
	 * for possible values.
	 *
	 * Tile providers might require you to use a specific referrer policy (e.g. to verify API tokens or
	 * prevent abuse). Specifically, if you are using tiles from `tile.openstreetmap.org` or `tile.osm.org`,
	 * you [should not change this value](https://operations.osmfoundation.org/policies/tiles/).
	 * @type {ReferrerPolicy | false}
	 */
	referrerPolicy: 'strict-origin-when-cross-origin'
};

/** @typedef {typeof defaultOptions} TileLayerDefaultsValues */

const osmHosts = ['tile.openstreetmap.org', 'tile.osm.org'];
const hostRe = /^(https?:)?\/\/([^/?#:]*)/i;
const httpRe = /^http:/i;

/** @param {string} url */
function isOSMUrl(url) {
	const host = hostRe.exec(url)?.[2] ?? '';
	return osmHosts.some(osmHost => host === osmHost || host.endsWith(`.${osmHost}`));
}

// OSM tiles are upgraded to HTTPS so that the referrer policy works
const upgradeOSMUrl = (/** @type {string} */ url) => (isOSMUrl(url) ? url.replace(httpRe, 'https:') : url);

/**
 * @typedef {Object} TileLayerEvents
 * @property {TileEvent} tileabort Fired when a tile was loading but is now not wanted.
 */

/**
 * Used to load and display tile layers on the map. Note that most tile servers
 * require attribution, which you can set under `Layer`. Extends `GridLayer`.
 * @example
 * ```js
 * new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {foo: 'bar', attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
 * ```
 * @example <caption>URL template</caption>
 * A string of the following form:
 *
 * ```
 * 'https://{s}.somedomain.com/blabla/{z}/{x}/{y}{r}.png'
 * ```
 *
 * `{s}` means one of the available subdomains (used sequentially to help with browser parallel requests per domain limitation; subdomain values are specified in options; `a`, `b` or `c` by default, can be omitted), `{z}` — zoom level, `{x}` and `{y}` — tile coordinates. `{r}` can be used to add "&commat;2x" to the URL to load retina tiles.
 *
 * You can use custom keys in the template, which will be [evaluated](#util-template) from TileLayer options, like this:
 *
 * ```
 * new TileLayer('https://{s}.somedomain.com/{foo}/{z}/{x}/{y}.png', {foo: 'bar'});
 * ```
 * @template {TileLayerOptions} [O=TileLayerOptions]
 * @template {TileLayerEventMap} [E=TileLayerEventMap]
 * @extends {GridLayer<O & TileLayerDefaults, E>}
 */
export class TileLayer extends GridLayer {

	static initHooks = true;

	/** @type {Defaults<TileLayerOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Instantiates a tile layer object given a `URL template` and optionally an options object.
	 * @category URL template
	 * @param {string} url
	 * @param {NoInfer<Partial<O>>} [options]
	 */
	constructor(url, options) {
		super(/** @type {Partial<O & TileLayerDefaults>} */ (options));

		options = Util.setOptions(this, options);

		// Set required OpenStreetMap attribution if it hasn't been specified
		if (isOSMUrl(url) && options.attribution === null) {
			options.attribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
		}
		this._url = upgradeOSMUrl(url);

		// detecting retina displays, adjusting tileSize and zoom levels
		if (this.options.detectRetina && window.devicePixelRatio > 1 && this.options.maxZoom > 0) {

			const tileSize = this.options.tileSize;
			this.options.tileSize = tileSize instanceof Point ? tileSize.divideBy(2).floor() : Math.floor(tileSize / 2);

			if (!this.options.zoomReverse) {
				this.options.zoomOffset++;
				this.options.maxZoom = Math.max(this.options.minZoom, this.options.maxZoom - 1);
			} else {
				this.options.zoomOffset--;
				this.options.minZoom = Math.min(this.options.maxZoom, this.options.minZoom + 1);
			}

			this.options.minZoom = Math.max(0, this.options.minZoom);
		} else if (!this.options.zoomReverse) {
			// make sure maxZoom is gte minZoom
			this.options.maxZoom = Math.max(this.options.minZoom, this.options.maxZoom);
		} else {
			// make sure minZoom is lte maxZoom
			this.options.minZoom = Math.min(this.options.maxZoom, this.options.minZoom);
		}

		if (typeof this.options.subdomains === 'string') {
			this.options.subdomains = this.options.subdomains.split('');
		}

		this.callInitHooks();
	}

	/**
	 * Updates the layer's URL template and redraws it (unless `noRedraw` is set to `true`). If the URL
	 * does not change, the layer will not be redrawn unless the noRedraw parameter is set to false.
	 * @param {string} url
	 * @param {boolean} [noRedraw]
	 */
	setUrl(url, noRedraw) {
		url = upgradeOSMUrl(url);

		if (this._url === url && noRedraw === undefined) {
			noRedraw = true;
		}

		this._url = url;

		if (!noRedraw) {
			this.redraw();
		}
		return this;
	}

	/**
	 * Called only internally, overrides GridLayer's [`createTile()`](#gridlayer-createtile)
	 * to return an `<img>` HTML element with the appropriate image URL given `coords`.
	 * The `done` callback is called when the tile has been loaded.
	 * @param {Coords} coords
	 * @param {DoneCallback} done
	 * @returns {HTMLElement}
	 */
	createTile(coords, done) {
		const tile = document.createElement('img');

		DomEvent.on(tile, 'load', this._tileOnLoad.bind(this, done, tile));
		DomEvent.on(tile, 'error', this._tileOnError.bind(this, done, tile));

		if (this.options.crossOrigin || this.options.crossOrigin === '') {
			tile.crossOrigin = /** @type {HTMLImageElement['crossOrigin']} */ (this.options.crossOrigin === true ? '' : this.options.crossOrigin);
		}

		// for this new option we follow the documented behavior
		// more closely by only setting the property when string
		if (typeof this.options.referrerPolicy === 'string') {
			tile.referrerPolicy = this.options.referrerPolicy;
		}

		// The alt attribute is set to the empty string,
		// allowing screen readers to ignore the decorative image tiles.
		// https://www.w3.org/WAI/tutorials/images/decorative/
		// https://www.w3.org/TR/html-aria/#el-img-empty-alt
		tile.alt = '';

		tile.src = this.getTileUrl(coords);

		return tile;
	}

	/**
	 * Called only internally, returns the URL for a tile given its coordinates. Classes extending
	 * `TileLayer` can override this function to provide custom tile URL naming schemes.
	 * @category Extension methods
	 * @param {Coords} coords
	 * @uninheritable
	 */
	getTileUrl(coords) {
		const data = Object.create(this.options);
		Object.assign(data, {
			r: window.devicePixelRatio > 1 ? '@2x' : '',
			s: this._getSubdomain(coords),
			x: coords.x,
			y: coords.y,
			z: this._getZoomForUrl()
		});
		if (this._map && !(this._map.options.crs.infinite)) {
			const invertedY = this._globalTileRange.max.y - coords.y;
			if (this.options.tms) {
				data['y'] = invertedY;
			}
			data['-y'] = invertedY;
		}

		return Util.template(this._url, data);
	}

	/**
	 * @param {DoneCallback} done
	 * @param {HTMLImageElement} tile
	 */
	_tileOnLoad(done, tile) {
		done(null, tile);
	}

	/**
	 * @param {DoneCallback} done
	 * @param {HTMLImageElement} tile
	 * @param {Event} e
	 */
	_tileOnError(done, tile, e) {
		const errorUrl = this.options.errorTileUrl,
		src = tile.getAttribute('src');
		// removed tiles get an empty src to cancel their request, which fires error too
		if (errorUrl && src !== errorUrl && (src || tile.isConnected)) {
			tile.src = errorUrl;
		}
		done(e, tile);
	}

	_getZoomForUrl() {
		let zoom = /** @type {number} */ (this._tileZoom);
		const maxZoom = this.options.maxZoom,
		zoomReverse = this.options.zoomReverse,
		zoomOffset = this.options.zoomOffset;

		if (zoomReverse) {
			zoom = maxZoom - zoom;
		}

		return zoom + zoomOffset;
	}

	/** @param {Point} tilePoint */
	_getSubdomain(tilePoint) {
		const {subdomains} = this.options;
		return subdomains?.[Math.abs(tilePoint.x + tilePoint.y) % subdomains.length];
	}

	// stops loading all tiles in the background layer
	_abortLoading() {
		let i, tile;
		for (i of Object.keys(this._tiles)) {
			if (this._tiles[i].coords.z !== this._tileZoom) {
				tile = /** @type {HTMLImageElement} */ (this._tiles[i].el);

				if (!tile.complete) {
					tile.setAttribute('src', '');
					const coords = this._tiles[i].coords;
					tile.remove();
					delete this._tiles[i];
					this.fire('tileabort', {
						tile,
						coords
					});
				}
			}
		}
	}

	/** @param {string} key */
	_removeTile(key) {
		const tile = this._tiles[key];
		if (!tile) { return; }

		// Cancels any pending http requests associated with the tile
		tile.el.setAttribute('src', '');

		return super._removeTile(key);
	}

	/**
	 * @param {Coords} coords
	 * @param {unknown} [err]
	 * @param {HTMLElement} [tile]
	 */
	_tileReady(coords, err, tile) {
		if (!this._map || (tile && tile.getAttribute('src') === '')) {
			return;
		}

		return super._tileReady(coords, err, tile);
	}

	/** @param {number} zoom */
	_clampZoom(zoom) {
		return Math.round(super._clampZoom(zoom));
	}
}

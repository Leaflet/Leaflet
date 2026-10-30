import {TileLayer} from './TileLayer.js';
import {EPSG4326} from '../../geo/crs/EPSG4326.js';
import {Bounds} from '../../geometry/Bounds.js';

const defaultWmsParams = {
	service: 'WMS',
	request: 'GetMap',

	/** **(required)** Comma-separated list of WMS layers to show. */
	layers: '',

	/** Comma-separated list of WMS styles. */
	styles: '',

	/** WMS image format (use `'image/png'` for layers with transparency). */
	format: 'image/jpeg',

	/** If `true`, the WMS service will return images with transparency. */
	transparent: false,

	/** Version of the WMS service to use */
	version: '1.1.1'
};

const defaultOptions = {
	/**
	 * Coordinate Reference System to use for the WMS requests, defaults
	 * to map CRS. Don't change this if you're not sure what it means.
	 * @type {CRS}
	 */
	crs: null,

	/** If `true`, WMS request parameter keys will be uppercase. */
	uppercase: false
};

/**
 * Used to display [WMS](https://en.wikipedia.org/wiki/Web_Map_Service)
 * services as tile layers on the map. Extends `TileLayer`.
 * @example
 * ```js
 * const nexrad = new WMSTileLayer("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
 * 	layers: 'nexrad-n0r-900913',
 * 	format: 'image/png',
 * 	transparent: true,
 * 	attribution: "Weather data © 2012 IEM Nexrad"
 * });
 * ```
 */
export class WMSTileLayer extends TileLayer {

	static initHooks = true;

	static defaultWmsParams = defaultWmsParams;

	static defaultOptions = defaultOptions;

	/**
	 * Instantiates a WMS tile layer object given a base URL of the WMS service and a WMS parameters/options object.
	 * @param {string} baseUrl
	 * @param {WMSTileLayerOptions} options
	 */
	constructor(url, options) {
		super(url, options);

		const wmsParams = {...WMSTileLayer.defaultWmsParams};

		// Options that are unknown in the defaults chain are considered WMS params.
		for (const [key, value] of Object.entries(options)) {
			if (!(key in WMSTileLayer.defaultOptions)) {
				wmsParams[key] = value;
			}
		}

		const realRetina = this.options.detectRetina && window.devicePixelRatio > 1 ? 2 : 1;
		const tileSize = this.getTileSize();

		wmsParams.width = tileSize.x * realRetina;
		wmsParams.height = tileSize.y * realRetina;

		this.wmsParams = wmsParams;

		this.callInitHooks();
	}

	onAdd(map) {

		this._crs = this.options.crs ?? map.options.crs;
		this._updateCrsParam();

		super.onAdd(map);
	}

	_updateCrsParam() {
		this._wmsVersion = parseFloat(this.wmsParams.version);

		delete this.wmsParams.srs;
		delete this.wmsParams.crs;
		this.wmsParams[this._wmsVersion >= 1.3 ? 'crs' : 'srs'] = this._crs.code;
	}

	getTileUrl(coords) {

		const tileBounds = this._tileCoordsToNwSe(coords),
		crs = this._crs,
		bounds = new Bounds(crs.project(tileBounds[0]), crs.project(tileBounds[1])),
		min = bounds.min,
		max = bounds.max,
		bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ?
			[min.y, min.x, max.y, max.x] :
			[min.x, min.y, max.x, max.y]).join(',');
		const url = new URL(super.getTileUrl(coords), document.baseURI);
		for (const [k, v] of Object.entries({...this.wmsParams, bbox})) {
			url.searchParams.append(this.options.uppercase ? k.toUpperCase() : k, `${v}`);
		}
		return url.toString();
	}

	/**
	 * Merges an object with the new parameters and re-requests tiles
	 * on the current screen (unless `noRedraw` was set to true).
	 * @param {object} params
	 * @param {boolean} [noRedraw]
	 * @returns {this}
	 */
	setParams(params, noRedraw) {

		Object.assign(this.wmsParams, params);

		if (this._crs) { this._updateCrsParam(); }

		if (!noRedraw) {
			this.redraw();
		}

		return this;
	}
}

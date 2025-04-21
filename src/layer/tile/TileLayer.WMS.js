import {TileLayer} from './TileLayer.js';
import {setOptions} from '../../core/Util.js';
import Browser from '../../core/Browser.js';
import {EPSG4326} from '../../geo/crs/CRS.EPSG4326.js';
import {Bounds} from '../../geometry/Bounds.js';

/*
 * @class TileLayer.WMS
 * @inherits TileLayer
 * Used to display [WMS](https://en.wikipedia.org/wiki/Web_Map_Service) services as tile layers on the map. Extends `TileLayer`.
 *
 * @example
 *
 * ```js
 * const nexrad = new TileLayer.wms("http://mesonet.agron.iastate.edu/cgi-bin/wms/nexrad/n0r.cgi", {
 * 	layers: 'nexrad-n0r-900913',
 * 	format: 'image/png',
 * 	transparent: true,
 * 	attribution: "Weather data © 2012 IEM Nexrad"
 * });
 * ```
 */

// @constructor TileLayer.WMS(baseUrl: String, options: TileLayer.WMS options)
// Instantiates a WMS tile layer object given a base URL of the WMS service and a WMS parameters/options object.
export const TileLayerWMS = TileLayer.extend({

	// @section
	// @aka TileLayer.WMS options
	// If any custom options not documented here are used, they will be sent to the
	// WMS server as extra parameters in each request URL. This can be useful for
	// [non-standard vendor WMS parameters](https://docs.geoserver.org/stable/en/user/services/wms/vendor.html).
	defaultWmsParams: {
		service: 'WMS',
		request: 'GetMap',

		// @option layers: String = ''
		// **(required)** Comma-separated list of WMS layers to show.
		layers: '',

		// @option styles: String = ''
		// Comma-separated list of WMS styles.
		styles: '',

		// @option format: String = 'image/jpeg'
		// WMS image format (use `'image/png'` for layers with transparency).
		format: 'image/jpeg',

		// @option transparent: Boolean = false
		// If `true`, the WMS service will return images with transparency.
		transparent: false,

		// @option version: String = '1.1.1'
		// Version of the WMS service to use
		version: '1.1.1'
	},

	options: {
		// @option crs: CRS = null
		// Coordinate Reference System to use for the WMS requests, defaults to
		// map CRS. Don't change this if you're not sure what it means.
		crs: null,

		// @option uppercase: Boolean = false
		// If `true`, WMS request parameter keys will be uppercase.
		uppercase: false
	},

	initialize(url, options) {

		this._url = url;

		const wmsParams = {...this.defaultWmsParams};

		// all keys that are not TileLayer options go to WMS params
		for (const i of Object.keys(options)) {
			if (!Object.keys(this.options).includes(i)) {
				wmsParams[i] = options[i];
			}
		}

		options = setOptions(this, options);

		const realRetina = options.detectRetina && Browser.retina ? 2 : 1;
		const tileSize = this.getTileSize();
		wmsParams.width = tileSize.x * realRetina;
		wmsParams.height = tileSize.y * realRetina;

		this.wmsParams = wmsParams;
	},

	onAdd(map) {

		this._crs = this.options.crs ?? map.options.crs;
		this._wmsVersion = parseFloat(this.wmsParams.version);

		const projectionKey = this._wmsVersion >= 1.3 ? 'crs' : 'srs';
		this.wmsParams[projectionKey] = this._crs.code;

		TileLayer.prototype.onAdd.call(this, map);
	},

	getTileUrl(coords) {

		const tileBounds = this._tileCoordsToNwSe(coords),
		    crs = this._crs,
		    bounds = new Bounds(crs.project(tileBounds[0]), crs.project(tileBounds[1])),
		    min = bounds.min,
		    max = bounds.max,
		    bbox = (this._wmsVersion >= 1.3 && this._crs === EPSG4326 ?
		    [min.y, min.x, max.y, max.x] :
		    [min.x, min.y, max.x, max.y]).join(',');
		const url = new URL(TileLayer.prototype.getTileUrl.call(this, coords));
		for (const [k, v] of Object.entries({...this.wmsParams, bbox})) {
			url.searchParams.append(this.options.uppercase ? k.toUpperCase() : k, v);
		}
		return url.toString();
	},

	// @method setParams(params: Object, noRedraw?: Boolean): this
	// Merges an object with the new parameters and re-requests tiles on the current screen (unless `noRedraw` was set to true).
	setParams(params, noRedraw) {

		Object.assign(this.wmsParams, params);

		if (!noRedraw) {
			this.redraw();
		}

		return this;
	}
});

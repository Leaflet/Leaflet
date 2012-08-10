L.TileLayer.WMS = L.TileLayer.extend({

	defaultWmsParams: {
		service: 'WMS',
		request: 'GetMap',
		version: '1.1.1',
		layers: '',
		styles: '',
		format: 'image/jpeg',
		transparent: false
	},

	initialize: function (url, options) { // (String, Object)

		this._url = url;

		var wmsParams = L.Util.extend({}, this.defaultWmsParams);

		if (options.detectRetina && L.Browser.retina) {
			wmsParams.width = wmsParams.height = this.options.tileSize * 2;
		} else {
			wmsParams.width = wmsParams.height = this.options.tileSize;
		}

		for (var i in options) {
			// all keys that are not TileLayer options go to WMS params
			if (!this.options.hasOwnProperty(i)) {
				wmsParams[i] = options[i];
			}
		}

		this.wmsParams = wmsParams;

		L.Util.setOptions(this, options);
	},

	onAdd: function (map) {

		var projectionKey = parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' : 'srs';
		this.wmsParams[projectionKey] = map.options.crs.code;

		L.TileLayer.prototype.onAdd.call(this, map);
	},

	getTileUrl: function (tilePoint, zoom) { // (Point, Number) -> String

		var map = this._map,
			crs = map.options.crs,
			tileSize = this.options.tileSize,

			nwPoint = tilePoint.multiplyBy(tileSize),
			sePoint = nwPoint.add(new L.Point(tileSize, tileSize)),

			nw = crs.project(map.unproject(nwPoint, zoom)),
			se = crs.project(map.unproject(sePoint, zoom)),

			bbox = [nw.x, se.y, se.x, nw.y].join(','),

			url = L.Util.template(this._url, {s: this._getSubdomain(tilePoint)});

		return url + L.Util.getParamString(this.wmsParams) + "&bbox=" + bbox;
	},

	setParams: function (params, noRedraw) {

		L.Util.extend(this.wmsParams, params);

		if (!noRedraw) {
			this.redraw();
		}

		return this;
	}
});

L.tileLayer.wms = function (url, options) {
	return new L.TileLayer.WMS(url, options);
};

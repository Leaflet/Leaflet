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
		wmsParams.width = wmsParams.height = this.options.tileSize;

		for (var i in options) {
			// all keys that are not TileLayer options go to WMS params
			if (!this.options.hasOwnProperty(i)) {
				wmsParams[i] = options[i];
			}
		}

		this.wmsParams = wmsParams;

		L.Util.setOptions(this, options);
	},

	onAdd: function (map, insertAtTheBottom) {
		var projectionKey = parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' : 'srs';
		this.wmsParams[projectionKey] = map.options.crs.code;

		L.TileLayer.prototype.onAdd.call(this, map, insertAtTheBottom);
	},

	getTileUrl: function (tilePoint, zoom) { // (Point, Number) -> String
		var map = this._map,
			crs = this.options.crs,

			tileSize = this.options.tileSize,

			nwPoint = tilePoint.multiplyBy(tileSize),
			sePoint = nwPoint.add(new L.Point(tileSize, tileSize)),

			nwMap = map.unproject(nwPoint, zoom, true),
			seMap = map.unproject(sePoint, zoom, true),

			nw = this._reproject(crs, nwPoint, zoom, true),
			se = this._reproject(crs, sePoint, zoom, true),

			bbox = [nw.x, se.y, se.x, nw.y].join(',');

		return this._url + L.Util.getParamString(this.wmsParams) + "&bbox=" + bbox;
	},
	
	_reproject: function (crs, point, zoom, unbounded) { // (CRS, Point[, Number, Boolean]) -> Point
		var map = this._map,

			toCrs = (typeof crs === 'undefined' ? map.options.crs : crs),

			latLng = map.unproject(point, zoom, unbounded);

		return toCrs.project(latLng);
    }
	
});

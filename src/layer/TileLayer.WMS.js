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

	initialize: function(/*String*/ url, /*Object*/ options) {
		this._url = url;
		
		this.wmsParams = L.Util.extend({}, this.defaultWmsParams);
		this.wmsParams.width = this.wmsParams.height = this.options.tileSize;
		
		for (var i in options) {
			// all keys that are not TileLayer options go to WMS params
			if (!this.options.hasOwnProperty(i)) {
				this.wmsParams[i] = options[i];
			}
		}
		var projectionKey = (parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' : 'srs');
		this.wmsParams[projectionKey] = 'EPSG:3857';

		L.Util.setOptions(this, options);
	},
	
	getTileUrl: function(/*Point*/ tilePoint, /*Number*/ zoom)/*-> String*/ {
		var tileSize = this.options.tileSize,
			nwPoint = tilePoint.multiplyBy(tileSize),
			sePoint = nwPoint.add(new L.Point(tileSize, tileSize)),
			nwMerc = this._map.unproject(nwPoint),
			seMerc = this._map.unproject(sePoint),
			r = 6378137,
			nw = L.Projection.Mercator.project(nwMerc).multiplyBy(r),
			se = L.Projection.Mercator.project(seMerc).multiplyBy(r),
			bbox = [nw.x, se.y, se.x, nw.y].join(',');
		
		return this._url + L.Util.getParamString(this.wmsParams) + "&bbox=" + bbox;
	}
});
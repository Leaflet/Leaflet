L.TileLayer.WMS = L.TileLayer.extend({
	defaultWmsParams: {
		version: '1.1.1',
		layers: '',
		styles: '',
		format: 'image/jpeg',
		transparent: false
	},

	initialize: function(url, options) {
		this._url = url;
		L.Util.setOptions(this, options);
		
		var tileSize = this.options.tileSize;
		
		this.wmsParams = L.Util.extend({
			service: 'WMS',
			request: 'GetMap',
			width: tileSize,
			height: tileSize
		}, this.defaultWmsParams);
		
		for (var i in options) {
			if (this.defaultWmsParams.hasOwnProperty(i)) {
				this.wmsParams[i] = options[i];
			}
		}
		
		var projectionKey = (parseFloat(this.wmsParams.version) >= 1.3 ? 'crs' : 'srs');
		this.wmsParams[projectionKey] = 'EPSG:3857';
	},
	
	getTileUrl: function(tilePoint, zoom) {
		var tileSize = this.options.tileSize,
			nwPoint = tilePoint.multiplyBy(tileSize),
			sePoint = nwPoint.add(new L.Point(tileSize, tileSize)),
			nw = this._map.unproject(nwPoint, zoom, true),
			se = this._map.unproject(sePoint, zoom, true),
			nwMerc = this._latlngToSphericalMerc(nw),
			seMerc = this._latlngToSphericalMerc(se),
			bbox = [nwMerc.x, seMerc.y, seMerc.x, nwMerc.y].join(',');
		
		return this._url + this._getParamsStr() + "&bbox=" + bbox; 
	},
	
	_latlngToSphericalMerc: function(latlng) {
		var r = 6378137,
			d = L.LatLng.DEG_TO_RAD,
			x = r * latlng.lng * d,
			sin = Math.sin(latlng.lat * d),
			y = (r / 2) * Math.log((1 + sin)/(1 - sin));
		
		return new L.Point(x, y);
	},
	
	_getParamsStr: function() {
		var params = [];
		for (var i in this.wmsParams) {
			if (this.wmsParams.hasOwnProperty(i)) {
				params.push(i + '=' + this.wmsParams[i]);
			}
		}
		return '?' + params.join('&');
	}
});
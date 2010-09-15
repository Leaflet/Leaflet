L.TileLayer = L.Class.extend({
	includes: L.Mixin.Events,
	
	options: {
		tileSize: 256,
		minZoom: 0,
		maxZoom: 18,
		subdomains: 'abc'
	},
	
	initialize: function(url, options) {
		L.Util.extend(this.options, options);
		
		this._url = url;
		
		if (typeof this.options.subdomains == 'string') {
			this.options.subdomains = this.options.subdomains.split('');
		}
	},
	
	onAdd: function(map) {
		this._map = map;
		
		this._container = document.createElement('div');
		this._container.className = 'leaflet-layer';
		this._map.getPanes().tilePane.appendChild(this._container);
		
		this._tileImg = document.createElement('img');
		
		L.Util.extend(this._tileImg, {
			className: 'leaflet-tile',
			galleryimg: 'no'
		});
		//TODO fire tileload?
		//TODO fire layerload?
		
		var tileSize = this.options.tileSize;
		
		L.Util.extend(this._tileImg.style, {
			width: tileSize + 'px',
			height: tileSize + 'px',
			visibility: 'hidden'
		});
	},
	
	draw: function() {
		this._tileLoaded = {};
		this._container.innerHTML = '';
		//TODO draw?
	},
	
	load: function() {
		var bounds = this._map.getPixelBounds(),
			tileSize = this.options.tileSize;
		
		var nwTilePoint = new L.Point(
				Math.floor(bounds.min.x / tileSize),
				Math.floor(bounds.min.y / tileSize)),
			seTilePoint = new L.Point(
				Math.floor(bounds.max.x / tileSize),
				Math.floor(bounds.max.y / tileSize));
		
		this._loadTiles(nwTilePoint, seTilePoint);
	},
	
	getTileUrl: function(tilePoint, zoom) {
		var url = this._url;
		
		var subdomains = this.options.subdomains,
			s = this.options.subdomains[(tilePoint.x + tilePoint.y) % subdomains.length];

		return this._url
				.replace('{s}', s)
				.replace('{z}', zoom)
				.replace('{x}', tilePoint.x)
				.replace('{y}', tilePoint.y);
	},
	
	_loadTiles: function(nwTilePoint, seTilePoint) {
		//TODO load from center
		for (var j = nwTilePoint.y; j <= seTilePoint.y; j++) {
			for (var i = nwTilePoint.x; i <= seTilePoint.x; i++) {				
				this._loadTile(new L.Point(i, j));
			}
		}
	},
	
	_loadTile: function(tilePoint) {
		var origin = this._map.getPixelOrigin(),
			tileSize = this.options.tileSize,
			tilePos = tilePoint.multiplyBy(tileSize).subtract(origin),
			zoom = this._map.getZoom();
			
		var key = tilePoint.x + ':' + tilePoint.y;
		if (key in this._tileLoaded) { return; }
		this._tileLoaded[key] = true;

		var tileLimit = (1 << zoom);
		tilePoint.x = ((tilePoint.x % tileLimit) + tileLimit) % tileLimit;
		if (tilePoint.y < 0 || tilePoint.y >= tileLimit) { return; }
		
		
		var tile = this._tileImg.cloneNode(false);
		
		tile.style.left = tilePos.x + 'px';
		tile.style.top = tilePos.y + 'px';
		
		tile.onload = this._tileOnLoad;
		tile.onselectstart = tile.onmousemove = L.Util.falseFn;
		
		tile.src = this.getTileUrl(tilePoint, zoom);
		
		this._container.appendChild(tile);
		//TODO tile queue
	},
	
	_tileOnLoad: function() {
		this.style.visibility = 'visible';
	}
});
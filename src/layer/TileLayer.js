/*
 * L.TileLayer is used for standard xyz-numbered tile layers.
 */

L.TileLayer = L.Class.extend({
	includes: L.Mixin.Events,
	
	options: {
		tileSize: 256,
		minZoom: 0,
		maxZoom: 18,
		subdomains: 'abc',
		copyright: '',
		unloadInvisibleTiles: L.Browser.mobileWebkit,
		updateWhenIdle: L.Browser.mobileWebkit,
		errorTileUrl: ''
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
		
		// create a container div for tiles
		this._container = document.createElement('div');
		this._container.className = 'leaflet-layer';
		map.getPanes().tilePane.appendChild(this._container);
		
		// create an image to clone for tiles
		this._tileImg = document.createElement('img');
		
		this._tileImg.className = 'leaflet-tile';
		this._tileImg.galleryimg = 'no';
		
		var tileSize = this.options.tileSize;
		this._tileImg.style.width = tileSize + 'px';
		this._tileImg.style.height = tileSize + 'px';
		
		// set up events
		map.on('viewreset', this._reset, this);
		
		if (this.options.updateWhenIdle) {
			map.on('moveend', this._update, this);
		} else {
			this._limitedUpdate = L.Util.limitExecByInterval(this._update, 100, this);
			map.on('move', this._limitedUpdate, this);
		}
		
		this._reset();
		this._update();
	},
	
	onRemove: function(map) {
		this._map.getPanes().tilePane.removeChild(this._container);
		
		this._map.off('viewreset', this._reset);
		
		if (this.options.updateWhenIdle) {
			this._map.off('moveend', this._update);
		} else {
			this._map.off('move', this._limitedUpdate);
		}
	},
	
	_reset: function() {
		this._tiles = {};
		this._container.innerHTML = '';
	},
	
	_update: function() {
		var bounds = this._map.getPixelBounds(),
			tileSize = this.options.tileSize;
		
		var nwTilePoint = new L.Point(
				Math.floor(bounds.min.x / tileSize),
				Math.floor(bounds.min.y / tileSize)),
			seTilePoint = new L.Point(
				Math.floor(bounds.max.x / tileSize),
				Math.floor(bounds.max.y / tileSize)),
			tileBounds = new L.Bounds(nwTilePoint, seTilePoint);
		
		this._loadTilesFromCenterOut(tileBounds);
		
		if (this.options.unloadInvisibleTiles) {
			this._unloadOtherTiles(tileBounds);
		}
		//TODO fire layerload?
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
	
	_loadTilesFromCenterOut: function(bounds) {
		var queue = [],
			center = bounds.getCenter(),
			key = i + ':' + j;
		
		for (var j = bounds.min.y; j <= bounds.max.y; j++) {
			for (var i = bounds.min.x; i <= bounds.max.x; i++) {				
				if (key in this._tiles) { continue; }
				queue.push(new L.Point(i, j));
			}
		}
		
		// load tiles in order of their distance to center
		queue.sort(function(a, b) {
			return a.distanceTo(center) - b.distanceTo(center);
		});
		
		for (var k = 0, len = queue.length; k < len; k++) {
			this._loadTile(queue[k]);
		}
	},
	
	_unloadOtherTiles: function(bounds) {
		var k, x, y, key;
		
		for (key in this._tiles) {
			kArr = key.split(':');
			x = parseInt(kArr[0]);
			y = parseInt(kArr[1]);
			
			// remove tile if it's out of bounds
			if (x < bounds.min.x || x > bounds.max.x || y < bounds.min.y || y > bounds.max.y) {
				this._container.removeChild(this._tiles[key]);
				delete this._tiles[key];
			}
		}		
	},
	
	_loadTile: function(tilePoint) {
		var origin = this._map.getPixelOrigin(),
			tileSize = this.options.tileSize,
			tilePos = tilePoint.multiplyBy(tileSize).subtract(origin),
			zoom = this._map.getZoom();
			
		// wrap tile coordinates
		var tileLimit = (1 << zoom);
		tilePoint.x = ((tilePoint.x % tileLimit) + tileLimit) % tileLimit;
		if (tilePoint.y < 0 || tilePoint.y >= tileLimit) { return; }
		
		// create tile
		var tile = this._tileImg.cloneNode(false);
		this._tiles[tilePoint.x + ':' + tilePoint.y] = tile;
		
		L.DomUtil.setPosition(tile, tilePos);
		
		tile._leaflet_layer = this;
		tile.onload = this._tileOnLoad;
		tile.onerror = this._tileOnError;
		tile.onselectstart = tile.onmousemove = L.Util.falseFn;
		
		tile.src = this.getTileUrl(tilePoint, zoom);
		
		this._container.appendChild(tile);
	},
	
	_tileOnLoad: function() {
		this.className += ' leaflet-tile-loaded';
		this._leaflet_layer.fire('tileload', {tile: this});
	},
	
	_tileOnError: function() {
		this._leaflet_layer.fire('tileerror', {tile: this, url: this.src});
		this.src = this._leaflet_layer.options.errorTileUrl;
	}
});
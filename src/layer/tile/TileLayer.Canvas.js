L.TileLayer.Canvas = L.TileLayer.extend({
	initialize: function(options) {
		L.Util.setOptions(this, options);
	},
	
	_createTileProto: function() {
		this._canvasProto = L.DomUtil.create('canvas', 'leaflet-tile');
		
		var tileSize = this.options.tileSize;
		this._canvasProto.width = tileSize;
		this._canvasProto.height = tileSize;
	},
	
	_createTile: function() {
		var tile = this._canvasProto.cloneNode(false);
		tile.onselectstart = tile.onmousemove = L.Util.falseFn;
		return tile;
	},
	
	_loadTile: function(tile, tilePoint, zoom) {
		tile._layer = this;
		this.drawTile(tile, tilePoint, zoom);
		this._tileOnLoad();
	},
	
	drawTile: function(tile, tilePoint, zoom) {
		// override with rendering code
	}
});
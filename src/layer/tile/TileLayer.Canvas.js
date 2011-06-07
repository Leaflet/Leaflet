L.TileLayer.Canvas = L.TileLayer.extend({
	options: {
		async: false
	},
	
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
		
		if (!this.options.async) {
			this.tileDrawn(tile);
		}
	},
	
	drawTile: function(tile, tilePoint, zoom) {
		// override with rendering code
	},
	
	tileDrawn: function(tile) {
		this._tileOnLoad.call(tile);
	}
});
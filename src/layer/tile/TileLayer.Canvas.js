L.TileLayer.Canvas = L.TileLayer.extend({
	options: {
		async: false
	},

	initialize: function (options) {
		L.Util.setOptions(this, options);
	},

	redraw: function () {
		var i,
			tiles = this._tiles;

		for (i in tiles) {
			if (tiles.hasOwnProperty(i)) {
				this._redrawTile(tiles[i]);
			}
		}
	},

	_redrawTile: function (tile) {
		this.drawTile(tile, tile._tilePoint, tile._zoom);
	},

	_createTileProto: function () {
		var proto = this._canvasProto = L.DomUtil.create('canvas', 'leaflet-tile');

		var tileSize = this.options.tileSize;
		proto.width = tileSize;
		proto.height = tileSize;
	},

	_createTile: function () {
		var tile = this._canvasProto.cloneNode(false);
		tile.onselectstart = tile.onmousemove = L.Util.falseFn;
		return tile;
	},

	_loadTile: function (tile, tilePoint, zoom) {
		tile._layer = this;
		tile._tilePoint = tilePoint;
		tile._zoom = zoom;

		this.drawTile(tile, tilePoint, zoom);

		if (!this.options.async) {
			this.tileDrawn(tile);
		}
	},

	drawTile: function (tile, tilePoint, zoom) {
		// override with rendering code
	},

	tileDrawn: function (tile) {
		this._tileOnLoad.call(tile);
	}
});

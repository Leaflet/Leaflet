/*
 * L.TileLayer is used for standard xyz-numbered tile layers.
 */

L.TileLayer = L.GridLayer.extend({

	options: {
		minZoom: 0,
		maxZoom: 18,

		subdomains: 'abc',
		errorTileUrl: '',
		zoomOffset: 0,

		/*
		maxNativeZoom: <Number>,
		tms: <Boolean>,
		zoomReverse: <Number>,
		detectRetina: <Number>,
		*/
	},

	initialize: function (url, options) {

		this._url = url;

		options = L.setOptions(this, options);

		// detecting retina displays, adjusting tileSize and zoom levels
		if (options.detectRetina && L.Browser.retina && options.maxZoom > 0) {

			options.tileSize = Math.floor(options.tileSize / 2);
			options.zoomOffset++;

			options.minZoom = Math.max(0, options.minZoom);
			options.maxZoom--;
		}

		if (typeof options.subdomains === 'string') {
			options.subdomains = options.subdomains.split('');
		}
	},

	setUrl: function (url, noRedraw) {
		this._url = url;

		if (!noRedraw) {
			this.redraw();
		}
		return this;
	},

	createTile: function (coords, done) {
		var tile = document.createElement('img');

		tile.onload = L.bind(this._tileOnLoad, this, done);
		tile.onerror = L.bind(this._tileOnError, this, done);

		tile.src = this.getTileUrl(coords);

		return tile;
	},

	getTileUrl: function (coords) {
		return L.Util.template(this._url, L.extend({
			s: this._getSubdomain(coords),
			x: coords.x,
			y: this.options.tms ? this._getTileNumBounds().max.y - coords.y : coords.y,
			z: this._getZoomForUrl()
		}, this.options));
	},

	_tileOnLoad: function (done, e) {
		done(null, e.target);
	},

	_tileOnError: function (done, e) {
		var errorUrl = this.options.errorTileUrl;
		if (errorUrl) {
			e.target.src = errorUrl;
		}
		done(e, e.target);
	},

	_getTileSize: function () {
		var map = this._map,
		    options = this.options,
		    zoom = map.getZoom() + options.zoomOffset,
		    zoomN = options.maxNativeZoom;

		// increase tile size when overscaling
		return zoomN && zoom > zoomN ?
				Math.round(map.getZoomScale(zoom) / map.getZoomScale(zoomN) * options.tileSize) :
				options.tileSize;
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];

		L.GridLayer.prototype._removeTile.call(this, key);

		// for https://github.com/Leaflet/Leaflet/issues/137
		if (!L.Browser.android) {
			tile.onload = null;
			tile.src = L.Util.emptyImageUrl;
		}
	},

	_getZoomForUrl: function () {

		var options = this.options,
		    zoom = this._map.getZoom();

		if (options.zoomReverse) {
			zoom = options.maxZoom - zoom;
		}

		zoom += options.zoomOffset;

		return options.maxNativeZoom ? Math.min(zoom, options.maxNativeZoom) : zoom;
	},

	_getSubdomain: function (tilePoint) {
		var index = Math.abs(tilePoint.x + tilePoint.y) % this.options.subdomains.length;
		return this.options.subdomains[index];
	},

	_prepareBgBuffer: function () {

		var front = this._tileContainer,
		    bg = this._bgBuffer;

		// if foreground layer doesn't have many tiles but bg layer does,
		// keep the existing bg layer and just zoom it some more

		var bgLoaded = this._getLoadedTilesPercentage(bg),
		    frontLoaded = this._getLoadedTilesPercentage(front);

		if (bg && bgLoaded > 0.5 && frontLoaded < 0.5) {

			front.style.visibility = 'hidden';
			this._stopLoadingImages(front);
			return;
		}

		this._swapBgBuffer();
		this._stopLoadingImages(bg);
	},

	_getLoadedTilesPercentage: function (container) {
		var tiles = container.getElementsByTagName('img'),
		    i, len, count = 0;

		for (i = 0, len = tiles.length; i < len; i++) {
			if (tiles[i].complete) {
				count++;
			}
		}
		return count / len;
	},

	// stops loading all tiles in the background layer
	_stopLoadingImages: function (container) {
		var tiles = Array.prototype.slice.call(container.getElementsByTagName('img')),
		    i, len, tile;

		for (i = 0, len = tiles.length; i < len; i++) {
			tile = tiles[i];

			if (!tile.complete) {
				tile.onload = L.Util.falseFn;
				tile.onerror = L.Util.falseFn;
				tile.src = L.Util.emptyImageUrl;

				tile.parentNode.removeChild(tile);
			}
		}
	}
});

L.tileLayer = function (url, options) {
	return new L.TileLayer(url, options);
};

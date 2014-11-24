/*
 * L.GridLayer is used as base class for grid-like layers like TileLayer.
 */

L.GridLayer = L.Layer.extend({

	options: {
		pane: 'tilePane',

		tileSize: 256,
		opacity: 1,

		unloadInvisibleTiles: L.Browser.mobile,
		updateWhenIdle: L.Browser.mobile,
		updateInterval: 200,

		attribution: null,
		zIndex: null,
		bounds: null,

		minZoom: 0
		// maxZoom: <Number>
	},

	initialize: function (options) {
		options = L.setOptions(this, options);
	},

	onAdd: function () {
		this._initContainer();

		this._pruneTiles = L.Util.throttle(this._pruneTiles, 200, this);

		this._levels = {};

		this._tiles = {};
		this._loaded = {};
		this._retain = {};
		this._tilesToLoad = 0;

		this._reset();
		this._update();
	},

	beforeAdd: function (map) {
		map._addZoomLimit(this);
	},

	onRemove: function (map) {
		L.DomUtil.remove(this._container);
		map._removeZoomLimit(this);
		this._container = null;
		this._tileZoom = null;
	},

	bringToFront: function () {
		if (this._map) {
			L.DomUtil.toFront(this._container);
			this._setAutoZIndex(Math.max);
		}
		return this;
	},

	bringToBack: function () {
		if (this._map) {
			L.DomUtil.toBack(this._container);
			this._setAutoZIndex(Math.min);
		}
		return this;
	},

	getAttribution: function () {
		return this.options.attribution;
	},

	getContainer: function () {
		return this._container;
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._map) {
			this._updateOpacity();
		}
		return this;
	},

	setZIndex: function (zIndex) {
		this.options.zIndex = zIndex;
		this._updateZIndex();

		return this;
	},

	redraw: function () {
		if (this._map) {
			this._removeAllTiles();
			this._update();
		}
		return this;
	},

	getEvents: function () {
		var events = {
			viewreset: this._reset,
			moveend: this._update
		};

		if (!this.options.updateWhenIdle) {
			// update tiles on move, but not more often than once per given interval
			events.move = L.Util.throttle(this._update, this.options.updateInterval, this);
		}

		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	createTile: function () {
		return document.createElement('div');
	},

	_updateZIndex: function () {
		if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
			this._container.style.zIndex = this.options.zIndex;
		}
	},

	_setAutoZIndex: function (compare) {
		// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

		var layers = this.getPane().children,
		    edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

		for (var i = 0, len = layers.length, zIndex; i < len; i++) {

			zIndex = layers[i].style.zIndex;

			if (layers[i] !== this._container && zIndex) {
				edgeZIndex = compare(edgeZIndex, +zIndex);
			}
		}

		if (isFinite(edgeZIndex)) {
			this.options.zIndex = edgeZIndex + compare(-1, 1);
			this._updateZIndex();
		}
	},

	_updateOpacity: function () {
		var opacity = this.options.opacity;

		if (L.Browser.ielt9) {
			// IE doesn't inherit filter opacity properly, so we're forced to set it on tiles
			for (var i in this._tiles) {
				L.DomUtil.setOpacity(this._tiles[i], opacity);
			}
		} else {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	_initContainer: function () {
		if (this._container) { return; }

		this._container = L.DomUtil.create('div', 'leaflet-layer');
		this._updateZIndex();

		if (this.options.opacity < 1) {
			this._updateOpacity();
		}

		this.getPane().appendChild(this._container);
	},

	_updateLevels: function () {
		var zoom = this._tileZoom;

		for (var z in this._levels) {
			this._levels[z].el.style.zIndex = -Math.abs(zoom - z);
		}

		var level = this._levels[zoom],
		    map = this._map;

		if (!level) {
			level = this._levels[zoom] = {};

			level.el = L.DomUtil.create('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
			level.el.style.zIndex = 0;

			level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
			level.zoom = zoom;
		}

		this._level = level;

		return level;
	},

	_pruneTiles: function () {

		if (!this._map) { return; }

		this._retain = {};

		var bounds = this._map.getBounds(),
			z = this._tileZoom,
			range = this._getTileRange(bounds, z),
			i, j, key, found;

		for (i = range.min.x; i <= range.max.x; i++) {
			for (j = range.min.y; j <= range.max.y; j++) {

				key = i + ':' + j + ':' + z;

				this._retain[key] = true;

				if (!this._loaded[key]) {
					found = this._retainParent(i, j, z, z - 5) || this._retainChildren(i, j, z, z + 2);
				}
			}
		}

		for (key in this._tiles) {
			if (!this._retain[key]) {
				if (!this._loaded[key]) {
					this._removeTile(key);
					this._tilesToLoad--;
				} else if (this._map._fadeAnimated) {
					setTimeout(L.bind(this._deferRemove, this, key), 250);
				} else {
					this._removeTile(key);
				}
			}
		}
	},

	_removeAllTiles: function () {
		for (var key in this._tiles) {
			this._removeTile(key);
		}
		this._tilesToLoad = 0;
	},

	_deferRemove: function (key) {
		if (!this._retain[key]) {
			this._removeTile(key);
		}
	},

	_retainParent: function (x, y, z, minZoom) {
		var x2 = Math.floor(x / 2),
			y2 = Math.floor(y / 2),
			z2 = z - 1;

		var key = x2 + ':' + y2 + ':' + z2;

		if (this._loaded[key]) {
			this._retain[key] = true;
			return true;

		} else if (z2 > minZoom) {
			return this._retainParent(x2, y2, z2, minZoom);
		}

		return false;
	},

	_retainChildren: function (x, y, z, maxZoom) {

		for (var i = 2 * x; i < 2 * x + 2; i++) {
			for (var j = 2 * y; j < 2 * y + 2; j++) {

				var key = i + ':' + j + ':' + (z + 1);

				if (this._loaded[key]) {
					this._retain[key] = true;

				} else if (z + 1 < maxZoom) {
					this._retainChildren(i, j, z + 1, maxZoom);
				}
			}
		}
	},

	_reset: function (e) {
		var map = this._map,
		    zoom = map.getZoom(),
		    tileZoom = Math.round(zoom),
		    tileZoomChanged = this._tileZoom !== tileZoom;

		if (tileZoomChanged || (e && e.hard)) {
			if (this._abortLoading) {
				this._abortLoading();
			}
			this._tileZoom = tileZoom;
			this._updateLevels();
			this._resetGrid();
		}

		this._setZoomTransforms(map.getCenter(), zoom);
	},

	_setZoomTransforms: function (center, zoom) {
		for (var i in this._levels) {
			this._setZoomTransform(this._levels[i], center, zoom);
		}
	},

	_setZoomTransform: function (level, center, zoom) {
		var scale = this._map.getZoomScale(zoom, level.zoom),
		    translate = level.origin.multiplyBy(scale)
		        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

		L.DomUtil.setTransform(level.el, translate, scale);
	},

	_resetGrid: function () {
		var map = this._map,
		    crs = map.options.crs,
		    tileSize = this._tileSize = this._getTileSize(),
		    tileZoom = this._tileZoom;

		var bounds = this._map.getPixelWorldBounds(this._tileZoom);
		if (bounds) {
			this._globalTileRange = this._pxBoundsToTileRange(bounds);
		}

		this._wrapX = crs.wrapLng && [
			Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize),
			Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize)
		];
		this._wrapY = crs.wrapLat && [
			Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize),
			Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize)
		];
	},

	_getTileSize: function () {
		return this.options.tileSize;
	},

	_update: function () {
		if (!this._map) { return; }

		// TODO move to reset
		// var zoom = this._map.getZoom();

		// if (zoom > this.options.maxZoom ||
		//     zoom < this.options.minZoom) { return; }

		var bounds = this._map.getBounds();

		if (this.options.unloadInvisibleTiles) {
			this._removeOtherTiles(bounds);
		}

		this._addTiles(bounds);
	},

	// tile coordinates range for particular geo bounds and zoom
	_getTileRange: function (bounds, zoom) {
		var pxBounds = new L.Bounds(
		        this._map.project(bounds.getNorthWest(), zoom),
		        this._map.project(bounds.getSouthEast(), zoom));
		return this._pxBoundsToTileRange(pxBounds);
	},

	_addTiles: function (bounds) {
		var queue = [],
			tileRange = this._getTileRange(bounds, this._tileZoom),
		    center = tileRange.getCenter(),
			j, i, coords;

		// create a queue of coordinates to load tiles from
		for (j = tileRange.min.y; j <= tileRange.max.y; j++) {
			for (i = tileRange.min.x; i <= tileRange.max.x; i++) {

				coords = new L.Point(i, j);
				coords.z = this._tileZoom;

				// add tile to queue if it's not in cache or out of bounds
				if (!(this._tileCoordsToKey(coords) in this._tiles) && this._isValidTile(coords)) {
					queue.push(coords);
				}
			}
		}

		// sort tile queue to load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(center) - b.distanceTo(center);
		});

		var tilesToLoad = queue.length;


		if (tilesToLoad !== 0) {
			// if its the first batch of tiles to load
			if (!this._tilesToLoad) {
				this.fire('loading');
			}

			this._tilesToLoad += tilesToLoad;

			// create DOM fragment to append tiles in one batch
			var fragment = document.createDocumentFragment();

			for (i = 0; i < tilesToLoad; i++) {
				this._addTile(queue[i], fragment);
			}

			this._level.el.appendChild(fragment);
		}

		this._pruneTiles();
	},

	_isValidTile: function (coords) {
		var crs = this._map.options.crs;

		if (!crs.infinite) {
			// don't load tile if it's out of bounds and not wrapped
			var bounds = this._globalTileRange;
			if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
			    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
		}

		if (!this.options.bounds) { return true; }

		// don't load tile if it doesn't intersect the bounds in options
		var tileBounds = this._tileCoordsToBounds(coords);
		return L.latLngBounds(this.options.bounds).intersects(tileBounds);
	},

	_keyToBounds: function (key) {
		return this._tileCoordsToBounds(this._keyToTileCoords(key));
	},

	// converts tile coordinates to its geographical bounds
	_tileCoordsToBounds: function (coords) {

		var map = this._map,
		    tileSize = this._getTileSize(),

		    nwPoint = coords.multiplyBy(tileSize),
		    sePoint = nwPoint.add([tileSize, tileSize]),

		    nw = map.wrapLatLng(map.unproject(nwPoint, coords.z)),
		    se = map.wrapLatLng(map.unproject(sePoint, coords.z));

		return new L.LatLngBounds(nw, se);
	},

	// converts tile coordinates to key for the tile cache
	_tileCoordsToKey: function (coords) {
		return coords.x + ':' + coords.y + ':' + coords.z;
	},

	// converts tile cache key to coordinates
	_keyToTileCoords: function (key) {
		var k = key.split(':'),
			coords = new L.Point(+k[0], +k[1]);
		coords.z = +k[2];
		return coords;
	},

	// remove any present tiles that are off the specified bounds
	_removeOtherTiles: function (bounds) {
		for (var key in this._tiles) {
			var tileBounds = this._keyToBounds(key);
			if (!bounds.intersects(tileBounds)) {
				this._removeTile(key);
			}
		}
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];
		if (!tile) { return; }

		L.DomUtil.remove(tile);

		delete this._tiles[key];
		delete this._loaded[key];

		this.fire('tileunload', {
			tile: tile,
			coords: this._keyToTileCoords(key)
		});
	},

	_initTile: function (tile) {
		L.DomUtil.addClass(tile, 'leaflet-tile');

		tile.style.width = this._tileSize + 'px';
		tile.style.height = this._tileSize + 'px';

		tile.onselectstart = L.Util.falseFn;
		tile.onmousemove = L.Util.falseFn;

		// update opacity on tiles in IE7-8 because of filter inheritance problems
		if (L.Browser.ielt9 && this.options.opacity < 1) {
			L.DomUtil.setOpacity(tile, this.options.opacity);
		}

		// without this hack, tiles disappear after zoom on Chrome for Android
		// https://github.com/Leaflet/Leaflet/issues/2078
		if (L.Browser.android && !L.Browser.android23) {
			tile.style.WebkitBackfaceVisibility = 'hidden';
		}
	},

	_addTile: function (coords, container) {
		var tilePos = this._getTilePos(coords),
		    key = this._tileCoordsToKey(coords);

		var tile = this.createTile(this._wrapCoords(coords), L.bind(this._tileReady, this, coords));

		this._initTile(tile);

		// if createTile is defined with a second argument ("done" callback),
		// we know that tile is async and will be ready later; otherwise
		if (this.createTile.length < 2) {
			// mark tile as ready, but delay one frame for opacity animation to happen
			setTimeout(L.bind(this._tileReady, this, coords, null, tile), 0);
		}

		// we prefer top/left over translate3d so that we don't create a HW-accelerated layer from each tile
		// which is slow, and it also fixes gaps between tiles in Safari
		L.DomUtil.setPosition(tile, tilePos, true);

		// save tile in cache
		this._tiles[key] = tile;

		container.appendChild(tile);
		this.fire('tileloadstart', {
			tile: tile,
			coords: coords
		});
	},

	_tileReady: function (coords, err, tile) {
		if (err) {
			this.fire('tileerror', {
				error: err,
				tile: tile,
				coords: coords
			});
		}

		var key = this._tileCoordsToKey(coords);

		if (!this._tiles[key]) { return; }

		this._loaded[key] = true;
		this._pruneTiles();

		L.DomUtil.addClass(tile, 'leaflet-tile-loaded');

		this.fire('tileload', {
			tile: tile,
			coords: coords
		});

		this._tilesToLoad--;

		if (this._tilesToLoad === 0) {
			this.fire('load');
		}
	},

	_getTilePos: function (coords) {
		return coords.multiplyBy(this._tileSize).subtract(this._level.origin);
	},

	_wrapCoords: function (coords) {
		var newCoords = new L.Point(
			this._wrapX ? L.Util.wrapNum(coords.x, this._wrapX) : coords.x,
			this._wrapY ? L.Util.wrapNum(coords.y, this._wrapY) : coords.y);
		newCoords.z = coords.z;
		return newCoords;
	},

	_pxBoundsToTileRange: function (bounds) {
		return new L.Bounds(
			bounds.min.divideBy(this._tileSize).floor(),
			bounds.max.divideBy(this._tileSize).ceil().subtract([1, 1]));
	},

	_animateZoom: function (e) {
		this._setZoomTransforms(e.center, e.zoom);
	}
});

L.gridLayer = function (options) {
	return new L.GridLayer(options);
};

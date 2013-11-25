/*
 * L.TileLayer is used for standard xyz-numbered tile layers.
 */

L.GridLayer = L.Class.extend({

	includes: L.Mixin.Events,

	options: {
		tileSize: 256,
		opacity: 1,

		// minZoom: <Number>,
		// maxZoom: <Number>,

		async: false,
		unloadInvisibleTiles: L.Browser.mobile,
		updateWhenIdle: L.Browser.mobile,
		updateInterval: 150
	},

	initialize: function (url, options) {
		options = L.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;
		this._animated = map._zoomAnimated;

		this._initContainer();

		if (!this.options.updateWhenIdle) {
			// update tiles on move, but not more often than once per given interval
			this._update = L.Util.limitExecByInterval(this._update, this.options.updateInterval, this);
		}

		map.on(this._getEvents(), this);

		this._reset();
		this._update();
	},

	onRemove: function (map) {
		this._getPane().removeChild(this._container);

		map.on(this._getEvents(), this);

		this._container = null;
		this._map = null;
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	bringToFront: function () {
		var pane = this._getPane();

		if (this._container) {
			pane.appendChild(this._container);
			this._setAutoZIndex(pane, Math.max);
		}
		return this;
	},

	bringToBack: function () {
		var pane = this._map._panes.tilePane;

		if (this._container) {
			pane.insertBefore(this._container, pane.firstChild);
			this._setAutoZIndex(pane, Math.min);
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
			this._reset({hard: true}); //TODO wtf hard?
			this._update();
		}
		return this;
	},

	isValidTile: function (coords) {
		if (!this.options.bounds) { return true; }

		return this.options.bounds.contains(this._tileCoordsToBounds(coords));
	},

	_getPane: function () {
		// TODO pane in options?
		return this._map._panes.tilePane;
	},

	_getEvents: function () {
		var events = {
			viewreset: this._reset,
			moveend: this._update
		};

		if (!this.options.updateWhenIdle) {
			events.move = this._update;
		}

		if (this._animated) {
			events.zoomanim = this._animateZoom;
			events.zoomend = this._endZoomAnim;
		}

		return events;
	},

	_getPane: function () {
		// TODO pane in options?
		return this._map._panes.tilePane;
	},

	_updateZIndex: function () {
		if (this._container && this.options.zIndex !== undefined) {
			this._container.style.zIndex = this.options.zIndex;
		}
	},

	_setAutoZIndex: function (pane, compare) {

		var layers = pane.children,
		    edgeZIndex = -compare(Infinity, -Infinity), // -Infinity for max, Infinity for min
		    zIndex, i, len;

		for (i = 0, len = layers.length; i < len; i++) {

			if (layers[i] !== this._container) {
				zIndex = parseInt(layers[i].style.zIndex, 10);

				if (!isNaN(zIndex)) {
					edgeZIndex = compare(edgeZIndex, zIndex);
				}
			}
		}

		this.options.zIndex = this._container.style.zIndex =
		        (isFinite(edgeZIndex) ? edgeZIndex : 0) + compare(1, -1);
	},

	_updateOpacity: function () {
		var i,
		    tiles = this._tiles;

		if (L.Browser.ielt9) {
			for (i in tiles) {
				L.DomUtil.setOpacity(tiles[i], this.options.opacity);
			}
		} else {
			L.DomUtil.setOpacity(this._container, this.options.opacity);
		}
	},

	_initContainer: function () {
		if (this._container) { return; }

		this._container = L.DomUtil.create('div', 'leaflet-layer');
		this._updateZIndex();

		if (this._animated) {
			var className = 'leaflet-tile-container leaflet-zoom-animated';

			this._bgBuffer = L.DomUtil.create('div', className, this._container);
			this._tileContainer = L.DomUtil.create('div', className, this._container);

		} else {
			this._tileContainer = this._container;
		}

		// TODO check if opacity works when setting before appendChild
		if (this.options.opacity < 1) {
			this._updateOpacity();
		}

		this._getPane().appendChild(this._container);
	},

	_reset: function (e) {
		for (var key in this._tiles) {
			this.fire('tileunload', {
				tile: this._tiles[key]
			});
		}

		this._tiles = {};
		this._tilesToLoad = 0;

		this._tileContainer.innerHTML = '';

		if (this._animated && e && e.hard) {
			this._clearBgBuffer();
		}

		// this._initContainer();
		// TODO OK?
	},

	_getTileSize: function () {
		var map = this._map,
		    zoom = map.getZoom() + this.options.zoomOffset,
		    zoomN = this.options.maxNativeZoom,
		    tileSize = this.options.tileSize;

		if (zoomN && zoom > zoomN) {
			tileSize = Math.round(map.getZoomScale(zoom) / map.getZoomScale(zoomN) * tileSize);
		}

		return tileSize;
	},

	_update: function () {

		if (!this._map) { return; }

		var bounds = this._map.getPixelBounds(),
		    zoom = this._map.getZoom(),
		    tileSize = this._getTileSize();

		if (zoom > this.options.maxZoom ||
		    zoom < this.options.minZoom) { return; }

		// TODO clear bg buffer?

		var tileBounds = L.bounds(
		        bounds.min.divideBy(tileSize).floor(),
		        bounds.max.divideBy(tileSize).floor());

		this._addTilesFromCenterOut(tileBounds);

		if (this.options.unloadInvisibleTiles) {
			this._removeOtherTiles(tileBounds);
		}
	},

	_addTilesFromCenterOut: function (bounds) {
		var queue = [],
		    center = bounds.getCenter(),
		    zoom = this._map.getZoom();

		var j, i, coords;

		for (j = bounds.min.y; j <= bounds.max.y; j++) {
			for (i = bounds.min.x; i <= bounds.max.x; i++) {

				coords = new L.Point(i, j);
				coords.z = zoom;

				if (!this._tileIsAdded(coords) && this.isValidTile(coords)) {
					queue.push(coords);
				}
			}
		}

		var tilesToLoad = queue.length;

		if (tilesToLoad === 0) { return; }

		// if its the first batch of tiles to load
		if (!this._tilesToLoad) {
			this.fire('loading');
		}

		this._tilesToLoad += tilesToLoad;

		// load tiles to load tiles in order of their distance to center
		queue.sort(function (a, b) {
			return a.distanceTo(center) - b.distanceTo(center);
		});

		var fragment = document.createDocumentFragment();

		for (i = 0; i < tilesToLoad; i++) {
			this._addTile(queue[i], fragment);
		}

		this._tileContainer.appendChild(fragment);
	},

	_tileIsAdded: function (coords) {
		return this._tileCoordsToKey(coords) in this._tiles;
	},

	_tileCoordsToBounds: function (coords) {

		var tileSize = this.options.tileSize,

		    nwPoint = coords.multiplyBy(tileSize),
		    sePoint = nwPoint.add([tileSize, tileSize]),

		    nw = this._map.unproject(nwPoint),
		    se = this._map.unproject(sePoint);

		// TODO rectangular

		return new L.LatLngBounds(nw, se);
	},

	_tileCoordsToKey: function (coords) {
		return coords.x + ':' + coords.y;
	},

	_keyToTileCoords: function (key) {
		var kArr = key.split(':'),
		    x = parseInt(kArr[0], 10),
		    y = parseInt(kArr[1], 10);

		return new L.Point(x, y);
	},

	_removeOtherTiles: function (bounds) {
		for (var key in this._tiles) {
			if (!bounds.contains(this._keyToTileCoords(key))) {
				this._removeTile(key);
			}
		}
	},

	_removeTile: function (key) {
		var tile = this._tiles[key];

		if (tile.parentNode) {
			tile.parentNode.removeChild(tile);
		}

		delete this._tiles[key];

		this.fire('tileunload', {tile: tile});
	},

	_initTile: function (tile) {
		var size = this._getTileSize();

		L.DomUtil.addClass(tile, 'leaflet-tile');

		tile.style.width = size + 'px';
		tile.style.height = size + 'px';

		tile.onselectstart = L.Util.falseFn;
		tile.onmousemove = L.Util.falseFn;

		if (L.Browser.ielt9 && this.options.opacity !== undefined) {
			L.DomUtil.setOpacity(tile, this.options.opacity);
		}

		// without this hack, tiles disappear after zoom on Chrome for Android
		// https://github.com/Leaflet/Leaflet/issues/2078
		if (L.Browser.mobileWebkit3d) {
			tile.style.WebkitBackfaceVisibility = 'hidden';
		}
	},

	_addTile: function (coords, container) {
		var tilePos = this._getTilePos(coords),
		    tile = this.createTile(coords);

		// TODO wrapping happens here?

		this._initTile(tile);

		if (this.createTile.length < 2) {
			this._tileReady(tile);
			// TODO pass tileReady to createTile for async
		}

		/*
		Chrome 20 layouts much faster with top/left (verify with timeline, frames)
		Android 4 browser has display issues with top/left and requires transform instead
		Android 2 browser requires top/left or tiles disappear on load or first drag
		(reappear after zoom) https://github.com/CloudMade/Leaflet/issues/866
		(other browsers don't currently care) - see debug/hacks/jitter.html for an example
		*/
		L.DomUtil.setPosition(tile, tilePos, L.Browser.chrome || L.Browser.android23);

		this._tiles[this._tileCoordsToKey(coords)] = tile;

		container.appendChild(tile);
	},

	_tileReady: function (tile) {
		L.DomUtil.addClass(tile, 'leaflet-tile-loaded');

		this.fire('tileload', {tile: tile});

		this._tilesToLoad--;

		if (this._tilesToLoad === 0) {
			this._visibleTilesReady();
		}
	},

	_visibleTilesReady: function () {
		this.fire('load');

		if (this._animated) {
			// clear scaled tiles after all new tiles are loaded (for performance)
			this._clearBgBuffer();

			// TODO find out why timeout was needed
			// clearTimeout(this._clearBgBufferTimer);
			// this._clearBgBufferTimer = setTimeout(L.bind(this._clearBgBuffer, this), 500);
		}
	},

	_getTilePos: function (tilePoint) {
		var origin = this._map.getPixelOrigin(),
		    tileSize = this._getTileSize();

		return tilePoint.multiplyBy(tileSize).subtract(origin);
	},

	_animateZoom: function (e) {
		if (!this._animating) {
			this._animating = true;
			this._prepareBgBuffer();
		}

		var bg = this._bgBuffer,
		    transform = L.DomUtil.TRANSFORM,
		    initialTransform = e.delta ? L.DomUtil.getTranslateString(e.delta) : bg.style[transform],
		    scaleStr = L.DomUtil.getScaleString(e.scale, e.origin);

		bg.style[transform] = e.backwards ?
				scaleStr + ' ' + initialTransform :
				initialTransform + ' ' + scaleStr;
	},

	_endZoomAnim: function () {
		var front = this._tileContainer,
		    bg = this._bgBuffer;

		front.style.visibility = '';
		front.parentNode.appendChild(front); // Bring to fore

		// force reflow
		L.Util.falseFn(bg.offsetWidth);

		this._animating = false;
	},

	_clearBgBuffer: function () {
		var map = this._map;

		if (map && !map._animatingZoom && !map.touchZoom._zooming) {
			this._bgBuffer.innerHTML = '';
			this._bgBuffer.style[L.DomUtil.TRANSFORM] = '';
		}
	},

	_prepareBgBuffer: function () {
		this._swapBgBuffer();
		// TODO override in TileLayer
	},

	_swapBgBuffer: function () {

		var front = this._tileContainer,
		    bg = this._bgBuffer;

		// prepare the buffer to become the front tile pane
		bg.style.visibility = 'hidden';
		bg.style[L.DomUtil.TRANSFORM] = '';

		// switch out the current layer to be the new bg layer (and vice-versa)
		this._tileContainer = bg;
		this._bgBuffer = front;

		// prevent bg buffer from clearing right after zoom
		clearTimeout(this._clearBgBufferTimer);
	}

	// _getWrapTileNum: function () {
	// 	var crs = this._map.options.crs,
	// 	    size = crs.getSize(this._map.getZoom());
	// 	return size.divideBy(this.options.tileSize);
	// },

	// _adjustTilePoint: function (tilePoint) {

	// 	var limit = this._getWrapTileNum();

	// 	// wrap tile coordinates
	// 	if (!this.options.continuousWorld && !this.options.noWrap) {
	// 		tilePoint.x = ((tilePoint.x % limit.x) + limit.x) % limit.x;
	// 	}
	// },

	// _loadTile: function (tile, tilePoint) {
	// 	tile._layer  = this;
	// 	tile.onload  = this._tileOnLoad;
	// 	tile.onerror = this._tileOnError;

	// 	this._adjustTilePoint(tilePoint);
	// 	tile.src     = this.getTileUrl(tilePoint);

	// 	this.fire('tileloadstart', {
	// 		tile: tile,
	// 		url: tile.src
	// 	});
	// },
});

L.gridLayer = function (options) {
	return new L.GridLayer(options);
};

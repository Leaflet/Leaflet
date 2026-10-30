import {Layer} from '../Layer.js';
import * as Util from '../../core/Util.js';
import * as DomUtil from '../../dom/DomUtil.js';
import {Point} from '../../geometry/Point.js';
import {Bounds} from '../../geometry/Bounds.js';
import {LatLngBounds} from '../../geo/LatLngBounds.js';

/** @import {Defaults, GridLayerEventMap, GridLayerOptions, LatLngBoundsExpression, LeafletEvent, TileErrorEvent,
 *    TileEvent, WorldCopyJumpEvent, ZoomAnimEvent} from '../../types.js' */
/** @import {LatLng} from '../../geo/LatLng.js' */
/** @import {LeafletMap} from '../../map/Map.js' */

const defaultOptions = {
	/**
	 * Width and height of tiles in the grid. Use a number if width
	 * and height are equal, or `Point(width, height)` otherwise.
	 * @type {number | Point}
	 */
	tileSize: 256,

	/** Opacity of the tiles. Can be used in the `createTile()` function. */
	opacity: 1,

	/** Load new tiles only when panning ends. */
	updateWhenIdle: false,

	/**
	 * By default, a smooth zoom animation (during a [pinch zoom](#map-pinchzoom) or a [`flyTo()`](#map-flyto))
	 * will update grid layers every integer zoom level. Setting this option to `false` will
	 * update the grid layer only when the smooth animation ends.
	 */
	updateWhenZooming: true,

	/** Tiles will not update more than once every `updateInterval` milliseconds when panning. */
	updateInterval: 200,

	/** The explicit zIndex of the tile layer. */
	zIndex: 1,

	/**
	 * If set, tiles will only be loaded inside the set `LatLngBounds`.
	 * @type {LatLngBoundsExpression | null}
	 */
	bounds: null,

	/** The minimum zoom level down to which this layer will be displayed (inclusive). */
	minZoom: 0,

	/**
	 * The maximum zoom level up to which this layer will be displayed (inclusive).
	 * @type {number | undefined}
	 */
	maxZoom: undefined,

	/**
	 * Maximum zoom number the tile source has available. If it is specified, the tiles on all zoom levels
	 * higher than `maxNativeZoom` will be loaded from `maxNativeZoom` level and auto-scaled.
	 * @type {number | undefined}
	 */
	maxNativeZoom: undefined,

	/**
	 * Minimum zoom number the tile source has available. If it is specified, the tiles on all zoom levels
	 * lower than `minNativeZoom` will be loaded from `minNativeZoom` level and auto-scaled.
	 * @type {number | undefined}
	 */
	minNativeZoom: undefined,

	/**
	 * Whether the layer is wrapped around the antimeridian. If `true`, the GridLayer will only be displayed once
	 * at low zoom levels. Has no effect when the [map CRS](#map-crs) doesn't wrap around. Can be used in combination
	 * with [`bounds`](#gridlayer-bounds) to prevent requesting tiles outside the CRS limits.
	 */
	noWrap: false,

	/** `Map pane` where the grid layer will be added. */
	pane: 'tilePane',

	/** A custom class name to assign to the tile layer. Empty by default. */
	className: '',

	/** When panning the map, keep this many rows and columns of tiles before unloading them. */
	keepBuffer: 2
};

/** @typedef {typeof defaultOptions} GridLayerDefaults */

/**
 * @typedef {Object} GridLayerEvents
 * @property {LeafletEvent} loading Fired when the grid layer starts loading tiles.
 * @property {TileEvent} tileunload Fired when a tile is removed (e.g. when a tile goes off the screen).
 * @property {TileEvent} tileloadstart Fired when a tile is requested and starts loading.
 * @property {TileErrorEvent} tileerror Fired when there is an error loading a tile.
 * @property {TileEvent} tileload Fired when a tile loads.
 * @property {LeafletEvent} load Fired when the grid layer loaded all visible tiles.
 */

/** @typedef {{el: HTMLElement, coords: Coords, current: boolean, retain?: boolean, active?: boolean, loaded?: boolean}} GridTile */
/** @typedef {{el: HTMLElement, origin: Point, zoom: number}} GridLevel */

/**
 * A `Point` with the tile's zoom level as `z`, as `createTile` and `getTileUrl` get it.
 * @typedef {Point & {z: number}} Coords
 */

/**
 * The callback `createTile` gets: call it once the tile is ready, with an error if it failed to load.
 * @typedef {(error?: unknown, tile?: HTMLElement) => void} DoneCallback
 */

/**
 * @typedef {Object} TileEventProps
 * @property {HTMLElement} tile The tile element (image).
 * @property {Coords} coords Point object with the tile's `x`, `y`, and `z` (zoom level) coordinates.
 */

/**
 * @typedef {Object} TileErrorEventProps
 * @property {unknown} error Error passed to the tile's `done()` callback.
 */

/**
 * Generic class for handling a tiled grid of HTML elements. This is the base class for all tile layers and
 * replaces `TileLayer.Canvas`. GridLayer can be extended to create a tiled grid of HTML elements like
 * `<canvas>`, `<img>` or `<div>`. GridLayer will handle creating and animating these DOM elements for you.
 * @example
 * To create a custom layer, extend GridLayer and implement the `createTile()` method, which will be passed a `Point` object with the `x`, `y`, and `z` (zoom level) coordinates to draw your tile.
 *
 * ```js
 * class CanvasLayer extends GridLayer {
 *     createTile(coords) {
 *         // create a <canvas> element for drawing
 *         const tile = DomUtil.create('canvas', 'leaflet-tile');
 *
 *         // setup tile width and height according to the options
 *         const size = this.getTileSize();
 *         tile.width = size.x;
 *         tile.height = size.y;
 *
 *         // get a canvas context and draw something on it using coords.x, coords.y and coords.z
 *         const ctx = tile.getContext('2d');
 *
 *         // return the tile so it can be rendered on screen
 *         return tile;
 *     }
 * }
 * ```
 * @example
 * Tile creation can also be asynchronous, this is useful when using a third-party drawing library. Once the tile is finished drawing it can be passed to the `done()` callback.
 *
 * ```js
 * class CanvasLayer extends GridLayer {
 *     createTile(coords, done) {
 *         const error;
 *
 *         // create a <canvas> element for drawing
 *         const tile = DomUtil.create('canvas', 'leaflet-tile');
 *
 *         // setup tile width and height according to the options
 *         const size = this.getTileSize();
 *         tile.width = size.x;
 *         tile.height = size.y;
 *
 *         // draw something asynchronously and pass the tile to the done() callback
 *         setTimeout(function() {
 *             done(error, tile);
 *         }, 1000);
 *
 *         return tile;
 *     }
 * }
 * ```
 * @categoryDescription Extension methods
 * Layers extending `GridLayer` shall reimplement the following method.
 * @template {GridLayerOptions} [O=GridLayerOptions]
 * @template {GridLayerEventMap} [E=GridLayerEventMap]
 * @extends {Layer<O, E>}
 */
export class GridLayer extends Layer {

	static initHooks = true;

	/** @type {Defaults<GridLayerOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Creates a new instance of GridLayer with the supplied options.
	 * @param {Partial<O>} [options]
	 */
	constructor(options) {
		super();
		Util.setOptions(this, options);
		this.callInitHooks();
	}

	/** @param {LeafletMap} map */
	onAdd(map) {
		this._initContainer();

		/** @type {{[zoom: string]: GridLevel}} */
		this._levels = {};
		/** @type {{[key: string]: GridTile}} */
		this._tiles = {};

		this._resetView(); // implicit _update() call
	}

	/** @param {LeafletMap} map */
	beforeAdd(map) {
		map._addZoomLimit(this);
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		this._removeAllTiles();
		this._container.remove();
		map._removeZoomLimit(this);
		this._container = /** @type {any} */ (null);
		this._tileZoom = undefined;
		clearTimeout(this._pruneTimeout);
		cancelAnimationFrame(this._fadePruneFrame);
		/** @type {number} */
		this._fadePruneFrame = 0;
	}

	/** Brings the tile layer to the top of all tile layers. */
	bringToFront() {
		if (this._map) {
			DomUtil.toFront(this._container);
			this._setAutoZIndex(Math.max);
		}
		return this;
	}

	/** Brings the tile layer to the bottom of all tile layers. */
	bringToBack() {
		if (this._map) {
			DomUtil.toBack(this._container);
			this._setAutoZIndex(Math.min);
		}
		return this;
	}

	/**
	 * Returns the HTML element that contains the tiles for this layer, or `null` once the layer is removed.
	 * @returns {HTMLElement | null}
	 */
	getContainer() {
		return this._container;
	}

	/**
	 * Changes the [opacity](#gridlayer-opacity) of the grid layer.
	 * @param {number} opacity
	 */
	setOpacity(opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
		return this;
	}

	/**
	 * Changes the [zIndex](#gridlayer-zindex) of the grid layer.
	 * @param {number} zIndex
	 */
	setZIndex(zIndex) {
		this.options.zIndex = zIndex;
		this._updateZIndex();

		return this;
	}

	/** Returns `true` if any tile in the grid layer has not finished loading. */
	isLoading() {
		return !!this._loading;
	}

	/** Causes the layer to clear all the tiles and request them again. */
	redraw() {
		if (this._map) {
			this._removeAllTiles();
			const tileZoom = this._clampZoom(Math.round(this._map.getZoom()));
			if (tileZoom !== this._tileZoom) {
				this._tileZoom = tileZoom;
				this._updateLevels();
			}
			this._update();
		}
		return this;
	}

	getEvents() {
		/** @type {{[type: string]: (e: any) => void}} */
		const events = {
			viewprereset: this._invalidateAll,
			viewreset: this._resetView,
			zoom: this._resetView,
			moveend: this._onMoveEnd,
			worldcopyjump: this._onWorldCopyJump,
			zoomanim: this._animateZoom
		};

		if (!this.options.updateWhenIdle) {
			// update tiles on move, but not more often than once per given interval
			if (!this._onMove) {
				this._onMove = Util.throttle(this._onMoveEnd, this.options.updateInterval, this);
			}

			events.move = this._onMove;
		}

		return events;
	}

	/**
	 * Called only internally, must be overridden by classes extending `GridLayer`. Returns
	 * the `HTMLElement` corresponding to the given `coords`. If the `done` callback is specified,
	 * it must be called when the tile has finished loading and drawing.
	 * @category Extension methods
	 * @overload
	 * @param {Coords} coords
	 * @param {DoneCallback} done
	 * @returns {HTMLElement}
	 */
	// no params here: `_addTile` treats a `createTile` that declares `done` as asynchronous
	createTile() {
		return document.createElement('div');
	}

	/** Normalizes the [tileSize option](#gridlayer-tilesize) into a point. Used by the `createTile()` method. */
	getTileSize() {
		const s = this.options.tileSize;
		return s instanceof Point ? s : new Point(s, s);
	}

	_updateZIndex() {
		if (this._container && this.options.zIndex !== undefined && this.options.zIndex !== null) {
			this._container.style.zIndex = `${this.options.zIndex}`;
		}
	}

	/** @param {(a: number, b: number) => number} compare */
	_setAutoZIndex(compare) {
		// go through all other layers of the same pane, set zIndex to max + 1 (front) or min - 1 (back)

		const layers = /** @type {HTMLCollectionOf<HTMLElement>} */ (this.getPane().children);
		let edgeZIndex = -compare(-Infinity, Infinity); // -Infinity for max, Infinity for min

		for (const layer of layers) {
			const zIndex = layer.style.zIndex;

			if (layer !== this._container && zIndex) {
				edgeZIndex = compare(edgeZIndex, +zIndex);
			}
		}

		if (isFinite(edgeZIndex)) {
			this.options.zIndex = edgeZIndex + compare(-1, 1);
			this._updateZIndex();
		}
	}

	_updateOpacity() {
		if (!this._map) { return; }

		this._container.style.opacity = `${this.options.opacity}`;
	}

	_onOpaqueTile() {}

	_initContainer() {
		if (this._container) { return; }

		/** @type {HTMLElement} */
		this._container = DomUtil.create('div', `leaflet-layer ${this.options.className ?? ''}`);
		this._updateZIndex();

		if (this.options.opacity < 1) {
			this._updateOpacity();
		}

		this.getPane().appendChild(this._container);
	}

	_updateLevels() {

		const zoom = this._tileZoom,
		maxZoom = /** @type {number} */ (this.options.maxZoom);

		if (zoom === undefined) { return undefined; }

		for (const z of Object.keys(this._levels).map(Number)) {
			if (this._levels[z].el.children.length || z === zoom) {
				this._levels[z].el.style.zIndex = `${maxZoom - Math.abs(zoom - z)}`;
				this._onUpdateLevel(z);
			} else {
				this._levels[z].el.remove();
				this._removeTilesAtZoom(z);
				this._onRemoveLevel(z);
				delete this._levels[z];
			}
		}

		let level = this._levels[zoom];
		const map = this._map;

		if (!level) {
			level = this._levels[zoom] = /** @type {GridLevel} */ ({});

			level.el = DomUtil.create('div', 'leaflet-tile-container leaflet-zoom-animated', this._container);
			level.el.style.zIndex = `${maxZoom}`;

			level.origin = map.project(map.unproject(map.getPixelOrigin()), zoom).round();
			level.zoom = zoom;

			this._setZoomTransform(level, map.getCenter(), map.getZoom());

			// force reading offsetWidth so the browser considers the newly added element for transition
			/** @type {(...args: unknown[]) => false} */ (Util.falseFn)(level.el.offsetWidth);

			this._onCreateLevel(level);
		}

		/** @type {GridLevel} */
		this._level = level;

		return level;
	}

	_onUpdateLevel() {}

	_onRemoveLevel() {}

	_onCreateLevel() {}

	_pruneTiles() {
		if (!this._map) {
			return;
		}

		const zoom = this._map.getZoom();
		if (zoom > /** @type {number} */ (this.options.maxZoom) ||
			zoom < this.options.minZoom) {
			this._removeAllTiles();
			return;
		}

		for (const tile of Object.values(this._tiles)) {
			tile.retain = tile.current;
		}

		for (const tile of Object.values(this._tiles)) {
			if (tile.current && !tile.active) {
				const coords = tile.coords;
				if (!this._retainParent(coords.x, coords.y, coords.z, coords.z - 5)) {
					this._retainChildren(coords.x, coords.y, coords.z, coords.z + 2);
				}
			}
		}

		for (const [key, tile] of Object.entries(this._tiles)) {
			if (!tile.retain) {
				this._removeTile(key);
			}
		}
	}

	/** @param {number} zoom */
	_removeTilesAtZoom(zoom) {
		for (const [key, tile] of Object.entries(this._tiles)) {
			if (tile.coords.z === zoom) {
				this._removeTile(key);
			}
		}
	}

	_removeAllTiles() {
		for (const key of Object.keys(this._tiles)) {
			this._removeTile(key);
		}
	}

	/** @param {{center: LatLng, zoom: number}} [e] the `viewprereset` event */
	_invalidateAll(e) {
		// a zoom without animation keeps the old levels until new tiles load, like the end of an animated one,
		// unless the view jumps somewhere else
		const map = this._map;
		if (e?.zoom !== undefined && e.zoom !== map.getZoom() && map.getBounds().contains(e.center)) { return; }

		for (const z of Object.keys(this._levels)) {
			this._levels[z].el.remove();
			this._onRemoveLevel(Number(z));
			delete this._levels[z];
		}
		this._removeAllTiles();

		this._tileZoom = undefined;
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 * @param {number} minZoom
	 */
	_retainParent(x, y, z, minZoom) {
		for (z--; z >= minZoom; z--) {
			x = Math.floor(x / 2);
			y = Math.floor(y / 2);
			if (this._retain(x, y, z)) { return true; }
		}
		return false;
	}

	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 * @param {number} maxZoom
	 */
	_retainChildren(x, y, z, maxZoom) {
		for (let i = 2 * x; i < 2 * x + 2; i++) {
			for (let j = 2 * y; j < 2 * y + 2; j++) {
				if (!this._retain(i, j, z + 1) && z + 1 < maxZoom) {
					this._retainChildren(i, j, z + 1, maxZoom);
				}
			}
		}
	}

	// retains the tile if it's loaded; returns true if it's active, so there's no need to look further
	/**
	 * @param {number} x
	 * @param {number} y
	 * @param {number} z
	 */
	_retain(x, y, z) {
		const tile = this._tiles[this._tileCoordsToKey({x, y, z})];
		if (tile?.loaded) { tile.retain = true; }
		return tile?.active;
	}

	/** @param {{pinch?: boolean, flyTo?: boolean}} [e] */
	_resetView(e) {
		const animating = e && (e.pinch || e.flyTo);
		this._setView(this._map.getCenter(), this._map.getZoom(), animating, animating);
	}

	/** @param {ZoomAnimEvent} e */
	_animateZoom(e) {
		this._setView(e.center, e.zoom, true, e.noUpdate);
	}

	/** @param {number} zoom */
	_clampZoom(zoom) {
		const options = this.options;

		if (undefined !== options.minNativeZoom && zoom < options.minNativeZoom) {
			return options.minNativeZoom;
		}

		if (undefined !== options.maxNativeZoom && options.maxNativeZoom < zoom) {
			return options.maxNativeZoom;
		}

		return zoom;
	}

	/**
	 * @param {LatLng} center
	 * @param {number} zoom
	 * @param {boolean} [noPrune]
	 * @param {boolean} [noUpdate]
	 */
	_setView(center, zoom, noPrune, noUpdate) {
		/** @type {number | undefined} */
		let tileZoom = Math.round(zoom);
		if ((this.options.maxZoom !== undefined && tileZoom > this.options.maxZoom) ||
		    (this.options.minZoom !== undefined && tileZoom < this.options.minZoom)) {
			tileZoom = undefined;
		} else {
			tileZoom = this._clampZoom(tileZoom);
		}

		const tileZoomChanged = this.options.updateWhenZooming && (tileZoom !== this._tileZoom);

		if (!noUpdate || tileZoomChanged) {

			/** @type {number | undefined} */
			this._tileZoom = tileZoom;

			if (this._abortLoading) {
				this._abortLoading();
			}

			this._updateLevels();
			this._resetGrid();

			if (tileZoom !== undefined) {
				this._update(center);
			}

			if (!noPrune) {
				this._pruneTiles();
			}

			// Flag to prevent finished tile fades from pruning tiles during
			// a zoom anim or a pinch gesture
			/** @type {boolean} */
			this._noPrune = !!noPrune;
		}

		this._setZoomTransforms(center, zoom);
	}

	/**
	 * @param {LatLng} center
	 * @param {number} zoom
	 */
	_setZoomTransforms(center, zoom) {
		for (const level of Object.values(this._levels)) {
			this._setZoomTransform(level, center, zoom);
		}
	}

	/**
	 * @param {GridLevel} level
	 * @param {LatLng} center
	 * @param {number} zoom
	 */
	_setZoomTransform(level, center, zoom) {
		const scale = this._map.getZoomScale(zoom, level.zoom),
		translate = level.origin.multiplyBy(scale)
			.subtract(this._map._getNewPixelOrigin(center, zoom)).round();

		DomUtil.setTransform(level.el, translate, scale);
	}

	_resetGrid() {
		const map = this._map,
		crs = map.options.crs,
		tileSize = this._tileSize = this.getTileSize(),
		tileZoom = this._tileZoom;

		const bounds = this._map.getPixelWorldBounds(this._tileZoom);
		if (bounds) {
			/** @type {Bounds} */
			this._globalTileRange = this._pxBoundsToTileRange(bounds);
		}

		this._wrapX = crs.wrapLng && !this.options.noWrap && [
			Math.floor(map.project([0, crs.wrapLng[0]], tileZoom).x / tileSize.x),
			Math.ceil(map.project([0, crs.wrapLng[1]], tileZoom).x / tileSize.x)
		];
		this._wrapY = crs.wrapLat && !this.options.noWrap && [
			Math.floor(map.project([crs.wrapLat[0], 0], tileZoom).y / tileSize.y),
			Math.ceil(map.project([crs.wrapLat[1], 0], tileZoom).y / tileSize.y)
		];
	}

	_onMoveEnd() {
		if (!this._map || this._map._animatingZoom) { return; }

		this._update();
	}

	/** @param {WorldCopyJumpEvent} e */
	_onWorldCopyJump({worlds}) {
		// noWrap tiles cannot be reused in another world copy.
		if (!this._wrapX) { return; }

		const tileSize = this.getTileSize(),
		/** @type {{[key: string]: GridTile}} */
		tiles = {};

		for (const tile of Object.values(this._tiles)) {
			const {coords, el} = tile,
			dx = worlds * /** @type {Bounds} */ (this._map.getPixelWorldBounds(coords.z)).getSize().x;

			// tiles can't be shifted by a fraction of a column, so leave those to be reloaded
			if (dx % tileSize.x === 0) {
				coords.x -= dx / tileSize.x;
				DomUtil.setPosition(el, DomUtil.getPosition(el).subtract([dx, 0]), true);
			}
			tiles[this._tileCoordsToKey(coords)] = tile;
		}

		this._tiles = tiles;
	}

	/** @param {LatLng} center */
	_getTiledPixelBounds(center) {
		const map = this._map,
		mapZoom = map._animatingZoom ? Math.max(map._animateToZoom, map.getZoom()) : map.getZoom(),
		scale = map.getZoomScale(mapZoom, this._tileZoom),
		pixelCenter = map.project(center, this._tileZoom).floor(),
		halfSize = map.getSize().divideBy(scale * 2);

		return new Bounds(pixelCenter.subtract(halfSize), pixelCenter.add(halfSize));
	}

	// Private method to load tiles in the grid's active zoom level according to map bounds
	/** @param {LatLng} [center] */
	_update(center) {
		const map = this._map;
		if (!map) { return; }
		const zoom = this._clampZoom(map.getZoom());

		if (center === undefined) { center = map.getCenter(); }
		if (this._tileZoom === undefined) { return; }	// if out of minzoom/maxzoom

		const pixelBounds = this._getTiledPixelBounds(center),
		tileRange = this._pxBoundsToTileRange(pixelBounds),
		tileCenter = tileRange.getCenter(),
		/** @type {Coords[]} */
		queue = [],
		margin = this.options.keepBuffer,
		noPruneRange = new Bounds(tileRange.getBottomLeft().subtract([margin, -margin]),
			tileRange.getTopRight().add([margin, -margin]));

		// Sanity check: panic if the tile range contains Infinity somewhere.
		if (!(isFinite(tileRange.min.x) &&
		      isFinite(tileRange.min.y) &&
		      isFinite(tileRange.max.x) &&
		      isFinite(tileRange.max.y))) { throw new Error('Attempted to load an infinite number of tiles'); }

		for (const tile of Object.values(this._tiles)) {
			const c = tile.coords;
			if (c.z !== this._tileZoom || !noPruneRange.contains(new Point(c.x, c.y))) {
				tile.current = false;
			}
		}

		// _update just loads more tiles. If the tile zoom level differs too much
		// from the map's, let _setView reset levels and prune old tiles.
		if (Math.abs(zoom - this._tileZoom) > 1) { this._setView(center, zoom); return; }

		// create a queue of coordinates to load tiles from
		for (let j = tileRange.min.y; j <= tileRange.max.y; j++) {
			for (let i = tileRange.min.x; i <= tileRange.max.x; i++) {
				const coords = /** @type {Coords} */ (new Point(i, j));
				coords.z = this._tileZoom;

				if (!this._isValidTile(coords)) { continue; }

				const tile = this._tiles[this._tileCoordsToKey(coords)];
				if (tile) {
					tile.current = true;
				} else {
					queue.push(coords);
				}
			}
		}

		// sort tile queue to load tiles in order of their distance to center
		queue.sort((a, b) => a.distanceTo(tileCenter) - b.distanceTo(tileCenter));

		if (queue.length !== 0) {
			// if it's the first batch of tiles to load
			if (!this._loading) {
				/** @type {boolean} */
				this._loading = true;
				this.fire('loading');
			}

			// create DOM fragment to append tiles in one batch
			const fragment = document.createDocumentFragment();

			for (const q of queue) {
				this._addTile(q, fragment);
			}

			this._level.el.appendChild(fragment);
		}
	}

	/** @param {Coords} coords */
	_isValidTile(coords) {
		const crs = this._map.options.crs;

		if (!crs.infinite) {
			// don't load tile if it's out of bounds and not wrapped
			const bounds = this._globalTileRange;
			if ((!crs.wrapLng && (coords.x < bounds.min.x || coords.x > bounds.max.x)) ||
			    (!crs.wrapLat && (coords.y < bounds.min.y || coords.y > bounds.max.y))) { return false; }
		}

		if (!this.options.bounds) { return true; }

		// don't load tile if it doesn't intersect the bounds in options
		const tileBounds = this._tileCoordsToBounds(coords);
		return new LatLngBounds(this.options.bounds).overlaps(tileBounds);
	}

	/**
	 * @param {Coords} coords
	 * @returns {[LatLng, LatLng]}
	 */
	_tileCoordsToNwSe(coords) {
		const map = this._map,
		tileSize = this.getTileSize(),
		nwPoint = coords.scaleBy(tileSize),
		sePoint = nwPoint.add(tileSize),
		nw = map.unproject(nwPoint, coords.z),
		se = map.unproject(sePoint, coords.z);
		return [nw, se];
	}

	// converts tile coordinates to its geographical bounds
	/** @param {Coords} coords */
	_tileCoordsToBounds(coords) {
		const bp = this._tileCoordsToNwSe(coords);
		let bounds = new LatLngBounds(bp[0], bp[1]);

		if (!this.options.noWrap) {
			bounds = this._map.wrapLatLngBounds(bounds);
		}
		return bounds;
	}
	// converts tile coordinates to key for the tile cache
	/** @param {{x: number, y: number, z: number}} coords */
	_tileCoordsToKey(coords) {
		return `${coords.x}:${coords.y}:${coords.z}`;
	}

	/** @param {string} key */
	_removeTile(key) {
		const tile = this._tiles[key];
		if (!tile) { return; }

		tile.el.remove();

		delete this._tiles[key];

		this.fire('tileunload', {
			tile: tile.el,
			coords: tile.coords
		});
	}

	/** @param {HTMLElement} tile */
	_initTile(tile) {
		tile.classList.add('leaflet-tile');

		const tileSize = this.getTileSize();
		tile.style.width = `${tileSize.x}px`;
		tile.style.height = `${tileSize.y}px`;
	}

	/**
	 * @param {Coords} coords
	 * @param {DocumentFragment} container
	 */
	_addTile(coords, container) {
		const tilePos = this._getTilePos(coords),
		key = this._tileCoordsToKey(coords);

		const tile = this.createTile(this._wrapCoords(coords), this._tileReady.bind(this, coords));

		this._initTile(tile);

		// if createTile is defined with a second argument ("done" callback),
		// we know that tile is async and will be ready later; otherwise
		if (this.createTile.length < 2) {
			// mark tile as ready, but delay one frame for opacity animation to happen
			requestAnimationFrame(this._tileReady.bind(this, coords, null, tile));
		}

		// 2D, so tiles raster into the level's layer: as separate layers they get compositor edge antialiasing,
		// and the overlapping edge ramps show as light seams under plus-lighter blending
		DomUtil.setPosition(tile, tilePos, true);

		// save tile in cache
		this._tiles[key] = {
			el: tile,
			coords,
			current: true
		};

		container.appendChild(tile);
		this.fire('tileloadstart', {
			tile,
			coords
		});
	}

	/**
	 * @param {Coords} coords
	 * @param {unknown} [err]
	 * @param {HTMLElement} [el]
	 */
	_tileReady(coords, err, el) {
		if (err) {
			this.fire('tileerror', {
				error: err,
				tile: el,
				coords
			});
		}

		const tile = this._tiles[this._tileCoordsToKey(coords)];
		if (!tile) { return; }

		if (!this._map._fadeAnimated) {
			tile.active = true;
			this._pruneTiles();
		} else if (!tile.loaded) { // with errorTileUrl, a tile is ready twice (on error and on fallback load)
			// while fading, the tile is a compositor layer of its own where plus-lighter would light up its
			// antialiased edges, so it's blended normally until the fade ends
			tile.el.classList.add('leaflet-tile-fading');
			tile.el.animate({opacity: [0, 1]}, 200).onfinish = this._onTileFaded.bind(this, tile);
		}
		tile.loaded = true;

		if (!err) {
			tile.el.classList.add('leaflet-tile-loaded');

			this.fire('tileload', {
				tile: tile.el,
				coords
			});
		}

		// a tileload listener may have removed the layer, emptying the tile list
		if (this._map && this._noTilesToLoad()) {
			this._loading = false;
			this.fire('load');

			if (!this._map) { return; } // removed by a load listener

			if (!this._map._fadeAnimated) {
				requestAnimationFrame(this._pruneTiles.bind(this));
			} else {
				// Wait a bit more than 0.2 secs (the duration of the tile fade-in)
				// to trigger a pruning.
				/** @type {number | undefined} */
				this._pruneTimeout = setTimeout(this._pruneTiles.bind(this), 250);
			}
		}
	}

	/** @param {GridTile} tile */
	_onTileFaded(tile) {
		tile.el.classList.remove('leaflet-tile-fading');
		// the tile's key may have changed after a world copy jump, so look it up again
		if (this._tiles[this._tileCoordsToKey(tile.coords)] !== tile) { return; }

		tile.active = true;
		this._onOpaqueTile(tile);

		// one prune for all the tiles that finish fading in the same frame
		if (this._noPrune || this._fadePruneFrame) { return; }
		this._fadePruneFrame = requestAnimationFrame(() => {
			this._fadePruneFrame = 0;
			if (!this._noPrune) { this._pruneTiles(); }
		});
	}

	/** @param {Point} coords */
	_getTilePos(coords) {
		return coords.scaleBy(this.getTileSize()).subtract(this._level.origin);
	}

	/** @param {Coords} coords */
	_wrapCoords(coords) {
		const newCoords = /** @type {Coords} */ (new Point(
			this._wrapX ? Util.wrapNum(coords.x, this._wrapX) : coords.x,
			this._wrapY ? Util.wrapNum(coords.y, this._wrapY) : coords.y));
		newCoords.z = coords.z;
		return newCoords;
	}

	/** @param {Bounds} bounds */
	_pxBoundsToTileRange(bounds) {
		const tileSize = this.getTileSize();
		return new Bounds(
			bounds.min.unscaleBy(tileSize).floor(),
			bounds.max.unscaleBy(tileSize).ceil().subtract([1, 1]));
	}

	_noTilesToLoad() {
		return Object.values(this._tiles).every(t => t.loaded);
	}
}

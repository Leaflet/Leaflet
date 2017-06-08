
import {GridLayer} from './GridLayer';
import * as Browser from '../../core/Browser';
import * as DomUtil from '../../dom/DomUtil';
import {toPoint} from '../../geometry/Point';
import {toBounds} from '../../geometry/Bounds';


/*
 * @class PixelGrid
 * @inherits GridLayer
 * @aka PixelGrid
 *
 * A specific type of `GridLayer` where each tile must be either a `HTMLImageElement`
 * or a `HTMLCanvasElement` (an `<img>` or a `<canvas>`).
 *
 * Image tiles will be stitched together into a `<canvas>` to avoid rendering
 * artifacts in some browsers. If the `dumpToCanvas` option is set to `false`,
 * then this class behaves exactly as a `GridLayer` where each tile is its own
 * `<img>` element.
 *
 */

export var PixelGrid = GridLayer.extend({
	options: {
		// @option dumpToCanvas: Boolean = true
		// Whether to dump loaded tile images to a `<canvas>` or not
		// (Disabled by default in IE)
		dumpToCanvas: Browser.canvas && !Browser.ie
	},

	_onUpdateLevel: function (z, zoom) {
		if (this.options.dumpToCanvas) {
			this._levels[z].canvas.style.zIndex = this.options.maxZoom - Math.abs(zoom - z);
		}
	},

	_onRemoveLevel: function (z) {
		if (this.options.dumpToCanvas) {
			DomUtil.remove(this._levels[z].canvas);
		}
	},

	_onCreateLevel: function (level) {
		if (this.options.dumpToCanvas) {
			level.canvas = DomUtil.create('canvas', 'leaflet-tile-container leaflet-zoom-animated', this._container);
			level.ctx = level.canvas.getContext('2d');
			this._resetCanvasSize(level);
		}
	},

	_removeTile: function (key) {
		if (this.options.dumpToCanvas) {
			var tile = this._tiles[key],
			    level = this._levels[tile.coords.z],
			    tileSize = this.getTileSize();

			if (level) {
				// Where in the canvas should this tile go?
				var offset = toPoint(tile.coords.x, tile.coords.y).subtract(level.canvasRange.min).scaleBy(this.getTileSize());

				level.ctx.clearRect(offset.x, offset.y, tileSize.x, tileSize.y);
			}
		}

		GridLayer.prototype._removeTile.call(this, key);
	},

	_resetCanvasSize: function (level) {
		var buff = this.options.keepBuffer,
		    pixelBounds = this._getTiledPixelBounds(this._map.getCenter()),
		    tileRange = this._pxBoundsToTileRange(pixelBounds),
		    tileSize = this.getTileSize();

		tileRange.min = tileRange.min.subtract([buff, buff]);	// This adds the no-prune buffer
		tileRange.max = tileRange.max.add([buff + 1, buff + 1]);

		var pixelRange = toBounds(
		        tileRange.min.scaleBy(tileSize),
		        tileRange.max.add([1, 1]).scaleBy(tileSize)	// This prevents an off-by-one when checking if tiles are inside
		    ),
		    mustRepositionCanvas = false,
		    neededSize = pixelRange.max.subtract(pixelRange.min);

		// Resize the canvas, if needed, and only to make it bigger.
		if (neededSize.x > level.canvas.width || neededSize.y > level.canvas.height) {
			// Resizing canvases erases the currently drawn content, I'm afraid.
			// To keep it, dump the pixels to another canvas, then display it on
			// top. This could be done with getImageData/putImageData, but that
			// would break for tainted canvases (in non-CORS tilesets)
			var oldSize = {x: level.canvas.width, y: level.canvas.height},
			    tmpCanvas = DomUtil.create('canvas');

			tmpCanvas.style.width  = (tmpCanvas.width  = oldSize.x) + 'px';
			tmpCanvas.style.height = (tmpCanvas.height = oldSize.y) + 'px';
			tmpCanvas.getContext('2d').drawImage(level.canvas, 0, 0);

			level.canvas.style.width  = (level.canvas.width  = neededSize.x) + 'px';
			level.canvas.style.height = (level.canvas.height = neededSize.y) + 'px';
			level.ctx.drawImage(tmpCanvas, 0, 0);
		}

		// Translate the canvas contents if it's moved around
		if (level.canvasRange) {
			var offset = level.canvasRange.min.subtract(tileRange.min).scaleBy(this.getTileSize());

			if (!Browser.safari) {
				// By default, canvases copy things "on top of" existing pixels, but we want
				// this to *replace* the existing pixels when doing a drawImage() call.
				// This will also clear the sides, so no clearRect() calls are needed to make room
				// for the new tiles.
				level.ctx.globalCompositeOperation = 'copy';
				level.ctx.drawImage(level.canvas, offset.x, offset.y);
				level.ctx.globalCompositeOperation = 'source-over';
			} else {
				// Safari clears the canvas when copying from itself :-(
				if (!this._tmpCanvas) {
					var t = this._tmpCanvas = DomUtil.create('canvas');
					t.width  = level.canvas.width;
					t.height = level.canvas.height;
					this._tmpContext = t.getContext('2d');
				}
				this._tmpContext.clearRect(0, 0, level.canvas.width, level.canvas.height);
				this._tmpContext.drawImage(level.canvas, 0, 0);
				level.ctx.clearRect(0, 0, level.canvas.width, level.canvas.height);
				level.ctx.drawImage(this._tmpCanvas, offset.x, offset.y);
			}

			mustRepositionCanvas = true;	// Wait until new props are set
		}

		level.canvasRange = tileRange;
		level.canvasPxRange = pixelRange;
		level.canvasOrigin = pixelRange.min;

		if (mustRepositionCanvas) {
			this._setCanvasZoomTransform(level, this._map.getCenter(), this._map.getZoom());
		}
	},

	// set transform/position of canvas, in addition to the transform/position of the individual tile container
	_setZoomTransform: function (level, center, zoom) {
		GridLayer.prototype._setZoomTransform.call(this, level, center, zoom);
		if (this.options.dumpToCanvas) {
			this._setCanvasZoomTransform(level, center, zoom);
		}
	},

	// This will get called twice:
	// * From _setZoomTransform
	// * When the canvas has shifted due to a new tile being loaded
	_setCanvasZoomTransform: function (level, center, zoom) {
		if (!level.canvasOrigin) { return; }
		var scale = this._map.getZoomScale(zoom, level.zoom),
		    translate = level.canvasOrigin.multiplyBy(scale)
		        .subtract(this._map._getNewPixelOrigin(center, zoom)).round();

		if (Browser.any3d) {
			DomUtil.setTransform(level.canvas, translate, scale);
		} else {
			DomUtil.setPosition(level.canvas, translate);
		}
	},

	_onOpaqueTile: function (tile) {
		if (!this.options.dumpToCanvas) { return; }

		this.dumpPixels(tile.coords, tile.el);

		// Do not remove the tile itself, as it is needed to check if the whole
		// level (and its canvas) should be removed (via level.el.children.length)
		tile.el.style.display = 'none';
	},

	// @section Extension methods
	// @uninheritable
	// Layers extending `PixelGrid` might call the following method.

	// @method dumpPixels(coords: Object, imageSource: CanvasImageSource): this
	// Dumps pixels from the given `CanvasImageSource` into the layer, into
	// the space for the tile represented by the `coords` tile coordinates (an object
	// like `{x: Number, y: Number, z: Number}`; the image source must have the
	// same size as the `tileSize` option for the layer. Has no effect if `dumpToCanvas`
	// is `false`.
	dumpPixels: function (coords, imageSource) {
		var level = this._levels[coords.z],
		    tileSize = this.getTileSize();

		if (!level.canvasRange) { return; }

		// Check if the tile is inside the currently visible map bounds
		// There is a possible race condition when tiles are loaded after they
		// have been panned outside of the map.
		if (!level.canvasRange.contains(coords)) {
			this._resetCanvasSize(level);
		}

		// Where in the canvas should this tile go?
		var offset = toPoint(coords.x, coords.y).subtract(level.canvasRange.min).scaleBy(this.getTileSize());

		level.ctx.drawImage(imageSource, offset.x, offset.y, tileSize.x, tileSize.y);

		// TODO: Clear the pixels of other levels' canvases where they overlap
		// this newly dumped tile.
		return this;
	}

});


// @factory pixelGrid(options?: PixelGrid options)
// Instantiates an empty pixel grid.
export function pixelGrid(url, options) {
	return new PixelGrid(url, options);
}


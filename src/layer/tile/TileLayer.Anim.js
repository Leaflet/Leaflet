/*
	Zoom animation logic for L.TileLayer.
*/

L.TileLayer.include({
	_animateZoom: function (e) {
		var firstFrame = false;

		if (!this._animating) {
			this._animating = true;
			firstFrame = true;
		}

		if (firstFrame) {
			this._prepareBgBuffer();
		}

		var transform = L.DomUtil.TRANSFORM,
		    bg = this._bgBuffer;

		if (firstFrame) {
			//prevent bg buffer from clearing right after zoom
			clearTimeout(this._clearBgBufferTimer);

			// hack to make sure transform is updated before running animation
			L.Util.falseFn(bg.offsetWidth);
		}

		var scaleStr = L.DomUtil.getScaleString(e.scale, e.origin),
		    oldTransform = bg.style[transform];

		bg.style[transform] = e.backwards ?
		        (e.delta ? L.DomUtil.getTranslateString(e.delta) : oldTransform) + ' ' + scaleStr :
		        scaleStr + ' ' + oldTransform;
	},

	_endZoomAnim: function () {
		var front = this._tileContainer,
		    bg = this._bgBuffer;

		front.style.visibility = '';
		front.style.zIndex = 2;

		bg.style.zIndex = 1;

		// force reflow
		L.Util.falseFn(bg.offsetWidth);

		this._animating = false;
	},

	_clearBgBuffer: function () {
		var map = this._map;

		if (!map._animatingZoom && !map.touchZoom._zooming) {
			this._bgBuffer.innerHTML = '';
			this._bgBuffer.style[L.DomUtil.TRANSFORM] = '';
		}
	},

	_prepareBgBuffer: function () {

		var front = this._tileContainer,
		    bg = this._bgBuffer;

		// if foreground layer doesn't have many tiles but bg layer does,
		// keep the existing bg layer and just zoom it some more

		if (bg && this._getLoadedTilesPercentage(bg) > 0.5 &&
		          this._getLoadedTilesPercentage(front) < 0.5) {

			front.style.visibility = 'hidden';
			this._stopLoadingImages(front);
			return;
		}

		// prepare the buffer to become the front tile pane
		bg.style.visibility = 'hidden';
		bg.style[L.DomUtil.TRANSFORM] = '';

		// switch out the current layer to be the new bg layer (and vice-versa)
		this._tileContainer = bg;
		bg = this._bgBuffer = front;

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

/*
 * Extends L.Map to handle zoom animations.
 */

L.Map.mergeOptions({
	zoomAnimation: L.DomUtil.TRANSITION && !L.Browser.android23 && !L.Browser.mobileOpera
});

if (L.DomUtil.TRANSITION) {
	L.Map.addInitHook(function () {
		L.DomEvent.on(this._mapPane, L.DomUtil.TRANSITION_END, this._catchTransitionEnd, this);
	});
}

L.Map.include(!L.DomUtil.TRANSITION ? {} : {

	_zoomToIfClose: function (center, zoom) {

		if (this._animatingZoom) { return true; }

		if (!this.options.zoomAnimation) { return false; }

		var scale = this.getZoomScale(zoom),
		    offset = this._getCenterOffset(center)._divideBy(1 - 1 / scale);

		// if offset does not exceed half of the view
		if (!this._offsetIsWithinView(offset, 1)) { return false; }

		L.DomUtil.addClass(this._mapPane, 'leaflet-zoom-anim');

		this
		    .fire('movestart')
		    .fire('zoomstart');

		this.fire('zoomanim', {
			center: center,
			zoom: zoom
		});

		var origin = this._getCenterLayerPoint().add(offset);

		this._prepareTileBg();
		this._runAnimation(center, zoom, scale, origin);

		return true;
	},

	_catchTransitionEnd: function () {
		if (this._animatingZoom) {
			this._onZoomTransitionEnd();
		}
	},

	_runAnimation: function (center, zoom, scale, origin, backwardsTransform) {
		this._animateToCenter = center;
		this._animateToZoom = zoom;
		this._animatingZoom = true;

		if (L.Draggable) {
			L.Draggable._disabled = true;
		}

		var transform = L.DomUtil.TRANSFORM,
		    tileBg = this._tileBg;

		clearTimeout(this._clearTileBgTimer);

		L.Util.falseFn(tileBg.offsetWidth); //hack to make sure transform is updated before running animation

		var scaleStr = L.DomUtil.getScaleString(scale, origin),
		    oldTransform = tileBg.style[transform];

		tileBg.style[transform] = backwardsTransform ?
		        oldTransform + ' ' + scaleStr :
		        scaleStr + ' ' + oldTransform;
	},

	_prepareTileBg: function () {
		var tilePane = this._tilePane,
		    tileBg = this._tileBg;

		// If foreground layer doesn't have many tiles but bg layer does, keep the existing bg layer and just zoom it some more
		if (tileBg && this._getLoadedTilesPercentage(tileBg) > 0.5 &&
			          this._getLoadedTilesPercentage(tilePane) < 0.5) {

			tilePane.style.visibility = 'hidden';
			tilePane.empty = true;
			this._stopLoadingImages(tilePane);
			return;
		}

		if (!tileBg) {
			tileBg = this._tileBg = this._createPane('leaflet-tile-pane', this._mapPane);
			tileBg.style.zIndex = 1;
		}

		// prepare the background pane to become the main tile pane
		tileBg.style[L.DomUtil.TRANSFORM] = '';
		tileBg.style.visibility = 'hidden';

		// tells tile layers to reinitialize their containers
		tileBg.empty = true; //new FG
		tilePane.empty = false; //new BG

		//Switch out the current layer to be the new bg layer (And vice-versa)
		this._tilePane = this._panes.tilePane = tileBg;
		var newTileBg = this._tileBg = tilePane;

		L.DomUtil.addClass(newTileBg, 'leaflet-zoom-animated');

		this._stopLoadingImages(newTileBg);
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
	},

	_onZoomTransitionEnd: function () {
		this._restoreTileFront();

		L.DomUtil.removeClass(this._mapPane, 'leaflet-zoom-anim');
		L.Util.falseFn(this._tileBg.offsetWidth); // force reflow
		this._animatingZoom = false;
		this._resetView(this._animateToCenter, this._animateToZoom, true, true);

		if (L.Draggable) {
			L.Draggable._disabled = false;
		}
	},

	_restoreTileFront: function () {
		this._tilePane.innerHTML = '';
		this._tilePane.style.visibility = '';
		this._tilePane.style.zIndex = 2;
		this._tileBg.style.zIndex = 1;
	},

	_clearTileBg: function () {
		if (!this._animatingZoom && !this.touchZoom._zooming) {
			this._tileBg.innerHTML = '';
		}
	}
});

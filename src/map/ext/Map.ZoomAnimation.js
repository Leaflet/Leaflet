L.Map.include(!(L.Transition && L.Transition.implemented()) ? {} : {
	_zoomToIfCenterInView: function(center, zoom, centerOffset) {

		if (this._animatingZoom) {
			return true;
		}
		
		if (!L.Transition.NATIVE) { return false; }
		
		var zoomDelta = zoom - this._zoom,
			scale = Math.pow(2, zoomDelta),
			offset = centerOffset.divideBy(1 - 1/scale);
		
		//if offset does not exceed half of the view
		if (!this._offsetIsWithinView(offset, 1)) { return false; }
		
		this._mapPane.className += ' leaflet-animating';

		var centerPoint = this.containerPointToLayerPoint(this.getSize().divideBy(2)),
			origin = centerPoint.add(offset);
		
		this._prepareTileBg();
	
		this._runAnimation(center, zoom, scale, origin);
		
		return true;
	},
	
	
	_runAnimation: function(center, zoom, scale, origin) {
		this._animatingZoom = true;

		this._animateToCenter = center;
		this._animateToZoom = zoom;
		
		var transform = L.DomUtil.TRANSFORM_PROPERTY;
		
		//dumb FireFox hack, I have no idea why this magic zero translate fixes the problem (webkit is OK)
		this._tileBg.style[transform] = this._tileBg.style[transform] + ' translate(0,0)';
		
		L.Util.falseFn(this._tileBg.offsetWidth); //hack to make sure transform is updated before running animation
		
		var options = {};
		options[transform] = this._tileBg.style[transform] + ' ' + L.DomUtil.getScaleString(scale, origin);
		this._tileBg.transition.run(options);
	},
	
	_prepareTileBg: function() {
		if (!this._tileBg) {
			this._tileBg = this._createPane('leaflet-tile-pane', this._mapPane);
			this._tileBg.style.zIndex = 1;
		}

		var tilePane = this._tilePane,
			tileBg = this._tileBg;
		
		this._tilePane = this._panes.tilePane = tileBg;
		this._tileBg = tilePane;
		
		// prepare the background pane to become the main tile pane
		this._tilePane.innerHTML = '';
		this._tilePane.style[L.DomUtil.TRANSFORM_PROPERTY] = '';
		this._tilePane.style.visibility = 'hidden';
		
		// tells tile layers to reinitialize their containers
		this._tilePane.empty = true;
		this._tileBg.empty = false;
		
		if (!this._tileBg.transition) {
			this._tileBg.transition = new L.Transition(this._tileBg, {duration: 0.3, easing: 'cubic-bezier(0.25,0.1,0.25,0.75)'});
			this._tileBg.transition.on('end', this._onZoomTransitionEnd, this);
		}
		
		this._removeExcessiveBgTiles();
	},
	
	// stops loading all tiles in the background layer and removes tiles that not in the current bbox
	_removeExcessiveBgTiles: function() {
		var tiles = [].slice.call(this._tileBg.getElementsByTagName('img')),
			mapRect = this._container.getBoundingClientRect();
		
		for (var i = 0, len = tiles.length; i < len; i++) {
			var tileRect = tiles[i].getBoundingClientRect();
			
			if (!tiles[i].complete ||
				(tileRect.right <= mapRect.left) || 
				(tileRect.left >= mapRect.right) ||
				(tileRect.top >= mapRect.bottom) ||
				(tileRect.bottom <= mapRect.top)) {
				
				tiles[i].src = '';
				tiles[i].parentNode.removeChild(tiles[i]);
			}
		}
	},
	
	_onZoomTransitionEnd: function() {
		this._restoreTileFront();
		
		var mapPaneOffset = L.DomUtil.getPosition(this._mapPane),
			offsetTransform = L.DomUtil.getTranslateString(mapPaneOffset);
		
		//load tiles in the main tile pane
		this._resetView(this._animateToCenter, this._animateToZoom);
		
		this._tileBg.style[L.DomUtil.TRANSFORM_PROPERTY] = offsetTransform + ' ' + this._tileBg.style[L.DomUtil.TRANSFORM_PROPERTY];
		
		//TODO clear tileBg on map layersload
		
		this._mapPane.className = this._mapPane.className.replace(' leaflet-animating', ''); //TODO toggleClass util
		this._animatingZoom = false;
	},
	
	_restoreTileFront: function() {
		this._tilePane.style.visibility = '';
		this._tilePane.style.zIndex = 2;
		this._tileBg.style.zIndex = 1;
	}
});
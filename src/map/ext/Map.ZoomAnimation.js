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
		
		this._prepareTileBg();
		
		this._mapPane.className += ' leaflet-animating';

		var mapPaneOffset = L.DomUtil.getPosition(this._mapPane),
			centerPoint = this.containerPointToLayerPoint(this.getSize().divideBy(2)),
			origin = centerPoint.add(offset),
			startTransform = L.DomUtil.getTranslateString(mapPaneOffset);
	
		this._runAnimation(center, zoom, scale, startTransform, origin);
		
		return true;
	},
	
	
	_runAnimation: function(center, zoom, scale, startTransform, origin) {
		this._animatingZoom = true;

		//load tiles in the main tile pane
		this._resetView(center, zoom);
		
		this._tileBg.style[L.DomUtil.TRANSFORM_PROPERTY] = startTransform;
		
		L.Util.falseFn(this._tileBg.offsetWidth); //hack to make sure transform is updated before running animation
			
		var options = {};
		options[L.DomUtil.TRANSFORM_PROPERTY] = startTransform + ' ' + L.DomUtil.getScaleString(scale, origin);
		this._tileBg.transition.run(options);
	},
	
	_prepareTileBg: function() {
		if (!this._tileBg) {
			this._tileBg = this._createPane('leaflet-tile-pane', this._mapPane);
			this._tileBg.style.zIndex = 1;
		}

		var oldTilePane = this._tilePane,
			newTilePane = this._tileBg;
		
		// prepare the background pane to become the main tile pane
		newTilePane.innerHTML = '';
		newTilePane.style[L.DomUtil.TRANSFORM_PROPERTY] = '';
		newTilePane.style.visibility = 'hidden';
		
		// tells tile layers to reinitialize their containers
		newTilePane.empty = true;
		oldTilePane.empty = false;
		
		this._tilePane = this._panes.tilePane = newTilePane;
		this._tileBg = oldTilePane;
		
		if (!this._tileBg.transition) {
			this._tileBg.transition = new L.Transition(this._tileBg, {duration: 0.25, easing: 'cubic-bezier(0.25,0.1,0.25,0.75)'});
			this._tileBg.transition.on('end', this._onZoomTransitionEnd, this);
		}
	},
	
	_onZoomTransitionEnd: function() {
		this._restoreTileFront();
		
		this._mapPane.className = this._mapPane.className.replace(' leaflet-animating', ''); //TODO toggleClass util
		this._animatingZoom = false;
	},
	
	_restoreTileFront: function() {
		this._tilePane.style.visibility = '';
		this._tilePane.style.zIndex = 2;
		this._tileBg.style.zIndex = 1;
	}
});

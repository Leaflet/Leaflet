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
		if (!this._offsetIsWithinView(offset, 0.5)) { return false; }
		
		this._initPanes();
		this._runAnimation(center, zoom, scale, offset);
		
		return true;
	},
	
	_initPanes: function() {
		if (!this._tileBg) {
			this._tileBg = this._createPane('leaflet-tile-pane');
			this._tileBg.style.zIndex = 1;
		}
		
		this._swapFrontAndBg(); //TODO refactor away tile layer swapping to share it with touch zoom
		
		if (!this._tileBg.transition) {
			this._tileBg.transition = new L.Transition(this._tileBg, {duration: 0.25, easing: 'cubic-bezier(0.25,0.1,0.25,0.75)'});
			this._tileBg.transition.on('end', this._onZoomTransitionEnd, this);
		}
	},
	
	_runAnimation: function(center, zoom, scale, offset) {
		var mapPaneOffset = L.DomUtil.getPosition(this._mapPane),
			centerPoint = this.containerPointToLayerPoint(this.getSize().divideBy(2)),
			origin = centerPoint.add(offset).subtract(mapPaneOffset.divideBy(scale - 1));
		
		this._mapPane.className += ' leaflet-animating';
		this._animatingZoom = true;

		//load tiles in the main tile pane
		this._resetView(center, zoom);
		
		this._tileBg.style[L.DomUtil.TRANSFORM_PROPERTY] = L.DomUtil.getTranslateString(mapPaneOffset);

		//TODO eliminate this ugly setTimeout hack
		setTimeout(L.Util.bind(function() {
			var options = {};
			options[L.DomUtil.TRANSFORM_PROPERTY] = L.DomUtil.getScaleString(scale, origin);
			this._tileBg.transition.run(options);
		}, this), 20);
	},
	
	_swapFrontAndBg: function() {
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
	},
	
	_onZoomTransitionEnd: function() {
		this._tilePane.style.visibility = '';
		this._tilePane.style.zIndex = 2;
		this._tileBg.style.zIndex = 1;
		this._mapPane.className = this._mapPane.className.replace(' leaflet-animating', ''); //TODO toggleClass util
		this._animatingZoom = false;
	}
});
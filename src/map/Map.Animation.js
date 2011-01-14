L.Map.include(!(L.Transition && L.Transition.implemented()) ? {} : {
	setView: function(center, zoom, forceReset) {
		zoom = this._limitZoom(zoom);
		var zoomChanged = (this._zoom != zoom);

		if (!forceReset && this._layers) {
			// difference between the new and current centers in pixels
			var offset = this._getNewTopLeftPoint(center).subtract(this._getTopLeftPoint()); 
			
			var done = (zoomChanged ? 
						this._zoomToIfCenterInView(center, zoom, offset) : 
						this._panByIfClose(offset));
			
			// exit if animated pan or zoom started
			if (done) { return this; }
		}
		
		// reset the map view 
		this._resetView(center, zoom);
		
		return this;
	},
	
	panBy: function(offset) {
		if (!this._panTransition) {
			this._panTransition = new L.Transition(this._mapPane, {duration: 0.3});
			
			this._panTransition.on('step', this._onPanTransitionStep, this);
			this._panTransition.on('end', this._onPanTransitionEnd, this);
		}
		this.fire(this, 'movestart');
		
		this._panTransition.run({
			position: L.DomUtil.getPosition(this._mapPane).subtract(offset)
		});
		
		return this;
	},
	
	_onPanTransitionStep: function() {
		this.fire('move');
	},
	
	_onPanTransitionEnd: function() {
		this.fire('moveend');
	},

	_panByIfClose: function(offset) {
		if (this._offsetIsWithinView(offset)) {
			this.panBy(offset);
			return true;
		}
		return false;
	},
	
	_zoomToIfCenterInView: function(center, zoom, centerOffset) {
		
		if (!L.Transition.NATIVE) { return false; }
		
		var zoomDelta = zoom - this._zoom,
			scale = Math.pow(2, zoomDelta),
			offset = centerOffset.divideBy(1 - 1/scale);
		
		//if offset does not exceed half of the view
		if(!this._offsetIsWithinView(offset, 0.5)) { return false; }
		
		if (!this._tileBg) {
			this._tileBg = this._createPane('leaflet-tile-pane');
			this._tileBg.style.zIndex = 1;
		}
		
		this._swapFrontAndBg(); //TODO refactor away tile layer swapping to share it with touch zoom
		
		if (!this._tileBg.transition) {
			this._tileBg.transition = new L.Transition(this._tileBg, {duration: 0.25, easing: 'cubic-bezier(0.25,0.1,0.25,0.75)'});
			this._tileBg.transition.on('end', this._onZoomTransitionEnd, this);
		}
		
		var centerPoint = this.containerPointToLayerPoint(this.getSize().divideBy(2)),
			mapPaneOffset = L.DomUtil.getPosition(this._mapPane),
			origin = centerPoint.add(offset).subtract(mapPaneOffset.divideBy(scale - 1)),
			transformStr = L.DomUtil.getScaleString(scale, origin);
		
		this._mapPane.className += ' leaflet-animating';

		this._resetView(center, zoom);
		
		this._tileBg.style[L.DomUtil.TRANSFORM_PROPERTY] = L.DomUtil.getTranslateString(mapPaneOffset);

		//TODO eliminate this ugly hack
		setTimeout(L.Util.bind(function() {
			var options = {};
			options[L.DomUtil.TRANSFORM_PROPERTY] = transformStr;
			this._tileBg.transition.run(options);
		}, this), 20);
		
		return true;
	},
	
	_swapFrontAndBg: function() {
		var oldTilePane = this._panes.tilePane;
		
		this._tileBg.innerHTML = '';
		this._tileBg.style[L.DomUtil.TRANSFORM_PROPERTY] = '';
		this._tileBg.expired = true;  //TODO better name for property
		this._tileBg.style.visibility = 'hidden';
		oldTilePane.expired = false;
		
		this._panes.tilePane = this._tileBg;
		this._tileBg = oldTilePane;
	},
	
	_onZoomTransitionEnd: function() {
		this._panes.tilePane.style.visibility = '';
		this._panes.tilePane.style.zIndex = 2;
		this._tileBg.style.zIndex = 1;
		this._mapPane.className = this._mapPane.className.replace(' leaflet-animating', ''); //TODO toggleClass util
	},

	_offsetIsWithinView: function(offset, multiplyFactor) {
		var m = multiplyFactor || 1,
			size = this.getSize();
		return (Math.abs(offset.x) <= size.x * m) && 
				(Math.abs(offset.y) <= size.y * m);
	}
});
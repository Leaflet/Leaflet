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
	
	_zoomToIfCenterInView: function(center, zoom, offset) {
		//if offset does not exceed half of the view
		if (this._offsetIsWithinView(offset, 0.5)) {
			//TODO animated zoom
//			if (!this._zoomTransition) {
//				this._zoomTransition = new L.Transition(this._mapPane, {duration: 0.3});
//			}
			var centerPoint = this.latLngToLayerPoint(center);
			
//			this._mapPane.style['-webkit-transform-origin'] = '50% 50%';
//			this._zoomTransition.run({
//				'-webkit-transform': [
//				                      //this._mapPane.style.webkitTransform,
//				                      L.DomUtil.getTranslateString(centerPoint),
//				                      'scale(' + 5 + ')',
//				                      L.DomUtil.getTranslateString(centerPoint.multiplyBy(-1))
//				                  ].join(' ')
//			});
			
			this._resetView(center, zoom);
			return true;
		}
		return false;
	},

	_offsetIsWithinView: function(offset, multiplyFactor) {
		var m = multiplyFactor || 1,
			size = this.getSize();
		return (Math.abs(offset.x) <= size.x * m) && 
				(Math.abs(offset.y) <= size.y * m);
	}
});
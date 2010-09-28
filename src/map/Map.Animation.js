L.Map.include({
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
	}
});

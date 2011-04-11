/*
 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
 */

L.Handler.MarkerDrag = L.Handler.extend({

	enable: function() {
		if (this._enabled) { return; }
		if (!this._draggable) {
			this._draggable = new L.Draggable(this._handlee._icon, this._handlee._icon);
			this._draggable.on('dragstart', this._onDragStart, this);
			this._draggable.on('drag', this._onDrag, this);
			this._draggable.on('dragend', this._onDragEnd, this);
		}
		this._draggable.enable();
		this._enabled = true;
	},
	
	disable: function() {
		if (!this._enabled) { return; }
		this._draggable.disable();
		this._enabled = false;
	},
	
	moved: function() {
		return this._draggable._moved;
	},
	
	_onDragStart: function(e) {
		this._handlee.fire('movestart',this);
		this._handlee.fire('dragstart',"hello");
		this._dragStartShadowPos = L.DomUtil.getPosition(this._handlee._shadow);
	},
	
	_onDrag: function(e) {
		
		// update shadow position
		var newShadowPos = this._dragStartShadowPos.add(e.target._offset);
		L.DomUtil.setPosition(this._handlee._shadow, newShadowPos);
	
		this._handlee.fire('move',this);
		this._handlee.fire('drag',this);
		
	},
	
	_onDragEnd: function() {
		this._handlee.fire('moveend',this);
		this._handlee.fire('dragend',this);
	}
	
});

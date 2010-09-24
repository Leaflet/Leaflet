/*
 * L.Handler.MapDrag is used internally by L.Map to make the map draggable.
 */

L.Handler.MapDrag = L.Handler.extend({
	enable: function() {
		if (this._enabled) { return; }
		if (!this._draggable) {
			this._draggable = new L.Draggable(this._map._mapPane, this._map._container);
			
			//optimizes map dragging in FF on big screens
			var size = this._map.getSize();
			if (size.x * size.y >= 7e5 && L.Browser.gecko) {
				this._draggable._updatePosition = L.Util.deferExecByInterval(
						this._draggable._updatePosition, 0, this._draggable);
			}
			
			this._deferredFireViewUpdate = L.Util.deferExecByInterval(this._fireViewUpdate, 100, this);
			
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
	
	_fireViewUpdate: function() {
		this._map.fire('viewupdate');
	},
	
	_onDragStart: function() {
		this._map.fire('movestart');
		this._map.fire('dragstart');
	},
	
	_onDrag: function() {
		this._map.fire('move');
		if (!this._map.options.updateWhenIdle) { this._deferredFireViewUpdate(); }
		this._map.fire('drag');
	},
	
	_onDragEnd: function() {
		this._map.fire('moveend');
		if (this._map.options.updateWhenIdle) { this._fireViewUpdate(); }
		this._map.fire('dragend');
	}
});

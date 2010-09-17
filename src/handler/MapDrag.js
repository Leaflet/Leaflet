/*
 * L.Handler.MapDrag makes the map draggable
 */

L.Handler.MapDrag = L.Handler.extend({
	enable: function() {
		if (!this._draggable) {
			this._draggable = new L.Draggable(this._map._mapPane, this._map._container);
			
			this._fireViewLoad = L.Util.limitExecByInterval(this._fireViewLoad, 200, this, true);
			
			this._draggable.on('dragstart', this._onDragStart, this);
			this._draggable.on('drag', this._onDrag, this);
			this._draggable.on('dragend', this._onDragEnd, this);
		}
		this._draggable.enable();
	},
	
	disable: function() {
		this._draggable.disable();
	},
	
	_fireViewLoad: function() {
		this._map.fire('viewload');
	},
	
	_onDragStart: function() {
		this._map.fire('movestart');
		this._map.fire('dragstart');
	},
	
	_onDrag: function() {
		this._map.fire('move');
		this._map.fire('drag');
		if (!this._map.options.viewLoadOnDragEnd) { this._fireViewLoad(); }
	},
	
	_onDragEnd: function() {
		this._map.fire('dragend');
		this._map.fire('moveend');
		if (this._map.options.viewLoadOnDragEnd) { this._fireViewLoad(); }
	}
});

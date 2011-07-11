/*
 * L.Handler.MarkerDrag is used internally by L.Marker to make the markers draggable.
 */

L.Handler.MarkerDrag = L.Handler.extend({
	initialize: function(marker) {
		this._marker = marker;
	},
	
	enable: function() {
		if (this._enabled) { return; }
		if (!this._draggable) {
			this._draggable = new L.Draggable(this._marker._icon, this._marker._icon);
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
		return this._draggable && this._draggable._moved;
	},
	
	_onDragStart: function(e) {
		this._marker.closePopup();
		
		this._marker.fire('movestart');
		this._marker.fire('dragstart');
	},
	
	_onDrag: function(e) {
		// update shadow position
		var iconPos = L.DomUtil.getPosition(this._marker._icon);
		if (this._marker._shadow) L.DomUtil.setPosition(this._marker._shadow, iconPos);
		
		this._marker._latlng = this._marker._map.layerPointToLatLng(iconPos);
	
		this._marker.fire('move');
		this._marker.fire('drag');
	},
	
	_onDragEnd: function() {
		this._marker.fire('moveend');
		this._marker.fire('dragend');
	}
});

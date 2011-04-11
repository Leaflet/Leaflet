/*
 * L.Marker is used to display clickable/draggable icons on the map.
 */


L.Marker = L.Class.extend({
	includes: L.Mixin.Events,
	
	options: {
		icon: new L.Icon(),
		clickable: true,
		draggable: false
	},
	
	initialize: function(latlng, options) {
		L.Util.setOptions(this, options);
		this._latlng = latlng;
	},
	
	onAdd: function(map) {
		this._map = map;
		
		if (!this._icon) {
			this._icon = this.options.icon.createIcon();
			map._panes.markerPane.appendChild(this._icon);
			this._initInteraction();
		}
		if (!this._shadow) {
			this._shadow = this.options.icon.createShadow();
			map._panes.shadowPane.appendChild(this._shadow);
		}
		
		map.on('viewreset', this._reset, this);
		this._reset();
	},
	
	onRemove: function(map) {
		if (this._icon) {
			map._panes.markerPane.removeChild(this._icon);
		}
		if (this._shadow) {
			map._panes.shadowPane.removeChild(this._shadow);
		}
		map.off('viewreset', this._reset, this);
	},
	
	getLatLng: function() {
		var pos = L.DomUtil.getPosition(this._icon);
		return this._map.layerPointToLatLng(pos);
	},
	
	_reset: function() {
		var pos = this._map.latLngToLayerPoint(this._latlng).round();
		
		L.DomUtil.setPosition(this._icon, pos);
		L.DomUtil.setPosition(this._shadow, pos);
		
		this._icon.style.zIndex = pos.y;
	},
	
	_initInteraction: function() {
	
		if (this.options.clickable) {
			this._icon.className += ' leaflet-clickable';
			L.DomEvent.addListener(this._icon, 'mousedown', this._fireMouseEvent, this);
			L.DomEvent.addListener(this._icon, 'click', this._fireMouseEvent, this);
			L.DomEvent.addListener(this._icon, 'dblclick', this._fireMouseEvent, this);
		}
		
		if (this.options.draggable) {
		  this._draggable = new L.Draggable(this._icon, this._icon);
			this._draggable.on('dragstart', this._onDragStart, this);
			this._draggable.on('drag', this._onDrag, this);
			this._draggable.on('dragend', this._onDragEnd, this);
		  this._draggable.enable();
		}
		
	},
	
	_fireMouseEvent: function(e) {
		this.fire(e.type);
		if (e.type == 'mouseup') {
			// Draggable stops listening on document mouseup so because we are stopping propagation we will explicitaly fire it
			L.DomEvent.fireEvent(document,'mouseup');
		}
		L.DomEvent.stopPropagation(e);
	},
	
	moved: function() {
		return this._draggable._moved;
	},
	
	_onDragStart: function(e) {
		this.fire('movestart',this);
		this.fire('dragstart',"hello");
	},
	
	_onDrag: function() {
		this.fire('move',this);
		this.fire('drag',this);
	},
	
	_onDragEnd: function() {
		this.fire('moveend',this);
		this.fire('dragend',this);
	}
	
});
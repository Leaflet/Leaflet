
L.Popup = L.Class.extend({
	includes: L.Mixin.Events,
	
	options: {
		maxWidth: 300,
		closeOnClick: true
	},
	
	initialize: function() {
	},
	
	onAdd: function(map) {
		this._map = map;
		
		if (!this._container) {
			this._initLayout();
			this._container.style.opacity = '0';
		}
		this._contentNode.innerHTML = this._content;
		
		map._panes.popupPane.appendChild(this._container);
		
		map.on('viewreset', this._updatePosition, this);
		
		if (this.options.closeOnClick) {
			map.on('click', map.closePopup, map);
			//TODO move closeOnClick to Map
		}
		
		this._container.style.visibility = 'hidden';
		this._updateLayout();
		this._updatePosition();
		this._container.style.visibility = '';
		this._container.style.opacity = '1';
		//TODO fix ugly opacity hack
	},
	
	onRemove: function(map) {
		map._panes.popupPane.removeChild(this._container);
		map.off('viewreset', this._updatePosition, this);
		this._container.style.opacity = '0';
	},
	
	setData: function(latlng, content, offset) {
		this._latlng = latlng; 
		this._content = content;
		this._offset = offset;
	},
	
	_initLayout: function() {
		this._container = document.createElement('div');
		this._container.className = 'leaflet-popup';
		L.DomEvent.addListener(this._container, 'click', L.DomEvent.stopPropagation);
		L.DomEvent.addListener(this._container, 'mousedown', L.DomEvent.stopPropagation);
		
		this._contentNode = document.createElement('div');
		this._contentNode.className = 'leaflet-popup-content';
		
		this._tipContainer = document.createElement('div');
		this._tipContainer.className = 'leaflet-popup-tip-container';
		
		this._tip = document.createElement('div');
		this._tip.className = 'leaflet-popup-tip';
		
		this._tipContainer.appendChild(this._tip);
		
		this._container.appendChild(this._contentNode);
		this._container.appendChild(this._tipContainer);
	},
	
	_updateLayout: function() {
		this._container.style.width = '';
		this._container.style.whiteSpace = 'nowrap';

		var width = this._container.offsetWidth;
		
		this._container.style.width = (width > this.options.maxWidth ? this.options.maxWidth : width) + 'px';
		this._container.style.whiteSpace = '';
		
		this._containerWidth = this._container.offsetWidth;
	},
	
	_updatePosition: function() {
		var pos = this._map.latLngToLayerPoint(this._latlng);
		
		this._container.style.bottom = (-pos.y - this._offset.y) + 'px';
		this._container.style.left = (pos.x - this._containerWidth/2 + this._offset.x) + 'px';
	},
	
	_adjustPan: function() {
		
	}
});

L.Popup = L.Class.extend({
	includes: L.Mixin.Events,
	
	options: {
		maxWidth: 300,
		autoPan: true,
		autoPanPadding: new L.Point(5, 5)
	},
	
	initialize: function(options) {
		L.Util.extend(this.options, options);
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
		
		this._container.style.visibility = 'hidden';
		
		this._updateLayout();
		this._updatePosition();
		this._adjustPan();
		
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
		
		L.DomEvent.disableClickPropagation(this._container);
		
		this._contentNode = document.createElement('div');
		this._contentNode.className = 'leaflet-popup-content';
		
		this._tipContainer = document.createElement('div');
		this._tipContainer.className = 'leaflet-popup-tip-container';
		
		this._tip = document.createElement('div');
		this._tip.className = 'leaflet-popup-tip';
		
		this._tipContainer.appendChild(this._tip);
		
		this._container.appendChild(this._contentNode);
		this._container.appendChild(this._tipContainer);
		
		//TODO popup close button
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
		
		this._containerBottom = -pos.y - this._offset.y;
		this._containerLeft = pos.x - this._containerWidth/2 + this._offset.x;
		
		this._container.style.bottom = this._containerBottom + 'px';
		this._container.style.left = this._containerLeft + 'px';
	},
	
	_adjustPan: function() {
		if (!this.options.autoPan) { return; }
		
		var containerHeight = this._container.offsetHeight,
			layerPos = new L.Point(
				this._containerLeft, 
				-containerHeight - this._containerBottom),
			containerPos = this._map.layerPointToContainerPoint(layerPos),
			adjustOffset = new L.Point(0, 0),
			padding = this.options.autoPanPadding,
			size = this._map.getSize();
		
		if (containerPos.x < 0) {
			adjustOffset.x = containerPos.x - padding.x;
		}
		if (containerPos.x + this._containerWidth > size.x) {
			adjustOffset.x = containerPos.x + this._containerWidth - size.x + padding.x;
		}
		if (containerPos.y < 0) {
			adjustOffset.y = containerPos.y - padding.y;
		}
		if (containerPos.y + containerHeight > size.y) {
			adjustOffset.y = containerPos.y + containerHeight - size.y + padding.y;
		}
		
		if (adjustOffset.x || adjustOffset.y) {
			this._map.panBy(adjustOffset);
		}
	}
});
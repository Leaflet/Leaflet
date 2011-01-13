
L.Popup = L.Class.extend({
	includes: L.Mixin.Events,
	
	options: {
		maxWidth: 300,
		autoPan: true,
		closeButton: true,
		closeOnMapClick: true,
		
		offset: new L.Point(0, 0),
		autoPanPadding: new L.Point(5, 5)
	},
	
	initialize: function(latlng, content, options) {
		this._latlng = latlng; 
		this._content = content;
		L.Util.extend(this.options, options);
	},
	
	onAdd: function(map) {
		this._map = map;
		
		if (!this._container) {
			this._initLayout();
			this._updateContent();
		}
		
		this._container.style.opacity = '0';

		this._map._panes.popupPane.appendChild(this._container);
		this._map.on('viewreset', this._updatePosition, this);
		this._map.on('click', this._close, this);
		this._update();
		
		this._container.style.opacity = '1'; //TODO fix ugly opacity hack
	},
	
	onRemove: function(map) {
		map._panes.popupPane.removeChild(this._container);
		map.off('viewreset', this._updatePosition, this);
		map.off('click', this._close, this);

		this._container.style.opacity = '0';
	},
	
	_close: function() {
		this._map.removeLayer(this);
	},
	
	_initLayout: function() {
		this._container = L.DomUtil.create('div', 'leaflet-popup');
		L.DomEvent.disableClickPropagation(this._container);
		
		this._closeButton = L.DomUtil.create('a', 'leaflet-popup-close-button', this._container);
		this._closeButton.href = '#close';
		this._closeButton.onclick = L.Util.bind(this._onCloseButtonClick, this);
		
		this._wrapper = L.DomUtil.create('div', 'leaflet-popup-content-wrapper', this._container);
		this._contentNode = L.DomUtil.create('div', 'leaflet-popup-content', this._wrapper);
		
		this._tipContainer = L.DomUtil.create('div', 'leaflet-popup-tip-container', this._container);
		this._tip = L.DomUtil.create('div', 'leaflet-popup-tip', this._tipContainer);
	},
	
	_update: function() {
		this._container.style.visibility = 'hidden';
		
		this._updateLayout();
		this._updatePosition();
		
		this._container.style.visibility = '';

		this._adjustPan();
	},
	
	_updateContent: function() {
		//TODO accept DOM nodes along with HTML strings
		this._contentNode.innerHTML = this._content;
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
		
		this._containerBottom = -pos.y - this.options.offset.y;
		this._containerLeft = pos.x - this._containerWidth/2 + this.options.offset.x;
		
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
	},
	
	_onCloseButtonClick: function() {
		this._close();
		return false;
	}
});
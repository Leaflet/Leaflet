L.ImageOverlay = L.Class.extend({
	includes: L.Mixin.Events,
	
	initialize: function(/*String*/ url, /*LatLngBounds*/ bounds) {
		this._url = url;
		this._bounds = bounds;
	},
	
	onAdd: function(map) {
		this._map = map;
		
		this._image = L.DomUtil.create('img', 'leaflet-image-layer');
		
		this._image.style.visibility = 'hidden';
		this._image.style.position = 'absolute';
		//TODO opacity option
		
		L.Util.extend(this._image, {
			galleryimg: 'no',
			onselectstart: L.Util.falseFn,
			onmousemove: L.Util.falseFn,
			onload: this._onImageLoad,
			src: this._url
		});
		
		this._map.getPanes().overlayPane.appendChild(this._image);
		
		this._map.on('viewreset', this._reset, this);
		this._reset();
	},
	
	_reset: function() {
		var topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
			bottomRight = this._map.latLngToLayerPoint(this._bounds.getSouthEast()),
			size = bottomRight.subtract(topLeft);
		
		L.DomUtil.setPosition(this._image, topLeft);
		
		this._image.style.width = size.x + 'px';
		this._image.style.height = size.y + 'px';
	},
	
	_onImageLoad: function() {
		this.style.visibility = '';
		//TODO fire layerload
	}
});
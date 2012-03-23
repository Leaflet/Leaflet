L.ImageOverlay = L.Class.extend({
	includes: L.Mixin.Events,

	initialize: function (/*String*/ url, /*LatLngBounds*/ bounds) {
		this._url = url;
		this._bounds = bounds;
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._image) {
			this._initImage();
		}

		map._panes.overlayPane.appendChild(this._image);

		map.on('viewreset', this._reset, this);
		this._reset();
	},

	onRemove: function (map) {
		map.getPanes().overlayPane.removeChild(this._image);
		map.off('viewreset', this._reset, this);
	},

	_initImage: function () {
		this._image = L.DomUtil.create('img', 'leaflet-image-layer');

		this._image.style.visibility = 'hidden';
		//TODO opacity option

		//TODO createImage util method to remove duplication
		L.Util.extend(this._image, {
			galleryimg: 'no',
			onselectstart: L.Util.falseFn,
			onmousemove: L.Util.falseFn,
			onload: L.Util.bind(this._onImageLoad, this),
			src: this._url
		});
	},

	_reset: function () {
		var image   = this._image,
		    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		    size    = this._map.latLngToLayerPoint(this._bounds.getSouthEast()).subtract(topLeft);

		L.DomUtil.setPosition(image, topLeft);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	},

	_onImageLoad: function () {
		this._image.style.visibility = '';
		this.fire('load');
	}
});

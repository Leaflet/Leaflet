L.ImageOverlay = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		opacity: 1
	},

	initialize: function (url, bounds, options) { // (String, LatLngBounds)
		this._url = url;
		this._bounds = bounds;

		L.Util.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._image) {
			this._initImage();
		}

		map._panes.overlayPane.appendChild(this._image);

		map.on('zoomanim', this._zoomAnimation, this);
		map.on('viewreset', this._reset, this);
		this._reset();
	},

	onRemove: function (map) {
		map.getPanes().overlayPane.removeChild(this._image);
		map.off('viewreset', this._reset, this);
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
	},

	_initImage: function () {
		this._image = L.DomUtil.create('img', 'leaflet-image-layer leaflet-zoom-animated');

		this._image.style.visibility = 'hidden';

		this._updateOpacity();

		//TODO createImage util method to remove duplication
		L.Util.extend(this._image, {
			galleryimg: 'no',
			onselectstart: L.Util.falseFn,
			onmousemove: L.Util.falseFn,
			onload: L.Util.bind(this._onImageLoad, this),
			src: this._url
		});
	},

	_zoomAnimation: function (opt) {
		var image = this._image,
		    scale = Math.pow(2, opt.zoom - this._map._zoom),
		    topLeft = this._map._latLngToNewLayerPoint(this._bounds.getNorthWest(), opt.zoom, opt.center),
		    size = this._map._latLngToNewLayerPoint(this._bounds.getSouthEast(), opt.zoom, opt.center).subtract(topLeft),
		    currentSize = this._map.latLngToLayerPoint(this._bounds.getSouthEast()).subtract(this._map.latLngToLayerPoint(this._bounds.getNorthWest()));

		image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(topLeft.add(size.subtract(currentSize).divideBy(2))) + ' scale(' + scale + ') ';
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
	},

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	}
});

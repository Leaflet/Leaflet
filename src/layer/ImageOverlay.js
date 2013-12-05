/*
 * L.ImageOverlay is used to overlay images over the map (to specific geographical bounds).
 */

L.ImageOverlay = L.Layer.extend({

	options: {
		opacity: 1
	},

	initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
		this._url = url;
		this._bounds = L.latLngBounds(bounds);

		L.setOptions(this, options);
	},

	onAdd: function (map) {
		this._map = map;
		this._animated = this._map.options.zoomAnimation && L.Browser.any3d;

		if (!this._image) {
			this._initImage();
		}

		this.getPane().appendChild(this._image);

		map.on(this._getEvents(), this);

		this._reset();
	},

	onRemove: function (map) {
		L.DomUtil.remove(this._image);

		map.off(this._getEvents(), this);
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
		return this;
	},

	// TODO remove bringToFront/bringToBack duplication from TileLayer/Path
	bringToFront: function () {
		if (this._image) {
			this.getPane().appendChild(this._image);
		}
		return this;
	},

	bringToBack: function () {
		var pane = this.getPane();
		if (this._image) {
			pane.insertBefore(this._image, pane.firstChild);
		}
		return this;
	},

	setUrl: function (url) {
		this._url = url;
		this._image.src = this._url;
	},

	getAttribution: function () {
		return this.options.attribution;
	},

	_getEvents: function () {
		var events = {viewreset: this._reset};

		if (this._animated) {
			events.zoomanim = this._animateZoom;
		}

		return events;
	},

	_initImage: function () {
		this._image = L.DomUtil.create('img',
			'leaflet-image-layer ' +
			'leaflet-zoom-' + (this._animated ? 'animated' : 'hide'));

		this._updateOpacity();

		//TODO createImage util method to remove duplication
		L.extend(this._image, {
			galleryimg: 'no',
			onselectstart: L.Util.falseFn,
			onmousemove: L.Util.falseFn,
			onload: L.bind(this.fire, this, 'load'),
			src: this._url
		});
	},

	_animateZoom: function (e) {
		var map = this._map,
		    image = this._image,
		    scale = map.getZoomScale(e.zoom),
		    topLeft = map._latLngToNewLayerPoint(this._bounds.getNorthWest(), e.zoom, e.center),
		    size = map._latLngToNewLayerPoint(this._bounds.getSouthEast(), e.zoom, e.center)._subtract(topLeft),
		    origin = topLeft._add(size._multiplyBy((1 - 1 / scale) / 2));

		image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
	},

	_reset: function () {
		var image   = this._image,
		    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		    size = this._map.latLngToLayerPoint(this._bounds.getSouthEast())._subtract(topLeft);

		L.DomUtil.setPosition(image, topLeft);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	},

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._image, this.options.opacity);
	}
});

L.imageOverlay = function (url, bounds, options) {
	return new L.ImageOverlay(url, bounds, options);
};

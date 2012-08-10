L.ImageOverlayCentered = L.Class.extend({
	includes: [L.Mixin.Events, L.Mixin.ImageOverlay],

	options: {
		opacity: 1
	},

	initialize: function (url, middle, width, height, options) { // (String, LatLng, Object)
		this._url = url;
		this._center = L.latLng(middle);
		this._width = width;
		this._height = height;

		L.Util.setOptions(this, options);
	},



	//TODO animate
	_animateZoom: function (e) {
		var map = this._map,
			image = this._image,
			topLeft = map._latLngToNewLayerPoint(this._center, e.zoom, e.center);

		topLeft.x -= this._width / 2;
		topLeft.y -= this._height / 2;

		L.DomUtil.setPosition(image, topLeft);
	},

	_reset: function () {
		var image   = this._image,
			topLeft = this._map.latLngToLayerPoint(this._center);

		topLeft.x -= this._width / 2;
		topLeft.y -= this._height / 2;
		L.DomUtil.setPosition(image, topLeft);
	}
});

L.imageOverlayCentered = function (url, bounds, options) {
	return new L.ImageOverlayCentered(url, bounds, options);
};


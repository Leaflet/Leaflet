L.ImageOverlay = L.Class.extend({
	includes: [L.Mixin.Events, L.Mixin.ImageOverlay],

	options: {
		opacity: 1
	},

	initialize: function (url, bounds, options) { // (String, LatLngBounds, Object)
		this._url = url;
		this._bounds = L.latLngBounds(bounds);

		L.Util.setOptions(this, options);
	},



	_animateZoom: function (e) {
		var map = this._map,
			image = this._image,
		    scale = map.getZoomScale(e.zoom),
		    nw = this._bounds.getNorthWest(),
		    se = this._bounds.getSouthEast(),
		    topLeft = map._latLngToNewLayerPoint(nw, e.zoom, e.center),
		    size = map._latLngToNewLayerPoint(se, e.zoom, e.center).subtract(topLeft),
		    currentSize = map.latLngToLayerPoint(se).subtract(map.latLngToLayerPoint(nw)),
		    origin = topLeft.add(size.subtract(currentSize).divideBy(2));

		image.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(origin) + ' scale(' + scale + ') ';
	},

	_reset: function () {
		var image   = this._image,
		    topLeft = this._map.latLngToLayerPoint(this._bounds.getNorthWest()),
		    size    = this._map.latLngToLayerPoint(this._bounds.getSouthEast()).subtract(topLeft);

		L.DomUtil.setPosition(image, topLeft);

		image.style.width  = size.x + 'px';
		image.style.height = size.y + 'px';
	}
});

L.imageOverlay = function (url, bounds, options) {
	return new L.ImageOverlay(url, bounds, options);
};

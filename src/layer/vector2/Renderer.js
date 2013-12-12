
L.Renderer = L.Layer.extend({

	options: {
		// how much to extend the clip area around the map view (relative to its size)
		padding: 0
	},

	initialize: function (options) {
		L.setOptions(this, options);
	},

	getEvents: function () {
		var events = {
			moveend: this._update
		};
		if (this._zoomAnimated) {
			events.zoomanim = this._animateZoom;
		}
		return events;
	},

	_animateZoom: function (e) {
		var scale = this._map.getZoomScale(e.zoom),
		    offset = this._map._getCenterOffset(e.center)._multiplyBy(-scale)._add(this._bounds.min);

		this._container.style[L.DomUtil.TRANSFORM] = L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';
	},

	_update: function () {
		var p = this.options.padding,
		    size = this._map.getSize(),
		    min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

		this._bounds = new L.Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());
	}
});

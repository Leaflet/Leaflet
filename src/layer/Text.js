L.TextLayer = L.Class.extend({
	includes: L.Mixin.Events,

	initialize: function (content, centerPosition, options) { // (String, LatLng, Object)
		this._content = content;
		this._center = L.latLng(centerPosition);

		L.Util.setOptions(this, options);
	},

	_initText: function () {
		this._text = L.DomUtil.create('span', 'leaflet-span');
		this._text.innerHTML = this._content;

		if (this._map.options.zoomAnimation && L.Browser.any3d) {
			L.DomUtil.addClass(this._text, 'leaflet-zoom-animated');
		} else {
			L.DomUtil.addClass(this._text, 'leaflet-zoom-hide');
		}

		L.Util.extend(this._text, {
			onselectstart: L.Util.falseFn,
			onmousemove: L.Util.falseFn
		});

		this._updateOpacity();
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._text) {
			this._initText();
		}

		map._panes.overlayPane.appendChild(this._text);

		map.on('viewreset', this._reset, this);

		if (map.options.zoomAnimation && L.Browser.any3d) {
			map.on('zoomanim', this._animateZoom, this);
		}

		this._reset();
	},

	onRemove: function (map) {
		map.getPanes().overlayPane.removeChild(this._text);

		map.off('viewreset', this._reset, this);

		if (map.options.zoomAnimation) {
			map.off('zoomanim', this._animateZoom, this);
		}
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	_animateZoom: function (e) {
		var map = this._map,
			text = this._text,
			topLeft = map._latLngToNewLayerPoint(this._center, e.zoom, e.center);
		
		topLeft.x -= text.offsetWidth / 2;
		topLeft.y -= text.offsetHeight / 2;
		
		L.DomUtil.setPosition(text, topLeft);
	},

	_reset: function () {
		var text   = this._text,
		    topLeft = this._map.latLngToLayerPoint(this._center);
		topLeft.x -= text.offsetWidth / 2;
		topLeft.y -= text.offsetHeight / 2;

		L.DomUtil.setPosition(text, topLeft);
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;
		this._updateOpacity();
		return this;
	},

	// TODO remove bringToFront/bringToBack duplication from TileLayer/Path
	bringToFront: function () {
		if (this._text) {
			this._map._panes.overlayPane.appendChild(this._text);
		}
		return this;
	},

	bringToBack: function () {
		var pane = this._map._panes.overlayPane;
		if (this._text) {
			pane.insertBefore(this._text, pane.firstChild);
		}
		return this;
	},

	_updateOpacity: function () {
		L.DomUtil.setOpacity(this._text, this.options.opacity);
	}
});

L.text = function (content, center, options) {
	return new L.Text(content, center, options);
};

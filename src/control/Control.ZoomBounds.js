L.Control.ZoomBounds = L.Control.extend({
	options: {
		position: 'topleft'
	},

	onAdd: function (map) {
		var className = 'leaflet-control-zoombounds',
		    container = L.DomUtil.create('div', className);

		this._createButton('Show all overlays', className + '-pan', container,
							map.zoomBounds, map);

		return container;
	},

	_createButton: function (title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.href = '#';
		link.title = title;

		L.DomEvent
			.addListener(link, 'click', L.DomEvent.stopPropagation)
			.addListener(link, 'click', L.DomEvent.preventDefault)
			.addListener(link, 'click', fn, context);

		return link;
	}
});

L.Map.mergeOptions({
	ZoomBoundsControl: true
});

L.Map.addInitHook(function () {
	if (this.options.ZoomBoundsControl) {
		this.ZoomBoundsControl = new L.Control.ZoomBounds();
		this.addControl(this.ZoomBoundsControl);
	}
});


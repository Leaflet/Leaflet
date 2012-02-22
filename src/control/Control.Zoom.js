L.Control.Zoom = L.Control.extend({
	options: {
		position: 'topleft'
	},

	onAdd: function (map) {
		var className = 'leaflet-control-zoom',
		    container = L.DomUtil.create('div', className),
		    zoomInButton = this._createButton('Zoom in', className + '-in', map.zoomIn, map),
		    zoomOutButton = this._createButton('Zoom out', className + '-out', map.zoomOut, map);

		container.appendChild(zoomInButton);
		container.appendChild(zoomOutButton);

		return container;
	},

	_createButton: function (title, className, fn, context) {
		var link = L.DomUtil.create('a', className);
		link.href = '#';
		link.title = title;

		L.DomEvent
			.addListener(link, 'click', L.DomEvent.stopPropagation)
			.addListener(link, 'click', L.DomEvent.preventDefault)
			.addListener(link, 'click', fn, context);

		return link;
	}
});

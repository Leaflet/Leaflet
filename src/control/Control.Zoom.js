
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
		var link = document.createElement('a');
		link.href = '#';
		link.title = title;
		link.className = className;

		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(link);
		}
		L.DomEvent.addListener(link, 'click', L.DomEvent.preventDefault);
		L.DomEvent.addListener(link, 'click', fn, context);

		return link;
	}
});

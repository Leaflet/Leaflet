/*
 * L.Icon.Default is the blue marker icon used by default in Leaflet.
 */

L.Icon.Default = L.Icon.extend({

	options: {
		iconSize:    [25, 41],
		iconAnchor:  [12, 41],
		popupAnchor: [1, -34],
		tooltipAnchor: [16, -28],
		shadowSize:  [41, 41]
	},

	_getIconUrl: function (name) {
		var key = name + 'Url';

		if (this.options[key]) {
			return this.options[key];
		}

		var path = L.Icon.Default.imagePath, el;

		if (!path) {
			el = L.DomUtil.create('div', 'leaflet-control-layers-toggle', document.body);
			path = L.DomUtil.getStyle(el, 'background-image');
			document.body.removeChild(el);
			if (path) {
				path = path.replace(/^url\(\"?/, '').replace(/\/layers.+png\"?\)/, '');
			}
			L.Icon.Default.imagePath = path;
		}

		if (!path) {
			throw new Error('Couldn\'t autodetect L.Icon.Default.imagePath, set it manually.');
		}

		return path + '/marker-' + name + (L.Browser.retina && name === 'icon' ? '-2x' : '') + '.png';
	}
});

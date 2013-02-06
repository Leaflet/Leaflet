/*
 * L.Icon.Default is the blue marker icon used by default in Leaflet.
 */

L.Icon.Default = L.Icon.extend({

	options: {
		iconSize: new L.Point(25, 41),
		iconAnchor: new L.Point(12, 41),
		popupAnchor: new L.Point(1, -34),

		shadowSize: new L.Point(41, 41)
	},

	_getIconUrl: function (name) {
		var key = name + 'Url';

		if (this.options[key]) {
			return this.options[key];
		}

		if (L.Browser.retina && name === 'icon') {
			name += '@2x';
		}

		var path = L.Icon.Default.imagePath;

		if (!path) {
			throw new Error("Couldn't autodetect L.Icon.Default.imagePath, set it manually.");
		}

		return path + '/marker-' + name + '.png';
	}
});

L.Icon.Default.imagePath = (function () {
	var scripts = document.getElementsByTagName('script'),
	    leafletRe = /\/?leaflet[\-\._]?([\w\-\._]*)\.js\??/;

	var i, len, src, matches;

	for (i = 0, len = scripts.length; i < len; i++) {
		src = scripts[i].src;
		matches = src.match(leafletRe);

		if (matches) {
			return src.split(leafletRe)[0] + '/images';
		}
	}
}());

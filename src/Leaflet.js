/**
 * @preserve Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin
 * Leaflet is a BSD-licensed JavaScript library for map display and interaction.
 * See http://leaflet.cloudmade.com for more information.
 */

/*global L*/ /*jslint browser: true, sloppy: true, vars: true, nomen: true, plusplus: true */

(function (root) {
	root.L = {
		VERSION: '0.3',

		ROOT_URL: root.L_ROOT_URL || (function () {
			var scripts = document.getElementsByTagName('script'),
				leafletRe = /\/?leaflet\-?([\w\-]*)\.js\??/;

			var i, len, src, matches;

			for (i = 0, len = scripts.length; i < len; i++) {
				src = scripts[i].src;
				matches = src.match(leafletRe);

				if (matches) {
					if (matches[1] === 'include') {
						return '../../dist/';
					}
					return src.replace(leafletRe, '') + '/';
				}
			}
			return '';
		}()),

		noConflict: function () {
			root.L = this._originalL;
			return this;
		},

		_originalL: root.L
	};
}(this));

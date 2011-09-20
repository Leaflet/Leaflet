/**
 * @preserve Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin
 * Leaflet is a modern BSD-licensed JavaScript library for interactive maps. 
 * See http://leaflet.cloudmade.com for more information.
 */

/*global L */

(function (root) {
	root.L = {
		VERSION: '0.3',

		ROOT_URL: (function () {
			var scripts = document.getElementsByTagName('script'),
				leafletRe = /^(.*\/)leaflet\-?([\w\-]*)\.js.*$/;

			var i, len, src, matches;

			for (i = 0, len = scripts.length; i < len; i++) {
				src = scripts[i].src;
				matches = src.match(leafletRe);

				if (matches) {
					if (matches[2] === 'include') { break; }
					return matches[1];
				}
			}
			return '../../dist/';
		}()),

		noConflict: function () {
			root.L = this._originalL;
			return this;
		},

		_originalL: root.L
	};
}(this));

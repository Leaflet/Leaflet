/**
 * @preserve Copyright (c) 2010, CloudMade
 * Leaflet is a BSD-licensed JavaScript library for map display and interaction.
 * Check out the source on GitHub: http://github.com/CloudMade/Leaflet/
 */

var L = {
	VERSION: '0.1a4',
	
	ROOT_URL: (function() {
		var scripts = document.getElementsByTagName('script');
		for (var i = 0, len = scripts.length; i < len; i++) {
			var src = scripts[i].src,
				res = src && src.match(/^(.*\/)leaflet-*\w*\.js.*$/);
			if (res && res[1]) { return res[1]; }
		}
		return '../dist/';
	})(),
	
	noConflict: function() {
		L = this._originalL;
		return this;
	},
	
	_originalL: L
};
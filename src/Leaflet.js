/**
 * @preserve Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin
 * Leaflet is a BSD-licensed JavaScript library for map display and interaction.
 * See http://cloudmade.github.com/Leaflet/ for more information.
 */

var L = {
	VERSION: '0.2',
	
	ROOT_URL: (function() {
		var scripts = document.getElementsByTagName('script');
		for (var i = 0, len = scripts.length; i < len; i++) {
			var src = scripts[i].src,
				res = src && src.match(/^(.*\/)leaflet-*\w*\.js.*$/);
			if (res && res[1]) { return res[1]; }
		}
		return '../../dist/';
	})(),
	
	noConflict: function() {
		L = this._originalL;
		return this;
	},
	
	_originalL: L
};
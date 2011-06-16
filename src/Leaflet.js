/**
 * @preserve Copyright (c) 2010-2011, CloudMade, Vladimir Agafonkin
 * Leaflet is a modern BSD-licensed JavaScript library for interactive maps. 
 * See http://leaflet.cloudmade.com for more information.
 */

(function(root) {
	var L = {
		VERSION: '0.2',
		
		ROOT_URL: (function() {
			var scripts = document.getElementsByTagName('script'),
				leafletRe = /^(.*\/)leaflet-?([\w-]*)\.js.*$/;
			for (var i = 0, len = scripts.length; i < len; i++) {
				var src = scripts[i].src,
					res = src && src.match(leafletRe);
				
				if (res) {
					if (res[2] == 'include') break;
					return res[1];
				}
			}
			return '../../dist/';
		})(),
		
		noConflict: function() {
			root.L = this._originalL;
			return this;
		},
		
		_originalL: root.L
	};
	
	window.L = L;
}(this));

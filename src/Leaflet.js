/*
 * Leaflet namespace config, allows using any global variable instead of L & restoring the original value
 */

L = {
	VERSION: '0.0.2',
	
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
		window.L = this._originalL;
		return this;
	},
	
	_originalL: window.L
};
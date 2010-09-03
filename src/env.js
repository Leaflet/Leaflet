/*
 * Leaflet namespace config, allows using any global variable instead of L & restoring the original value
 */

(function() {
	var originalL = window.L;
	
	L = {
		version: '0.0.1'
	};
	
	L.noConflict = function() {
		window.L = originalL;
		return this;
	};
})();
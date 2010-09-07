/*
 * Leaflet namespace config, allows using any global variable instead of L & restoring the original value
 */

L = {
	version: '0.0.1',
	
	_originalL: window.L,
	
	noConflict: function() {
		window.L = this._originalL;
		return this;
	}
};
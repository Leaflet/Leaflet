/*
 * Leaflet namespace config, allows using any global variable instead of L
 */

var originalL = window.L, 
	L = {};

L.noConflict = function() {
	window.L = originalL;
	return this;
};
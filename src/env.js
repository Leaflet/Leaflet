var originalL = L, 
	L = {};

L.noConflict = function() {
	window.L = originalL;
	return this;
};
/*
 * L.Util is a namespace for various utility functions.
 */

L.Util = {};

L.Util.extend = function(/*Object*/ dest) /*-> Object*/ {	// merge src properties into dest
	var sources = Array.prototype.slice.call(arguments, 1);
	for (var j = 0, len = sources.length, src; j < len; j++) {
		src = sources[j] || {};
		for (var i in src) {
			if (src.hasOwnProperty(i)) {
				dest[i] = src[i];
			}
		}
	}
	return dest;
};

L.Util.bind = function(/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
	return function() {
		return fn.apply(obj, arguments);
	};
};

L.Util.stamp = (function() {
	var lastId = 0, key = '_leaflet_id';
	return function(/*Object*/ obj) {
		obj[key] = obj[key] || ++lastId;
		return obj[key];
	};
})();
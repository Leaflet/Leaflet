/*
 * L.Util is a namespace for various utility functions.
 */

L.Util = {
	extend: function(/*Object*/ dest) /*-> Object*/ {	// merge src properties into dest
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
	},

	bind: function(/*Function*/ fn, /*Object*/ obj) /*-> Object*/ {
		return function() {
			return fn.apply(obj, arguments);
		};
	},

	stamp: (function() {
		var lastId = 0, key = '_leaflet_id';
		return function(/*Object*/ obj) {
			obj[key] = obj[key] || ++lastId;
			return obj[key];
		};
	})(),

	limitExecByInterval: function(fn, time, context, delayFirstExec) {	
		var lock, execOnUnlock, args;
		return function() {
			args = arguments;
			if (!lock) {				
				lock = true;
				setTimeout(function(){
					lock = false;
					if (execOnUnlock) {
						args.callee.apply(context, args);
						execOnUnlock = false;
					}
				}, time);
				if (!delayFirstExec) {
					fn.apply(context, args);
				} else {
					delayFirstExec = false;
					execOnUnlock = true;
				}
			} else {
				execOnUnlock = true;
			}
		};
	},
	
	falseFn: function() { return false; }
};

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

	limitExecByInterval: function(fn, time, context) {	
		var lock, execOnUnlock, args;
		function exec(){
			lock = false;
			if (execOnUnlock) {
				args.callee.apply(context, args);
				execOnUnlock = false;
			}
		}
		return function() {
			args = arguments;
			if (!lock) {				
				lock = true;
				setTimeout(exec, time);
				fn.apply(context, args);
			} else {
				execOnUnlock = true;
			}
		};
	},
	
	deferExecByInterval: function(fn, time, context) {
		var args, lock;
		function exec() {
			lock = false;
			fn.apply(context, args);
		}
		return function() {
			args = arguments;
			if (!lock) {
				lock = true;
				setTimeout(exec, time);
			}
		};
	},
	
	falseFn: function() { return false; },
	
	formatNum: function(num, digits) {
		var pow = Math.pow(10, digits || 5);
		return Math.round(num * pow) / pow;
	},
	
	setOptions: function(obj, options) {
		obj.options = L.Util.extend({}, obj.options, options);
	},
	
	getParamString: function(obj) {
		var params = [];
		for (var i in obj) {
			if (obj.hasOwnProperty(i)) {
				params.push(i + '=' + obj[i]);
			}
		}
		return '?' + params.join('&');
	}
};

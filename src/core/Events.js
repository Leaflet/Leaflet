/*
 * L.Mixin.Events adds custom events functionality to Leaflet classes
 */

var key = '_leaflet_events';

L.Mixin = {};

L.Mixin.Events = {
	
	addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])
		var events = this[key] = this[key] || {},
			type, i, len;
		
		// Types can be a map of types/handlers
		if (typeof types === 'object') {
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.addEventListener(type, types[type], fn);
				}
			}
			
			return this;
		}
		
		types = L.Util.splitWords(types);
		
		for (i = 0, len = types.length; i < len; i++) {
			events[types[i]] = events[types[i]] || [];
			events[types[i]].push({
				action: fn,
				context: context || this
			});
		}
		
		return this;
	},

	hasEventListeners: function (type) { // (String) -> Boolean
		return (key in this) && (type in this[key]) && (this[key][type].length > 0);
	},

	removeEventListener: function (types, fn, context) { // (String[, Function, Object]) or (Object[, Object])
		var events = this[key],
			type, i, len, listeners, j;
		
		if (typeof types === 'object') {
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.removeEventListener(type, types[type], context);
				}
			}
			
			return this;
		}
		
		types = L.Util.splitWords(types);

		for (i = 0, len = types.length; i < len; i++) {

			if (this.hasEventListeners(types[i])) {
				listeners = events[types[i]];
				
				for (j = listeners.length - 1; j >= 0; j--) {
					if (
						(!fn || listeners[j].action === fn) &&
						(!context || (listeners[j].context === context))
					) {
						listeners.splice(j, 1);
					}
				}
			}
		}
		
		return this;
	},

	fireEvent: function (type, data) { // (String[, Object])
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = L.Util.extend({
			type: type,
			target: this
		}, data);

		var listeners = this[key][type].slice();

		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].action.call(listeners[i].context || this, event);
		}

		return this;
	}
};

L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin.Events.fire = L.Mixin.Events.fireEvent;

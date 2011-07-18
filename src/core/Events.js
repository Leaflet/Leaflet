/*
 * L.Mixin.Events adds custom events functionality to Leaflet classes 
 */

L.Mixin = {};

L.Mixin.Events = {
	addEventListener: function(/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		var events = this._leaflet_events = this._leaflet_events || {};
		events[type] = events[type] || [];
		events[type].push({
			action: fn,
			context: context
		});
		return this;
	},
	
	hasEventListeners: function(/*String*/ type) /*-> Boolean*/ {
		var k = '_leaflet_events';
		return (k in this) && (type in this[k]) && (this[k][type].length > 0);
	},
	
	removeEventListener: function(/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		if (!this.hasEventListeners(type)) { return this; }
		
		for (var i = 0, events = this._leaflet_events, len = events[type].length; i < len; i++) {
			if (
				(events[type][i].action === fn) && 
				(!context || (events[type][i].context === context))
			) {
				events[type].splice(i, 1);
				return this;
			}
		}
		return this;
	},
	
	fireEvent: function(/*String*/ type, /*(optional) Object*/ data) {
		if (!this.hasEventListeners(type)) { return; }
		
		var event = L.Util.extend({
			type: type,
			target: this
		}, data);
		
		var listeners = this._leaflet_events[type].slice();
		
		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].action.call(listeners[i].context || this, event);
		}
		return this;
	},
	
	/**
	 * The function accepts a different set of parameters depending on the arguments passed:
	 * type, method, context
	 * or
	 * hash array of types and handlers, context
	 */
	on: function(/*String or map of listeners*/ x,/* Function or context*/ fn, context) {
		if (typeof x == 'string') {
			this.addEventListener(x, fn, context);
		} else {
			for (var type in x) {
				if (x.hasOwnProperty(type)) {
					this.addEventListener(type, x[type], fn);
				}
			}
		}
		return this;
	},
	
	/**
	 * The function accepts a different set of parameters depending on the arguments passed:
	 * type, method, context
	 * or
	 * hash array of types and handlers, context
	 */
	off: function(/*String or map of listeners*/ x,/* Function or context*/ fn, context) {
		if (typeof x == 'string') {
			this.removeEventListener(x, fn, context);
		} else {
			for (var type in x) {
				if (x.hasOwnProperty(type)) {
					this.removeEventListener(type, x[type], fn);
				}
			}
		}
		return this;
	}
};

L.Mixin.Events.fire = L.Mixin.Events.fireEvent;
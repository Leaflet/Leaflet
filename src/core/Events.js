/*
 * L.Mixin.Events adds custom events functionality to Leaflet classes 
 */

L.Mixin = {};

L.Mixin.Events = {
	addEventListener: function(/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		this._events = this._events || {};
		this._events[type] = this._events[type] || [];
		this._events[type].push({
			action: fn,
			context: context
		});
	},
	
	hasEventListeners: function(/*String*/ type) /*-> Boolean*/ {
		return ('_events' in this) && (type in this._events) && (this._events[type].length > 0);
	},
	
	removeEventListener: function(/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		if (!this.hasEventListeners(type)) { return; }
		
		for (var i = 0, len = this._events[type].length; i < len; i++) {
			if (
				(this._events[type][i].action === fn) && 
				(!context || (this._events[type][i].context === context))
			) {
				this._events[type].splice(i, 1);
				return;
			}
		}
	},
	
	fireEvent: function(/*String*/ type, /*(optional) Object*/ data) {
		if (!this.hasEventListeners(type)) { return; }
		
		var event = L.Util.extend({
			type: type,
			target: this
		}, data);
		
		var listeners = this._events[type].slice();
		
		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].action.call(listeners[i].context || this, event);
		}
	}
};

L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin.Events.fire = L.Mixin.Events.fireEvent;
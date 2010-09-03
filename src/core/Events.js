L.Mixin = {};

L.Mixin.Events = {
	addEventListener: function(type, fn, context) {
		this._events = this._events || {};
		this._events[type] = this._events[type] || [];
		this._events[type].push({
			action: fn,
			context: context
		});
	},
	
	hasEventListeners: function(type) {
		return ('_events' in this) && (type in this._events) && (this._events[type].length > 0);
	},
	
	removeEventListener: function(type, fn, context) {
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
	
	fireEvent: function(type, data) {
		if (!this.hasEventListeners(type)) { return; }
		
		var event = data || {};
		event.type = type;
		event.target = this;
		
		var listeners = this._events[type].slice();
		
		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].action.call(listeners[i].context || this, event);
		}
	}
};

L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin = {};

L.Mixin.Events = {
	addListener: function(type, fn, context) {
		this._events = this._events || {};
		this._events[type] = this._events[type] || [];
		this._events[type].push({
			action: fn,
			context: context
		});
	},
	
	hasListeners: function(type) {
		return (_events in this) && (type in obj._events) && (obj._events[type].length > 0);
	},
	
	removeListener: function(type, fn, context) {
		if (!this.hasListeners(type)) { return; }
		
		for (var i = 0, len = this._events[type].length; i < len; i++) {
			if (
				(this._events[type][i].action === fn) && 
				(!context || (obj._events[type][i].context === context))
			) {
				obj._events[type].splice(i, 1);
				return;
			}
		}
	},
	
	on: this.addListener,
	off: this.removeListener
};
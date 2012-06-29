/*
 * L.Mixin.Events adds custom events functionality to Leaflet classes
 */

L.Mixin = {};

L.Mixin.Events = {
	addEventListener: function (/*String or Object*/ types, /*(optional) Function or Object*/ fn, /*(optional) Object*/ context) {
		var events = this._leaflet_events = this._leaflet_events || {};
		
		// Types can be a map of types/handlers
		if (typeof types === 'object') {
			context = context || fn;
			fn = undefined;
			
			for (var type in types) {
				if (types.hasOwnProperty(type)) {
					this.addEventListener(type, types[type], context);
				}
			}
			
			return this;
		}
		
		if (!fn) {
			return false;
		}
		
		types = (types || '').replace(/^\s+/, '').replace(/\s+$/, '').split(' ');
		
		for (var i = 0, ilen = types.length; i < ilen; i++) {
			events[types[i]] = events[types[i]] || [];
			events[types[i]].push({
				action: fn,
				context: context || this
			});
		}
		
		return this;
	},

	hasEventListeners: function (/*String*/ type) /*-> Boolean*/ {
		var k = '_leaflet_events';
		return (k in this) && (type in this[k]) && (this[k][type].length > 0);
	},

	removeEventListener: function (/*String or Object*/ types, /*(optional) Function*/ fn, /*(optional) Object*/ context) {
		var events = this._leaflet_events;
		
		if (typeof types === 'object') {
			context = context || fn;
			fn = undefined;
			
			for (var type in types) {
				if (types.hasOwnProperty(type)) {
					this.off(type, types[type], context);
				}
			}
			
			return this;
		}
		
		types = (types || '').replace(/^\s+/, '').replace(/\s+$/, '').split(' ');
		
		for (var i = 0, ilen = types.length; i < ilen; i++) {
			var eventType = events[types[i]] || [];
			
			if (!this.hasEventListeners(types[i])) {
				continue;
			}
			
			// Remove matching events
			var j = eventType.length;
			
			while (j--) {
				if (
					(!fn || eventType[j].action === fn) &&
					(!context || (eventType[j].context === context))
				) {
					eventType.splice(j, 1);
				}
			}
		}
		
		return this;
	},

	fireEvent: function (/*String*/ type, /*(optional) Object*/ data) {
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = L.Util.extend({
			type: type,
			target: this
		}, data);

		var listeners = this._leaflet_events[type].slice();

		for (var i = 0, len = listeners.length; i < len; i++) {
			listeners[i].action.call(listeners[i].context || this, event);
		}

		return this;
	}
};

L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin.Events.fire = L.Mixin.Events.fireEvent;

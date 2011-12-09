/*
 * L.Mixin.Events adds custom events functionality to Leaflet classes 
 */

L.Mixin = {};

L.Event = L.Class.extend({
	initialize: function(type, canBubble) {
	    this.type = type;
	    this.canBubble = (canBubble != false);
	    this._stopped
	},
	
	stopPropagation: function() {
		this._stopped = true;
	}
});


L.Events = {};
L.Events.dispatchEvent = function(e) {
    var targets = [e.target];
    if (e.canBubble) {
        var current = e.target;
        while (current = current._leaflet_event_parent) {
            targets.push(current);
        }
    }

    var targetsLen = targets.length;
    var rv = 1;
    for (var i = 0; (i < targetsLen) && !e._stopped; i++) {
        var target = targets[i];
        e.currentTarget = target;
        if (target && target._fireListeners) {
            rv &= target._fireListeners(e);
        }
    }
    return !!rv;
} 


L.EventTarget = {
	addEventListener: function(/*String*/ type, /*Function*/ fn, /*(optional) Object*/ context) {
		var events = this._leaflet_events = this._leaflet_events || {};
		events[type] = events[type] || [];
		events[type].push({
			action: fn,
			context: context || this
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
		var event = new L.Event(type);
		L.Util.extend(event, data);
		event.target = this;
		
		L.Events.dispatchEvent(event);
		return this;
	},
	
	_fireListeners: function(event) {
	    var rv = true;
	    var type = event.type;
	    if (this.hasEventListeners(type)) {
	    	var listeners = this._leaflet_events[type];
			for (var i = 0, len = listeners.length; i < len; i++) {
				if (listeners[i].action.call(listeners[i].context || this, event) == false) rv = false;
			}
	    }
	    return rv;
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
	},
	
	_setParentEventTarget: function(parent) {
		return this._leaflet_event_parent = parent;
	}
};
L.EventTarget.fire = L.EventTarget.fireEvent;
L.Mixin.Events = L.EventTarget;




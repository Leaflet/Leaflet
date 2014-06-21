/*
 * L.Evented is a base class that Leaflet classes inherit from to handle custom events.
 */

L.Evented = L.Class.extend({

	on: function (types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (var type in types) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, types[type], fn);
			}

		} else {
			// types can be a string of space-separated words
			types = L.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	off: function (types, fn, context) {

		if (!types) {
			// clear all listeners if called without arguments
			this._events = undefined;

		} else if (typeof types === 'object') {
			for (var type in types) {
				this._off(type, types[type], fn);
			}

		} else {
			types = L.Util.splitWords(types);

			for (var i = 0, len = types.length; i < len; i++) {
				this._off(types[i], fn, context);
			}
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function (type, fn, context) {
		this._events = this._events || {};

		/* get/init listeners for type */
		var typeListeners = this._events[type];
		if (!typeListeners) {
			typeListeners = {
				listeners: {},
				count: 0
			};
			this._events[type] = typeListeners;
		}

		var contextId = context && context !== this && L.stamp(context),
			newListener = {fn: fn, ctx: context};
			
		if (!contextId) {
			contextId = 'no_context';
			newListener.ctx = undefined;
		}

		// fn array for context
		var listeners = typeListeners.listeners[contextId];
		if (!listeners) {
			listeners = [];
			typeListeners.listeners[contextId] = listeners;
		}

		// check if fn already there
		var found = false;
		for (var i=0, len=listeners.length; i<len; i++) {
			if (listeners[i].fn === fn) {
				found = true;
				break;
			}
		}
		
		if (!found) {
			listeners.push(newListener);
			typeListeners.count++;
		}
	},

	_off: function (type, fn, context) {
		if (!this._events) { return; }
		
		if (!fn) {
			// clear all listeners for a type if function isn't specified
			delete this._events[type];
			return;
		}

		var typeListeners = this._events[type];
		if (!typeListeners) {
			return;
		}
		
		var contextId = context && context !== this && L.stamp(context);
		if (!contextId) {
			contextId = 'no_context';
		}
		
		var listeners = typeListeners.listeners[contextId];
		if (listeners) {

			// find fn and remove it
			for (var i=0, len = listeners.length; i<len; i++) {
				var l = listeners[i];
				if (l.fn === fn) {
				
					// set the removed listener to noop so that's not called if remove happens in fire
					l.fn = L.Util.falseFn;
					typeListeners.count--;
				
					if (len > 1) {
						if (!this._isFiring) {
							listeners.splice(i,1);							
						} else {
							/* copy array in case events are being fired */
							typeListeners.listeners[contextId] = listeners.slice().splice(i,1);
						}
					} else {
						delete typeListeners.listeners[contextId];
					}
				
					return;
				}
			}
		}
	},

	fire: function (type, data, propagate) {
		if (!this.listens(type, propagate)) { return this; }

		var event = L.Util.extend({}, data, {type: type, target: this});

		if (this._events) {
			var typeListeners = this._events[type];
			
			this._isFiring = true;
			
			// each context
			for (var contextId in typeListeners.listeners) {
				var listeners = typeListeners.listeners[contextId];
				
				// each fn in context
				for (var i=0, len = listeners.length; i<len; i++) {
					var l = listeners[i];
					if (l.ctx) {
						l.fn.call(l.ctx, event);												
					} else {
						l.fn.call(this, event);
					}
				}
			}
			
			this._isFiring = false;
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	},

	listens: function (type, propagate) {
		var typeListeners = this._events && this._events[type];
		if (typeListeners && typeListeners.count) { return true; }

		if (propagate) {
			// also check parents for listeners if event propagates
			for (var id in this._eventParents) {
				if (this._eventParents[id].listens(type, propagate)) { return true; }
			}
		}
		return false;
	},

	once: function (types, fn, context) {

		if (typeof types === 'object') {
			for (var type in types) {
				this.once(type, types[type], fn);
			}
			return this;
		}

		var handler = L.bind(function () {
			this
			    .off(types, fn, context)
			    .off(types, handler, context);
		}, this);

		// add a listener that's executed once and removed after that
		return this
		    .on(types, fn, context)
		    .on(types, handler, context);
	},

	// adds a parent to propagate events to (when you fire with true as a 3rd argument)
	addEventParent: function (obj) {
		this._eventParents = this._eventParents || {};
		this._eventParents[L.stamp(obj)] = obj;
		return this;
	},

	removeEventParent: function (obj) {
		if (this._eventParents) {
			delete this._eventParents[L.stamp(obj)];
		}
		return this;
	},

	_propagateEvent: function (e) {
		for (var id in this._eventParents) {
			this._eventParents[id].fire(e.type, L.extend({layer: e.target}, e), true);
		}
	}
});

var proto = L.Evented.prototype;

// aliases; we should ditch those eventually
proto.addEventListener = proto.on;
proto.removeEventListener = proto.clearAllEventListeners = proto.off;
proto.addOneTimeEventListener = proto.once;
proto.fireEvent = proto.fire;
proto.hasEventListeners = proto.listens;

L.Mixin = {Events: proto};

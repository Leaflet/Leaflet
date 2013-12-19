/*
 * L.Mixin.Events is used to add custom events functionality to Leaflet classes.
 */

var eventsKey = '_leaflet_events';

L.Evented = L.Class.extend({

	on: function (types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (var type in types) {
				this._on(type, types[type], fn);
			}
			return this;
		}

		// types can be a string of space-separated words
		types = L.Util.splitWords(types);

		for (var i = 0, len = types.length; i < len; i++) {
			this._on(types[i], fn, context);
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function (type, fn, context) {

		var events = this[eventsKey] = this[eventsKey] || {},
		    contextId = context && context !== this && L.stamp(context);

		if (contextId) {
			// store listeners of a particular context in a separate hash (if it has an id)
			// gives a major performance boost when removing thousands of map layers

			var fnId = L.stamp(fn),
			    indexKey = type + '_idx',
			    indexLenKey = type + '_len',
			    typeIndex = events[indexKey] = events[indexKey] || {};

			typeIndex[fnId] = typeIndex[fnId] || {};

			if (!typeIndex[fnId][contextId]) {
				typeIndex[fnId][contextId] = {fn: fn, ctx: context};

				// keep track of the number of keys in the index to quickly check if it's empty
				events[indexLenKey] = (events[indexLenKey] || 0) + 1;
			}

		} else {
			events[type] = events[type] || [];
			events[type].push({fn: fn});
		}
	},

	off: function (types, fn, context) {

		if (!types) {
			delete this[eventsKey];
			return this;
		}

		if (typeof types === 'object') {
			for (var type in types) {
				this._off(type, types[type], fn);
			}
			return this;
		}

		types = L.Util.splitWords(types);

		for (var i = 0, len = types.length; i < len; i++) {
			this._off(types[i], fn, context);
		}

		return this;
	},

	_off: function (type, fn, context) {
		var events = this[eventsKey],
		    indexKey = type + '_idx',
		    indexLenKey = type + '_len';

		if (!events) { return; }

		if (!fn) {
			// clear all listeners for a type if function isn't specified
			delete events[type];
			delete events[indexKey];
			delete events[indexLenKey];
			return;
		}

		var contextId = context && context !== this && L.stamp(context),
		    listeners, i, len, listener;

		if (contextId) {
			listeners = events[indexKey] && events[indexKey][L.stamp(fn)];

			if (listeners && listeners[contextId]) {
				// set the old action to a no-op, because it is possible
				// that the listener is being iterated over as part of a dispatch
				listener = listeners[contextId];
				delete listeners[contextId];
				events[indexLenKey]--;
			}

		} else {
			listeners = events[type];

			for (i = 0, len = listeners.length; i < len; i++) {
				if (listeners[i].fn === fn) {
					listener = listeners[i];
					listeners.splice(i, 1);
					break;
				}
			}
		}

		// set the removed listener to noop so that's not called if remove happens in fire
		if (listener) {
			listener.fn = L.Util.falseFn;
		}
	},

	fire: function (type, data, propagate) {
		if (!this.listens(type, propagate)) { return this; }

		var event = L.Util.extend({}, data, {type: type, target: this}),
		    events = this[eventsKey];

		if (events) {
		    var typeIndex = events[type + '_idx'],
		        fnId, contextId, i, len, listeners, listener;

			if (events[type]) {
				// make sure adding/removing listeners inside other listeners won't cause infinite loop
				listeners = events[type].slice();

				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].fn.call(this, event);
				}
			}

			// fire event for the context-indexed listeners as well
			if (typeIndex) {
				for (fnId in typeIndex) {
					for (contextId in typeIndex[fnId]) {
						listener = typeIndex[fnId][contextId];
						listener.fn.call(listener.ctx, event);
					}
				}
			}
		}

		if (propagate) {
			this._propagateEvent(event);
		}

		return this;
	},

	listens: function (type, propagate) {
		var events = this[eventsKey];

		if (events && (events[type] || events[type + '_len'])) { return true; }

		if (propagate) {
			for (var id in this._eventParents) {
				if (this._eventParents[id].listens(type)) { return true; }
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

		return this
		    .on(types, fn, context)
		    .on(types, handler, context);
	},

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
			this._eventParents[id].fire(e.type, L.extend({layer: e.target}, e));
		}
	}
});

var proto = L.Evented.prototype;

// aliases
proto.addEventListener = proto.on;
proto.removeEventListener = proto.clearAllEventListeners = proto.off;
proto.addOneTimeEventListener = proto.once;
proto.fireEvent = proto.fire;
proto.hasEventListeners = proto.listens;

L.Mixin = {Events: proto};

/*
 * L.Mixin.Events is used to add custom events functionality to Leaflet classes.
 */

var eventsKey = '_leaflet_events';

L.Evented = L.Class.extend({

	on: function (types, fn, context) {

		var type;

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (type in types) {
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
		    contextId = context && context !== this && L.stamp(context),
		    indexKey, indexLenKey, typeIndex;

		var event = {
			action: fn,
			context: context || this
		};

		if (contextId) {
			// store listeners of a particular context in a separate hash (if it has an id)
			// gives a major performance boost when removing thousands of map layers

			indexKey = type + '_idx';
			indexLenKey = indexKey + '_len';

			typeIndex = events[indexKey] = events[indexKey] || {};

			if (!typeIndex[contextId]) {
				typeIndex[contextId] = [];

				// keep track of the number of keys in the index to quickly check if it's empty
				events[indexLenKey] = (events[indexLenKey] || 0) + 1;
			}

			typeIndex[contextId].push(event);


		} else {
			events[type] = events[type] || [];
			events[type].push(event);
		}
	},

	off: function (types, fn, context) {

		if (!this[eventsKey]) {
			return this;
		}
		if (!types) {
			return this.clearAllEventListeners();
		}

		var type;

		if (typeof types === 'object') {
			for (type in types) {
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
		    contextId = context && context !== this && L.stamp(context),
		    indexKey = type + '_idx',
		    indexLenKey = indexKey + '_len',
		    typeIndex = events[indexKey],
		    listeners, i, removed;

		if (!fn) {
			// clear all listeners for a type if function isn't specified
			delete events[type];
			delete events[indexKey];
			delete events[indexLenKey];

		} else {
			listeners = contextId && typeIndex ? typeIndex[contextId] : events[type];

			if (!listeners) { return; }

			for (i = listeners.length - 1; i >= 0; i--) {
				if ((listeners[i].action === fn) && (!context || (listeners[i].context === context))) {
					removed = listeners.splice(i, 1);
					// set the old action to a no-op, because it is possible
					// that the listener is being iterated over as part of a dispatch
					removed[0].action = L.Util.falseFn;
				}
			}

			if (context && typeIndex && (listeners.length === 0)) {
				delete typeIndex[contextId];
				events[indexLenKey]--;
			}
		}
	},

	fire: function (type, data, propagate) {
		if (!this.hasEventListeners(type, propagate)) {
			return this;
		}

		var event = L.Util.extend({}, data, {type: type, target: this}),
		    events = this[eventsKey],
		    listeners, i, len, typeIndex, contextId;

		if (events) {
			if (events[type]) {
				// make sure adding/removing listeners inside other listeners won't cause infinite loop
				listeners = events[type].slice();

				for (i = 0, len = listeners.length; i < len; i++) {
					listeners[i].action.call(listeners[i].context, event);
				}
			}

			// fire event for the context-indexed listeners as well
			typeIndex = events[type + '_idx'];

			if (typeIndex) {
				for (contextId in typeIndex) {
					listeners = typeIndex[contextId].slice();

					if (listeners) {
						for (i = 0, len = listeners.length; i < len; i++) {
							listeners[i].action.call(listeners[i].context, event);
						}
					}
				}
			}
		}

		if (propagate) {
			this._propagateEvent(event);
		}

		return this;
	},

	hasEventListeners: function (type, propagate) {
		var events = this[eventsKey];
		if (events && ((type in events && events[type].length > 0) ||
		               (type + '_idx' in events && events[type + '_idx_len'] > 0))) {
			return true;
		}
		if (propagate) {
			for (var id in this._eventParents) {
				if (this._eventParents[id].hasEventListeners(type)) { return true; }
			}
		}
		return false;
	},

	clearAllEventListeners: function () {
		delete this[eventsKey];
		return this;
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
proto.removeEventListener = proto.off;
proto.addOneTimeEventListener = proto.once;
proto.fireEvent = proto.fire;

L.Mixin = {Events: proto};

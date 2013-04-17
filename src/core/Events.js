/*
 * L.Mixin.Events is used to add custom events functionality to Leaflet classes.
 */

var key = '_leaflet_events';

L.Mixin = {};

L.Mixin.Events = {

	addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])

		var type;

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.addEventListener(type, types[type], fn);
				}
			}
			return this;
		}

		var events = this[key] = this[key] || {},
		    contextId = context && L.stamp(context),
		    i, len, evt, indexKey, indexLenKey, typeIndex;

		// types can be a string of space-separated words
		types = L.Util.splitWords(types);

		for (i = 0, len = types.length; i < len; i++) {
			evt = {
				action: fn,
				context: context || this
			};
			type = types[i];

			if (context) {
				// store listeners of a particular context in a separate hash (if it has an id)
				// gives a major performance boost when removing thousands of map layers

				indexKey = type + '_idx',
				indexLenKey = indexKey + '_len',

				typeIndex = events[indexKey] = events[indexKey] || {};
				typeIndex[contextId] = typeIndex[contextId] || [];

				typeIndex[contextId].push(evt);
				events[indexLenKey] = (events[indexLenKey] || 0) + 1;

			} else {
				events[type] = events[type] || [];
				events[type].push(evt);
			}
		}

		return this;
	},

	hasEventListeners: function (type) { // (String) -> Boolean
		var events = this[key];
		return !!events && (
		        (type in events && events[type].length > 0) ||
		        (type + '_idx' in events && events[type + '_idx_len'] > 0));
	},

	removeEventListener: function (types, fn, context) { // (String[, Function, Object]) or (Object[, Object])

		if (!types) {
			return this.clearAllEventListeners();
		}

		var type;

		if (typeof types === 'object') {
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.removeEventListener(type, types[type], fn);
				}
			}
			return this;
		}

		var events = this[key],
		    contextId = context && L.stamp(context),
		    i, len, listeners, j, typeIndexKey, typeIndex;

		types = L.Util.splitWords(types);

		for (i = 0, len = types.length; i < len; i++) {
			type = types[i];
			typeIndexKey = type + '_idx';
			typeIndex = events[typeIndexKey];

			if (!fn) {
				delete events[type];
				delete events[typeIndexKey];

			} else {
				listeners = context && typeIndex ? typeIndex[contextId] : events[types[i]];

				if (listeners) {

					for (j = listeners.length - 1; j >= 0; j--) {
						if ((listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
							listeners.splice(j, 1);
						}
					}

					if (context && typeIndex && (listeners.length === 0)) {
						delete typeIndex[contextId];
						events[type + '_idx_len']--;
					}
				}
			}
		}

		return this;
	},

	clearAllEventListeners: function () {
		delete this[key];
		return this;
	},

	fireEvent: function (type, data) { // (String[, Object])
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = L.Util.extend({}, data, {
			type: type,
			target: this
		});

		var listeners, i, len, eventsObj, contextId;

		if (this[key][type]) {
			listeners = this[key][type].slice();

			for (i = 0, len = listeners.length; i < len; i++) {
				listeners[i].action.call(listeners[i].context || this, event);
			}
		}

		// fire event for the context-indexed listeners as well

		eventsObj = this[key][type + '_idx'];

		if (eventsObj) {
			for (contextId in eventsObj) {
				if (eventsObj.hasOwnProperty(contextId)) {
					listeners = eventsObj[contextId];
					if (listeners) {
						for (i = 0, len = listeners.length; i < len; i++) {
							listeners[i].action.call(listeners[i].context || this, event);
						}
					}
				}
			}
		}

		return this;
	}
};

L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin.Events.fire = L.Mixin.Events.fireEvent;

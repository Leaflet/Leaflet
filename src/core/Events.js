/*
 * L.Mixin.Events adds custom events functionality to Leaflet classes
 */

var key = '_leaflet_events';

L.Mixin = {};

L.Mixin.Events = {

	addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])
		var events = this[key] = this[key] || {},
			type, i, len;

		// Types can be a map of types/handlers
		if (typeof types === 'object') {
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.addEventListener(type, types[type], fn);
				}
			}

			return this;
		}

		types = L.Util.splitWords(types);

		for (i = 0, len = types.length; i < len; i++) {
			var evt = {
				action: fn,
				context: context || this
			};
			if (context && context._leaflet_id) {
				var tIndex = types[i] + '_idx', leafletId = context._leaflet_id;
				events[tIndex] = events[tIndex] || {};
				if (events[tIndex][leafletId]) {
					events[tIndex][leafletId].push(evt);
				} else {
					events[tIndex][leafletId] = [evt];
					events[types[i] + '_idx_len'] = (events[types[i] + '_idx_len'] || 0) + 1;
				}
			} else {
				events[types[i]] = events[types[i]] || [];
				events[types[i]].push(evt);
			}
		}

		return this;
	},

	hasEventListeners: function (type) { // (String) -> Boolean
		if ((key in this)) {
			if ((type in this[key]) && this[key][type].length > 0) {
				return true;
			} else {
				if(this[key][type + '_idx_len'] > 0){
					return true;
				}
			}
		}
		return false;
	},

	removeEventListener: function (types, fn, context) { // (String[, Function, Object]) or (Object[, Object])
		var events = this[key],
			type, i, len, listeners, j;

		if (typeof types === 'object') {
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.removeEventListener(type, types[type], fn);
				}
			}
			return this;
		}
		types = L.Util.splitWords(types);
		for (i = 0, len = types.length; i < len; i++) {
			if (this.hasEventListeners(types[i])) {
				//if the context has a leaflet id, use it to find the listeners
				if (context && context._leaflet_id) {
					listeners =  events[types[i] + '_idx'][context._leaflet_id] || [];

				} else {
					listeners = events[types[i]];
				}
				for (j = listeners.length - 1; j >= 0; j--) {
					if (
					(!fn || listeners[j].action === fn) && (!context || (listeners[j].context === context))) {
						listeners.splice(j, 1);
					}
				}
				if (context && context._leaflet_id && listeners.length === 0) {
					delete events[types[i] + '_idx'][context._leaflet_id];
					events[types[i] + '_idx_len'] = (events[types[i] + '_idx_len'] || 1) - 1;
				}
			}
		}

		return this;
	},

	fireEvent: function (type, data) { // (String[, Object])
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = L.Util.extend({
			type: type,
			target: this
		}, data);

		if (this[key][type]) {
			var listeners = this[key][type].slice();

			for (var i = 0, len = listeners.length; i < len; i++) {
				listeners[i].action.call(listeners[i].context || this, event);
			}
		}
		//fire event for the indexed listeners as well
		var listenersIndex = this[key][type + '_idx'], listenerList;
		if (listenersIndex) {
			for (var leafletId in listenersIndex) {
				if (listenersIndex.hasOwnProperty(leafletId)) {
					listenerList = listenersIndex[leafletId];
					if (listenerList) {
						for (var j = 0, lenList = listenerList.length; j < lenList; j++) {
							listenerList[j].action.call(listenerList[j].context || this, event);
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

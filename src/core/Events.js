/*
 * L.Mixin.Events adds custom events functionality to Leaflet classes
 */

var key = '_leaflet_events';

L.Mixin = {};

L.Mixin.Events = {
	
	addEventListener: function (types, fn, context)  { // (String, Function[, Object]) or (Object[, Object])
		var events = this[key] || (this[key] = {}),
			type, i, j, tmp;
	
		// Types can be a map of types/handlers
		if (typeof types === 'object') {
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.addEventListener(type, types[type], fn);
				}
			}
			
			return this;
		}

		if (!context) {context = this; }
		types = L.Util.splitWords(types);
	
		// events: {<type>:[{fn:fn, ctxz:[ctx]}}
		// addition, look events, iterate fnz, push ctx
		// invocation, look events, iterate fnz, iterate ctxz
		// removal, look events, iterate fnz, a) with ctx, iterate ctx, splice, b) without ctx, splice fn entry

		for (i = types.length; i--;) {
			// look events, define conditional
			tmp = (events[types[i]] || (events[types[i]] = []));
			// iterate fnz
			for (j = tmp.length; j--;) {
				if (tmp[j].fn === fn) {
					tmp = tmp[j];
					break;
				}
			}
			if (j < 0) {
			  // not found
				tmp.push({
					fn: fn,
					ctxz: [context]
				});
			}
			else {
			  // found, append ctx
			  // assume no duplicates
			  // START DEBUG, look for duplicates
			  //for (j=tmp1.ctxz.length; j--;) {
			  //  if (tmp1.ctxz[j] === context)
			  //    throw new Error("Duplicate event entry found, type:"+types[i]+", fn: "+fn+". Others might exist");
			  //}
			  // END DEBUG
				tmp.ctxz.push(context);
			}
		}
	
		return this;
	},

	hasEventListeners: function (type) { // (String) -> Boolean
		var tmp;
		return ((tmp = this[key]) !== undefined) && ((tmp = tmp[type]) !== undefined) && (tmp.length > 0);
	},

	// NOTE: When invoked without context, the remove operation is much faster
	removeEventListener: function (types, fn, context) { // (String[, Function, Object]) or (Object[, Object])
		var events = this[key] || (this[key] = {}),
		  type, i, k, listeners, j, tmp;
		
		if (typeof types === 'object') {
			for (type in types) {
				if (types.hasOwnProperty(type)) {
					this.removeEventListener(type, types[type], fn);
				}
			}
		  
			return this;
		}
		
		types = L.Util.splitWords(types);

		for (i = types.length ; i--;) {
			if (undefined === (listeners = events[types[i]])) {
				continue;
			}
		
			if (!fn) {
				if (context) {
					throw new Error("LOGICAL: When fn is undefined, context should be undefined too.");
				}
				// remove all event listeners of this type (for all contexts)
				listeners.length = 0;
			}
			else {
				// listeners size depends on API complexity
				for (j = listeners.length ; j-- ;) {
					tmp = listeners[j]; // tmp={fn: fn, ctxz:[]}
					if (tmp.fn === fn) {
						if (!context) {
						   // remove this event listener for all contexts, fast
							listeners.splice(j, 1);
						}
						else {
							tmp = tmp.ctxz;
							for (k = tmp.length; k--;) {
								if (tmp[k] === context) {
									// remove this event listener for this context
									tmp.splice(k, 1);
									// ASSUME no duplicate context exists (same evt type, same listener)
									break; // k
								}
							}
						}
						// listener found
						break; // j
					}
				}
			}
		} // for i
		
		return this;
	},

	fireEvent: function (type, data) { // (String[, Object])
		if (!this.hasEventListeners(type)) {
			return this;
		}

		var event = L.Util.extend({
				type: type,
				target: this
			}, data),
			listeners = this[key][type],
			tmp, tmp1, i, j;

		for (i = listeners.length; i--;) {
			tmp = listeners[i];
			tmp1 = tmp.ctxz;
			for (j = tmp1.length; j--;) {
				tmp.fn.call(tmp1[j], event);
			}
		}

		return this;
	}
};

L.Mixin.Events.on = L.Mixin.Events.addEventListener;
L.Mixin.Events.off = L.Mixin.Events.removeEventListener;
L.Mixin.Events.fire = L.Mixin.Events.fireEvent;

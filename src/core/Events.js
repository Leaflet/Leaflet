// @ts-check
import {Class} from './Class.js';
import * as Util from './Util.js';

/** @import {LeafletEvent} from '../types.js' */

/**
 * A listener for the event type `K` of an object with the event map `E` that fired it as `T`. Events that aren't
 * in the map (space-separated types, events of plugins) get a plain event object. An indexed access rather than a
 * conditional type, so that `Evented<O, E>` stays covariant in `E` (a `Marker` is assignable to `Layer`).
 * @template {string} K
 * @template {object} E
 * @template [T=Evented<any, any>]
 * @typedef {(e: (E & {[type: string]: LeafletEvent & {[key: string]: any}})[K] & {target: T}) => void} Listener
 */

/**
 * An object with event types as keys and listeners as values, as taken by [`on`](#evented-on).
 * @template {object} E
 * @template [T=Evented<any, any>]
 * @typedef {{[K in keyof E]?: (e: E[K] & {target: T}) => void} & {[type: string]: (e: any) => void}} ListenerMap
 */

const warnedEvents = new Set();

/**
 * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow
 * you to execute some function when something happens with an object (e.g. the user clicks on the map,
 * causing the map to fire `'click'` event).
 *
 * @example
 * ```js
 * map.on('click', function(e) {
 * 	alert(e.latlng);
 * } );
 * ```
 *
 * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define
 * it as a function:
 *
 * ```js
 * function onClick(e) { ... }
 *
 * map.on('click', onClick);
 * map.off('click', onClick);
 * ```
 *
 * @template {object} [O=object]
 * @template {object} [E={}]
 * @extends {Class<O>}
 */
export class Evented extends Class {
	/**
	 * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the
	 * context of the listener (object the this keyword will point to). You can also pass several space-separated
	 * types (e.g. `'click dblclick'`).
	 * @template {string} K
	 * @overload
	 * @param {K} type
	 * @param {Listener<K, E, this>} fn
	 * @param {any} [context]
	 * @returns {this}
	 */
	/**
	 * Adds a set of type/listener pairs, e.g. `{click: onClick, pointermove: onPointerMove}`
	 * @overload
	 * @param {ListenerMap<E, this>} eventMap
	 * @param {any} [context]
	 * @returns {this}
	 */
	/**
	 * @param {string | ListenerMap<E, this>} types
	 * @param {any} [fn]
	 * @param {any} [context]
	 * @returns {this}
	 */
	on(types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (const [type, f] of Object.entries(types)) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, f, fn);
			}

		} else {
			// types can be a string of space-separated words
			for (const type of Util.splitWords(types)) {
				this._on(type, fn, context);
			}
		}

		return this;
	}

	/**
	 * Removes a previously added listener function. If no function is specified, it will remove all the
	 * listeners of that particular event from the object. Note that if you passed a custom context to `on`, you
	 * must pass the same context to `off` in order to remove the listener.
	 * @template {string} K
	 * @overload
	 * @param {K} type
	 * @param {Listener<K, E, this>} [fn]
	 * @param {any} [context]
	 * @returns {this}
	 */
	/**
	 * Removes a set of type/listener pairs.
	 * @overload
	 * @param {ListenerMap<E, this>} eventMap
	 * @param {any} [context]
	 * @returns {this}
	 */
	/**
	 * Removes all listeners to all events on the object. This includes implicitly attached events.
	 * @overload
	 * @returns {this}
	 */
	/**
	 * @param {string | ListenerMap<E, this>} [types]
	 * @param {any} [fn]
	 * @param {any} [context]
	 * @returns {this}
	 */
	off(types, fn, context) {

		if (!arguments.length) {
			// clear all listeners if called without arguments
			delete this._events;

		} else if (typeof types === 'object') {
			for (const [type, f] of Object.entries(types)) {
				this._off(type, f, fn);
			}

		} else {
			const removeAll = arguments.length === 1;
			for (const type of Util.splitWords(/** @type {string} */ (types))) {
				if (removeAll) {
					this._off(type);
				} else {
					this._off(type, fn, context);
				}
			}
		}

		return this;
	}

	/** @type {Record<string, string>} */
	static __REMOVED_EVENTS = {
		mousedown: 'pointerdown',
		mouseup: 'pointerup',
		mouseover: 'pointerover',
		mouseout: 'pointerout',
		mousemove: 'pointermove',
		keypress: 'keydown'
	};

	// attach listener (without syntactic sugar now)
	/**
	 * @param {string} type
	 * @param {unknown} fn
	 * @param {any} [context]
	 * @param {boolean} [_once]
	 */
	_on(type, fn, context, _once) {
		// To be removed in leaflet 3
		if (Object.hasOwn(Evented.__REMOVED_EVENTS, type) && !warnedEvents.has(type)) {
			warnedEvents.add(type);
			console.error(`The event ${type} has been removed in Leaflet 2. Use ${Evented.__REMOVED_EVENTS[type]} instead.`);
		}

		if (typeof fn !== 'function') {
			console.warn(`wrong listener type: ${typeof fn}`);
			return;
		}

		// check if fn already there
		if (this._listens(type, fn, context) !== false) {
			return;
		}

		if (context === this) {
			// Less memory footprint.
			context = undefined;
		}

		/** @type {{fn: Function, ctx: any, once?: boolean}} */
		const newListener = {fn, ctx: context};
		if (_once) {
			newListener.once = true;
		}

		this._events ??= {};
		this._events[type] ??= [];
		this._events[type].push(newListener);
	}

	/**
	 * @param {string} type
	 * @param {unknown} [fn]
	 * @param {any} [context]
	 */
	_off(type, fn, context) {
		if (!this._events) {
			return;
		}

		let listeners = this._events[type];
		if (!listeners) {
			return;
		}

		if (arguments.length === 1) { // remove all
			if (this._firingCount) {
				// Set all removed listeners to noop
				// so they are not called if remove happens in fire
				for (const listener of listeners) {
					listener.fn = Util.falseFn;
				}
			}
			// clear all listeners for a type if function isn't specified
			delete this._events[type];
			return;
		}

		if (typeof fn !== 'function') {
			console.warn(`wrong listener type: ${typeof fn}`);
			return;
		}

		// find fn and remove it
		const index = /** @type {number | false} */ (this._listens(type, fn, context));
		if (index !== false) {
			const listener = listeners[index];
			if (this._firingCount) {
				// set the removed listener to noop so that's not called if remove happens in fire
				listener.fn = Util.falseFn;

				/* copy array in case events are being fired */
				this._events[type] = listeners = listeners.slice();
			}
			listeners.splice(index, 1);
		}
	}

	/**
	 * Fires an event of the specified type. You can optionally provide a data object — the first argument of the
	 * listener function will contain its properties. The event can optionally be propagated to event parents.
	 * @param {string} type
	 * @param {object} [data]
	 * @param {boolean} [propagate]
	 * @returns {this}
	 */
	fire(type, data, propagate) {
		if (!this.listens(type, propagate)) { return this; }

		/** @type {LeafletEvent} */
		const event = {
			...data,
			type,
			target: this,
			sourceTarget: /** @type {{sourceTarget?: Evented<any, any>}} */ (data)?.sourceTarget || this
		};

		if (this._events) {
			const listeners = this._events[type];
			if (listeners) {
				this._firingCount = (/** @type {number} */ (this._firingCount) + 1) || 1;
				for (const l of listeners) {
					// off overwrites l.fn, so we need to copy fn to a variable
					const fn = l.fn;
					if (l.once) {
						this.off(type, /** @type {any} */ (fn), l.ctx);
					}
					fn.call(l.ctx || this, event);
				}

				this._firingCount--;
			}
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	}

	/**
	 * Returns `true` if a particular event type has any listeners attached to it. The verification can
	 * optionally be propagated, it will return `true` if parents have the listener attached to it.
	 * @overload
	 * @param {string} type
	 * @param {boolean} [propagate]
	 * @returns {boolean}
	 */
	/**
	 * Returns `true` if the given listener function (with the given context) is attached to a particular event
	 * type, optionally checking event parents too.
	 * @overload
	 * @param {string} type
	 * @param {Function} fn
	 * @param {any} [context]
	 * @param {boolean} [propagate]
	 * @returns {boolean}
	 */
	/**
	 * @param {string} type
	 * @param {Function | boolean} [fn]
	 * @param {any} [context]
	 * @param {boolean} [propagate]
	 * @returns {boolean}
	 */
	listens(type, fn, context, propagate) {
		if (typeof type !== 'string') {
			console.warn('"string" type argument expected');
		}

		// we don't overwrite the input `fn` value, because we need to use it for propagation
		let _fn = fn;
		if (typeof fn !== 'function') {
			propagate = !!fn;
			_fn = undefined;
			context = undefined;
		}

		if (this._events?.[type]?.length) {
			if (this._listens(type, _fn, context) !== false) {
				return true;
			}
		}

		if (propagate) {
			// also check parents for listeners if event propagates
			for (const p of Object.values(this._eventParents ?? {})) {
				if (p.listens(type, /** @type {any} */ (fn), context, propagate)) {
					return true;
				}
			}
		}
		return false;
	}

	// returns the index (number) or false
	/**
	 * @param {string} type
	 * @param {unknown} [fn]
	 * @param {any} [context]
	 * @returns {number | boolean}
	 */
	_listens(type, fn, context) {
		if (!this._events) {
			return false;
		}

		const listeners = this._events[type] ?? [];
		if (!fn) {
			return !!listeners.length;
		}

		if (context === this) {
			// Less memory footprint.
			context = undefined;
		}

		const index = listeners.findIndex(l => l.fn === fn && l.ctx === context);
		return index === -1 ? false : index;

	}

	/**
	 * Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
	 * @template {string} K
	 * @overload
	 * @param {K} type
	 * @param {Listener<K, E, this>} fn
	 * @param {any} [context]
	 * @returns {this}
	 */
	/**
	 * @overload
	 * @param {ListenerMap<E, this>} eventMap
	 * @param {any} [context]
	 * @returns {this}
	 */
	/**
	 * @param {string | ListenerMap<E, this>} types
	 * @param {any} [fn]
	 * @param {any} [context]
	 * @returns {this}
	 */
	once(types, fn, context) {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (const [type, f] of Object.entries(types)) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, f, fn, true);
			}

		} else {
			// types can be a string of space-separated words
			for (const type of Util.splitWords(types)) {
				this._on(type, fn, context, true);
			}
		}

		return this;
	}

	/**
	 * Adds an event parent - an `Evented` that will receive propagated events
	 * @param {Evented<any, any>} obj
	 * @returns {this}
	 */
	addEventParent(obj) {
		this._eventParents ??= {};
		this._eventParents[Util.stamp(obj)] = obj;
		return this;
	}

	/**
	 * Removes an event parent, so it will stop receiving propagated events
	 * @param {Evented<any, any>} obj
	 * @returns {this}
	 */
	removeEventParent(obj) {
		if (this._eventParents) {
			delete this._eventParents[Util.stamp(obj)];
		}
		return this;
	}

	/** @param {LeafletEvent} e */
	_propagateEvent(e) {
		for (const p of Object.values(this._eventParents ?? {})) {
			p.fire(e.type, {
				propagatedFrom: e.target,
				...e
			}, true);
		}
	}
};

/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { GeoJSONAbstractClass } from "./GeoJSONAbstractClass";
import * as Util from './Util';

// @ts-ignore
import {Object, ReturnType} from 'typescript';
import {Point} from "../geometry";
import {LayerGroup} from "../layer";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type ObjectReturnType = ReturnType<typeof Object>;
type FunctionReturnType = ReturnType<typeof Function>;
type EventReturnType = ReturnType<typeof Event>;
type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type onReturnType = ReturnType<typeof String | Object.Number >;
type eventReturnType = ReturnType<typeof Event>;
type _onReturnType = ReturnType<typeof String | Object.Number >;
type offReturnType = ReturnType<typeof String | Object.Number >;
type LayerReturnType = ReturnType<typeof LayerGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

// type PointReturnType = ReturnType<typeof Point>;
type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
// type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
// type roundReturnType = ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
// type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

// type numberAuxX = ReturnType<typeof Object.Number>;

// type numberAuxY = ReturnType<typeof Object.Number>;

/*
 * @class Evented
 * @aka L.Evented
 * @inherits Class
 *
 * A set of methods shared between event-powered classes (like `Map` and `Marker`). Generally, events allow you to execute some function when something happens with an object (e.g. the user clicks on the map, causing the map to fire `'click'` event).
 *
 * @example
 *
 * ```tsc
 * map.on('click', function(e) {
 * 	alert(e.latlng);
 * } );
 * ```
 *
 * Leaflet deals with event listeners by reference, so if you want to add a listener and then remove it, define it as a function:
 *
 * ```tsc
 * function onClick(e) { ... }
 *
 * map.on('click', onClick);
 * map.off('click', onClick);
 * ```
 */

export const Events = {
	/* @method on(type: String, fn: Function, context?: Object): this
	 * Adds a listener function (`fn`) to a particular event type of the object. You can optionally specify the context of the listener (object the this keyword will point to). You can also pass several space-separated types (e.g. `'click dblclick'`).
	 *
	 * @alternative
	 * @method on(eventMap: Object): this
	 * Adds a set of type/listener pairs, e.g. `{click: onClick, mousemove: onMouseMove}`
	 */
	on: function (types:onReturnType, fn:FunctionReturnType, context:EventReturnType):EventReturnType {

		// types can be a map of types/handlers
		if (typeof types === 'object') {
			for (const type in types) {
				// we don't process space-separated events here for performance;
				// it's a hot path since Layer uses the on(obj) syntax
				this._on(type, types[type], fn);
			}

		} else {
			// types can be a string of space-separated words
			types = Util.splitWords(types);

			for (const i in types.length) {
				this._on(types[i], fn, context);
			}
		}

		return this;
	},

	/* @method off(type: String, fn?: Function, context?: Object): this
	 * Removes a previously added listener function. If no function is specified, it will remove all the listeners of that particular event from the object. Note that if you passed a custom context to `on`, you must pass the same context to `off` in order to remove the listener.
	 *
	 * @alternative
	 * @method off(eventMap: Object): this
	 * Removes a set of type/listener pairs.
	 *
	 * @alternative
	 * @method off: this
	 * Removes all listeners to all events on the object. This includes implicitly attached events.
	 */
	off: function (types:offReturnType, fn:FunctionReturnType, context:EventReturnType):EventReturnType {

		if (!types) {
			// clear all listeners if called without arguments
			delete this._events;

		} else if (typeof types === 'object') {
			for (const type in types) {
				this._off(type, types[type], fn);
			}

		} else {
			types = Util.splitWords(types);

			for (const i in types) {
				this._off(types[i], fn, context);
			}
		}

		return this;
	},

	// attach listener (without syntactic sugar now)
	_on: function (type:_onReturnType, fn:FunctionReturnType, context:EventReturnType):void {
		this._events = this._events || {};

		/* get/init listeners for type */
		const typeListeners = this._events[type];
		if (!typeListeners) {
			typeListeners = [];
			this._events[type] = typeListeners;
		}

		if (context === this) {
			// Less memory footprint.
			context = undefined;
		}
		const newListener = {fn: fn, ctx: context};
		const listeners = typeListeners;

		// check if fn already there
		for (const i = 0, len = listeners.length; i < len; i++) {
			if (listeners[i].fn === fn && listeners[i].ctx === context) {
				return;
			}
		}

		listeners.push(newListener);
	},

	_off: function (type:EventReturnType, fn:FunctionReturnType, context:EventReturnType):void {
		const listeners;
		// const i;
		// const len;

		if (!this._events) { return; }

		listeners = this._events[type];

		if (!listeners) {
			return;
		}

		if (!fn) {
			// Set all removed listeners to noop so they are not called if remove happens in fire
			for (const i in listeners.length) {
				listeners[i].fn = Util.falseFn;
			}
			// clear all listeners for a type if function isn't specified
			delete this._events[type];
			return;
		}

		if (context === this) {
			context = undefined;
		}

		if (listeners) {

			// find fn and remove it
			for (const i in listeners.length) {
				const l = listeners[i];
				if (l.ctx !== context) { continue; }
				if (l.fn === fn) {

					// set the removed listener to noop so that's not called if remove happens in fire
					l.fn = Util.falseFn;

					if (this._firingCount) {
						/* copy array in case events are being fired */
						this._events[type] = listeners = listeners.slice();
					}
					listeners.splice(i, 1);

					return;
				}
			}
		}
	},

	// @method fire(type: String, data?: Object, propagate?: Boolean): this
	// Fires an event of the specified type. You can optionally provide a data
	// object — the first argument of the listener function will contain its
	// properties. The event can optionally be propagated to event parents.
	fire: function (type:StringReturnType, data:ObjectReturnType, propagate:boolean):EventReturnType {
		if (!this.listens(type, propagate)) { return this; }

		const event = Util.extend({}, data, {
			type: type,
			target: this,
			sourceTarget: data && data.sourceTarget || this
		});

		if (this._events) {
			const listeners = this._events[type];

			if (listeners) {
				this._firingCount = (this._firingCount + 1) || 1;
				for (const i = 0, len = listeners.length; i < len; i++) {
					const l = listeners[i];
					l.fn.call(l.ctx || this, event);
				}

				this._firingCount--;
			}
		}

		if (propagate) {
			// propagate the event to parents (set with addEventParent)
			this._propagateEvent(event);
		}

		return this;
	},

	// @method listens(type: String): Boolean
	// Returns `true` if a particular event type has any listeners attached to it.
	listens: function (type:StringReturnType, propagate:boolean):boolean {
		const listeners = this._events && this._events[type];
		if (listeners && listeners.length) { return true; }

		if (propagate) {
			// also check parents for listeners if event propagates
			for (const id in this._eventParents) {
				if (this._eventParents[id].listens(type, propagate)) { return true; }
			}
		}
		return false;
	},

	// @method once(…): this
	// Behaves as [`on(…)`](#evented-on), except the listener will only get fired once and then removed.
	once: function (types:EventReturnType, fn:FunctionReturnType, context:EventReturnType):EventReturnType {

		if (typeof types === 'object') {
			for (const type in types) {
				this.once(type, types[type], fn);
			}
			return this;
		}

		const handler = Util.bind(function ():void {
			this.off(types, fn, context).off(types, handler, context);
		}, this);

		// add a listener that's executed once and removed after that
		return this.on(types, fn, context).on(types, handler, context);
	},

	// @method addEventParent(obj: Evented): this
	// Adds an event parent - an `Evented` that will receive propagated events
	addEventParent: function (obj:EventReturnType):EventReturnType {
		this._eventParents = this._eventParents || {};
		this._eventParents[Util.stamp(obj)] = obj;
		return this;
	},

	// @method removeEventParent(obj: Evented): this
	// Removes an event parent, so it will stop receiving propagated events
	removeEventParent: function (obj:EventReturnType):EventReturnType {
		if (this._eventParents) {
			delete this._eventParents[Util.stamp(obj)];
		}
		return this;
	},

	_propagateEvent: function (e:EventReturnType):void {
		for (const id in this._eventParents) {
			this._eventParents[id].fire(e.type, Util.extend({
				layer: e.target,
				propagatedFrom: e.target
			}, e), true);
		}
	}
};

// aliases; we should ditch those eventually

// @method addEventListener(…): this
// Alias to [`on(…)`](#evented-on)
Events.addEventListener = Events.on;

// @method removeEventListener(…): this
// Alias to [`off(…)`](#evented-off)

// @method clearAllEventListeners(…): this
// Alias to [`off()`](#evented-off)
Events.removeEventListener = Events.clearAllEventListeners = Events.off;

// @method addOneTimeEventListener(…): this
// Alias to [`once(…)`](#evented-once)
Events.addOneTimeEventListener = Events.once;

// @method fireEvent(…): this
// Alias to [`fire(…)`](#evented-fire)
Events.fireEvent = Events.fire;

// @method hasEventListeners(…): Boolean
// Alias to [`listens(…)`](#evented-listens)
Events.hasEventListeners = Events.listens;

export const Evented:EventReturnType = GeoJSONAbstractClass.extend(Events);

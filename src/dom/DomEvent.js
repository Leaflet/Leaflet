// @ts-check
import {Point} from '../geometry/Point.js';
import * as Util from '../core/Util.js';
import {addDoubleTapListener, removeDoubleTapListener} from './DomEvent.DoubleTap.js';
import {getScale} from './DomUtil.js';

import * as PointerEvents from './DomEvent.PointerEvents.js';
export {PointerEvents};

/**
 * Utility functions to work with the
 * [DOM events](https://developer.mozilla.org/docs/Web/API/Event), used by Leaflet internally.
 * @module DomEvent
 */

/**
 * The event object type for the DOM event type `K`, or for any of them if `K` holds space-separated types. Types
 * that aren't in `HTMLElementEventMap` (custom events) get a plain `Event`.
 * @template {string} K
 * @typedef {K extends `${infer A} ${infer B}` ? DomEventOf<A> | DomEventOf<B> :
 *   K extends keyof HTMLElementEventMap ? HTMLElementEventMap[K] : Event} DomEventOf
 */

/**
 * A listener for the DOM event type `K` (or several space-separated types).
 * @template {string} K
 * @typedef {(e: DomEventOf<K>) => void} DomEventListener
 */

/**
 * An object with DOM event types as keys and listeners as values, as taken by [`DomEvent.on`](#domevent-on).
 * @typedef {{[K in keyof HTMLElementEventMap]?: (e: HTMLElementEventMap[K]) => void} &
 *   {[type: string]: (e: any) => void}} DomEventListenerMap
 */

// Inspired by John Resig, Dean Edwards and YUI addEvent implementations.

/**
 * Adds a listener function (`fn`) to a particular DOM event type of the element `el`. You
 * can optionally specify the context of the listener (object the `this` keyword will point
 * to). You can also pass several space-separated types (e.g. `'click dblclick'`).
 * @template {string} K
 * @overload
 * @param {EventTarget} el
 * @param {K} types
 * @param {DomEventListener<K>} fn
 * @param {any} [context]
 * @returns {void}
 */
/**
 * Adds a set of type/listener pairs, e.g. `{click: onClick, pointermove: onPointerMove}`
 * @overload
 * @param {EventTarget} el
 * @param {DomEventListenerMap} eventMap
 * @param {any} [context]
 * @returns {void}
 */
/**
 * @param {any} obj
 * @param {any} types
 * @param {any} [fn]
 * @param {any} [context]
 */
export function on(obj, types, fn, context) {

	if (types && typeof types === 'object') {
		for (const [type, listener] of Object.entries(types)) {
			addOne(obj, type, listener, fn);
		}
	} else {
		for (const type of Util.splitWords(types)) {
			addOne(obj, type, fn, context);
		}
	}
}

const eventsKey = '_leaflet_events';

/**
 * Removes a previously added listener function. Note that if you passed a custom context
 * to on, you must pass the same context to `off` in order to remove the listener.
 * @template {string} K
 * @overload
 * @param {EventTarget} el
 * @param {K} types
 * @param {DomEventListener<K>} fn
 * @param {any} [context]
 * @returns {void}
 */
/**
 * Removes a set of type/listener pairs, e.g. `{click: onClick, pointermove: onPointerMove}`
 * @overload
 * @param {EventTarget} el
 * @param {DomEventListenerMap} eventMap
 * @param {any} [context]
 * @returns {void}
 */
/**
 * Removes all previously added listeners of given types.
 * @overload
 * @param {EventTarget} el
 * @param {string} types
 * @returns {void}
 */
/**
 * Removes all previously added listeners from given element.
 * @overload
 * @param {EventTarget} el
 * @returns {void}
 */
/**
 * @param {any} obj
 * @param {any} [types]
 * @param {any} [fn]
 * @param {any} [context]
 */
export function off(obj, types, fn, context) {

	if (arguments.length === 1) {
		batchRemove(obj);
		delete obj[eventsKey];

	} else if (types && typeof types === 'object') {
		for (const [type, listener] of Object.entries(types)) {
			removeOne(obj, type, listener, fn);
		}

	} else {
		types = Util.splitWords(types);

		if (arguments.length === 2) {
			batchRemove(obj, type => types.includes(type));
		} else {
			for (const type of types) {
				removeOne(obj, type, fn, context);
			}
		}
	}
}

const DIGIT_RE = /\d/;

/**
 * @param {EventTarget & {_leaflet_events?: {[id: string]: any}}} obj
 * @param {(type: string) => boolean} [filterFn]
 */
function batchRemove(obj, filterFn) {
	for (const id of Object.keys(obj[eventsKey] ?? {})) {
		const type = id.split(DIGIT_RE)[0];
		if (!filterFn || filterFn(type)) {
			removeOne(obj, type, null, null, id);
		}
	}
}

/**
 * @param {EventTarget & {_leaflet_events?: {[id: string]: any}}} obj
 * @param {string} type
 * @param {any} fn
 * @param {any} [context]
 */
function addOne(obj, type, fn, context) {
	const id = type + Util.stamp(fn) + (context ? `_${Util.stamp(context)}` : '');

	if (obj[eventsKey] && obj[eventsKey][id]) { return; }

	/** @type {EventListener | ReturnType<typeof addDoubleTapListener>} */
	let handler = function (e) {
		return fn.call(context || obj, e);
	};

	if (type === 'dblclick') {
		handler = addDoubleTapListener(/** @type {HTMLElement} */ (obj), handler);
	} else {
		obj.addEventListener(type, handler, type === 'wheel' ? {passive: false} : false);
	}

	obj[eventsKey] ??= {};
	obj[eventsKey][id] = handler;
}

/**
 * @param {EventTarget & {_leaflet_events?: {[id: string]: any}}} obj
 * @param {string} type
 * @param {any} fn
 * @param {any} context
 * @param {string} [id]
 */
function removeOne(obj, type, fn, context, id) {
	id ??= type + Util.stamp(fn) + (context ? `_${Util.stamp(context)}` : '');
	const handler = obj[eventsKey] && obj[eventsKey][id];

	if (!handler) { return; }

	if (type === 'dblclick') {
		removeDoubleTapListener(/** @type {HTMLElement} */ (obj), handler);
	} else {
		obj.removeEventListener(type, handler, false);
	}

	/** @type {{[id: string]: any}} */ (obj[eventsKey])[id] = null;
}

/**
 * Stop the given event from propagation to parent elements. Used inside the listener functions:
 * ```js
 * DomEvent.on(div, 'click', DomEvent.stopPropagation);
 * ```
 * Given a Leaflet event, it stops the map from handling the original DOM event.
 * @param {Event | {originalEvent: Event}} e
 */
export function stopPropagation(e) {

	if ('stopPropagation' in e) {
		e.stopPropagation();
	} else if (e.originalEvent) {  // In case of Leaflet event.
		/** @type {Event & {_stopped?: boolean}} */ (e.originalEvent)._stopped = true;
	}
}

/**
 * Adds `stopPropagation` to the element's `'wheel'` events (plus browser variants).
 * @param {HTMLElement} el
 */
export function disableScrollPropagation(el) {
	addOne(el, 'wheel', stopPropagation);
}

/**
 * Adds `stopPropagation` to the element's `'dblclick'`, `'contextmenu'` and `'pointerdown'`
 * events (plus browser variants). For `'click'` events, prevents the map from handling the
 * click while still allowing the native DOM click event to propagate normally.
 * @param {HTMLElement} el
 */
export function disableClickPropagation(el) {
	on(el, 'pointerdown dblclick contextmenu', stopPropagation);
	/** @type {any} */ (el)['_leaflet_disable_click'] = true;
}

/**
 * Prevents the default action of the DOM Event `e` from happening (such as following
 * a link in the href of the a element, or doing a POST request with page reload
 * when a `<form>` is submitted). Use it inside listener functions.
 * @param {Event} e
 */
export function preventDefault(e) {
	e.preventDefault?.();
}

/**
 * Does `stopPropagation` and `preventDefault` at the same time. Given a Leaflet event, it only stops propagation:
 * the default action of the original DOM event still happens.
 * @param {Event | {originalEvent: Event}} e
 */
export function stop(e) {
	if ('preventDefault' in e) { preventDefault(e); }
	stopPropagation(e);
}

/**
 * Gets normalized pointer position from a DOM event relative to the `container`
 * (border excluded) or to the whole page if not specified.
 * @param {MouseEvent} e
 * @param {HTMLElement} [container]
 * @returns {Point}
 */
export function getPointerPosition(e, container) {
	if (!container) {
		return new Point(e.clientX, e.clientY);
	}

	const scale = getScale(container),
	offset = scale.boundingClientRect; // left and top  values are in page scale (like the event clientX/Y)

	return new Point(
		// offset.left/top values are in page scale (like clientX/Y),
		// whereas clientLeft/Top (border width) values are the original values (before CSS scale applies).
		(e.clientX - offset.left) / scale.x - container.clientLeft,
		(e.clientY - offset.top) / scale.y - container.clientTop
	);
}

/**
 * Gets the wheel pixel factor based on the devicePixelRatio
 * @returns {number}
 */
export function getWheelPxFactor() {
	// a wheel notch gives 100-120px in most browsers, so halving it fits the default 60px per zoom level (see #7403)
	return window.devicePixelRatio * 2;
}

/**
 * Gets normalized wheel delta from a wheel DOM event, in vertical pixels scrolled (negative if scrolling down).
 * Events from pointing devices without precise scrolling are mapped to a best guess of 60 pixels.
 * @param {WheelEvent} e
 * @returns {number}
 */
export function getWheelDelta(e) {
	return (e.deltaY && e.deltaMode === 0) ? -e.deltaY / getWheelPxFactor() : // Pixels
		(e.deltaY && e.deltaMode === 1) ? -e.deltaY * 20 : // Lines
		(e.deltaY && e.deltaMode === 2) ? -e.deltaY * 60 : // Pages
		(e.deltaX || e.deltaZ) ? 0 :	// Skip horizontal/depth wheel events
		0;
}

// check if element really left/entered the event target (for pointerover/pointerout)
/**
 * @param {Node} el
 * @param {MouseEvent} e
 */
export function isExternalTarget(el, e) {
	return !el.contains(/** @type {Node | null} */ (e.relatedTarget));
}

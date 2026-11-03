import {Point} from '../geometry/Point.js';
import * as Util from '../core/Util.js';
import {getScale} from './DomUtil.js';
import {stoppedEvents, clickDisabledElements} from './DomEventUtil.js';

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
 * @param {unknown} [context]
 * @returns {void}
 */
/**
 * Adds a set of type/listener pairs, e.g. `{click: onClick, pointermove: onPointerMove}`
 * @overload
 * @param {EventTarget} el
 * @param {DomEventListenerMap} eventMap
 * @param {unknown} [context]
 * @returns {void}
 */
/**
 * @param {any} obj
 * @param {any} types
 * @param {any} [fn]
 * @param {unknown} [context]
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

// the wrapped listeners added to each target, by type + listener id + context id
/** @type {WeakMap<EventTarget, Map<string, EventListener>>} */
const handlers = new WeakMap();

/**
 * Removes a previously added listener function. Note that if you passed a custom context
 * to on, you must pass the same context to `off` in order to remove the listener.
 * @template {string} K
 * @overload
 * @param {EventTarget} el
 * @param {K} types
 * @param {DomEventListener<K>} fn
 * @param {unknown} [context]
 * @returns {void}
 */
/**
 * Removes a set of type/listener pairs, e.g. `{click: onClick, pointermove: onPointerMove}`
 * @overload
 * @param {EventTarget} el
 * @param {DomEventListenerMap} eventMap
 * @param {unknown} [context]
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
 * @param {unknown} [context]
 */
export function off(obj, types, fn, context) {

	if (arguments.length === 1) {
		batchRemove(obj);
		handlers.delete(obj);

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
 * @param {EventTarget} obj
 * @param {(type: string) => boolean} [filterFn]
 */
function batchRemove(obj, filterFn) {
	for (const id of handlers.get(obj)?.keys() ?? []) {
		const type = id.split(DIGIT_RE)[0];
		if (!filterFn || filterFn(type)) {
			removeOne(obj, type, null, null, id);
		}
	}
}

/**
 * @param {EventTarget} obj
 * @param {string} type
 * @param {any} fn
 * @param {unknown} [context]
 */
function addOne(obj, type, fn, context) {
	const id = type + Util.stamp(fn) + (context ? `_${Util.stamp(context)}` : '');

	let objHandlers = handlers.get(obj);
	if (objHandlers?.has(id)) { return; }

	/** @type {EventListener} */
	const handler = function (e) {
		return fn.call(context || obj, e);
	};

	obj.addEventListener(type, handler, type === 'wheel' ? {passive: false} : false);

	if (!objHandlers) {
		objHandlers = new Map();
		handlers.set(obj, objHandlers);
	}
	objHandlers.set(id, handler);
}

/**
 * @param {EventTarget} obj
 * @param {string} type
 * @param {any} fn
 * @param {unknown} context
 * @param {string} [id]
 */
function removeOne(obj, type, fn, context, id) {
	id ??= type + Util.stamp(fn) + (context ? `_${Util.stamp(context)}` : '');
	const objHandlers = handlers.get(obj);
	const handler = objHandlers?.get(id);

	if (!objHandlers || !handler) { return; }

	obj.removeEventListener(type, handler, false);

	objHandlers.delete(id);
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
		stoppedEvents.add(e.originalEvent);
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
	clickDisabledElements.add(el);
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
 * Gets normalized wheel delta from a wheel DOM event, in vertical pixels scrolled (negative if scrolling down).
 * Events from pointing devices without precise scrolling are mapped to a best guess of 60 pixels.
 * @param {WheelEvent} e
 */
export function getWheelDelta(e) {
	// scale per delta mode (pixels, lines, pages); a wheel notch gives 100-120px in most browsers,
	// so pixels are halved to fit the default 60px per zoom level (see #7403)
	return -e.deltaY * (e.deltaMode ? e.deltaMode === 1 ? 20 : 60 : 0.5 / window.devicePixelRatio) || 0;
}

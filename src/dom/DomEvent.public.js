// @ts-check
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

export {
	on, off, stopPropagation, disableScrollPropagation, disableClickPropagation, preventDefault, stop,
	getPointerPosition, getWheelDelta, enablePointerDetection, disablePointerDetection
} from './DomEvent.js';

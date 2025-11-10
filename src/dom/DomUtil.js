import * as DomEvent from './DomEvent.js';
import {Point} from '../geometry/Point.js';

/*
 * @namespace DomUtil
 *
 * Utility functions to work with the [DOM](https://developer.mozilla.org/docs/Web/API/Document_Object_Model)
 * tree, used by Leaflet internally.
 *
 * Most functions expecting or returning a `HTMLElement` also work for
 * SVG elements. The only difference is that classes refer to CSS classes
 * in HTML and SVG classes in SVG.
 */

// @function get(id: String|HTMLElement): HTMLElement
export function get(id) {
	return typeof id === 'string' ? document.getElementById(id) : id;
}

// @function create(tagName: String, className?: String, container?: HTMLElement): HTMLElement
export function create(tagName, className, container) {
	const el = document.createElement(tagName);
	el.className = className ?? '';
	container?.appendChild(el);
	return el;
}

// @function toFront(el: HTMLElement)
export function toFront(el) {
	const parent = el.parentNode;
	if (parent && parent.lastChild !== el) { parent.appendChild(el); }
}

// @function toBack(el: HTMLElement)
export function toBack(el) {
	const parent = el.parentNode;
	if (parent && parent.firstChild !== el) { parent.insertBefore(el, parent.firstChild); }
}

// @function setTransform(el: HTMLElement, offset: Point, scale?: Number)
export function setTransform(el, offset, scale) {
	const pos = offset ?? new Point(0, 0);
	el.style.transform = `translate3d(${pos.x}px,${pos.y}px,0)${scale ? ` scale(${scale})` : ''}`;
}

const positions = new WeakMap();

// @function setPosition(el: HTMLElement, position: Point)
export function setPosition(el, point) {
	positions.set(el, point);
	setTransform(el, point);
}

// @function getPosition(el: HTMLElement): Point
export function getPosition(el) {
	return positions.get(el) ?? new Point(0, 0);
}

// ✅ KEEP ONLY ONE VERSION OF THESE
const documentStyle = typeof document === 'undefined' ? {} : document.documentElement.style;
const userSelectProp = ['userSelect', 'WebkitUserSelect'].find(prop => prop in documentStyle);
const _prevUserSelectMap = new WeakMap();

/**
 * @function disableTextSelection(el?: HTMLElement)
 */
export function disableTextSelection(el = document.documentElement) {
	if (!el?.style || !userSelectProp) { return; }
	const prev = el.style[userSelectProp];
	if (prev === 'none') { return; }
	_prevUserSelectMap.set(el, prev);
	el.style[userSelectProp] = 'none';
}

/**
 * @function enableTextSelection(el?: HTMLElement)
 */
export function enableTextSelection(el = document.documentElement) {
	if (!el?.style || !_prevUserSelectMap.has(el)) { return; }
	const prev = _prevUserSelectMap.get(el);
	el.style[userSelectProp] = prev ?? '';
	_prevUserSelectMap.delete(el);
}

// @function disableImageDrag()
export function disableImageDrag() {
	DomEvent.on(window, 'dragstart', DomEvent.preventDefault);
}

// @function enableImageDrag()
export function enableImageDrag() {
	DomEvent.off(window, 'dragstart', DomEvent.preventDefault);
}

let _outlineElement, _outlineStyle;

export function preventOutline(element) {
	while (element.tabIndex === -1) {
		element = element.parentNode;
	}
	if (!element.style) { return; }
	restoreOutline();
	_outlineElement = element;
	_outlineStyle = element.style.outlineStyle;
	element.style.outlineStyle = 'none';
	DomEvent.on(window, 'keydown', restoreOutline);
}

export function restoreOutline() {
	if (!_outlineElement) { return; }
	_outlineElement.style.outlineStyle = _outlineStyle;
	_outlineElement = undefined;
	_outlineStyle = undefined;
	DomEvent.off(window, 'keydown', restoreOutline);
}

export function getSizedParentNode(element) {
	do {
		element = element.parentNode;
	} while ((!element.offsetWidth || !element.offsetHeight) && element !== document.body);
	return element;
}

export function getScale(element) {
	const rect = element.getBoundingClientRect();
	return {
		x: rect.width / element.offsetWidth || 1,
		y: rect.height / element.offsetHeight || 1,
		boundingClientRect: rect
	};
}

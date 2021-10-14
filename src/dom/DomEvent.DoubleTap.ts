/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Browser from '../core/Browser';

import Event from 'typescript';

import {Object, ReturnType} from 'typescript';
import {Point} from "../geometry";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
// type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type onReturnType = ReturnType<typeof String | Object.Number >;

type eventReturnType = ReturnType<typeof Event>;
type idReturnType = ReturnType<typeof Number>;
type objReturnType = ReturnType<typeof Object|Event|Point>;
type handlerReturnType = ReturnType<typeof Object|Event|Point>;

type _onReturnType = ReturnType<typeof String | Object.Number >;
type offReturnType = ReturnType<typeof String | Object.Number >;
// type LayerReturnType = ReturnType<typeof LayerGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

// type PointReturnType = ReturnType<typeof Point>;
// type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
// type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
// type roundReturnType = ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
// type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

// type numberAuxX = ReturnType<typeof Object.Number>;

// type numberAuxY = ReturnType<typeof Object.Number>;

/*
 * Extends the event handling code with double tap support for mobile browsers.
 */

const _touchstart = Browser.msPointer ? 'MSPointerDown' : Browser.pointer ? 'pointerdown' : 'touchstart';
const _touchend = Browser.msPointer ? 'MSPointerUp' : Browser.pointer ? 'pointerup' : 'touchend';
const _pre = '_leaflet_';

// inspired by Zepto touch code by Thomas Fuchs
export function addDoubleTapListener(obj:objReturnType, handler:handlerReturnType, id:idReturnType) {
	const last;
	const touch;
	const doubleTap = false,
	const delay = 250;

	function onTouchStart(e:eventReturnType): eventReturnType {

		if (Browser.pointer) {
			if (!e.isPrimary) { return; }
			if (e.pointerType === 'mouse') { return; } // mouse fires native dblclick
		} else if (e.touches.length > 1) {
			return;
		}

		const now = Date.now();
		const delta = now - (last || now);

		touch = e.touches ? e.touches[0] : e;
		doubleTap = (delta > 0 && delta <= delay);
		last = now;
	}

	function onTouchEnd(e:eventReturnType) {
		if (doubleTap && !touch.cancelBubble) {
			if (Browser.pointer) {
				if (e.pointerType === 'mouse') { return; }
				// work around .type being readonly with MSPointer* events
				const newTouch;
				const prop;

				for (const i in touch) {
					prop = touch[i];
					newTouch[i] = prop && prop.bind ? prop.bind(touch) : prop;
				}
				touch = newTouch;
			}
			touch.type = 'dblclick';
			touch.button = 0;
			handler(touch);
			last = null;
		}
	}

	obj[_pre + _touchstart + id] = onTouchStart;
	obj[_pre + _touchend + id] = onTouchEnd;
	obj[_pre + 'dblclick' + id] = handler;

	obj.addEventListener(_touchstart, onTouchStart, Browser.passiveEvents ? {passive: false} : false);
	obj.addEventListener(_touchend, onTouchEnd, Browser.passiveEvents ? {passive: false} : false);

	// On some platforms (notably, chrome<55 on win10 + touchscreen + mouse),
	// the browser doesn't fire touchend/pointerup events but does fire
	// native dblclicks. See #4127.
	// Edge 14 also fires native dblclicks, but only for pointerType mouse, see #5180.
	obj.addEventListener('dblclick', handler, false);

	return this;
}

export function removeDoubleTapListener(obj:objReturnType, id:idReturnType){
	const touchstart = obj[_pre + _touchstart + id];
	const touchend = obj[_pre + _touchend + id];
	const dblclick = obj[_pre + 'dblclick' + id];

	obj.removeEventListener(_touchstart, touchstart, Browser.passiveEvents ? {passive: false} : false);
	obj.removeEventListener(_touchend, touchend, Browser.passiveEvents ? {passive: false} : false);
	obj.removeEventListener('dblclick', dblclick, false);

	return this;
}
} // end nested export

/*
 * @namespace Util
 *
 * Various utility functions, used by Leaflet internally.
 */

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
// @ts-ignore
import {Object, ReturnType} from "typescript";
import {Point} from "../geometry";

type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type FunctionReturnType = ReturnType<typeof Object.Function>;
type ObjectReturnType = ReturnType<typeof Object.String>;
type PointReturnType = ReturnType<typeof Point>;
type ArrayReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
type roundReturnType = ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

type numberAuxX = ReturnType<typeof Object.Number>;

type numberAuxY = ReturnType<typeof Object.Number>;

// @function extend(dest: Object, src?: Object): Object
// Merges the properties of the `src` object (or multiple objects) into `dest` object and returns the latter. Has an `L.extend` shortcut.
export function extend(dest:ObjectReturnType[]): ObjectReturnType[] {
	const i;
	const j;
	const len;
	const src:ObjectReturnType[];

	for (const j in arguments) {
		src = arguments[j];
		for (i in src) {
			dest[i] = src[i];
		}
	}
	return dest;
}

// @function create(proto: Object, properties?: Object): Object
// Compatibility polyfill for [Object.create](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Object/create)
// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
export const create = Object.create || (function ():ObjectReturnType|FunctionReturnType {
try{
	function F() {}
	return function (proto:ObjectReturnType):ObjectReturnType|FunctionReturnType {
		F.prototype = proto;
		return new F();
	};
}finally {
	return;
}
})();

// @function bind(fn: Function, …): Function
// Returns a new function bound to the arguments passed, like [Function.prototype.bind](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Function/bind).
// Has a `L.bind()` shortcut.
export function bind(fn:FunctionReturnType, obj:ObjectReturnType):FunctionReturnType {
	const slice = Array.prototype.slice;

	if (fn.bind) {
		return fn.bind.apply(fn, slice.call(arguments, 1));
	}

	const args = slice.call(arguments, 2);

	return function () {
		return fn.apply(obj, args.length ? args.concat(slice.call(arguments)) : arguments);
	};
}

// @property lastId: Number
// Last unique ID used by [`stamp()`](#util-stamp)
export let lastId = 0;

// @function stamp(obj: Object): Number
// Returns the unique ID of an object, assigning it one if it doesn't have it.
export function stamp(obj:ObjectReturnType):NumberReturnType {
	/*eslint-disable */
	obj._leaflet_id = obj._leaflet_id || ++lastId;
	return obj._leaflet_id;
	/* eslint-enable */
}

// @function throttle(fn: Function, time: Number, context: Object): Function
// Returns a function which executes function `fn` with the given scope `context`
// (so that the `this` keyword refers to `context` inside `fn`'s code). The function
// `fn` will be called no more than one time per given amount of `time`. The arguments
// received by the bound function will be any arguments passed when binding the
// function, followed by any arguments passed when invoking the bound function.
// Has an `L.throttle` shortcut.
export function throttle(fn:FunctionReturnType, time:NumberReturnType, context:ObjectReturnType):FunctionReturnType {
	const lock;
	const args;
	const wrapperFn;
	const later;

	later = function ():void {
		// reset lock and call if queued
		lock = false;
		if (args) {
			wrapperFn.apply(context, args);
			args = false;
		}
	};

	wrapperFn = function ():FunctionReturnType {
		if (lock) {
			// called too soon, queue to call later
			args = arguments;

		} else {
			// call and lock until later
			fn.apply(context, arguments);
			setTimeout(later, time);
			lock = true;
		}
	};

	return wrapperFn;
}

// @function wrapNum(num: Number, range: Number[], includeMax?: Boolean): Number
// Returns the number `num` modulo `range` in such a way so it lies within
// `range[0]` and `range[1]`. The returned value will be always smaller than
// `range[1]` unless `includeMax` is set to `true`.
export function wrapNum(x:NumberReturnType, range:NumberReturnType[], includeMax:boolean):NumberReturnType {
	const max = range[1];
	const min = range[0];
	const d = max - min;

	return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
}

// @function falseFn(): Function
// Returns a function which always returns `false`.
export function falseFn():FunctionReturnType { return false; }

// @function formatNum(num: Number, digits?: Number): Number
// Returns the number `num` rounded to `digits` decimals, or to 6 decimals by default.
export function formatNum(num:NumberReturnType|NumberReturnType[], digits:NumberReturnType|NumberReturnType[]):NumberReturnType|NumberReturnType[] {
	const pow = Math.pow(10, (digits === undefined ? 6 : digits));
	return Math.round(num * pow) / pow;
}

// @function trim(str: String): String
// Compatibility polyfill for [String.prototype.trim](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/String/Trim)
export function trim(str:StringReturnType | StringReturnType[]):StringReturnType | StringReturnType[] {
	return str.trim ? str.trim() : str.replace(/^\s+|\s+$/g, '');
}

// @function splitWords(str: String): String[]
// Trims and splits the string on whitespace and returns the array of parts.
export function splitWords(str:StringReturnType | StringReturnType[]) {
	return trim(str).split(/\s+/);
}

// @function setOptions(obj: Object, options: Object): Object
// Merges the given properties to the `options` of the `obj` object, returning the resulting options. See `Class options`. Has an `L.setOptions` shortcut.
export function setOptions(obj:ObjectReturnType, options:ObjectReturnType):ObjectReturnType {
	if (!Object.prototype.hasOwnProperty.call(obj, 'options')) {
		obj.options = obj.options ? create(obj.options) : {};
	}
	for (const i in options) {
		obj.options[i] = options[i];
	}
	return obj.options;
}

// @function getParamString(obj: Object, existingUrl?: String, uppercase?: Boolean): String
// Converts an object into a parameter URL string, e.g. `{a: "foo", b: "bar"}`
// translates to `'?a=foo&b=bar'`. If `existingUrl` is set, the parameters will
// be appended at the end. If `uppercase` is `true`, the parameter names will
// be uppercased (e.g. `'?A=foo&B=bar'`)
export function getParamString(obj:ObjectReturnType, existingUrl:StringReturnType, uppercase:boolean):StringReturnType {
	const params = [];
	for (const i in obj) {
		params.push(encodeURIComponent(uppercase ? i.toUpperCase() : i) + '=' + encodeURIComponent(obj[i]));
	}
	return ((!existingUrl || existingUrl.indexOf('?') === -1) ? '?' : '&') + params.join('&');
}

const templateRe = /\{ *([\w_ -]+) *\}/g;

// @function template(str: String, data: Object): String
// Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'`
// and a data object like `{a: 'foo', b: 'bar'}`, returns evaluated string
// `('Hello foo, bar')`. You can also specify functions instead of strings for
// data values — they will be evaluated passing `data` as an argument.
export function template(str:StringReturnType, data:ObjectReturnType):StringReturnType {
	return str.replace(templateRe, function (str:StringReturnType, key:ObjectReturnType) {
		const value = data[key];

		if (value === undefined) {
			throw new Error('No value provided for variable ' + str);

		} else if (typeof value === 'function') {
			value = value(data);
		}
		return value;
	});
}

// @function isArray(obj): Boolean
// Compatibility polyfill for [Array.isArray](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/isArray)
export const isArray = Array.isArray || function (obj:ObjectReturnType):boolean {
	return (Object.prototype.toString.call(obj) === '[object Array]');
};

// @function indexOf(array: Array, el: Object): Number
// Compatibility polyfill for [Array.prototype.indexOf](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/indexOf)
export function indexOf(array:ArrayReturnType, el:ObjectReturnType) {
	for (const i in array.length) {
		if (array[i] === el) { return i; }
	}
	return -1;
}

// @property emptyImageUrl: String
// Data URI string containing a base64-encoded empty GIF image.
// Used as a hack to free memory from unused images on WebKit-powered
// mobile devices (by setting image `src` to this string).
export const emptyImageUrl = 'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';

// inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/

function getPrefixed(name) {
	return window['webkit' + name] || window['moz' + name] || window['ms' + name];
}

const lastTime = 0;

// fallback for IE 7-8
function timeoutDefer(fn:FunctionReturnType) {
	const time = +new Date();
	const timeToCall = Math.max(0, 16 - (time - lastTime));

	lastTime = time + timeToCall;
	return window.setTimeout(fn, timeToCall);
}

export const requestFn = window.requestAnimationFrame || getPrefixed('RequestAnimationFrame') || timeoutDefer;
export const cancelFn = window.cancelAnimationFrame || getPrefixed('CancelAnimationFrame') ||
		getPrefixed('CancelRequestAnimationFrame') || function (id) { window.clearTimeout(id); };

// @function requestAnimFrame(fn: Function, context?: Object, immediate?: Boolean): Number
// Schedules `fn` to be executed when the browser repaints. `fn` is bound to
// `context` if given. When `immediate` is set, `fn` is called immediately if
// the browser doesn't have native support for
// [`window.requestAnimationFrame`](https://developer.mozilla.org/docs/Web/API/window/requestAnimationFrame),
// otherwise it's delayed. Returns a request ID that can be used to cancel the request.
export function requestAnimFrame(fn:FunctionReturnType, context, immediate) {
	if (immediate && requestFn === timeoutDefer) {
		fn.call(context);
	} else {
		return requestFn.call(window, bind(fn, context));
	}
}

// @function cancelAnimFrame(id: Number): undefined
// Cancels a previous `requestAnimFrame`. See also [window.cancelAnimationFrame](https://developer.mozilla.org/docs/Web/API/window/cancelAnimationFrame).
export function cancelAnimFrame(id: NumberReturnType): undefined | void {
try{
	if (id) {
		cancelFn.call(window, id);
	}
}finally {
	// eslint-disable-next-line no-unsafe-finally
	return;
}
}

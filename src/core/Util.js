/*
 * @namespace Util
 *
 * Various utility functions, used by Leaflet internally.
 */

/**
 * Last unique ID used by [`stamp()`](#util-stamp)
 * @type {number}
 */
export let lastId = 0;

/**
 * Returns the unique ID of an object, assigning it one if it doesn't have it.
 * @param {object} obj
 * @returns {number}
 */
export function stamp(obj) {
	if (!('_leaflet_id' in obj)) {
		obj['_leaflet_id'] = ++lastId;
	}
	return obj._leaflet_id;
}

/**
 * Returns a function which executes function `fn` with the given scope `context` (so that the `this` keyword
 * refers to `context` inside `fn`'s code). The function `fn` will be called no more than one time per given
 * amount of `time`. The arguments received by the bound function will be any arguments passed when binding
 * the function, followed by any arguments passed when invoking the bound function.
 * @param {Function} fn
 * @param {number} time
 * @param {object} context
 * @returns {Function}
 */
export function throttle(fn, time, context) {
	let lock, queuedArgs;

	function later() {
		// reset lock and call if queued
		lock = false;
		if (queuedArgs) {
			wrapperFn.apply(context, queuedArgs);
			queuedArgs = false;
		}
	}

	function wrapperFn(...args) {
		if (lock) {
			// called too soon, queue to call later
			queuedArgs = args;

		} else {
			// call and lock until later
			fn.apply(context, args);
			setTimeout(later, time);
			lock = true;
		}
	}

	return wrapperFn;
}

/**
 * Returns the number `num` modulo `range` in such a way so it lies within `range[0]` and `range[1]`.
 * The returned value will always be smaller than `range[1]` unless `includeMax` is set to `true`.
 * @param {number} num
 * @param {number[]} range
 * @param {boolean} [includeMax]
 * @returns {number}
 */
export function wrapNum(x, range, includeMax) {
	const max = range[1],
	min = range[0],
	d = max - min;
	return x === max && includeMax ? x : ((x - min) % d + d) % d + min;
}

/**
 * Returns a function which always returns `false`.
 * @returns {Function}
 */
export function falseFn() { return false; }

/**
 * Returns the number `num` rounded with specified `precision`. The default `precision` value is 6 decimal
 * places. `false` can be passed to skip any processing (can be useful to avoid round-off errors).
 * @param {number} num
 * @param {number | false} [precision]
 * @returns {number}
 */
export function formatNum(num, precision) {
	if (precision === false) { return num; }
	const pow = 10 ** (precision === undefined ? 6 : precision);
	return Math.round(num * pow) / pow;
}

const WHITESPACE_RE = /\s+/;

/**
 * Trims and splits the string on whitespace and returns the array of parts.
 * @param {string} str
 * @returns {string[]}
 */
export function splitWords(str) {
	return str.trim().split(WHITESPACE_RE);
}

/**
 * Merges the given properties to the `options` of the `obj` object,
 * returning the resulting options. See `Class options`.
 * @param {object} obj
 * @param {object} options
 * @returns {object}
 */
export function setOptions(obj, options) {
	if (!Object.hasOwn(obj, 'options')) {
		const defaults = getDefaultOptions(obj.constructor) ?? obj.options;
		obj.options = defaults ? Object.create(defaults) : {};
	}
	for (const i in options) {
		if (Object.hasOwn(options, i)) {
			obj.options[i] = options[i];
		}
	}
	return obj.options;
}

const chainedDefaults = new WeakMap(); // class -> the defaultOptions object it was chained with

// Links the `defaultOptions` of each class in the chain to its parent's, so defaults are inherited and stay live.
// Done on first use because a static field can't do it in its initializer and stay tree-shakeable.
function getDefaultOptions(cls) {
	const defaults = cls?.defaultOptions;
	if (defaults && chainedDefaults.get(cls) !== defaults) {
		for (let c = cls; c.defaultOptions; c = Object.getPrototypeOf(c)) {
			if (Object.hasOwn(c, 'defaultOptions')) {
				Object.setPrototypeOf(c.defaultOptions, Object.getPrototypeOf(c).defaultOptions ?? Object.prototype);
			}
		}
		chainedDefaults.set(cls, defaults);
	}
	return defaults;
}

const templateRe = /\{ *([\w_ -]+) *\}/g;

/**
 * Simple templating facility, accepts a template string of the form `'Hello {a}, {b}'` and a data object
 * like `{a: 'foo', b: 'bar'}`, returns evaluated string `('Hello foo, bar')`. You can also specify functions
 * instead of strings for data values — they will be evaluated passing `data` as an argument.
 * @param {string} str
 * @param {object} data
 * @returns {string}
 */
export function template(str, data) {
	return str.replace(templateRe, (str, key) => {
		let value = data[key];

		if (value === undefined) {
			throw new Error(`No value provided for variable ${str}`);

		} else if (typeof value === 'function') {
			value = value(data);
		}
		return value;
	});
}



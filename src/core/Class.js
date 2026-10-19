import * as Util from './Util.js';

// @class Class

// @section
// @uninheritable

// Thanks to John Resig and Dean Edwards for inspiration!

export class Class {
	// @function include(properties: Object): this
	// [Includes a mixin](#class-includes) into the current class.
	static include(props) {
		for (const k of getAllMethodNames(props)) {
			if (k !== 'constructor' && k !== 'options') {
				this.prototype[k] = props[k];
			}
		}
		if (props.options) {
			this.mergeOptions(props.options);
		}
		return this;

		function *getAllMethodNames(obj) {
			do {
				if (obj === Object || obj === Object.prototype) {
					break;
				}
				for (const k of Object.getOwnPropertyNames(obj)) {
					yield k;
				}
			} while ((obj = Object.getPrototypeOf(obj)) !== null);
		}
	}

	// @function mergeOptions(options: Object): this
	// [Merges `options`](#class-options) into the `defaultOptions` of the class.
	static mergeOptions(options) {
		if (!Object.hasOwn(this, 'defaultOptions')) {
			this.defaultOptions = Object.create(this.defaultOptions ?? Object.prototype);
		}
		Object.assign(this.defaultOptions, options);
		return this;
	}

	// @function setDefaultOptions(options: Object): this
	// Deprecated alias of `mergeOptions`, kept for code written for 2.0.0-alpha.1.
	static setDefaultOptions(options) {
		return this.mergeOptions(options);
	}

	// @function addInitHook(fn: Function): this
	// Adds a [constructor hook](#class-constructor-hooks) to the class.
	static addInitHook(fn, ...args) { // (Function) || (String, args...)
		const init = typeof fn === 'function' ? fn : function () {
			this[fn](...args);
		};

		if (!Object.hasOwn(this.prototype, '_initHooks')) { // do not use ??= here
			this.prototype._initHooks = [];
		}
		this.prototype._initHooks.push(init);
		return this;
	}

	constructor(...args) {
		this._initHooksCalled = false;

		Util.setOptions(this);

		// call the constructor
		if (this.initialize) {
			this.initialize(...args);
		}

		// call all constructor hooks
		this.callInitHooks();
	}

	callInitHooks() {
		if (this._initHooksCalled) {
			return;
		}

		// collect all prototypes in chain
		const prototypes = [];
		let current = this;

		while ((current = Object.getPrototypeOf(current)) !== null) {
			prototypes.push(current);
		}

		// reverse so the parent prototype is first
		prototypes.reverse();

		// call init hooks on each prototype
		for (const proto of prototypes) {
			for (const hook of proto._initHooks ?? []) {
				hook.call(this);
			}
		}

		this._initHooksCalled = true;
	}
}

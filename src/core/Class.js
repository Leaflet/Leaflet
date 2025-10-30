import * as Util from './Util.js';

// @class Class

// @section
// @uninheritable

// Thanks to John Resig and Dean Edwards for inspiration!

export const Class = withInitHooks(class Class {
	// @function extend(props: Object): Function
	// [Extends the current class](#class-inheritance) given the properties to be included.
	// Deprecated - use `class X extends Class` instead!
	// Returns a Javascript function that is a class constructor (to be called with `new`).
	static extend({statics, includes, ...props}) {
		const NewClass = class extends this {};

		// inherit parent's static properties
		Object.setPrototypeOf(NewClass, this);

		const parentProto = this.prototype;
		const proto = NewClass.prototype;

		// mix static properties into the class
		if (statics) {
			Object.assign(NewClass, statics);
		}

		// mix includes into the prototype
		if (Array.isArray(includes)) {
			for (const include of includes) {
				NewClass.include(include);
			}
		} else if (includes) {
			NewClass.include(includes);
		}

		// mix given properties into the prototype
		Object.assign(proto, props);

		// merge options
		if (proto.options) {
			proto.options = parentProto.options ? Object.create(parentProto.options) : {};
			Object.assign(proto.options, props.options);
		}

		// enable initialization hooks for backwards compatibility
		return withInitHooks(NewClass);
	}

	// @function include(properties: Object): this
	// [Includes a mixin](#class-includes) into the current class.
	static include(props) {
		const parentOptions = this.prototype.options;
		for (const k of getAllMethodNames(props)) {
			this.prototype[k] = props[k];
		}
		if (props.options) {
			this.prototype.options = parentOptions;
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
			} while ((obj = Object.getPrototypeOf(obj)) !== undefined);
		}
	}

	// @function setDefaultOptions(options: Object): this
	// Configures the [default `options`](#class-options) on the prototype of this class.
	static setDefaultOptions(options) {
		Util.setOptions(this.prototype, options);
		return this;
	}

	// @function mergeOptions(options: Object): this
	// [Merges `options`](#class-options) into the defaults of the class.
	static mergeOptions(options) {
		this.prototype.options ??= {};
		Object.assign(this.prototype.options, options);
		return this;
	}

	// @function addInitHook(fn: Function): this
	// Adds a [constructor hook](#class-constructor-hooks) to the class.

	constructor(...args) {
		Util.setOptions(this);

		// call the constructor
		if (this.initialize) {
			console.warn('The \'initialize()\' method is deprecated, use a class constructor instead.');
			this.initialize(...args);
		}
	}
});

// @function withInitHooks(Object TargetClass): Function
// Decorates a class to be able to use [constructor hooks](#class-constructor-hooks) functionality.
/**
 * @template T
 * @param {T} TargetClass
 * @returns {T}
 */
export function withInitHooks(TargetClass) {
	const hooks = [];
	const proxy = new Proxy(TargetClass, {
		construct(target, args, newTarget) {
			const instance = Reflect.construct(target, args, newTarget);

			for (const hook of hooks) {
				hook.call(instance);
			}

			return instance;
		}
	});

	TargetClass.addInitHook = function addInitHook(fn, ...args) {
		if (this !== proxy) {
			const className = this.name || '(anonymous)';
			throw new Error(`The 'addInitHook()' method can only be called on classes wrapped with 'withInitHooks()'. Try wrapping your class:\n\nconst ${className} = withInitHooks(class ${className} { ... });\n`);
		}

		const init = typeof fn === 'function' ? fn : function () {
			this[fn].apply(this, args);
		};

		hooks.push(init);

		return this;
	};

	return proxy;
}

import * as Util from './Util.js';

/**
 * The type of a class's `static defaultOptions`: some of its options, plus anything a subclass adds.
 * @template O
 * @typedef {Partial<O> & {[key: string]: unknown}} Defaults
 */

let hooksVersion = 0;
/** @type {WeakMap<object, Function[]>} */
const ownHooks = new WeakMap(); // class -> hooks added to that class directly
/** @type {WeakMap<Function, {version: number, runners: number, hooks: Function[]}>} */
const hookPlans = new WeakMap(); // class -> {version, runners, hooks} for its whole chain

// Counts the classes in the chain that end their constructor with `callInitHooks()` and collects their hooks,
// parents first. Cached per class until the next `addInitHook` call.
/** @param {Function & {initHooks?: boolean}} cls */
function getHookPlan(cls) {
	let plan = hookPlans.get(cls);
	if (plan?.version !== hooksVersion) {
		plan = {version: hooksVersion, runners: 0, hooks: []};
		for (let c = cls; c !== Function.prototype; c = Object.getPrototypeOf(c)) {
			if (Object.hasOwn(c, 'initHooks') && c.initHooks) { plan.runners++; }
			plan.hooks.unshift(...(ownHooks.get(c) ?? []));
		}
		hookPlans.set(cls, plan);
	}
	return plan;
}

/**
 * Class is the base of `Evented`, `Handler`, `Icon` and `Control`, and
 * through them of almost all of the Leaflet classes documented here.
 *
 * Leaflet classes are plain JavaScript classes: extend them with `extends` and
 * put setup code in `constructor()`, after calling `super()`. Class adds what plugins
 * need on top of that: default options, mixins and constructor hooks.
 *
 * @example
 * ```js
 * class MyClass extends Class {
 *     constructor(greeter) {
 *         super();
 *         this.greeter = greeter;
 *     }
 *
 *     greet(name) {
 *         alert(this.greeter + ', ' + name)
 *     }
 * }
 *
 * // create instance of MyClass, passing "Hello" to the constructor
 * const a = new MyClass("Hello");
 *
 * // call greet method, alerting "Hello, World"
 * a.greet("World");
 * ```
 *
 * Leaflet 1.x classes used an `initialize()` method instead of `constructor()`. Constructing
 * a class that still has an `initialize()` method throws an error.
 *
 * @example <caption>Options</caption>
 * Declare the default options of a class with a static `defaultOptions` field. They
 * are merged with the default options of the parent class instead of replacing them,
 * which makes managing configuration of objects and default values convenient:
 *
 * ```js
 * class MyClass extends Class {
 *     static defaultOptions = {
 *         myOption1: 'foo',
 *         myOption2: 'bar'
 *     };
 * }
 *
 * class MyChildClass extends MyClass {
 *     static defaultOptions = {
 *         myOption1: 'baz',
 *         myOption3: 5
 *     };
 * }
 *
 * const a = new MyChildClass();
 * a.options.myOption1; // 'baz'
 * a.options.myOption2; // 'bar'
 * a.options.myOption3; // 5
 * ```
 *
 * Every instance gets its own `options` object, which inherits from the default options of its class. Changing
 * a default later, like `Marker.defaultOptions.riseOnHover = true`, affects all instances that don't set
 * the option themselves. `mergeOptions()` adds or changes defaults of an existing class without touching
 * the defaults of its parent, which makes it the way to change defaults from a plugin:
 *
 * ```js
 * MyChildClass.mergeOptions({myOption4: true});
 * ```
 *
 * There's also [`Util.setOptions`](#util-setoptions), a method for conveniently merging
 * options passed to constructor with the defaults defined in the class:
 *
 * ```js
 * class MyClass extends Class {
 *     static defaultOptions = {
 *         foo: 'bar',
 *         bla: 5
 *     };
 *
 *     constructor(options) {
 *         super();
 *         Util.setOptions(this, options);
 *         ...
 *     }
 * }
 *
 * const a = new MyClass({bla: 10});
 * a.options; // {foo: 'bar', bla: 10}
 * ```
 *
 * Note that the options object allows any keys, not just the options defined by the class and
 * its base classes. This means you can use the options object to store application specific information,
 * as long as you avoid keys that are already used by the class in question.
 *
 * @example <caption>Mixins</caption>
 * You can add methods and properties from other objects using the `include` method (such objects are called
 * mixins). An `options` property of the mixin is merged into the default options of the class:
 *
 * ```js
 * const MyMixin = {
 *     foo() { ... },
 *     bar: 5
 * };
 *
 * class MyClass extends Class {}
 *
 * MyClass.include(MyMixin);
 *
 * const a = new MyClass();
 * a.foo();
 * ```
 *
 * @example <caption>Constructor hooks</caption>
 * If you're a plugin developer, you often need to add additional initialization code to existing classes (e.g.
 * editing hooks for `Polyline`). Leaflet comes with a way to do it easily using the `addInitHook` method:
 *
 * ```js
 * MyClass.addInitHook(function () {
 *     // ... do something in constructor additionally
 *     // e.g. add event listeners, set custom properties etc.
 * });
 * ```
 *
 * You can also use the following shortcut when you just need to make one additional method call:
 *
 * ```js
 * MyClass.addInitHook('methodName', arg1, arg2, …);
 * ```
 *
 * Hooks added to a class also run for instances of its subclasses, parent class hooks first, and
 * each hook runs once per instance. For Leaflet's own classes, they run after the constructor
 * has finished, so a hook added to `Layer` sees a fully built `Polygon`. For a class of your own
 * that extends a Leaflet class, they run before the constructor body of your class.
 *
 * If other code adds hooks to a class of yours and these hooks need the constructor of your class to have run,
 * mark the class with `static initHooks = true` and end its constructor with `this.callInitHooks()`:
 *
 * ```js
 * class MyLayer extends Layer {
 *     static initHooks = true;
 *
 *     constructor(options) {
 *         super();
 *         Util.setOptions(this, options);
 *         this._items = [];
 *         this.callInitHooks();
 *     }
 * }
 * ```
 *
 * @template {object} [O=object]
 */
export class Class {
	/**
	 * Marks a class whose constructor ends with `this.callInitHooks()`. Set it as `static initHooks = true` on a
	 * plugin class whose own [constructor hooks](#class-constructor-hooks) need its constructor to run first.
	 * @uninheritable
	 */
	static initHooks = true;

	/**
	 * [Includes a mixin](#class-includes) into the current class.
	 * @template {{prototype: object, mergeOptions: Function}} C
	 * @this {C}
	 * @param {object} properties
	 * @returns {C}
	 * @uninheritable
	 */
	static include(properties) {
		for (let obj = properties; obj && obj !== Object.prototype; obj = Object.getPrototypeOf(obj)) {
			for (const k of Object.getOwnPropertyNames(obj)) {
				if (k !== 'constructor' && k !== 'options') {
					/** @type {any} */ (this.prototype)[k] = /** @type {any} */ (properties)[k];
				}
			}
		}
		const {options} = /** @type {{options?: object}} */ (properties);
		if (options) {
			this.mergeOptions(options);
		}
		return this;
	}

	/**
	 * [Merges `options`](#class-options) into the `defaultOptions` of the class.
	 * @template {{defaultOptions?: object}} C
	 * @this {C}
	 * @param {Partial<NonNullable<C['defaultOptions']>>} options
	 * @returns {C}
	 * @uninheritable
	 */
	static mergeOptions(options) {
		if (!Object.hasOwn(this, 'defaultOptions')) {
			this.defaultOptions = Object.create(this.defaultOptions ?? Object.prototype);
		}
		Object.assign(/** @type {object} */ (this.defaultOptions), options);
		return this;
	}

	/**
	 * Deprecated alias of `mergeOptions`, kept for code written for 2.0.0-alpha.1.
	 * @deprecated Use `mergeOptions`.
	 * @template {{defaultOptions?: object, mergeOptions: Function}} C
	 * @this {C}
	 * @param {Partial<NonNullable<C['defaultOptions']>>} options
	 * @returns {C}
	 * @uninheritable
	 */
	static setDefaultOptions(options) {
		return this.mergeOptions(options);
	}

	/**
	 * Adds a [constructor hook](#class-constructor-hooks) to the class: a function called with the instance as
	 * `this`, or the name of a method to call with the given arguments.
	 * @template {{prototype: object}} C
	 * @this {C}
	 * @param {((this: C['prototype']) => void) | (keyof C['prototype'] & string)} fn
	 * @param {...any} args
	 * @returns {C}
	 * @uninheritable
	 */
	static addInitHook(fn, ...args) {
		const hook = typeof fn === 'function' ? fn : /** @this {Record<string, Function>} */ function () {
			this[fn](...args);
		};
		if (!ownHooks.has(this)) {
			ownHooks.set(this, []);
		}
		/** @type {Function[]} */ (ownHooks.get(this)).push(hook);
		hooksVersion++;
		return this;
	}

	constructor() {
		if (/** @type {any} */ (this).initialize) {
			throw new Error(`${this.constructor.name}: initialize() is not called in Leaflet 2. ` +
				'Rename it to constructor() and call super() at its start.');
		}

		/** @type {O} */
		this.options = Util.setOptions(this);

		this._initHooksLeft = getHookPlan(this.constructor).runners;
		this.callInitHooks();
	}

	/**
	 * Called at the end of the constructor of every class with `static initHooks = true`. The last of these calls,
	 * from the deepest such class, runs all hooks of the chain once, so they see a fully built instance.
	 * @uninheritable
	 */
	callInitHooks() {
		if (--this._initHooksLeft === 0) {
			for (const hook of getHookPlan(this.constructor).hooks) {
				hook.call(this);
			}
		}
	}
}

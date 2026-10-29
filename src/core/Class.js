import * as Util from './Util.js';

// @class Class

// @section
// @uninheritable

let hooksVersion = 0;
const ownHooks = new WeakMap(); // class -> hooks added to that class directly
const hookPlans = new WeakMap(); // class -> {version, runners, hooks} for its whole chain

// Counts the classes in the chain that end their constructor with `callInitHooks()` and collects their hooks,
// parents first. Cached per class until the next `addInitHook` call.
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

export class Class {
	// @property initHooks: Boolean
	// Marks a class whose constructor ends with `this.callInitHooks()`. Set it as `static initHooks = true` on
	// a plugin class whose own [constructor hooks](#class-constructor-hooks) need its constructor to run first.
	static initHooks = true;

	// @function include(properties: Object): this
	// [Includes a mixin](#class-includes) into the current class.
	static include(props) {
		for (let obj = props; obj && obj !== Object.prototype; obj = Object.getPrototypeOf(obj)) {
			for (const k of Object.getOwnPropertyNames(obj)) {
				if (k !== 'constructor' && k !== 'options') {
					this.prototype[k] = props[k];
				}
			}
		}
		if (props.options) {
			this.mergeOptions(props.options);
		}
		return this;
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
		const hook = typeof fn === 'function' ? fn : function () {
			this[fn](...args);
		};
		if (!ownHooks.has(this)) {
			ownHooks.set(this, []);
		}
		ownHooks.get(this).push(hook);
		hooksVersion++;
		return this;
	}

	constructor() {
		if (this.initialize) {
			throw new Error(`${this.constructor.name}: initialize() is not called in Leaflet 2. ` +
				'Rename it to constructor() and call super() at its start.');
		}

		Util.setOptions(this);

		this._initHooksLeft = getHookPlan(this.constructor).runners;
		this.callInitHooks();
	}

	// @method callInitHooks()
	// Called at the end of the constructor of every class with `static initHooks = true`. The last of these
	// calls, from the deepest such class, runs all hooks of the chain once, so they see a fully built instance.
	callInitHooks() {
		if (--this._initHooksLeft === 0) {
			for (const hook of getHookPlan(this.constructor).hooks) {
				hook.call(this);
			}
		}
	}
}

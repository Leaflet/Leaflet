import * as Util from './Util';

// @class Class
// @aka L.Class

// @section

// Thanks to John Resig and Dean Edwards for inspiration!

export class Class {
	_initHooksCalled = false;

	constructor(...args) {
		Util.setOptions(this);

		// call the constructor
		if (this.initialize) {
			this.initialize(...args);
		}

		// call all constructor hooks
		this.callInitHooks();
	}

	callInitHooks() {
		if (this._initHooksCalled) { return; }

		// collect all prototypes in chain
		const protos = [];
		let proto = Object.getPrototypeOf(this);

		while (proto !== null) {
			protos.push(proto);
			proto = Object.getPrototypeOf(proto);
		}

		// reverse so the parent prototype is first
		protos.reverse();

		// call init hooks on each prototype
		for (const proto of protos) {
			const initHooks = proto._initHooks ?? [];
			for (const hook of initHooks) { hook.call(this); }
		}

		this._initHooksCalled = true;
	}

	// @function extend(props: Object): Function
	// [Extends the current class](#class-inheritance) given the properties to be included.
	// Returns a Javascript function that is a class constructor (to be called with `new`).
	static extend({statics, includes, ...props}) {
		const NewClass = class extends this {};

		// hook up the static properties
		Object.setPrototypeOf(NewClass, this);

		// mix static properties into the class
		if (statics) {
			Util.extend(NewClass, statics);
		}

		const proto = NewClass.prototype;

		// mix includes into the prototype
		if (includes) {
			Util.extend.apply(null, [proto].concat(includes));
		}

		// mix given properties into the prototype
		Util.extend(proto, props);

		// merge options
		if (proto.options) {
			proto.options = Object.create(this.prototype.options ?? {});
			Util.extend(proto.options, props.options);
		}

		proto._initHooks = [];

		return NewClass;
	}

	// @function include(properties: Object): this
	// [Includes a mixin](#class-includes) into the current class.
	static include(props) {
		const parentOptions = this.prototype.options;
		Util.extend(this.prototype, props);
		if (props.options) {
			this.prototype.options = parentOptions;
			this.mergeOptions(props.options);
		}
		return this;
	}

	// @function mergeOptions(options: Object): this
	// [Merges `options`](#class-options) into the defaults of the class.
	static mergeOptions(options) {
		Util.extend(this.prototype.options, options);
		return this;
	}


	// @function addInitHook(fn: Function): this
	// Adds a [constructor hook](#class-constructor-hooks) to the class.
	static addInitHook(fn, ...args) { // (Function) || (String, args...)
		const init = typeof fn === 'function' ? fn : function () {
			this[fn](...args);
		};

		this.prototype._initHooks ??= [];
		this.prototype._initHooks.push(init);
		return this;
	}
}

export class Class {
	constructor() {
		// Call custom constructor. Doesnt propergate through parents.
		if (this.initialize) {
			this.initialize(...arguments);
		}
		// Call regesterted init hooks
		this.callInitHooks();
	}

	// Helper to get prototype of current instance for loookups in Map
	get _getProto() {
		return this.prototype || this.__proto__;
	}

	// New getter for default options of class
	get _defaultOptions() {
		return {
			...(this._getProto._defaultOptions) || {},
			...(this.__options)
		};
	}

	// options of instance
	get options() {
		if (!this._options) { this._options = this._defaultOptions; }

		return this._options;
	}

	set options(value) {
		this._options = value;
	}

	// @function mergeOptions(options: Object): this
	// [Merges `options`](#class-options) into the defaults of the class.
	static mergeOptions(option) {
		this.prototype.__options = {...(this.prototype.__options || {}), ...option};
		return this;
	}

	// @function include(properties: Object): this
	// [Includes a mixin](#class-includes) into the current class.
	static include(props) {
		checkDeprecatedMixinEvents(props);

		applyMixin(this, props);
		return this;
	}

	// @function extend(props: Object): Function
	// [Extends the current class](#class-inheritance) given the properties to be included.
	// Returns a Javascript function that is a class constructor (to be called with `new`).
	static extend(props) {
		return extendClass(this, props);
	}

	// @function addInitHook(fn: Function): this
	// Adds a [constructor hook](#class-constructor-hooks) to the class.
	static addInitHook(hook, ...args) {
		let fn = hook;
		if (typeof hook === 'string') {
			fn = function () {
				this[hook].apply(this, args);
			};
		}

		if (typeof fn !== 'function') { return; }

		if (!this.prototype._initHooks) { this.prototype._initHooks = []; }

		this.prototype._initHooks.push(fn);
		return this;
	}


	callInitHooks() {
		if (this._initHooksCalled) { return; }
		this._initHooksCalled = true;

		for (var i = 0; i < this._initHooks.length; i++) {
			this._initHooks[i].call(this);
		}
	}
}

function applyMixin(Class, props) {
	for (const prop in props) {
		if (Object.hasOwnProperty.call(props, prop)) {
			const member = props[prop];
			Class.prototype[prop] = member;
		}
	}
}

function extendClass(Class, props) {
	class NewClass extends Class { }

	if ('statics' in props) {

		for (const stat in props.statics) {
			if (Object.hasOwnProperty.call(props.statics, stat)) {
				NewClass[stat] = props.statics[stat];
			}
		}

		delete props.statics;
	}

	if ('options' in props) {
		NewClass.mergeOptions(props.options);
		delete props.options;
	}

	if ('includes' in props) {
		if (!Array.isArray(props.includes)) {
			props.includes = [props.includes];
		}

		for (let i = 0; i < props.includes.length; i++) {
			const mixin = props.includes[i];

			NewClass.include(mixin);
		}
		delete props.includes;
	}

	applyMixin(NewClass, props);

	return NewClass;
}


function checkDeprecatedMixinEvents(includes) {
	if (typeof L === 'undefined' || !L || !L.Mixin) { return; }

	if (includes === L.Mixin.Events) {
		console.warn('Deprecated include of L.Mixin.Events: ' +
			'this property will be removed in future releases, ' +
			'please inherit from L.Evented instead.', new Error().stack);
	}
}

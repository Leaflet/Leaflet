const initHooks = new WeakMap()
const options = new WeakMap()

export class Class {
	constructor() {
		// Call custom constructor. Doesnt propergate through parents.
		if (this.initialize) {
			this.initialize(...arguments);
		}
		// Call regesterted init hooks
		this.callInitHooks()
	}

	// Helper to get prototype of current instance for loookups in Map
	get _getProto() {
		return this.prototype || this.__proto__
	}

	// getter for initHooks
	// BRAKING-CHANGE: Has no setter.
	get _initHooks() {
		return [...(this._getProto._initHooks || []), ...(initHooks.has(this._getProto) ? initHooks.get(this._getProto) : [])]
	}

	// New getter for default options of class
	get _defaultOptions() {
		return {
			...(this._getProto._defaultOptions) || {},
			...(options.has(this._getProto) ? options.get(this._getProto) : {})
		}
	}

	// options of instance
	get options() {
		if (!this._options) { this._options = this._defaultOptions }

		return this._options
	}

	set options(value) {
		this._options = value
	}

	static mergeOptions(option) {
		if (!options.has(this.prototype)) options.set(this.prototype, {})

		options.set(this.prototype, { ...options.get(this.prototype), ...option })
		return this;
	}

	static addInitHook(hook, ...args) {
		let fn = hook
		if (typeof hook === 'string') {
			fn = function () {
				this[hook].apply(this, args);
			}
		}

		if (typeof fn !== 'function') return

		if (!initHooks.has(this.prototype)) initHooks.set(this.prototype, [])

		initHooks.get(this.prototype).push(fn)
		return this;
	}

	static include(props) {
		applyMixin(this, props)
		return this;
	}

	static extend(props) {
		return extendClass(this, props)
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
	// var members = [];

	for (const prop in props) {
		if (Object.hasOwnProperty.call(props, prop)) {
			const member = props[prop];

			// if (typeof member === 'function') {
				Class.prototype[prop] = member;
			// } else {
			// 	members.push(prop);
			// }
		}
	}

	// WIP better members...
	// if (members.length === 0) return

	// // DONT USE ARROW FUNCTION HERE THIS CONTEXT IS IMPORTANT!
	// Class.prototype._setupMembers = function () {
	// 	this._getProto._setupMembers && this._getProto._setupMembers()
	// 	members.forEach((prop) => {
	// 		console.log(this, prop, props[prop])
	// 		this[prop] = props[prop];
	// 	});
	// }
}

function extendClass(Class, props) {
	class NewClass extends Class { }

	if ('statics' in props) {

		for (const stat in props.statics) {
			if (Object.hasOwnProperty.call(props.statics, stat)) {
				NewClass[stat] = props.statics[stat]
			}
		}

		delete props.statics
	}

	if ('options' in props) {
		NewClass.mergeOptions(props.options)
		delete props.options
	}

	if ('includes' in props) {
		if (!Array.isArray(props.includes)) {
			props.includes = [props.includes]
		}

		for (let i = 0; i < props.includes.length; i++) {
			const mixin = props.includes[i];

			NewClass.include(mixin)
		}
		delete props.includes
	}

	applyMixin(NewClass, props);

	return NewClass
}

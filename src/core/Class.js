import * as Util from './Util.js';

// @class Class

// @section
// @uninheritable

// Thanks to John Resig and Dean Edwards for inspiration!

export class Class {
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

	constructor(...args) {
		Util.setOptions(this);

		// call the constructor
		if (this.initialize) {
			this.initialize(...args);
		}
	}
}

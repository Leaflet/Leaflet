import {Class} from './Class';

var _DictionarySparse = Class.extend({
	initialize: function () {
		this.map = {};
		this.ordering = [];
		this.size = 0;
	},

	get: function (key) {
		return this.map[key];
	},

	set: function (key, value) {
		if (!this.map[key]) {
			this.map[key] = value;
			this.size = this.ordering.push(key);
		}
	},

	delete: function (key) {
		delete this.map[key];
		var indexToRemove = this.ordering.indexOf(key);
		this.ordering.splice(indexToRemove, 1);
		this.size = this.ordering.length;
	},

	forEach: function (delegate, ctx) {

		if (!ctx) {
			ctx = this;
		}

		this.ordering.forEach(function (e) {
			var element = this.map[e];
			delegate.call(ctx, element);
		}, this);

	},

	getValuesAsArray: function () {
		var values = [];
		this.ordering.forEach(function (k) {
			values.push(this.map[k]);
		}, this);
		return values;
	}


});



// Check if map gets implemented nativly (ecma6 implementation)
// otherwise use slower onw implementation
export function Dictionary() {
	if (window.Map && window.Map.prototype.values) {
		var map = new Map();

		// Add own getValuesAsArray function
		map.__proto__.getValuesAsArray = function () {
			return Array.from(this.values());
		};

		return map;
	} else {
		return new _DictionarySparse();
	}
}

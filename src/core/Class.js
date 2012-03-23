/*
 * Class powers the OOP facilities of the library. Thanks to John Resig and Dean Edwards for inspiration!
 */

L.Class = function () {};

L.Class.extend = function (/*Object*/ props) /*-> Class*/ {

	// extended class with the new prototype
	var NewClass = function () {
		if (this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};

	// instantiate class without calling constructor
	var F = function () {};
	F.prototype = this.prototype;

	var proto = new F();
	proto.constructor = NewClass;

	NewClass.prototype = proto;

	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i !== 'prototype') {
			NewClass[i] = this[i];
		}
	}

	// mix static properties into the class
	if (props.statics) {
		L.Util.extend(NewClass, props.statics);
		delete props.statics;
	}

	// mix includes into the prototype
	if (props.includes) {
		L.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// merge options
	if (props.options && proto.options) {
		props.options = L.Util.extend({}, proto.options, props.options);
	}

	// mix given properties into the prototype
	L.Util.extend(proto, props);

	return NewClass;
};


// method for adding properties to prototype
L.Class.include = function (props) {
	L.Util.extend(this.prototype, props);
};

L.Class.mergeOptions = function (options) {
	L.Util.extend(this.prototype.options, options);
};
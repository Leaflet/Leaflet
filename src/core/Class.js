/*
 * Class powers the OOP facilities of the library. Thanks to John Resig and Dean Edwards for inspiration!
 */

L.Class = function() {}; 

L.Class.extend = function(/*Object*/ props) /*-> Class*/ {
	
	// extended class with the new prototype
	var NewClass = function() {
		if (!L.Class._prototyping && this.initialize) {
			this.initialize.apply(this, arguments);
		}
	};

	// instantiate class without calling constructor
	L.Class._prototyping = true;
	var proto = new this();
	L.Class._prototyping = false;

	proto.constructor = NewClass;
	NewClass.prototype = proto;
	
	// add superclass access
	proto.superclass = this.prototype;
	
	// add class name
	//proto.className = props;
	
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
	
	// allow inheriting further
	NewClass.extend = arguments.callee;
	
	// method for adding properties to prototype
	NewClass.include = function(props) {
		L.Util.extend(this.prototype, props);
	};
	
	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i != 'prototype') {
			NewClass[i] = this[i];
		}
	}
	
	return NewClass;
};
/*
 * Class powers the OOP facilities of the library.
 */

L.Class = function() {}; 

L.Class.extend = function(props) {
	var _super = this.prototype, statics;
	
	// instantiate class without calling constructor
	L.Class._prototyping = true;
	var proto = new this();
	L.Class._prototyping = false;
	
	// mix includes into the prototype
	if (props.includes) {
		L.Util.extend.apply(null, [proto].concat(props.includes));
		delete props.includes;
	}

	// callParent method
	if (this != L.Class) {
		proto.callParent = function(fnName) {
			_super[fnName].apply(this, Array.prototype.slice.call(arguments, 1));
		};
	}
	
	// save static properties
	if (props.statics) {
		statics = props.statics;
		delete props.statics;
	}
	
	// mix given properties into the prototype
	L.Util.extend(proto, props);
	
	// extended class with the new prototype
	function NewClass() {
		if (!L.Class._prototyping && this.initialize) {
			this.initialize.apply(this, arguments);
		}
	}
	proto.constructor = NewClass;
	NewClass.prototype = proto;
	
	NewClass.extend = arguments.callee;
	
	// method for adding properties to prototype
	NewClass.include = function(props) {
		L.Util.extend(this.prototype, props);
	};
	
	// mix static properties into the class
	if (statics) {
		L.Util.extend(NewClass, statics);
	}
	
	//inherit parent's statics
	for (var i in this) {
		if (this.hasOwnProperty(i) && i != 'prototype') {
			NewClass[i] = this[i];
		}
	}
	
	return NewClass;
};
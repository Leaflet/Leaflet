import {Server} from './Server';

import {GeoJSON} from './layer';

import {Polygon} from './vector/Polygon';

const PoligonosAppDemoClass = L.Class.extend({

	// A property with initial value = 42
	myDemoProperty: (typeof Polygon[])require('./polygons.geojson'),

	// A method
	myDemoMethod: function() {

		// const s = new Server();

		// ui

		return this.myDemoProperty;
	}

});

const PoligonosAppDemoInstance = new PoligonosAppDemoClass();

// This will output "42" to the development console
console.log( PoligonosAppDemoInstance.myDemoMethod() );

// include

PoligonosAppDemoClass.include({

	// Adding a new property to the class
	_myPrivateProperty: 78,

	// Redefining a method
	myDemoMethod: function() { return this._myPrivateProperty; }

});

const poligonosAppSecondDemoInstance = new PoligonosAppDemoClass();

// This will output "78"
console.log( poligonosAppSecondDemoInstance.myDemoMethod() );

// However, properties and methods from before still exist
// This will output "42"
console.log( poligonosAppSecondDemoInstance.myDemoProperty );

// initialize
const MyBoxClass = L.Class.extend({

	options: {
		width: 1,
		height: 1
	},

	initialize: function(name, options) {
		this.name = name;
		L.setOptions(this, options);
	}

});

function instanceRed(){
	const instance = new MyBoxClass('Red', {width: 10});

	console.log(instance.name); // Outputs "Red"
	console.log(instance.options.width); // Outputs "10"
	console.log(instance.options.height); // Outputs "1", the default
}

// initialize cube
const MyCubeClass = MyBoxClass.extend({
	options: {
		depth: 1
	}
});

function instanceBlue(){
	const instance = new MyCubeClass('Blue');

	console.log(instance.options.width); // Outputs "1", parent class default
	console.log(instance.options.height); // Outputs "1", parent class default
	console.log(instance.options.depth); // Outputs "1"
}

// initialize hook
MyBoxClass.addInitHook(function(){
	this._area = this.options.width * this.options.length;
});

// initialize include
MyCubeClass.include({
	_calculateVolume: function(arg1, arg2) {
		this._volume = this.options.width * this.options.length * this.options.depth;
	}
});

MyCubeClass.addInitHook('_calculateVolume', argValue1, argValue2);

// initialize parent class
L.FeatureGroup = L.LayerGroup.extend({

	addLayer: function (layer) {
        L.LayerGroup.prototype.addLayer.call(this, layer);
	},

	removeLayer: function (layer) {
        L.LayerGroup.prototype.removeLayer.call(this, layer);
	},
});

// initialize factories
function myBoxClass(name, options) {
	return new MyBoxClass(name, options);
}



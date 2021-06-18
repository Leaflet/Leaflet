const PoligonosAppDemoClass = L.Class.extend({

	// A property with initial value = 42
	myDemoProperty: require('./polygons.geojson'),

	// A method
	myDemoMethod: function() { return this.myDemoProperty; }

});

const PoligonosAppDemoInstance = new PoligonosAppDemoClass();

// This will output "42" to the development console
console.log( PoligonosAppDemoInstance.myDemoMethod() );

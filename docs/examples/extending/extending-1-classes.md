---
layout: tutorial_v2
title: Extending Leaflet, Class Theory
---

## Extending Leaflet

Leaflet has literally hundreds of plugins. These expand the capabilities of Leaflet: sometimes in a generic way, sometimes in a very use-case-specific way.

Part of the reason there are so many plugins is that Leaflet is easy to extend. This tutorial will cover the most commonly used ways of doing so.

Please note that this tutorial assumes you have a good grasp of:

* [JavaScript](https://developer.mozilla.org/en-US/Learn/JavaScript)
* [DOM handling](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction)
* [Object-oriented programming](https://en.wikipedia.org/wiki/Object-oriented_programming) (understanding concepts like classes, instances, inheritance, methods and properties)


## Leaflet architecture

Let's have a look at a simplified UML Class diagram for Leaflet 1.0.0. There are more than 60 JavaScript classes, so the diagram is a bit big. Luckily we can make a zoomable image with a `L.ImageOverlay`:

{% include frame.html url="class-diagram.html" %}


From a technical point of view, Leaflet can be extended in different ways:

* The most common: creating a new subclass of `L.Layer`, `L.Handler` or `L.Control`, with `L.Class.extend()`
	* Layers move when the map is moved/zoomed
	* Handlers are invisible and interpret browser events
	* Controls are fixed interface elements
* Including more functionality in an existing class with `L.Class.include()`
	* Adding new methods and options
	* Changing some methods
	* Using `addInitHook` to run extra constructor code.
* Changing parts of an existing class (replacing how a class method works) with `L.Class.include()`.

This tutorial covers some classes and methods available only in Leaflet 1.0.0. Use caution if you are developing a plugin for a previous version.

## `L.Class`

JavaScript is a bit of a weird language. It's not really an object-oriented language, but rather a [prototype-oriented language](https://en.wikipedia.org/wiki/Prototype-based_programming). This has made JavaScript historically difficult to use class inheritance in the classic OOP meaning of the term.

Leaflet works around this by having `L.Class`, which eases up class inheritance.

Even though modern JavaScript can use ES6 classes, Leaflet is not designed around them.

### `L.Class.extend()`

In order to create a subclass of anything in Leaflet, use the `.extend()` method. This accepts one parameter: a plain object with key-value pairs, each key being the name of a property or method, and each value being the initial value of a property, or the implementation of a method:

    var MyDemoClass = L.Class.extend({
    
        // A property with initial value = 42
        myDemoProperty: 42,   
    
        // A method 
        myDemoMethod: function() { return this.myDemoProperty; }
        
    });

    var myDemoInstance = new MyDemoClass();
    
    // This will output "42" to the development console
    console.log( myDemoInstance.myDemoMethod() );   

When naming classes, methods and properties, adhere to the following conventions:
    
* Function, method, property and factory names should be in [`lowerCamelCase`](https://en.wikipedia.org/wiki/CamelCase).
* Class names should be in [`UpperCamelCase`](https://en.wikipedia.org/wiki/CamelCase).
* Private properties and methods start with an underscore (`_`). This doesn't make them private, just recommends developers not to use them directly.

### `L.Class.include()`    
    
If a class is already defined, existing properties/methods can be redefined, or new ones can be added by using `.include()`:

    MyDemoClass.include({
    
        // Adding a new property to the class
        _myPrivateProperty: 78,
        
        // Redefining a method
        myDemoMethod: function() { return this._myPrivateProperty; }
    
    });

    var mySecondDemoInstance = new MyDemoClass();
    
    // This will output "78"
    console.log( mySecondDemoInstance.myDemoMethod() );
    
    // However, properties and methods from before still exist
    // This will output "42"
    console.log( mySecondDemoInstance.myDemoProperty );

### `L.Class.initialize()`
    
In OOP, classes have a constructor method. In Leaflet's `L.Class`, the constructor method is always named `initialize`.

If your class has some specific `options`, it's a good idea to initialize them with `L.setOptions()` in the constructor. This utility function will merge the provided options with the default options of the class.


    var MyBoxClass = L.Class.extend({
    
        options: {
            width: 1,
            height: 1
        },
    
        initialize: function(name, options) {
            this.name = name;
            L.setOptions(this, options);
        }
        
    });
    
    var instance = new MyBoxClass('Red', {width: 10});

    console.log(instance.name); // Outputs "Red"
    console.log(instance.options.width); // Outputs "10"
    console.log(instance.options.height); // Outputs "1", the default
    
Leaflet handles the `options` property in a special way: options available for a parent class will be inherited by a children class:.

    var MyCubeClass = MyBoxClass.extend({
        options: {
            depth: 1
        }
    });
    
    var instance = new MyCubeClass('Blue');
    
    console.log(instance.options.width);
    console.log(instance.options.height);
    console.log(instance.options.depth);


It's quite common for child classes to run the parent's constructor, and then their own constructor. In Leaflet this is achieved using `L.Class.addInitHook()`. This method can be used to "hook" initialization functions that run right after the class' `initialize()`, for example:

    MyBoxClass.addInitHook(function(){
        this._area = this.options.width * this.options.length;
    });

That will run after `initialize()` is called (which calls `setOptions()`). This means that `this.options` exist and is valid when the init hook runs.

`addInitHook` has an alternate syntax, which uses method names and can fill method arguments in:

    MyCubeClass.include({
        _calculateVolume: function(arg1, arg2) {
            this._volume = this.options.width * this.options.length * this.options.depth;
        }
    });
    
    MyCubeClass.addInitHook('_calculateVolume', argValue1, argValue2);
    

### Methods of the parent class

Calling a method of a parent class is achieved by reaching into the prototype of the parent class and using [`Function.call(…)`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function/call). This can be seen, for example, in the code for `L.FeatureGroup`:

    L.FeatureGroup = L.LayerGroup.extend({
    
        addLayer: function (layer) {
            …
            L.LayerGroup.prototype.addLayer.call(this, layer);
        },
        
        removeLayer: function (layer) {
            …
            L.LayerGroup.prototype.removeLayer.call(this, layer);
        },
    
        …
    });

Calling the parent's constructor is done in a similar way, but using `ParentClass.prototype.initialize.call(this, …)` instead.
    
    
### Factories    

Most Leaflet classes have a corresponding [factory function](https://en.wikipedia.org/wiki/Factory_%28object-oriented_programming%29). A factory function has the same name as the class, but in `lowerCamelCase` instead of `UpperCamelCase`:
    
    function myBoxClass(name, options) {
        return new MyBoxClass(name, options);
    }
    
    
### Naming conventions

When naming classes for Leaflet plugins, please adhere to the following naming conventions:

* Never expose global variables in your plugin.
* If you have a new class, put it directly in the `L` namespace (`L.MyPlugin`).
* If you inherit one of the existing classes, make it a sub-property (`L.TileLayer.Banana`).



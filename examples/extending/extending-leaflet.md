---
layout: tutorial_v2
title: Extending Leaflet
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
	* Using ``
* Changing parts of an existing class (replacing how a class method works)

This tutorial covers some classes and methods available only in Leaflet 1.0.0. Use caution if you are developing a plugin for a previous version.

## `L.Class`

JavaScript is a bit of a weird language. It's not really an object-oriented language, but rather a [prototype-oriented language](https://en.wikipedia.org/wiki/Prototype-based_programming). This has made JavaScript historically difficult to use class inheritance in the classic OOP meaning of the term.

Leaflet works around this by having `L.Class`, which eases up class inheritance.

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



## "Extension methods"

A few of the Leaflet classes have so-called "extension methods": entry points for writing code for sub-classes.

One of them is `L.TileLayer.getTileUrl()`. This method is called internally by `L.TileLayer` whenever a new tile needs to know which image to load. By making a subclass of `L.TileLayer` and rewriting its `getTileUrl()` function, we can create custom behaviour.

Let's illustrate with a custom `L.TileLayer` that will display random kitten images from [PlaceKitten]():

    L.TileLayer.Kitten = L.TileLayer.extend({
        getTileUrl: function(coords) {
            var i = Math.ceil( Math.random() * 4 );
            return "http://placekitten.com/256/256?image=" + i;
        },
        getAttribution: function() {
            return "<a href='http://placekitten.com/attribution.html'>PlaceKitten</a>"
        }
    });

    L.tileLayer.kitten = function() {
        return new L.TileLayer.Kitten();
    }
    
    L.tileLayer.kitten().addTo(map);

{% include frame.html url="kittenlayer.html" %}

Normally, `getTileLayer()` receives the tile coordinates (as `coords.x`, `coords.y` and `coords.z`) and generates a tile URL from them. In our example, we ignore those and simply use a random number to get a different kitten every time.

### `L.GridLayer` and DOM elements

Another extension method is `L.GridLayer.createTile()`. Where `L.TileLayer` assumes that there is a grid of images (as `<img>` elements), `L.GridLayer` doesn't assume that - it allows creating grids of any kind of [HTML Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element).

`L.GridLayer` allows creating grids of `<img>`s, but grids of [`<div>`s](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), [`<canvas>`es](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) or [`<picture>`s](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) (or anything) are possible. `createTile()` just has to return an instance of [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) given the tile coordinates. Knowing how to manipulate elements in the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) is important here: Leaflet expects instances of `HTMLElement`, so elements created with libraries like jQuery will be problematic.

An example of a custom `GridLayer` is showing the tile coordinates in a `<div>`. This is particularly useful when debugging the internals of Leaflet, and for understanding how the tile coordinates work:

	L.GridLayer.DebugCoords = L.GridLayer.extend({
		createTile: function (coords) {
			var tile = document.createElement('div');
			tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
			tile.style.outline = '1px solid red';
			return tile;
		}
	});
	
	L.gridLayer.debugCoords = function(opts) {
		return new L.GridLayer.DebugCoords(opts);
	};
	
	map.addLayer( L.gridLayer.debugCoords() );


If the element has to do some asynchronous initialization, then use the second function parameter `done` and call it back when the tile is ready (for example, when an image has been fully loaded) or when there is an error. In here, we'll just delay the tiles artificially:

	createTile: function (coords, done) {
		var tile = document.createElement('div');
		tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
		tile.style.outline = '1px solid red';
		
		setTimeout(function () {
			done(null, tile);	// Syntax is 'done(error, tile)'
		}, 500 + Math.random() * 1500);
		
		return tile;
	}

{% include frame.html url="gridcoords.html" %}

With these custom `GridLayer`s, a plugin can have full control of the HTML elements that make up the grid. A few plugins already use `<canvas>`es in this way to do advanced rendering.

A very basic `<canvas>` `GridLayer` looks like:

	L.GridLayer.CanvasCircles = L.GridLayer.extend({
		createTile: function (coords) {
			var tile = document.createElement('canvas');
			
			var tileSize = this.getTileSize();
			tile.setAttribute('width', tileSize.x);
			tile.setAttribute('height', tileSize.y);
			
			var ctx = tile.getContext('2d');
			
			// Draw whatever is needed in the canvas context
			// For example, circles which get bigger as we zoom in
			ctx.beginPath();
			ctx.arc(tileSize.x/2, tileSize.x/2, 4 + coords.z*4, 0, 2*Math.PI, false);
			ctx.fill();
			
			return tile;
		}
	});

{% include frame.html url="canvascircles.html" %}


### The pixel origin

Creating custom `L.Layer`s is possible, but needs a deeper knowledge of how Leaflet positions HTML elements. The abridged version is:

* The `L.Map` container has "map panes", which are `<div>`s.
* `L.Layer`s are HTML elements inside a map pane
* The map transforms all `LatLng`s to coordinates in the map's CRS, and from that into absolute "pixel coordinates" (the origin of the CRS is the same as the origin of the pixel coordinates)
* When the `L.Map` is ready (has a center `LatLng` and a zoom level), the absolute pixel coordinates of the top-left corner become the "pixel origin"
* Each `L.Layer` is offset from its map pane according to the pixel origin and the absolute pixel coordinates of the layer's `LatLng`s
* The pixel origin is reset after each `zoomend` or `viewreset` event on the `L.Map`, and every `L.Layer` has to recalculate its position (if needed)
* The pixel origin is *not* reset when panning the map around; instead, the whole panes are repositioned.

This might be a bit overwhelming, so consider the following explanatory map:

{% include frame.html url="pixelorigin.html" %}

The CRS origin (green) stays in the same `LatLng`. The pixel origin (red) always starts at the top-left corner. The pixel origin moves around when the map is panned (map panes are repositioned relative to the map's container), and stays in the same place in the screen when zooming (map panes are *not* repositioned, but layers might redraw themselves). The absolute pixel coordinate to the pixel origin is updated when zooming, but is not updated when panning. Note how the absolute pixel coordinates (the distance to the green bracket) double every time the map is zoomed in.

To position anything (for example, a blue `L.Marker`), its `LatLng` is converted to an absolute pixel coordinate inside the map's `L.CRS`. Then the absolute pixel coordinate of the pixel origin is subtracted from its absolute pixel coordinate, giving an offset relative to the pixel origin (light blue). As the pixel origin is the top-left corner of all map panes, this offset can be applied to the HTML element of the marker's icon. The marker's `iconAnchor` (dark blue line) is achieved via negative CSS margins.

The `L.Map.project()` and `L.Map.unproject()` methods operate with these absolute pixel coordinates. Likewise, `L.Map.latLngToLayerPoint()` and `L.Map.layerPointToLatLng()` work with the offset relative to the pixel origin.

Different layers apply these calculations in different ways. `L.Marker`s simply reposition their icons; `L.GridLayer`s calculate the bounds of the map (in absolute pixel coordinates) and then calculate the list of tile coordinates to request; vector layers (polylines, polygons, circle markers, etc) transform each `LatLng` to pixels and draw the geometries using SVG or `<canvas>`.


### `onAdd` and `onRemove`

At their core, all `L.Layer`s are HTML elements inside a map pane, their positions and contents defined by the layer's code. However, HTML elements cannot be created when a layer is instantiated; rather, this is done when the layer is added to the map - the layer doesn't know about the map (or even about the `document`) until then.

In other words: the map calls the `onAdd()` method of the layer, then the layer creates its HTML element(s) (commonly named 'container' element) and adds them to the map pane. Conversely, when the layer is removed from the map, its `onRemove()` method is called. The layer must update its contents when added to the map, and reposition them when the map view is updated. A layer skeleton looks like:

	L.CustomLayer = L.Layer.extend({
		onAdd: function(map) {
			var pane = map.getPane(this.options.pane);
			this._container = L.DomUtil.create(…);
			
			pane.appendChild(this._container);
			
			// Calculate initial position of container with `L.Map.latLngToLayerPoint()`, `getPixelOrigin()` and/or `getPixelBounds()`
			
			L.DomUtil.setPosition(this._container, point);
			
			// Add and position children elements if needed
			
			map.on('zoomend viewreset', this._update, this);
		},
		
		onRemove: function(map) {
			L.DomUtil.remote(this._container);
			map.off('zoomend viewreset', this._update, this);
		},
		
		_update: function() {
			// Recalculate position of container
			
			L.DomUtil.setPosition(this._container, point);        

			// Add/remove/reposition children elements if needed
		}
	});

How to exactly position the HTML elements for a layer depends on the specifics of the layer, but this introduction should help you to read Leaflet's layer code, and create new layers.



## Handlers

Map handlers are a new concept in Leaflet 1.0, and their function is to process DOM events from the browser (like `click`, `dblclick` or `mousewheel`) and change the state of the map.

Handlers are relatively simple: they just need a `addHooks()` method (which runs when the handler is enabled in a map) and a `removeHooks()`, which runs when the handler is disabled. A skeleton for handlers is:

	L.CustomHandler = L.Handler.extend({
		addHooks: function() {
			L.DomEvent.on(document, 'eventname', this._doSomething, this);
		},
	
		removeHooks: function() {
			L.DomEvent.off(document, 'eventname', this._doSomething, this);
		},
		
		_doSomething: function(event) { … }
	});

This can be illustrated with a simple handler to pan the map when a mobile device is tilted, through [`deviceorientation` events](https://developer.mozilla.org/en-US/docs/Web/API/Detecting_device_orientation):

	L.TiltHandler = L.Handler.extend({
		addHooks: function() {
			L.DomEvent.on(window, 'deviceorientation', this._tilt, this);
		},
	
		removeHooks: function() {
			L.DomEvent.off(window, 'deviceorientation', this._tilt, this);
		},
		
		_tilt: function(ev) {
			// Treat Gamma angle as horizontal pan (1 degree = 1 pixel) and Beta angle as vertical pan
			this._map.panBy( L.point( ev.gamma, ev.beta ) );
		}
	});

The handler can be attached to the map using `map.addHandler('tilt', L.TiltHandler)` - this will store an instance of `L.TiltHandler` as `map.tilt`. However, it's more usual to attach handlers to all maps with the `addInitHook` syntax:

	L.Map.addInitHook('addHandler', 'tilt', L.TiltHandler);

Our handler can now be enabled by running `map.tilt.enable()` and disabled by `map.tilt.disable()`
	
Moreover, if the map has a property named the same as the handler, then that handler will be enabled by default if that options is `true`, so this will enable our handler by default:

	var map = L.map('mapDiv', { tilt: true });

To see this example, you'll need a mobile browser which [supports the `deviceorientation` event](http://caniuse.com/#search=deviceorientation) - and even so, this event is particularly flaky and ill-specified, so beware.

{% include frame.html url="tilt.html" %}

Depending on the type of event, a map handler can attach event listeners to the `document`, the `window`, or the `L.Map` it's attached to.

## Controls

You already know controls - the zoom control in the top left corner, the scale at the bottom right, the layer switcher at the top right. At their core, a `L.Control` is a HTML Element which is at a static position in the map container.

To make a control, simply inherit from `L.Control` and implement `onAdd()` and `onRemove()`. These methods work in a similar way to their `L.Layer` counterparts (they run whenever the control is added to or removed from the map), except that `onAdd()` must return the instance of `HTMLElement` that represents the control - adding it to the map is done automatically, and so it's removing it.

The most simple example of a custom control would be a watermark, which is just an image:

	L.Control.Watermark = L.Control.extend({
		onAdd: function(map) {
			var img = L.DomUtil.create('img');
			
			img.src = '../../docs/images/logo.png';
			img.style.width = '200px';
			
			return img;
		},
		
		onRemove: function(map) {
			// Nothing to do here
		}
	});

	L.control.watermark = function(opts) {
		return new L.Control.Watermark(opts);
	}
	
	L.control.watermark({ position: 'bottomleft' }).addTo(map);

{% include frame.html url="watermark.html" %}

If you custom control has interactive elements such as clickable buttons, remember to use `L.DomEvent.on()` inside `onAdd()` and `L.DomEvent.off()` inside `onRemove()`.

If your custom control consists of more than one HTML element (like `L.Control.Zoom`, which has two buttons), you'll have to create the whole hierarchy of elements and return the topmost container.

## Publishing your plugin

If you have understood everything so far, you're ready to make som Leaflet plugins! But make sure to read the [`PLUGIN-GUIDE.md` file](https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md), as it contains some tips and good practices about naming and publishing your plugin.

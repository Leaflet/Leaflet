---
layout: tutorial_v2
title: Extending Leaflet, Class Theory
---

## Extending Leaflet

Leaflet has literally hundreds of plugins. These expand the capabilities of Leaflet: sometimes in a generic way, sometimes in a very use-case-specific way. Part of the reason there are so many plugins is that Leaflet is easy to extend. This tutorial will cover the most commonly used ways of doing so.

Please note that this tutorial assumes you have a good grasp of [JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting), and especially [JavaScript classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_classes).

## Leaflet architecture

Let's have a look at a simplified UML Class diagram for Leaflet. There are more than 60 classes, so the diagram is a bit big. Luckily we can make a zoomable image with an `ImageOverlay`:

{% include frame.html url="class-diagram.html" height=640 %}

From a technical point of view, Leaflet can be extended in different ways:

* The most common: creating a new subclass of `Layer`, `Handler` or `Control`.
	* Layers move when the map is moved/zoomed
	* Handlers are invisible and interpret browser events
	* Controls are fixed interface elements
* Including more, or replacing functionality (methods, fields) of an existing class with `Class.include()`
* Using `Class.addInitHook()` to run additional constructor code.

## Extending Leaflet Classes

Leaflet classes are plain [JavaScript classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes). Almost all of them, as well as most classes you'll find in plugins, extend from a base class called `Class`. It adds what plugins need on top of standard classes: default options, mixins and constructor hooks.

### Creating a subclass

`Class`, or other built-in Leaflet classes derived from it (such as `Layer`, `Handler`, `Control`, etc.), can be extended in the same manner as any other JavaScript class, by using the [`extends`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) keyword. Put the setup code in [`constructor()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor), after calling `super()`:

```js
class RotateMarker extends Marker {
	constructor(latlng, rotation, options) {
		super(latlng, options);
		this._rotation = rotation;
	}
}
```

Leaflet 1.x classes used a special `initialize()` method instead. Leaflet 2.0 doesn't call it, and constructing a class that still has one throws an error.

### Naming conventions

When creating Leaflet classes, adhere to these conventions:

* Class names should be in `UpperCamelCase`.
* Method and property names should be in `lowerCamelCase`.
* Private properties and methods start with an underscore (`_`). This indicates they're internal and shouldn't be used directly.

### Setting default options

All classes that extend from `Class` can be provided with default options in a static `defaultOptions` field. `Util.setOptions()` combines the defaults with the options passed to the constructor:

```js
class MyBox extends Class {
	static defaultOptions = {
		width: 1,
		height: 1
	};

	constructor(name, options) {
		super();
		Util.setOptions(this, options);
		this.name = name;
	}
}

const instance = new MyBox('Red', {width: 10});

console.log(instance.name); // Outputs "Red"
console.log(instance.options.width); // Outputs "10"
console.log(instance.options.height); // Outputs "1", the default
```

Many Leaflet classes, such as `Marker` and `Control`, take the options as a constructor argument and call `Util.setOptions()` themselves, so for their subclasses passing the options to `super()` is enough, as in the `RotateMarker` example above.

Default options are inherited from parent classes, and merged automatically:

```js
class MyCube extends MyBox {
	static defaultOptions = {
		depth: 1
	};
}

const cube = new MyCube('Blue');

console.log(cube.options.width); // Outputs "1", parent class default
console.log(cube.options.height); // Outputs "1", parent class default
console.log(cube.options.depth); // Outputs "1"
```

To change the defaults of an existing class, for example from a plugin, use `mergeOptions()`:

```js
Marker.mergeOptions({riseOnHover: true});
```

### `Class.include()`

Leaflet provides `.include()` to add or override methods in existing classes. This is useful for monkey-patching or adding functionality to base classes:

```js
class MyLayer extends Layer {
	constructor(options) {
		super();
		Util.setOptions(this, options);
		this._count = 0;
	}

	incrementCount() {
		return ++this._count;
	}
}

// Add new methods or override existing ones
MyLayer.include({
	_getCountStep() {
		return 2;
	},

	incrementCount() {
		return this._count += this._getCountStep();
	}
});

const instance = new MyLayer();
console.log(instance.incrementCount()); // Outputs "2"
```

Note: Use `.include()` sparingly, as modifying base classes can have unexpected side effects. As a general rule of thumb, try to extend existing classes instead.

### Constructor hooks

Use `addInitHook()` to run additional code when an instance is created. This is useful for setup in classes you don't control, such as Leaflet's own classes, or a class modified with `.include()`:

```js
Polyline.addInitHook(function () {
	this._createdAt = Date.now();
});
```

Hooks added to a class also run for its subclasses. For Leaflet's own classes, they run after the constructor has finished, so a hook added to `Layer` sees a fully built `Polygon`.

For a class of your own, hooks run before the body of its constructor. If they need the state the constructor sets up, mark the class with `static initHooks = true` and end its constructor with `this.callInitHooks()`:

```js
class MyBox extends Class {
	static defaultOptions = {
		width: 1,
		height: 1
	};

	static initHooks = true;

	constructor(options) {
		super();
		Util.setOptions(this, options);
		this.callInitHooks();
	}
}

MyBox.addInitHook(function () {
	this._area = this.options.width * this.options.height;
});

MyBox.include({
	getArea() {
		return this._area;
	}
});

const box = new MyBox({width: 5, height: 10});
console.log(box.getArea()); // Outputs "50"
```

`addInitHook()` can also call a named method with arguments:

```js
class MyCube extends MyBox {
	static defaultOptions = {
		depth: 1
	};

	_calculateVolume(multiplier/*, arg2, arg3. etc. */) {
		this._volume = this.options.width * this.options.height * this.options.depth * multiplier;
	}
}

MyCube.addInitHook('_calculateVolume', 1/*, arg2, arg3. etc. */);

const cube = new MyCube({width: 2, height: 3, depth: 4});
console.log(cube._volume); // Outputs "24"
```

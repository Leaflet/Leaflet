---
layout: tutorial_v2
title: Extending Leaflet, Class Theory
---

## Extending Leaflet

Leaflet has literally hundreds of plugins. These expand the capabilities of Leaflet: sometimes in a generic way, sometimes in a very use-case-specific way. Part of the reason there are so many plugins is that Leaflet is easy to extend. This tutorial will cover the most commonly used ways of doing so.

Please note that this tutorial assumes you have a good grasp of [JavaScript](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Scripting), and especially [JavaScript classes](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_classes).

## Leaflet architecture

Let's have a look at a simplified UML Class diagram for Leaflet. There are more than 60 classes, so the diagram is a bit big. Luckily we can make a zoomable image with an `ImageOverlay`:

{% include frame.html url="class-diagram.html" %}

From a technical point of view, Leaflet can be extended in different ways:

* The most common: creating a new subclass of `Layer`, `Handler` or `Control`.
	* Layers move when the map is moved/zoomed
	* Handlers are invisible and interpret browser events
	* Controls are fixed interface elements
* Including more, or replacing functionality (methods, fields) of an existing class with `Class.include()`
* Using `Class.addInitHook()` to run additional constructor code.

## Extending Leaflet Classes

JavaScript is a bit of a weird language. It's not really object-oriented in the traditional sense, but handles inheritance using a [prototype chain](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Inheritance_and_the_prototype_chain). Only at a later point during its lifetime [syntax was added](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes) to allow more 'class-like' inheritance.

Because Leaflet was created before any standardized class syntax existed, it comes with its own implementation for classes in the form of a base class called `Class`. Almost all classes in Leaflet extend from `Class`, as well as most classes you'll find in plugins. It also contains various utility methods to further modify class behavior.

### Creating a subclass

`Class`, or other built-in Leaflet classes derived from it (such as `Layer`, `Handler`, `Control`, etc.), can be extended in the same manner as any other JavaScript class, by using the [`extends`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/extends) keyword. However, unlike regular JavaScript classes, Leaflet classes do not support the [`constructor()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/constructor) method. Instead, constructor logic should go into a special `initialize()` method to preserve backwards compatibility with older versions of Leaflet:


```js
class RotateMarker extends Marker {
	initialize(latlng, rotation, options) {
		super.initialize(latlng, options);
		this._rotation = rotation;
	}
}
```

### Naming conventions

When creating Leaflet classes, adhere to these conventions:

* Class names should be in `UpperCamelCase`.
* Method and property names should be in `lowerCamelCase`.
* Private properties and methods start with an underscore (`_`). This indicates they're internal and shouldn't be used directly.

### Setting default options

All classes that extend from `Class` can be provided with default options by calling `setDefaultOptions()` in a [static initialization block](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Classes/Static_initialization_blocks):

```js
class MyBox extends Class {
	static {
		this.setDefaultOptions({
			width: 1,
			height: 1
		});
	}

	initialize(name, options) {
		super.initialize(options);
		this.name = name;
	}
}

const instance = new MyBox('Red', {width: 10});

console.log(instance.name); // Outputs "Red"
console.log(instance.options.width); // Outputs "10"
console.log(instance.options.height); // Outputs "1", the default
```

These options are inherited from parent classes, and merged automatically:

```js
class MyCube extends MyBox {
	static {
		this.setDefaultOptions({
			depth: 1
		});
	}
}

const cube = new MyCube('Blue');

console.log(cube.options.width); // Outputs "1", parent class default
console.log(cube.options.height); // Outputs "1", parent class default
console.log(cube.options.depth); // Outputs "1"
```

### `Class.include()`

Leaflet provides `.include()` to add or override methods in existing classes. This is useful for monkey-patching or adding functionality to base classes:

```js
class MyLayer extends Layer {
	initialize(options) {
		super.initialize(options);
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

### Initialization hooks

Use `addInitHook()` to run code after `initialize()` completes. This is useful for setup that depends on state from the class being modified (e.g. using `.include()`):

```js
class MyBox extends Class {
	static {
		this.setDefaultOptions({
			width: 1,
			height: 1
		});
	}
}

MyBox.addInitHook(function() {
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
	static {
		this.setDefaultOptions({
			depth: 1
		});
	}

	_calculateVolume(multiplier/*, arg2, arg3. etc. */) {
		this._volume = this.options.width * this.options.height * this.options.depth * multiplier;
	}
}

MyCube.addInitHook('_calculateVolume', 1/*, arg2, arg3. etc. */);

const cube = new MyCube({width: 2, height: 3, depth: 4});
console.log(cube._volume); // Outputs "24"
```

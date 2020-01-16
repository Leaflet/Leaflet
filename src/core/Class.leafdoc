
@class Class
@aka L.Class

L.Class powers the OOP facilities of Leaflet and is used to create almost all of the Leaflet classes documented here.

In addition to implementing a simple classical inheritance model, it introduces several special properties for convenient code organization — options, includes and statics.


@example

```js
var MyClass = L.Class.extend({
initialize: function (greeter) {
	this.greeter = greeter;
	// class constructor
},

greet: function (name) {
	alert(this.greeter + ', ' + name)
	}
});

// create instance of MyClass, passing "Hello" to the constructor
var a = new MyClass("Hello");

// call greet method, alerting "Hello, World"
a.greet("World");
```

@section Class Factories
@example

You may have noticed that Leaflet objects are created without using
the `new` keyword. This is achieved by complementing each class with a
lowercase factory method:

```js
new L.Map('map'); // becomes:
L.map('map');
```

The factories are implemented very easily, and you can do this for your own classes:

```js
L.map = function (id, options) {
    return new L.Map(id, options);
};
```
@section Inheritance
@example

You use L.Class.extend to define new classes, but you can use the same method on any class to inherit from it:

```js
var MyChildClass = MyClass.extend({
    // ... new properties and methods
});
```

This will create a class that inherits all methods and properties of the parent class (through a proper prototype chain), adding or overriding the ones you pass to extend. It will also properly react to instanceof:

```js
var a = new MyChildClass();
a instanceof MyChildClass; // true
a instanceof MyClass; // true
```

You can call parent methods (including constructor) from corresponding child ones (as you do with super calls in other languages) by accessing parent class prototype and using JavaScript's call or apply:

```
var MyChildClass = MyClass.extend({
    initialize: function () {
        MyClass.prototype.initialize.call(this, "Yo");
    },

    greet: function (name) {
        MyClass.prototype.greet.call(this, 'bro ' + name + '!');
    }
});

var a = new MyChildClass();
a.greet('Jason'); // alerts "Yo, bro Jason!"
```

@section Options
@example

`options` is a special property that unlike other objects that you pass
to `extend` will be merged with the parent one instead of overriding it
completely, which makes managing configuration of objects and default
values convenient:

```js
var MyClass = L.Class.extend({
    options: {
        myOption1: 'foo',
        myOption2: 'bar'
    }
});

var MyChildClass = MyClass.extend({
    options: {
        myOption1: 'baz',
        myOption3: 5
    }
});

var a = new MyChildClass();
a.options.myOption1; // 'baz'
a.options.myOption2; // 'bar'
a.options.myOption3; // 5
```

There's also [`L.Util.setOptions`](#util-setoptions), a method for
conveniently merging options passed to constructor with the defaults
defines in the class:

```js
var MyClass = L.Class.extend({
    options: {
        foo: 'bar',
        bla: 5
    },

    initialize: function (options) {
        L.Util.setOptions(this, options);
        ...
    }
});

var a = new MyClass({bla: 10});
a.options; // {foo: 'bar', bla: 10}
```

Note that the options object allows any keys, not just
the options defined by the class and its base classes.
This means you can use the options object to store
application specific information, as long as you avoid
keys that are already used by the class in question.

@section Includes
@example

`includes` is a special class property that merges all specified objects into the class (such objects are called mixins).

```js
 var MyMixin = {
    foo: function () { ... },
    bar: 5
};

var MyClass = L.Class.extend({
    includes: MyMixin
});

var a = new MyClass();
a.foo();
```

You can also do such includes in runtime with the `include` method:

```js
MyClass.include(MyMixin);
```

`statics` is just a convenience property that injects specified object properties as the static properties of the class, useful for defining constants:

```js
var MyClass = L.Class.extend({
    statics: {
        FOO: 'bar',
        BLA: 5
    }
});

MyClass.FOO; // 'bar'
```


@section Constructor hooks
@example

If you're a plugin developer, you often need to add additional initialization code to existing classes (e.g. editing hooks for `L.Polyline`). Leaflet comes with a way to do it easily using the `addInitHook` method:

```js
MyClass.addInitHook(function () {
    // ... do something in constructor additionally
    // e.g. add event listeners, set custom properties etc.
});
```

You can also use the following shortcut when you just need to make one additional method call:

```js
MyClass.addInitHook('methodName', arg1, arg2, …);
```

---
layout: tutorial_v2
title: Extending Leaflet, New Handlers and Controls
---

<br>

This tutorial assumes you've read the [theory of Leaflet class inheritance](./extending-1-classes.html).

In Leaflet, a "layer" is anything that moves with the map. In contraposition to that, a "control" is a HTML element that remains static relative to the map container, and a "handler" is a piece of invisible code that changes the map's behaviour.

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

Depending on the type of event, a map handler can attach event listeners to the `document`, the `window`, or the container of the `L.Map` it's attached to.

## Controls

You already know controls - the zoom control in the top left corner, the scale at the bottom left, the layer switcher at the top right. At their core, an `L.Control` is an HTML Element that is at a static position in the map container.

To make a control, simply inherit from `L.Control` and implement `onAdd()` and `onRemove()`. These methods work in a similar way to their `L.Layer` counterparts (they run whenever the control is added to or removed from the map), except that `onAdd()` must return an instance of `HTMLElement` representing the control. Adding the element to the map is done automatically, and so is removing it.

The simplest example of a custom control would be a watermark, which is just an image:

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

If your custom control has interactive elements such as clickable buttons, remember to use `L.DomEvent.on()` inside `onAdd()` and `L.DomEvent.off()` inside `onRemove()`.

If your custom control consists of more than one HTML element (like `L.Control.Zoom`, which has two buttons), you'll have to create the whole hierarchy of elements and return the topmost container.

## Publishing your plugin

If you have understood everything so far, you're ready to make som Leaflet plugins! But make sure to read the [`PLUGIN-GUIDE.md` file](https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md), as it contains some tips and good practices about naming and publishing your plugin.

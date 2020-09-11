---
layout: tutorial_v2.1
title: Quick Start Guide
---

## Leaflet Quick Start Guide

This step-by-step guide will quickly get you started on Leaflet basics, including setting up a Leaflet map, working with markers, polylines and popups, and dealing with events.

{% include frame.html url="example.html" %}

### Preparing your page

The basics of web page development are outside of the scope of this tutorial but it is useful to understand where `leafletjs` fits. A static web page requires content, usually in [HTML](https://en.wikipedia.org/wiki/HTML) but could be XHTML, and appearance, defined using [CSS](https://en.wikipedia.org/wiki/CSS). Leaflet is a [JavaScript](https://en.wikipedia.org/wiki/JavaScript) library and JavaScript adds interactivity (behavior) to web pages which can change both HTML and CSS.

Before writing any code for the map you'll need to do these steps to prepare the page:

Create the `example.html` file in a text editor as follows:

```html
<!DOCTYPE html>
<html>
<head>
	<title>Quick Start - Leaflet</title>
</head>
<body>
	<p>Replace with Map
</body>
</html>
```

Include Leaflet CSS file in the head section of your document after the title line:

		<link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css" integrity="{{site.integrity_hash_css}}" crossorigin="" />

Include Leaflet JavaScript file **after** Leaflet's CSS:

		<!-- Make sure you put this AFTER Leaflet's CSS -->
		<script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js" integrity="{{site.integrity_hash_uglified}}" crossorigin=""></script>

Put a `div` element with a certain `id` after the `<body>` line:

		<div id="mapid"></div>

Make sure the map container has a defined height, for example by setting it in CSS, but here we'll include it in the `div` element:

		<div id="mapid" style="width: 600px; height: 400px;"></div>

Now you're ready to initialize the map and do some stuff with it.


### Setting up the map


{% include frame.html url="example-basic.html" %}

Let's create a map of the center of London with pretty Mapbox Streets tiles. First we'll initialize the map and set its view to our chosen geographical coordinates and a zoom level. Make sure all the code is called after the  `leaflet.js` and `div` inclusion. Code in the `body` is set up between `<script></script>` tags and we'll add a blank line between each block we enter so it's easier to check:

	<script>

		var mymap = L.map('mapid').setView([51.505, -0.09], 13);

	</script>

By default (as we didn't pass any options when creating the map instance), all mouse and touch interactions on the map are enabled, and it has zoom and attribution controls.

Note the `setView` call also returns the map object --- most Leaflet methods act like this when they don't return an explicit value, which allows convenient jQuery-like method chaining.

Next we'll add a tile layer to add to our map, in this case it's an OMS Streets tile layer. Creating a tile layer involves setting the [URL template](/reference.html#tilelayer-url-template) for the tile images and attribution text as a minimum.

```javascript
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
			attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
		}).addTo(mymap);
```

That's it! You have a working Leaflet map now.

It's worth noting that Leaflet is provider-agnostic, meaning that it doesn't enforce a particular choice of providers for tiles. You can try replacing `tile.osm.org` with `tile.opentopomap.org`, and see what happens. Also, Leaflet doesn't even contain a single provider-specific line of code, so you're free to use other providers if you want to.

Access also varies by provider ranging from free access, access by code after registration and paid access - see [leaflet-providers](https://github.com/leaflet-extras/leaflet-providers). Whenever using anything based on OpenStreetMap, an *attribution* is obligatory as per the [copyright notice](https://www.openstreetmap.org/copyright). Most other tile providers (such as [Mapbox](https://docs.mapbox.com/help/how-mapbox-works/attribution/), [Stamen](http://maps.stamen.com/) or [Thunderforest](https://www.thunderforest.com/terms/)) require an attribution as well. Make sure to give credit where credit is due.


### Markers, circles and polygons

{% include frame.html url="example-overlays.html" %}


Besides tile layers, you can easily add other things to your map, including markers, polylines, polygons, circles, and popups. Let's add a marker:

		var marker = L.marker([51.5, -0.09]).addTo(mymap);

Adding a circle is the same (except for specifying the radius in meters as a second argument), but lets you control how it looks by passing options as the last argument when creating the object:

		var circle = L.circle([51.508, -0.11], 500, {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5,
		}).addTo(mymap);

Adding a polygon is as easy:

		var polygon = L.polygon([
			[51.509, -0.08],
			[51.503, -0.06],
			[51.51, -0.047]
		]).addTo(mymap);


### Working with popups

{% include frame.html url="example-popups.html" %}

Popups are usually used when you want to attach some information to a particular object on a map. Leaflet has a very handy shortcut for this:

		marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
		circle.bindPopup("I am a circle.");
		polygon.bindPopup("I am a polygon.");

Try clicking on our objects. The `bindPopup` method attaches a popup with the specified HTML content to your marker so the popup appears when you click on the object, and the `openPopup` method (for markers only) immediately opens the attached popup.

You can also use popups as layers (when you need something more than attaching a popup to an object):

		var popup = L.popup()
			.setLatLng([51.5, -0.09])
			.setContent("I am a standalone popup.")
			.openOn(mymap);

Here we use `openOn` instead of `addTo` because it handles automatic closing of a previously opened popup when opening a new one which is good for usability.


### Dealing with events

Every time something happens in Leaflet, e.g. user clicks on a marker or map zoom changes, the corresponding object sends an event which you can subscribe to with a function. It allows you to react to user interaction:

		function onMapClick(e) {
			alert("You clicked the map at " + e.latlng);
		}

		mymap.on('click', onMapClick);

Each object has its own set of events --- see [documentation](/reference.html) for details. The first argument of the listener function is an event object --- it contains useful information about the event that happened. For example, map click event object (`e` in the example above) has `latlng` property which is a location at which the click occurred.

Let's improve our example by using a popup instead of an alert:

		var popup = L.popup();

		function onMapClick(e) {
			popup
				.setLatLng(e.latlng)
				.setContent("You clicked the map at " + e.latlng.toString())
				.openOn(mymap);
		}

		mymap.on('click', onMapClick);

Try clicking on the map and you will see the coordinates in a popup. View the full example &rarr;</a>

Now you've learned Leaflet basics and can start building map apps straight away! Don't forget to take a look at the detailed <a href="/reference.html">documentation</a> or <a href="../../examples.html">other examples</a>.

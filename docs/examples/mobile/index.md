---
layout: tutorial_v2
title: Leaflet on Mobile
---

## Leaflet on Mobile

In this example, you'll learn how to create a fullscreen map tuned for mobile devices like iPhone, iPad or Android phones, and how to easily detect and use the current user location.

{% include frame.html url="example.html" %}

### Preparing the page

First we'll take a look at the HTML &amp; CSS code of the page. To make our map `div` element stretch to all available space (fullscreen), we can use the following CSS code (note: In this example we use percentage for height. While vh is arguably better, due to a bug with Google Chrome on mobile.):

{: .css}
	body {
		padding: 0;
		margin: 0;
	}
	html, body, #map {
		height: 100%;
		width: 100vw;
	}

Also, we need to tell the mobile browser to disable unwanted scaling of the page and set it to its actual size by placing the following line in the `head` section or our HTML page:

	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />

### Initializing the map

We'll now initialize the map in the JavaScript code like we did in the [quick start guide](../quick-start/), showing the whole world:

<pre><code class="javascript">var map = L.map('map').fitWorld();

L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);</code></pre>

### Geolocation

Leaflet has a very handy shortcut for zooming the map view to the detected location --- `locate` method with the `setView` option, replacing the usual `setView` method in the code:

	map.locate({setView: true, maxZoom: 16});

Here we specify 16 as the maximum zoom when setting the map view automatically. As soon as the user agrees to share its location and it's detected by the browser, the map will set the view to it. Now we have a working fullscreen mobile map! But what if we need to do something after the geolocation completed? Here's what the `locationfound` and `locationerror` events are for. Let's for example add a marker in the detected location, showing accuracy in a popup, by adding an event listener to `locationfound` event before the `locateAndSetView` call:

	function onLocationFound(e) {
		var radius = e.accuracy;

		L.marker(e.latlng).addTo(map)
			.bindPopup("You are within " + radius + " meters from this point").openPopup();

		L.circle(e.latlng, radius).addTo(map);
	}

	map.on('locationfound', onLocationFound);

Excellent! But it would also be nice to show an error message if the geolocation failed:

	function onLocationError(e) {
		alert(e.message);
	}

	map.on('locationerror', onLocationError);

If you have `setView` option set to true and the geolocation failed, it will set the view to the whole world.

Now the example is complete --- try it on your mobile phone: [View the full example &rarr;](example.html)

Next steps would be to take a look at the detailed [documentation](/reference.html) and browse [other examples](../../examples.html).

---
layout: tutorial
title: Quick Start Guide
---

### Leaflet Quick Start Guide

This step-by-step guide will quickly get you started on Leaflet basics, including setting up a Leaflet map, working with markers, polylines and popups, and dealing with events.


<div id="map" style="height: 180px; margin-bottom: 18px"></div>

[View example on a separate page &rarr;](quick-start-example.html)


### Preparing your page

Before writing any code for the map, you need to do the following preparation steps on your page:

 * Include Leaflet CSS files in the head section of your document:

		<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.3.1/leaflet.css" />
		<!--[if lte IE 8]>
			<link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.3.1/leaflet.ie.css" />
		<![endif]-->

 * Include Leaflet JavaScript file somewhere on the page (preferably before <code>body</code> close tag):

		<script src="http://cdn.leafletjs.com/leaflet-0.3.1/leaflet.js"></script>

 * Put a <code>div</code> element with a certain <code>id</code> where you want your map to be (making sure it has defined height):

		<div id="map" style="height: 200px"></div>

Now you're ready to initialize the map and do some stuff with it.


### Setting up the map

<div id="map1" style="height: 180px; margin-bottom: 18px"></div>


Let's create a map instance, set its view to the center of London and add a pretty CloudMade tile layer to it. First we'll initialize the map:

	var map = new L.Map('map');

By default (as we didn't pass any options when creating the map instance), all mouse and touch interactions on the map are enabled, and it has zoom and attribution controls.

Next we'll create a tile layer to add to our map, in this case it's a CloudMade tile layer with Fresh style. Creating a tile layer usually involves setting the URL template for the tile images (get yours at [CloudMade](http://cloudmade.com/register)), the attribution text and the maximum zoom level of the layer:

<pre><code class="javascript">var cloudmade = new L.TileLayer('http://{s}.tile.cloudmade.com/<span class="text-cut" data-cut="[your-API-key]">API-KEY</span>/997/256/{z}/{x}/{y}.png', {
	attribution: 'Map data &amp;copy; <span class="text-cut" data-cut="[&hellip;]">&lt;a href="http://openstreetmap.org"&gt;OpenStreetMap&lt;/a&gt; contributors, &lt;a href="http://creativecommons.org/licenses/by-sa/2.0/"&gt;CC-BY-SA&lt;/a&gt;, Imagery &copy; &lt;a href="http://cloudmade.com"&gt;CloudMade&lt;/a&gt;</span>',
	maxZoom: 18
});</code></pre>

It's worth noting that Leaflet is provider-agnostic, meaning that it doesn't enforce a particular choice of providers for tiles, and it doesn't even contain a single provider-specific line of code, so you're free to use other providers if you need to (we'd recommend CloudMade though, it looks beautiful).

Finally we'll set the map view to the center of London at 13th zoom level and add our tile layer (see the resulting map above):

	var london = new L.LatLng(51.505, -0.09); // geographical point (longitude and latitude)
	map.setView(london, 13).addLayer(cloudmade);

Make sure this code is below both the map <code>div</code> and <code>leaflet.js</code> inclusion, or in a <code>window.load</code> or <code>document.ready</code> event handler.


### Markers, circles and polygons

<div id="map2" style="height: 180px; margin-bottom: 18px"></div>

Besides tile layers, you can easily add other things to your map, including markers, polylines, polygons, circles, and popups. Let's add a marker:

	var markerLocation = new L.LatLng(51.5, -0.09);

	var marker = new L.Marker(markerLocation);
	map.addLayer(marker);

Adding a circle is the same (except for specifying the radius in meters), but lets configure it by passing options as a third argument when creating the object (the second argument is the radius in pixels):

	var circleLocation = new L.LatLng(51.508, -0.11),
		circleOptions = {
			color: 'red',
			fillColor: '#f03',
			fillOpacity: 0.5
		};

	var circle = new L.Circle(circleLocation, 500, circleOptions);
	map.addLayer(circle);

Add a polygon is easy too:

	L.polygon([[51.509, -0.08], [51.503, -0.06], [51.51, -0.047]]).addTo(map);


### Working with popups

<div id="map3" style="height: 180px; margin-bottom: 18px"></div>

Popups are usually used when you want to attach some information to a particular object on a map. Leaflet has a very handy shortcut for this:

	marker.bindPopup("<b>Hello world!</b><br>I am a popup.").openPopup();
	circle.bindPopup("I am a circle.");
	polygon.bindPopup("I am a polygon.");

Try clicking on our objects. The <code>bindPopup</code> method attaches a popup with the specified HTML content to your marker so the popup appears when you click on the object, and the <code>openPopup</code> method (for markers only) immediately opens the attached popup.

You can also use popups as layers (when you need something more than attching a popup to an object):

	var popup = new L.Popup();

	popup.setLatLng(new L.LatLng(51.5, -0.09));
	popup.setContent("I am a standalone popup.");

	map.openPopup(popup);

Here we use <code>openPopup</code> instead of <code>addLayer</code> because it handles automatic closing of a previously opened popup when opening a new one which is good for usability.


### Dealing with events

Every time something happens in Leaflet, e.g. user clicks on a marker or map zoom changes, the corresponding object sends an event which you can subscribe to with a function. It allows you to react to user interaction:

	map.on('click', onMapClick);

	function onMapClick(e) {
		alert("You clicked the map at " + e.latlng);
	}

Each object has its own set of events &mdash; see <a href="../reference.html">documentation</a> for details. The first argument of the listener function is an event object &mdash; it contains useful information about the event that happened. For example, map click event object (<code>e</code> in the example above) has <code>latlng</code> property which is a location at which the click occured.

Lets improve our example by using a popup instead of an alert and formatting the location string:

	map.on('click', onMapClick);

	var popup = new L.Popup();

	function onMapClick(e) {
		var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';

		popup.setLatLng(e.latlng);
		popup.setContent("You clicked the map at " + latlngStr);

		map.openPopup(popup);
	}

Try clicking on the map and you will see the coordinates in a popup. <a target="_blank" href="quick-start-example.html">View the full example &rarr;</a>

Now you've learned Leaflet basics and can start building map apps straight away! Don't forget to take a look at the detailed <a href="../reference.html">documentation</a> or <a href="../examples.html">other examples</a>.

<script>
	var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
		cloudmadeAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
		cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

	var map = new L.Map('map');
	map.setView(new L.LatLng(51.505, -0.09), 13).addLayer(cloudmade);

	var markerLocation = new L.LatLng(51.5, -0.09),
		marker = new L.Marker(markerLocation);

	map.addLayer(marker);
	marker.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

	var circleLocation = new L.LatLng(51.508, -0.11),
		circleOptions = {color: '#f03', opacity: 0.7},
		circle = new L.Circle(circleLocation, 500, circleOptions);

	circle.bindPopup("I am a circle.");
	map.addLayer(circle);

	var p1 = new L.LatLng(51.509, -0.08),
		p2 = new L.LatLng(51.503, -0.06),
		p3 = new L.LatLng(51.51, -0.047),
		polygonPoints = [p1, p2, p3],
		polygon = new L.Polygon(polygonPoints);

	polygon.bindPopup("I am a polygon.");
	map.addLayer(polygon);

	map.on('click', onMapClick);

	var popup = new L.Popup();

	function onMapClick(e) {
		var latlngStr = '(' + e.latlng.lat.toFixed(3) + ', ' + e.latlng.lng.toFixed(3) + ')';

		popup.setLatLng(e.latlng);
		popup.setContent("You clicked the map at " + latlngStr);

		map.openPopup(popup);
	}
</script>

<script>
	var cloudmade1 = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

	var map1 = new L.Map('map1');
	map1.setView(new L.LatLng(51.505, -0.09), 13).addLayer(cloudmade1);
</script>

<script>
	var cloudmade2 = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

	var map2 = new L.Map('map2');
	map2.setView(new L.LatLng(51.505, -0.09), 13).addLayer(cloudmade2);

	var marker2 = new L.Marker(markerLocation);
	map2.addLayer(marker2);

	var circle2 = new L.Circle(circleLocation, 500, circleOptions);
	map2.addLayer(circle2);

	var polygon2 = new L.Polygon(polygonPoints);
	map2.addLayer(polygon2);
</script>

<script>
	var cloudmade3 = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

	var map3 = new L.Map('map3');
	map3.setView(new L.LatLng(51.505, -0.09), 13).addLayer(cloudmade3);

	var marker3 = new L.Marker(markerLocation);
	map3.addLayer(marker3);
	marker3.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

	var circle3 = new L.Circle(circleLocation, 500, circleOptions);
	circle3.bindPopup("I am a circle.");
	map3.addLayer(circle3);

	var polygon3 = new L.Polygon(polygonPoints);
	polygon3.bindPopup("I am a polygon.");
	map3.addLayer(polygon3);
</script>

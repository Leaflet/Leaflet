---
layout: tutorial
title: Markers With Custom Icons
---

### Markers With Custom Icons

In this example, you'll learn how to easily define your own icons for use by the markers you put on the map.

<div id="map" style="height: 220px; margin-bottom: 18px"></div>

[View example on a separate page &rarr;](custom-icons-example.html)


### Preparing the images

To make a custom icon, we usually need two images --- the actual icon image and the image of its shadow. For this example, we took the Leaflet logo and created four images out of it --- 3 leaf images of different colors and one shadow image for the three:

<p>
	<img style="border: 1px solid #ccc" src="../docs/images/leaf-green.png" />
	<img style="border: 1px solid #ccc" src="../docs/images/leaf-red.png" />
	<img style="border: 1px solid #ccc" src="../docs/images/leaf-orange.png" />
	<img style="border: 1px solid #ccc" src="../docs/images/leaf-shadow.png" />
</p>

The white area in the images is actually transparent, and they are saved in the PNG24 format. Notice there's some excessive area on the left of the shadow image &mdash; its cropped in such way that if you align the icon and the shadow images on top of each other, the top left corners are in the same spot.


### Defining an icon class

The default marker icons in Leaflet are defined by the [L.Icon](../reference.html#icon) class. Its instance (`new L.Icon()`) is then set by default in the `L.Marker` options. So how do we define our own icon class? Inherit from `L.Icon`! It's really easy in Leaflet:

		var LeafIcon = L.Icon.extend({
			options: {
				iconUrl: '../docs/images/leaf-green.png',
				shadowUrl: '../docs/images/leaf-shadow.png',
				iconSize: new L.Point(38, 95),
				shadowSize: new L.Point(68, 95),
				iconAnchor: new L.Point(22, 94),
				popupAnchor: new L.Point(-3, -76)
			}
		});

Now we've defined a green leaf icon class. The <code>iconSize</code> and <code>shadowSize</code> properties are the sizes of the corresponding images in pixels, the <code>iconAnchor</code> property is the coordinates of the "tip" of our icon, and the <code>popupAnchor</code> property points to a point from which a marker popup would open relative to the <code>iconAnchor</code> point.


### Using icons in markers

To use our newly created icon class in a marker, we need to create an instance of that class and pass it to the marker constructor in the options:

	var greenIcon = new LeafIcon(),
		marker = new L.Marker(new L.LatLng(51.5, -0.09), {icon: greenIcon});

Awesome, it works! But what about the orange and the red ones? You could repeat the whole process above for each of them, but there's a much easier way. Notice that these icons would have the same properties except for one --- the iconUrl. Because it's a frequent case, the <code>L.Icon</code> constructor has an optional argument --- an iconUrl to replace the defined one. Let's see:

	var greenIcon = new LeafIcon(),
		redIcon = new LeafIcon({iconUrl: '../docs/images/leaf-red.png'}),
		orangeIcon = new LeafIcon({iconUrl: '../docs/images/leaf-orange.png'});

Now we can use all the three icons:

	var marker1 = new L.Marker(new L.LatLng(51.5, -0.09), {icon: greenIcon}),
		marker2 = new L.Marker(new L.LatLng(51.495, -0.083), {icon: redIcon}),
		marker3 = new L.Marker(new L.LatLng(51.49, -0.1), {icon: orangeIcon});

marker1.bindPopup("I am a green leaf.");
marker2.bindPopup("I am a red leaf.");
marker3.bindPopup("I am an orange leaf.");

map.addLayer(marker1).addLayer(marker2).addLayer(marker3);

That's all. Now take a look at the <a target="_blank" href="custom-icons-example.html">full example</a>, the <a href="../reference.html#icon">L.Icon docs</a>, or browse <a href="../examples.html">other examples</a>.

<script>
	var map = new L.Map('map');

	var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/22677/256/{z}/{x}/{y}.png',
		cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade',
		cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

	map.setView(new L.LatLng(51.5, -0.09), 13).addLayer(cloudmade);

	var LeafIcon = L.Icon.extend({
		options: {
			iconUrl: '../docs/images/leaf-green.png',
			shadowUrl: '../docs/images/leaf-shadow.png',
			iconSize: new L.Point(38, 95),
			shadowSize: new L.Point(68, 95),
			iconAnchor: new L.Point(22, 94),
			popupAnchor: new L.Point(-3, -76)
		}
	});

	var greenIcon = new LeafIcon(),
		redIcon = new LeafIcon({iconUrl: '../docs/images/leaf-red.png'}),
		orangeIcon = new LeafIcon({iconUrl: '../docs/images/leaf-orange.png'});

	var marker1 = new L.Marker(new L.LatLng(51.5, -0.09), {icon: greenIcon}),
		marker2 = new L.Marker(new L.LatLng(51.495, -0.083), {icon: redIcon}),
		marker3 = new L.Marker(new L.LatLng(51.49, -0.1), {icon: orangeIcon});

	marker1.bindPopup("I am a green leaf.");
	marker2.bindPopup("I am a red leaf.");
	marker3.bindPopup("I am an orange leaf.");

	map.addLayer(marker1).addLayer(marker2).addLayer(marker3);
</script>

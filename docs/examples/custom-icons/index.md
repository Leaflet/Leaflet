---
layout: tutorial_v2
title: Markers with Custom Icons
---

## Markers With Custom Icons

In this tutorial, you'll learn how to easily define your own icons for use by the markers you put on the map.

{% include frame.html url="example.html" %}

### Preparing the images

To make a custom icon, we usually need two images --- the actual icon image and the image of its shadow. For this tutorial, we took the Leaflet logo and created four images out of it --- 3 leaf images of different colors and one shadow image for the three:

<p>
	<img style="border: 1px solid #ccc" src="leaf-green.png" />
	<img style="border: 1px solid #ccc" src="leaf-red.png" />
	<img style="border: 1px solid #ccc" src="leaf-orange.png" />
	<img style="border: 1px solid #ccc" src="leaf-shadow.png" />
</p>

Note that the white area in the images is actually transparent.

### Creating an icon

Marker icons in Leaflet are defined by [L.Icon](/reference.html#icon) objects, which are passed as an option when creating markers. Let's create a green leaf icon:

	const greenIcon = new Icon({
		iconUrl: 'leaf-green.png',
		shadowUrl: 'leaf-shadow.png',
		iconSize:     [38, 95], // size of the icon
		shadowSize:   [50, 64], // size of the shadow
		iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
		shadowAnchor: [4, 62],  // the same for the shadow
		popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
	});

Now putting a marker with this icon on a map is easy:

	const marker = new Marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

{% include frame.html url="example-one-icon.html" %}

### Defining an icon class

What if we need to create several icons that have lots in common? Let's define our own icon class containing the shared options, inheriting from `L.Icon`! It's really easy in Leaflet:

	const LeafIcon = Icon.extend({
		options: {
			shadowUrl: 'leaf-shadow.png',
			iconSize:     [38, 95],
			shadowSize:   [50, 64],
			iconAnchor:   [22, 94],
			shadowAnchor: [4, 62],
			popupAnchor:  [-3, -76]
		}
	});

Now we can create all three of our leaf icons from this class and use them:

	const greenIcon = new LeafIcon({iconUrl: 'leaf-green.png'}),
		redIcon = new LeafIcon({iconUrl: 'leaf-red.png'}),
		orangeIcon = new LeafIcon({iconUrl: 'leaf-orange.png'});

OK, let's finally put some markers with these icons on the map:

	new Marker([51.5, -0.09], {icon: greenIcon}).addTo(map).bindPopup("I am a green leaf.");
	new Marker([51.495, -0.083], {icon: redIcon}).addTo(map).bindPopup("I am a red leaf.");
	new Marker([51.49, -0.1], {icon: orangeIcon}).addTo(map).bindPopup("I am an orange leaf.");

That's it. Now take a look at the [full example](example.html), the [`L.Icon` docs](/reference.html#icon), or browse [other examples](../../examples.html).

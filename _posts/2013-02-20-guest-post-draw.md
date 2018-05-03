---
layout: post
title: Leaflet.draw 0.2 Released
description: Leaflet.draw 0.2 released &mdash; brings vector drawing and editing tools to your Leaflet map.
author: Jacob Toye
authorsite: https://github.com/jacobtoye/
---

_This is a guest post from Jacob Toye, an active Leaflet contributor and also the author of the most sophisticated vector drawing and editing plugin out there, which is presented in this post._

[Leaflet.draw](https://github.com/Leaflet/Leaflet.draw/) was born from the need to provide users with the ability draw polygons on the map. Leaflet already provided a very nice way of editing existing polylines and polygons. The logical next step was to expand on this functionality to allow the creation of these layers, and ultimately the other vector layers.

Upon release the immediate response from the Leaflet community was very positive. It became clear that the next step would be progressing this tool to a state where users could edit and delete shapes in addition to creating them. This is ultimately what Leaflet.draw 0.2 set out to do.

After a few months of off and on development, with most of this spare time kindy sponsored by my employer <a href="http://www.smartrak.co.nz" title="GPS Fleet Management solutions" target="_blank">Smartrak</a>, we proudly present Leaflet.draw 0.2 -- your one stop plugin for drawing, editing and deleting vectors and markers on Leaflet maps. :)

_Note from Vladimir: the polyline/polygon editing functionality from Leaflet core has been moved into this plugin where it fits much better. The plugin in turn has moved into [Leaflet organization on GitHub](https://github.com/Leaflet) and is now officially supported by the Leaflet development team. Note that version 0.2 currently depends on Leaflet master (in-progress development version) to work._

You can download the latest version from the <a href="https://github.com/Leaflet/Leaflet.draw/" target="_blank">github repo</a>. Please report any bugs you come across on the <a href="https://github.com/Leaflet/Leaflet.draw/issues" target="_blank">issues page</a>.

<div id="map" class="map" style="height: 288px"></div>

{:#plugin-features}
### Features

Leaflet.draw is designed to not only be easy for end users to use, but also for developers to integrate.

 * Draw shapes on your map with easy to use drawing tools.
 * Edit and delete vectors and markers.
 * Super customizable:
   * Customize the styles of each shape to fit in with your maps theme.
   * Pick and choose the which tools you want to use.
   * Roll your own by simply using the drawing and editing handlers.
 * Event based system allows you to perform any necessary actions when shapes are created, edited or deleted.

### How to use

Leaflet.draw is very simple to drop into you Leaflet application. The following example will add both the draw and edit toolbars to a map:

	// create a map in the "map" div, set the view to a given place and zoom
	var map = L.map('map').setView([175.30867, -37.77914], 13);

	// add an OpenStreetMap tile layer
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// Initialize the FeatureGroup to store editable layers
	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	// Initialize the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw({
		edit: {
			featureGroup: drawnItems
		}
	});
	map.addControl(drawControl);

#### Handling newly created layers

Once you have successfully added the Leaflet.draw plugin your map you will want to respond to the different actions users can trigger.

	map.on('draw:created', function (e) {
		var type = e.layerType,
			layer = e.layer;

		if (type === 'marker') {
			// Do marker specific actions
		}

		// Do whatever else you need to. (save to db, add to map etc)
		drawnItems.addLayer(layer);
	});

	map.on('draw:edited', function () {
		// Update db to save latest changes.
	});

	map.on('draw:deleted', function () {
		// Update db to save latest changes.
	});

See the <a href="https://github.com/Leaflet/Leaflet.draw" target="_blank">Leaflet.draw README</a> for more details on how to configure the plugin.

### Thanks

First and foremost I would like to thank my employer <a href="http://www.smartrak.co.nz" title="GPS Fleet Management solutions" target="_blank">Smartrak</a>. Without their attitude to open source software I would not have had the time to complete this plugin.

The Leaflet developer community have been great in supporting this plugin through inspiration, pull requests and issue reports. Special thanks to: <a href="https://github.com/mourner" title="@mourner" target="_blank">@mourner</a>, <a href="https://github.com/danzel" title="@danzel" target="_blank">@danzel</a>, <a href="https://github.com/brunob" title="@brunob" target="_blank">@brunob</a>, <a href="https://github.com/tnightingale" title="@tnightingale" target="_blank">@tnightingale</a>, <a href="https://github.com/Starefossen" title="@Starefossen" target="_blank">@Starefossen</a>, and <a href="https://github.com/shramov" title="@shramov" target="_blank">@shramov</a>.

### Closing

I've had a great time implementing this plugin. I hope you enjoy using it. If you have a question or just want to say hi, send me an email at <a href="mailto:jacob.toye@gmail.com">jacob.toye@gmail.com</a>.

Cheers,
Jacob Toye

<link rel="stylesheet" href="https://leaflet.github.io/Leaflet.draw/lib/leaflet/leaflet.css" />
<link rel="stylesheet" href="https://leaflet.github.io/Leaflet.draw/leaflet.draw.css" />
<!--[if lte IE 8]>
	<link rel="stylesheet" href="https://leaflet.github.io/Leaflet.draw/lib/leaflet/leaflet.ie.css" />
	<link rel="stylesheet" href="https://leaflet.github.io/Leaflet.draw/leaflet.draw.ie.css" />
<![endif]-->
<script src="https://leaflet.github.io/Leaflet.draw/libs/leaflet/leaflet.js"></script>
<script src="https://leaflet.github.io/Leaflet.draw/leaflet.draw.js"></script>

<style>
	.leaflet-bar {
		border: none;
	}
</style>

<script>
	// create a map in the "map" div, set the view to a given place and zoom
	var map = L.map('map').setView([-37.77914, 175.30867], 16);

	// add an OpenStreetMap tile layer
	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// Initialize the FeatureGroup to store editable layers
	var drawnItems = new L.FeatureGroup();
	map.addLayer(drawnItems);

	// Initialize the draw control and pass it the FeatureGroup of editable layers
	var drawControl = new L.Control.Draw({
		edit: {
			featureGroup: drawnItems
		}
	});
	map.addControl(drawControl);

	map.on('draw:created', function (e) {
		var type = e.layerType,
			layer = e.layer;

		if (type === 'marker') {
			layer.bindPopup('A popup!');
		}

		// Do whatever else you need to. (save to db, add to map etc)
		drawnItems.addLayer(layer);
	});
</script>

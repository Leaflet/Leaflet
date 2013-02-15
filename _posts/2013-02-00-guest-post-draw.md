---
layout: post
title: Leaflet.draw 0.2 released
description: Leaflet.draw 0.2 released &mdash; brings vector drawing and editing tools to your Leaflet map.
author: Jacob Toye
authorsite: https://github.com/jacobtoye/
---

Leaflet.draw was born from the need to provide users with the ability draw polygons on the map. Leaflet already provided a very nice way of editing existing polylines and polygons. The logical next step was to expand on this functionality to allow the creation of these layers, and ultimately the other vector layers.

Upon release the immediate response from the Leaflet community was very positive. It became clear that progressing this tool to a state where users could edit and delete, as well as create. This is ultimately what Leaflet.draw 0.2 set out to do.

After a few months of off and on development, with most of this spare time kindy sponsored by my employer <a href="www.smartrak.co.nz" title="GPS Fleet Management solutions">Smartrak</a>, we proudly present Leaflet.draw 0.2 your one stop plugin for drawing, editing and deleting vectors and markers on Leaflet maps :)

<div id="map" class="map" style="height: 320px"></div>

### Features

Leaflet.draw is designed to not only be easy for end users to use, but also for developers to integrate.

 * Easily draw shapes on your map with easy to use tools all specifically designed for the particular shape.
 * Super ccustomizable:
   * Customize the styles of each shape to fit in with your maps theme.
   * Pick and choose the which tools you want to use.
   * Roll your own by simply using the drawing and editing handlers.
 * Event based system allows you to perform any necessary actions when shapes are created, edited or deleted.

### How to use

Leaflet.draw is very simple to drop into you Leaflet application. The following example will add both the draw and edit toolbars to a map:

// create a map in the "map" div, set the view to a given place and zoom
var map = L.map('map').setView([51.505, -0.09], 13);

// add an OpenStreetMap tile layer
L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
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

See the <a href="https://github.com/Leaflet/Leaflet.draw">Leaflet.draw README</a> for more details on how to configure the plugin.

### Thanks

First and foremost I would like to thank my employer <a href="www.smartrak.co.nz" title="GPS Fleet Management solutions">Smartrak</a>, without their positive attitude to open source software I would not have had the time to complete this plugin.

The Leaflet developer community have been great in support this plugin through inspiration, pull requests and issue reports. Special thanks to: <a href="https://github.com/mourner" title="@mourner">@mourner</a>, <a href="https://github.com/danzel" title="@danzel">@danzel</a>, <a href="https://github.com/brunob" title="@brunob">@brunob</a>, <a href="https://github.com/tnightingale" title="@tnightingale">@tnightingale</a>, and <a href="https://github.com/shramov" title="@shramov">@shramov</a>.

I really look forward to the future of Leaflet. It already is the best JavaScript mapping library around, and with such a great developer community support it's bound to be an amazing journey!

<link rel="stylesheet" href="http://leaflet.github.com/Leaflet.draw/dist/leaflet.draw.css" />
<!--[if lte IE 8]><link rel="stylesheet" href="http://leaflet.github.com/Leaflet.draw/dist/leaflet.draw.css" /><![endif]-->
<script src="http://leaflet.github.com/Leaflet.draw/dist/leaflet.draw.js"></script>

<script>
  // create a map in the "map" div, set the view to a given place and zoom
  var map = L.map('map').setView([51.505, -0.09], 13);

  // add an OpenStreetMap tile layer
  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Initialize the FeatureGroup to store editable layers
  var drawnItems = new L.FeatureGroup();
  map.addLayer(drawnItems);

  // Initialize the draw control and pass it the FeatureGroup of editable layers
  var drawControl = new L.Control.Draw({
      position: 'topright',
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
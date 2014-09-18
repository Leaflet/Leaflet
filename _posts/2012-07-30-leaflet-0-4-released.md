---
layout: post
title: Leaflet 0.4 Released
description: After 5.5 months of development with 33 contributors involved, I'm proud to announce the release of Leaflet 0.4! It comes with a simpler API and <em>lots</em> of great improvements, along with a major update to documentation, a plugins page and the launch of the developer blog.
author: Vladimir Agafonkin
authorsite: http://agafonkin.com/en
---

After 5.5 months of development with [33 contributors](https://github.com/Leaflet/Leaflet/graphs/contributors?from=2012-02-15&to=2012-07-30&type=c) involved since the previous stable release, I'm proud to announce the release of Leaflet 0.4! It comes with a simpler API and *lots* of great improvements and important bugfixes, along with a major update to documentation, an official plugins page and the launch of this developer blog. Lets take a look at the improvements one by one.

### Simpler API

Leaflet 0.4 contains several API improvements that allow you to write simpler, terser code ([jQuery](http://jquery.com)-like), while being backwards compatible with the previous approach (so that you can use both styles).

	L.marker([51.5, -0.09])
    	.addTo(map)
    	.bindPopup('Hello world!')
    	.openPopup();

First, Leaflet methods now accept [LatLng][], [LatLngBounds][], [Point][] and [Bounds][] objects in a simple array form, so you don't need to always create them explicitly:

	map.panTo([50, 30]); // the same as:
	map.panTo(new L.LatLng(50, 30));

Second, Map methods like [addLayer][], [addControl][], [openPopup][] got their counterparts from the other side:

	marker.addTo(map);  // same as map.addLayer(marker)
	control.addTo(map); //         map.addControl(control)
	popup.openOn(map);  //         map.openPopup(popup)

Along with the fact that all Leaflet methods that don't explicitly return a value return the object itself, this allows for convenient method chaining.

Third, Leaflet classes now come with lowercase shortcuts (class factories) that allow you to create objects without the <code>new</code> keyword, which makes chained code look nicer:

	L.map('map').fitWorld(); // same as
	(new L.Map('map')).fitWorld();

### Notable New Features

<div id="map" class="map" style="height: 250px"></div>

#### Improved Zoom Animation

Markers, popups, vector layers and image overlays were hidden during zoom in the previous version, but now (thanks to [Dave Leaver][]) they all have beautiful, smooth zoom animation unlike any other existing mapping libraries. Try zooming on the map above to see how it looks! If you have thousands of markers on a map though, you can turn off the marker animation if it gets slow with the Map's `markerZoomAnimation` option.

In addition, now tiles won't disappear if you zoom in or out more than once quickly.

#### Keyboard Navigation

Leaflet maps got a nice accessibility boost in 0.4 with the new keyboard handler (contributed by [Eric Martinez](https://github.com/ericmmartinez)), enabled by default. It allows users to navigate the map by using arrow keys for panning and <code>+/-</code> keys for zooming (after making the map focused either by tabbing to it or clicking on it). Try it on the map above, it feels very nice!

#### Panning Inertia

Another nice improvement comes to the panning experience --- now it has an inertial movement effect, where the map smoothly continues to move after a quick pan. Feels especially natural on touch devices --- and it's enabled by default too, try it now! It's also highly configurable, allowing you to set the maximum speed of the effect, decceleration, and time threshold under which it triggers.

#### Pinch-Zoom on Android 4

In the previous Leaflet version, pinch-zoom only worked on iOS devices, but now it finally comes to Android! Works for Android 4+ not only in the stock browser, but also on Chrome and Firefox for Android.

#### Scale Control

A simple, lightweight control that indicates the scale of the current map view in metric and/or imperial systems. As usual, you can customize its appearance with CSS. Take a look at the bottom left corner of the map above!

	L.control.scale().addTo(map);

#### Polyline and Polygon Editing

Allows users to edit polylines and polygons with a simple, intuitive interface. Note that this feature will eventually be merged into [Leaflet.draw][] --- an awesome plugin for drawing shapes by Jacob Toye.

	polygon.editing.enable();

#### Div-based Icons

In addition to the image-based [Icon][] class, Leaflet 0.4 gets a [DivIcon][] class for creating lightweight div-based markers (that can contain custom HTML and can be styled with CSS). For example, you can see them in action when editing polylines (the square handles), or in the [Leaflet.markercluster][] plugin I'll talk about later (the colored clusters).

	L.marker([50.505, 30.57], {
		icon: L.divIcon({className: 'my-div-icon'})
	}).addTo(map);

#### Rectangle Layer

Rectangle is a convenient shortcut for creating rectangular area layers. You could do this earlier with polygons, but this is easier:

	L.rectangle([[51.505, -0.03], [51.5, -0.045]]).addTo(map);

### API improvements

#### GeoJSON API

[GeoJSON][] API was improved to be simpler and much more flexible. [Jason Sanford][] wrote a [great tutorial](../../../examples/geojson.html) that showcases the new API. The changes are not backwards-compatible though, so be sure to update your old code.

#### Icon API

[Icon][] API was improved to be simpler and more flexible, and the changes are not backwards-compatible too (the old code can be updated very quickly though). Check out the updated [Custom Icons tutorial](../../../examples/custom-icons.html), or head straigt to the [API docs](../../../reference.html#icon).

#### Control API

Custom Controls are much easier to create now --- checkout the [API docs](../../../reference.html#icontrol) that also have a simple example.

#### Better Events API

[Aaron King][] brough some improvements to [event methods](../../../reference.html#events). `on` and `off` methods can now accept multiple event types at once as a string space-separated types:

	map.on('click dblclick moveend', doStuff);

Also, they can accept an object with types and listener functions as key/value pairs, like this:

	marker.on({
		click: onMarkerClick,
		dragend: onMarkerDragEnd
	});

Moreover, now if you only specify an event type to the `off` method, it will remove all listeners tied to this event.

	map.off('click');

#### Other API Improvements

Leaflet 0.4 features more than 30 new methods, options and events across different Leaflet classes that make the API more complete and powerful. Check out the [full changelog](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md#other-api-improvements) for the complete list.

### Performance and Usability Improvements

You may think that Leaflet is unbelievably fast already, but this version brings several performance improvements that make it even faster.

 * Panning, map resizing and pinch-zoom performance was improved (some tricks behind this will be explained in a future blog post).
 * Updating and removing vector layers on the canvas backend (e.g. on Android 2) works many times faster.
 * Box shadows on controls were replaced with simple borders on mobile devices to improve performance.
 * Vector layers won't flicker after each panning on iOS now.

In addition, there are several usability improvents not already mentioned:

 * Panning now works even if there are markers under the cursor (helps on crowded maps).
 * Popup appearance is slightly improved.
 * Tile layer now has <code>detectRetina</code> option that, when enabled, doubles the tile resolution for retina displays (contributed by [Mithgol][])	.

### Bugfixes

Leaflet 0.4 brings around 45 bugfixes that make it more stable and reliable across all browsers and platforms. Notable bugfixes include the dreaded iOS bug that caused the map to completely disappear after pinch-zooming in some rare cases, broken zooming on IE10 beta, broken Leaflet maps on pages served with an XHTML content type, and incorrect zooming on maps inside a fixed-position element.

Here's [a full list of bugfixes](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md#bug-fixes) in the changelog.

### Upgrading from older versions

Besides the GeoJSON and Icon changes mentioned above, here's a [list of potentially breaking changes](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md#other-breaking-api-changes) --- read it carefully when updating your code (shouldn't take much time though).

Download options for Leaflet 0.4 (including the actual download, the CDN-hosted version, and intructions for building manually) are listed on the [download page](../../../download.html).

### Code Stats

I'm still commited to keeping Leaflet as small and lightweight as possible. Here's a breakdown of the current size of the library:

 * JavaScript: **27 KB** minified and gzipped (102 KB minified, 176 KB in source, 7578 lines of code)
 * CSS: **1.8 KB** gzipped (8 KB, 377 lines of code)
 * Images: **10 KB** (5 PNG images)

### Documentation Update

Until now, Leaflet API reference was incomplete. But for this release, enourmous effort was put into making it 100% complete, up-to-date and generally the best API reference page you've ever seen. All remaining classes, methods, options, events and properties were carefully documented and more code examples added, and the docs will always be kept up-to-date from now on.

Besides, the design of the page was significantly improved --- with better colors, font, spacing, hyphenation, manually adjusted column widths, etc. --- lots of detail to make it beautiful and easy to read.

### Plugins Page

Leaflet website now has an official [plugins page](../../../plugins.html) that lists many Leaflet plugins created by the awesome Leaflet community, adding lots of great features and helping with service integration.

One plugin I'd like to mention is [Leaflet.markercluster][] by [Dave Leaver], currently the best marker clustering plugin I've ever seen among any mapping libraries --- it's fast, beautiful, provides smooth animations for clusters, includes a smart Google Earth-style solution for crowded markers on the last zoom level (by [George MacKerron][]), can highlight the area covered by a cluster on hover, works well on mobile devices, and can be customized easily. I think we'll cover this plugin in more detail in one of the next posts.

Another plugin to note is [Leaflet.draw][] by [Jacob Toye][], inspired by a similar plugin by [Bruno B](https://github.com/brunob). It enables drawing features like polylines, polygons, rectangles, circles and markers through a very nice user-friendly interface with icons and hints. Other editing-related code will probably move into this plugin in future.

Also, thanks to [Proj4Leaflet](https://github.com/kartena/Proj4Leaflet) plugin by [Kartena](http://www.kartena.se/), GIS enthusiasts can now enjoy Leaflet for maps with some quirky and rare projections.

One more Leaflet-based creation everyone needs to check out is [OSM Buildings](http://flyjs.com/buildings/) by [Jan Marsch](http://flyjs.com/buildings/about.php), an amazing JS library for visualizing 3D OSM building data on top of Leaflet maps. Incredibly cool stuff.

### Developer Blog

This is the first post of the official Leaflet developer blog, that will become the main place for all important Leaflet-related news, tutorials, tips and development notes.

### Big Players Using Leaflet

Since the previous release, Leaflet got adopted by many great companies, including [Flickr](http://flickr.com/map), [foursquare](http://foursquare.com) and [Wikimedia Foundation](http://blog.wikimedia.org/2012/04/05/new-wikipedia-app-for-ios-and-an-update-for-our-android-app/) (featured on [frontpage](../../../index.html) now). This is a really exciting time for Leaflet and open source maps, and I look forward to see many other companies follow this awesome trend in future.

### Thank You

I'd like to thank all the awesome people that helped Leaflet becoming what it is now --- contributed code, reported bugs, used Leaflet on their websites, told collegues about it, talked about it on conferences, etc. Keep up the great work!

Special thanks go to [Dave Leaver][] for his inspiring contributions including improved zoom animation and the state-of-the-art clustering plugin, and [Jason Sanford][] for his friendly support (and setting up the Leaflet CDN among other things).

And, of course, thanks to my amazing company, [CloudMade](http://cloudmade.com), for embracing open source and supporting this development.

Sincerely, <br />
Vladimir Agafonkin, Leaflet maintainer.

 [LatLng]: ../../../reference.html#latlng
 [LatLngBounds]: ../../../reference.html#latlngbounds
 [Point]: ../../../reference.html#point
 [Bounds]: ../../../reference.html#bounds
 [Icon]: ../../../reference.html#icon
 [DivIcon]: ../../../reference.html#divicon
 [GeoJSON]: ../../../reference.html#geojson

 [addControl]: ../../../reference.html#map-addcontrol
 [addLayer]: ../../../reference.html#map-addlayer
 [openPopup]: ../../../reference.html#map-openpopup

 [Leaflet.draw]: https://github.com/jacobtoye/Leaflet.draw
 [Leaflet.markercluster]: https://github.com/danzel/Leaflet.markercluster

 [Dave Leaver]: https://github.com/danzel
 [Jason Sanford]: https://github.com/JasonSanford
 [Aaron King]: https://github.com/Guiswa
 [Mithgol]: https://github.com/Mithgol
 [George MacKerron]: https://github.com/jawj/
 [Jacob Toye]: https://github.com/jacobtoye

<script>
	var map = L.map('map').setView([51.503, -0.09], 13);

	L.tileLayer(MB_URL, {attribution: MB_ATTR, id: 'examples.map-i875mjb7'}).addTo(map);

	var polygon = L.polygon([
		[51.509, -0.08],
		[51.503, -0.06],
		[51.51, -0.047]
	], {color: 'red'}).addTo(map).bindPopup('I am an editable polygon.');

	polygon.editing.enable();

	L.control.scale().addTo(map);

	L.marker([51.5, -0.095]).addTo(map)
		.bindPopup("<b>Hello world!</b><br />I am a popup.").openPopup();

	L.marker([51.505, -0.115]).addTo(map).bindPopup("I am a second popup.");
	L.marker([51.496, -0.13]).addTo(map).bindPopup("I am a third popup.");

	L.rectangle([
		[51.505, -0.03],
		[51.5, -0.045]
	], {weight: 1, opacity: 0.8}).addTo(map).bindPopup('I am a rectangle.');
</script>

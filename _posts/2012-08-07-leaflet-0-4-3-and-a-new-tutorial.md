---
layout: post
title: Leaflet 0.4.3 and a New Tutorial
description: Leaflet 0.4.3 released with several bugfixes and improvements, and comes with a new tutorial on creating a colorful interactive choropleth map.
author: Vladimir Agafonkin
authorsite: http://agafonkin.com/en
---

Following the [Leaflet 0.4 release](leaflet-0-4-released.html), there were several minor bugfix releases over the past week, with Leaflet 0.4.3 released today. They contain fixes for some bugs that were discovered and also bring some improvements to the new GeoJSON API to make it even more flexible --- see the changelog below.

I've also written [a new tutorial](../../../examples/choropleth.html), inspired by the [Texas Tribune US Senate Runoff Results map](http://www.texastribune.org/library/data/us-senate-runoff-results-map/) by [Ryan Murphy](http://www.texastribune.org/about/staff/ryan-murphy/) (also powered by Leaflet). It will show you step-by-step how to create a beautiful interactive [choropleth map](http://en.wikipedia.org/wiki/Choropleth_map) of US States Population Density with the help of GeoJSON and custom controls, and hopefully convince more major news and government websites to switch to Leaflet. :)

Grab the new Leaflet 0.4.3 at the [download page](../../../download.html). Enjoy!

**update**: IE9 regression was discovered in 0.4.3, so I had to release 0.4.4 with a fix. Sorry!

### 0.4.3 (August 7, 2012)

#### Improvements

 * Improved `GeoJSON` `setStyle` to also accept function (like the corresponding option).
 * Added `GeoJSON` `resetStyle(layer)`, useful for resetting hover state.
 * Added `feature` property to layers created with `GeoJSON` (containing the GeoJSON feature data).
 * Added `FeatureGroup` `bringToFront` and `bringToBack` methods (so that they would work for multipolys).
 * Added optional `animate` argument to `Map` `invalidateSize` (by [@ajbeaven](https://github.com/ajbeaven)). [#857](https://github.com/Leaflet/Leaflet/pull/857)

#### Bugfixes

 * Fixed a bug where tiles sometimes disappeared on initial map load on Android 2/3 (by [@danzel](https://github.com/danzel)). [#868](https://github.com/Leaflet/Leaflet/pull/868)
 * Fixed a bug where map would occasionally flicker near the border on zoom or pan on Chrome.
 * Fixed a bug where `Path` `bringToFront` and `bringToBack` didn't return `this`.
 * Removed zoom out on Win/Meta key binding (since it interferes with global keyboard shortcuts). [#869](https://github.com/Leaflet/Leaflet/issues/869)

### 0.4.2 (August 1, 2012)

 * Fixed a bug where layers control radio buttons would not work correctly in IE7 (by [@danzel](https://github.com/danzel)). [#862](https://github.com/Leaflet/Leaflet/pull/862)
 * Fixed a bug where `FeatureGroup` `removeLayer` would unbind popups of removed layers even if the popups were not put by the group (affected [Leaflet.markercluster](https://github.com/danzel/Leaflet.markercluster) plugin) (by [@danzel](https://github.com/danzel)). [#861](https://github.com/Leaflet/Leaflet/pull/861)

### 0.4.1 (July 31, 2012)

 * Fixed a bug that caused marker shadows appear as opaque black in IE6-8. [#850](https://github.com/Leaflet/Leaflet/issues/850)
 * Fixed a bug with incorrect calculation of scale by the scale control. [#852](https://github.com/Leaflet/Leaflet/issues/852)
 * Fixed broken L.tileLayer.wms class factory (by [@mattcurrie](https://github.com/mattcurrie)). [#856](https://github.com/Leaflet/Leaflet/issues/856)
 * Improved retina detection for `TileLayer` `detectRetina` option (by [@sxua](https://github.com/sxua)). [#854](https://github.com/Leaflet/Leaflet/issues/854)

Sincerely, <br />
Vladimir Agafonkin, Leaflet maintainer.

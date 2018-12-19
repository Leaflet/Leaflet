## Leaflet rotate
<img width="600" src="https://rawgit.com/Leaflet/Leaflet/master/src/images/logo.svg" alt="Leaflet" />

Leaflet is the leading open-source JavaScript library for **mobile-friendly interactive maps**.
Weighing just about 37 KB of gzipped JS code, it has all the mapping [features][] most developers ever need.

Leaflet is designed with *simplicity*, *performance* and *usability* in mind.
It works efficiently across all major desktop and mobile platforms out of the box,
taking advantage of HTML5 and CSS3 on modern browsers while being accessible on older ones too.
It can be extended with a huge amount of [plugins][],
has a beautiful, easy to use and [well-documented][] API
and a simple, readable [source code][] that is a joy to [contribute][] to.

For more info, docs and tutorials, check out the [official website][].<br>
For **Leaflet downloads** (including the built master version), check out the [download page][].

We're happy to meet new contributors.
If you want to **get involved** with Leaflet development, check out the [contribution guide][contribute].
Let's make the best mapping library that will ever exist,
and push the limits of what's possible with online maps!

[![Build Status](https://travis-ci.org/Leaflet/Leaflet.svg?branch=master)](https://travis-ci.org/Leaflet/Leaflet)

 [contributors]: https://github.com/Leaflet/Leaflet/graphs/contributors
 [features]: http://leafletjs.com/#features
 [plugins]: http://leafletjs.com/plugins.html
 [well-documented]: http://leafletjs.com/reference.html "Leaflet API reference"
 [source code]: https://github.com/Leaflet/Leaflet "Leaflet GitHub repository"
 [hosted on GitHub]: http://github.com/Leaflet/Leaflet
 [contribute]: https://github.com/Leaflet/Leaflet/blob/master/CONTRIBUTING.md "A guide to contributing to Leaflet"
 [official website]: http://leafletjs.com
 [download page]: http://leafletjs.com/download.html

An unofficial branch for making rotation work in leaflet master branch.

## Code example
```javascript
var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
	osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});

var map = L.map('map', {rotate: true})
		.setView([55, 10], 4)
		.addLayer(osm);
```
or if you want touch interactions to rotate the map:
```javascript
var map = L.map('map', {rotate: true, touchRotate: true})
		.setView([55, 10], 4)
		.addLayer(osm);
```

## Live examples
[Simple rotated map with a line, markers and a basemap](https://rawgit.com/fnicollet/Leaflet/rotate-master/debug/rotate/rotate.html)

[Map rotated according to the orientation of your device, if supported](https://rawgit.com/fnicollet/Leaflet/rotate-master/debug/rotate/rotate-mobile.html)

[Map with tri-state control for map rotation (locked, unlocked, follow)](https://rawgit.com/fnicollet/Leaflet/rotate-master/debug/rotate/rotate-control.html)

[Map with draggable markers](https://rawgit.com/fnicollet/Leaflet/rotate-master/debug/rotate/rotate-and-drag.html)

Code for these examples is hosted in the [debug/rotate folder](https://github.com/fnicollet/Leaflet/tree/rotate-master/debug/rotate)

## Installation
To use this branch, you will need to checkout and build it. Follow the steps of the Leaflet guide for [Building Leaflet from the Source](http://leafletjs.com/download.html#building-leaflet-from-the-source). Then get the JavaScript file from the dist folder.

## Motivation
Map rotation is the most request features on leaflet's feature suggestion website, see [Map rotation](https://leaflet.uservoice.com/forums/150880-ideas-and-suggestions-for-leaflet/suggestions/5587738-map-rotation) and a Github issue which started in 2011 [rotation of map and contents to x degress](https://github.com/Leaflet/Leaflet/issues/268).

For [good reasons](https://github.com/Leaflet/Leaflet/issues/268#issuecomment-1928759), it has never been implemented into Leaflet's core code.

@IvanSanchez started a ["rotate" branch](https://github.com/Leaflet/Leaflet/tree/rotate) a few years ago to try and add this feature. Then @hyperknot created a ["rotate-rc1"](https://github.com/hyperknot/Leaflet/tree/rotate-rc1) branch to make @IvanSanchez work with the latest leaflet changes (RC1 at the time). The project is now maintained by @fnicollet, in the "rotate-master" branch.
This branch is regularly merged with master, so you can expect the same issues that you have with Leaflet's master branch (+ maybe more).

Note: Here is a squash from all commits of the original "rotate" branch made by @IvanSanchez:
https://github.com/hyperknot/Leaflet/commit/0448ffd8f28730ff3c59822351d4a04f54a3972f

## Bug Reports & Feature Requests
If you encounter issues related to Leaflet itself, please log an issue on the Leaflet project directly:
https://github.com/Leaflet/Leaflet/issues/new

If you encounter issues related to map rotation specifically, please log an issue on the this branch:
https://github.com/fnicollet/Leaflet/issues

## Licence
Same as [Leaflet's licence](https://raw.githubusercontent.com/Leaflet/Leaflet/master/LICENSE)

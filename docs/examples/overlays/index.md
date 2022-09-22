---
layout: tutorial_v2
title: Overlays
---

## Overlays

There are 3 overlays in the Leaflet API: 
- [`ImageOverlay`](/reference.html#imageoverlay): Raster Layer, Extends [`Layer`](/reference.html#layer)
- [`VideoOverlay`](/reference.html#videooverlay): Raster Layer, Extends [`ImageOverlay`](/reference.html#imageoverlay)
- [`SVGOverlay`](/reference.html#svgoverlay): Vector Layer, Extends [`ImageOverlay`](/reference.html#imageoverlay)

In this tutorial, you’ll learn how to use these overlays.

### `ImageOverlay`

`L.ImageOverlay` is used to load and display a single image over specific bounds of the map. 

To add an image overlay [`L.ImageOverlay`](/reference.html#imageoverlay) use this:

```
var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, options);
```

#### Creating a map

First of all, create a Leaflet map and add a background `L.TileLayer` in the usual way:

```
var map = L.map('map').setView([37.8, -96], 4);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

Let's create an image overlay with multiple options:

```
var imageUrl = 'https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg';
var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
var altText = 'Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.';
var latLngBounds = L.latLngBounds([[40.799311, -74.118464], [40.68202047785919, -74.33]]);

var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
	opacity: 0.8,
	errorOverlayUrl: errorOverlayUrl,
	alt: altText,
	interactive: true
}).addTo(map);
```

If you want to see the area which is covered by the ImageOverlay, you can add a [`L.Rectangle`](/reference.html#rectangle) with the same `L.LatLngBounds` to the map:

```
L.rectangle(latLngBounds).addTo(map);
map.fitBounds(latLngBounds);
```

- `opacity` defines the opacity of the image overlay, it equals to `1.0` by default. Decrease this value to make an image overlay transparent and to expose the underlying map layer. 
	
- `errorOverlayUrl` is a URL to the overlay image to show in place of the overlay that failed to load.

- `alt` sets the HTML [`alt`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/img#attr-alt) attribute to provide an alternative text description of the image. Alternative text is essential information for screen reader users. It can also benefit people during poor network connectivity, in the case the image fails to load. Moreover, it can improve the SEO of a website.

- `interactive` is `false` by default. If `true`, the image overlay will emit mouse events when clicked or hovered.

You can find other options of `L.ImageOverlay` in the [documentation](/reference.html#imageoverlay).

{% include frame.html url="example-image.html" %}

### `VideoOverlay`

Video used to be a hard task when building a webpage, until the [`<video>` HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) was made available.

Nowadays, we can use the following HTML code:

```
<video width="500" controls>
	<source src="https://www.mapbox.com/bites/00188/patricia_nasa.webm" type="video/webm">
	<source src="https://www.mapbox.com/bites/00188/patricia_nasa.mp4" type="video/mp4">
</video>
```

To display this video:

<video width="500" controls>
<source src="https://www.mapbox.com/bites/00188/patricia_nasa.webm" type="video/webm">
<source src="https://www.mapbox.com/bites/00188/patricia_nasa.mp4" type="video/mp4">
</video>

If a video can be shown in a webpage in this way, then Leaflet can display it inside a map. It is important that the videos are prepared in such a way that they will fit the map: The video should have a "north-up" orientation, and its proportions should fit the map. If not, it will look out of place.

#### Creating a map

First of all, create a Leaflet map and add a background `L.TileLayer` in the usual way:

```
var map = L.map('map').setView([37.8, -96], 4);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

#### Adding the video overlay

Adding a video overlay works very similar to adding an image overlay. 

For a video overlay, just:

- Use `L.VideoOverlay` instead of `L.ImageOverlay`
- `L.VideoOverlay` is used to load and display a video player over specific bounds of the map. Extends [`L.ImageOverlay`](/reference.html#imageoverlay). 
A video overlay uses the [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video) HTML element.
- Instead of the image URL, specify one video URL *or* an array of video URLs

```
var videoUrls = [
	'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
	'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
];
var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
var latLngBounds = L.latLngBounds([[32, -130], [13, -100]]);

var videoOverlay = L.videoOverlay(videoUrls, latLngBounds, {
	opacity: 0.8,
	errorOverlayUrl: errorOverlayUrl,
	interactive: true,
	autoplay: true,
	muted: true,
	playsInline: true
}).addTo(map);
```

And just like that, you'll get the video on your map:

{% include frame.html url="example-nocontrols.html" %}

- `autoplay` option defines whether the video starts playing automatically when loaded. It is `true` by default. It is important to know that on some browsers `autoplay` functionality will only work with `muted` option explicitly set to `true`.

- `muted` option defines whether the video starts on mute when loaded. It is `false` by default.

- `playsInline` option when it is set to `true` allows video to play inline without automatically entering fullscreen mode when playback begins in the mobile browser. It is `true` by default.

You can find other options of `L.videoOverlay` in the [documentation](/reference.html#videooverlay).

Video overlays behave like any other Leaflet layer - you can add and remove them, let the user select from several videos using a [layers control](../layers-control/), etc.


#### A bit of control over the video

If you read the API documentation, you'll notice that the `L.VideoOverlay` class does not have a `play()` or `pause()` method.

For this, the `getElement()` method of the video overlay is useful. It returns the [`HTMLVideoElement`](https://developer.mozilla.org/docs/Web/API/HTMLImageElement) (which inherits from [`HTMLMediaElement`](https://developer.mozilla.org/docs/Web/API/HTMLMediaElement)) for the overlay - and that has methods like `play()` and `pause()`, e.g.

```
videoOverlay.getElement().pause();
```

This allows us to build custom interfaces. For example, we can build a small subclass of `L.Control` to play/pause this video overlay once it's loaded:

```
videoOverlay.on('load', function () {
	var MyPauseControl = L.Control.extend({
		onAdd: function() {
			var button = L.DomUtil.create('button');
			button.title = 'Pause';
			button.innerHTML = '<span aria-hidden="true">⏸</span>';
			L.DomEvent.on(button, 'click', function () {
				videoOverlay.getElement().pause();
			});
			return button;
		}
	});
	var MyPlayControl = L.Control.extend({
		onAdd: function() {
			var button = L.DomUtil.create('button');
			button.title = 'Play';
			button.innerHTML = '<span aria-hidden="true">▶️</span>';
			L.DomEvent.on(button, 'click', function () {
				videoOverlay.getElement().play();
			});
			return button;
		}
	});

	var pauseControl = (new MyPauseControl()).addTo(map);
	var playControl = (new MyPlayControl()).addTo(map);
});
```

{% include frame.html url="example-video.html" %}

### `SVGOverlay`

`L.SVGOverlay` is used to load, display and provide DOM access to an SVG file over specific bounds of the map. 

To add an SVG overlay [`L.SVGOverlay`](/reference.html#svgoverlay) use this:

```
var svgOverlay = L.svgOverlay(SVGElement, svgElementBounds, options);
```

It instantiates an image overlay object given an SVG element and the geographical bounds it is tied to. A viewBox attribute is required on the SVG element to zoom in and out properly.

#### Creating an SVG element

Let's create an SVG element:

```
var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
svgElement.setAttribute('viewBox', '0 0 200 200');
svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
```

Alternatively, you can create the SVG element in HTML code:

```
<svg id="svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/></svg>
```

And choose this SVG element by using a querySelector:

```
var svgElement = document.querySelector('#svg');
```

#### Adding the SVG overlay

Create the SVGOverlay with desired options similarly to ImageOverlay and VideoOverlay:

```
var latLngBounds = L.latLngBounds([[32, -130], [13, -100]]);
map.fitBounds(latLngBounds);

var svgOverlay = L.svgOverlay(svgElement, latLngBounds, {
	opacity: 0.7,
	interactive: true
}).addTo(map);
```

Although SVGOverlay does not have its own unique options, it inherits a variety of options from ImageOverlay, Interactive layer and Layer.
Check out the documentation to find out more [`L.SVGOverlay`](/reference.html#svgoverlay) options.

{% include frame.html url="example-svg.html" %}

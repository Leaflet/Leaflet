---
layout: tutorial_v2
title: Overlay
---

# Overlay - Tutorial

There are 3 Overlays in Leaflet API: 
- [`ImageOverlay`](/reference.html#imageoverlay): Raster Layer, Extends [`Layer`](/reference.html#layer)
- [`VideoOverlay`](/reference.html#videooverlay): Raster Layer, Extends [`ImageOverlay`](/reference.html#imageoverlay)
- [`SVGOverlay`](/reference.html#svgoverlay): Vector Layer, Extends [`ImageOverlay`](/reference.html#imageoverlay)

In this tutorial, you’ll learn how to use these Overlays.

## ImageOverlay

`L.imageOverlay` is used to load and display a single image over specific bounds of the map. 

To add an image overlay [`L.ImageOverlay`](/reference.html#imageoverlay) use this:
```
	var overlay = L.imageOverlay( imageUrl, bounds, options );
```
First of all, create a Leaflet map and add a background `L.TileLayer` in the usual way:
```
	var map = L.map('map').setView([37.8, -96], 4);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
		id: 'mapbox/satellite-v9',
		attribution: ...,
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);
```
If you want to see the area covered by a `LatLngBounds`, use a [`L.Rectangle`](/reference.html#rectangle):
```
	L.rectangle(bounds).addTo(map);

	map.fitBounds(bounds);
```
Let's create an image overlay with multiple options:
```
	var imageUrl = 'http://www.lib.utexas.edu/maps/historical/newark_nj_1922.jpg',
    var imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
	var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
	var altText = 'Video of Hurricane Patricia from Satellite. Source: NASA'
	var bounds = L.latLngBounds([[ 32, -130], [ 13, -100]]);

	var imageOverlay = L.imageOverlay( imageUrl, bounds, {
		opacity: 0.8,
		errorOverlayUrl: errorOverlayUrl,
		alt: altText,
		interactive: true
	}).addTo(map);
```
`opacity` defines the opacity of the image overlay, it equals to `1.0` by default. Decrease this value to make an image overlay transparent and to expose the underlying map layer. 
	
`errorOverlayUrl` is a URL to the overlay image to show in place of the overlay that failed to load.

`alt` stands for the alt attribute of the image. Images alternatives (`alt` option) add valuable information for low vision or blind screen reader users. Image alternatives also benefit people who have poor or unstable internet, some cognitive disabilities. Moreover, it can improve the SEO of a website.

`interactive` is `false` by default. If `true`: mouse events will be fired. If `false`: no mouse events are triggered.


You can find other options of `L.imageOverlay` in [`Docs`](/reference.html#imageoverlay)


## VideoOverlay

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

### Creating a map with a background

First of all, create a Leaflet map and add a background `L.TileLayer` in the usual way:
```
	var map = L.map('map').setView([37.8, -96], 4);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
		id: 'mapbox/satellite-v9',
		attribution: ...,
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);
```
Then, we'll define the geographical bounds that the video will cover. This is an instance of [`L.LatLngBounds`](/reference.html#latlngbounds), which is a rectangular shape:
```
	var bounds = L.latLngBounds([[ 32, -130], [ 13, -100]]);
```
If you want to see the area covered by a `LatLngBounds`, use a [`L.Rectangle`](/reference.html#rectangle):
```
	L.rectangle(bounds).addTo(map);

	map.fitBounds(bounds);
```
{% include frame.html url="example-bounds.html" %}

### Adding the video overlay

Adding a video overlay works very similar to adding an image overlay. 

For a video overlay, just:

* Use `L.videoOverlay` instead of `L.imageOverlay`
* `L.videoOverlay` is used to load and display a video player over specific bounds of the map. Extends [`ImageOverlay`](/reference.html#imageoverlay). 
A video overlay uses the [`<video>`](https://developer.mozilla.org/docs/Web/HTML/Element/video) HTML5 element.
* Instead of the image URL, specify one video URL *or* an array of video URLs

```
	var videoUrls = [
		'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
		'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
	];
	var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
	var altText = 'Video of Hurricane Patricia from Satellite. Source: NASA'
	var bounds = L.latLngBounds([[ 32, -130], [ 13, -100]]);

	var videoOverlay = L.videoOverlay( videoUrls, bounds, {
		opacity: 0.8,
		errorOverlayUrl: errorOverlayUrl,
		alt: altText,
		interactive: true,
		autoplay: true,
		muted: true,
		playsInline: true
	}).addTo(map);
```

And just like that, you'll get the video on your map:

{% include frame.html url="example-nocontrols.html" %}

`errorOverlayUrl` is a URL to the overlay image to show in place of the overlay that failed to load. The option is inherited from [`ImageOverlay`](/reference.html#imageoverlay).

`alt` stands for the alt attribute of the image. Images alternatives (`alt` option) add valuable information for low vision or blind screen reader users. Image alternatives also benefit people who have poor or unstable internet, some cognitive disabilities. Moreover, it can improve the SEO of a website. The option is inherited from [`ImageOverlay`](/reference.html#imageoverlay).

`interactive` is `false` by default. If `true`: mouse events will be fired. If `false`: no mouse events are triggered. The option is inherited from [`ImageOverlay`](/reference.html#imageoverlay).

`autoplay` option defines whether the video starts playing automatically when loaded. It is `true` by default. 

`muted` option defines whether the video starts on mute when loaded. It is `false` by default.

`playsInline` option allows video to play inline without automatically entering fullscreen mode when playback begins if it is set to`true`. It is `true` by default.

It is important to know that on some browsers `autoplay` functionality will only work with `muted` option explicitly set to `true`.

You can find other options of `L.videoOverlay` in [`Docs`](/reference.html#videooverlay)

Video overlays behave like any other Leaflet layer - you can add and remove them, let the user select from several videos using a [layers control](../layers-control/), etc.


### A bit of control over the video

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
				button.innerHTML = '⏸';
				L.DomEvent.on(button, 'click', function () {
					videoOverlay.getElement().pause();
				});
				return button;
			}
		});
		var MyPlayControl = L.Control.extend({
			onAdd: function() {
				var button = L.DomUtil.create('button');
				button.innerHTML = '▶️';
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

{% include frame.html url="example.html" %}

##SVGOverlay
`L.imageOverlay` is used to load and display a single image over specific bounds of the map. 

To add an image overlay [`L.ImageOverlay`](/reference.html#imageoverlay) use this:
```
	var svgOverlay = L.svgOverlay( SVGElement, bounds, options );
```
Instantiates an image overlay object given an SVG element and the geographical bounds it is tied to. A viewBox attribute is required on the SVG element to zoom in and out properly.

### Creating SVG
##### Approach #1: 
Let's create SVG element:
```
    var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
    svgElement.setAttribute('viewBox', "0 0 200 200");
    svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
```

##### Approach #2: 
Alternatively, you can create svg element in html code:
```
    <svg id="image" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/></svg>
```

Then, choose this SVG element by using a querySelector:

```
    var svgElement = document.querySelector('#image');
```

### Creating SVGOverlay
Then, create svgOverlay with desired options similarly to ImageOverlay and VideOverlay:
```
    var bounds = L.latLngBounds([[ 32, -130], [ 13, -100]]);
    map.fitBounds(bounds);

    var svgOverlay = L.svgOverlay(svgElement, bounds, {
        opacity: 0.7,
        interactive: true
    }).addTo(map)
```
Although SVGOverlay does not have its own unique options, it inherited a variety of options from ImageOverlay, Interactive layer and Layer.
Check out Documentation to find out more [`SVGOverlay`](/reference.html#svgoverlay) options.

{% include frame.html url="example-svg.html" %}

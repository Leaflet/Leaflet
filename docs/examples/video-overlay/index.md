---
layout: tutorial_v2
title: Leaflet on Mobile
---

## Video on webpages

Video used to be a hard task when building a webpage, until the [`<video>` HTML element](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/video) was made available.

Nowadays, we can use the following HTML code:

	<video width="500" controls>
		<source src="https://www.mapbox.com/bites/00188/patricia_nasa.webm" type="video/webm">
		<source src="https://www.mapbox.com/bites/00188/patricia_nasa.mp4" type="video/mp4">
	</video>

To display this video:

<video width="500" controls>
<source src="https://www.mapbox.com/bites/00188/patricia_nasa.webm" type="video/webm">
<source src="https://www.mapbox.com/bites/00188/patricia_nasa.mp4" type="video/mp4">
</video>

If a video can be shown in a webpage in this way, then Leaflet can display it inside a map. It is important that the videos are prepared in such a way that they will fit the map: The video should have a "north-up" orientation, and its proportions should fit the map. If not, it will look out of place.

### Bounds of an image overlay

First of all, create a Leaflet map and add a background `L.TileLayer` in the usual way:

	var map = L.map('map').setView([37.8, -96], 4);

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
		id: 'mapbox.satellite',
		attribution: ...
	}).addTo(map);

Then, we'll define the geographical bounds that the video will cover. This is an instance of [`L.LatLngBounds`](/reference.html#latlngbounds), which is a rectangular shape:

	var bounds = L.latLngBounds([[ 32, -130], [ 13, -100]]);

If you want to see the area covered by a `LatLngBounds`, use a [`L.Rectangle`](/reference.html#rectangle):

	L.rectangle(bounds).addTo(map);

	map.fitBounds(bounds);

{% include frame.html url="example-bounds.html" %}


### Adding the video overlay

Adding a video overlay works very similar to adding a image overlay. For just one image, [`L.ImageOverlay`s](/reference.html#imageoverlay) is used like this:

	var overlay = L.imageOverlay( imageUrl, bounds, options );

For a video overlay, just:

* Use `L.videoOverlay` instead of `L.imageOverlay`
* Instead of the image URL, specify one video URL *or* an array of video URLs

```
	var videoUrls = [
		'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
		'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
	];

	var bounds = L.latLngBounds([[ 32, -130], [ 13, -100]]);

	var videoOverlay = L.videoOverlay( videoUrls, bounds, {
		opacity: 0.8
	}).addTo(map);
```

And just like that, you'll get the video on your map:

{% include frame.html url="example-nocontrols.html" %}


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
				button.innerHTML = '⏵';
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

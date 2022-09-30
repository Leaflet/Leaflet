---
layout: tutorial_frame
title: Video Overlay Tutorial (video with controls)
---
<script>
	var map = L.map('map');

	var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	var videoUrls = [
		'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
		'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
	];
	var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
	var bounds = L.latLngBounds([[32, -130], [13, -100]]);

	map.fitBounds(bounds);

	var videoOverlay = L.videoOverlay(videoUrls, bounds, {
		opacity: 0.8,
		errorOverlayUrl: errorOverlayUrl,
		interactive: true,
		autoplay: true,
		muted: true,
		playsInline: true
	}).addTo(map);

	videoOverlay.on('load', function () {
		var MyPauseControl = L.Control.extend({
			onAdd: function () {
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
			onAdd: function () {
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

</script>

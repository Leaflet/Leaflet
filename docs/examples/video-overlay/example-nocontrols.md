---
layout: tutorial_frame
title: Video Overlay Tutorial
---
<script>
	var map = L.map('map');

	var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	var videoUrls = [
		'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
		'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
	],
	bounds = L.latLngBounds([[ 32, -130], [ 13, -100]]);

	map.fitBounds(bounds);

	var overlay = L.videoOverlay(videoUrls, bounds, {
		opacity: 0.8,
		interactive: true
	});
	map.addLayer(overlay);

</script>

---
layout: tutorial_frame
title: Video Overlay Tutorial
---
<script>
	var map = L.map('map');

	L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, ' +
			'<a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
			'Imagery © <a href="http://mapbox.com">Mapbox</a>',
		id: 'mapbox.satellite'
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


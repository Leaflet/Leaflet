---
layout: tutorial_frame
title: Video Overlay Tutorial
---
<script>
	const map = L.map('map');

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	const videoUrls = [
		'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
		'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
	];
	const errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
	const bounds = L.latLngBounds([[32, -130], [13, -100]]);

	map.fitBounds(bounds);

	const videoOverlay = L.videoOverlay(videoUrls, bounds, {
		opacity: 0.8,
		errorOverlayUrl,
		interactive: true,
		autoplay: true,
		muted: true,
		playsInline: true
	}).addTo(map);

</script>

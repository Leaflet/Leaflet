---
layout: tutorial_frame
title: Video Overlay Tutorial
---
<script type="module">
	import {Map, TileLayer, LatLngBounds, VideoOverlay} from 'leaflet';

	const map = new Map('map');

	const tiles = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	const videoUrls = [
		'https://www.mapbox.com/bites/00188/patricia_nasa.webm',
		'https://www.mapbox.com/bites/00188/patricia_nasa.mp4'
	];
	const errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
	const bounds = new LatLngBounds([[32, -130], [13, -100]]);

	map.fitBounds(bounds);

	const videoOverlay = new VideoOverlay(videoUrls, bounds, {
		opacity: 0.8,
		errorOverlayUrl,
		interactive: true,
		autoplay: true,
		muted: true,
		playsInline: true
	}).addTo(map);

</script>

---
layout: tutorial_frame
title: Accessible Markers Example
---

<script type="module">
	import {Map, TileLayer, Marker} from 'leaflet';

	const map = new Map('map').setView([50.4501, 30.5234], 4);

	const tiles = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	const marker = new Marker([50.4501, 30.5234], {alt: 'Kyiv'}).addTo(map)
		.bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');
</script>

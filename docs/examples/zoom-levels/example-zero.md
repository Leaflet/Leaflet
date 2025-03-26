---
layout: tutorial_frame
title: Zoom Levels Tutorial
---
<script type="module">
	import {Map, TileLayer} from 'leaflet';

	const map = new Map('map', {
		minZoom: 0,
		maxZoom: 0
	});

	const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

	const positron = new TileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	map.setView([0, 0], 0);
</script>

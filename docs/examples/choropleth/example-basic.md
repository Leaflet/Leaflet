---
layout: tutorial_frame
title: Basic States Example
---
<script type="text/javascript" src="us-states.js"></script>
<script type="module">
	import L, {Map, TileLayer, GeoJSON} from 'leaflet';

	const map = new Map('map').setView([37.8, -96], 4);

	const tiles = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	/* global statesData */
	const geojson = new GeoJSON(statesData).addTo(map);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

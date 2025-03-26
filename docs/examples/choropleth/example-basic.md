---
layout: tutorial_frame
title: Choropleth Tutorial
---
<script type="text/javascript" src="us-states.js"></script>
<script type="module">
	import {Map, TileLayer, GeoJSON} from 'leaflet';

	const map = new Map('map').setView([37.8, -96], 4);

	const tiles = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	/* global statesData */
	const geojson = new GeoJSON(statesData).addTo(map);

</script>

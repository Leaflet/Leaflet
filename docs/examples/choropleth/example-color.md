---
layout: tutorial_frame
title: Choropleth Tutorial
---

<script type="text/javascript" src="us-states.js"></script>
<script type="module">
	import L, {Map, TileLayer, GeoJSON} from 'leaflet';

	const map = new Map('map').setView([37.8, -96], 4);

	const tiles = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	// get color depending on population density value
	function getColor(d) {
		return d > 1000 ? '#800026' :
			d > 500  ? '#BD0026' :
			d > 200  ? '#E31A1C' :
			d > 100  ? '#FC4E2A' :
			d > 50   ? '#FD8D3C' :
			d > 20   ? '#FEB24C' :
			d > 10   ? '#FED976' : '#FFEDA0';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.density)
		};
	}

	/* global statesData */
	const geojson = new GeoJSON(statesData, {
		style,
	}).addTo(map);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

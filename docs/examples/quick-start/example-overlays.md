---
layout: tutorial_frame
title: Overlays Example
customMapContainer: "true"
---
<div id='map' style='width: 600px; height: 400px;'></div>
<script type="module">
	import L, {Map, TileLayer, Marker, Circle, Polygon} from 'leaflet';

	const map = new Map('map').setView([51.505, -0.09], 13);

	const tiles = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	const marker = new Marker([51.5, -0.09]).addTo(map);

	const circle = new Circle([51.508, -0.11], {
		color: 'red',
		fillColor: '#f03',
		fillOpacity: 0.5,
		radius: 500
	}).addTo(map);

	const polygon = new Polygon([
		[51.509, -0.08],
		[51.503, -0.06],
		[51.51, -0.047]
	]).addTo(map);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

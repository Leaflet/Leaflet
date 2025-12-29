---
layout: tutorial_frame
title: Basic Setup Example
customMapContainer: "true"
---
<div id='map' style='width: 600px; height: 400px;'></div>
<script type="module">
	import {LeafletMap, TileLayer} from 'leaflet';

	const map = new LeafletMap('map').setView([51.505, -0.09], 13);

	const tiles = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
</script>

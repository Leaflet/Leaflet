---
layout: tutorial_frame
title: Mobile Example
css: "body {
		padding: 0;
		margin: 0;
	}
	#map {
		height: 100%;
		width: 100vw;
	}"
---
<script type="module">
	import {LeafletMap, TileLayer, Marker, Circle} from 'leaflet';
	const map = new LeafletMap('map').fitWorld();

	const tiles = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	function onLocationFound(e) {
		const radius = e.accuracy / 2;

		const locationMarker = new Marker(e.latlng).addTo(map)
			.bindPopup(`You are within ${radius} meters from this point`).openPopup();

		const locationCircle = new Circle(e.latlng, radius).addTo(map);
	}

	function onLocationError(e) {
		alert(e.message);
	}

	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);

	map.locate({setView: true, maxZoom: 16});
</script>

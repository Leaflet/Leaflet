---
layout: tutorial_frame
title: Mobile tutorial
css: "body {
		padding: 0;
		margin: 0;
	}
	#map {
		height: 100%;
		width: 100vw;
	}"
---
<script>
	const map = L.map('map').fitWorld();

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	function onLocationFound(e) {
		const radius = e.accuracy / 2;

		const locationMarker = L.marker(e.latlng).addTo(map)
			.bindPopup(`You are within ${radius} meters from this point`).openPopup();

		const locationCircle = L.circle(e.latlng, radius).addTo(map);
	}

	function onLocationError(e) {
		alert(e.message);
	}

	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);

	map.locate({setView: true, maxZoom: 16});
</script>

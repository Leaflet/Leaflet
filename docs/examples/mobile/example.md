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
	var map = L.map('map').fitWorld();

	var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	function onLocationFound(e) {
		var radius = e.accuracy / 2;

		var locationMarker = L.marker(e.latlng).addTo(map)
			.bindPopup('You are within ' + radius + ' meters from this point').openPopup();

		var locationCircle = L.circle(e.latlng, radius).addTo(map);
	}

	function onLocationError(e) {
		alert(e.message);
	}

	map.on('locationfound', onLocationFound);
	map.on('locationerror', onLocationError);

	map.locate({setView: true, maxZoom: 16});
</script>

---
layout: tutorial_frame
title: Accessible markers
---

<script>

	var map = L.map('map').setView([50.4501, 30.5234], 4);

	var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/streets-v11',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);

	var marker = L.marker([50.4501, 30.5234], {alt: 'Kyiv'}).addTo(map)
		.bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');

</script>

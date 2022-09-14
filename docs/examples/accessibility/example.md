---
layout: tutorial_frame
title: Accessible markers
---

<script>

	var map = L.map('map').setView([50.4501, 30.5234], 4);

	var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	var marker = L.marker([50.4501, 30.5234], {alt: 'Kyiv'}).addTo(map)
		.bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');

</script>

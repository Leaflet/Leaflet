---
layout: tutorial_frame
title: Accessible markers
---

<script>

	const map = L.map('map').setView([50.4501, 30.5234], 4);

	const tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	const marker = L.marker([50.4501, 30.5234], {alt: 'Kyiv'}).addTo(map)
		.bindPopup('Kyiv, Ukraine is the birthplace of Leaflet!');

</script>

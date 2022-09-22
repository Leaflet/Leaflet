---
layout: tutorial_frame
title: SVG Overlay Tutorial
---
<script>
	var map = L.map('map');

	var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	var svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	svgElement.setAttribute('viewBox', '0 0 200 200');
	svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
	var latLngBounds = L.latLngBounds([[32, -130], [13, -100]]);

	map.fitBounds(latLngBounds);

	var svgOverlay = L.svgOverlay(svgElement, latLngBounds, {
		opacity: 0.7,
		interactive: true
	}).addTo(map);
</script>

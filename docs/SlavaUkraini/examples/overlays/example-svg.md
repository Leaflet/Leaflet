---
layout: tutorial_frame
title: SVG Overlay Tutorial
---
<script>
	var map = L.map('map');

	var tiles = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/satellite-v9',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);

	var svgElement = document.createElementNS("http://www.w3.org/2000/svg", "svg");
	svgElement.setAttribute('xmlns', "http://www.w3.org/2000/svg");
	svgElement.setAttribute('viewBox', "0 0 200 200");
	svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
	var latLngBounds= L.latLngBounds([[32, -130], [13, -100]]);

	map.fitBounds(latLngBounds);

	var svgOverlay = L.svgOverlay(svgElement, latLngBounds, {
		opacity: 0.7,
		interactive: true
	}).addTo(map)
</script>
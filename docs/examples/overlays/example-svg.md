---
layout: tutorial_frame
title: SVG Overlay Tutorial
---
<script type="module">
	import L, {Map, TileLayer, LatLngBounds, SVGOverlay} from 'leaflet';

	const map = new Map('map');

	const tiles = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	const svgElement = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
	svgElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
	svgElement.setAttribute('viewBox', '0 0 200 200');
	svgElement.innerHTML = '<rect width="200" height="200"/><rect x="75" y="23" width="50" height="50" style="fill:red"/><rect x="75" y="123" width="50" height="50" style="fill:#0013ff"/>';
	const latLngBounds = new LatLngBounds([[32, -130], [13, -100]]);

	map.fitBounds(latLngBounds);

	const svgOverlay = new SVGOverlay(svgElement, latLngBounds, {
		opacity: 0.7,
		interactive: true
	}).addTo(map);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

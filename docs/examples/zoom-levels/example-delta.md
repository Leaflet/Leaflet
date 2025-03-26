---
layout: tutorial_frame
title: Zoom Levels Tutorial
---
<script type="module">
	import {Map, TileLayer, Control, DomUtil} from 'leaflet';

	const map = new Map('map', {
		minZoom: 0,
		maxZoom: 18,
		zoomSnap: 0,
		zoomDelta: 0.25
	});

	const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

	const positron = new TileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	const ZoomViewer = Control.extend({
		onAdd() {
			const container = DomUtil.create('div');
			const gauge = DomUtil.create('div');
			container.style.width = '200px';
			container.style.background = 'rgba(255,255,255,0.5)';
			container.style.textAlign = 'left';
			map.on('zoomstart zoom zoomend', (ev) => {
				gauge.innerHTML = `Zoom level: ${map.getZoom()}`;
			});
			container.appendChild(gauge);
			return container;
		}
	});

	const zoomViewerControl = (new ZoomViewer()).addTo(map);

	map.setView([0, 0], 0);
</script>

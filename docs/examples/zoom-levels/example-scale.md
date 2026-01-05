---
layout: tutorial_frame
title: Zoom Scale Example
---
<script type="module">
	import {LeafletMap, TileLayer, ScaleControl} from 'leaflet';

	const map = new LeafletMap('map', {
		minZoom: 1,
		maxZoom: 1,
		dragging: false
	});

	const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

	const positron = new TileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	const scaleControl = new ScaleControl({maxWidth: 150}).addTo(map);

	setInterval(() => {
		map.setView([0, 0], 0, {duration: 1, animate: true});
		setTimeout(() => {
			map.setView([60, 0], 0, {duration: 1, animate: true});
		}, 2000);
	}, 4000);

	map.setView([0, 0], 0);
</script>

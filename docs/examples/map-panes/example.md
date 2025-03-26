---
layout: tutorial_frame
title: Custom Icons Tutorial
---
<script type="text/javascript" src="eu-countries.js"></script>

<script type="module">
	import {Map, CRS, TileLayer, GeoJSON} from 'leaflet';
	const map = new Map('map');

	map.createPane('labels');

	// This pane is above markers but below popups
	map.getPane('labels').style.zIndex = 650;

	// Layers in this pane are non-interactive and do not obscure mouse/touch events
	map.getPane('labels').style.pointerEvents = 'none';

	const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

	const positron = new TileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	const positronLabels = new TileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution,
		pane: 'labels'
	}).addTo(map);

	/* global euCountries */
	const geojson = new GeoJSON(euCountries).addTo(map);

	geojson.eachLayer((layer) => {
		layer.bindPopup(layer.feature.properties.name);
	});

	map.setView({lat: 47.040182144806664, lng: 9.667968750000002}, 4);
</script>

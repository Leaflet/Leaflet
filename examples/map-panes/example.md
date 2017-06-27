---
layout: tutorial_frame
title: Custom Icons Tutorial
---
<script type="text/javascript" src="eu-countries.js"></script>

<script>

	var map = L.map('map');

	map.createPane('labels');

	// This pane is above markers but below popups
	map.getPane('labels').style.zIndex = 650;

	// Layers in this pane are non-interactive and do not obscure mouse/touch events
	map.getPane('labels').style.pointerEvents = 'none';


	var cartodbAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

	var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	var positronLabels = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution,
		pane: 'labels'
	}).addTo(map);

	geojson = L.geoJson(euCountries).addTo(map);

	geojson.eachLayer(function (layer) {
		layer.bindPopup(layer.feature.properties.name);
	});

	map.setView({ lat: 47.040182144806664, lng: 9.667968750000002 }, 4);
</script>

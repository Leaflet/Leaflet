---
layout: tutorial_frame
title: Choropleth Tutorial
---
<script type="text/javascript" src="us-states.js"></script>
<script type="text/javascript">

	var map = L.map('map').setView([37.8, -96], 4);

	var tiles = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	/* global statesData */
	var geojson = L.geoJson(statesData).addTo(map);

</script>

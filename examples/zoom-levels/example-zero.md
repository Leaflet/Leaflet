---
layout: tutorial_frame
title: Zoom Levels Tutorial
---
<script>

	var map = L.map('map', {
		minZoom: 0,
		maxZoom: 0
	});

	var cartodbAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

	var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	map.setView([0, 0], 0);
</script>

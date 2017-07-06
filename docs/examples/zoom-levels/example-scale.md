---
layout: tutorial_frame
title: Zoom Levels Tutorial
---
<script>

	var map = L.map('map', {
		minZoom: 1,
		maxZoom: 1,
		dragging: false
	});

	var cartodbAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

	var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	L.control.scale({maxWidth: 150}).addTo(map);

	setInterval(function(){
		map.setView([0, 0], 0, {duration: 1, animate: true});
		setTimeout(function(){
			map.setView([60, 0], 0, {duration: 1, animate: true});
		}, 2000);
	}, 4000);

	map.setView([0, 0], 0);
</script>

---
layout: tutorial_frame
title: Zoom Levels Tutorial
---
<script>

	const map = L.map('map', {
		minZoom: 1,
		maxZoom: 1,
		dragging: false
	});

	const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

	const positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	const scaleControl = L.control.scale({maxWidth: 150}).addTo(map);

	setInterval(() => {
		map.setView([0, 0], 0, {duration: 1, animate: true});
		setTimeout(() => {
			map.setView([60, 0], 0, {duration: 1, animate: true});
		}, 2000);
	}, 4000);

	map.setView([0, 0], 0);
</script>

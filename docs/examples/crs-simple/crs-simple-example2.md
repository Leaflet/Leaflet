---
layout: tutorial_frame
title: CRS.Simple example
---
<script>

	const map = L.map('map', {
		crs: L.CRS.Simple,
		minZoom: -3
	});

	const bounds = [[-26.5, -25], [1021.5, 1023]];
	const image = L.imageOverlay('uqm_map_full.png', bounds).addTo(map);

	const sol = L.latLng([145, 175]);
	const marker = L.marker(sol).addTo(map);

	map.setView([70, 120], 1);

</script>

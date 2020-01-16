---
layout: tutorial_frame
title: CRS.Simple example
---
<script>

	var map = L.map('map', {
		crs: L.CRS.Simple,
		minZoom: -3
	});

	var bounds = [[-26.5,-25], [1021.5,1023]];
	var image = L.imageOverlay('uqm_map_full.png', bounds).addTo(map);

	var sol = L.latLng([ 145, 175 ]);
	L.marker(sol).addTo(map);

	map.setView( [70, 120], 1);

</script>
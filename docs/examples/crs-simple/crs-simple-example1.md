---
layout: tutorial_frame
title: CRS.Simple example
---
<script>

	const map = L.map('map', {
		crs: L.CRS.Simple
	});

	const bounds = [[0, 0], [1000, 1000]];
	const image = L.imageOverlay('uqm_map_full.png', bounds).addTo(map);

	map.fitBounds(bounds);

</script>

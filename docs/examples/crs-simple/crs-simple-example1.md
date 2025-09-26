---
layout: tutorial_frame
title: CRS.Simple Example
---
<script type="module">
	import {Map, CRS, ImageOverlay} from 'leaflet';

	const map = new Map('map', {
		crs: CRS.Simple
	});

	const bounds = [[0, 0], [1000, 1000]];
	const image = new ImageOverlay('uqm_map_full.png', bounds).addTo(map);

	map.fitBounds(bounds);
</script>

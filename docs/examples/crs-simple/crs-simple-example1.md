---
layout: tutorial_frame
title: CRS.Simple example
---
<script type="module">
	import L, {Map, CRS, ImageOverlay} from 'leaflet';

	const map = new Map('map', {
		crs: CRS.Simple
	});

	const bounds = [[0, 0], [1000, 1000]];
	const image = new ImageOverlay('uqm_map_full.png', bounds).addTo(map);

	map.fitBounds(bounds);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

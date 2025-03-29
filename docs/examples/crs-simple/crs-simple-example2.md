---
layout: tutorial_frame
title: CRS.Simple example
---
<script type="module">
	import L, {Map, CRS, ImageOverlay, LatLng, Marker} from 'leaflet';

	const map = new Map('map', {
		crs: CRS.Simple,
		minZoom: -3
	});

	const bounds = [[-26.5, -25], [1021.5, 1023]];
	const image = new ImageOverlay('uqm_map_full.png', bounds).addTo(map);

	const sol = new LatLng([145, 175]);
	const marker = new Marker(sol).addTo(map);

	map.setView([70, 120], 1);

	window.L = L; // only for debugging in the developer console
	window.map = map; // only for debugging in the developer console
</script>

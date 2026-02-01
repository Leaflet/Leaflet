---
layout: tutorial_frame
title: SimpleCRS Example
---
<script type="module">
	import {LeafletMap, SimpleCRS, ImageOverlay, LatLng, Marker} from 'leaflet';

	const map = new LeafletMap('map', {
		crs: SimpleCRS,
		minZoom: -3
	});

	const bounds = [[-26.5, -25], [1021.5, 1023]];
	const image = new ImageOverlay('uqm_map_full.png', bounds).addTo(map);

	const sol = new LatLng([145, 175]);
	const marker = new Marker(sol).addTo(map);

	map.setView([70, 120], 1);
</script>

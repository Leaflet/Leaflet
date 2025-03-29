---
layout: tutorial_frame
title: Leaflet class diagram
css: "#map {
            width: 100vw;
            height: 100%;
        }"
---
<script type="module">
	import L, {Map, CRS, ImageOverlay} from 'leaflet';

	const bounds = [[0, 0], [1570, 1910]];

	const map = new Map('map', {
		crs: CRS.Simple,
		maxZoom: 0,
		minZoom: -4,
		maxBounds: bounds
	});

	const image = new ImageOverlay('class-diagram.png', bounds).addTo(map);

	map.fitBounds(bounds);

	window.L = L; // only for debugging in the developer console
	window.map = map; // only for debugging in the developer console
</script>

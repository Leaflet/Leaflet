---
layout: tutorial_frame
title: Leaflet Class Diagram
css: "#map {
            width: 100vw;
            height: 100%;
        }"
---
<script type="module">
	import L, {LeafletMap, CRS, ImageOverlay} from 'leaflet';

	const bounds = [[0, 0], [1570, 1910]];

	const map = new LeafletMap('map', {
		crs: CRS.Simple,
		maxZoom: 0,
		minZoom: -4,
		maxBounds: bounds
	});

	const image = new ImageOverlay('class-diagram.png', bounds).addTo(map);

	map.fitBounds(bounds);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

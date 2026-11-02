---
layout: tutorial_frame
title: Leaflet Class Diagram
css: "#map {
            background: #fff;
        }"
---
<script type="module">
	import {LeafletMap, SimpleCRS, ImageOverlay} from 'leaflet';

	const bounds = [[0, 0], [1247, 1666]];

	const map = new LeafletMap('map', {
		crs: SimpleCRS,
		maxZoom: 1,
		minZoom: -4,
		maxBounds: bounds
	});

	const image = new ImageOverlay('class-diagram.svg', bounds).addTo(map);

	map.fitBounds(bounds);
</script>

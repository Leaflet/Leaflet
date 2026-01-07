---
layout: tutorial_frame
title: SimpleCRS Example
---
<script type="module">
	import {LeafletMap, SimpleCRS, ImageOverlay} from 'leaflet';

	const map = new LeafletMap('map', {
		crs: SimpleCRS
	});

	const bounds = [[0, 0], [1000, 1000]];
	const image = new ImageOverlay('uqm_map_full.png', bounds).addTo(map);

	map.fitBounds(bounds);
</script>

---
layout: tutorial_frame
title: WMS Example 2
---
<script type="module">
	import L, {Map, CRS, TileLayer} from 'leaflet';

	const map = new Map('map', {
		center: [-17, -67],
		zoom: 3
	});

	const wmsLayer = new TileLayer.WMS('http://ows.mundialis.de/services/service?', {
		layers: 'SRTM30-Colored-Hillshade'
	}).addTo(map);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

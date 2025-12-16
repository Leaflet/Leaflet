---
layout: tutorial_frame
title: WMS Example 1
---
<script type="module">
	import L, {LeafletMap, CRS, TileLayer} from 'leaflet';

	const map = new LeafletMap('map', {
		center: [-17, -67],
		zoom: 3
	});

	const wmsLayer = new TileLayer.WMS('http://ows.mundialis.de/services/service?', {
		layers: 'TOPO-OSM-WMS'
	}).addTo(map);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

---
layout: tutorial_frame
title: WMS Example 1
---
<script type="module">
	import {LeafletMap, CRS, TileLayerWMS} from 'leaflet';

	const map = new LeafletMap('map', {
		center: [-17, -67],
		zoom: 3
	});

	const wmsLayer = new TileLayerWMS('http://ows.mundialis.de/services/service?', {
		layers: 'TOPO-OSM-WMS'
	}).addTo(map);
</script>

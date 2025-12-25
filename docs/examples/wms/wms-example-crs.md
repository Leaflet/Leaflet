---
layout: tutorial_frame
title: WMS CRS Example
---
<script type="module">
	import {LeafletMap, CRS, TileLayer} from 'leaflet';

	const map = new LeafletMap('map', {
		center: [0, 0],
		zoom: 1,
		crs: CRS.EPSG4326
	});

	const wmsLayer = new TileLayer.WMS('http://ows.mundialis.de/services/service?', {
		layers: 'TOPO-OSM-WMS'
	}).addTo(map);
</script>

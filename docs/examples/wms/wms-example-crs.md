---
layout: tutorial_frame
title: WMS example
---
<script type="module">
	import {Map, CRS, TileLayer} from 'leaflet';

	const map = new Map('map', {
		center: [0, 0],
		zoom: 1,
		crs: CRS.EPSG4326
	});

	const wmsLayer = new TileLayer.WMS('http://ows.mundialis.de/services/service?', {
		layers: 'TOPO-OSM-WMS'
	}).addTo(map);


</script>

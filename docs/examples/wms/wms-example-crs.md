---
layout: tutorial_frame
title: WMS CRS Example
---
<script type="module">
	import {LeafletMap, EPSG4326, WMSTileLayer} from 'leaflet';

	const map = new LeafletMap('map', {
		center: [0, 0],
		zoom: 1,
		crs: EPSG4326
	});

	const wmsLayer = new WMSTileLayer('http://ows.mundialis.de/services/service?', {
		layers: 'TOPO-OSM-WMS'
	}).addTo(map);
</script>

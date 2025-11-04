---
layout: tutorial_frame
title: WMS CRS Example
---
<script type="module">
	import L, {LeafletMap, CRS, TileLayer} from 'leaflet';

	const map = new LeafletMap('map', {
		center: [0, 0],
		zoom: 1,
		crs: CRS.EPSG4326
	});

	const wmsLayer = new TileLayer.WMS('http://ows.mundialis.de/services/service?', {
		layers: 'TOPO-OSM-WMS'
	}).addTo(map);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

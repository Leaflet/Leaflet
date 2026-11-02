---
layout: tutorial_frame
title: WMS Example 2
---
<script type="module">
	import {LeafletMap, CRS, WMSTileLayer} from 'leaflet';

	const map = new LeafletMap('map', {
		center: [-17, -67],
		zoom: 3
	});

	const wmsLayer = new WMSTileLayer('https://ows.mundialis.de/osm/service?', {
		layers: 'SRTM30-Colored-Hillshade'
	}).addTo(map);
</script>

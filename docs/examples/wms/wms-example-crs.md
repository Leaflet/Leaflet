---
layout: tutorial_frame
title: WMS example
---
<script type='text/javascript'>

	const map = L.map('map', {
		center: [0, 0],
		zoom: 1,
		crs: L.CRS.EPSG4326
	});

	const wmsLayer = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
		layers: 'TOPO-OSM-WMS'
	}).addTo(map);


</script>

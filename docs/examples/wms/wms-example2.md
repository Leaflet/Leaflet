---
layout: tutorial_frame
title: WMS example
---
<script type='text/javascript'>

	var map = L.map('map', {
		center: [-17, -67],
		zoom: 3
	});

	var wmsLayer = L.tileLayer.wms('http://ows.mundialis.de/services/service?', {
		layers: 'SRTM30-Colored-Hillshade'
	}).addTo(map);

</script>

---
layout: tutorial_frame
title: Leaflet class diagram
---
<script type='text/javascript'>

	var bounds = [[0,0], [1570,1910]];

	var map = L.map('map', {
		crs: L.CRS.Simple,
		maxZoom: 0,
		minZoom: -4,
		maxBounds: bounds
	});

	map.getContainer().style.width = '100vw';
	map.getContainer().style.height= '100vh';
	document.body.style.margin = 0;

	var image = L.imageOverlay('class-diagram.png', bounds).addTo(map);

	map.fitBounds(bounds);

</script>

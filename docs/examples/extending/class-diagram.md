---
layout: tutorial_frame
title: Leaflet class diagram
css: "#map {
            width: 100vw;
            height: 100%;
        }"
---
<script type='text/javascript'>

	const bounds = [[0, 0], [1570, 1910]];

	const map = L.map('map', {
		crs: L.CRS.Simple,
		maxZoom: 0,
		minZoom: -4,
		maxBounds: bounds
	});

	const image = L.imageOverlay('class-diagram.png', bounds).addTo(map);

	map.fitBounds(bounds);

</script>

---
layout: tutorial_frame
title: Leaflet class diagram
css: "#map {
            width: 100vw;
            height: 100%;
        }"
---
<script type='text/javascript'>

	// Fetch the size of the image, since it's automatically (re)-generated at
	// every Leaflet release
	const image = new Image();
	image.addEventListener('load', () => {

		const bounds = [[0, 0], [image.naturalWidth, image.naturalHeight]];

		const map = L.map('map', {
			crs: L.CRS.Simple,
			maxZoom: 0,
			minZoom: -4,
			maxBounds: bounds
		});

		L.imageOverlay('class-diagram.png', bounds).addTo(map);

		map.fitBounds(bounds);
	});

</script>

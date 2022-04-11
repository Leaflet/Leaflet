---
layout: tutorial_frame
title: SVG Overlay Tutorial
---
<script>
	var map = L.map('map').setView([37.8, -96], 4);

	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
			'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/satellite-v9',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);

	var imageUrl = 'https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg';
	var imageBounds = [[40.712216, -74.22655], [40.773941, -74.12544]];
	var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
	var altText = 'Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.';
	var latLngBounds = L.latLngBounds([[32, -130], [13, -100]]);

	var imageOverlay = L.imageOverlay( imageUrl, latLngBounds, {
		opacity: 0.8,
		errorOverlayUrl: errorOverlayUrl,
		alt: altText,
		interactive: true
	}).addTo(map);

	L.rectangle(latLngBounds).addTo(map);        
	map.fitBounds(latLngBounds);
</script>
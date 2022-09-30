---
layout: tutorial_frame
title: Image Overlay Tutorial
---
<script>
	var map = L.map('map').setView([37.8, -96], 4);

	var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	var imageUrl = 'https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg';
	var errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
	var altText = 'Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.';
	var latLngBounds = L.latLngBounds([[40.799311, -74.118464], [40.68202047785919, -74.33]]);

	var imageOverlay = L.imageOverlay(imageUrl, latLngBounds, {
		opacity: 0.8,
		errorOverlayUrl: errorOverlayUrl,
		alt: altText,
		interactive: true
	}).addTo(map);

	L.rectangle(latLngBounds).addTo(map);
	map.fitBounds(latLngBounds);
</script>

---
layout: tutorial_frame
title: Image Overlay Tutorial
---
<script type="module">
	import L, {Map, TileLayer, LatLngBounds, ImageOverlay, Rectangle} from 'leaflet';

	const map = new Map('map').setView([37.8, -96], 4);

	const osm = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	const imageUrl = 'https://maps.lib.utexas.edu/maps/historical/newark_nj_1922.jpg';
	const errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
	const altText = 'Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.';
	const latLngBounds = new LatLngBounds([[40.799311, -74.118464], [40.68202047785919, -74.33]]);

	const imageOverlay = new ImageOverlay(imageUrl, latLngBounds, {
		opacity: 0.8,
		errorOverlayUrl,
		alt: altText,
		interactive: true
	}).addTo(map);

	new Rectangle(latLngBounds).addTo(map);
	map.fitBounds(latLngBounds);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

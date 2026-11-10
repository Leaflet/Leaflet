---
layout: tutorial_frame
title: Image Overlay Tutorial
customMapContainer: true
css: |
  body {
    display: grid;
    grid-template-rows: auto minmax(0, 1fr);
  }
  .opacity-control {
    padding: 0.5rem;
    font: 1rem system-ui, sans-serif;
  }
  .opacity-control input {
    vertical-align: middle;
  }
---
<div class="opacity-control">
	<label for="overlay-opacity">Image overlay opacity</label>
	<input id="overlay-opacity" type="range" min="0" max="1" step="0.01" value="0.8">
</div>
<div id="map"></div>

<script type="module">
	import {LeafletMap, TileLayer, LatLngBounds, ImageOverlay} from 'leaflet';

	const map = new LeafletMap('map').setView([37.8, -96], 4);

	const osm = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	const imageUrl = 'newark_nj_1922.jpg';
	const errorOverlayUrl = 'https://cdn-icons-png.flaticon.com/512/110/110686.png';
	const altText = 'Image of Newark, N.J. in 1922. Source: The University of Texas at Austin, UT Libraries Map Collection.';
	const latLngBounds = new LatLngBounds([[40.799311, -74.118464], [40.68202047785919, -74.33]]);

	const imageOverlay = new ImageOverlay(imageUrl, latLngBounds, {
		opacity: 0.8,
		errorOverlayUrl,
		alt: altText,
		interactive: true
	}).addTo(map);

	map.fitBounds(latLngBounds);

	const opacity = document.getElementById('overlay-opacity');
	opacity.addEventListener('input', () => {
		imageOverlay.setOpacity(opacity.valueAsNumber);
	});
</script>

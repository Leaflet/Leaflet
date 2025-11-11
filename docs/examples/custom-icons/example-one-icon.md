---
layout: tutorial_frame
title: Single Custom Icon Example
---
<script type="module">
	import L, {LeafletMap, TileLayer, Marker, Icon} from 'leaflet';
	const map = new LeafletMap('map').setView([51.5, -0.09], 13);

	new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	const LeafIcon = Icon.extend({
		options: {
			shadowUrl: 'leaf-shadow.png',
			iconSize:     [38, 95],
			shadowSize:   [50, 64],
			iconAnchor:   [22, 94],
			shadowAnchor: [4, 62],
			popupAnchor:  [-3, -76]
		}
	});

	const greenIcon = new LeafIcon({iconUrl: 'leaf-green.png'});

	const mGreen = new Marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

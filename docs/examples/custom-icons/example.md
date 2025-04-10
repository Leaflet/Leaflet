---
layout: tutorial_frame
title: Custom Icons Tutorial
---
<script type="module">
	import L, {Map, TileLayer, Marker, Icon} from 'leaflet';
	const map = new Map('map').setView([51.5, -0.09], 13);

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
	const redIcon = new LeafIcon({iconUrl: 'leaf-red.png'});
	const orangeIcon = new LeafIcon({iconUrl: 'leaf-orange.png'});

	const mGreen = new Marker([51.5, -0.09], {icon: greenIcon}).bindPopup('I am a green leaf.').addTo(map);
	const mRed = new Marker([51.495, -0.083], {icon: redIcon}).bindPopup('I am a red leaf.').addTo(map);
	const mOrange = new Marker([51.49, -0.1], {icon: orangeIcon}).bindPopup('I am an orange leaf.').addTo(map);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

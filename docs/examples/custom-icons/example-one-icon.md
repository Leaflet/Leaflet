---
layout: tutorial_frame
title: Custom Icons Tutorial
---
<script type="module">
	import {Map, TileLayer, Marker, Icon} from 'leaflet';
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

	const mGreen = new Marker([51.5, -0.09], {icon: greenIcon}).addTo(map);

</script>

---
layout: tutorial_frame
title: Watermark control
---
<script type="module">
	import L, {Map, TileLayer, Control, DomUtil} from 'leaflet';

	const map = new Map('map', {
		center: [40, 0],
		zoom: 1
	});

	const osm = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	Control.Watermark = Control.extend({
		onAdd(map) {
			const img = DomUtil.create('img');

			img.src = '../../docs/images/logo.png';
			img.style.width = '200px';

			return img;
		},

		onRemove(map) {
			// Nothing to do here
		}
	});
	
	const watermarkControl = new Control.Watermark({position: 'bottomleft'}).addTo(map);

	window.L = L; // only for debugging in the developer console
	window.map = map; // only for debugging in the developer console
</script>

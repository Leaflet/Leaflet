---
layout: tutorial_frame
title: Watermark Control Example
---
<script type="module">
	import {LeafletMap, TileLayer, Control, DomUtil} from 'leaflet';

	const map = new LeafletMap('map', {
		center: [40, 0],
		zoom: 1
	});

	const osm = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	class WatermarkControl extends Control {
		onAdd(map) {
			const img = DomUtil.create('img');

			img.src = '../../docs/images/logo.png';
			img.style.width = '200px';

			return img;
		}

		onRemove(map) {
			// Nothing to do here
		}
	}
	
	const watermarkControl = new WatermarkControl({position: 'bottomleft'}).addTo(map);
</script>

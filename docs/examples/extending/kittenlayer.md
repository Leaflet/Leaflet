---
layout: tutorial_frame
title: KittenLayer
---
<script type="module">
	import {Map, CRS, TileLayer} from 'leaflet';

	const map = new Map('map', {
		crs: CRS.Simple,
		center: [0, 0],
		zoom: 5
	});

	TileLayer.Kitten = TileLayer.extend({
		getTileUrl(coords) {
			const i = Math.ceil(Math.random() * 4) - 1;
			const tag = ['orange', 'hat', 'cute', 'small'];
			return `https://cataas.com/cat/${tag[i]}?width=256&height=256`;
		},
		getAttribution() {
			return '<a href="https://cataas.com/">CATAAS - Cat as a service</a>';
		}
	});

	const kittenTiles = new TileLayer.Kitten();
	map.addLayer(kittenTiles);
	
</script>

---
layout: tutorial_frame
title: KittenLayer Example
---
<script type="module">
	import {LeafletMap, SimpleCRS, TileLayer} from 'leaflet';

	const map = new LeafletMap('map', {
		crs: SimpleCRS,
		center: [0, 0],
		zoom: 5
	});

	class KittenTileLayer extends TileLayer {
		getTileUrl(coords) {
			const i = Math.ceil(Math.random() * 4) - 1;
			const tag = ['orange', 'hat', 'cute', 'small'];
			return `https://cataas.com/cat/${tag[i]}?width=256&height=256`;
		}
		getAttribution() {
			return '<a href="https://cataas.com/">CATAAS - Cat as a service</a>';
		}
	}

	const kittenTiles = new KittenTileLayer();
	map.addLayer(kittenTiles);
</script>

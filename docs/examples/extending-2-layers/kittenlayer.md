---
layout: tutorial_frame
title: KittenLayer Example
---
<script type="module">
	import L, {LeafletMap, CRS, TileLayer} from 'leaflet';

	const map = new LeafletMap('map', {
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

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

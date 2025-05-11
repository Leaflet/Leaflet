---
layout: tutorial_frame
title: CanvasCircles Example
---
<script type="module">
	import L, {Map, GridLayer} from 'leaflet';

	const map = new Map('map', {
		center: [0, 0],
		zoom: 0
	});

	GridLayer.CanvasCircles = GridLayer.extend({
		createTile(coords) {
			const tile = document.createElement('canvas');

			const tileSize = this.getTileSize();
			tile.setAttribute('width', tileSize.x);
			tile.setAttribute('height', tileSize.y);

			const ctx = tile.getContext('2d');

			// Draw whatever is needed in the canvas context
			// For example, circles which get bigger as we zoom in
			ctx.arc(tileSize.x / 2, tileSize.x / 2, 4 + coords.z * 4, 0, 2 * Math.PI, false);
			ctx.fill();

			return tile;
		}
	});

	const cavasGridLayer = new GridLayer.CanvasCircles();
	map.addLayer(cavasGridLayer);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

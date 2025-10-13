---
layout: tutorial_frame
title: Grid Coordinates Example
---
<script type="module">
	import {Map, GridLayer} from 'leaflet';

	const map = new Map('map', {
		center: [0, 0],
		zoom: 0
	});

	GridLayer.DebugCoords = GridLayer.extend({
		createTile(coords, done) {
			const tile = document.createElement('div');
			tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
			tile.style.outline = '1px solid red';

			setTimeout(() => {
				done(null, tile); // Syntax is 'done(error, tile)'
			}, 500 + Math.random() * 1500);

			return tile;
		}
	});
	
	const debugCoordsGrid = new GridLayer.DebugCoords();
	map.addLayer(debugCoordsGrid);
</script>

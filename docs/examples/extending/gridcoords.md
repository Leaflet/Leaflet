---
layout: tutorial_frame
title: Grid coordinates
---
<script type="module">
	import L, {Map, GridLayer} from 'leaflet';

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

	window.L = L; // only for debugging in the developer console
	window.map = map; // only for debugging in the developer console
</script>

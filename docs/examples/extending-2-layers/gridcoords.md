---
layout: tutorial_frame
title: Grid Coordinates Example
---
<script type="module">
	import {LeafletMap, GridLayer} from 'leaflet';

	const map = new LeafletMap('map', {
		center: [0, 0],
		zoom: 0
	});

	class DebugCoordsGridLayer extends GridLayer {
		createTile(coords, done) {
			const tile = document.createElement('div');
			tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
			tile.style.outline = '1px solid red';

			setTimeout(() => {
				done(null, tile); // Syntax is 'done(error, tile)'
			}, 500 + Math.random() * 1500);

			return tile;
		}
	}
	
	const debugCoordsGrid = new DebugCoordsGridLayer();
	map.addLayer(debugCoordsGrid);
</script>

---
layout: tutorial_frame
title: WMS Example 3
---
<script type="module">
	import L, {LeafletMap, CRS, TileLayer, Control} from 'leaflet';

	const map = new LeafletMap('map', {
		center: [-17, -67],
		zoom: 3
	});

	const basemaps = {
		Topography: new TileLayer.WMS('http://ows.mundialis.de/services/service?', {
			layers: 'TOPO-WMS'
		}),

		Places: new TileLayer.WMS('http://ows.mundialis.de/services/service?', {
			layers: 'OSM-Overlay-WMS'
		}),

		'Topography, then places': new TileLayer.WMS('http://ows.mundialis.de/services/service?', {
			layers: 'TOPO-WMS,OSM-Overlay-WMS'
		}),

		'Places, then topography': new TileLayer.WMS('http://ows.mundialis.de/services/service?', {
			layers: 'OSM-Overlay-WMS,TOPO-WMS'
		})
	};

	const layerControl = new Control.Layers(basemaps, {}, {collapsed: false}).addTo(map);

	basemaps.Topography.addTo(map);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

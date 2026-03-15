---
layout: tutorial_frame
title: WMS Example 3
---
<script type="module">
	import {LeafletMap, CRS, WMSTileLayer, LayersControl} from 'leaflet';

	const map = new LeafletMap('map', {
		center: [-17, -67],
		zoom: 3
	});

	const basemaps = {
		Topography: new WMSTileLayer('http://ows.mundialis.de/services/service?', {
			layers: 'TOPO-WMS'
		}),

		Places: new WMSTileLayer('http://ows.mundialis.de/services/service?', {
			layers: 'OSM-Overlay-WMS'
		}),

		'Topography, then places': new WMSTileLayer('http://ows.mundialis.de/services/service?', {
			layers: 'TOPO-WMS,OSM-Overlay-WMS'
		}),

		'Places, then topography': new WMSTileLayer('http://ows.mundialis.de/services/service?', {
			layers: 'OSM-Overlay-WMS,TOPO-WMS'
		})
	};

	const layerControl = new LayersControl(basemaps, {}, {collapsed: false}).addTo(map);

	basemaps.Topography.addTo(map);
</script>

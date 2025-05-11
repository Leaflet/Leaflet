---
layout: tutorial_frame
title: Fractional Zoom Example
---
<script type="module">
	import L, {Map, TileLayer, Control, DomUtil} from 'leaflet';

	const map = new Map('map', {
		minZoom: 0,
		maxZoom: 1,
		zoomSnap: 0.25,
		dragging: false
	});

	const cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

	const positron = new TileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	function zoomCycle() {
		map.setZoom(0);
		const timeouts = [];
		timeouts.push(setTimeout(() => { map.setZoom(0.25); }, 1000));
		timeouts.push(setTimeout(() => { map.setZoom(0.50); }, 2000));
		timeouts.push(setTimeout(() => { map.setZoom(0.75); }, 3000));
		timeouts.push(setTimeout(() => { map.setZoom(1.00); }, 4000));
		timeouts.push(setTimeout(() => { map.setZoom(0.75); }, 5000));
		timeouts.push(setTimeout(() => { map.setZoom(0.50); }, 6000));
		timeouts.push(setTimeout(() => { map.setZoom(0.25); }, 7000));
	}
	zoomCycle();

	const zoomingInterval = setInterval(zoomCycle, 8000);

	const ZoomViewer = Control.extend({
		onAdd() {
			const container = DomUtil.create('div');
			const gauge = DomUtil.create('div');
			container.style.width = '200px';
			container.style.background = 'rgba(255,255,255,0.5)';
			container.style.textAlign = 'left';
			map.on('zoomstart zoom zoomend', (ev) => {
				gauge.innerHTML = `Zoom level: ${map.getZoom()}`;
			});
			container.appendChild(gauge);
			return container;
		}
	});

	const zoomViewerControl = (new ZoomViewer()).addTo(map);

	map.setView([0, 0], 0);

	globalThis.L = L; // only for debugging in the developer console
	globalThis.map = map; // only for debugging in the developer console
</script>

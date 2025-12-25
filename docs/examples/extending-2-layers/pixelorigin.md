---
layout: tutorial_frame
title: Pixel Origin Examples
---
<style>

#info {
	position:absolute; 
	top:0; 
	right:0; 
	width: 20em; 
	height: 7.5em; 
	background: rgba(255,255,255,.5); 
	z-index:500; 
	font: 12px Sans;
}

.crsMarker {
	border-top: 2px green solid;
	border-left: 2px green solid;
}
</style>

<div id='info' style=''></div>

<script type="module">
	import {LeafletMap, TileLayer, Marker, DivIcon, Polyline, DomUtil} from 'leaflet';

	const trd = [63.41, 10.41];

	const map = new LeafletMap('map', {
		center: [40, 0],
		zoom: 1
	});

	const positron = new TileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
	}).addTo(map);

	const marker = new Marker(trd).addTo(map);

	const pane = map.getPane('markerPane');

	const paneCorner = document.createElement('div');
	paneCorner.style.width = '12px';
	paneCorner.style.height = '12px';
	paneCorner.style.borderTop = '2px red solid';
	paneCorner.style.borderLeft = '2px red solid';

	pane.appendChild(paneCorner);

	marker._icon.style.border = '1px solid blue';

	const crsMarker = new Marker(map.unproject([0, 0]), {
		icon: new DivIcon({
			className: 'crsMarker',
			iconAnchor: [0, 0]
		})
	}).addTo(map);


	const markerOffsetLine = new Polyline([[0, 0], [0, 0]], {color: 'skyblue'}).addTo(map);
	const iconOffsetLine = new Polyline([[0, 0], [0, 0]], {color: 'blue'}).addTo(map);
	
	function info() {
		const pixelOrigin = map.getPixelOrigin();
		const markerPixelCoords = map.project(trd, map.getZoom());
		const markerAnchor = marker.options.icon.options.iconAnchor;
		const markerOffset = DomUtil.getPosition(marker._icon);

		document.getElementById('info').innerHTML =
			'<div style="color: green">CRS origin: 0,0</div>' +
			`<div style="color: red">px origin: &Delta;${pixelOrigin.x},${pixelOrigin.y}</div>` +
			`<div style="color: blue">marker px coords:${markerPixelCoords.x.toFixed(2)},${markerPixelCoords.y.toFixed(2)}</div>` +
			`<div style="color: blue">marker anchor: &Delta;${markerAnchor[0]},${markerAnchor[1]}</div>` +
			`<div style="color: skyblue">marker pane offset: &Delta;${markerOffset.x},${markerOffset.y}</div>`;

		markerOffsetLine.setLatLngs([map.unproject(pixelOrigin), map.unproject(pixelOrigin.add(markerOffset))]);
		iconOffsetLine.setLatLngs([map.unproject(pixelOrigin.add(markerOffset)), map.unproject(pixelOrigin.add(markerOffset).subtract(markerAnchor))]);
	}

	map.on('load move moveend zoomend viewreset', info);

	info();
</script>

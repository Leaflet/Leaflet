---
layout: tutorial_frame
title: Grid coordinates
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


<script type='text/javascript'>

	var trd = [63.41, 10.41];


	var map = L.map('map', {
		center: [40, 0],
		zoom: 1
	});

	var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: "CartoDB"
	}).addTo(map);

	var marker = L.marker(trd).addTo(map);
	
	var pane = map.getPane('markerPane')
	
	var paneCorner = document.createElement('div');
	paneCorner.style.width = '12px';
	paneCorner.style.height = '12px';
	paneCorner.style.borderTop = '2px red solid';
	paneCorner.style.borderLeft = '2px red solid';
	
	pane.appendChild(paneCorner);
	
	marker._icon.style.border = '1px solid blue';
	
	var crsMarker = L.marker( map.unproject([0, 0]), {
		icon: L.divIcon({ 
			className: 'crsMarker',
			iconAnchor: [0, 0]
		})
	} ).addTo(map);
	
	
	var markerOffsetLine = L.polyline([[0, 0], [0, 0]], {color: 'skyblue'}).addTo(map);
	var iconOffsetLine = L.polyline([[0, 0], [0, 0]], {color: 'blue'}).addTo(map);
	
	function info() {

		var pixelOrigin = map.getPixelOrigin();
		var markerPixelCoords = map.project(trd, map.getZoom());
		var markerAnchor = marker.options.icon.options.iconAnchor;
		var markerOffset = marker._icon._leaflet_pos;
		
		document.getElementById('info').innerHTML = 
			'<div style="color: green">CRS origin: 0,0</div>' + 
			'<div style="color: red">px origin: &Delta;' + pixelOrigin.x + ',' + pixelOrigin.y + '</div>' + 
			'<div style="color: blue">marker px coords:' + markerPixelCoords.x.toFixed(2) + ',' + markerPixelCoords.y.toFixed(2) + '</div>' + 
			'<div style="color: blue">marker anchor: &Delta;' + markerAnchor[0] + ',' + markerAnchor[1] + '</div>' +
			'<div style="color: skyblue">marker pane offset: &Delta;' + markerOffset.x + ',' + markerOffset.y + '</div>';
		
		markerOffsetLine.setLatLngs([ map.unproject(pixelOrigin), map.unproject(pixelOrigin.add(markerOffset))]);
		iconOffsetLine.setLatLngs([ map.unproject(pixelOrigin.add(markerOffset)), map.unproject(pixelOrigin.add(markerOffset).subtract(markerAnchor))]);
	}
	
	
	map.on('load move moveend zoomend viewreset', info)
	
	info();
	
	
</script>

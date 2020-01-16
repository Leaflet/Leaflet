---
layout: tutorial_frame
title: Zoom Levels Tutorial
---
<script>

	var map = L.map('map', {
		minZoom: 0,
		maxZoom: 1
	});

	var cartodbAttribution = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>';

	var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	setInterval(function(){

		map.setZoom(0);

		setTimeout(function(){
			map.setZoom(1);
		}, 2000);

	}, 4000);

	var ZoomViewer = L.Control.extend({
		onAdd: function(){
			var gauge = L.DomUtil.create('div');
			gauge.style.width = '200px';
			gauge.style.background = 'rgba(255,255,255,0.5)';
			gauge.style.textAlign = 'left';
			map.on('zoomstart zoom zoomend', function(ev){
				gauge.innerHTML = 'Zoom level: ' + map.getZoom();
			})
			return gauge;
		}
	});

	(new ZoomViewer).addTo(map);

	map.setView([0, 0], 0);
</script>

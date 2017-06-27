---
layout: tutorial_frame
title: Zoom Levels Tutorial
---
<script>

	var map = L.map('map', {
		minZoom: 0,
		maxZoom: 1,
		zoomSnap: 0.25,
		dragging: false
	});

	var cartodbAttribution = '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="http://cartodb.com/attributions">CartoDB</a>';

	var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);


	function zoomCycle(){
		map.setZoom(0);
		timeouts = [];
		timeouts.push(setTimeout(function(){ map.setZoom(0.25); },  1000));
		timeouts.push(setTimeout(function(){ map.setZoom(0.50); },  2000));
		timeouts.push(setTimeout(function(){ map.setZoom(0.75); },  3000));
		timeouts.push(setTimeout(function(){ map.setZoom(1);    },  4000));
		timeouts.push(setTimeout(function(){ map.setZoom(0.75); },  5000));
		timeouts.push(setTimeout(function(){ map.setZoom(0.50); },  6000));
		timeouts.push(setTimeout(function(){ map.setZoom(0.25); },  7000));
	}
	zoomCycle();

	var zoomingInterval = setInterval(zoomCycle, 8000);

	var ZoomViewer = L.Control.extend({
		onAdd: function(){

			var container= L.DomUtil.create('div');
			var gauge = L.DomUtil.create('div');
			container.style.width = '200px';
			container.style.background = 'rgba(255,255,255,0.5)';
			container.style.textAlign = 'left';
			map.on('zoomstart zoom zoomend', function(ev){
				gauge.innerHTML = 'Zoom level: ' + map.getZoom();
			})
			container.appendChild(gauge);

			return container;
		}
	});

	(new ZoomViewer).addTo(map);

	map.setView([0, 0], 0);
</script>

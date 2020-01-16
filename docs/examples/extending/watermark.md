---
layout: tutorial_frame
title: Watermark control
---
<script type='text/javascript'>
	var map = L.map('map', {
		center: [40, 0],
		zoom: 1
	});

	var positron = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://carto.com/attribution">CARTO</a>'
	}).addTo(map);

	L.Control.Watermark = L.Control.extend({
		onAdd: function(map) {
			var img = L.DomUtil.create('img');
			
			img.src = '../../docs/images/logo.png';
			img.style.width = '200px';
			
			return img;
		},
		
		onRemove: function(map) {
			// Nothing to do here
		}
	});

	L.control.watermark = function(opts) {
		return new L.Control.Watermark(opts);
	}
	
	L.control.watermark({ position: 'bottomleft' }).addTo(map);
	
</script>

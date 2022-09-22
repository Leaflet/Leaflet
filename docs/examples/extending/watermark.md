---
layout: tutorial_frame
title: Watermark control
---
<script type='text/javascript'>
	var map = L.map('map', {
		center: [40, 0],
		zoom: 1
	});

	var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);

	L.Control.Watermark = L.Control.extend({
		onAdd: function (map) {
			var img = L.DomUtil.create('img');

			img.src = '../../docs/images/logo.png';
			img.style.width = '200px';

			return img;
		},

		onRemove: function (map) {
			// Nothing to do here
		}
	});

	L.control.watermark = function (opts) {
		return new L.Control.Watermark(opts);
	};
	
	var watermarkControl = L.control.watermark({position: 'bottomleft'}).addTo(map);

</script>

---
layout: tutorial_frame
title: Layers Control Tutorial
---
<script>
	var cities = L.layerGroup();

	var mLittleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities);
	var mDenver = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities);
	var mAurora = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities);
	var mGolden = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);

	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';
	var mbUrl = 'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw';

	var grayscale = L.tileLayer(mbUrl, {id: 'mapbox/light-v9', tileSize: 512, zoomOffset: -1, attribution: mbAttr});
	var streets = L.tileLayer(mbUrl, {id: 'mapbox/streets-v11', tileSize: 512, zoomOffset: -1, attribution: mbAttr});

	var map = L.map('map', {
		center: [39.73, -104.99],
		zoom: 10,
		layers: [grayscale, cities]
	});

	var baseLayers = {
		'Grayscale': grayscale,
		'Streets': streets
	};

	var overlays = {
		'Cities': cities
	};

	var layerControl = L.control.layers(baseLayers, overlays).addTo(map);
</script>

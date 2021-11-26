---
layout: tutorial_frame
title: Layers Control Tutorial
---
<script>
	var cities = L.layerGroup();

	var mLittleton = L.marker([39.61, -105.02]).bindPopup('This is Littleton, CO.').addTo(cities),
		mDenver = L.marker([39.74, -104.99]).bindPopup('This is Denver, CO.').addTo(cities),
		mAurora = L.marker([39.73, -104.8]).bindPopup('This is Aurora, CO.').addTo(cities),
		mGolden = L.marker([39.77, -105.23]).bindPopup('This is Golden, CO.').addTo(cities);


	var mbAttr = 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
		'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>';

	var streets = L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
		id: 'mapbox/streets-v11', 
		tileSize: 512, 
		zoomOffset: -1, 
		attribution: mbAttr,
		accessToken: 'pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw'
	});
		
	var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	})

	var map = L.map('map', {
		center: [39.73, -104.99],
		zoom: 10,
		layers: [osm, cities]
	});

	var baseLayers = {
		"OpenStreetMap": osm,
		"Mapbox Streets": streets
	};

	var overlays = {
		"Cities": cities
	};

	var layerControl = L.control.layers(baseLayers, overlays).addTo(map);
</script>

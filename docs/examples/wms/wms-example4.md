---
layout: tutorial_frame
title: WMS example
---
<script type='text/javascript'>

var map = L.map('map', {
		center: [-17, -67],
		zoom: 3
	});

	var tms_ne = L.tileLayer('https://demo.boundlessgeo.com/geoserver/gwc/service/tms/1.0.0/ne:ne@EPSG:900913@png/{z}/{x}/{y}.png', {
		tms: true
	}).addTo(map);

	var tms_bluemarble = L.tileLayer('https://demo.boundlessgeo.com/geoserver/gwc/service/tms/1.0.0/nasa:bluemarble@EPSG:900913@jpg/{z}/{x}/{y}.jpg', {
		tms: true
	});

	var basemaps = {
		'Natural Earth': tms_ne,
		'NASA Blue Marble': tms_bluemarble
	};

	L.control.layers(basemaps, {}, {collapsed: false}).addTo(map);

	basemaps.Countries.addTo(map);

</script>

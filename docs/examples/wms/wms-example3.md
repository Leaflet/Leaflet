---
layout: tutorial_frame
title: WMS example
---
<script type='text/javascript'>

	var map = L.map('map', {
		center: [-17, -67],
		zoom: 3
	});

	var basemaps = {
		Countries: L.tileLayer.wms('https://demo.boundlessgeo.com/geoserver/ows?', {
			layers: 'ne:ne_10m_admin_0_countries'
		}),

		Boundaries: L.tileLayer.wms('https://demo.boundlessgeo.com/geoserver/ows?', {
			layers: 'ne:ne_10m_admin_0_boundary_lines_land'
		}),

		'Countries, then boundaries': L.tileLayer.wms('https://demo.boundlessgeo.com/geoserver/ows?', {
			layers: 'ne:ne_10m_admin_0_countries,ne:ne_10m_admin_0_boundary_lines_land'
		}),

		'Boundaries, then countries': L.tileLayer.wms('https://demo.boundlessgeo.com/geoserver/ows?', {
			layers: 'ne:ne_10m_admin_0_boundary_lines_land,ne:ne_10m_admin_0_countries'
		})
	};

	L.control.layers(basemaps, {}, {collapsed: false}).addTo(map);

	basemaps.Countries.addTo(map);

</script>

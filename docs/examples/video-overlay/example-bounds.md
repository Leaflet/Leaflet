---
layout: tutorial_frame
title: Video Overlay Tutorial
---
<script>
	var map = L.map('map');

    var tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

	bounds = L.latLngBounds([[ 32, -130], [ 13, -100]]);

	L.rectangle(bounds).addTo(map);

	map.fitBounds(bounds);

</script>

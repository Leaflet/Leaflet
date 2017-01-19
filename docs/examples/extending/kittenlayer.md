---
layout: tutorial_frame
title: KittenLayer
---
<script type='text/javascript'>

	var map = L.map('map', {
		crs: L.CRS.Simple,
		center: [0, 0],
		zoom: 5
	});

	L.TileLayer.Kitten = L.TileLayer.extend({
		getTileUrl: function(coords) {
			var i = Math.ceil( Math.random() * 4 );
			return "http://placekitten.com/256/256?image=" + i;
		},
        getAttribution: function() {
            return "<a href='http://placekitten.com/attribution.html'>PlaceKitten</a>"
        }
	});

	L.tileLayer.kitten = function() {
		return new L.TileLayer.Kitten();
	}

	map.addLayer( L.tileLayer.kitten() );
	
</script>

---
layout: tutorial_frame
title: CRS.Simple Example
---
<script type="module">
	import {LeafletMap, CRS, ImageOverlay, LatLng, Marker, Polyline} from 'leaflet';

	const map = new LeafletMap('map', {
		crs: CRS.Simple,
		minZoom: -3
	});

	const Yx = LatLng;

	function xy(x, y) {
		if (Array.isArray(x)) { // When doing xy([x, y]);
			return new Yx(x[1], x[0]);
		}
		return new Yx(y, x); // When doing xy(x, y);
	}

	const bounds = [xy(-25, -26.5), xy(1023, 1021.5)];
	const image = new ImageOverlay('uqm_map_full.png', bounds).addTo(map);

	const sol      = xy(175.2, 145.0);
	const mizar    = xy(41.6, 130.1);
	const kruegerZ = xy(13.4, 56.5);
	const deneb    = xy(218.7, 8.3);

	const mSol = new Marker(sol).addTo(map).bindPopup('Sol');
	const mMizar = new Marker(mizar).addTo(map).bindPopup('Mizar');
	const mKruegerZ = new Marker(kruegerZ).addTo(map).bindPopup('Krueger-Z');
	const mDeneb = new Marker(deneb).addTo(map).bindPopup('Deneb');

	const travel = new Polyline([sol, deneb]).addTo(map);

	map.setView(xy(120, 70), 1);
</script>

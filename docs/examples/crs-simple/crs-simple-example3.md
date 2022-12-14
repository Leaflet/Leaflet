---
layout: tutorial_frame
title: CRS.Simple example
---
<script>

	const map = L.map('map', {
		crs: L.CRS.Simple,
		minZoom: -3
	});

	const yx = L.latLng;

	function xy(x, y) {
		if (Array.isArray(x)) { // When doing xy([x, y]);
			return yx(x[1], x[0]);
		}
		return yx(y, x); // When doing xy(x, y);
	}

	const bounds = [xy(-25, -26.5), xy(1023, 1021.5)];
	const image = L.imageOverlay('uqm_map_full.png', bounds).addTo(map);

	const sol      = xy(175.2, 145.0);
	const mizar    = xy(41.6, 130.1);
	const kruegerZ = xy(13.4, 56.5);
	const deneb    = xy(218.7, 8.3);

	const mSol = L.marker(sol).addTo(map).bindPopup('Sol');
	const mMizar = L.marker(mizar).addTo(map).bindPopup('Mizar');
	const mKruegerZ = L.marker(kruegerZ).addTo(map).bindPopup('Krueger-Z');
	const mDeneb = L.marker(deneb).addTo(map).bindPopup('Deneb');

	const travel = L.polyline([sol, deneb]).addTo(map);

	map.setView(xy(120, 70), 1);

</script>

---
layout: tutorial_frame
title: Tilt handler
---
<style>

#info {
	position:absolute; 
	top:0; 
	right:0; 
	width: 20em; 
	height: 7.5em; 
	background: rgba(255,255,255,.5); 
	z-index:500; 
	font: 12px Sans;
}

.crsMarker {
	border-top: 2px green solid;
	border-left: 2px green solid;
}
</style>

<div id='info' style=''></div>


<script type="module">
	import L, {Map, Handler, Point, DomEvent, TileLayer} from 'leaflet';

	const trd = [63.41, 10.41];
	
	const TiltHandler = Handler.extend({
		addHooks() {
			DomEvent.on(window, 'deviceorientation', this._tilt, this);
		},
	
		removeHooks() {
			DomEvent.off(window, 'deviceorientation', this._tilt, this);
		},

		_tilt(ev) {
			// Treat Gamma angle as horizontal pan (1 degree = 1 pixel) and Beta angle as vertical pan
			const offset = new Point(ev.gamma, ev.beta);
			let info;
			if (offset) {
				this._map.panBy(offset);
				info = `${ev.gamma},${ev.beta}`;
			} else {
				info = 'Device orientation not detected';
			}
			document.getElementById('info').innerHTML = info;
		}
	});
	
	Map.addInitHook('addHandler', 'tilt', TiltHandler);

	const map = new Map('map', {
		center: [0, 0],
		zoom: 1,
		tilt: true
	});

	const osm = new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	
	window.L = L; // only for debugging in the developer console
	window.map = map; // only for debugging in the developer console
</script>

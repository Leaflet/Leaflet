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


<script type='text/javascript'>

	var trd = [63.41, 10.41];
	
	L.TiltHandler = L.Handler.extend({
		addHooks: function () {
			L.DomEvent.on(window, 'deviceorientation', this._tilt, this);
		},
	
		removeHooks: function () {
			L.DomEvent.off(window, 'deviceorientation', this._tilt, this);
		},

		_tilt: function (ev) {
			// Treat Gamma angle as horizontal pan (1 degree = 1 pixel) and Beta angle as vertical pan
			var info;
			var offset = L.point(ev.gamma, ev.beta);
			if (offset) {
				this._map.panBy(offset);
				info = ev.gamma + ',' + ev.beta;
			} else {
				info = 'Device orientation not detected';
			}
			document.getElementById('info').innerHTML = info;
		}
	});
	
	L.Map.addInitHook('addHandler', 'tilt', L.TiltHandler);

	var map = L.map('map', {
		center: [0, 0],
		zoom: 1,
		tilt: true
	});

	var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
	
</script>

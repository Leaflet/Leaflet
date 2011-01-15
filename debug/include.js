(function() {
	//TODO replace script list with the one from ../buid/deps.js
	var scripts = [
		'Leaflet.js',
		
		'core/Util.js', 
		'core/Class.js',
		'core/Events.js',
		'core/Browser.js',
		
		'geometry/Point.js',
		'geometry/Bounds.js',
		'geometry/Transformation.js',
		
		'dom/DomEvent.js',
		'dom/DomUtil.js',
		'dom/Draggable.js',
		'dom/Icon.js',
		
		'dom/transition/Transition.js',
		'dom/transition/Transition.Native.js',
		'dom/transition/Transition.Timer.js',
		
		'geo/LatLng.js',
		'geo/LatLngBounds.js',
		'geo/Projection.js',
		
		'layer/TileLayer.js',
		'layer/ImageOverlay.js',
		'layer/Marker.js',
		'layer/Popup.js',
		'layer/Marker.Popup.js',
		
		'handler/Handler.js',
		'handler/MapDrag.js',
		'handler/TouchZoom.js',
		'handler/DoubleClickZoom.js',
		'handler/ScrollWheelZoom.js',
		
		'map/Map.js',
		'map/Map.Geolocation.js',
		'map/Map.Popup.js',
		'map/Map.PanAnimation.js',
		'map/Map.ZoomAnimation.js'
	];
	
	for (var i = 0; i < scripts.length; i++) {
		document.writeln("<script type='text/javascript' src='../src/" + scripts[i] + "'></script>");
	}
})();
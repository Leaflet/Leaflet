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
		'geometry/LineUtil.js',
		'geometry/PolyUtil.js',
		
		'dom/DomEvent.js',
		'dom/DomEvent.DoubleTap.js',
		'dom/DomUtil.js',
		'dom/Draggable.js',
		
		'dom/transition/Transition.js',
		'dom/transition/Transition.Native.js',
		'dom/transition/Transition.Timer.js',
		
		'geo/LatLng.js',
		'geo/LatLngBounds.js',
		
		'geo/projection/Projection.js',
		'geo/projection/Projection.SphericalMercator.js',
		'geo/projection/Projection.LonLat.js',
		'geo/projection/Projection.Mercator.js',
		
		'geo/crs/CRS.js',
		'geo/crs/CRS.EPSG3857.js',
		'geo/crs/CRS.EPSG4326.js',
		'geo/crs/CRS.EPSG3395.js',
		
		'layer/LayerGroup.js',
		'layer/FeatureGroup.js',
		
		'layer/tile/TileLayer.js',
		'layer/tile/TileLayer.WMS.js',
		'layer/tile/TileLayer.Canvas.js',
		'layer/ImageOverlay.js',
		'layer/Popup.js',
		
		'layer/marker/Icon.js',
		'layer/marker/Marker.js',
		'layer/marker/Marker.Popup.js',
		
		'layer/vector/Path.js',
		'layer/vector/Path.VML.js',
		'layer/vector/Path.Popup.js',
		'layer/vector/Polyline.js',
		'layer/vector/Polygon.js',
		'layer/vector/MultiPoly.js',
		'layer/vector/Circle.js',
		'layer/vector/CircleMarker.js',
		
		'layer/GeoJSON.js',
		
		'handler/Handler.js',
		'handler/MapDrag.js',
		'handler/TouchZoom.js',
		'handler/DoubleClickZoom.js',
		'handler/ScrollWheelZoom.js',
		'handler/ShiftDragZoom.js',
		'handler/MarkerDrag.js',
		
		'control/Control.js',
		'control/Control.Zoom.js',
		'control/Control.Attribution.js',
		
		'map/Map.js',
		'map/ext/Map.Geolocation.js',
		'map/ext/Map.Popup.js',
		'map/ext/Map.PanAnimation.js',
		'map/ext/Map.ZoomAnimation.js',
		'map/ext/Map.Control.js'
	];
	
	function getSrcUrl() {
		var scripts = document.getElementsByTagName('script');
		for (var i = 0; i < scripts.length; i++) {
			var src = scripts[i].src;
			if (src) {
				var res = src.match(/^(.*)leaflet-include\.js$/);
				if (res) {
					return res[1] + '../src/';
				}
			}
		}
	}
	
	var path = getSrcUrl();
	for (var i = 0; i < scripts.length; i++) {
		document.writeln("<script type='text/javascript' src='" + path + "../src/" + scripts[i] + "'></script>");
	}
})();
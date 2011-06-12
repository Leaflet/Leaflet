var deps = {
	Core: {
		src: ['Leaflet.js',
		      'core/Browser.js', 
		      'core/Class.js', 
		      'core/Events.js', 
		      'core/Util.js',
		      'dom/DomUtil.js',
		      'geo/LatLng.js',
		      'geo/LatLngBounds.js',
		      'geo/projection/Projection.js',
		      'geo/projection/Projection.SphericalMercator.js',
		      'geo/projection/Projection.LonLat.js',
		      'geo/crs/CRS.js',
		      'geo/crs/CRS.EPSG3857.js',
		      'geo/crs/CRS.EPSG4326.js',
		      'geometry/Bounds.js',
		      'geometry/Point.js',
		      'geometry/Transformation.js',
		      'map/Map.js'],
		desc: 'The core of the library, including OOP, events, DOM facilities, basic units, projections (EPSG:3857 and EPSG:4326) and the base Map class.'
	},
	
	
	EPSG3395: {
		src: ['geo/projection/Projection.Mercator.js',
		      'geo/crs/CRS.EPSG3395.js'],
		desc: 'EPSG:3395 projection (used by some map providers).',
		heading: 'Additional projections'
	},
	
	TileLayer: {
		src: ['layer/tile/TileLayer.js'],
		desc: 'The base class for displaying tile layers on the map.',
		heading: 'Layers'
	},
	
	TileLayerWMS: {
		src: ['layer/tile/TileLayer.WMS.js'],
		desc: 'WMS tile layer.',
		deps: ['TileLayer']
	},
	
	TileLayerCanvas: {
		src: ['layer/tile/TileLayer.Canvas.js'],
		desc: 'Tile layer made from canvases (for custom drawing purposes).',
		deps: ['TileLayer']
	},
	
	ImageOverlay: {
		src: ['layer/ImageOverlay.js'],
		desc: 'Used to display an image over a particular rectangular area of the map.'
	},
	
	Marker: {
		src: ['layer/marker/Icon.js', 'layer/marker/Marker.js'],
		desc: 'Markers to put on the map.'
	},
	
	Popup: {
		src: ['layer/Popup.js', 'layer/marker/Marker.Popup.js', 'map/ext/Map.Popup.js'],
		deps: ['Marker'],
		desc: 'Used to display the map popup (used mostly for binding HTML data to markers and paths on click).'
	},
	
	LayerGroup: {
		src: ['layer/LayerGroup.js'],
		desc: 'Allows grouping several layers to handle them as one.'
	},
	
	FeatureGroup: {
		src: ['layer/FeatureGroup.js'],
		deps: ['LayerGroup', 'Popup'],
		desc: 'Extends LayerGroup with mouse events and bindPopup method shared between layers.'
	},
	
	
	Path: {
		src: ['layer/vector/Path.js', 'layer/vector/Path.Popup.js'],
		desc: 'Vector rendering core (SVG-powered), enables overlaying the map with SVG paths.',
		heading: 'Vector layers'
	},
	
	PathVML: {
		src: ['layer/vector/Path.VML.js'],
		desc: 'VML fallback for vector rendering core (IE 6-8).'
	},
	
	Polyline: {
		src: ['geometry/LineUtil.js', 'layer/vector/Polyline.js'],
		deps: ['Path'],
		desc: 'Polyline overlays.'
	},
	
	Polygon: {
		src: ['geometry/PolyUtil.js', 'layer/vector/Polygon.js'],
		deps: ['Polyline'],
		desc: 'Polygon overlays.'
	},

	MultiPoly: {
		src: ['layer/vector/MultiPoly.js'],
		deps: ['FeatureGroup', 'Polyline', 'Polygon'],
		desc: 'MultiPolygon and MultyPolyline layers.'
	},

	Circle: {
		src: ['layer/vector/Circle.js'],
		deps: ['Path'],
		desc: 'Circle overlays (with radius in meters).'
	},
	
	CircleMarker: {
		src: ['layer/vector/CircleMarker.js'],
		deps: ['Circle'],
		desc: 'Circle overlays with a constant pixel radius.'
	},
	
	GeoJSON: {
		src: ['layer/GeoJSON.js'],
		deps: ['Marker', 'MultiPoly', 'FeatureGroup'],
		desc: 'GeoJSON layer, parses the data and adds corresponding layers above.'
	},

	
	MapDrag: {
		src: ['dom/DomEvent.js',
		      'dom/Draggable.js',
		      'handler/Handler.js',
		      'handler/MapDrag.js'],
		desc: 'Makes the map draggable (by mouse or touch).',
		heading: 'Interaction'
	},
	
	MouseZoom: {
		src: ['dom/DomEvent.js',
		      'handler/Handler.js',
		      'handler/DoubleClickZoom.js',
		      'handler/ScrollWheelZoom.js'],
		desc: 'Scroll wheel zoom and double click zoom on the map.'
	},
	
	TouchZoom: {
		src: ['dom/DomEvent.js',
		      'dom/DomEvent.DoubleTap.js',
		      'handler/Handler.js',
		      'handler/TouchZoom.js'],
		deps: ['MapAnimationZoom'],
		desc: 'Enables smooth touch zooming on iOS and double tap on iOS/Android.'
	},
	
	ShiftDragZoom: {
		src: ['handler/ShiftDragZoom.js'],
		desc: 'Enables zooming to bounding box by shift-dragging the map.'
	},
	
	MarkerDrag: {
		src: ['handler/MarkerDrag.js'],
		desc: 'Makes markers draggable (by mouse or touch).'
	},
		
	
	ControlZoom: {
		src: ['control/Control.js', 
		      'map/ext/Map.Control.js', 
		      'control/Control.Zoom.js'],
		heading: 'Controls',
		desc: 'Basic zoom control with two buttons (zoom in / zoom out).'
	},
	
	ControlZoom: {
		src: ['control/Control.js', 
		      'map/ext/Map.Control.js', 
		      'control/Control.Attribution.js'],
		desc: 'Attribution control.'
	},
	
	
	MapAnimationNative: {
		src: ['dom/DomEvent.js',
		      'dom/transition/Transition.js',
		      'dom/transition/Transition.Native.js'],
		desc: 'Animation core that uses CSS3 Transitions (for powering pan & zoom animations). Works on mobile webkit-powered browsers and some modern desktop browsers.',
		heading: 'Visual effects'
	},
	
	MapAnimationFallback: {
		src: ['dom/transition/Transition.Timer.js'],
		deps: ['MapAnimationNative'],
		desc: 'Timer-based animation fallback for browsers that don\'t support CSS3 transitions.'
	},
	
	MapAnimationPan: {
		src: ['map/ext/Map.PanAnimation.js'],
		deps: ['MapAnimationNative'],
		desc: 'Panning animation. Can use both native and timer-based animation.'
	},
	
	MapAnimationZoom: {
		src: ['map/ext/Map.ZoomAnimation.js'],
		deps: ['MapAnimationPan', 'MapAnimationNative'],
		desc: 'Smooth zooming animation. So far it works only on browsers that support CSS3 Transitions.'
	},
	
	
	MapGeolocation: {
		src: ['map/ext/Map.Geolocation.js'],
		desc: 'Adds Map#locate method and related events to make geolocation easier.',
		heading: 'Misc'
	}
};
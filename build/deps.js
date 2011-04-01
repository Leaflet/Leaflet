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
		      'geo/Projection.js',
		      'geometry/Bounds.js',
		      'geometry/Point.js',
		      'geometry/Transformation.js',
		      'map/Map.js'],
		desc: 'The core of the library, including OOP, events, DOM facilities, basic units, projections and the base Map class.'
	},
	
	
	TileLayer: {
		src: ['layer/TileLayer.js'],
		desc: 'The base class for displaying tile layers on the map.',
		heading: 'Layers'
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
		desc: 'Used to display the map popup (used mostly for binding HTML data to markers on click).'
	},
	
	
	Path: {
		src: ['layer/vector/Path.js'],
		desc: 'Vector rendering core (SVG-powered), enables overlaying the map with SVG paths.',
		heading: 'Vector layers'
	},
	
	PathVML: {
		src: ['layer/vector/PathVML.js'],
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

	Circle: {
		src: ['layer/vector/Circle.js'],
		deps: ['Path'],
		desc: 'Circle overlays.'
	},

	
	MapDrag: {
		src: ['dom/DomEvent.js',
		      'dom/Draggable.js',
		      'handler/Handler.js',
		      'handler/MapDrag.js'],
		desc: 'Makes the map draggable (on both desktop and mobile webkit browsers).',
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
		      'handler/Handler.js',
		      'handler/TouchZoom.js'],
		deps: ['MapAnimationZoom'],
		desc: 'Enables smooth touch zooming on mobile webkit-powered devices (iPhone, iPod Touch, iPad, Android).'
	},
	
	ShiftDragZoom: {
		src: ['handler/ShiftDragZoom.js'],
		desc: 'Enables zooming to bounding box by shift-dragging the map.'
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
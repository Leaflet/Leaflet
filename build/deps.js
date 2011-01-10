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
		src: ['dom/Icon.js', 'layer/Marker.js'],
		desc: 'Markers to put on the map.'
	},
	
	Popup: {
		src: ['layer/Popup.js', 'layer/Marker.Popup.js', 'map/Map.Popup.js'],
		deps: ['Marker'],
		desc: 'Used to display the map popup (used mostly for binding HTML data to markers on click).'
	},
	
	MapDrag: {
		src: ['dom/DomEvent.js',
		      'dom/Draggable.js',
		      'handler/Handler.js',
		      'handler/MapDrag.js'],
		deps: [],
		desc: 'Makes the map draggable (on both desktop and mobile webkit browsers).',
		heading: 'Interaction'
	},
	
	MouseZoom: {
		src: ['dom/DomEvent.js',
		      'handler/Handler.js',
		      'handler/DoubleClickZoom.js',
		      'handler/ScrollWheelZoom.js'],
		deps: [], 
		desc: 'Scroll wheel zoom and double click zoom on the map.'
	},
	
	TouchZoom: {
		src: ['dom/DomEvent.js',
		      'handler/Handler.js',
		      'handler/TouchZoom.js'],
		deps: [],
		desc: 'Enables smooth touch zooming on mobile webkit-powered devices (iPhone, iPod Touch, iPad, Android).'
	},
	
	MapAnimationNative: {
		src: ['dom/DomEvent.js',
		      'dom/transition/Transition.js',
		      'dom/transition/Transition.Native.js',
		      'map/Map.Animation.js'],
		deps: [],
		desc: 'Panning animation through CSS3 Transitions on the map (zooming animation coming later). Works on mobile webkit-powered browsers and some modern desktop browsers.',
		heading: 'Visual effects'
	},
	
	MapAnimationFallback: {
		src: ['dom/transition/Transition.Timer.js'],
		deps: ['MapAnimationNative'],
		desc: 'Animation for browsers that don\'t support CSS3 transitions.'
	},
	
	MapGeolocation: {
		src: ['map/Map.Geolocation.js'],
		desc: 'Adds Map#locate method and related events to make geolocation easier.',
		heading: 'Misc'
	}
};
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
		desc: 'The base class for displaying tile layers on the map.'
	},
	
	ImageOverlay: {
		src: ['layer/ImageOverlay.js'],
		desc: 'Used to display an image over a particular rectangular area of the map.'
	},
	
	DomEvent: {
		src: ['dom/DomEvent.js'],
		desc: 'Functions for cross-browser DOM events handling.' 
	},
	
	Draggable: {
		src: ['dom/Draggable.js'],
		deps: ['DomEvent'],
		desc: 'Used to make any element draggable. Powers map and marker dragging.'
	},

	MapDrag: {
		src: ['handler/Handler.js',
		      'handler/MapDrag.js'],
		deps: ['Draggable'],
		desc: 'Makes the map draggable (on both desktop and mobile webkit browsers).'
	},
	
	MouseZoom: {
		src: ['handler/Handler.js',
		      'handler/DoubleClickZoom.js',
		      'handler/ScrollWheelZoom.js'],
		deps: ['DomEvent'], 
		desc: 'Scroll wheel zoom and double click zoom on the map.'
	},
	
	TouchZoom: {
		src: ['handler/Handler.js',
		      'handler/TouchZoom.js'],
		deps: ['DomEvent'],
		desc: 'Enables smooth touch zooming on mobile webkit-powered devices (iPhone, iPod Touch, iPad, Android).'
	},
	
	TransitionNative: {
		src: ['dom/transition/Transition.js',
		      'dom/transition/Transition.Native.js'],
		deps: ['DomEvent'],
		desc: 'Native CSS3 Transitions class for doing basic animations. Works on mobile webkit-powered browsers and some modern desktop browsers.'
	},
	
	TransitionTimer: {
		src: ['dom/transition/Transition.Timer.js'],
		deps: ['TransitionNative'],
		desc: 'Transition implementation for browsers that don\'t support CSS3 transitions.'
	},
	
	MapAnimation: {
		src: ['dom/transition/Transition.Timer.js',
		      'map/Map.Animation.js'],
		deps: ['TransitionNative'],
		desc: 'Panning animation on the map (zooming animation coming later).'
	},
	
	MapGeolocation: {
		src: ['map/Map.Geolocation.js'],
		desc: 'Adds Map#locate method and related events to make geolocation easier.'
	}
};
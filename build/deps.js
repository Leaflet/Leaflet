var deps = {
	Core: {
		src: ['Leaflet.js',
		      'core/Util.js',
		      'core/Class.js',
		      'core/Events.js',
		      'core/Browser.js',
		      'geometry/Point.js',
		      'geometry/Bounds.js',
		      'geometry/Transformation.js',
		      'dom/DomUtil.js',
		      'geo/LatLng.js',
		      'geo/LatLngBounds.js',
		      'geo/projection/Projection.js',
		      'geo/projection/Projection.SphericalMercator.js',
		      'geo/projection/Projection.LonLat.js',
		      'geo/crs/CRS.js',
		      'geo/crs/CRS.Simple.js',
		      'geo/crs/CRS.EPSG3857.js',
		      'geo/crs/CRS.EPSG4326.js',
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
		src: ['layer/marker/Icon.js',
		      'layer/marker/Icon.Default.js',
		      'layer/marker/Marker.js'],
		desc: 'Markers to put on the map.'
	},

	DivIcon: {
		src: ['layer/marker/DivIcon.js'],
		deps: ['Marker'],
		desc: 'Lightweight div-based icon for markers.'
	},

	Popup: {
		src: ['layer/Popup.js',
		      'layer/marker/Marker.Popup.js'],
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
		src: ['layer/vector/Path.js',
		      'layer/vector/Path.SVG.js',
		      'layer/vector/Path.Popup.js'],
		desc: 'Vector rendering core (SVG-powered), enables overlaying the map with SVG paths.',
		heading: 'Vector layers'
	},

	PathVML: {
		src: ['layer/vector/Path.VML.js'],
		desc: 'VML fallback for vector rendering core (IE 6-8).'
	},

	PathCanvas: {
		src: ['layer/vector/canvas/Path.Canvas.js'],
		deps: ['Path', 'Polyline', 'Polygon', 'Circle'],
		desc: 'Canvas fallback for vector rendering core (makes it work on Android 2+).'
	},

	Polyline: {
		src: ['geometry/LineUtil.js',
		      'layer/vector/Polyline.js'],
		deps: ['Path'],
		desc: 'Polyline overlays.'
	},

	Polygon: {
		src: ['geometry/PolyUtil.js',
		      'layer/vector/Polygon.js'],
		deps: ['Polyline'],
		desc: 'Polygon overlays.'
	},

	MultiPoly: {
		src: ['layer/vector/MultiPoly.js'],
		deps: ['FeatureGroup', 'Polyline', 'Polygon'],
		desc: 'MultiPolygon and MultyPolyline layers.'
	},

	Rectangle: {
		src: ['layer/vector/Rectangle.js'],
		deps: ['Polygon'],
		desc: ['Rectangle overlays.']
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

	VectorsCanvas: {
		src: ['layer/vector/canvas/Polyline.Canvas.js',
		      'layer/vector/canvas/Polygon.Canvas.js',
		      'layer/vector/canvas/Circle.Canvas.js',
		      'layer/vector/canvas/CircleMarker.Canvas.js'],
		deps: ['PathCanvas', 'Polyline', 'Polygon', 'Circle', 'CircleMarker'],
		desc: 'Canvas fallback for vector layers (polygons, polylines, circles, circlemarkers)'
	},

	GeoJSON: {
		src: ['layer/GeoJSON.js'],
		deps: ['Marker', 'MultiPoly', 'FeatureGroup'],
		desc: 'GeoJSON layer, parses the data and adds corresponding layers above.'
	},


	MapDrag: {
		src: ['dom/DomEvent.js',
		      'dom/Draggable.js',
		      'core/Handler.js',
		      'map/handler/Map.Drag.js'],
		desc: 'Makes the map draggable (by mouse or touch).',
		heading: 'Interaction'
	},

	MouseZoom: {
		src: ['dom/DomEvent.js',
		      'core/Handler.js',
		      'map/handler/Map.DoubleClickZoom.js',
		      'map/handler/Map.ScrollWheelZoom.js'],
		desc: 'Scroll wheel zoom and double click zoom on the map.'
	},

	TouchZoom: {
		src: ['dom/DomEvent.js',
		      'dom/DomEvent.DoubleTap.js',
		      'dom/DomEvent.MsTouch.js',
		      'core/Handler.js',
		      'map/handler/Map.TouchZoom.js',
		      'map/handler/Map.Tap.js'],
		deps: ['AnimationZoom'],
		desc: 'Enables smooth touch zoom / tap / longhold / doubletap on iOS, IE10, Android.'
	},

	BoxZoom: {
		src: ['map/handler/Map.BoxZoom.js'],
		desc: 'Enables zooming to bounding box by shift-dragging the map.'
	},

	Keyboard: {
		src: ['map/handler/Map.Keyboard.js'],
		desc: 'Enables keyboard pan/zoom when the map is focused.'
	},

	MarkerDrag: {
		src: ['layer/marker/Marker.Drag.js'],
		deps: ['Marker'],
		desc: 'Makes markers draggable (by mouse or touch).'
	},

	ControlZoom: {
		src: ['control/Control.js',
		      'control/Control.Zoom.js'],
		heading: 'Controls',
		desc: 'Basic zoom control with two buttons (zoom in / zoom out).'
	},

	ControlAttrib: {
		src: ['control/Control.js',
		      'control/Control.Attribution.js'],
		desc: 'Attribution control.'
	},

	ControlScale: {
		src: ['control/Control.js',
		      'control/Control.Scale.js'],
		desc: 'Scale control.'
	},

	ControlLayers: {
		src: ['control/Control.js',
		      'control/Control.Layers.js'],
		desc: 'Layer Switcher control.'
	},

	AnimationPan: {
		src: [
			'dom/DomEvent.js',
			'dom/PosAnimation.js',
			'map/anim/Map.PanAnimation.js'
			],
		desc: 'Core panning animation support.'
	},

	AnimationTimer: {
		src: ['dom/PosAnimation.Timer.js'],
		deps: ['AnimationPan'],
		desc: 'Timer-based pan animation fallback for browsers that don\'t support CSS3 transitions.'
	},

	AnimationZoom: {
		src: ['map/anim/Map.ZoomAnimation.js', 'layer/tile/TileLayer.Anim.js'],
		deps: ['AnimationPan'],
		desc: 'Smooth zooming animation. Works only on browsers that support CSS3 Transitions.'
	},

	Geolocation: {
		src: ['map/ext/Map.Geolocation.js'],
		desc: 'Adds Map#locate method and related events to make geolocation easier.',
		heading: 'Misc'
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}

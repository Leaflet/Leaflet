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
		      'geo/projection/Projection.LonLat.js',
		      'geo/projection/Projection.SphericalMercator.js',
		      'geo/crs/CRS.js',
		      'geo/crs/CRS.Simple.js',
		      'geo/crs/CRS.Earth.js',
		      'geo/crs/CRS.EPSG3857.js',
		      'geo/crs/CRS.EPSG4326.js',
		      'map/Map.js',
		      'layer/Layer.js',
		      'dom/DomEvent.js',
		      'dom/PosAnimation.js'
		      ],
		desc: 'The core of the library, including OOP, events, DOM facilities, basic units, projections (EPSG:3857 and EPSG:4326) and the base Map class.'
	},

	EPSG3395: {
		src: ['geo/projection/Projection.Mercator.js',
		      'geo/crs/CRS.EPSG3395.js'],
		desc: 'EPSG:3395 projection (used by some map providers).',
		heading: 'Additional projections'
	},

	GridLayer: {
		src: ['layer/tile/GridLayer.js'],
		desc: 'Used as base class for grid-like layers like TileLayer.',
		heading: 'Layers'
	},

	TileLayer: {
		src: ['layer/tile/TileLayer.js'],
		desc: 'The base class for displaying tile layers on the map.',
		deps: ['GridLayer']
	},

	TileLayerWMS: {
		src: ['layer/tile/TileLayer.WMS.js'],
		desc: 'WMS tile layer.',
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
		src: [
			'layer/DivOverlay.js',
			'layer/Popup.js'
		],
		deps: ['Marker'],
		desc: 'Used to display the map popup (used mostly for binding HTML data to markers and paths on click).'
	},

	Tooltip: {
		src: [
			'layer/Tooltip.js'
		],
		deps: ['Popup', 'Marker'],
		desc: 'Used to display the map tooltip (used mostly for binding short descriptions to markers and paths on mouseover).'
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
		src: [
			'layer/vector/Renderer.js',
			'layer/vector/Path.js'
		],
		desc: 'Vector rendering core.',
		heading: 'Vector layers'
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

	Rectangle: {
		src: ['layer/vector/Rectangle.js'],
		deps: ['Polygon'],
		desc: ['Rectangle overlays.']
	},

	CircleMarker: {
		src: ['layer/vector/CircleMarker.js'],
		deps: ['Path'],
		desc: 'Circle overlays with a constant pixel radius.'
	},

	Circle: {
		src: ['layer/vector/Circle.js'],
		deps: ['CircleMarker'],
		desc: 'Circle overlays (with radius in meters).'
	},

	SVG: {
		src: ['layer/vector/SVG.js'],
		deps: ['Path'],
		desc: 'SVG backend for vector layers.'
	},

	VML: {
		src: ['layer/vector/SVG.VML.js'],
		deps: ['SVG'],
		desc: 'VML fallback for vector layers in IE7-8.'
	},

	Canvas: {
		src: ['layer/vector/Canvas.js'],
		deps: ['CircleMarker', 'Path', 'Polygon', 'Polyline'],
		desc: 'Canvas backend for vector layers.'
	},

	GeoJSON: {
		src: ['layer/GeoJSON.js'],
		deps: ['Polygon', 'Circle', 'CircleMarker', 'Marker', 'FeatureGroup'],
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
		      'dom/DomEvent.Pointer.js',
		      'core/Handler.js',
		      'map/handler/Map.TouchZoom.js',
		      'map/handler/Map.Tap.js'],
		deps: ['AnimationZoom'],
		desc: 'Enables smooth touch zoom / tap / longhold / doubletap on iOS, IE10, Android.'
	},

	BoxZoom: {
		src: ['map/handler/Map.BoxZoom.js'],
		deps: ['MouseZoom'],
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
	}
};

if (typeof exports !== 'undefined') {
	exports.deps = deps;
}

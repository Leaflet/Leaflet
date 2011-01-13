/*
 * L.Map is the central class of the API - it is used to create a map.
 */

L.Map = L.Class.extend({
	includes: L.Mixin.Events,
	
	options: {
		// projection
		projection: L.Projection.Mercator,
		transformation: new L.Transformation(0.5/Math.PI, 0.5, -0.5/Math.PI, 0.5), 
		scaling: function(zoom) { return 256 * (1 << zoom); },
		
		// state
		center: new L.LatLng(0, 0),
		zoom: 0,
		layers: [],
		
		//interaction
		dragging: true,
		touchZoom: L.Browser.mobileWebkit,
		scrollWheelZoom: !L.Browser.mobileWebkit,
		doubleClickZoom: true,
		
		//misc
		trackResize: true,
		closePopupOnClick: true
	},
	
	
	// constructor
	
	initialize: function(/*HTMLElement or String*/ id, /*Object*/ options) {
		this._container = L.DomUtil.get(id);
		L.Util.extend(this.options, options);
		
		this._initLayout();
		
		var layers = this.options.layers;
		layers = (layers instanceof Array ? layers : [layers]); 
		this._initLayers(layers);
		
		if (L.DomEvent) { 
			this._initEvents(); 
			if (L.Handler) { this._initInteraction(); }
		}
		
		this.setView(this.options.center, this.options.zoom, true);
	},
	
	
	// public methods that modify map state
	
	// replaced by animation-powered implementation in Map.Animation.js
	setView: function(center, zoom, forceReset) {
		zoom = this._limitZoom(zoom);
		var zoomChanged = (this._zoom != zoom);

		// reset the map view 
		this._resetView(center, zoom);
		
		return this;
	},
	
	setZoom: function(zoom) {
		return this.setView(this.getCenter(), zoom);
	},
	
	zoomIn: function() {
		return this.setZoom(this._zoom + 1);
	},
	
	zoomOut: function() {
		return this.setZoom(this._zoom - 1);
	},
	
	fitBounds: function(/*LatLngBounds*/ bounds) {
		var zoom = this.getBoundsZoom(bounds);
		return this.setView(bounds.getCenter(), zoom, true);
	},
	
	panTo: function(center) {
		return this.setView(center, this._zoom);
	},
	
	panBy: function(offset) {
		// replaced with animated panBy in Map.Animation.js
		this.fire('movestart');
		
		this._rawPanBy(offset);
		
		this.fire('move');
		this.fire('moveend');
		
		return this;
	},
	
	addLayer: function(layer) {
		var id = L.Util.stamp(layer);
		
		if (!this._layers[id]) {
			layer.onAdd(this);
		
			this._layers[id] = layer;
			
			if (layer.options && !isNaN(layer.options.maxZoom)) {
				this._layersMaxZoom = Math.max(this._layersMaxZoom || 0, layer.options.maxZoom);
			}
			if (layer.options && !isNaN(layer.options.minZoom)) {
				this._layersMinZoom = Math.min(this._layersMinZoom || Infinity, layer.options.minZoom);
			}
			//TODO getMaxZoom, getMinZoom
			
			this.fire('layeradd', {layer: layer});
		}
		return this;
	},
	
	removeLayer: function(layer) {
		var id = L.Util.stamp(layer);
		
		if (this._layers[id]) {
			layer.onRemove(this);
			delete this._layers[id];
			this.fire('layerremove', {layer: layer});
		}
		return this;
	},
	
	invalidateSize: function() {
		this._sizeChanged = true;
		
		this.fire('move');
		
		clearTimeout(this._sizeTimer);
		this._sizeTimer = setTimeout(L.Util.bind(function() {
			this.fire('moveend');
		}, this), 200); 

		return this;
	},
	
	
	// public methods for getting map state	
	
	getCenter: function(unbounded) {
		var viewHalf = this.getSize().divideBy(2),
			centerPoint = this._getTopLeftPoint().add(viewHalf);
		return this.unproject(centerPoint, this._zoom, unbounded);
	},
	
	getZoom: function() {
		return this._zoom;
	},
	
	getBounds: function() {
		var bounds = this.getPixelBounds(),
			sw = this.unproject(new L.Point(bounds.min.x, bounds.max.y)),
			ne = this.unproject(new L.Point(bounds.max.x, bounds.min.y));
		return new L.LatLngBounds(sw, ne);
	},
	
	getMinZoom: function() {
		return isNaN(this.options.minZoom) ?  this._layersMinZoom || 0 : this.options.minZoom;
	},
	
	getMaxZoom: function() {
		return isNaN(this.options.maxZoom) ?  this._layersMaxZoom || Infinity : this.options.maxZoom;
	},
	
	getBoundsZoom: function(/*LatLngBounds*/ bounds) {
		var size = this.getSize(),
			zoom = this.getMinZoom(),
			maxZoom = this.getMaxZoom(),
			ne = bounds.getNorthEast(),
			sw = bounds.getSouthWest(),
			boundsSize, 
			nePoint, swPoint;
		do {
			nePoint = this.project(ne, zoom);
			swPoint = this.project(sw, zoom);
			boundsSize = new L.Point(nePoint.x - swPoint.x, swPoint.y - nePoint.y);
			zoom++;
		} while ((boundsSize.x <= size.x) && 
				 (boundsSize.y <= size.y) && (zoom <= maxZoom));
		
		return zoom - 1;
	},
	
	getSize: function() {
		if (!this._size || this._sizeChanged) {
			this._size = new L.Point(this._container.clientWidth, this._container.clientHeight);
			this._sizeChanged = false;
		}
		return this._size;
	},

	getPixelBounds: function() {
		var topLeftPoint = this._getTopLeftPoint(),
			size = this.getSize();
		return new L.Bounds(topLeftPoint, topLeftPoint.add(size));
	},
	
	getPixelOrigin: function() {
		return this._initialTopLeftPoint;
	},
	
	mouseEventToContainerPoint: function(e) {
		return L.DomEvent.getMousePosition(e, this._container);
	},
	
	mouseEventToLayerPoint: function(e) {
		return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
	},
	
	mouseEventToLatLng: function(e) {
		return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
	},
	
	containerPointToLayerPoint: function(point) {
		return point.subtract(L.DomUtil.getPosition(this._mapPane));
	},
	
	layerPointToContainerPoint: function(point) {
		return point.add(L.DomUtil.getPosition(this._mapPane));
	},
	
	layerPointToLatLng: function(point) {
		return this.unproject(point.add(this._initialTopLeftPoint));
	},
	
	latLngToLayerPoint: function(latlng) {
		return this.project(latlng).subtract(this._initialTopLeftPoint);
	},

	project: function(/*Object*/ coord, /*(optional) Number*/ zoom)/*-> Point*/ {
		var projectedPoint = this.options.projection.project(coord),
			scale = this.options.scaling(isNaN(zoom) ? this._zoom : zoom);
		return this.options.transformation.transform(projectedPoint, scale);
	},
	
	unproject: function(/*Point*/ point, /*(optional) Number*/ zoom, /*(optional) Boolean*/ unbounded)/*-> Object*/ {
		var scale = this.options.scaling(isNaN(zoom) ? this._zoom : zoom),
			untransformedPoint = this.options.transformation.untransform(point, scale);
		return this.options.projection.unproject(untransformedPoint, unbounded);
	},
	
	getPanes: function() {
		return this._panes;
	},
	
	
	// private methods that modify map state
	
	_initLayout: function() {
		this._container.className += ' leaflet-container';
		
		var position = L.DomUtil.getStyle(this._container, 'position');
		this._container.style.position = (position == 'absolute' ? 'absolute' : 'relative');
		
		this._panes = {};
		this._panes.mapPane = this._mapPane = this._createPane('leaflet-map-pane');
		this._panes.tilePane = this._createPane('leaflet-tile-pane');
		this._panes.shadowPane = this._createPane('leaflet-shadow-pane');
		this._panes.overlayPane = this._createPane('leaflet-overlay-pane');
		this._panes.markerPane = this._createPane('leaflet-marker-pane');
		this._panes.popupPane = this._createPane('leaflet-popup-pane');
	},
	
	_createPane: function(className) {
		return L.DomUtil.create('div', className, this._mapPane || this._container);
	},
	
	_resetView: function(center, zoom) {
		var zoomChanged = (this._zoom != zoom);
		
		this.fire('movestart');
		
		this._zoom = zoom;
		this._initialTopLeftPoint = this._getNewTopLeftPoint(center);
		
		L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
		
		this.fire('viewreset');

		this.fire('move');
		if (zoomChanged) { this.fire('zoomend'); }
		this.fire('moveend');
	},
	
	_initLayers: function(layers) {
		this._layers = {};
		for (var i = 0, len = layers.length; i < len; i++) {
			this.addLayer(layers[i]);
		}
	},
	
	_rawPanBy: function(offset) {
		var mapPaneOffset = L.DomUtil.getPosition(this._mapPane);
		L.DomUtil.setPosition(this._mapPane, mapPaneOffset.subtract(offset));
	},
	
	
	// map events
	
	_initEvents: function() {
		L.DomEvent.addListener(this._container, 'click', this._onMouseClick, this);
		L.DomEvent.addListener(this._container, 'dblclick', this._fireMouseEvent, this);
		L.DomEvent.addListener(this._container, 'mousedown', this._fireMouseEvent, this);
		
		if (this.options.trackResize) {
			L.DomEvent.addListener(window, 'resize', this.invalidateSize, this);
		}
	},
	
	_onMouseClick: function(e) {
		if (this.dragging && this.dragging.moved()) { return; }
		this._fireMouseEvent(e);
	},
	
	_fireMouseEvent: function(e) {
		if (!this.hasEventListeners(e.type)) { return; }
		this.fire(e.type, {
			position: this.mouseEventToLatLng(e),
			layerPoint: this.mouseEventToLayerPoint(e)
		});
	},
	
	_initInteraction: function() {
		var handlers = {
			dragging: L.Handler.MapDrag,
			touchZoom: L.Handler.TouchZoom,
			doubleClickZoom: L.Handler.DoubleClickZoom,
			scrollWheelZoom: L.Handler.ScrollWheelZoom
		};
		for (var i in handlers) {
			if (handlers.hasOwnProperty(i) && handlers[i]) {
				this[i] = new handlers[i](this, this.options[i]);
			}
		}
	},
	

	// private methods for getting map state
	
	_getTopLeftPoint: function() {
		var offset = L.DomUtil.getPosition(this._mapPane);
		return this._initialTopLeftPoint.subtract(offset);
	},
	
	_getNewTopLeftPoint: function(center) {
		var viewHalf = this.getSize().divideBy(2, true);
		return this.project(center).subtract(viewHalf).round();
	},
	
	_limitZoom: function(zoom) {
		var min = this.getMinZoom();
		var max = this.getMaxZoom();
		return Math.max(min, Math.min(max, zoom));
	}
});
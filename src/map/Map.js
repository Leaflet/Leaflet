/*
 * L.Map is the central class of the API - it is used to create a map.
 */

L.Map = L.Class.extend({
	includes: L.Mixin.Events,
	
	options: {
		// projection
		crs: L.CRS.EPSG3857 || L.CRS.EPSG4326,
		scale: function(zoom) { return 256 * (1 << zoom); },
		
		// state
		center: null,
		zoom: null,
		layers: [],
		
		// interaction
		dragging: true,
		touchZoom: L.Browser.mobileWebkit && !L.Browser.android,
		scrollWheelZoom: !L.Browser.mobileWebkit,
		doubleClickZoom: true,
		shiftDragZoom: true,
		
		// controls
		zoomControl: true,
		attributionControl: true,
		
		// animation
		fadeAnimation: L.DomUtil.TRANSITION && !L.Browser.android,
		zoomAnimation: L.DomUtil.TRANSITION && !L.Browser.android && !L.Browser.mobileOpera,
		
		// misc
		trackResize: true,
		closePopupOnClick: true
	},
	
	
	// constructor
	
	initialize: function(/*HTMLElement or String*/ id, /*Object*/ options) {
		L.Util.setOptions(this, options);
		
		this._container = L.DomUtil.get(id);
		
		this._initLayout();
		
		if (L.DomEvent) { 
			this._initEvents(); 
			if (L.Handler) { this._initInteraction(); }
			if (L.Control) { this._initControls(); }
		}
		
		var center = this.options.center,
			zoom = this.options.zoom;
		
		if (center !== null && zoom !== null) {
			this.setView(center, zoom, true);
		}

		var layers = this.options.layers;
		layers = (layers instanceof Array ? layers : [layers]);
		this._tileLayersNum = 0;
		this._initLayers(layers);
	},
	
	
	// public methods that modify map state
	
	// replaced by animation-powered implementation in Map.PanAnimation.js
	setView: function(center, zoom, forceReset) {
		// reset the map view 
		this._resetView(center, this._limitZoom(zoom));
		return this;
	},
	
	setZoom: function(/*Number*/ zoom) {
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
		return this.setView(bounds.getCenter(), zoom);
	},
	
	fitWorld: function() {
		var sw = new L.LatLng(-60, -170),
			ne = new L.LatLng(85, 179);
		return this.fitBounds(new L.LatLngBounds(sw, ne));
	},
	
	panTo: function(/*LatLng*/ center) {
		return this.setView(center, this._zoom);
	},
	
	panBy: function(/*Point*/ offset) {
		// replaced with animated panBy in Map.Animation.js
		this.fire('movestart');
		
		this._rawPanBy(offset);
		
		this.fire('move');
		this.fire('moveend');
		
		return this;
	},
	
	addLayer: function(layer) {
		var id = L.Util.stamp(layer);
		
		if (this._layers[id]) return this;
		
		this._layers[id] = layer;
		
		if (layer.options && !isNaN(layer.options.maxZoom)) {
			this._layersMaxZoom = Math.max(this._layersMaxZoom || 0, layer.options.maxZoom);
		}
		if (layer.options && !isNaN(layer.options.minZoom)) {
			this._layersMinZoom = Math.min(this._layersMinZoom || Infinity, layer.options.minZoom);
		}
		//TODO getMaxZoom, getMinZoom in ILayer (instead of options)
		
		if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
			this._tileLayersNum++;
			layer.on('load', this._onTileLayerLoad, this);
		}
		if (this.attributionControl && layer.getAttribution) {
			this.attributionControl.addAttribution(layer.getAttribution());
		}
		
		var onMapLoad = function() {
			layer.onAdd(this);
			this.fire('layeradd', {layer: layer});
		};
		
		if (this._loaded) {
			onMapLoad.call(this);
		} else {
			this.on('load', onMapLoad, this);
		}
		
		return this;
	},
	
	removeLayer: function(layer) {
		var id = L.Util.stamp(layer);
		
		if (this._layers[id]) {
			layer.onRemove(this);
			delete this._layers[id];
			
			if (this.options.zoomAnimation && L.TileLayer && (layer instanceof L.TileLayer)) {
				this._tileLayersNum--;
				layer.off('load', this._onTileLayerLoad, this);
			}
			if (this.attributionControl && layer.getAttribution) {
				this.attributionControl.removeAttribution(layer.getAttribution());
			}
			
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
	
	getCenter: function(/*Boolean*/ unbounded) {
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
			zoom++;
			nePoint = this.project(ne, zoom);
			swPoint = this.project(sw, zoom);
			boundsSize = new L.Point(nePoint.x - swPoint.x, swPoint.y - nePoint.y);
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
	
	getPanes: function() {
		return this._panes;
	},
	
	
	// conversion methods
	
	mouseEventToContainerPoint: function(/*MouseEvent*/ e) {
		return L.DomEvent.getMousePosition(e, this._container);
	},
	
	mouseEventToLayerPoint: function(/*MouseEvent*/ e) {
		return this.containerPointToLayerPoint(this.mouseEventToContainerPoint(e));
	},
	
	mouseEventToLatLng: function(/*MouseEvent*/ e) {
		return this.layerPointToLatLng(this.mouseEventToLayerPoint(e));
	},
	
	containerPointToLayerPoint: function(/*Point*/ point) {
		return point.subtract(L.DomUtil.getPosition(this._mapPane));
	},
	
	layerPointToContainerPoint: function(/*Point*/ point) {
		return point.add(L.DomUtil.getPosition(this._mapPane));
	},
	
	layerPointToLatLng: function(/*Point*/ point) {
		return this.unproject(point.add(this._initialTopLeftPoint));
	},
	
	latLngToLayerPoint: function(/*LatLng*/ latlng) {
		return this.project(latlng)._subtract(this._initialTopLeftPoint);
	},

	project: function(/*LatLng*/ latlng, /*(optional) Number*/ zoom)/*-> Point*/ {
		zoom = (typeof zoom == 'undefined' ? this._zoom : zoom);
		return this.options.crs.latLngToPoint(latlng, this.options.scale(zoom));
	},
	
	unproject: function(/*Point*/ point, /*(optional) Number*/ zoom, /*(optional) Boolean*/ unbounded)/*-> Object*/ {
		zoom = (typeof zoom == 'undefined' ? this._zoom : zoom);
		return this.options.crs.pointToLatLng(point, this.options.scale(zoom), unbounded);
	},
	
	
	// private methods that modify map state
	
	_initLayout: function() {
		var container = this._container;
		
		container.className += ' leaflet-container';
		
		if (this.options.fadeAnimation) {
			container.className += ' leaflet-fade-anim';
		}
		
		var position = L.DomUtil.getStyle(container, 'position');
		if (position != 'absolute' && position != 'relative') {
			container.style.position = 'relative';
		}
		
		this._initPanes();
		
		if (this._initControlPos) this._initControlPos();
	},
	
	_initPanes: function() {
		var panes = this._panes = {};
		
		this._mapPane = panes.mapPane = this._createPane('leaflet-map-pane', this._container);
		
		this._tilePane = panes.tilePane = this._createPane('leaflet-tile-pane', this._mapPane);
		this._objectsPane = panes.objectsPane = this._createPane('leaflet-objects-pane', this._mapPane);
		
		panes.shadowPane = this._createPane('leaflet-shadow-pane');
		panes.overlayPane = this._createPane('leaflet-overlay-pane');
		panes.markerPane = this._createPane('leaflet-marker-pane');
		panes.popupPane = this._createPane('leaflet-popup-pane');
	},
	
	_createPane: function(className, container) {
		return L.DomUtil.create('div', className, container || this._objectsPane);
	},
	
	_resetView: function(center, zoom, preserveMapOffset) {
		var zoomChanged = (this._zoom != zoom);
		
		this.fire('movestart');
		
		this._zoom = zoom;
		
		this._initialTopLeftPoint = this._getNewTopLeftPoint(center);
		
		if (!preserveMapOffset) {
			L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
		} else {
			var offset = L.DomUtil.getPosition(this._mapPane);
			this._initialTopLeftPoint._add(offset);
		}
		
		this._tileLayersToLoad = this._tileLayersNum;
		this.fire('viewreset');

		this.fire('move');
		if (zoomChanged) { this.fire('zoomend'); }
		this.fire('moveend');
		
		if (!this._loaded) {
			this._loaded = true;
			this.fire('load');
		}
	},
	
	_initLayers: function(layers) {
		this._layers = {};
		for (var i = 0, len = layers.length; i < len; i++) {
			this.addLayer(layers[i]);
		}
	},
	
	_initControls: function() {
		if (this.options.zoomControl) {
			this.addControl(new L.Control.Zoom());
		}
		if (this.options.attributionControl) {
			this.attributionControl = new L.Control.Attribution();
			this.addControl(this.attributionControl);
		}
	},

	_rawPanBy: function(offset) {
		var mapPaneOffset = L.DomUtil.getPosition(this._mapPane);
		L.DomUtil.setPosition(this._mapPane, mapPaneOffset.subtract(offset));
	},
	
	
	// map events
	
	_initEvents: function() {
		L.DomEvent.addListener(this._container, 'click', this._onMouseClick, this);
		
		var events = ['dblclick', 'mousedown', 'mouseenter', 'mouseleave', 'mousemove'];
		for (var i = 0; i < events.length; i++) {
			L.DomEvent.addListener(this._container, events[i], this._fireMouseEvent, this);
		}
		
		if (this.options.trackResize) {
			L.DomEvent.addListener(window, 'resize', this.invalidateSize, this);
		}
	},
	
	_onMouseClick: function(e) {
		if (this.dragging && this.dragging.moved()) { return; }
		
		this.fire('pre' + e.type);
		this._fireMouseEvent(e);
	},
	
	_fireMouseEvent: function(e) {
		var type = e.type;
		type = (type == 'mouseenter' ? 'mouseover' : (type == 'mouseleave' ? 'mouseout' : type));
		if (!this.hasEventListeners(type)) { return; }
		this.fire(type, {
			latlng: this.mouseEventToLatLng(e),
			layerPoint: this.mouseEventToLayerPoint(e)
		});
	},
	
	_initInteraction: function() {
		var handlers = {
			dragging: L.Handler.MapDrag,
			touchZoom: L.Handler.TouchZoom,
			doubleClickZoom: L.Handler.DoubleClickZoom,
			scrollWheelZoom: L.Handler.ScrollWheelZoom,
			shiftDragZoom: L.Handler.ShiftDragZoom
		};
		for (var i in handlers) {
			if (handlers.hasOwnProperty(i) && handlers[i]) {
				this[i] = new handlers[i](this);
				if (this.options[i]) this[i].enable();
			}
		}
	},
	
	_onTileLayerLoad: function() {
		// clear scaled tiles after all new tiles are loaded (for performance)
		this._tileLayersToLoad--;
		if (this._tileLayersNum && !this._tileLayersToLoad && this._tileBg) {
			clearTimeout(this._clearTileBgTimer);
			this._clearTileBgTimer = setTimeout(L.Util.bind(this._clearTileBg, this), 500);
		}
	},
	

	// private methods for getting map state
	
	_getTopLeftPoint: function() {
		if (!this._loaded) throw new Error('Set map center and zoom first.');
		var offset = L.DomUtil.getPosition(this._mapPane);
		return this._initialTopLeftPoint.subtract(offset);
	},
	
	_getNewTopLeftPoint: function(center) {
		var viewHalf = this.getSize().divideBy(2);
		return this.project(center).subtract(viewHalf).round();
	},
	
	_limitZoom: function(zoom) {
		var min = this.getMinZoom();
		var max = this.getMaxZoom();
		return Math.max(min, Math.min(max, zoom));
	}
});

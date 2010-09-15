/*
 * LL.Map is the central class of the API - it is used to create a map.
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
		layers: []
	},
	
	
	// constructor
	
	initialize: function(/*HTMLElement or String*/ id, /*Object*/ options) {
		this._container = L.DomUtil.get(id);
		L.Util.extend(this.options, options);
		
		this._initLayout();
		
		var layers = this.options.layers;
		layers = (layers instanceof Array ? layers : [layers]); 
		this._initLayers(layers);
		
		this.setView(this.options.center, this.options.zoom, true);
	},
	
	
	// public methods that modify map state
	
	setView: function(center, zoom, forceReset) {
		zoom = this._limitZoom(zoom);
		
		var zoomChanged = (this._zoom != zoom);

		if (!forceReset && this._layers) {
			// difference between the new and current centers in pixels
			var offset = this._getNewTopLeftPoint(center).subtract(this._getTopLeftPoint()); 
			
			var done = (zoomChanged ? 
						this._zoomToIfCenterInView(zoom, offset) : 
						this._panByIfClose(offset));
			
			// exit if animated pan or zoom started
			if (done) { return this; }
		}
		
		this.fire('movestart');
		
		// reset the map view 
		this._resetView(center, zoom);
		
		this.fire('move');
		if (zoomChanged) { this.fire('zoomend'); }
		this.fire('moveend');
		
		return this;
	},
	
	panBy: function(offset) {
		this._rawPanBy(offset);
		this.fire('viewload');
	},
	
	addLayer: function(layer) {
		this._addLayer(layer);
		this.setView(this.getCenter(), this._zoom, true);
		return this;
	},
	
	invalidateSize: function() {
		this._sizeChanged = true;
		this.fire('viewload');
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

	project: function(/*Object*/ coord, /*(optional) Number*/ zoom)/*-> Point*/ {
		var projectedPoint = this.options.projection.project(coord),
			scale = this.options.scaling(this._zoom || zoom);
		return this.options.transformation.transform(projectedPoint, scale);
	},
	unproject: function(/*Point*/ point, /*(optional) Number*/ zoom, /*(optional) Boolean*/ unbounded)/*-> Object*/ {
		var scale = this.options.scaling(this._zoom || zoom),
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
	},
	
	_createPane: function(className) {
		var pane = document.createElement('div');
		pane.className = className;
		(this._mapPane || this._container).appendChild(pane);
		return pane;
	},
	
	_resetView: function(center, zoom) {
		this._zoom = zoom;
		this._initialTopLeftPoint = this._getNewTopLeftPoint(center);
		
		L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
		
		this.fire('viewreset');
		this.fire('viewload');
	},
	
	_initLayers: function(layers) {
		this._layers = [];
		for (var i = 0, len = layers.length; i < len; i++) {
			this._addLayer(layers[i]);
		}
	},
	
	_addLayer: function(layer) {
		this._layers.push(layer);
		
		layer.onAdd(this);
		this.on('viewreset', layer.draw, layer);
		this.on('viewload', layer.load, layer);
		
		this._layersMaxZoom = Math.max(this._layersMaxZoom || 0, layer.options.maxZoom);
		this._layersMinZoom = Math.min(this._layersMinZoom || Infinity, layer.options.minZoom);
		
		this.fire('layeradded', {layer: layer});
	},
	
	_rawPanBy: function(offset) {
		var mapPaneOffset = L.DomUtil.getPosition(this._mapPane);
		L.DomUtil.setPosition(this._mapPane, mapPaneOffset.subtract(offset));
	},
	
	_panByIfClose: function(offset) {
		if (this._offsetIsWithinView(offset)) {
			//TODO animated panBy
			//this.panBy(offset);
			return true;
		}
		return false;
	},

	_zoomToIfCenterInView: function(offset, oldZoom) {
		//if offset does not exceed half of the view
		if (this._offsetIsWithinView(offset, 0.5)) {
			//TODO animated zoom
			return true;
		}
		return false;
	},

	
	// private methods for getting map state
	
	_getTopLeftPoint: function() {
		var offset = L.DomUtil.getPosition(this._mapPane);
		return this._initialTopLeftPoint.subtract(offset);
	},
	_getNewTopLeftPoint: function(center) {
		var viewHalf = this.getSize().divideBy(2, true);
		return this.project(center).subtract(viewHalf);
	},
	
	_offsetIsWithinView: function(offset, multiplyFactor) {
		var m = multiplyFactor || 1,
			size = this.getSize();
		return (Math.abs(offset.x) <= size.width * m) && 
				(Math.abs(offset.y) <= size.height * m);
	},
	
	_limitZoom: function(zoom) {
		var min = this.options.minZoom || this._layersMinZoom || 0;
		var max = this.options.maxZoom || this._layersMaxZoom || Infinity;
		return Math.max(min, Math.min(max, zoom));
	}
});
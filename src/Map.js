/*
 * LL.Map is the central class of the API - it is used to create a map.
 */

L.Map = L.Class.extend({
	includes: [L.Mixin.Events, L.Mixin.Options],
	
	options: {
		projection: L.Projection.Mercator,
		transformation: new L.Transformation(0.5/Math.PI, 0.5, -0.5/Math.PI, 0.5), 
		scaling: function(zoom) { return 256 * (1 << zoom); },
		
		center: new L.LatLng(0, 0),
		zoom: 0,
		layers: []
	},
	
	
	initialize: function(/*HTMLElement or String*/ id, /*Object*/ options) {
		this._container = L.DomUtil.get(id);
		L.Util.extend(this.options, options);
		
		this._initLayout();
		this._initLayers(this._options.layers);
		
		this.setView(this.options.center, this.options.zoom, true);
	},
	
	
	setView: function(center, zoom, forceReset) {
		zoom = this._limitZoom(zoom);
		
		var zoomChanged = (this._zoom != zoom);

		if (!forceReset) {
			// difference between the new and current centers in pixels
			var offset = this._getNewTopLeftPoint(center).subtract(this._getTopLeftPoint()); 
			
			var done = (zoomChanged ? 
						this._zoomToIfCenterInView(zoom, offset) : 
						this._panByIfClose(offset));
			
			// exit if animated pan or zoom started
			if (done) { return; }
		}
		
		this.fire('movestart');
		
		// reset the map view 
		this._resetView(center, zoom);
		
		this.fire('move');
		if (zoomChanged) { this.fire('zoomend'); }
		this.fire('moveend');
	},
	
	
	getCenter: function(unbounded) {
		var viewHalf = this.getSize().divideBy(2),
			centerPoint = this._getTopLeftPoint().add(viewHalf);
		return this.unproject(centerPoint, this._zoom, unbounded);
	},
	
	
	addLayer: function(layer) {
		this._addLayer(layer);
		this.setView(this.getCenter(), this._zoom, true);
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
	
	
	getSize: function() {
		if (!this._size || this._sizeChanged) {
			this._size = new L.Point(this._container.clientWidth, this._container.clientHeight);
			this._sizeChanged = false;
		}
		return this._size;
	},
	invalidateSize: function() {
		this._sizeChanged = true;
		this.fire('viewload');
	},
	
	
	getPixelBounds: function() {
		return new L.Bounds(
				this._topLeftPoint, 
				this._topLeftPoint.add(this.getSize()));
	},
	
	
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
	
	_limitZoom: function(zoom) {
		var min = this.options.minZoom || this._layersMinZoom || 0;
		var max = this.options.maxZoom || this._layersMaxZoom || Infinity;
		return Math.max(min, Math.min(max, zoom));
	},
	
	_resetView: function(center, zoom) {
		this._zoom = zoom;
		this._topLeftPoint = this._getNewTopLeftPoint(center);
		
		L.DomUtil.setPosition(this._mapPane, new L.Point(0, 0));
		
		this.fire('viewreset');
		this.fire('viewload');
	},
	
	
	_getTopLeftPoint: function() {
		var offset = L.DomUtil.getPosition(this._mapPane);
		return this._topLeftPoint.add(offset);
	},
	_getNewTopLeftPoint: function(center) {
		var viewHalf = this.getSize().divideBy(2, true);
		return this.project(center).subtract(viewHalf);
	},
	
		
	_rawPanBy: function(offset) {
		var mapPaneOffset = L.DomUtil.getPosition(this._mapPane);
		L.DomUtil.setPosition(this._mapPane, mapPaneOffset.add(offset));
	},
	
	_panByIfClose: function(offset) {
		if (this._offsetIsWithinView(offset)) {
			//TODO animated panBy
			//this.panBy(offset);
			return true;
		}
		return false;
	},
	
	_zoomByIfCenterInView: function(offset, oldZoom) {
		//if offset does not exceed half of the view
		if (this._offsetIsWithinView(offset, 0.5)) {
			//TODO animated zoom
			return true;
		}
		return false;
	},
	
	_offsetIsWithinView: function(offset, multiplyFactor) {
		var m = multiplyFactor || 1,
			size = this.getSize();
		return (Math.abs(offset.x) <= size.width * m) && 
				(Math.abs(offset.y) <= size.height * m);
	},
	
	
	_initLayers: function(layers) {
		for (var i = 0, len = layers.length; i < len; i++) {
			this._addLayer(layers[i]);
		}
	},
	
	_addLayer: function(layer) {
		this._layers.push(layer);
		
		layer.onAdd(this);
		this.on('viewreset', layer.draw);
		this.on('viewload', layer.load);
		
		this._layersMaxZoom = Math.max(this._layersMaxZoom, layer.options.maxZoomLevel);
		this._layersMinZoom = Math.min(this._layersMinZoom, layer.options.minZoomLevel);
		
		this.fire('layeradded', {layer: layer});
	}
});
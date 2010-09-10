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
		//TODO this._initLayers();
		
		this.setView(this.options.center, this.options.zoom, true);
	},
	
	
	setView: function(center, zoom, forceReset) {
		zoom = this._limitZoom(zoom);
		
		if (!forceReset) {
			var zoomChanged = (this._zoom != zoom);
			
			// difference between the new and current centers in pixels
			var offset = this._getCenterOffset(center); 
			
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
			topLeftPoint = this._topLeftPoint.add(this._getMapPaneOffset()),
			centerPoint = topLeftPoint.add(viewHalf);
		return this.unproject(centerPoint, this._zoom, true);
	},
	
	
	addLayer: function(layer) {
		this._layers.push(layer);
		
		layer.onAdd(this);
		map.on('viewreset', layer.draw);
		map.on('viewload', layer.load);
		
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
		//TODO L.Bounds
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
		//TODO minZoom, maxZoom?
		return Math.max(this._minZoom, Math.min(zoom, this._maxZoom));
	},
	
	_resetView: function(center, zoom) {
		this._zoom = zoom;
		this._topLeftPoint = this._getNewTopLeftPoint(center);
		
		this._setMapPaneOffset(new L.Point(0, 0));
		
		this.fire('viewreset');
		this.fire('viewload');
	},
	
	
	_getCenterOffset: function(center) {
		var oldTopLeftPoint = this._topLeftPoint.add(this._getMapPaneOffset()),
			newTopLeftPoint = this._getNewTopLeftPoint(center);
		return newTopLeftPoint.subtract(oldTopLeftPoint);
	},
	
	_getNewTopLeftPoint: function(center) {
		var viewHalf = this.getSize().divideBy(2, true);
		return this.project(center).subtract(viewHalf);
	},
	
	_getMapPaneOffset: function() {
		return L.Point(
				parseInt(this._mapPane.style.left),
				parseInt(this._mapPane.style.top));
		//TODO translate instead of top/left for webkit
	},
	_setMapPaneOffset: function(offset) {
		this._mapPane.style.left = offset.x + 'px';
		this._mapPane.style.top = offset.y + 'px';
		//TODO translate instead of top/left for webkit
	},
	
		
	_rawPanBy: function(offset) {
		this._setMapPaneOffset(this._getMapPaneOffset().add(offset));
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
			size = map.getSize();
		return (Math.abs(offset.x) <= size.width * m) && 
				(Math.abs(offset.y) <= size.height * m);
	}
});
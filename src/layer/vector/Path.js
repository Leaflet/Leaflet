/*
 * L.Path is a base class for rendering vector paths on a map. It's inherited by Polyline, Circle, etc.
 */

L.Path = L.Class.extend({
	includes: [L.Mixin.Events],
	
	statics: {
		// how much to extend the clip area around the map view 
		// (relative to its size, e.g. 0.5 is half the screen in each direction)
		CLIP_PADDING: 0.5
	},
	
	options: {
		stroke: true,
		color: '#0033ff',
		weight: 5,
		opacity: 0.5,
		
		fill: false,
		fillColor: null, //same as color by default
		fillOpacity: 0.2,
		
		clickable: true,
		
		updateOnMoveEnd: true
	},
	
	initialize: function(options) {
		L.Util.setOptions(this, options);
	},
	
	onAdd: function(map) {
		this._map = map;
		
		this._initElements();
		this._initEvents();
		this.projectLatlngs();
		this._updatePath();

		map.on('viewreset', this.projectLatlngs, this);
		
		this._updateTrigger = this.options.updateOnMoveEnd ? 'moveend' : 'viewreset';
		map.on(this._updateTrigger, this._updatePath, this);
	},
	
	onRemove: function(map) {
		map._pathRoot.removeChild(this._container);
		map.off('viewreset', this._projectLatlngs, this);
		map.off(this._updateTrigger, this._updatePath, this);
	},
	
	projectLatlngs: function() {
		// do all projection stuff here
	},
	
	setStyle: function(style) {
		L.Util.setOptions(this, style);
		if (this._container) {
			this._updateStyle();
		}
		return this;
	},
	
	_initElements: function() {
		this._initRoot();
		this._initPath();
		this._initStyle();
	},
	
	_updateViewport: function() {
		var p = L.Path.CLIP_PADDING,
			size = this._map.getSize(),
			//TODO this._map._getMapPanePos()
			panePos = L.DomUtil.getPosition(this._map._mapPane), 
			min = panePos.multiplyBy(-1).subtract(size.multiplyBy(p)),
			max = min.add(size.multiplyBy(1 + p * 2));
		
		this._map._pathViewport = new L.Bounds(min, max);
	},
	
	_redraw: function() {
		this.projectLatlngs();
		this._updatePath();
	}
});
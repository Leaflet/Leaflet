L.Control.ZoomSlider = L.Control.extend({
	options: {
		position: 'topleft',
		handleStep: 8,
		handleHeight: 19
	},
	
	onAdd: function (map) {
		this._map = map;
		this._sliding = false;
		var className = 'leaflet-control-zoom',
			container = L.DomUtil.create('div', className);
		this._createButton('Zoom in', className + '-in', container, map.zoomIn, map);
		this._createSlider(className + '-slide', container, map);
		this._createButton('Zoom out', className + '-out', container, map.zoomOut, map);
		map.on('zoomend', this._update, this);
		map.on('layeradd', this._updateFull, this);
		this._update();
		return container;
	},
	
	onRemove: function (map) {
		map.off('zoomend', this._update, this);
	},
	
	_createButton: function (title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.href = '#';
		link.title = title;
		L.DomEvent
			.addListener(link, 'click', L.DomEvent.stopPropagation)
			.addListener(link, 'click', L.DomEvent.preventDefault)
			.addListener(link, 'click', fn, context)
			.addListener(link, 'dblclick', L.DomEvent.stopPropagation)
			.addListener(link, 'dblclick', L.DomEvent.preventDefault);
		return link;
	},
	
	_createSlider: function (className, container, context) {
		this._sTrack = L.DomUtil.create('div', className, container);
		this._sTrackHeight = this._calcTrackHeight(context);
		this._sTrack.style.height = (this._sTrackHeight + this.options.handleHeight) + 'px';
		this._sTrack.style.position = 'relative';
		this._sHandle = L.DomUtil.create('div', className + '-handle', this._sTrack);
		this._sHandle.style.position = 'absolute';
		this._sHandle.style.top = 0;
		this._sHandle.style.height = this.options.handleHeight + 'px';
		L.DomEvent
			.addListener(this._sHandle, 'mousedown', this._startSliding, this)
			.addListener(this._sTrack, 'click', this._setZoom, this)
			.addListener(window, 'mouseup', this._stopSliding, this)
			.addListener(window, 'mousemove', this._handleSliding, this);
	},
	
	_update: function () {
		var _t = this._sTrackHeight - ((this._map.getZoom() - this._map.getMinZoom()) * this.options.handleStep);
		this._sHandle.style.top = _t + 'px';
	},
	
	_updateFull: function () {
		this._sTrackHeight = this._calcTrackHeight(this._map);
		this._sTrack.style.height = (this._sTrackHeight + this.options.handleHeight) + 'px';
		var _t = this._sTrackHeight - ((this._map.getZoom() - this._map.getMinZoom()) * this.options.handleStep);
		if (_t > this._sTrackHeight)
		{
			_t = this._sTrackHeight;
		}
		this._sHandle.style.top = _t + 'px';
		if (this._map.getZoom() < this._map.getMinZoom())
		{
			this._map.setZoom(this._map.getMinZoom());
		}
	},
	
	_calcTrackHeight: function () {
		return (this._map.getMaxZoom() - this._map.getMinZoom()) * (this.options.handleStep ? this.options.handleStep : 10);
	},
	
	_startSliding: function (e) {
		this._map.dragging._draggable.disable();
		L.DomUtil.disableTextSelection();
		this._sliding = true;
		this._sHandleOffset = L.DomEvent.getMousePosition(e, this._sHandle);
	},
	
	_stopSliding: function (e) {
		if (this._sliding)
		{
			this._map.dragging._draggable.enable();
			L.DomUtil.enableTextSelection();
			this._sliding = false;
			var _z = this._map.getMaxZoom() - Math.round(this._sHandle.offsetTop / this.options.handleStep);
			var _t = this._sTrackHeight - (_z * this.options.handleStep);
			this._sHandle.style.top = _t + 'px';
			this._map.setZoom(_z);
		}
	},
	
	_handleSliding: function (e) {
		if (this._sliding)
		{
			var _p = L.DomEvent.getMousePosition(e, this._sTrack);
			var _t = _p.y - this._sHandleOffset.y;
			_t = _t < 0 ? 0 : (_t > this._sTrackHeight ? this._sTrackHeight : _t);
			this._sHandle.style.top = _t + 'px';
		}
	},
	
	_setZoom: function (e) {
		var _p = L.DomEvent.getMousePosition(e, this._sTrack);
		var _y = _p.y - (this.options.handleHeight / 2);
		var _z = this._map.getMaxZoom() - this._map.getMinZoom() - Math.round((_y < 0 ? 0 : (_y > this._sTrackHeight ? this._sTrackHeight : _y)) / this.options.handleStep);
		var _t = this._sTrackHeight - (_z * this.options.handleStep);
		this._sHandle.style.top = _t + 'px';
		this._map.setZoom(_z + this._map.getMinZoom());
	}
});
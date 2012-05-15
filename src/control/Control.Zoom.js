L.Map.mergeOptions({
	zoomControl: true,
	zoomBar: true
});

L.Control.Zoom = L.Control.extend({
	options: {
		position: 'topleft'
	},

	onAdd: function (map) {
		var className = 'leaflet-control-zoom',
		    container = L.DomUtil.create('div', className);

		this._createButton('Zoom in', className + '-in', container, map.zoomIn, map);
		this._createButton('Zoom out', className + '-out', container, map.zoomOut, map);

		if (map.options.zoomBar) {
			/* map options regarding zoom are updated later, so adding/setting up zoom bar must be triggered after map load */
			/* @TODO: add a zoom bar with default size (i.e. 18 bars) without waiting for map to load completely and just resize it after map load or layer change */
			map.on('load', this._addZoomBar, this);
		}

		return container;
	},

	_createButton: function (title, className, container, fn, context) {
		var link = L.DomUtil.create('a', className, container);
		link.href = '#';
		link.title = title;

		L.DomEvent
			.addListener(link, 'click', L.DomEvent.stopPropagation)
			.addListener(link, 'click', L.DomEvent.preventDefault)
			.addListener(link, 'click', fn, context);

		return link;
	},
	
	_addZoomBar: function () {
		var map = this._map,
			minZoom = map.getMinZoom(),
			maxZoom = map.getMaxZoom(),
			containerChildren = this._container.childNodes;
			
		for (var i = minZoom; i <= maxZoom; i++) {
			var singleZoomBar = L.DomUtil.create('a', 'leaflet-control-zoom-bar');
			singleZoomBar.href = '#';
			singleZoomBar.title = 'Zoom';
			
			L.DomEvent.addListener(singleZoomBar, 'click', this._zoomBarClick, map);
			
			this._container.insertBefore(singleZoomBar, containerChildren[1]);
		}
		
		this._updateZoomBar();
		
		map.on('zoomend', this._updateZoomBar, this);
	},
	
	_zoomBarClick: function (e) {
		var maxZoom = this.getMaxZoom(),
			clickedElement;

		L.DomEvent.stopPropagation(e);
		
		if (e.target) {
			clickedElement = e.target;
		} else { // for ie
			clickedElement = e.srcElement;
		}
		
		var zoomBars = L.DomUtil.getByClass(this._container, 'leaflet-control-zoom-bar');
		
		for (var i = 0; i < zoomBars.length; i++) {
			if (zoomBars[i] === clickedElement) {
				this.setZoom(Math.abs(i - maxZoom));
				break;
			}
		}
	},
	
	_updateZoomBar: function () {
		var map = this._map,
			zoom = map.getZoom(),
			maxZoom = map.getMaxZoom();
			
		var zoomBars = L.DomUtil.getByClass(this._container, 'leaflet-control-zoom-bar');
		
		for (var i = 0; i < zoomBars.length; i++) {
			if (i === Math.abs(zoom - maxZoom)) {
				L.DomUtil.addClass(zoomBars[i], 'current');
			} else {
				L.DomUtil.removeClass(zoomBars[i], 'current');
			}
		}
	}
});

L.Map.addInitHook(function () {
	if (this.options.zoomControl) {
		this.zoomControl = new L.Control.Zoom();
		this.addControl(this.zoomControl);
	}
});
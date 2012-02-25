
L.Marker.Label = L.Class.extend({

	includes: L.Mixin.Events,

	options: {
		color: '',
		labelClass: '',
		labelMarkup: '',
		offsets: {
			x: 0,
			y: 0
		},
		zIndexOffset: 0
	},

	initialize: function (point, options) {
		L.Util.setOptions(this, options);
		
		this._point = point;
		this._label = null;
	},

	onAdd: function (map) {
		this._map = map;
		this._initLabel();
		
		L.DomEvent.addListener(this._label, 'click', this._onMouseClick, this);
	},

	onRemove: function (map) {
		this._removeLabel();
		this._map = null;
	},

	getPoint: function () {
		return this._point;
	},

	setPoint: function (point) {
		this._point = point;
	},
	
	_applyOffsets: function (offsets) {
        //account for IE 8 failing to report typeof number properly when number = 0
		if ("undefined" !== typeof offsets.x && 0 !== offsets.x) {
			this._label.style.marginLeft = offsets.x + "px";
		}
        if ("undefined" !== typeof  offsets.y && 0 !== offsets.y) {
            this._label.style.marginTop = offsets.y + "px";
		}
	},

	_initLabel: function () {
        var options =  this.options,
            newLabel;
    
        newLabel = L.DomUtil.create("div", options.labelClass, this._map.overlayPane);
		newLabel.innerHTML = options.labelMarkup;
		
		if ("string" === typeof options.color) {
            newLabel.style.color = options.color;
		}
		if ("number" === typeof options.zIndexOffset) {
            newLabel.style.zIndex = options.zIndexOffset;
		}
		
		this._label = newLabel;
		
		L.DomUtil.setPosition(this._label, this._point);
		this._applyOffsets(this.options.offsets);

		this._map._panes.overlayPane.appendChild(this._label);
	},
	
	_onMouseClick: function (e) {
		if (this._map.dragging && this._map.dragging.moved()) {
			return;
		}

		this._fireMouseEvent(e);
	},
	
	_fireMouseEvent: function (e) {
		if (!this.hasEventListeners(e.type)) {
			return;
		}
		var map = this._map,
			containerPoint = map.mouseEventToContainerPoint(e),
			layerPoint = map.containerPointToLayerPoint(containerPoint),
			latlng = map.layerPointToLatLng(layerPoint);

		this.fire(e.type, {
			latlng: latlng,
			layerPoint: layerPoint,
			containerPoint: containerPoint,
			originalEvent: e
		});

		L.DomEvent.stopPropagation(e);
	},

	_removeLabel: function () {
		if (this._label) {
			this._map._panes.overlayPane.removeChild(this._label);
			this._label = null;
		}
	}
});

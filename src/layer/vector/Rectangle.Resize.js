/* Added  resizable to Rectangle */
L.Rectangle.Resize = L.Handler.extend({

	initialize : function(rectangle) {
		this._rectangle = rectangle;
	},

	addHooks : function() {
		this._initCorners();
	},

	removeHooks : function() {
		this._destroyCorners();
	},

	_initCorners : function() {
		if (!this._rectangle._map)
			return;
		if (!!this._cornersGroup)
			return;
		var latLngs = this._rectangle._latlngs;
		this._cornersGroup = new L.LayerGroup();
		this._cornerMarkers = {
			southWest : new L.Marker(latLngs[0], {
				draggable : true
			}),
			northWest : new L.Marker(latLngs[1], {
				draggable : true
			}),
			northEast : new L.Marker(latLngs[2], {
				draggable : true
			}),
			southEast : new L.Marker(latLngs[3], {
				draggable : true
			})
		};
		
		for (var i in this._cornerMarkers) {
			var cornerMarker = this._cornerMarkers[i];
			cornerMarker._editRectangle = this;
			cornerMarker.on('dragstart', this._onCornerDragStart, this);
			this._cornersGroup.addLayer(cornerMarker);
		}
		this._rectangle._map.addLayer(this._cornersGroup);
		
	},

	_destroyCornersGroup : function() {
		for (i in this._cornerMarkers) {
			var cornerMarker = this._cornerMarkers[i];
			cornerMarker.off('dragstart', this._onCornerDragStart);
			this._cornersGroup.removeLayer(cornerMarker);
		}
		this._rectangle._map.removeLayer(this._cornersGroup);

		delete this._cornerMarkers;
		delete this._cornersGroup;
	},

	_onCornerDragStart : function(event) {
			var marker = event.target;
			var latlng = marker.getLatLng();
			var corners = this._cornerMarkers;
			console.log("Got dragstart in rectangle.resize: LatLng: " + latlng);
			
			marker.on('drag', this._onCornerDragMove, this);
			marker.on('dragend', this._onCornerDragEnd, this);
	},

	_onCornerDragMove : function(event) {

		console.log('Got dragmove in rectangle.resize');
		this._updateRectangle(event);
	},
	
	_updateRectangle: function(event) {
		var marker = event.target;
		var newLatlng = marker.getLatLng();
		var corners = this._cornerMarkers;
		var latlngs = this._rectangle.getLatLngs();
		
		switch(marker){
			case corners.southWest:
				latlngs[0] = latlngs[4] = newLatlng;
				this._rectangle.setLatLngs(latlngs);
				console.log("southWest");
				break;
			case corners.southEast:
				latlngs[3] = newLatlng;
				console.log("southEast");
				break;
			case corners.northEast:
				latlngs[2] = newLatlng;
				console.log("northEast");
				break;
			case corners.northWest:
				latlngs[1] = newLatlng;
				console.log("northWest");
				break;
			default:
				console.log("error, unknown corner");
		};
		this._rectangle.setLatLngs(latlngs);
	},
	
	_onCornerDragEnd : function(event) {
		var marker = event.target;
		
		console.log('Got dragend in rectangle.resize');
		this._updateRectangle(event);
		marker.off('drag', this._onCornerDragMove, this);
		marker.off('dragend', this._onCornerDragEnd, this);
	},

});

L.Rectangle.prototype._preResize = {
		initialize:  L.Rectangle.prototype.initialize,
		onAdd     :  L.Rectangle.prototype.onAdd,
		onRemove  :  L.Rectangle.prototype.onRemove
};

L.Rectangle.prototype.initialize = function (latlngBounds, options){
	L.Rectangle.prototype._preResize.initialize.call(this, latlngBounds, options);
	
	this.resizing = new L.Rectangle.Resize(this);
};

L.Rectangle.prototype.onAdd = function(map) {
	L.Rectangle.prototype._preResize.onAdd.call(this, map);
	if (this.options.resizable && !this.options.editable) {
		this.resizing.addHooks();
	}
};

L.Rectangle.prototype.onRemove = function(map) {
	if(this.options.resizable && !this.options.editable) {
		this.resizing.removeHooks();
	}
	L.Rectangle.prototype._preResize.onRemove.call(this, map);
};



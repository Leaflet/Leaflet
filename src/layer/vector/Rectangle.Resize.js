/* This class adds the capability to Rectangle to be resizable */
L.Rectangle.Resize = L.Handler.extend({

	initialize : function (rectangle) {
		this._rectangle = rectangle;
	},

	addHooks : function () {
		this._initCorners();
	},

	removeHooks : function () {
		this._destroyCorners();
	},

	_initCorners : function () {
	  
		if (!this._rectangle._map) {
			return;
		}
		
		if (!!this._cornersGroup) {
			return;
		}
		
		this._rectangle.on('move', this._onMove, this)
		               .on('moveend', this._onMove, this);
		
			
		var icon = this._rectangle.options.resizeIcon || new L.Icon.Default();
		
		var latLngs = this._rectangle._latlngs;
		this._cornersGroup = new L.LayerGroup();
		this._cornerMarkers = {
			southWest : new L.Marker(latLngs[0], {
				draggable : true,
				icon : icon
			}),
			northWest : new L.Marker(latLngs[1], {
				draggable : true,
				icon : icon
			}),
			northEast : new L.Marker(latLngs[2], {
				draggable : true,
				icon : icon
			}),
			southEast : new L.Marker(latLngs[3], {
				draggable : true,
				icon : icon
			})
		};
		
		for (var i in this._cornerMarkers) {
		  if (this._cornerMarkers.hasOwnProperty(i)) {
		    var cornerMarker = this._cornerMarkers[i];
		    cornerMarker._editRectangle = this;
		    cornerMarker.on('dragstart', this._onCornerDragStart, this);
		    this._cornersGroup.addLayer(cornerMarker);
		  }
		}
		
		this._rectangle._map.addLayer(this._cornersGroup);
		
	},

	_destroyCorners : function () {
	  if(!this._cornerMarkers || !this._cornersGroup) {
	     return;
	  }
	  
                   
		for (var i in this._cornerMarkers) {
		  if (this._cornerMarkers.hasOwnProperty(i)) {
  			var cornerMarker = this._cornerMarkers[i];
  			cornerMarker.off('dragstart', this._onCornerDragStart);
  			this._cornersGroup.removeLayer(cornerMarker);
			}
		}
		this._rectangle._map.removeLayer(this._cornersGroup);
		
    this._rectangle.off('move', this._onMove, this)
                   .off('moveend', this._onMove, this);

		delete this._cornerMarkers;
		delete this._cornersGroup;
	},

	_onCornerDragStart : function (event) {
			var marker = event.target;
			
			marker.on('drag', this._onCornerDragMove, this);
			marker.on('dragend', this._onCornerDragEnd, this);
	},

	_onCornerDragMove : function (event) {
		this._updateRectangle(event);
	},
	
	_updateRectangle: function (event) {
		var marker = event.target;
		var corners = this._cornerMarkers;
		var latlngs = this._rectangle.getLatLngs();
		
		
		var swLatLngOld = latlngs[0], nwLatLngOld = latlngs[1],
		    neLatLngOld = latlngs[2], seLatLngOld = latlngs[3];
		    
		var swLatLng, seLatLng, neLatLng, nwLatLng;
		
		switch(marker){
			case corners.southWest:
			  swLatLng = marker.getLatLng();
			  seLatLng = new L.LatLng(marker.getLatLng().lat, seLatLngOld.lng);
			  neLatLng = neLatLngOld;
			  nwLatLng = new L.LatLng(nwLatLngOld.lat, marker.getLatLng().lng);
			  corners.southEast.setLatLng(seLatLng);
			  corners.northEast.setLatLng(neLatLng);
			  corners.northWest.setLatLng(nwLatLng);
				break;
			case corners.southEast:
        swLatLng = new L.LatLng(marker.getLatLng().lat, swLatLngOld.lng);
        seLatLng = marker.getLatLng();
        neLatLng = new L.LatLng(neLatLngOld.lat, marker.getLatLng().lng);
        nwLatLng = nwLatLngOld;
        corners.southWest.setLatLng(swLatLng);
        corners.northEast.setLatLng(neLatLng);
        corners.northWest.setLatLng(nwLatLng);
				break;
			case corners.northEast:
        swLatLng = swLatLngOld;
        seLatLng = new L.LatLng(seLatLngOld.lat, marker.getLatLng().lng);
        neLatLng = marker.getLatLng();
        nwLatLng = new L.LatLng(marker.getLatLng().lat, nwLatLngOld.lng);
        corners.southWest.setLatLng(swLatLng);
        corners.southEast.setLatLng(seLatLng);
        corners.northWest.setLatLng(nwLatLng);
				break;
			case corners.northWest:
        swLatLng = new L.LatLng(swLatLngOld.lat, marker.getLatLng().lng);
        seLatLng = seLatLngOld;
        neLatLng = new L.LatLng(marker.getLatLng().lat, neLatLngOld.lng);
        nwLatLng = marker.getLatLng();
        
        corners.southWest.setLatLng(swLatLng);
        corners.southEast.setLatLng(seLatLng);
        corners.northEast.setLatLng(neLatLng);
				break;
		};
		this._rectangle.setBounds(new L.LatLngBounds(swLatLng, neLatLng));
	},
	
	_onCornerDragEnd : function (event) {
		var marker = event.target;
		marker.off('drag', this._onCornerDragMove, this);
		marker.off('dragend', this._onCornerDragEnd, this);
		
    this._updateRectangle(event);
	},
	
  _onMove : function () {
    var bounds = this._rectangle.getBounds();
    var corners = this._cornerMarkers;
    
    corners.southWest.setLatLng(bounds.getSouthWest());
    corners.southEast.setLatLng(bounds.getSouthEast());
    corners.northEast.setLatLng(bounds.getNorthEast());
    corners.northWest.setLatLng(bounds.getNorthWest());
    
  }
});

//
// The following code wraps the rectangles initalize, onAdd
// and onRemove functions to call into the Rectangle.Resize Handler
//
L.Rectangle.prototype._preResize = {
		initialize:  L.Rectangle.prototype.initialize,
		onAdd     :  L.Rectangle.prototype.onAdd,
		onRemove  :  L.Rectangle.prototype.onRemove
};

L.Rectangle.prototype.initialize = function (latlngBounds, options){
	L.Rectangle.prototype._preResize.initialize.call(this, latlngBounds, options);
	
	this.resizing = new L.Rectangle.Resize(this);
};

L.Rectangle.prototype.onAdd = function (map) {
	L.Rectangle.prototype._preResize.onAdd.call(this, map);
	if (this.options.resizable && !this.options.editable) {
		this.resizing.addHooks();
	}
};

L.Rectangle.prototype.onRemove = function (map) {
	if(this.options.resizable && !this.options.editable) {
		this.resizing.removeHooks();
	}
	L.Rectangle.prototype._preResize.onRemove.call(this, map);
};



/* Added draggable, and resizable to Rectangle */
L.Rectangle.Edit = L.Handler.extend({
  statics: {
    START: L.Browser.touch ? 'touchstart' : 'mousedown',
    END: L.Browser.touch ? 'touchend' : 'mouseup',
    MOVE: L.Browser.touch ? 'touchmove' : 'mousemove'
  },
  
  options: {
    
  },
  
  initialize: function(rectangle) {
    this._rectangle = rectangle;
    L.Util.setOptions(this, options);
  },
  
  addHooks: function() {
    if (this._rectangle._map) {
      if (!this._editLayer) {
        this._initEditLayer();
      }
      this._rectangle._map.addLayer(this._editLayer);
    }
  },
  
  removeHooks: function() {
    if (this._rectangle._map) {
      this._rectangle._map.removeLayer(this._editLayer);
      this._destroyEditLayer();
    }
  },
  
  _initEditLayer: function() {
    this._editLayer = new L.LayerGroup();
    
    var latLngs = this._rectangle._boundsToLatLngs();
    this._borderLine = new L.Polyline(latLngs);
    this._borderLine._rectangleEdit = this;
    
    L.DomEvent.addListener(this._borderLine, L.Draggable.START, this._onBorderDragStart, this);
    
    this._editLayer.addLayer(this._borderLine);
    
    this._cornerMarkers = {
      southWest: new L.Marker(latLngs[0], {draggable: true}),
      northWest: new L.Marker(latLngs[1], {draggable: true}),
      northEast: new L.Marker(latLngs[2], {draggable: true}),
      southEast: new L.Marker(latLngs[3], {draggable: true})
    };
    for (i in this._cornerMarkers) {
      var cornerMarker = this._cornerMarkers[i];
      cornerMarker._editRectangle = this;
      cornerMarker.on('dragstart', this._onCornerDragStart, this);
      this._editLayer.addLayer(cornerMarker);
    }
    
  },
  
  _destroyEditLayer: function() {
    L.DomEvent.removeListener(this._borderLine, L.Draggable.START, this._onBorderDragStart);
    this._editLayer.removeLayer(this._borderLine);
    
    for (i in this._cornerMarkers) {
      var cornerMarker = this._cornerMarkers[i];
      cornerMarker.off('dragstart', this._onCornerDragStart);
      this._editLayer.removeLayer(cornerMarker);
    }
    
    delete this._cornerMarkers;
    delete this._borderLine;
    delete this._editLayer;
  },
  
  _onBorderDragStart: function(event) {
    
  },
  
  _onBorderDragMove: function(event) {
    
  },
  
  _onBorderDragEnd: function(event) {
    
  },
  
  _onCornerDragStart: function(event) {
    
  },
  
  _onCornerDragMove: function(event) {
    
  },
  
  _onCornerDragEnd: function(event) {
    
  },
  
  _onRectangleDragStart: function(event) {
    
  },
  
  _onRectangleDragMove: function(event) {
    
  }
  
  _onRectangleDragEnd: function(event) {
    
  },
  
  
  
});

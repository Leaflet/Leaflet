/*
 * Enable Drawing and editing support for polylines.
 */

L.Polyline = L.Polyline.extend({
  enableDrawing: function () {
    if (!this._drawingEnabled) {
      this._map.on('click', this._onDrawingClick, this);
      this._drawingEnabled = true;
    }
  },
  disableDrawing: function () {
    if (this._drawingEnabled) {
      this._map.off('click', this._onDrawingClick, this);
      this._drawingEnabled = false;
    }
  },
  drawingEnabled: function () {
    return !!this._drawingEnabled;
  },
  enableEditing: function() {
    var a, b;
    if (!this.editingEnabled()) {
      this._markers = [];
      for (a = 0; a < this._latlngs.length; a++) {
        this._markers.push(this._createMarker(this._latlngs[a]))
      }
      for (a = 0, b = this._markers.length - 1; a < this._markers.length; b = a++) {
        // TODO
//        if (a === 0 && !(CM.Polygon && (this instanceof CM.Polygon))) {
//          continue
//        }
//        this._createMiddleMarker(this._markers[b], this._markers[a])
      }
      this._editingEnabled = true
    }
  },
  disableEditing: function() {
    if (this.editingEnabled()) {
      for (var a = 0; a < this._markers.length; a++) {
//        this._map.removeLayer(this._markers[a]);
        // TODO
//        if (this._markers[a].middleRight) {
//          this.map.removeOverlay(this._markers[a].middleRight)
//        }
      }
      this._markers = [];
      this._editingEnabled = false
    }
  },
  editingEnabled: function() {
    return !!this._editingEnabled;
  },
  _createMarker: function(latlng) {
    // TODO
//    var m = new L.Circle(latlng, 100);
//    this._map.addLayer(m);
//    this._attachMarkerOnDrag(m);
//    return m
    var s = this._make_square(latlng, 100);
    this._map.addLayer(s);
    return s;
  },
  _make_square: function(latlng, width) {
    var point = this._map.latLngToLayerPoint(latlng),
        adjust = width / 2,
        bl = this._map.layerPointToLatLng(new L.Point(point.x - adjust, point.y + adjust)),
        br = this._map.layerPointToLatLng(new L.Point(point.x + adjust, point.y + adjust)),
        tl = this._map.layerPointToLatLng(new L.Point(point.x - adjust, point.y - adjust)),
        tr = this._map.layerPointToLatLng(new L.Point(point.x + adjust, point.y - adjust)),
        s = new L.Polygon([tl, bl, br, tr]);
    return s;
  },
  _onDrawingClick: function (e) {
    this.addLatLng(e.latlng);
    if (this._editingEnabled) {
      this._markers.push(this._createMarker(e.latlng));
//      if (b > 0) {
//        if (this._markers[b - 1].middleRight) {
//          this.map.removeOverlay(this._markers[b - 1].middleRight)
//        }
//        this._createMiddleMarker(this._markers[b - 1], this._markers[b]);
//        if (CM.Polygon && (this instanceof CM.Polygon)) {
//          this._createMiddleMarker(this._markers[b], this._markers[0])
//        }
//      }
    }
  },
  _attachMarkerOnDrag: function(m) {
    //TODO
  }

});


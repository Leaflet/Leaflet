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
  _onDrawingClick: function (e) {
    this.addLatLng(e.latlng);
//    if (this._editingEnabled) {
//      this._markers.push(this._createMarker(a));
//      if (b > 0) {
//        if (this._markers[b - 1].middleRight) {
//          this.map.removeOverlay(this._markers[b - 1].middleRight)
//        }
//        this._createMiddleMarker(this._markers[b - 1], this._markers[b]);
//        if (CM.Polygon && (this instanceof CM.Polygon)) {
//          this._createMiddleMarker(this._markers[b], this._markers[0])
//        }
//      }
//    }
  }
});


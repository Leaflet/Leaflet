/*
 * Enable Drawing and editing support for polylines.
 */

L.Polyline = L.Polyline.extend({
  enableDrawing: function () {
    if (!this._drawingEnabled) {
      //CM.Event.addListener(this.map, 'click', this._onDrawingClick, this);
      this._drawingEnabled = true;
    }
  },
  disableDrawing: function () {
    if (this._drawingEnabled) {
      //CM.Event.removeListener(this.map, 'click', this._onDrawingClick, this);
      this._drawingEnabled = false;
    }
  },
  drawingEnabled: function () {
    return !!this._drawingEnabled;
  },

});


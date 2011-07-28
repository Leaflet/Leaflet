/*
 * Base Class to enable drawing and editing support.
 * Extensions add additional functionality to individual vector objects.
 * For example, Polyline.Drawing.js
 */
L.Drawing = {
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
      this._createEndMarkers();
      this._editingEnabled = true;
    }
  },

  disableEditing: function() {
    if (this.editingEnabled()) {
      this._removeMarkers();
      this._editingEnabled = false;
    }
  },

  editingEnabled: function() {
    return !!this._editingEnabled;
  },
};


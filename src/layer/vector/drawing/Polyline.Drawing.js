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

  _createEndMarkers: function() {
    this._markers = [];
    for (a = 0; a < this._latlngs.length; a++) {
      this._markers.push(this._createMarker(this._latlngs[a], a))
    }
    for (a = 0, b = this._markers.length - 1; a < this._markers.length; b = a++) {
      // TODO
//        if (a === 0 && !(CM.Polygon && (this instanceof CM.Polygon))) {
//          continue
//        }
//        this._createMiddleMarker(this._markers[b], this._markers[a])
    }
  },

  _createMarker: function(latlng, vertexIndex) {
    var m = new L.Marker(latlng, {icon: this._fetchIcon(), draggable: true});
    m._vertexIndex = vertexIndex;
    this._map.addLayer(m);
    this._attachRemoveAction(m);
    this._attachDragAction(m);
    return m;
  },

  _fetchIcon: function() {
    if (!this._pointIcon) {
      var i = new L.Icon({
        iconUrl: L.ROOT_URL + 'images/square.gif',
      	includeShadow: false,
        iconSize: new L.Point(10, 10),
	    	iconAnchor: new L.Point(5, 5),
	      popupAnchor: new L.Point(5, 5)
      });
      this._pointIcon = i;
    }
    return this._pointIcon;
  },

  _removeMarkers: function() {
    for (var a = 0; a < this._markers.length; a++) {
      this._map.removeLayer(this._markers[a]);
//         TODO
//        if (this._markers[a].middleRight) {
//          this.map.removeOverlay(this._markers[a].middleRight)
//        }
    }
    this._markers = [];
  },

  _removeSingleMarker: function(m) {
    this._markers.splice(L.Util.indexOf(this._markers, m), 1);
    this._map.removeLayer(m);
  },

  _onDrawingClick: function (e) {
    this.addLatLng(e.latlng);
    if (this._editingEnabled) {
      this._markers.push(this._createMarker(e.latlng, this._latlngs.length - 1));
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
    this.fire('lineupdated');
  },

  _setVertex: function(i, latlng) {
    this._latlngs[i] = latlng;
    this._redraw();
    this.fire('lineupdated');
  },

  _removeVertex: function(i) {
    this.spliceLatLngs(i, 1);
    this.fire('lineupdated');
  },

  _reassignVertices: function() {
    // at this point, there should be the same number of markers as vertices
    // and they should still be in order
    for (var i = 0; i < this._latlngs.length; i++) {
      this._markers[i]._vertexIndex = i;
    }
  },

  _attachRemoveAction: function(m) {
    m.on('click', function(e) {
      this._removeVertex(e.target._vertexIndex);
      this._removeSingleMarker(e.target);
      this._reassignVertices();
    }, this);
  },

  _attachDragAction: function(m) {
    m.on('drag', function(e) {
      this._setVertex(e.target._vertexIndex, e.target._latlng);

//    CM.Event.addListener(d, 'drag', function () {
//      var a = this._getIndex(d);
//      this.setVertex(a, d.getLatLng());
//      var b = this._markers[(a > 0 ? a - 1 : this._markers.length - 1)];
//      var c = this._markers[(a < this._markers.length - 1 ? a + 1 : 0)];
//      if (d.middleLeft) {
//        d.middleLeft.setLatLng(this._getMiddleLatLng(b, d))
//      }
//      if (d.middleRight) {
//        d.middleRight.setLatLng(this._getMiddleLatLng(d, c))
//      }
//    }, this)

    }, this);

  }

});


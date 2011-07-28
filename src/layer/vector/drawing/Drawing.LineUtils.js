/*
 * Extensions used by both polyline and polygon.
 */
L.Drawing.LineUtils = {
  _createEndMarkers: function() {
    this._markers = [];
    for (a = 0; a < this._latlngs.length; a++) {
      this._markers.push(this._createMarker(this._latlngs[a], a))
    }
    for (a = 0, b = this._markers.length - 1; a < this._markers.length; b = a++) {
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
    }, this);

  }
};


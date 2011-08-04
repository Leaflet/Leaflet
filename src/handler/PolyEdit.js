/*
 * Editing support for polylines.
 */
L.Handler.PolyEdit = L.Handler.extend({
	initialize: function(polyObj) {
		this._polyObj = polyObj;
	},

	enable: function() {
		if (!this._enabled) {
		  this._createEndMarkers();
      this._polyObj._map.on('click', this._onDrawingClick, this);
      this._enabled = true;
    }
	},

	disable: function() {
		if (!this._enabled) { return; }
		this._polyObj._map.off('click', this._onDrawingClick, this);
		this._removeMarkers();
		this._enabled = false;
	},

  _onDrawingClick: function (e) {
    if (this._polyObj.drawing.enabled()) {
      this._markers.push(this._createMarker(e.latlng, this._polyObj._latlngs.length - 1));
    }
  },

  _createEndMarkers: function() {
    this._markers = [];
    for (a = 0; a < this._polyObj._latlngs.length; a++) {
      this._markers.push(this._createMarker(this._polyObj._latlngs[a], a));
    }
  },

  _createMarker: function(latlng, vertexIndex) {
    var m = new L.Marker(latlng, {icon: this._fetchIcon(), draggable: true});
    m._vertexIndex = vertexIndex;
    this._polyObj._map.addLayer(m);
    this._attachRemoveAction(m);
    this._attachDragAction(m);
    return m;
  },

  _fetchIcon: function() {
    if (!this._pointIcon) {
      var i = L.Icon.extend({
        iconUrl: L.ROOT_URL + 'images/square.gif',
      	includeShadow: false,
        iconSize: new L.Point(10, 10),
	    	iconAnchor: new L.Point(5, 5),
	      popupAnchor: new L.Point(5, 5)
      });
      this._pointIcon = new i();
    }
    return this._pointIcon;
  },

  _removeSingleMarker: function(m) {
    this._markers.splice(m._vertexIndex, 1);
    this._polyObj._map.removeLayer(m);
  },

  _removeMarkers: function() {
    for (var a = 0; a < this._markers.length; a++) {
      this._polyObj._map.removeLayer(this._markers[a]);
    }
    this._markers = [];
  },

  _removeVertex: function(i) {
    this._polyObj.spliceLatLngs(i, 1);
    this._polyObj.fire('lineupdated');
  },

  _reassignVertices: function() {
    // at this point, there should be the same number of markers as vertices
    // and they should still be in order
    for (var i = 0; i < this._polyObj._latlngs.length; i++) {
      this._markers[i]._vertexIndex = i;
    }
  },

  _setVertex: function(i, latlng) {
    this._polyObj._latlngs[i] = latlng;
    this._polyObj._redraw();
    this._polyObj.fire('lineupdated');
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

});


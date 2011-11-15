/*
 * Drawing support for polylines.
 */
L.Handler.PolyDraw = L.Handler.extend({
	initialize: function(polyObj) {
		this._polyObj = polyObj;
	},

	enable: function() {
		if (!this._enabled) {
      this._polyObj._map.on('click', this._onDrawingClick, this);
      this._enabled = true;
    }
	},

	disable: function() {
		if (!this._enabled) { return; }
		this._polyObj._map.off('click', this._onDrawingClick, this);
		this._enabled = false;
	},

  _onDrawingClick: function (e) {
    this._polyObj.addLatLng(e.latlng);
    this._polyObj.fire('lineupdated');
  }

});


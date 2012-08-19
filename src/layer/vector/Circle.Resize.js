/*
 * L.Handler.CircleDrag is used internally by L.Circle to make the circles draggable.
 */

L.Handler.CircleResize = L.Handler.extend({
	options: {
		icon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		})
	},
	
	initialize: function (circle, options) {
		this._circle = circle;
		L.Util.setOptions(this, options);
	},

	addHooks: function () {
		var icon = this.options.icon;
		if (this._circle._map) {
			
			// define handler (icon and position)
			var bounds = this._circle.getBounds();
			this._dragHandler = new L.Marker(bounds.getNorthEast(), {
					icon: this.options.icon,
					draggable: true
				});
			
			// define handler events
			this._dragHandler
				.on('dragstart', this._onDragStart, this)
				.on('drag', this._onDrag, this)
				.on('dragend', this._onDragEnd, this);
			
			// display handler
			this._markerGroup = new L.LayerGroup();
			this._markerGroup.addLayer(this._dragHandler);
			this._circle._map.addLayer(this._markerGroup);
			
			this._circle.on('drag', this._updateHandler, this);
		}
	},
	
	removeHooks: function () {
		if (this._circle._map) {
			this._circle.off('drag', this._updateHandler, this);
			this._markerGroup.removeLayer(this._dragHandler);
			delete this._markerGroup;
		}
	},
	
	_moveHandler: function (e) {
		this._dragHandler.setLatLng(e.latlng);
	},
	_updateHandler: function (e) {
		var bounds = this._circle.getBounds();
		this._dragHandler.setLatLng(bounds.getNorthEast());
	},
	
	_onDragStart: function (e) { },

	_onDrag: function (e) {
		var circleCenter = this._circle.getLatLng(),
			handlerPos = e.target.getLatLng();
		this._circle.setRadius(circleCenter.distanceTo(handlerPos));
		this._circle.fire('resize');
	},
	
	_onDragEnd: function () { }
});

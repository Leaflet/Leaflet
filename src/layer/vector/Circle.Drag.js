/*
 * L.Handler.CircleDrag is used internally by L.Circle to make the circles draggable.
 */

L.Handler.CircleDrag = L.Handler.extend({
	options: {
		icon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		})
	},
	
	initialize: function (circle, options) {
		this._circle = circle;
//		L.Util.setOptions(this, options);
	},

	addHooks: function () {
		var icon = this.options.icon;
		if (this._circle._map) {
			this._dragHandler = new L.Marker(this._circle.getLatLng(), {
					icon: this.options.icon,
					draggable: true
				});
			this._dragHandler
				.on('dragstart', this._onDragStart, this)
				.on('drag', this._onDrag, this)
				.on('dragend', this._onDragEnd, this);
			
			this._markerGroup = new L.LayerGroup();
			this._markerGroup.addLayer(this._dragHandler);
			this._circle._map.addLayer(this._markerGroup);
		}
	},
	
	removeHooks: function () {
		if (this._circle._map) {
			this._markerGroup.removeLayer(this._dragHandler);
			delete this._markerGroup;
		}
	},
	
	_onDragStart: function (e) {
		this._circle
			.fire('movestart')
			.fire('dragstart');
	},

	_onDrag: function (e) {
		// update shadow position
		this._circle.setLatLng(e.target.getLatLng());
		this._circle
			.fire('move')
			.fire('drag');
	},

	_onDragEnd: function () {
		this._circle
			.fire('moveend')
			.fire('dragend');
	}
});

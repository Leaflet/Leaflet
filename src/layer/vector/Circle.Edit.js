L.Handler.CircleEdit = L.Handler.extend({
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
		if (this._circle._map) {
			if (!this._markerGroup) {
				this._initMarkers();
			}
			this._circle._map.addLayer(this._markerGroup);
			this._center.setZIndexOffset(10);
			this._center._icon.style.cursor = "move";
			this._radius._icon.style.cursor = "se-resize";
		}
	},

	removeHooks: function () {
		if (this._circle._map) {
			this._circle._map.removeLayer(this._markerGroup);
			delete this._markerGroup;
		}
	},

	updateMarkers: function () {
		this._markerGroup.clearLayers();
		this._initMarkers();
	},

	_radiusMarkerPoint: function(ll) {
		// From L.Circle.getBounds()
		var delta = this._circle._radius * Math.cos(Math.PI / 4);
			point = map.project(ll);
		return map.unproject([point.x + delta, point.y + delta]);
	},

	_initMarkers: function () {
		if (!this._markerGroup) {
			this._markerGroup = new L.LayerGroup();
		}

		var c = this._circle.getLatLng();
		this._center = this._createMarker(c);
		this._radius = this._createMarker(this._radiusMarkerPoint(c));
	},

	_createMarker: function (latlng) {
		var marker = new L.Marker(latlng, {
			draggable: true,
			icon: this.options.icon
		});

		marker.on('drag', this._onMarkerDrag, this);
		marker.on('dragend', this._fireEdit, this);

		this._markerGroup.addLayer(marker);

		return marker;
	},

	_fireEdit: function () {
		this._circle.fire('edit');
	},

	_onMarkerDrag: function (e) {
		var marker = e.target;

		if (marker === this._center) {
			var c = marker.getLatLng();
			this._radius.setLatLng(this._radiusMarkerPoint(c));
			this._circle.setLatLng(this._center.getLatLng());
		} else {
			var r = this._center.getLatLng().distanceTo(marker.getLatLng());
			this._circle.setRadius(r);
		}

		this._circle.redraw();
	}
});

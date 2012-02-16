L.Handler.PolyEdit = L.Handler.extend({
	options: {
		icon: new L.DivIcon({
			iconSize: new L.Point(8, 8),
			className: 'leaflet-div-icon leaflet-editing-icon'
		})
	},

	initialize: function (poly, options) {
		this._poly = poly;
		L.Util.setOptions(this, options);
	},

	addHooks: function () {
		if (!this._markers) {
			this._initMarkers();
		}
		this._poly._map.addLayer(this._markers);
	},

	removeHooks: function () {
		this._poly._map.removeLayer(this._markers);
	},

	updateMarkers: function () {
		this._markers.clearLayers();
		this._initMarkers();
	},

	_initMarkers: function () {
		this._markers = new L.LayerGroup();

		var latlngs = this._poly._latlngs,
			i, len;

		// TODO refactor holes implementation in Polygon
		/* var holes = this._poly._holes;
		if (holes) {
			for (i = 0, len = holes.length; i < len; i++) {
				latlngs = latlngs.concat(holes[i]);
			}
		} */

		for (i = 0, len = latlngs.length; i < len; i++) {
			var marker = this._createMarker(latlngs[i], i);
			this._markers.addLayer(marker);
		}
	},

	_createMarker: function (latlng, index) {
		var marker = new L.Marker(latlng, {
			draggable: true,
			icon: this.options.icon
		});

		marker._origLatLng = latlng;
		marker._index = index;

		marker.on('drag', this._onMarkerDrag, this);
		marker.on('click', this._onMarkerClick, this);

		return marker;
	},

	_onMarkerDrag: function (e) {
		var marker = e.target;
		L.Util.extend(marker._origLatLng, marker._latlng);
		this._poly.redraw();
	},

	_onMarkerClick: function (e) {
		var marker = e.target,
			i = marker._index;

		this._markers.removeLayer(marker);
		this._poly.spliceLatLngs(i, 1);
		this._updateIndexes(i);
	},

	_updateIndexes: function (removedIndex) {
		this._markers._iterateLayers(function (marker) {
			if (marker._index > removedIndex) {
				marker._index--;
			}
		});
	}
});

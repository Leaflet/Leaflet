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
		if (this._poly._map) {
			if (!this._markerGroup) {
				this._initMarkers();
			}
			this._poly._map.addLayer(this._markerGroup);
		}
	},

	removeHooks: function () {
		if (this._poly._map) {
			this._poly._map.removeLayer(this._markerGroup);
		}
	},

	updateMarkers: function () {
		this._markerGroup.clearLayers();
		this._initMarkers();
	},

	_initMarkers: function () {
		this._markerGroup = new L.LayerGroup();
		this._markers = [];

		var latlngs = this._poly._latlngs,
			i, j, len, marker;

		// TODO refactor holes implementation in Polygon to support it here

		for (i = 0, len = latlngs.length; i < len; i++) {

			marker = this._createMarker(latlngs[i], i);
			marker.on('click', this._onMarkerClick, this);
			this._markers.push(marker);
		}

		var markerLeft, markerRight;

		for (i = 0, j = len - 1; i < len; j = i++) {
			if (i === 0 && !(L.Polygon && (this._poly instanceof L.Polygon))) {
				continue;
			}

			markerLeft = this._markers[j];
			markerRight = this._markers[i];

			this._createMiddleMarker(markerLeft, markerRight);
			this._updatePrevNext(markerLeft, markerRight);
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

		this._markerGroup.addLayer(marker);

		return marker;
	},

	_onMarkerDrag: function (e) {
		var marker = e.target;

		L.Util.extend(marker._origLatLng, marker._latlng);

		if (marker._middleLeft) {
			marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
		}
		if (marker._middleRight) {
			marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
		}

		this._poly.redraw();
	},

	_onMarkerClick: function (e) {
		var marker = e.target,
			i = marker._index;

		this._createMiddleMarker(marker._prev, marker._next);
		this._updatePrevNext(marker._prev, marker._next);

		this._markerGroup
			.removeLayer(marker._middleLeft)
			.removeLayer(marker._middleRight)
			.removeLayer(marker);

		this._poly.spliceLatLngs(i, 1);
		this._updateIndexes(i, -1);
		this._poly.fire('edit');
	},

	_updateIndexes: function (index, delta) {
		this._markerGroup._iterateLayers(function (marker) {
			if (marker._index > index) {
				marker._index += delta;
			}
		});
	},

	_createMiddleMarker: function (marker1, marker2) {
		var latlng = this._getMiddleLatLng(marker1, marker2),
			marker = this._createMarker(latlng);

		marker.setOpacity(0.6);

		marker1._middleRight = marker2._middleLeft = marker;

		function onDragStart() {
			var i = marker2._index;

			marker._index = i;

			marker
				.off('click', onClick)
				.on('click', this._onMarkerClick, this);

			this._poly.spliceLatLngs(i, 0, latlng);
			this._markers.splice(i, 0, marker);
			this._poly.fire('edit');

			marker.setOpacity(1);

			this._updateIndexes(i, 1);
			marker2._index++;
			this._updatePrevNext(marker1, marker);
			this._updatePrevNext(marker, marker2);
		}

		function onDragEnd() {
			marker.off('dragstart', onDragStart, this);
			marker.off('dragend', onDragEnd, this);

			this._createMiddleMarker(marker1, marker);
			this._createMiddleMarker(marker, marker2);
		}

		function onClick() {
			onDragStart.call(this);
			onDragEnd.call(this);
		}

		marker
			.on('click', onClick, this)
			.on('dragstart', onDragStart, this)
			.on('dragend', onDragEnd, this);

		this._markerGroup.addLayer(marker);
	},

	_updatePrevNext: function (marker1, marker2) {
		marker1._next = marker2;
		marker2._prev = marker1;
	},

	_getMiddleLatLng: function (marker1, marker2) {
		var map = this._poly._map,
			p1 = map.latLngToLayerPoint(marker1.getLatLng()),
			p2 = map.latLngToLayerPoint(marker2.getLatLng());

		return map.layerPointToLatLng(p1._add(p2).divideBy(2));
	}
});

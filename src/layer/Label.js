/*
 * L.Label is used for displaying small texts on the map.
 */

L.Label = L.PopupBase.extend({

	options: {
		pane: 'labelPane',
		offset: [12, -15],
		direction: 'right',
		static: false,  // Reserved word, use "permanent" instead?
		followMouse: false,
		clickable: false,
		opacity: 1,
		// className: '',
		zoomAnimation: true
	},

	onAdd: function (map) {
		L.PopupBase.prototype.onAdd.call(this, map);
		this.setOpacity(this.options.opacity);

		map.fire('labelopen', {popup: this});

		if (this._source) {
			this._source.fire('labelopen', {popup: this}, true);
		}
	},

	onRemove: function (map) {
		L.PopupBase.prototype.onRemove.call(this, map);

		map.fire('labelclose', {popup: this});

		if (this._source) {
			this._source.fire('labelclose', {popup: this}, true);
		}
	},

	openOn: function (map) {
		map.openLabel(this);
		return this;
	},

	_close: function () {
		if (this._map) {
			this._map.closeLabel(this);
		}
	},

	_initLayout: function () {
		var prefix = 'leaflet-label',
		    className = prefix + ' ' + (this.options.className || '') + ' leaflet-zoom-' + (this._zoomAnimated ? 'animated' : 'hide');

		this._contentNode = this._container = L.DomUtil.create('div', className);
	},

	_updateLayout: function () {},

	_adjustPan: function () {},

	_updatePosition: function () {
		var map = this._map,
		    pos = map.latLngToLayerPoint(this._latlng),
		    container = this._container,
		    centerPoint = map.latLngToContainerPoint(map.getCenter()),
		    labelPoint = map.layerPointToContainerPoint(pos),
		    direction = this.options.direction,
		    labelWidth = container.offsetWidth,
		    offset = L.point(this.options.offset);

		// position to the right (right or auto & needs to)
		if (direction === 'right' || direction === 'auto' && labelPoint.x < centerPoint.x) {
			L.DomUtil.addClass(container, 'leaflet-label-right');
			L.DomUtil.removeClass(container, 'leaflet-label-left');

			// if (!this._zoomAnimated) { pos = pos.add(offset); }
			pos = pos.add(offset);
		} else { // position to the left
			L.DomUtil.addClass(container, 'leaflet-label-left');
			L.DomUtil.removeClass(container, 'leaflet-label-right');

			pos = pos.add(L.point(-offset.x - labelWidth, offset.y));
		}

		L.DomUtil.setPosition(container, pos);
	},

	setOpacity: function (opacity) {
		this.options.opacity = opacity;

		if (this._container) {
			L.DomUtil.setOpacity(this._container, opacity);
		}
	},

	_animateZoom: function (e) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, e.zoom, e.center), offset;
		if (this.options.offset) {
			offset = L.point(this.options.offset);
			pos = pos.add(offset);
		}
		L.DomUtil.setPosition(this._container, pos);
	}

});

L.label = function (options, source) {
	return new L.Label(options, source);
};


L.Map.include({
	openLabel: function (label, latlng, options) {
		if (!(label instanceof L.Label)) {
			label = new L.Label(options).setContent(label);
		}

		if (latlng) {
			label.setLatLng(latlng);
		}

		if (this.hasLayer(label)) {
			return this;
		}

		return this.addLayer(label);
	},

	closeLabel: function (label) {
		if (label) {
			this.removeLayer(label);
		}
		return this;
	}
});

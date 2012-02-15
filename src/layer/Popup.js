
L.Popup = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		minWidth: 50,
		maxWidth: 300,
		autoPan: true,
		closeButton: true,
		offset: new L.Point(0, 2),
		autoPanPadding: new L.Point(5, 5),
		className: ''
	},

	initialize: function (options, source) {
		L.Util.setOptions(this, options);

		this._source = source;
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._container) {
			this._initLayout();
		}
		this._updateContent();

		this._container.style.opacity = '0';
		map._panes.popupPane.appendChild(this._container);

		map.on('viewreset', this._updatePosition, this);
		if (map.options.closePopupOnClick) {
			map.on('preclick', this._close, this);
		}

		this._update();

		this._container.style.opacity = '1'; //TODO fix ugly opacity hack
	},

	onRemove: function (map) {
		map._panes.popupPane.removeChild(this._container);

		L.Util.falseFn(this._container.offsetWidth);

		map.off('viewreset', this._updatePosition, this)
		   .off('click', this._close, this);

		this._container.style.opacity = '0';

		this._map = null;
	},

	setLatLng: function (latlng) {
		this._latlng = latlng;
		this._update();
		return this;
	},

	setContent: function (content) {
		this._content = content;
		this._update();
		return this;
	},

	_close: function () {
		// TODO popup should be able to close itself
		if (this._map) {
			this._map.closePopup();
		}
	},

	_initLayout: function () {
		this._container = L.DomUtil.create('div', 'leaflet-popup ' + this.options.className);

		if (this.options.closeButton) {
			this._closeButton = L.DomUtil.create('a', 'leaflet-popup-close-button', this._container);
			this._closeButton.href = '#close';
			L.DomEvent.addListener(this._closeButton, 'click', this._onCloseButtonClick, this);
		}

		this._wrapper = L.DomUtil.create('div', 'leaflet-popup-content-wrapper', this._container);
		L.DomEvent.disableClickPropagation(this._wrapper);
		this._contentNode = L.DomUtil.create('div', 'leaflet-popup-content', this._wrapper);

		this._tipContainer = L.DomUtil.create('div', 'leaflet-popup-tip-container', this._container);
		this._tip = L.DomUtil.create('div', 'leaflet-popup-tip', this._tipContainer);
	},

	_update: function () {
		if (!this._map) {
			return;
		}

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	},

	_updateContent: function () {
		if (!this._content) {
			return;
		}

		if (typeof this._content === 'string') {
			this._contentNode.innerHTML = this._content;
		} else {
			this._contentNode.innerHTML = '';
			this._contentNode.appendChild(this._content);
		}
	},

	_updateLayout: function () {
		var container = this._container;

		container.style.width = '';
		container.style.whiteSpace = 'nowrap';

		var width = container.offsetWidth;
		width = Math.min(width, this.options.maxWidth);
		width = Math.max(width, this.options.minWidth);

		container.style.width = width + 'px';
		container.style.whiteSpace = '';

		this._containerWidth = container.offsetWidth;
	},

	_updatePosition: function () {
		var pos = this._map.latLngToLayerPoint(this._latlng);

		this._containerBottom = -pos.y - this.options.offset.y;
		this._containerLeft = pos.x - Math.round(this._containerWidth / 2) + this.options.offset.x;

		this._container.style.bottom = this._containerBottom + 'px';
		this._container.style.left = this._containerLeft + 'px';
	},

	_adjustPan: function () {
		if (!this.options.autoPan) {
			return;
		}

		var map = this._map,
			containerHeight = this._container.offsetHeight,
			containerWidth = this._containerWidth,

			layerPos = new L.Point(
				this._containerLeft,
				-containerHeight - this._containerBottom),

			containerPos = map.layerPointToContainerPoint(layerPos),
			adjustOffset = new L.Point(0, 0),
			padding      = this.options.autoPanPadding,
			size         = map.getSize();

		if (containerPos.x < 0) {
			adjustOffset.x = containerPos.x - padding.x;
		}
		if (containerPos.x + containerWidth > size.x) {
			adjustOffset.x = containerPos.x + containerWidth - size.x + padding.x;
		}
		if (containerPos.y < 0) {
			adjustOffset.y = containerPos.y - padding.y;
		}
		if (containerPos.y + containerHeight > size.y) {
			adjustOffset.y = containerPos.y + containerHeight - size.y + padding.y;
		}

		if (adjustOffset.x || adjustOffset.y) {
			map.panBy(adjustOffset);
		}
	},

	_onCloseButtonClick: function (e) {
		this._close();
		L.DomEvent.stop(e);
	}
});

/*
 * L.Popup is used for displaying popups on the map.
 */

L.Map.mergeOptions({
	closePopupOnClick: true
});

L.Popup = L.Class.extend({
	includes: L.Mixin.Events,

	options: {
		minWidth: 50,
		maxWidth: 300,
		maxHeight: null,
		autoPan: true,
		closeButton: true,
		offset: new L.Point(0, 6),
		autoPanPadding: new L.Point(5, 5),
		className: '',
		zoomAnimation: true
	},

	initialize: function (options, source) {
		L.setOptions(this, options);

		this._source = source;
		this._animated = L.Browser.any3d && this.options.zoomAnimation;
	},

	onAdd: function (map) {
		this._map = map;

		if (!this._container) {
			this._initLayout();
		}
		this._updateContent();

		var animFade = map.options.fadeAnimation;

		if (animFade) {
			L.DomUtil.setOpacity(this._container, 0);
		}
		map._panes.popupPane.appendChild(this._container);

		map.on('viewreset', this._updatePosition, this);

		if (this._animated) {
			map.on('zoomanim', this._zoomAnimation, this);
		}

		if (map.options.closePopupOnClick) {
			map.on('preclick', this._close, this);
		}

		this._update();

		if (animFade) {
			L.DomUtil.setOpacity(this._container, 1);
		}
	},

	addTo: function (map) {
		map.addLayer(this);
		return this;
	},

	openOn: function (map) {
		map.openPopup(this);
		return this;
	},

	onRemove: function (map) {
		map._panes.popupPane.removeChild(this._container);

		L.Util.falseFn(this._container.offsetWidth); // force reflow

		map.off({
			viewreset: this._updatePosition,
			preclick: this._close,
			zoomanim: this._zoomAnimation
		}, this);

		if (map.options.fadeAnimation) {
			L.DomUtil.setOpacity(this._container, 0);
		}

		this._map = null;
	},

	setLatLng: function (latlng) {
		this._latlng = L.latLng(latlng);
		this._update();
		return this;
	},

	setContent: function (content) {
		this._content = content;
		this._update();
		return this;
	},

	_close: function () {
		var map = this._map;

		if (map) {
			map._popup = null;

			map
			    .removeLayer(this)
			    .fire('popupclose', {popup: this});
		}
	},

	_initLayout: function () {
		var prefix = 'leaflet-popup',
			containerClass = prefix + ' ' + this.options.className + ' leaflet-zoom-' +
			        (this._animated ? 'animated' : 'hide'),
			container = this._container = L.DomUtil.create('div', containerClass),
			closeButton;

		if (this.options.closeButton) {
			closeButton = this._closeButton =
			        L.DomUtil.create('a', prefix + '-close-button', container);
			closeButton.href = '#close';
			closeButton.innerHTML = '&#215;';

			L.DomEvent.on(closeButton, 'click', this._onCloseButtonClick, this);
		}

		var wrapper = this._wrapper =
		        L.DomUtil.create('div', prefix + '-content-wrapper', container);
		L.DomEvent.disableClickPropagation(wrapper);

		this._contentNode = L.DomUtil.create('div', prefix + '-content', wrapper);
		L.DomEvent.on(this._contentNode, 'mousewheel', L.DomEvent.stopPropagation);

		this._tipContainer = L.DomUtil.create('div', prefix + '-tip-container', container);
		this._tip = L.DomUtil.create('div', prefix + '-tip', this._tipContainer);
	},

	_update: function () {
		if (!this._map) { return; }

		this._container.style.visibility = 'hidden';

		this._updateContent();
		this._updateLayout();
		this._updatePosition();

		this._container.style.visibility = '';

		this._adjustPan();
	},

	_updateContent: function () {
		if (!this._content) { return; }

		if (typeof this._content === 'string') {
			this._contentNode.innerHTML = this._content;
		} else {
			while (this._contentNode.hasChildNodes()) {
				this._contentNode.removeChild(this._contentNode.firstChild);
			}
			this._contentNode.appendChild(this._content);
		}
		this.fire('contentupdate');
	},

	_updateLayout: function () {
		var container = this._contentNode,
		    style = container.style;

		style.width = '';
		style.whiteSpace = 'nowrap';

		var width = container.offsetWidth;
		width = Math.min(width, this.options.maxWidth);
		width = Math.max(width, this.options.minWidth);

		style.width = (width + 1) + 'px';
		style.whiteSpace = '';

		style.height = '';

		var height = container.offsetHeight,
		    maxHeight = this.options.maxHeight,
		    scrolledClass = 'leaflet-popup-scrolled';

		if (maxHeight && height > maxHeight) {
			style.height = maxHeight + 'px';
			L.DomUtil.addClass(container, scrolledClass);
		} else {
			L.DomUtil.removeClass(container, scrolledClass);
		}

		this._containerWidth = this._container.offsetWidth;
	},

	_updatePosition: function () {
		if (!this._map) { return; }

		var pos = this._map.latLngToLayerPoint(this._latlng),
		    animated = this._animated,
		    offset = this.options.offset;

		if (animated) {
			L.DomUtil.setPosition(this._container, pos);
		}

		this._containerBottom = -offset.y - (animated ? 0 : pos.y);
		this._containerLeft = -Math.round(this._containerWidth / 2) + offset.x + (animated ? 0 : pos.x);

		//Bottom position the popup in case the height of the popup changes (images loading etc)
		this._container.style.bottom = this._containerBottom + 'px';
		this._container.style.left = this._containerLeft + 'px';
	},

	_zoomAnimation: function (opt) {
		var pos = this._map._latLngToNewLayerPoint(this._latlng, opt.zoom, opt.center);

		L.DomUtil.setPosition(this._container, pos);
	},

	_adjustPan: function () {
		if (!this.options.autoPan) { return; }

		var map = this._map,
		    containerHeight = this._container.offsetHeight,
		    containerWidth = this._containerWidth,

		    layerPos = new L.Point(this._containerLeft, -containerHeight - this._containerBottom);

		if (this._animated) {
			layerPos._add(L.DomUtil.getPosition(this._container));
		}

		var containerPos = map.layerPointToContainerPoint(layerPos),
		    padding = this.options.autoPanPadding,
		    size = map.getSize(),
		    dx = 0,
		    dy = 0;

		if (containerPos.x < 0) {
			dx = containerPos.x - padding.x;
		}
		if (containerPos.x + containerWidth > size.x) {
			dx = containerPos.x + containerWidth - size.x + padding.x;
		}
		if (containerPos.y < 0) {
			dy = containerPos.y - padding.y;
		}
		if (containerPos.y + containerHeight > size.y) {
			dy = containerPos.y + containerHeight - size.y + padding.y;
		}

		if (dx || dy) {
			map.panBy(new L.Point(dx, dy));
		}
	},

	_onCloseButtonClick: function (e) {
		this._close();
		L.DomEvent.stop(e);
	}
});

L.popup = function (options, source) {
	return new L.Popup(options, source);
};

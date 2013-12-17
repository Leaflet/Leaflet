/*
 * Extends L.Path with SVG-specific rendering code.
 */

L.Path.SVG_NS = 'http://www.w3.org/2000/svg';

L.Browser.svg = !!(document.createElementNS && document.createElementNS(L.Path.SVG_NS, 'svg').createSVGRect);

L.Path = L.Path.extend({
	statics: {
		SVG: L.Browser.svg
	},

	bringToFront: function () {
		var root = this._map._pathRoot,
		    path = this._container;

		if (path && root.lastChild !== path) {
			root.appendChild(path);
		}
		return this;
	},

	bringToBack: function () {
		var root = this._map._pathRoot,
		    path = this._container,
		    first = root.firstChild;

		if (path && first !== path) {
			root.insertBefore(path, first);
		}
		return this;
	},

	/*
	getPathString: function () {
		// form path string here
	},
	*/

	_createElement: function (name) {
		return document.createElementNS(L.Path.SVG_NS, name);
	},

	_initElements: function () {
		this._map._initPathRoot();
		this._initPath();
		this._initStyle();
	},

	_initPath: function () {
		this._container = this._createElement('g');
		this._path = this._createElement('path');

		if (this.options.className) {
			L.DomUtil.addClass(this._path, this.options.className);
		}

		this._container.appendChild(this._path);
	},

	_initStyle: function () {
		var path = this._path,
			options = this.options;

		if (options.stroke) {
			path.setAttribute('stroke-linejoin', 'round');
			path.setAttribute('stroke-linecap', 'round');
		}
		if (options.fill) {
			path.setAttribute('fill-rule', 'evenodd');
		}
		if (options.pointerEvents) {
			path.setAttribute('pointer-events', options.pointerEvents);
		}
		if (!options.clickable && !options.pointerEvents) {
			path.setAttribute('pointer-events', 'none');
		}
		this._updateStyle();
	},

	_updateStyle: function () {
		var path = this._path,
			options = this.options;

		if (options.stroke) {
			path.setAttribute('stroke', options.color);
			path.setAttribute('stroke-opacity', options.opacity);
			path.setAttribute('stroke-width', options.weight);

			if (options.dashArray) {
				path.setAttribute('stroke-dasharray', options.dashArray);
			} else {
				path.removeAttribute('stroke-dasharray');
			}

			if (options.lineCap) {
				path.setAttribute('stroke-linecap', options.lineCap);
			}
			if (options.lineJoin) {
				path.setAttribute('stroke-linejoin', options.lineJoin);
			}

		} else {
			path.setAttribute('stroke', 'none');
		}

		if (options.fill) {
			path.setAttribute('fill', options.fillColor || options.color);
			path.setAttribute('fill-opacity', options.fillOpacity);
		} else {
			path.setAttribute('fill', 'none');
		}
	},

	_updatePath: function () {
		this._path.setAttribute('d', this.getPathString() || 'M0 0');
	},

	// TODO remove duplication with L.Map
	_initEvents: function () {
		if (L.Browser.svg || !L.Browser.vml) {
			L.DomUtil.addClass(this._path, 'leaflet-clickable');
		}

		L.DomEvent.on(this._container, 'click', this._onMouseClick, this);

		var events = ['dblclick', 'mousedown', 'mouseover',
		              'mouseout', 'mousemove', 'contextmenu'];

		for (var i = 0; i < events.length; i++) {
			L.DomEvent.on(this._container, events[i], this._fireMouseEvent, this);
		}
	},

	_onMouseClick: function (e) {
		if (this._map.dragging && this._map.dragging.moved()) { return; }

		this._fireMouseEvent(e);
	},

	_fireMouseEvent: function (e) {
		if (!this.hasEventListeners(e.type)) { return; }

		var map = this._map,
		    containerPoint = map.mouseEventToContainerPoint(e),
		    layerPoint = map.containerPointToLayerPoint(containerPoint),
		    latlng = map.layerPointToLatLng(layerPoint);

		this.fire(e.type, {
			latLng: latlng,
			latlng: latlng,
			layerPoint: layerPoint,
			containerPoint: containerPoint,
			originalEvent: e
		});

		if (e.type === 'contextmenu') {
			L.DomEvent.preventDefault(e);
		}
		if (e.type !== 'mousemove') {
			L.DomEvent.stopPropagation(e);
		}
	}
});

L.Map.include({
	_initPathRoot: function () {
		if (!this._pathRoot) {
			var root = this._pathRoot = L.Path.prototype._createElement('svg');
			this._panes.overlayPane.appendChild(root);

			if (this._zoomAnimated) {
				L.DomUtil.addClass(root, 'leaflet-zoom-animated');
				this.on({
					'zoomanim': this._animatePathZoom,
					'zoomend': this._endPathZoom
				});
			}

			this.on('moveend', this._updateSvgViewport);
			this._updateSvgViewport();
		}
	},

	_animatePathZoom: function (e) {
		var scale = this.getZoomScale(e.zoom),
		    offset = this._getCenterOffset(e.center)._multiplyBy(-scale)._add(this._pathViewport.min);

		this._pathRoot.style[L.DomUtil.TRANSFORM] =
		        L.DomUtil.getTranslateString(offset) + ' scale(' + scale + ') ';

		this._pathZooming = true;
	},

	_endPathZoom: function () {
		this._pathZooming = false;
	},

	_updateSvgViewport: function () {

		if (this._pathZooming) {
			// Do not update SVGs while a zoom animation is going on otherwise the animation will break.
			// When the zoom animation ends we will be updated again anyway
			// This fixes the case where you do a momentum move and zoom while the move is still ongoing.
			return;
		}

		this._updatePathViewport();

		var vp = this._pathViewport,
		    size = vp.getSize(),
		    root = this._pathRoot,
		    pane = this._panes.overlayPane;

		// Hack to make flicker on drag end on mobile webkit less irritating
		if (L.Browser.mobileWebkit) {
			pane.removeChild(root);
		}

		L.DomUtil.setPosition(root, vp.min);
		root.setAttribute('width', size.x);
		root.setAttribute('height', size.y);
		root.setAttribute('viewBox', [vp.min.x, vp.min.y, size.x, size.y].join(' '));

		if (L.Browser.mobileWebkit) {
			pane.appendChild(root);
		}
	}
});

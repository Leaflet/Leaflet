
L.SVG = L.Renderer.extend({

	onAdd: function () {
		var container = this._container;

		if (!container) {
			container = this._container = L.SVG.create('svg');
			container.setAttribute('pointer-events', 'none');

			if (this._zoomAnimated) {
				L.DomUtil.addClass(container, 'leaflet-zoom-animated');
			}
		}

		this.getPane().appendChild(container);
		this._update();
	},

	onRemove: function () {
		L.DomUtil.remove(this._container);
	},

	_update: function () {
		if (this._map._animatingZoom) { return; }

		L.Renderer.prototype._update.call(this);

		var b = this._bounds,
		    size = b.getSize(),
		    container = this._container,
		    pane = this.getPane();

		// hack to make flicker on drag end on mobile webkit less irritating
		if (L.Browser.mobileWebkit) {
			pane.removeChild(container);
		}

		L.DomUtil.setPosition(container, b.min);
		container.setAttribute('width', size.x);
		container.setAttribute('height', size.y);
		container.setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));

		if (L.Browser.mobileWebkit) {
			pane.appendChild(container);
		}
	},

	_initPath: function (layer) {
		var path = layer._path = L.SVG.create('path');

		if (layer.options.className) {
			L.DomUtil.addClass(path, layer.options.className);
		}

		if (layer.options.clickable) {
			this._initEvents(layer, path);
		}

		this._updateStyle(layer);
	},

	_addPath: function (layer) {
		this._container.appendChild(layer._path);
	},

	_removePath: function (layer) {
		L.DomUtil.remove(layer._path);
	},

	_updateStyle: function (layer) {
		var path = layer._path,
			options = layer.options;

		if (!path) { return; }

		if (options.stroke) {
			path.setAttribute('stroke', options.color);
			path.setAttribute('stroke-opacity', options.opacity);
			path.setAttribute('stroke-width', options.weight);
			path.setAttribute('stroke-linecap', options.lineCap);
			path.setAttribute('stroke-linejoin', options.lineJoin);

			if (options.dashArray) {
				path.setAttribute('stroke-dasharray', options.dashArray);
			} else {
				path.removeAttribute('stroke-dasharray');
			}

		} else {
			path.setAttribute('stroke', 'none');
		}

		if (options.fill) {
			path.setAttribute('fill', options.fillColor || options.color);
			path.setAttribute('fill-opacity', options.fillOpacity);
			path.setAttribute('fill-rule', 'evenodd');
		} else {
			path.setAttribute('fill', 'none');
		}

		path.setAttribute('pointer-events', options.pointerEvents || (options.clickable ? 'auto' : 'none'));
	},

	_updatePoly: function (layer, closed) {
		layer._path.setAttribute('d', L.SVG.pointsToPath(layer._parts, closed));
	},

	_updateCircle: function (layer) {
		var p = layer._point,
		    r = layer._radius,
		    arc = 'a' + r + ',' + r + ' 0 1,0 ';

		var d = layer._empty() ? 'M0 0' :
				'M' + (p.x - r) + ',' + p.y +
				arc +  (r * 2) + ',0 ' +
				arc + (-r * 2) + ',0 ';

		layer._path.setAttribute('d', d);
	},

	_bringToFront: function (layer) {
		this._addPath(layer);
	},

	_bringToBack: function (layer) {
		this._container.insertBefore(layer._path, this._container.firstChild);
	},

	// TODO remove duplication with L.Map
	_initEvents: function (layer, el) {
		L.DomUtil.addClass(el, 'leaflet-clickable');

		L.DomEvent.on(el, 'click', layer._onMouseClick, layer);

		var events = ['dblclick', 'mousedown', 'mouseover', 'mouseout', 'mousemove', 'contextmenu'];
		for (var i = 0; i < events.length; i++) {
			L.DomEvent.on(el, events[i], layer._fireMouseEvent, layer);
		}
	}
});


L.extend(L.SVG, {
	create: function (name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	},

	pointsToPath: function (rings, closed) {
		var str = '',
			i, j, len, len2, points, p;

		for (i = 0, len = rings.length; i < len; i++) {
			points = rings[i];

			for (j = 0, len2 = points.length; j < len2; j++) {
				p = points[j];
				str += (j ? 'L' : 'M') + Math.round(p.x) + ' ' + Math.round(p.y);
			}

			str += closed ? (L.Browser.svg ? 'z' : 'x') : '';
		}

		return str || 'M0 0';
	}
});

L.Browser.svg = !!(document.createElementNS && L.SVG.create('svg').createSVGRect);

L.svg = function () {
	return L.Browser.svg || L.Browser.vml ? new L.SVG() : null;
};

L.SVG.instance = L.svg();

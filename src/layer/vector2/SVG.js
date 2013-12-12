
L.SVG = L.Renderer.extend({

	onAdd: function (map) {
		var container = this._container = L.SVG.create('svg');

		if (this._zoomAnimated) {
			L.DomUtil.addClass(container, 'leaflet-zoom-animated');
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

		this._container.appendChild(path);
	},

	_updateStyle: function (layer) {
		var path = layer._path,
			options = layer.options;

		if (options.stroke) {
			path.setAttribute('stroke', options.color);
			path.setAttribute('stroke-opacity', options.opacity);
			path.setAttribute('stroke-width', options.width || options.weight);
			path.setAttribute('stroke-linecap', options.lineCap || 'round');
			path.setAttribute('stroke-linejoin', options.lineJoin || 'round');

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

		if (options.pointerEvents) {
			path.setAttribute('pointer-events', options.pointerEvents);
		} else if (!options.clickable) {
			path.setAttribute('pointer-events', 'none');
		}
	},

	_updatePoly: function (layer, closed) {
		layer._path.setAttribute('d', L.SVG.pointsToPath(layer._points, closed) || 'M0 0');
	}
});


L.extend(L.SVG, {
	create: function (name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	},

	pointsToPath: function (points, closed) {
		var flat = points[0] instanceof L.Point,
		    str = '';

		for (var i = 0, len = points.length, p; i < len; i++) {
			p = points[i];
			str += flat ? (i ? 'L' : 'M') + p.x + ' ' + p.y : L.SVG.pointsToPath(p, closed);
		}

		if (closed) {
			str += L.Browser.svg ? 'z' : 'x';
		}

		return str;
	}
});

L.Browser.svg = !!(document.createElementNS && L.SVG.create('svg').createSVGRect);

/*
 * L.SVG renders vector layers with SVG. All SVG-specific code goes here.
 */

L.SVG = L.Renderer.extend({

	_initContainer: function () {
		this._container = L.SVG.create('svg');

		// makes it possible to click through svg root; we'll reset it back in individual paths
		Polymer.dom(this._container).setAttribute('pointer-events', 'none');

		this._rootGroup = L.SVG.create('g');
		Polymer.dom(this._container).appendChild(this._rootGroup);
	},

	_update: function () {
		if (this._map._animatingZoom && this._bounds) { return; }

		L.Renderer.prototype._update.call(this);

		var b = this._bounds,
		    size = b.getSize(),
		    container = this._container;

		// set size of svg-container if changed
		if (!this._svgSize || !this._svgSize.equals(size)) {
			this._svgSize = size;
			Polymer.dom(container).setAttribute('width', size.x);
			Polymer.dom(container).setAttribute('height', size.y);
		}

		// movement: update container viewBox so that we don't have to change coordinates of individual layers
		L.DomUtil.setPosition(container, b.min);
		Polymer.dom(container).setAttribute('viewBox', [b.min.x, b.min.y, size.x, size.y].join(' '));
	},

	// methods below are called by vector layers implementations

	_initPath: function (layer) {
		var path = layer._path = L.SVG.create('path');

		if (layer.options.className) {
			L.DomUtil.addClass(path, layer.options.className);
		}

		if (layer.options.interactive) {
			L.DomUtil.addClass(path, 'leaflet-interactive');
		}

		this._updateStyle(layer);
	},

	_addPath: function (layer) {
		Polymer.dom(this._rootGroup).appendChild(layer._path);
		layer.addInteractiveTarget(layer._path);
	},

	_removePath: function (layer) {
		L.DomUtil.remove(layer._path);
		layer.removeInteractiveTarget(layer._path);
	},

	_updatePath: function (layer) {
		layer._project();
		layer._update();
	},

	_updateStyle: function (layer) {
		var path = layer._path,
			options = layer.options;

		if (!path) { return; }

		if (options.stroke) {
			Polymer.dom(path).setAttribute('stroke', options.color);
			Polymer.dom(path).setAttribute('stroke-opacity', options.opacity);
			Polymer.dom(path).setAttribute('stroke-width', options.weight);
			Polymer.dom(path).setAttribute('stroke-linecap', options.lineCap);
			Polymer.dom(path).setAttribute('stroke-linejoin', options.lineJoin);

			if (options.dashArray) {
				Polymer.dom(path).setAttribute('stroke-dasharray', options.dashArray);
			} else {
				Polymer.dom(path).removeAttribute('stroke-dasharray');
			}

			if (options.dashOffset) {
				Polymer.dom(path).setAttribute('stroke-dashoffset', options.dashOffset);
			} else {
				Polymer.dom(path).removeAttribute('stroke-dashoffset');
			}
		} else {
			Polymer.dom(path).setAttribute('stroke', 'none');
		}

		if (options.fill) {
			Polymer.dom(path).setAttribute('fill', options.fillColor || options.color);
			Polymer.dom(path).setAttribute('fill-opacity', options.fillOpacity);
			Polymer.dom(path).setAttribute('fill-rule', options.fillRule || 'evenodd');
		} else {
			Polymer.dom(path).setAttribute('fill', 'none');
		}

		Polymer.dom(path).setAttribute('pointer-events', options.pointerEvents || (options.interactive ? 'visiblePainted' : 'none'));
	},

	_updatePoly: function (layer, closed) {
		this._setPath(layer, L.SVG.pointsToPath(layer._parts, closed));
	},

	_updateCircle: function (layer) {
		var p = layer._point,
		    r = layer._radius,
		    r2 = layer._radiusY || r,
		    arc = 'a' + r + ',' + r2 + ' 0 1,0 ';

		// drawing a circle with two half-arcs
		var d = layer._empty() ? 'M0 0' :
				'M' + (p.x - r) + ',' + p.y +
				arc + (r * 2) + ',0 ' +
				arc + (-r * 2) + ',0 ';

		this._setPath(layer, d);
	},

	_setPath: function (layer, path) {
		Polymer.dom(layer._path).setAttribute('d', path);
	},

	// SVG does not have the concept of zIndex so we resort to changing the DOM order of elements
	_bringToFront: function (layer) {
		L.DomUtil.toFront(layer._path);
	},

	_bringToBack: function (layer) {
		L.DomUtil.toBack(layer._path);
	}
});


L.extend(L.SVG, {
	create: function (name) {
		return document.createElementNS('http://www.w3.org/2000/svg', name);
	},

	// generates SVG path string for multiple rings, with each ring turning into "M..L..L.." instructions
	pointsToPath: function (rings, closed) {
		var str = '',
			i, j, len, len2, points, p;

		for (i = 0, len = rings.length; i < len; i++) {
			points = rings[i];

			for (j = 0, len2 = points.length; j < len2; j++) {
				p = points[j];
				str += (j ? 'L' : 'M') + p.x + ' ' + p.y;
			}

			// closes the ring for polygons; "x" is VML syntax
			str += closed ? (L.Browser.svg ? 'z' : 'x') : '';
		}

		// SVG complains about empty path strings
		return str || 'M0 0';
	}
});

L.Browser.svg = !!(document.createElementNS && L.SVG.create('svg').createSVGRect);

L.svg = function (options) {
	return L.Browser.svg || L.Browser.vml ? new L.SVG(options) : null;
};

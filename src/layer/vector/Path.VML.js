/*
 * Vector rendering for IE6-8 through VML.
 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
 */

L.Browser.vml = (function () {
	var div = document.createElement('div');
	div.innerHTML = '<v:shape adj="1"/>';

	var shape = div.firstChild;
	shape.style.behavior = 'url(#default#VML)';

	return shape && (typeof shape.adj === 'object');
}());

L.Path = L.Browser.svg || !L.Browser.vml ? L.Path : L.Path.extend({
	statics: {
		VML: true,
		CLIP_PADDING: 0.02
	},

	_createElement: (function () {
		try {
			document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
			return function (name) {
				return document.createElement('<lvml:' + name + ' class="lvml">');
			};
		} catch (e) {
			return function (name) {
				return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
			};
		}
	}()),

	_initPath: function () {
		var container = this._container = this._createElement('shape');
		container.className += ' leaflet-vml-shape' +
				(this.options.clickable ? ' leaflet-clickable' : '');
		container.coordsize = '1 1';

		this._path = this._createElement('path');
		container.appendChild(this._path);

		this._map._pathRoot.appendChild(container);
	},

	_initStyle: function () {
		var container = this._container,
			stroke,
			fill;

		if (this.options.stroke) {
			stroke = this._stroke = this._createElement('stroke');
			stroke.endcap = 'round';
			container.appendChild(stroke);
		}

		if (this.options.fill) {
			fill = this._fill = this._createElement('fill');
			container.appendChild(fill);
		}

		this._updateStyle();
	},

	_updateStyle: function () {
		var stroke = this._stroke,
			fill = this._fill,
			options = this.options,
			container = this._container;

		container.stroked = options.stroke;
		container.filled = options.fill;

		if (options.stroke) {
			stroke.weight  = options.weight + 'px';
			stroke.color   = options.color;
			stroke.opacity = options.opacity;
		}

		if (options.fill) {
			fill.color   = options.fillColor || options.color;
			fill.opacity = options.fillOpacity;
		}
	},

	_updatePath: function () {
		var style = this._container.style;

		style.display = 'none';
		this._path.v = this.getPathString() + ' '; // the space fixes IE empty path string bug
		style.display = '';
	}
});

L.Map.include(L.Browser.svg || !L.Browser.vml ? {} : {
	_initPathRoot: function () {
		if (this._pathRoot) { return; }

		var root = this._pathRoot = document.createElement('div');
		root.className = 'leaflet-vml-container';
		this._panes.overlayPane.appendChild(root);

		this.on('moveend', this._updatePathViewport);
		this._updatePathViewport();
	}
});

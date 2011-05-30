/*
 * Vector rendering for IE6-8 through VML. 
 * Thanks to Dmitry Baranovsky and his Raphael library for inspiration!
 */

L.Path.VML = (function() {
	var d = document.createElement('div'), s;
	d.innerHTML = '<v:shape adj="1"/>';
	s = d.firstChild;
	s.style.behavior = 'url(#default#VML)';
	
	return (s && (typeof s.adj == 'object'));
})();

L.Path = L.Path.SVG || !L.Path.VML ? L.Path : L.Path.extend({
	statics: {
		CLIP_PADDING: 0.02
	},
	
	_createElement: (function() { 
		try {
			document.namespaces.add('lvml', 'urn:schemas-microsoft-com:vml');
			return function(name) {
				return document.createElement('<lvml:' + name + ' class="lvml">');
			};
		} catch (e) {
			return function(name) {
				return document.createElement('<' + name + ' xmlns="urn:schemas-microsoft.com:vml" class="lvml">');
			};
		}
	})(),
	
	_initRoot: function() {
		if (!this._map._pathRoot) {
			this._map._pathRoot = document.createElement('div');
			this._map._pathRoot.className = 'leaflet-vml-container';
			this._map._panes.overlayPane.appendChild(this._map._pathRoot);

			this._map.on('moveend', this._updateViewport, this);
			this._updateViewport();
		}
	},
	
	_initPath: function() {
		this._container = this._createElement('shape');
		this._container.className += ' leaflet-vml-shape' + 
				(this.options.clickable ? ' leaflet-clickable' : '');
		this._container.coordsize = '1 1';
		
		this._path = this._createElement('path');
		this._container.appendChild(this._path);
		
		this._map._pathRoot.appendChild(this._container);
	},
	
	_initStyle: function() {
		if (this.options.stroke) {
			this._stroke = this._createElement('stroke');
			this._stroke.endcap = 'round';
			this._container.appendChild(this._stroke);
		} else {
			this._container.stroked = false;
		}
		if (this.options.fill) {
			this._container.filled = true;
			this._fill = this._createElement('fill');
			this._container.appendChild(this._fill);
		} else {
			this._container.filled = false;
		}
		this._updateStyle();
	},
	
	_updateStyle: function() {
		if (this.options.stroke) {
			this._stroke.weight = this.options.weight + 'px';
			this._stroke.color = this.options.color;
			this._stroke.opacity = this.options.opacity;
		}
		if (this.options.fill) {
			this._fill.color = this.options.fillColor || this.options.color;
			this._fill.opacity = this.options.fillOpacity;
		}
	},
	
	_updatePath: function() {
		this._container.style.display = 'none';
		this._path.v = this.getPathString() + ' '; // the space fixes IE empty path string bug
		this._container.style.display = '';
	}
});
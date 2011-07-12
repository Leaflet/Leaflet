
L.Control.Layers = L.Class.extend({
	options: {
		collapsed: true
	},
	
	initialize: function(options) {
		L.Util.setOptions(this, options);
		
		this._layers = {};
	},
	
	onAdd: function(map) {
		this._map = map;
		
		this._initLayout();
		this._update();
	},

	getContainer: function() {
		return this._container; 
	},

	getPosition: function() {
		return L.Control.Position.TOP_RIGHT;
	},
	
	addBaseLayer: function(layer, name) {
		this._addLayer(layer, name);
		this._update();
	},
	
	addOverlay: function(layer, name) {
		this._addLayer(layer, name, true);
		this._update();
	},
	
	removeLayer: function(layer) {
		var id = L.Util.stamp(layer);
		delete this._layers[id];
		this._update();
	},
	
	_initLayout: function() {
		this._container = L.DomUtil.create('div', 'leaflet-control-layers');
		L.DomEvent.disableClickPropagation(this._container);
		
		if (this.options.collapsed) {
			L.DomEvent.addListener(this._container, 'mouseover', this._expand, this);
			L.DomEvent.addListener(this._container, 'mouseout', this._collapse, this);

			var link = this._layersLink = L.DomUtil.create('a', 'leaflet-control-layers-toggle');
			link.href = '#';
			link.title = 'Layers';
		
			this._container.appendChild(link);
		} else {
			this._expand();
		}			

		this._form = L.DomUtil.create('form', 'leaflet-control-layers-list');

		this._baseLayersList = L.DomUtil.create('div', 'leaflet-control-layers-base', this._form);
		this._separator = L.DomUtil.create('div', 'leaflet-control-layers-separator', this._form);
		this._overlaysList = L.DomUtil.create('div', 'leaflet-control-layers-overlays', this._form);

		this._container.appendChild(this._form);
	},
	
	_addLayer: function(layer, name, overlay) {
		var id = L.Util.stamp(layer);
		this._layers[id] = {
			layer: layer, 
			name: name,
			overlay: overlay
		};
	},
	
	_update: function() {
		if (!this._container) { return; }
		
		this._baseLayersList.innerHTML = '';
		this._overlaysList.innerHTML = '';

		var baseLayersPresent = false,
			overlaysPresent = false;
		
		for (var i in this._layers) {
			if (this._layers.hasOwnProperty(i)) {
				var obj = this._layers[i];
				this._addItem(obj);
				overlaysPresent = overlaysPresent || obj.overlay;
				baseLayersPresent = baseLayersPresent || !obj.overlay;
			}
		}
		
		this._separator.style.display = (overlaysPresent && baseLayersPresent ? '' : 'none');
	},
	
	_addItem: function(obj, onclick) {
		var label = document.createElement('label');
		
		var input = document.createElement('input');
		if (!obj.overlay) {
			input.name = 'leaflet-base-layers';
		}
		input.type = obj.overlay ? 'checkbox' : 'radio';
		input.checked = this._map.hasLayer(obj.layer);
		input.layerId = L.Util.stamp(obj.layer);
		
		L.DomEvent.addListener(input, 'click', this._onInputClick, this);
		
		var name = document.createTextNode(' ' + obj.name);
		
		label.appendChild(input);
		label.appendChild(name);
		
		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);
	},
	
	_onInputClick: function() {
		var i, input, obj,
			inputs = this._form.getElementsByTagName('input'),
			inputsLen = inputs.length;
		
		for (i = 0; i < inputsLen; i++) {
			input = inputs[i];
			obj = this._layers[input.layerId];
			
			if (input.checked) {
				this._map.addLayer(obj.layer, !obj.overlay);
			} else {
				this._map.removeLayer(obj.layer);
			}
		}
	},
	
	_expand: function() {
		L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
	},
	
	_collapse: function() {
		this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
	}
});
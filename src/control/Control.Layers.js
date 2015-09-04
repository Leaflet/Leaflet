/*
 * L.Control.Layers is a control to allow users to switch between different layers on the map.
 */

L.Control.Layers = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright',
		autoZIndex: true,
		hideSingleBase: false
	},

	initialize: function (baseLayers, overlays, options) {
		L.setOptions(this, options);

		this._layers = {};
		this._lastZIndex = 0;
		this._handlingClick = false;

		for (var i in baseLayers) {
			this._addLayer(baseLayers[i], i);
		}

		for (i in overlays) {
			this._addLayer(overlays[i], i, true);
		}
	},

	onAdd: function () {
		this._initLayout();
		this._update();

		return this._container;
	},

	addBaseLayer: function (layer, name) {
		this._addLayer(layer, name);
		return this._update();
	},

	addOverlay: function (layer, name) {
		this._addLayer(layer, name, true);
		return this._update();
	},

	removeLayer: function (layer) {
		layer.off('add remove', this._onLayerChange, this);

		delete this._layers[L.stamp(layer)];
		return this._update();
	},

	_initLayout: function () {
		var className = 'leaflet-control-layers',
		    container = this._container = L.DomUtil.create('div', className);

		// makes this work on IE touch devices by stopping it from firing a mouseout event when the touch is released
		container.setAttribute('aria-haspopup', true);

		if (!L.Browser.touch) {
			L.DomEvent
				.disableClickPropagation(container)
				.disableScrollPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', className + '-list');

		if (this.options.collapsed) {
			if (!L.Browser.android) {
				L.DomEvent.on(container, {
					mouseenter: this._expand,
					mouseleave: this._collapse
				}, this);
			}

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Layers';

			if (L.Browser.touch) {
				L.DomEvent
				    .on(link, 'click', L.DomEvent.stop)
				    .on(link, 'click', this._expand, this);
			} else {
				L.DomEvent.on(link, 'focus', this._expand, this);
			}

			// work around for Firefox Android issue https://github.com/Leaflet/Leaflet/issues/2033
			L.DomEvent.on(form, 'click', function () {
				setTimeout(L.bind(this._onInputClick, this), 0);
			}, this);

			this._map.on('click', this._collapse, this);
			// TODO keyboard accessibility
		} else {
			this._expand();
		}

		this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
		this._separator = L.DomUtil.create('div', className + '-separator', form);
		this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);

		container.appendChild(form);
	},

	_addLayer: function (layer, name, overlay) {
		layer.on('add remove', this._onLayerChange, this);

		var id = L.stamp(layer);

		this._layers[id] = {
			layer: layer,
			name: name,
			overlay: overlay
		};

		if (this.options.autoZIndex && layer.setZIndex) {
			this._lastZIndex++;
			layer.setZIndex(this._lastZIndex);
		}
	},

	_update: function () {
		if (!this._container) { return this; }

		L.DomUtil.empty(this._baseLayersList);
		L.DomUtil.empty(this._overlaysList);

		var baseLayersPresent, overlaysPresent, i, obj, baseLayersCount = 0;

		for (i in this._layers) {
			obj = this._layers[i];
			this._addItem(obj);
			overlaysPresent = overlaysPresent || obj.overlay;
			baseLayersPresent = baseLayersPresent || !obj.overlay;
			baseLayersCount += !obj.overlay ? 1 : 0;
		}

		// Hide base layers section if there's only one layer.
		if (this.options.hideSingleBase) {
			baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
			this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
		}

		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

		return this;
	},

	_onLayerChange: function (e) {
		if (!this._handlingClick) {
			this._update();
		}

		var obj = this._layers[L.stamp(e.target)];

		var type = obj.overlay ?
			(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
			(e.type === 'add' ? 'baselayerchange' : null);

		if (type) {
			this._map.fire(type, obj);
		}
	},

	// IE7 bugs out if you create a radio dynamically, so you have to do it this hacky way (see http://bit.ly/PqYLBe)
	_createRadioElement: function (name, checked) {

		var radioHtml = '<input type="radio" class="leaflet-control-layers-selector" name="' +
				name + '"' + (checked ? ' checked="checked"' : '') + '/>';

		var radioFragment = document.createElement('div');
		radioFragment.innerHTML = radioHtml;

		return radioFragment.firstChild;
	},

	_addItem: function (obj) {
		var label = document.createElement('label'),
		    checked = this._map.hasLayer(obj.layer),
		    input;

		if (obj.overlay) {
			input = document.createElement('input');
			input.type = 'checkbox';
			input.className = 'leaflet-control-layers-selector';
			input.defaultChecked = checked;
		} else {
			input = this._createRadioElement('leaflet-base-layers', checked);
		}

		input.layerId = L.stamp(obj.layer);

		L.DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createElement('span');
		name.innerHTML = ' ' + obj.name;

		// Helps from preventing layer control flicker when checkboxes are disabled
		// https://github.com/Leaflet/Leaflet/issues/2771
		var holder = document.createElement('div');

		label.appendChild(holder);
		holder.appendChild(input);
		holder.appendChild(name);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);

		return label;
	},

	_onInputClick: function () {
		var inputs = this._form.getElementsByTagName('input'),
		    input, layer, hasLayer;
		var addedLayers = [],
		    removedLayers = [];

		this._handlingClick = true;

		for (var i = inputs.length - 1; i >= 0; i--) {
			input = inputs[i];
			layer = this._layers[input.layerId].layer;
			hasLayer = this._map.hasLayer(layer);

			if (input.checked && !hasLayer) {
				addedLayers.push(layer);

			} else if (!input.checked && hasLayer) {
				removedLayers.push(layer);
			}
		}

		// Bugfix issue 2318: Should remove all old layers before readding new ones
		for (i = 0; i < removedLayers.length; i++) {
			this._map.removeLayer(removedLayers[i]);
		}
		for (i = 0; i < addedLayers.length; i++) {
			this._map.addLayer(addedLayers[i]);
		}

		this._handlingClick = false;

		this._refocusOnMap();
	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
		var acceptableHeight = this._map._size.y - (this._container.offsetTop * 4);
		if (acceptableHeight < this._form.clientHeight) {
			L.DomUtil.addClass(this._form, 'leaflet-control-layers-scrollbar');
			this._form.style.height = acceptableHeight + 'px';
		}
	},

	_collapse: function () {
		L.DomUtil.removeClass(this._container, 'leaflet-control-layers-expanded');
	}
});

L.control.layers = function (baseLayers, overlays, options) {
	return new L.Control.Layers(baseLayers, overlays, options);
};

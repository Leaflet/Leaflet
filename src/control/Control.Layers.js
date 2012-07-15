
L.Control.Layers = L.Control.extend({
	options: {
		collapsed: true,
		position: 'topright'
	},

	initialize: function (baseLayers, overlays, overlayGroups, options) {
		L.Util.setOptions(this, options);

		this._layers = {};
        this._overlayGroups = {};

		for (var i in baseLayers) {
			if (baseLayers.hasOwnProperty(i)) {
				this._addLayer(baseLayers[i], i);
			}
		}

		for (i in overlays) {
            if (overlays.hasOwnProperty(i)) {
				this._addLayer(overlays[i], i, true);
			}
		}
        
        var group = 0;
        for (i in overlayGroups) {
            this._addLayerGroup(group);
            for (var j in overlayGroups[i]) {
                this._addLayerToGroup(overlayGroups[i][j], j, group);
           	}
           	group++;
        }
	},

	onAdd: function (map) {
		this._initLayout();
		this._update();

		return this._container;
	},

	addBaseLayer: function (layer, name) {
		this._addLayer(layer, name);
		this._update();
		return this;
	},

	addOverlay: function (layer, name) {
		this._addLayer(layer, name, true);
		this._update();
		return this;
	},

	removeLayer: function (layer) {
		var id = L.Util.stamp(layer);
		delete this._layers[id];
		this._update();
		return this;
	},

	addOverlayGroup: function (overlayGroup) {
		var newGroupNum = Object.keys(this._overlayGroups).length;
		this._addLayerGroup(newGroupNum);
		for (layer in overlayGroup) {
			this._addLayerToGroup(overlayGroup[layer], layer, newGroupNum);
		}
		this._update();
	},
	
	removeOverlayGroup: function (overlayGroup) {
		var layersInRemoveGroup = Object.keys(overlayGroup).length;
		for (group in this._overlayGroups) {
			if (layersInRemoveGroup == Object.keys(this._overlayGroups[group]).length) {
				var groupFound = true;
				for (rLayer in overlayGroup) {
					var layerFound = false;
					for (pLayer in this._overlayGroups[group]) {
						if (overlayGroup[rLayer] == this._overlayGroups[group][pLayer].layer) {
							layerFound = true;
						}	
					}
					!layerFound || !groupFound ? groupFound = false : null
				}
				groupFound ? delete this._overlayGroups[group] : null
			}
		}
		this._update();
	},

    _initLayout: function () {
		var className = 'leaflet-control-layers',
        container = this._container = L.DomUtil.create('div', className);

		if (!L.Browser.touch) {
			L.DomEvent.disableClickPropagation(container);
		} else {
			L.DomEvent.on(container, 'click', L.DomEvent.stopPropagation);
		}

		var form = this._form = L.DomUtil.create('form', className + '-list');

		if (this.options.collapsed) {
			L.DomEvent
				.on(container, 'mouseover', this._expand, this)
				.on(container, 'mouseout', this._collapse, this);

			var link = this._layersLink = L.DomUtil.create('a', className + '-toggle', container);
			link.href = '#';
			link.title = 'Layers';

			if (L.Browser.touch) {
				L.DomEvent
					.on(link, 'click', L.DomEvent.stopPropagation)
					.on(link, 'click', L.DomEvent.preventDefault)
					.on(link, 'click', this._expand, this);
			}
			else {
				L.DomEvent.on(link, 'focus', this._expand, this);
			}

			this._map.on('movestart', this._collapse, this);
			// TODO keyboard accessibility
		} else {
			this._expand();
		}

		this._baseLayersList = L.DomUtil.create('div', className + '-base', form);
		this._separator = L.DomUtil.create('div', className + '-separator', form);
		this._overlaysList = L.DomUtil.create('div', className + '-overlays', form);
        this._overlayGroupsList = L.DomUtil.create('div', className + '-overlaygroups', this._form);

		container.appendChild(form);
	},

	_addLayer: function (layer, name, overlay) {
		var id = L.Util.stamp(layer);
		this._layers[id] = {
			layer: layer,
			name: name,
			overlay: overlay
		};
	},
    
    _addLayerGroup: function (group) {
       	this._overlayGroups[group] = [];
    },
    
    _addLayerToGroup: function (layer, name, group) {
       	var id = L.Util.stamp(layer);
       	this._overlayGroups[group][id] = {
       		layer: layer,
      		name: name,
       		group: group
       	};
    },

	_update: function () {
		if (!this._container) {
			return;
		}

		this._baseLayersList.innerHTML = '';
		this._overlaysList.innerHTML = '';
        this._overlayGroupsList.innerHTML = '';

		var baseLayersPresent = false,
			overlaysPresent = false,
            overlayGroupsPresent = false;

		for (var i in this._layers) {
			if (this._layers.hasOwnProperty(i)) {
				var obj = this._layers[i];
				this._addItem(obj);
				overlaysPresent = overlaysPresent || obj.overlay;
				baseLayersPresent = baseLayersPresent || !obj.overlay;
			}
		}
        
		this._separator.style.display = (overlaysPresent && baseLayersPresent ? '' : 'none');
        
        this._overlayGroups ? overlayGroupsPresent = true : overlayGroupsPresent = false;
        if( overlayGroupsPresent ) {
  	 		for (i in this._overlayGroups) {
        		this._addGroup(this._overlayGroups[i]);
            }
        }
        
	},

	_addItem: function (obj, onclick) {
		var label = document.createElement('label');

		var input = document.createElement('input');
		if (!obj.overlay) {
			input.name = 'leaflet-base-layers';
		}
		input.type = obj.overlay ? 'checkbox' : 'radio';
		input.layerId = L.Util.stamp(obj.layer);
		input.defaultChecked = this._map.hasLayer(obj.layer);

		L.DomEvent.on(input, 'click', this._onInputClick, this);

		var name = document.createTextNode(' ' + obj.name);

		label.appendChild(input);
		label.appendChild(name);

		var container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);
	},
    
    _addGroup: function (group, onclick) {
       
      	var separator = L.DomUtil.create('div', 'leaflet-control-layers-group-separator', this._form);
       
       	var container = this._overlayGroupsList;
		container.appendChild(separator);
        
        for (var i in group) {
            this._addGroupItem(group[i],onclick);
        }

	},
    
    _addGroupItem: function (obj, onclick) {
        
		var label = document.createElement('label');

		var input = document.createElement('input');
		
		input.name = 'leaflet-overlay-group-'+obj.group;
		
		input.type = 'radio';
		input.checked = this._map.hasLayer(obj.layer);
		input.layerId = L.Util.stamp(obj.layer);

		L.DomEvent.addListener(input, 'click', this._onInputClick, this);

		var name = document.createTextNode(' ' + obj.name);

		label.appendChild(input);
		label.appendChild(name);

        var container = this._overlayGroupsList;
		container.appendChild(label);
	},

    _onInputClick: function () {
		var i, input, obj;
			
		var baseLayers = this._form.getElementsByClassName('leaflet-control-layers-base')[0].getElementsByTagName('input');
		var overlays = this._form.getElementsByClassName('leaflet-control-layers-overlays')[0].getElementsByTagName('input');
		var overlayGroups = this._form.getElementsByClassName('leaflet-control-layers-overlaygroups');
			
		for (i = 0; i < baseLayers.length; i++) {
			input = baseLayers[i];
			obj = this._layers[input.layerId];

			if (input.checked) {
				this._map.addLayer(obj.layer, !obj.overlay);
			} else {
				this._map.removeLayer(obj.layer);
			}
		}
			
		var groupNum = 0;
		for (group in this._overlayGroups) {
			var layerNum = 0;
			var overlayGroup = overlayGroups[groupNum].getElementsByTagName('input');
            for (layer in this._overlayGroups[group]) {          
               	input = overlayGroup[layerNum];
               	obj = this._overlayGroups[group][layer];

                if (input.checked) {
                    this._map.removeLayer(obj.layer);
                    this._map.addLayer(obj.layer, obj.overlay);
                } else {
                   	this._map.removeLayer(obj.layer);
                }
                layerNum++;
            }
            groupNum++;
        }
		
        for (i = 0; i < overlays.length; i++) {
            input = overlays[i];
            obj = this._layers[input.layerId];

            if (input.checked) {
                this._map.removeLayer(obj.layer);
                this._map.addLayer(obj.layer, obj.overlay);
            } else {
                this._map.removeLayer(obj.layer);
            }
        }
        
	},

	_expand: function () {
		L.DomUtil.addClass(this._container, 'leaflet-control-layers-expanded');
	},

	_collapse: function () {
		this._container.className = this._container.className.replace(' leaflet-control-layers-expanded', '');
	}
});

L.control.layers = function (options) {
	return new L.Control.Layers(options);
};

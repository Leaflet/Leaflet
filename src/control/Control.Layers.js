
import {Control} from './Control.js';
import * as Util from '../core/Util.js';
import * as DomEvent from '../dom/DomEvent.js';
import * as DomUtil from '../dom/DomUtil.js';

/*
 * @class Control.Layers
 * @inherits Control
 *
 * The layers control gives users the ability to switch between different base layers and switch overlays on/off (check out the [detailed example](https://leafletjs.com/examples/layers-control/)). Extends `Control`.
 *
 * @example
 *
 * ```js
 * const baseLayers = {
 * 	"Mapbox": mapbox,
 * 	"OpenStreetMap": osm
 * };
 *
 * const overlays = {
 * 	"Marker": marker,
 * 	"Roads": roadsLayer
 * };
 *
 * new Control.Layers(baseLayers, overlays).addTo(map);
 * ```
 *
 * The `baseLayers` and `overlays` parameters are object literals with layer names as keys and `Layer` objects as values:
 *
 * ```js
 * {
 *     "<someName1>": layer1,
 *     "<someName2>": layer2
 * }
 * ```
 *
 * The layer names can contain HTML, which allows you to add additional styling to the items:
 *
 * ```js
 * {"<img src='my-layer-icon' /> <span class='my-layer-item'>My Layer</span>": myLayer}
 * ```
 */

// @constructor Control.Layers(baselayers?: Object, overlays?: Object, options?: Control.Layers options)
// Creates a layers control with the given layers. Base layers will be switched with radio buttons, while overlays will be switched with checkboxes. Note that all base layers should be passed in the base layers object, but only one should be added to the map during map instantiation.
export class Layers extends Control {

	static {
		// @section
		// @aka Control.Layers options
		this.setDefaultOptions({
			// @option collapsed: Boolean = true
			// If `true`, the control will be collapsed into an icon and expanded on pointer hover, touch, or keyboard activation.
			collapsed: true,

			// @option collapseDelay: Number = 0
			// Collapse delay in milliseconds. If greater than 0, the control will remain open longer, making it easier to scroll through long layer lists.
			collapseDelay: 0,

			position: 'topright',

			// @option autoZIndex: Boolean = true
			// If `true`, the control will assign zIndexes in increasing order to all of its layers so that the order is preserved when switching them on/off.
			autoZIndex: true,

			// @option hideSingleBase: Boolean = false
			// If `true`, the base layers in the control will be hidden when there is only one.
			hideSingleBase: false,

			// @option sortLayers: Boolean = false
			// Whether to sort the layers. When `false`, layers will keep the order
			// in which they were added to the control.
			sortLayers: false,

			// @option sortFunction: Function = *
			// A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
			// that will be used for sorting the layers, when `sortLayers` is `true`.
			// The function receives both the `Layer` instances and their names, as in
			// `sortFunction(layerA, layerB, nameA, nameB)`.
			// By default, it sorts layers alphabetically by their name.
			sortFunction(layerA, layerB, nameA, nameB) {
				return nameA < nameB ? -1 : (nameB < nameA ? 1 : 0);
			}
		});
	}

	initialize(baseLayers, overlays, options) {
		Util.setOptions(this, options);

		this._layerControlInputs = [];
		this._layers = [];
		this._lastZIndex = 0;
		this._handlingClick = false;
		this._preventClick = false;

		for (const [name, layer] of Object.entries(baseLayers ?? {})) {
			this._addLayer(layer, name);
		}

		for (const [name, layer] of Object.entries(overlays ?? {})) {
			this._addLayer(layer, name, true);
		}
	}

	onAdd(map) {
		this._initLayout();
		this._update();

		this._map = map;
		map.on('zoomend', this._checkDisabledLayers, this);

		for (const layer of this._layers) {
			layer.layer.on('add remove', this._onLayerChange, this);
		}

		if (!this.options.collapsed) {
			// update the height of the container after resizing the window
			map.on('resize', this._expandIfNotCollapsed, this);
		}

		return this._container;
	}

	addTo(map) {
		Control.prototype.addTo.call(this, map);
		// Trigger expand after Layers Control has been inserted into DOM so that is now has an actual height.
		return this._expandIfNotCollapsed();
	}

	onRemove() {
		this._map.off('zoomend', this._checkDisabledLayers, this);

		for (const layer of this._layers) {
			layer.layer.off('add remove', this._onLayerChange, this);
		}

		this._map.off('resize', this._expandIfNotCollapsed, this);
	}

	// @method addBaseLayer(layer: Layer, name: String): this
	// Adds a base layer (radio button entry) with the given name to the control.
	addBaseLayer(layer, name) {
		this._addLayer(layer, name);
		return (this._map) ? this._update() : this;
	}

	// @method addOverlay(layer: Layer, name: String): this
	// Adds an overlay (checkbox entry) with the given name to the control.
	addOverlay(layer, name) {
		this._addLayer(layer, name, true);
		return (this._map) ? this._update() : this;
	}

	// @method removeLayer(layer: Layer): this
	// Remove the given layer from the control.
	removeLayer(layer) {
		layer.off('add remove', this._onLayerChange, this);

		const obj = this._getLayer(Util.stamp(layer));
		if (obj) {
			this._layers.splice(this._layers.indexOf(obj), 1);
		}
		return (this._map) ? this._update() : this;
	}

	// @method expand(): this
	// Expand the control container if collapsed.
	expand() {
		clearTimeout(this._collapseDelayTimeout);

		this._container.classList.add('leaflet-control-layers-expanded');
		this._section.style.height = null;
		const acceptableHeight = this._map.getSize().y - (this._container.offsetTop + 50);
		if (acceptableHeight < this._section.clientHeight) {
			this._section.classList.add('leaflet-control-layers-scrollbar');
			this._section.style.height = `${acceptableHeight}px`;
		} else {
			this._section.classList.remove('leaflet-control-layers-scrollbar');
		}
		this._checkDisabledLayers();
		return this;
	}

	// @method collapse(): this
	// Collapse the control container if expanded.
	collapse(ev) {
		// On touch devices `pointerleave` & `pointerout` is fired while clicking on a checkbox.
		// The control was collapsed instead of adding the layer to the map.
		// So we allow collapse only if it is not touch.
		if (!ev || !((ev.type === 'pointerleave' || ev.type === 'pointerout') && ev.pointerType === 'touch')) {
			if (this.options.collapseDelay > 0) {
				// Collapse delayed
				this._collapseDelayTimeout = setTimeout(() => {
					this._container.classList.remove('leaflet-control-layers-expanded');
				}, this.options.collapseDelay);
				return this;
			}

			// Collapse immediatelly
			this._container.classList.remove('leaflet-control-layers-expanded');
		}
		return this;
	}

	_initLayout() {
		const className = 'leaflet-control-layers',
		container = this._container = DomUtil.create('div', className),
		collapsed = this.options.collapsed;

		DomEvent.disableClickPropagation(container);
		DomEvent.disableScrollPropagation(container);

		const section = this._section = DomUtil.create('fieldset', `${className}-list`);

		if (collapsed) {
			this._map.on('click', this.collapse, this);

			DomEvent.on(container, {
				pointerenter: this._expandSafely,
				pointerleave: this.collapse
			}, this);
		}

		const link = this._layersLink = DomUtil.create('a', `${className}-toggle`, container);
		link.href = '#';
		link.title = 'Layers';
		link.setAttribute('role', 'button');

		DomEvent.on(link, {
			keydown(e) {
				if (e.code === 'Enter') {
					this._expandSafely();
				}
			},
			// Certain screen readers intercept the key event and instead send a click event
			click(e) {
				DomEvent.preventDefault(e);
				this._expandSafely();
			}
		}, this);

		if (!collapsed) {
			this.expand();
		}

		this._baseLayersList = DomUtil.create('div', `${className}-base`, section);
		this._separator = DomUtil.create('div', `${className}-separator`, section);
		this._overlaysList = DomUtil.create('div', `${className}-overlays`, section);

		container.appendChild(section);
	}

	_getLayer(id) {
		for (const layer of this._layers) {
			if (layer && Util.stamp(layer.layer) === id) {
				return layer;
			}
		}
	}

	_addLayer(layer, name, overlay) {
		if (this._map) {
			layer.on('add remove', this._onLayerChange, this);
		}

		this._layers.push({
			layer,
			name,
			overlay
		});

		if (this.options.sortLayers) {
			this._layers.sort(((a, b) => this.options.sortFunction(a.layer, b.layer, a.name, b.name)));
		}

		if (this.options.autoZIndex && layer.setZIndex) {
			this._lastZIndex++;
			layer.setZIndex(this._lastZIndex);
		}

		this._expandIfNotCollapsed();
	}

	_update() {
		if (!this._container) { return this; }

		this._baseLayersList.replaceChildren();
		this._overlaysList.replaceChildren();

		this._layerControlInputs = [];
		let baseLayersPresent, overlaysPresent, baseLayersCount = 0;

		for (const obj of this._layers) {
			this._addItem(obj);
			overlaysPresent ||= obj.overlay;
			baseLayersPresent ||= !obj.overlay;
			baseLayersCount += !obj.overlay ? 1 : 0;
		}

		// Hide base layers section if there's only one layer.
		if (this.options.hideSingleBase) {
			baseLayersPresent = baseLayersPresent && baseLayersCount > 1;
			this._baseLayersList.style.display = baseLayersPresent ? '' : 'none';
		}

		this._separator.style.display = overlaysPresent && baseLayersPresent ? '' : 'none';

		return this;
	}

	_onLayerChange(e) {
		if (!this._handlingClick) {
			this._update();
		}

		const obj = this._getLayer(Util.stamp(e.target));

		// @namespace Map
		// @section Layer events
		// @event baselayerchange: LayersControlEvent
		// Fired when the base layer is changed through the [layers control](#control-layers).
		// @event overlayadd: LayersControlEvent
		// Fired when an overlay is selected through the [layers control](#control-layers).
		// @event overlayremove: LayersControlEvent
		// Fired when an overlay is deselected through the [layers control](#control-layers).
		// @namespace Control.Layers
		const type = obj.overlay ?
			(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
			(e.type === 'add' ? 'baselayerchange' : null);

		if (type) {
			this._map.fire(type, obj);
		}
	}

	_addItem(obj) {
		const label = document.createElement('label'),
		checked = this._map.hasLayer(obj.layer);

		const input = document.createElement('input');
		input.type = obj.overlay ? 'checkbox' : 'radio';
		input.className = 'leaflet-control-layers-selector';
		input.defaultChecked = checked;
		if (!obj.overlay) {
			input.name = `leaflet-base-layers_${Util.stamp(this)}`;
		}

		this._layerControlInputs.push(input);
		input.layerId = Util.stamp(obj.layer);

		DomEvent.on(input, 'click', this._onInputClick, this);

		const name = document.createElement('span');
		name.innerHTML = ` ${obj.name}`;

		// Helps from preventing layer control flicker when checkboxes are disabled
		// https://github.com/Leaflet/Leaflet/issues/2771
		const holder = document.createElement('span');

		label.appendChild(holder);
		holder.appendChild(input);
		holder.appendChild(name);

		const container = obj.overlay ? this._overlaysList : this._baseLayersList;
		container.appendChild(label);

		this._checkDisabledLayers();
		return label;
	}

	_onInputClick(e) {
		// expanding the control on mobile with a click can cause adding a layer - we don't want this
		if (this._preventClick) {
			return;
		}

		const inputs = this._layerControlInputs,
		addedLayers = [],
		removedLayers = [];

		this._handlingClick = true;

		for (const input of inputs) {
			const layer = this._getLayer(input.layerId).layer;

			if (input.checked) {
				addedLayers.push(layer);
			} else if (!input.checked) {
				removedLayers.push(layer);
			}
		}

		// Bugfix issue 2318: Should remove all old layers before readding new ones
		for (const layer of removedLayers) {
			if (this._map.hasLayer(layer)) {
				this._map.removeLayer(layer);
			}
		}
		for (const layer of addedLayers) {
			if (!this._map.hasLayer(layer)) {
				this._map.addLayer(layer);
			}
		}

		this._handlingClick = false;

		this._refocusOnMap(e);
	}

	_checkDisabledLayers() {
		const inputs = this._layerControlInputs,
		zoom = this._map.getZoom();

		for (const input of inputs) {
			const layer = this._getLayer(input.layerId).layer;
			input.disabled = (layer.options.minZoom !== undefined && zoom < layer.options.minZoom) ||
			                 (layer.options.maxZoom !== undefined && zoom > layer.options.maxZoom);

		}
	}

	_expandIfNotCollapsed() {
		if (this._map && !this.options.collapsed) {
			this.expand();
		}
		return this;
	}

	_expandSafely() {
		const section = this._section;
		this._preventClick = true;
		DomEvent.on(section, 'click', DomEvent.preventDefault);
		this.expand();
		setTimeout(() => {
			DomEvent.off(section, 'click', DomEvent.preventDefault);
			this._preventClick = false;
		});
	}

}

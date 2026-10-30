import {Control} from './Control.js';
import * as Util from '../core/Util.js';
import * as DomEvent from '../dom/DomEvent.js';
import * as DomUtil from '../dom/DomUtil.js';

/** @import {ControlOptions, Defaults, LayersControlOptions, LeafletEvent} from '../types.js' */
/** @import {Layer} from '../layer/Layer.js' */
/** @import {LeafletMap} from '../map/Map.js' */

/** @satisfies {Defaults<ControlOptions>} */
const defaultOptions = {
	/**
	 * If `true`, the control will be collapsed into an icon and expanded
	 * on pointer hover, touch, or keyboard activation.
	 */
	collapsed: true,

	/**
	 * Collapse delay in milliseconds. If greater than 0, the control will remain
	 * open longer, making it easier to scroll through long layer lists.
	 */
	collapseDelay: 0,

	position: 'topright',

	/**
	 * If `true`, the control will assign zIndexes in increasing order to all of
	 * its layers so that the order is preserved when switching them on/off.
	 */
	autoZIndex: true,

	/** If `true`, the base layers in the control will be hidden when there is only one. */
	hideSingleBase: false,

	/**
	 * Whether to sort the layers. When `false`, layers will keep
	 * the order in which they were added to the control.
	 */
	sortLayers: false,

	/**
	 * A [compare function](https://developer.mozilla.org/docs/Web/JavaScript/Reference/Global_Objects/Array/sort)
	 * that will be used for sorting the layers, when `sortLayers` is `true`. The function receives
	 * both the `Layer` instances and their names, as in `sortFunction(layerA, layerB, nameA, nameB)`.
	 * By default, it sorts layers alphabetically by their name.
	 * @param {Layer} layerA
	 * @param {Layer} layerB
	 * @param {string} nameA
	 * @param {string} nameB
	 * @returns {number}
	 */
	sortFunction(layerA, layerB, nameA, nameB) {
		return nameA < nameB ? -1 : (nameB < nameA ? 1 : 0);
	}
};

/** @typedef {typeof defaultOptions} LayersControlDefaults */

/** @typedef {{layer: Layer, name: string, overlay?: boolean}} LayersControlEntry */

/**
 * @typedef {Object} LayersControlEventProps
 * @property {string} name The name of the layer that was added or removed.
 */

/**
 * The layers control gives users the ability to switch between different base layers and switch overlays on/off
 * (check out the [detailed example](https://leafletjs.com/examples/layers-control/)). Extends `Control`.
 * @example
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
 * new LayersControl(baseLayers, overlays).addTo(map);
 * ```
 *
 * The `baseLayers` and `overlays` parameters are object literals with layer
 * names as keys and `Layer` objects as values:
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
 * @template {LayersControlOptions} [O=LayersControlOptions]
 * @extends {Control<O>}
 */
export class LayersControl extends Control {

	static initHooks = true;

	/** @type {Defaults<LayersControlOptions>} */
	static defaultOptions = defaultOptions;

	/**
	 * Creates a layers control with the given layers. Base layers will be switched with radio buttons,
	 * while overlays will be switched with checkboxes. Note that all base layers should be passed in
	 * the base layers object, but only one should be added to the map during map instantiation.
	 * @param {{[name: string]: Layer}} [baseLayers]
	 * @param {{[name: string]: Layer}} [overlays]
	 * @param {Partial<O>} [options]
	 */
	constructor(baseLayers, overlays, options) {
		super(options);

		/** @type {Map<HTMLInputElement, Layer>} */
		this._layerControlInputs = new Map();
		/** @type {LayersControlEntry[]} */
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

		this.callInitHooks();
	}

	/** @param {LeafletMap} map */
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

	/** @param {LeafletMap} map */
	addTo(map) {
		super.addTo(map);
		// Trigger expand after Layers Control has been inserted into DOM so that is now has an actual height.
		return this._expandIfNotCollapsed();
	}

	/** @param {LeafletMap} map */
	onRemove(map) {
		map.off('zoomend', this._checkDisabledLayers, this);

		for (const layer of this._layers) {
			layer.layer.off('add remove', this._onLayerChange, this);
		}

		map.off('resize', this._expandIfNotCollapsed, this);
		map.off('click', this.collapse, this);
	}

	/**
	 * Adds a base layer (radio button entry) with the given name to the control.
	 * @param {Layer} layer
	 * @param {string} name
	 */
	addBaseLayer(layer, name) {
		this._addLayer(layer, name);
		return (this._map) ? this._update() : this;
	}

	/**
	 * Adds an overlay (checkbox entry) with the given name to the control.
	 * @param {Layer} layer
	 * @param {string} name
	 */
	addOverlay(layer, name) {
		this._addLayer(layer, name, true);
		return (this._map) ? this._update() : this;
	}

	/**
	 * Remove the given layer from the control.
	 * @param {Layer} layer
	 */
	removeLayer(layer) {
		layer.off('add remove', this._onLayerChange, this);

		this._layers = this._layers.filter(o => o.layer !== layer);
		return (this._map) ? this._update() : this;
	}

	/** Expand the control container if collapsed. */
	expand() {
		clearTimeout(this._collapseDelayTimeout);

		this._container.classList.add('leaflet-control-layers-expanded');
		this._section.style.height = '';
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

	/** Collapse the control container if expanded. */
	collapse() {
		if (this.options.collapseDelay > 0) {
			this._collapseDelayTimeout = setTimeout(() => {
				this._container.classList.remove('leaflet-control-layers-expanded');
			}, this.options.collapseDelay);
		} else {
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

		const section = DomUtil.create('fieldset', `${className}-list`);
		/** @type {HTMLFieldSetElement} */
		this._section = section;

		if (collapsed) {
			this._map.on('click', this.collapse, this);

			DomEvent.on(container, {
				pointerenter: this._expandSafely,
				/** @this {LayersControl} */
				pointerleave(e) {
					// touch fires `pointerleave` on tapping a checkbox, which would collapse instead of toggling a layer
					if (e.pointerType !== 'touch') { this.collapse(); }
				}
			}, this);
		}

		const link = this._layersLink = DomUtil.create('a', `${className}-toggle`, container);
		link.href = '#';
		link.title = 'Layers';
		link.setAttribute('role', 'button');
		section.setAttribute('aria-label', link.title);

		DomEvent.on(link, {
			/** @this {LayersControl} */
			keydown(e) {
				if (e.code === 'Enter') {
					this._expandSafely();
				}
			},
			// Certain screen readers intercept the key event and instead send a click event
			/** @this {LayersControl} */
			click(e) {
				e.preventDefault();
				this._expandSafely();
			}
		}, this);

		if (!collapsed) {
			this.expand();
		}

		/** @type {HTMLDivElement} */
		this._baseLayersList = DomUtil.create('div', `${className}-base`, section);
		/** @type {HTMLDivElement} */
		this._separator = DomUtil.create('div', `${className}-separator`, section);
		/** @type {HTMLDivElement} */
		this._overlaysList = DomUtil.create('div', `${className}-overlays`, section);

		container.appendChild(section);
	}

	/**
	 * @param {Layer & {setZIndex?(zIndex: number): void}} layer
	 * @param {string} name
	 * @param {boolean} [overlay]
	 */
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

		this._layerControlInputs.clear();
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

	/** @param {LeafletEvent} e */
	_onLayerChange(e) {
		if (!this._handlingClick) {
			this._update();
		}

		const obj = /** @type {LayersControlEntry} */ (this._layers.find(o => o.layer === e.target));

		const type = obj.overlay ?
			(e.type === 'add' ? 'overlayadd' : 'overlayremove') :
			(e.type === 'add' ? 'baselayerchange' : null);

		if (type) {
			this._map.fire(type, obj);
		}
	}

	/** @param {LayersControlEntry} obj */
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

		this._layerControlInputs.set(input, obj.layer);

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

	/** @param {MouseEvent} e */
	_onInputClick(e) {
		// expanding the control on mobile with a click can cause adding a layer - we don't want this
		if (this._preventClick) {
			return;
		}

		// a layer can be listed under several inputs, so it should be on the map if any of them is checked
		/** @type {Map<Layer, boolean>} */
		const checked = new Map();
		for (const [input, layer] of this._layerControlInputs) {
			checked.set(layer, checked.get(layer) || input.checked);
		}

		// diff against the map upfront, so layers that event handlers add or remove below keep their state (#9747)
		/** @type {Layer[]} */
		const addedLayers = [];
		/** @type {Layer[]} */
		const removedLayers = [];
		for (const [layer, on] of checked) {
			if (on !== this._map.hasLayer(layer)) {
				(on ? addedLayers : removedLayers).push(layer);
			}
		}

		this._handlingClick = true;

		// Bugfix issue 2318: Should remove all old layers before readding new ones
		for (const layer of removedLayers) {
			this._map.removeLayer(layer);
		}
		for (const layer of addedLayers) {
			this._map.addLayer(layer);
		}

		this._handlingClick = false;

		for (const [layer, on] of checked) {
			if (on !== this._map.hasLayer(layer)) {
				this._update();
				break;
			}
		}

		this._refocusOnMap(e);
	}

	_checkDisabledLayers() {
		const zoom = this._map.getZoom();

		for (const [input, layer] of this._layerControlInputs) {
			const options = /** @type {{minZoom?: number, maxZoom?: number}} */ (layer.options);
			input.disabled = (options.minZoom !== undefined && zoom < options.minZoom) ||
			                 (options.maxZoom !== undefined && zoom > options.maxZoom);

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

import {LayerGroup} from './LayerGroup.js';
import {LatLngBounds} from '../geo/LatLngBounds.js';

/** @import {FeatureGroupEventMap, InteractiveLayerOptions, LayerEvent} from '../types.js' */
/** @import {Layer} from './Layer.js' */
/** @import {MemberLayer} from './LayerGroup.js' */

/**
 * @typedef {Object} FeatureGroupEvents
 * @property {LayerEvent} layeradd Fired when a layer is added to this `FeatureGroup`
 * @property {LayerEvent} layerremove Fired when a layer is removed from this `FeatureGroup`
 */

/**
 * Extended `LayerGroup` that makes it easier to do the same thing to all its member layers:
 *  * [`bindPopup`](#layer-bindpopup) binds a popup to all of the layers at once (likewise with [`bindTooltip`](#layer-bindtooltip))
 *  * Events are propagated to the `FeatureGroup`, so if the group has an event
 * handler, it will handle events from any of the layers. This includes pointer events and custom events.
 *  * Has `layeradd` and `layerremove` events
 * @example
 * ```js
 * new FeatureGroup([marker1, marker2, polyline])
 * 	.bindPopup('Hello world!')
 * 	.on('click', function() { alert('Clicked on a member of the group!'); })
 * 	.addTo(map);
 * ```
 * @template {InteractiveLayerOptions} [O=InteractiveLayerOptions]
 * @template {FeatureGroupEventMap} [E=FeatureGroupEventMap]
 * @extends {LayerGroup<O, E>}
 */
export class FeatureGroup extends LayerGroup {

	/** @param {Layer} layer */
	addLayer(layer) {
		if (this.hasLayer(layer)) {
			return this;
		}

		layer.addEventParent(this);

		super.addLayer(layer);

		return this.fire('layeradd', {layer});
	}

	/** @param {Layer | number} layer */
	removeLayer(layer) {
		if (!this.hasLayer(layer)) {
			return this;
		}
		if (typeof layer === 'number') {
			layer = this._layers[layer];
		}

		layer.removeEventParent(this);

		super.removeLayer(layer);

		return this.fire('layerremove', {layer});
	}

	/**
	 * Sets the given path options to each layer of the group that has a `setStyle` method.
	 * @param {object} style
	 * @returns {this}
	 */
	setStyle(style) {
		return this.eachLayer(l => /** @type {MemberLayer} */ (l).setStyle?.(style));
	}

	/**
	 * Brings the layer group to the top of all other layers
	 * @returns {this}
	 */
	bringToFront() {
		return this.eachLayer(l => /** @type {MemberLayer} */ (l).bringToFront?.());
	}

	/**
	 * Brings the layer group to the back of all other layers
	 * @returns {this}
	 */
	bringToBack() {
		return this.eachLayer(l => /** @type {MemberLayer} */ (l).bringToBack?.());
	}

	/**
	 * Returns the LatLngBounds of the Feature Group (created from bounds and coordinates
	 * of its children, including the layers of nested layer groups).
	 * @returns {LatLngBounds}
	 */
	getBounds() {
		const bounds = new LatLngBounds();

		for (const layer of /** @type {MemberLayer[]} */ (Object.values(this._layers))) {
			if (layer.getBounds) {
				bounds.extend(layer.getBounds());
			} else if (layer.getLatLng) {
				bounds.extend(layer.getLatLng());
			} else if (layer instanceof LayerGroup) {
				bounds.extend(FeatureGroup.prototype.getBounds.call(layer));
			}
		}
		return bounds;
	}

	// bound popups and tooltips open on the first of the group's layers that is on the map
	/** @returns {Layer | undefined} */
	_getOverlaySource() {
		return Object.values(this._layers).find(layer => layer._map);
	}
}

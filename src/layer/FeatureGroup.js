import {LayerGroup} from './LayerGroup.js';
import {LatLngBounds} from '../geo/LatLngBounds.js';

/**
 * @typedef {Object} FeatureGroupEvents
 * @property {LayerEvent} layeradd Fired when a layer is added to this `FeatureGroup`
 * @property {LayerEvent} layerremove Fired when a layer is removed from this `FeatureGroup`
 */

/**
 * Create a feature group, optionally given an initial set of layers and an `options` object.
 * @param {Layer[]} [layers]
 * @param {object} [options]
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
 */
export class FeatureGroup extends LayerGroup {

	addLayer(layer) {
		if (this.hasLayer(layer)) {
			return this;
		}

		layer.addEventParent(this);

		super.addLayer(layer);

		return this.fire('layeradd', {layer});
	}

	removeLayer(layer) {
		if (!this.hasLayer(layer)) {
			return this;
		}
		if (layer in this._layers) {
			layer = this._layers[layer];
		}

		layer.removeEventParent(this);

		super.removeLayer(layer);

		return this.fire('layerremove', {layer});
	}

	/**
	 * Sets the given path options to each layer of the group that has a `setStyle` method.
	 * @param {PathOptions} style
	 * @returns {this}
	 */
	setStyle(style) {
		return this.eachLayer(l => l.setStyle?.(style));
	}

	/**
	 * Brings the layer group to the top of all other layers
	 * @returns {this}
	 */
	bringToFront() {
		return this.eachLayer(l => l.bringToFront?.());
	}

	/**
	 * Brings the layer group to the back of all other layers
	 * @returns {this}
	 */
	bringToBack() {
		return this.eachLayer(l => l.bringToBack?.());
	}

	/**
	 * Returns the LatLngBounds of the Feature Group (created from bounds and coordinates
	 * of its children, including the layers of nested layer groups).
	 * @returns {LatLngBounds}
	 */
	getBounds() {
		const bounds = new LatLngBounds();

		for (const layer of Object.values(this._layers)) {
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
	_getOverlaySource() {
		return Object.values(this._layers).find(layer => layer._map);
	}
}

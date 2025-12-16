import {LayerGroup} from './LayerGroup.js';
import {LatLngBounds} from '../geo/LatLngBounds.js';

/*
 * @class FeatureGroup
 * @inherits LayerGroup
 *
 * Extended `LayerGroup` that makes it easier to do the same thing to all its member layers:
 *  * [`bindPopup`](#layer-bindpopup) binds a popup to all of the layers at once (likewise with [`bindTooltip`](#layer-bindtooltip))
 *  * Events are propagated to the `FeatureGroup`, so if the group has an event
 * handler, it will handle events from any of the layers. This includes pointer events
 * and custom events.
 *  * Has `layeradd` and `layerremove` events
 *
 * @example
 *
 * ```js
 * new FeatureGroup([marker1, marker2, polyline])
 * 	.bindPopup('Hello world!')
 * 	.on('click', function() { alert('Clicked on a member of the group!'); })
 * 	.addTo(map);
 * ```
 */

// @constructor FeatureGroup(layers?: Layer[], options?: Object)
// Create a feature group, optionally given an initial set of layers and an `options` object.
export class FeatureGroup extends LayerGroup {

	addLayer(layer) {
		if (this.hasLayer(layer)) {
			return this;
		}

		layer.addEventParent(this);

		super.addLayer(layer);

		// @event layeradd: LayerEvent
		// Fired when a layer is added to this `FeatureGroup`
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

		// @event layerremove: LayerEvent
		// Fired when a layer is removed from this `FeatureGroup`
		return this.fire('layerremove', {layer});
	}

	// @method setStyle(style: Path options): this
	// Sets the given path options to each layer of the group that has a `setStyle` method.
	setStyle(style) {
		return this.eachLayer(l => l.setStyle?.(style));
	}

	// @method bringToFront(): this
	// Brings the layer group to the top of all other layers
	bringToFront() {
		return this.eachLayer(l => l.bringToFront?.());
	}

	// @method bringToBack(): this
	// Brings the layer group to the back of all other layers
	bringToBack() {
		return this.eachLayer(l => l.bringToBack?.());
	}

	// @method getBounds(): LatLngBounds
	// Returns the LatLngBounds of the Feature Group (created from bounds and coordinates of its children).
	getBounds() {
		const bounds = new LatLngBounds();

		for (const layer of Object.values(this._layers)) {
			bounds.extend(layer.getBounds ? layer.getBounds() : layer.getLatLng());
		}
		return bounds;
	}
}

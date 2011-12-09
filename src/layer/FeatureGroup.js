/*
 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and bindPopup method shared between a group of layers. 
 */

L.FeatureGroup = L.LayerGroup.extend({
	includes: L.Mixin.Events,

	addLayer: function(layer) {
		L.LayerGroup.prototype.addLayer.call(this, layer);
		layer._setParentEventTarget(this); // propagate layer events to feature group
		
		if (this._popupContent && layer.bindPopup) {
			layer.bindPopup(this._popupContent);
		} 
	},
	
	bindPopup: function(content) {
		this._popupContent = content;
		
		for (var i in this._layers) {
			if (this._layers.hasOwnProperty(i) && this._layers[i].bindPopup) {
				this._layers[i].bindPopup(content);
			}
		}
	}

});
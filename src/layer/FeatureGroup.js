/*
 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and bindPopup method shared between a group of layers.
 */

L.FeatureGroup = L.LayerGroup.extend({
	includes: L.Mixin.Events,

	addLayer: function (layer) {
		this._initEvents(layer);

		L.LayerGroup.prototype.addLayer.call(this, layer);

		if (this._popupContent && layer.bindPopup) {
			layer.bindPopup(this._popupContent);
		}
	},

	bindPopup: function (content) {
		this._popupContent = content;
		return this.invoke('bindPopup', content);
	},

	setStyle: function (style) {
		return this.invoke('setStyle', style);
	},

	getBounds: function () {
		var bounds = new L.LatLngBounds();
		this._iterateLayers(function (layer) {
			bounds.extend(layer instanceof L.Marker ? layer.getLatLng() : layer.getBounds());
		}, this);
		return bounds;
	},

	_initEvents: function (layer) {
		var events = ['click', 'dblclick', 'mouseover', 'mouseout'],
			i, len;

		for (i = 0, len = events.length; i < len; i++) {
			layer.on(events[i], this._propagateEvent, this);
		}
	},

	_propagateEvent: function (e) {
		e.layer  = e.target;
		e.target = this;

		this.fire(e.type, e);
	}
});

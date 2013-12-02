/*
 * L.FeatureGroup extends L.LayerGroup by introducing mouse events and additional methods
 * shared between a group of interactive layers (like vectors or markers).
 */

L.FeatureGroup = L.LayerGroup.extend({
	includes: L.Mixin.Events,

	initialize: function (layers) {
		this._eventTypes = '';

		L.LayerGroup.prototype.initialize.call(this, layers);
	},

	addEventListener: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])

		// types can be a map of types/handlers
		if (L.Util.invokeEach(types, this.addEventListener, this, fn, context)) { return this; }

		//keep track of event types we're listening for 
		var i, type,
		    newTypes = '',
		    typesArray = L.Util.splitWords(types);
		for (i in typesArray) {
			type = typesArray[i];
			if (!this.hasEventListeners(type)) {
				//listener for a new event type. 
				this._eventTypes = (this._eventTypes || '') + type + ' ';
				newTypes = type + ' ';
			}
		}
		//make sure layers propagate back events for the new types we're registering
		if (newTypes !== '') {
			this.eachLayer(function (layer) {
				if ('on' in layer) {
					layer.on(newTypes, this._propagateEvent, this);
				}
			}, this);
		}

		//call mixin method
		return L.Mixin.Events.addEventListener.call(this, types, fn, context);
	},

	on: function (types, fn, context) { // (String, Function[, Object]) or (Object[, Object])
		return this.addEventListener(types, fn, context);
	},

	addLayer: function (layer) {
		if (this.hasLayer(layer)) {
			return this;
		}

		if ('on' in layer) {
			layer.on(this._eventTypes, this._propagateEvent, this);
		}

		L.LayerGroup.prototype.addLayer.call(this, layer);

		if (this._popupContent && layer.bindPopup) {
			layer.bindPopup(this._popupContent, this._popupOptions);
		}

		return this.fire('layeradd', {layer: layer});
	},

	removeLayer: function (layer) {
		if (!this.hasLayer(layer)) {
			return this;
		}
		if (layer in this._layers) {
			layer = this._layers[layer];
		}

		layer.off(this._eventTypes, this._propagateEvent, this);

		L.LayerGroup.prototype.removeLayer.call(this, layer);

		if (this._popupContent) {
			this.invoke('unbindPopup');
		}

		return this.fire('layerremove', {layer: layer});
	},

	bindPopup: function (content, options) {
		this._popupContent = content;
		this._popupOptions = options;
		return this.invoke('bindPopup', content, options);
	},

	openPopup: function (latlng) {
		// open popup on the first layer
		for (var id in this._layers) {
			this._layers[id].openPopup(latlng);
			break;
		}
		return this;
	},

	setStyle: function (style) {
		return this.invoke('setStyle', style);
	},

	bringToFront: function () {
		return this.invoke('bringToFront');
	},

	bringToBack: function () {
		return this.invoke('bringToBack');
	},

	getBounds: function () {
		var bounds = new L.LatLngBounds();

		this.eachLayer(function (layer) {
			bounds.extend(layer instanceof L.Marker ? layer.getLatLng() : layer.getBounds());
		});

		return bounds;
	},

	_propagateEvent: function (e) {
		e = L.extend({
			layer: e.target,
			target: this
		}, e);
		this.fire(e.type, e);
	}
});

L.featureGroup = function (layers) {
	return new L.FeatureGroup(layers);
};

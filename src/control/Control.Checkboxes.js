L.Control.Checkboxes = L.Class.extend({
	onAdd: function(map) {
		this._map = map;
		this._container = L.DomUtil.create('div', 'leaflet-control-checkboxes');
	},

	getContainer: function() {
		return this._container;
	},

	getPosition: function() {
		return L.Control.Position.BOTTOM_LEFT;
	},

	createCheckboxes: function(layers, callbackContext) {
		var ul = document.createElement('ul');
		for (var i in layers) {
			var layer = layers[i];
			var li = document.createElement('li');
			var checkbox = document.createElement('input');
			if (layer.enabled) {
				checkbox.checked = 'checked';
			}
			checkbox.id = layer.name;
			checkbox.type = 'checkbox';
			L.DomEvent.addListener(checkbox, 'click', layer.callback, callbackContext);
			li.appendChild(checkbox);
			var label = document.createElement('label');
			label.className = 'leaflet-control-checkboxes-' + layer.name;
			label.setAttribute('for', layer.name);
			label.innerHTML = layer.title;
			li.appendChild(label);
			ul.appendChild(li);
		}
		this._container.appendChild(ul);
	}
});

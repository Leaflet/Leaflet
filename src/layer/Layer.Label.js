/*
 * @namespace Layer
 * @section Label methods example
 *
 * All layers share a set of methods convenient for binding labels to it.
 *
 * ```js
 * var layer = L.Polygon(latlngs).bindLabel('Hi There!').addTo(map);
 * layer.openLabel();
 * layer.closeLabel();
 * ```
 */

// @section Label methods
L.Layer.include({

	// @method bindLabel(content: String|HTMLElement|Function|Label, options?: Label options): this
	// Binds a label to the layer with the passed `content` and sets up the
	// neccessary event listeners. If a `Function` is passed it will receive
	// the layer as the first argument and should return a `String` or `HTMLElement`.
	bindLabel: function (content, options) {

		if (content instanceof L.Label) {
			L.setOptions(content, options);
			this._label = content;
			content._source = this;
		} else {
			if (!this._label || options) {
				this._label = L.label(options, this);
			}
			this._label.setContent(content);

		}

		this._initLabelInteractions();

		if (this._label.options.permanent) { this.openLabel(); }

		return this;
	},

	// @method unbindLabel(): this
	// Removes the label previously bound with `bindLabel`.
	unbindLabel: function () {
		if (this._label) {
			this._initLabelInteractions(true);
			this.closeLabel();
			this._label = null;
		}
		return this;
	},

	_initLabelInteractions: function (remove) {
		if (!remove && this._labelHandlersAdded) { return; }
		var onOff = remove ? 'off' : 'on',
		    events = {
			remove: this.closeLabel,
			move: this._moveLabel
		    };
		if (!this._label.options.permanent) {
			events.mouseover = this._openLabel;
			events.mouseout = this.closeLabel;
			if (this._label.options.sticky) {
				events.mousemove = this._moveLabel;
			}
			if (L.Browser.touch) {
				events.click = this._openLabel;
			}
		}
		this[onOff](events);
		this._labelHandlersAdded = !remove;
	},

	// @method openLabel(latlng?: LatLng): this
	// Opens the bound label at the specificed `latlng` or at the default label anchor if no `latlng` is passed.
	openLabel: function (layer, latlng) {
		if (!(layer instanceof L.Layer)) {
			latlng = layer;
			layer = this;
		}

		if (layer instanceof L.FeatureGroup) {
			for (var id in this._layers) {
				layer = this._layers[id];
				break;
			}
		}

		if (!latlng) {
			latlng = layer.getCenter ? layer.getCenter() : layer.getLatLng();
		}

		if (this._label && this._map) {

			// set label source to this layer
			this._label._source = layer;

			// update the label (content, layout, ect...)
			this._label.update();

			// open the label on the map
			this._map.openLabel(this._label, latlng);

			if (this._label.options.interactive) {
				L.DomUtil.addClass(this._label._container, 'leaflet-clickable');
				this.addInteractiveTarget(this._label._container);
			}
		}

		return this;
	},

	// @method closeLabel(): this
	// Closes the label bound to this layer if it is open.
	closeLabel: function () {
		if (this._label) {
			this._label._close();
			if (this._label.options.interactive) {
				L.DomUtil.removeClass(this._label._container, 'leaflet-clickable');
				this.removeInteractiveTarget(this._label._container);
			}
		}
		return this;
	},

	// @method toggleLabel(): this
	// Opens or closes the label bound to this layer depending on its current state.
	toggleLabel: function (target) {
		if (this._label) {
			if (this._label._map) {
				this.closeLabel();
			} else {
				this.openLabel(target);
			}
		}
		return this;
	},

	// @method isLabelOpen(): boolean
	// Returns `true` if the label bound to this layer is currently open.
	isLabelOpen: function () {
		return this._label.isOpen();
	},

	// @method setLabelContent(content: String|HTMLElement|Label): this
	// Sets the content of the label bound to this layer.
	setLabelContent: function (content) {
		if (this._label) {
			this._label.setContent(content);
		}
		return this;
	},

	// @method getLabel(): Label
	// Returns the label bound to this layer.
	getLabel: function () {
		return this._label;
	},

	_openLabel: function (e) {
		var layer = e.layer || e.target;

		if (!this._label || !this._map) {
			return;
		}
		this.openLabel(layer, this._label.options.sticky ? e.latlng : undefined);
	},

	_moveLabel: function (e) {
		var latlng = e.latlng, containerPoint, layerPoint;
		if (this._label.options.sticky && e.originalEvent) {
			containerPoint = this._map.mouseEventToContainerPoint(e.originalEvent);
			layerPoint = this._map.containerPointToLayerPoint(containerPoint);
			latlng = this._map.layerPointToLatLng(layerPoint);
		}
		this._label.setLatLng(latlng);
	}
});

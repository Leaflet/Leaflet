(function () {
	/*
	 * L.LayerGroup is a class to combine several layers so you can manipulate the group (e.g. add/remove it) as one layer.
	 * options:
	 *  * addYieldSpec: YieldSpec or false or LayerGroup.YIELDSPEC_DEFAULT, default false, yield spec for layer add
	 *  * rmvYieldSpec: YieldSpec or false or LayerGroup.YIELDSPEC_DEFAULT, default false, yield spec for layer rmv
	 *  *   YieldSpec: [ nChunk, yieldTime ],
	 *  *     nChunk: the number of layers to proccess at a time
	 *  *     yieldTime: the time to yield between chunks in ms. 100-150 is a good range.
	 */
	L.LayerGroup = L.Class.extend({
		statics: {
			YIELDSPEC_DEFAULT: 1,
			_defAddYieldSpec: [ 800, 140 ],
			_defRmvYieldSpec: [ 600, 140 ]
		},

		initialize: function (layers, options) {
			L.Util.setOptions(this, options);
			this._layers = {};

			var i, len;

			if (layers) {
				for (i = 0, len = layers.length; i < len; i++) {
					this.addLayer(layers[i]);
				}
			}
		},

		/**
		 * Flag support for asynchronous layer add/remove for map.addlayer
		 */
		_asyncAdd: true,

		addLayer: function (layer) {
			var id = L.Util.stamp(layer);

			this._layers[id] = layer;

			if (this._map) {
				this._map.addLayer(layer);
			}

			return this;
		},

		removeLayer: function (layer) {
			var id = L.Util.stamp(layer);

			delete this._layers[id];

			if (this._map) {
				this._map.removeLayer(layer);
			}

			return this;
		},

		clearLayers: function () {
			this.eachLayer(this.removeLayer, this);
			return this;
		},

		invoke: function (methodName) {
			var args = Array.prototype.slice.call(arguments, 1),
				i, layer;

			for (i in this._layers) {
				if (this._layers.hasOwnProperty(i)) {
					layer = this._layers[i];

					if (layer[methodName]) {
						layer[methodName].apply(layer, args);
					}
				}
			}

			return this;
		},

		onAdd: function (map, cbLayerAdd) {
			var yieldAddSpec = this.options.addYieldSpec;
			if (yieldAddSpec === L.LayerGroup.YIELDSPEC_DEFAULT) {
				yieldAddSpec = L.LayerGroup._defAddYieldSpec;
			}

			this._map = map;

			if (yieldAddSpec) {
				var that = this;
				// eachLayer = function (method, context, nChunk, yieldTim, onProced, cancel) {
				this.eachLayer(map.addLayer, map, yieldAddSpec, function () {
					cbLayerAdd.call(map, that); // this->map, arg->this(layer)
				});
			}
			else {
				this.eachLayer(map.addLayer, map);
				cbLayerAdd.call(map, this); // this->map, arg->this(layer)
			}
		},

		onRemove: function (map, cbLayerRmv) {
			var yieldRmvSpec = this.options.rmvYieldSpec;
			if (yieldRmvSpec === L.LayerGroup.YIELDSPEC_DEFAULT) {
				yieldRmvSpec = L.LayerGroup._defRmvYieldSpec;
			}

			if (yieldRmvSpec) {
				var that = this;
				// eachLayer = function (method, context, nChunk, yieldTim, onProced, cancel) {
				this.eachLayer(map.removeLayer, map, yieldRmvSpec, function () {
					cbLayerRmv.call(map, that); // this->map, arg->this(layer)
				});
			}
			else {
				this.eachLayer(map.removeLayer, map);
				cbLayerRmv.call(map, this); // this->map, arg->this(layer)
			}

			this._map = null;
		},

		addTo: function (map) {
			map.addLayer(this);
			return this;
		},

		/**
		 * Yield capable eachLayer
		 * @param method method to call, method(layer)
		 * @param context context to switch on method invocation and onProced callback invocation
		 * @param yieldSpec opt Array [nChunk, yieldTime] or false, no yielding when not specified or false,
		 *  nChunk: number of layers to batch proccess,
		 *  yieldTime: time to yield in ms
		 * @param onProced opt callback to call when done (with context)
		 * @param cancel opt Array [cancel], cancel: boolean, after eachLayer invoked, you can set cancel to true and the next chunks, will be aborted (and call onProced)
		 */
		eachLayer: function (method, context, yieldSpec, onProced, cancel) {
			var nChunk, yieldTim, i, queue,
				layers = this._layers;

			if (yieldSpec) {
				nChunk = yieldSpec[0];
				yieldTim = yieldSpec[1];
				queue = [];
				for (i in layers) {
					if (layers.hasOwnProperty(i)) {
						queue.push(layers[i]);
					}
				}
				// doChunk( array, cbProc, onProced, yieldTim, nChunk, ctx, cancel)
				doChunk(queue, method, onProced, yieldTim, nChunk, context, cancel);
			}
			else {
				// unchunked
				for (i in layers) {
					if (layers.hasOwnProperty(i)) {
						method.call(context, layers[i]);
					}
				}
			}
		}
	});

	L.layerGroup = function (layers) {
		return new L.LayerGroup(layers);
	};


	/**
	 * PRIVATE
	 * @param array data queue
	 * @param cbProc(item) called with ctx, to process each data
	 * @param onProced() called with ctx, when everything finishes
	 * @param yieldTim time to yield in ms
	 * @param nChunk number of items to proccess as a chink
	 * @param ctx context to run methods on
	 * @param cancel opt Array [cancel], cancel: boolean, after doChunk invacation, when set to true, the next chunks will be aborted (and call onProced)
	 */
	function doChunk(array, cbProc, onProced, yieldTim, nChunk, ctx, cancel) {
		if (nChunk === undefined) {
			throw new Error("Invalid Arg");
		}

		var i = 0, n = array.length,
		  func = cancel ?
				function funcc() { // with cancel check
					var item,
					  nc = nChunk;
				
					for (; i < n && nc--; i++) {
						item = array[i];
						cbProc.call(ctx, item);
					}

					if (i < n && !cancel[0]) {
						setTimeout(func, yieldTim);
					}
					else {
						if (onProced) {
							onProced.call(ctx);
						}
					}
				} // end func
		:
				function funcb() { // without cancel
					var item,
						nc = nChunk;
				
					for (; i < n && nc--; i++) {
						item = array[i];
						cbProc.call(ctx, item);
					}

					if (i < n) {
						setTimeout(func, yieldTim);
					}
					else {
						if (onProced) {
							onProced.call(ctx);
						}
					}
				};
		
		setTimeout(func, yieldTim);
	} // do chunk

}());

/*
 * @class Renderer
 * @inherits Layer
 * @aka L.Renderer
 *
 * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the
 * DOM container of the renderer, its bounds, and its zoom animation.
 *
 * A `Renderer` works as an implicit layer group for all `Path`s - the renderer
 * itself can be added or removed to the map. All paths use a renderer, which can
 * be implicit (the map will decide the type of renderer and use it automatically)
 * or explicit (using the [`renderer`](#path-renderer) option of the path).
 *
 * Do not use this class directly, use `SVG` and `Canvas` instead.
 *
 * @event update: Event
 * Fired when the renderer updates its bounds, center and zoom, for example when
 * its map has moved
 */

L.Renderer = L.Layer.extend({

	// @section
	// @aka Renderer options
	options: {
		// @option padding: Number = 0.1
		// How much to extend the clip area around the map view (relative to its size)
		// e.g. 0.1 would be 10% of map view in each direction
		padding: 0.1
	},

	initialize: function (options) {
		L.setOptions(this, options);
		L.stamp(this);
	},

	onAdd: function (map) {
		if (!this._container) {
			this._initContainer(); // defined by renderer implementations

			if (this._zoomAnimated) {
				L.DomUtil.addClass(this._container, 'leaflet-zoom-animated');
			}
		}

		this.getPane().appendChild(this._container);
		this._update();

		this._map.on('rotate', this._update, this);
	},

	onRemove: function () {
		L.DomUtil.remove(this._container);
		this._map.off('rotate', this._update, this);
	},

	getEvents: function () {
		var events = {
			viewreset: this._reset,
			zoom: this._onZoom,
			moveend: this._update
		};
		if (this._zoomAnimated) {
			events.zoomanim = this._onAnimZoom;
		}
		return events;
	},

	_onAnimZoom: function (ev) {
		this._updateTransform(ev.center, ev.zoom);
	},

	_onZoom: function () {
		this._updateTransform(this._map.getCenter(), this._map.getZoom());
	},

	_updateTransform: function (center, zoom) {
		var scale = this._map.getZoomScale(zoom, this._zoom),
		   offset = this._map._latLngToNewLayerPoint(this._topLeft, zoom, center);
		if (L.Browser.any3d) {
			L.DomUtil.setTransform(this._container, offset, scale);
		} else {
			L.DomUtil.setPosition(this._container, offset);
		}
	},

	_reset: function () {
		this._update();
		this._updateTransform(this._center, this._zoom);
	},

	_update: function () {
		// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
		// Subclasses are responsible of firing the 'update' event.
		var p = this.options.padding,
		    map = this._map,
		    size = this._map.getSize(),
		    padMin = size.multiplyBy(-p),
		    padMax = size.multiplyBy(1 + p),
		    //// TODO: Somehow refactor this out into map.something() - the code is
		    ////   pretty much the same as in GridLayer.
		    clip = new L.Bounds([
		        map.containerPointToLayerPoint([padMin.x, padMin.y]).floor(),
		        map.containerPointToLayerPoint([padMin.x, padMax.y]).floor(),
		        map.containerPointToLayerPoint([padMax.x, padMin.y]).floor(),
		        map.containerPointToLayerPoint([padMax.x, padMax.y]).floor()
		    ]);
			//min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

		this._bounds = clip;
		this._topLeft = this._map.layerPointToLatLng(clip.min);

		this._center = this._map.getCenter();
		this._zoom = this._map.getZoom();
	}
});


L.Map.include({
	// @namespace Map; @method getRenderer(layer: Path): Renderer
	// Returns the instance of `Renderer` that should be used to render the given
	// `Path`. It will ensure that the `renderer` options of the map and paths
	// are respected, and that the renderers do exist on the map.
	getRenderer: function (layer) {
		// @namespace Path; @option renderer: Renderer
		// Use this specific instance of `Renderer` for this path. Takes
		// precedence over the map's [default renderer](#map-renderer).
		var renderer = layer.options.renderer || this._getPaneRenderer(layer.options.pane) || this.options.renderer || this._renderer;

		if (!renderer) {
			// @namespace Map; @option preferCanvas: Boolean = false
			// Whether `Path`s should be rendered on a `Canvas` renderer.
			// By default, all `Path`s are rendered in a `SVG` renderer.
			renderer = this._renderer = (this.options.preferCanvas && L.canvas()) || L.svg();
		}

		if (!this.hasLayer(renderer)) {
			this.addLayer(renderer);
		}
		return renderer;
	},

	_getPaneRenderer: function (name) {
		if (name === 'overlayPane' || name === undefined) {
			return false;
		}

		var renderer = this._paneRenderers[name];
		if (renderer === undefined) {
			renderer = (L.SVG && L.svg({pane: name})) || (L.Canvas && L.canvas({pane: name}));
			this._paneRenderers[name] = renderer;
		}
		return renderer;
	}
});

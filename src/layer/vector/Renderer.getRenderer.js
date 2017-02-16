import {Map} from '../../map/Map';
import {Canvas, canvas} from './Canvas';
import {SVG, svg} from './SVG';

Map.include({
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
			renderer = this._renderer = (this.options.preferCanvas && canvas()) || svg();
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
			renderer = (SVG && svg({pane: name})) || (Canvas && canvas({pane: name}));
			this._paneRenderers[name] = renderer;
		}
		return renderer;
	}
});

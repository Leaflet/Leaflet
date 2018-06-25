---
layout: tutorial_v2
title: Extending Leaflet, New Layers
---

<br>

This tutorial assumes you've read the [theory of Leaflet class inheritance](./extending-1-classes.html).

In Leaflet, a "layer" is anything that moves around when the map is moved around. Before seeing how to create them from scratch, it's easier to explain how to do simple extensions.

## "Extension methods"

A few of the Leaflet classes have so-called "extension methods": entry points for writing code for sub-classes.

One of them is `L.TileLayer.getTileUrl()`. This method is called internally by `L.TileLayer` whenever a new tile needs to know which image to load. By making a subclass of `L.TileLayer` and rewriting its `getTileUrl()` function, we can create custom behaviour.

Let's illustrate with a custom `L.TileLayer` that will display random kitten images from [PlaceKitten]():

    L.TileLayer.Kitten = L.TileLayer.extend({
        getTileUrl: function(coords) {
            var i = Math.ceil( Math.random() * 4 );
            return "https://placekitten.com/256/256?image=" + i;
        },
        getAttribution: function() {
            return "<a href='https://placekitten.com/attribution.html'>PlaceKitten</a>"
        }
    });

    L.tileLayer.kitten = function() {
        return new L.TileLayer.Kitten();
    }

    L.tileLayer.kitten().addTo(map);

{% include frame.html url="kittenlayer.html" %}

Normally, `getTileLayer()` receives the tile coordinates (as `coords.x`, `coords.y` and `coords.z`) and generates a tile URL from them. In our example, we ignore those and simply use a random number to get a different kitten every time.

### Splitting away the plugin code

In the previous example, `L.TileLayer.Kitten` is defined in the same place as it's used. For plugins, it's better to split the plugin code into its own file, and include that file when it's used.

For the KittenLayer, you should create a file like `L.KittenLayer.js` with:

    L.TileLayer.Kitten = L.TileLayer.extend({
        getTileUrl: function(coords) {
            var i = Math.ceil( Math.random() * 4 );
            return "https://placekitten.com/256/256?image=" + i;
        },
        getAttribution: function() {
            return "<a href='https://placekitten.com/attribution.html'>PlaceKitten</a>"
        }
    });

And then, include that file when showing a map:

	<html>
	…
	<script src='leaflet.js'>
	<script src='L.KittenLayer.js'>
	<script>
		var map = L.map('map-div-id');
		L.tileLayer.kitten().addTo(map);
	</script>
	…


### `L.GridLayer` and DOM elements

Another extension method is `L.GridLayer.createTile()`. Where `L.TileLayer` assumes that there is a grid of images (as `<img>` elements), `L.GridLayer` doesn't assume that - it allows creating grids of any kind of [HTML Elements](https://developer.mozilla.org/en-US/docs/Web/HTML/Element).

`L.GridLayer` allows creating grids of `<img>`s, but grids of [`<div>`s](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/div), [`<canvas>`es](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas) or [`<picture>`s](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/picture) (or anything) are possible. `createTile()` just has to return an instance of [`HTMLElement`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement) given the tile coordinates. Knowing how to manipulate elements in the [DOM](https://developer.mozilla.org/en-US/docs/Web/API/Document_Object_Model/Introduction) is important here: Leaflet expects instances of `HTMLElement`, so elements created with libraries like jQuery will be problematic.

An example of a custom `GridLayer` is showing the tile coordinates in a `<div>`. This is particularly useful when debugging the internals of Leaflet, and for understanding how the tile coordinates work:

	L.GridLayer.DebugCoords = L.GridLayer.extend({
		createTile: function (coords) {
			var tile = document.createElement('div');
			tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
			tile.style.outline = '1px solid red';
			return tile;
		}
	});

	L.gridLayer.debugCoords = function(opts) {
		return new L.GridLayer.DebugCoords(opts);
	};

	map.addLayer( L.gridLayer.debugCoords() );


If the element has to do some asynchronous initialization, then use the second function parameter `done` and call it back when the tile is ready (for example, when an image has been fully loaded) or when there is an error. In here, we'll just delay the tiles artificially:

	createTile: function (coords, done) {
		var tile = document.createElement('div');
		tile.innerHTML = [coords.x, coords.y, coords.z].join(', ');
		tile.style.outline = '1px solid red';

		setTimeout(function () {
			done(null, tile);	// Syntax is 'done(error, tile)'
		}, 500 + Math.random() * 1500);

		return tile;
	}

{% include frame.html url="gridcoords.html" %}

With these custom `GridLayer`s, a plugin can have full control of the HTML elements that make up the grid. A few plugins already use `<canvas>`es in this way to do advanced rendering.

A very basic `<canvas>` `GridLayer` looks like:

	L.GridLayer.CanvasCircles = L.GridLayer.extend({
		createTile: function (coords) {
			var tile = document.createElement('canvas');

			var tileSize = this.getTileSize();
			tile.setAttribute('width', tileSize.x);
			tile.setAttribute('height', tileSize.y);

			var ctx = tile.getContext('2d');

			// Draw whatever is needed in the canvas context
			// For example, circles which get bigger as we zoom in
			ctx.beginPath();
			ctx.arc(tileSize.x/2, tileSize.x/2, 4 + coords.z*4, 0, 2*Math.PI, false);
			ctx.fill();

			return tile;
		}
	});

{% include frame.html url="canvascircles.html" %}


## The pixel origin

Creating custom `L.Layer`s is possible, but needs a deeper knowledge of how Leaflet positions HTML elements. The abridged version is:

* The `L.Map` container has "map panes", which are `<div>`s.
* `L.Layer`s are HTML elements inside a map pane
* The map transforms all `LatLng`s to coordinates in the map's CRS, and from that into absolute "pixel coordinates" (the origin of the CRS is the same as the origin of the pixel coordinates)
* When the `L.Map` is ready (has a center `LatLng` and a zoom level), the absolute pixel coordinates of the top-left corner become the "pixel origin"
* Each `L.Layer` is offset from its map pane according to the pixel origin and the absolute pixel coordinates of the layer's `LatLng`s
* The pixel origin is reset after each `zoomend` or `viewreset` event on the `L.Map`, and every `L.Layer` has to recalculate its position (if needed)
* The pixel origin is *not* reset when panning the map around; instead, the whole panes are repositioned.

This might be a bit overwhelming, so consider the following explanatory map:

{% include frame.html url="pixelorigin.html" %}

The CRS origin (green) stays in the same `LatLng`. The pixel origin (red) always starts at the top-left corner. The pixel origin moves around when the map is panned (map panes are repositioned relative to the map's container), and stays in the same place in the screen when zooming (map panes are *not* repositioned, but layers might redraw themselves). The absolute pixel coordinate to the pixel origin is updated when zooming, but is not updated when panning. Note how the absolute pixel coordinates (the distance to the green bracket) double every time the map is zoomed in.

To position anything (for example, a blue `L.Marker`), its `LatLng` is converted to an absolute pixel coordinate inside the map's `L.CRS`. Then the absolute pixel coordinate of the pixel origin is subtracted from its absolute pixel coordinate, giving an offset relative to the pixel origin (light blue). As the pixel origin is the top-left corner of all map panes, this offset can be applied to the HTML element of the marker's icon. The marker's `iconAnchor` (dark blue line) is achieved via negative CSS margins.

The `L.Map.project()` and `L.Map.unproject()` methods operate with these absolute pixel coordinates. Likewise, `L.Map.latLngToLayerPoint()` and `L.Map.layerPointToLatLng()` work with the offset relative to the pixel origin.

Different layers apply these calculations in different ways. `L.Marker`s simply reposition their icons; `L.GridLayer`s calculate the bounds of the map (in absolute pixel coordinates) and then calculate the list of tile coordinates to request; vector layers (polylines, polygons, circle markers, etc) transform each `LatLng` to pixels and draw the geometries using SVG or `<canvas>`.


### `onAdd` and `onRemove`

At their core, all `L.Layer`s are HTML elements inside a map pane, their positions and contents defined by the layer's code. However, HTML elements cannot be created when a layer is instantiated; rather, this is done when the layer is added to the map - the layer doesn't know about the map (or even about the `document`) until then.

In other words: the map calls the `onAdd()` method of the layer, then the layer creates its HTML element(s) (commonly named 'container' element) and adds them to the map pane. Conversely, when the layer is removed from the map, its `onRemove()` method is called. The layer must update its contents when added to the map, and reposition them when the map view is updated. A layer skeleton looks like:

	L.CustomLayer = L.Layer.extend({
		onAdd: function(map) {
			var pane = map.getPane(this.options.pane);
			this._container = L.DomUtil.create(…);

			pane.appendChild(this._container);

			// Calculate initial position of container with `L.Map.latLngToLayerPoint()`, `getPixelOrigin()` and/or `getPixelBounds()`

			L.DomUtil.setPosition(this._container, point);

			// Add and position children elements if needed

			map.on('zoomend viewreset', this._update, this);
		},

		onRemove: function(map) {
			L.DomUtil.remove(this._container);
			map.off('zoomend viewreset', this._update, this);
		},

		_update: function() {
			// Recalculate position of container

			L.DomUtil.setPosition(this._container, point);        

			// Add/remove/reposition children elements if needed
		}
	});

How to exactly position the HTML elements for a layer depends on the specifics of the layer, but this introduction should help you to read Leaflet's layer code, and create new layers.

### Using the parent's `onAdd`

Some use cases don't need the whole `onAdd` code to be recreated, but instead the code for the parent can be reused, then some specifics can be added before _or_ after that initialization (as needed).

To give an example, we can have a subclass of `L.Polyline` that will always be red (ignoring the options), like:

	L.Polyline.Red = L.Polyline.extend({
		onAdd: function(map) {
			this.options.color = 'red';
			L.Polyline.prototype.onAdd.call(this, map);
		}
	});

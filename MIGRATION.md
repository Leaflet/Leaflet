# Migrating from Leaflet 1.x to 2.0

Leaflet 2.0 is published as ES modules, uses classes instead of factory functions, and handles input with Pointer
Events. Your maps, layers, options and most method calls work as before. The changes are in how you load Leaflet and
create objects, plus a set of smaller renames and removals.

Most changes are loud. A removed API throws an error or logs one console message that says what to use instead, so
running your app finds most of what's left to fix. Changes that give no error are marked **Silent**, so check
those by hand.

Leaflet 2.0 supports [Baseline 2022](https://web.dev/baseline) browsers (Safari 15.4+). Internet Explorer and other
legacy browsers are no longer supported.

The guide has two parts:

- [Part 1, upgrading an app](#part-1-upgrading-an-app), with the most common changes first.
- [Part 2, plugins and extensions](#part-2-plugins-and-extensions), for code that subclasses Leaflet or uses its
  internals.

## Part 1: Upgrading an app

### 1. Load Leaflet as a module

`dist/leaflet.js` is now an ES module, so a plain `<script>` tag fails with a syntax error. Use an import map with a
module script:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@2.0.0-beta.1/dist/leaflet.css">

<script type="importmap">
	{"imports": {"leaflet": "https://cdn.jsdelivr.net/npm/leaflet@2.0.0-beta.1/dist/leaflet.js"}}
</script>

<script type="module">
	import {LeafletMap, TileLayer, Marker} from 'leaflet';

	const map = new LeafletMap('map').setView([51.505, -0.09], 13);
	new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {maxZoom: 19}).addTo(map);
	new Marker([51.5, -0.09]).addTo(map);
</script>
```

Variables in a module script aren't global. If other scripts on the page need the map, assign it to `window` yourself.

If you'd rather keep a global `L`, use `dist/leaflet-global.js` with a regular script tag. It mirrors the module
exports, so the rest of this guide still applies (`new L.Marker(...)`, `L.ZoomControl`). It no longer supports AMD,
CommonJS or `L.noConflict()`.

With a bundler, the package no longer has a default export:

```js
// 1.x
import L from 'leaflet';

// 2.0
import * as L from 'leaflet'; // or named imports: import {LeafletMap, Marker} from 'leaflet';
```

`import 'leaflet/dist/leaflet.css'` works as before. Other deep imports, from `leaflet/src/...` or
`leaflet/dist/...`, no longer resolve.

The ES module doesn't define a global `L`. Plugins that expect `window.L` need a version that supports Leaflet 2, or
the global build.

### 2. Replace factory functions with `new`

The lowercase factory functions are gone. Call the class constructor instead:

```js
// 1.x
const map = L.map('map');
L.marker([51.5, -0.09]).bindPopup('Hi').addTo(map);
L.control.layers(baseLayers, overlays).addTo(map);

// 2.0
const map = new LeafletMap('map');
new Marker([51.5, -0.09]).bindPopup('Hi').addTo(map);
new LayersControl(baseLayers, overlays).addTo(map);
```

Most factories become the capitalized class name: `L.tileLayer` → `TileLayer`, `L.geoJSON` → `GeoJSON`,
`L.latLng` → `LatLng`. The exceptions are the nested names in the next section, and `L.map`, which becomes
`LeafletMap`.

`Map` is exported too, but importing it shadows JavaScript's built-in `Map` in that module, so the docs use
`LeafletMap`. With the global build, `new L.Map(...)` is fine.

Factories passed `null` through (`L.latLng(null)` returned `null`), but `new LatLng(null)` and `new Point(null)`
throw. Check with `LatLng.validate()` first if the input can be missing.

### 3. Use the flat class names

Classes that were nested under another class are now top-level exports with their own names:

| 1.x | 2.0 |
|---|---|
| `Control.Zoom`, `Control.Attribution`, `Control.Layers`, `Control.Scale` | `ZoomControl`, `AttributionControl`, `LayersControl`, `ScaleControl` |
| `TileLayer.WMS` (`L.tileLayer.wms`) | `WMSTileLayer` |
| `Icon.Default` | `DefaultIcon` |
| `CRS.EPSG3857`, `CRS.EPSG3395`, `CRS.EPSG4326`, `CRS.EPSG900913` | `EPSG3857`, `EPSG3395`, `EPSG4326`, `EPSG900913` |
| `CRS.Simple`, `CRS.Earth` | `SimpleCRS`, `EarthCRS` |
| `Projection.LonLat`, `Projection.Mercator`, `Projection.SphericalMercator` | `LonLatProjection`, `MercatorProjection`, `SphericalMercatorProjection` |
| `Map.BoxZoom`, `Map.DoubleClickZoom`, `Map.Drag`, `Map.Keyboard`, `Map.ScrollWheelZoom`, `Map.TapHold`, `Map.TouchZoom` | `BoxZoomHandler`, `DoubleClickZoomHandler`, `DragHandler`, `KeyboardHandler`, `ScrollWheelZoomHandler`, `TapHoldHandler`, `PinchZoomHandler` |

```js
// 1.x
const map = L.map('map', {crs: L.CRS.Simple});
L.control.scale().addTo(map);

// 2.0
const map = new LeafletMap('map', {crs: SimpleCRS});
new ScaleControl().addTo(map);
```

### 4. Use pointer events instead of mouse events

Leaflet listens to [Pointer Events](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_events), which cover
mouse, touch and pen with one set of events. The `mouse*` events on the map and layers are renamed:

| 1.x | 2.0 |
|---|---|
| `mousedown`, `mouseup`, `mousemove` | `pointerdown`, `pointerup`, `pointermove` |
| `mouseover`, `mouseout` | `pointerover`, `pointerout` |
| `keypress` | `keydown` |

`click`, `dblclick` and `contextmenu` don't change.

```js
// 1.x
layer.on({mouseover: highlight, mouseout: reset});

// 2.0
layer.on({pointerover: highlight, pointerout: reset});
```

Listening to a removed event logs an error once, and the listener never runs.

**Silent:** pointer events fire for touch and pen too. For example, `pointermove` fires while a finger drags the
map, while `mousemove` didn't. If a handler is meant for the mouse only, check `e.originalEvent.pointerType`.

A few related renames:

- `map.mouseEventToContainerPoint`, `mouseEventToLayerPoint` and `mouseEventToLatLng` → `pointerEventTo...`.
- `DomEvent.getMousePosition` → `DomEvent.getPointerPosition`.
- The `bubblingMouseEvents` option → `bubblingPointerEvents`. The old name still works.
- The `touchZoom` map option and handler → `pinchZoom`. The old name still works and logs a warning.

### 5. Delete your default marker icon workaround

The default marker is now an inline SVG and works with any bundler or CDN as is. The common 1.x fix for broken marker
images breaks in 2.0, because the image files and `Icon.Default` are gone. Delete it:

```js
// 1.x: delete all of this
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({iconUrl, iconRetinaUrl, shadowUrl});
L.Marker.prototype.options.icon = L.icon({...});
```

The same goes for `L.Icon.Default.imagePath = ...` and the
[leaflet-defaulticon-compatibility](https://github.com/ghybs/leaflet-defaulticon-compatibility) plugin. To use your
own icon for all markers, see [section 6](#6-change-defaults-with-mergeoptions).

Other changes to the default icon:

- Pass `color` to get a different pin color: `new Marker(latlng, {icon: new DefaultIcon({color: 'crimson'})})`.
- Markers can be rotated with the `rotation` option (in degrees) and `setRotation()`. If you use
  leaflet-rotatedmarker, replace its `rotationAngle` option with `rotation`. **Silent:** the plugin doesn't work on
  2.0, so `rotationAngle` does nothing.
- **Silent:** the shadow is part of the icon image, so the icon is 25×46 pixels instead of 25×41 and there's no
  separate shadow image. If you pass your own 25×41 images to `DefaultIcon`, also pass `iconSize: [25, 41]` and
  `shadowUrl`, or use `Icon`.

### 6. Change defaults with `mergeOptions`

Classes keep their default options in a static `defaultOptions` property instead of `prototype.options`, so code
that sets defaults on the prototype throws a "Cannot set properties of undefined" error:

```js
// 1.x
L.Marker.prototype.options.icon = myIcon;

// 2.0
Marker.mergeOptions({icon: myIcon});
```

`mergeOptions` also works in 1.x.

### 7. Write custom classes as ES classes

`L.Class.extend()` and `L.Control.extend()` are gone, and so is `initialize()`. Write a class that extends the Leaflet
class, put defaults in `static defaultOptions`, and put setup code in `constructor()` after `super()`:

```js
// 1.x
const InfoControl = L.Control.extend({
	options: {position: 'topright'},

	initialize(title, options) {
		this._title = title;
		L.setOptions(this, options);
	},

	onAdd(map) {
		const div = L.DomUtil.create('div', 'info');
		div.textContent = this._title;
		return div;
	}
});

// 2.0
class InfoControl extends Control {
	static defaultOptions = {position: 'topright'};

	constructor(title, options) {
		super(options);
		this._title = title;
	}

	onAdd(map) {
		const div = DomUtil.create('div', 'info');
		div.textContent = this._title;
		return div;
	}
}
```

The defaults in `static defaultOptions` are merged with the parent's defaults, as `options` were in 1.x. A class
with an `initialize()` method throws when constructed, with a message to rename it.

If the class was created with `extend` in code you don't control, such as an old plugin, that plugin needs a version
that supports Leaflet 2.

### 8. Use the platform instead of removed utilities

Utilities with native equivalents are removed. Most are one-line replacements:

| 1.x | 2.0 |
|---|---|
| `L.extend(a, b)`, `Util.extend(a, b)` | `Object.assign(a, b)` |
| `L.bind(fn, obj)`, `Util.bind(fn, obj)` | `fn.bind(obj)` |
| `L.stamp(obj)`, `L.setOptions(obj, options)` | `Util.stamp(obj)`, `Util.setOptions(obj, options)` |
| `Util.create(proto)` | `Object.create(proto)` |
| `Util.isArray(a)` | `Array.isArray(a)` |
| `Util.indexOf(arr, x)` | `arr.indexOf(x)` |
| `Util.trim(str)` | `str.trim()` |
| `Util.getParamString(obj)` | `'?' + new URLSearchParams(obj)` |
| `Util.requestAnimFrame(fn)`, `Util.cancelAnimFrame(id)` | `requestAnimationFrame(fn)`, `cancelAnimationFrame(id)` |
| `Util.emptyImageUrl` | `'data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs='` |
| `DomUtil.addClass(el, name)`, `removeClass`, `hasClass` | `el.classList.add(name)`, `remove`, `contains` |
| `DomUtil.setClass(el, name)`, `getClass(el)` | `el.setAttribute('class', name)`, `el.getAttribute('class')` |
| `DomUtil.remove(el)` | `el.remove()` |
| `DomUtil.empty(el)` | `el.replaceChildren()` |
| `DomUtil.setOpacity(el, value)` | `el.style.opacity = value` |
| `DomUtil.getStyle(el, prop)` | `getComputedStyle(el)[prop]` |
| `DomUtil.TRANSFORM`, `TRANSITION`, `TRANSITION_END` | `'transform'`, `'transition'`, `'transitionend'` |
| `DomUtil.disableTextSelection()`, `enableTextSelection()` | `user-select: none` in CSS |
| `DomEvent.addListener`, `removeListener` | `DomEvent.on`, `DomEvent.off` |
| `DomEvent.getPropagationPath(e)` | `e.composedPath()` |
| `layer.addEventListener`, `removeEventListener`, `addOneTimeEventListener`, `fireEvent`, `hasEventListeners` | `layer.on`, `off`, `once`, `fire`, `listens` |
| `layerGroup.invoke('method', arg)` | `layerGroup.eachLayer(l => l.method(arg))` |

The `Browser` namespace is removed too. Detect what you need directly:

| 1.x | 2.0 |
|---|---|
| `Browser.mobile` | `matchMedia('(pointer: coarse)').matches` |
| `Browser.retina` | `devicePixelRatio > 1` |
| `Browser.touch`, `Browser.pointer` | always `true` |
| `Browser.ie`, `webkit`, `android`, `safari` and other engine flags | feature detection, or remove the branch |

The `leaflet-safari` CSS class and the `L_NO_TOUCH` and `L_DISABLE_3D` globals are gone as well.

### 9. Smaller changes

Map and layer options:

- `preferCanvas: true` is removed and logs an error. Use `renderer: new Canvas()` instead.
- A circle no longer takes the radius as the second argument, and passing it there throws. `L.circle(latlng, 200)`
  becomes `new Circle(latlng, {radius: 200})`.
- **Silent:** `aria-keyshortcuts` is no longer set on the map container, because it only matched US keyboards. Set
  `ariaKeyShortcuts: true` to bring it back, or pass a string for other layouts.
- **Silent:** with `detectRetina` on a retina screen, `minNativeZoom` and `maxNativeZoom` now request the right
  zoom level from the server. If you added 1 to them to work around this, remove it.

Events and input, all **Silent**:

- Enter and Space fire `click` on a focused marker, so `click` listeners also run from the keyboard.
- The `<canvas>` of a canvas renderer has `pointer-events: none`, and the map finds the path under the pointer itself.
  Paths, markers and overlays below a canvas now get events, but DOM listeners added to the canvas element no longer
  fire. Listen on the layers or the map instead.
- `DomEvent.on(el, 'dblclick', ...)` no longer simulates double taps in iOS Safari, which doesn't fire `dblclick` on
  touch. The map still simulates them for everything inside it.

Return values and methods, all **Silent**:

- The GeoJSON `filter` and `onEachFeature` callbacks get a Feature when the input is a bare geometry (the same object
  as `layer.feature`), and features with a `null` geometry are skipped.
- `latLngToLayerPoint` and `latLngToContainerPoint` return fractional pixel values. Round them if you need integers.
- `setView(center, zoom, true)` no longer forces a view reset. Use `setView(center, zoom, {reset: true})`.
- `closeTooltip()` returns the layer instead of the tooltip, and `isTooltipOpen()` returns `false` instead of
  `undefined` when no tooltip is bound.
- Popups and tooltips are no longer `instanceof Layer`. They still work with `addTo()`,
  `openOn()` and `map.addLayer()`.

CSS and DOM, all **Silent**:

- The `leaflet-dragging` class is set on the map container instead of `<body>`. CSS like
  `body.leaflet-dragging .sidebar` no longer matches. Use the `dragstart` and `dragend` events, or
  `map.dragging.moving()`.
- Text inside the map is no longer selectable, except in popups and controls. If you put text in custom panes or in
  controls placed elsewhere on the page, set `user-select: text` on it.
- Tiles no longer have `filter: inherit` in the CSS. Page-wide rules like `img {filter: ...}` now apply to tiles, and
  a filter on a tile container is no longer applied twice.
- The map container has `isolation: isolate`, so `z-index` inside the map only orders things within the map. Dropdowns
  and dialogs on the page no longer end up under map panes and controls, but a pane or control can't be raised above
  page elements either. To put the whole map on top, set `z-index` on the map container.
- The layers control list is a `<fieldset>` instead of a `<section>`. Update CSS that targets it by tag.

Defaults that changed:

| Option | 1.x | 2.0 |
|---|---|---|
| `smoothFactor` (polylines and polygons) | `1` | `0.5` |
| `inertiaMaxSpeed` | `Infinity` | `1400` |
| `referrerPolicy` (tile layers) | `false` | `'strict-origin-when-cross-origin'` |
| `tapHold` | on in iOS Safari only | on |

### 10. TypeScript

Leaflet now ships its own types, so uninstall `@types/leaflet`. TypeScript uses the package's types once they're
there, and they differ from `@types/leaflet` in a few ways:

- Type names are flat like the classes: `Control.LayersOptions` → `LayersControlOptions`, `TileLayer.WMSOptions` →
  `WMSTileLayerOptions`.
- `LeafletMouseEvent` → `LeafletPointerEvent`. `LeafletEventHandlerFnMap` is gone: each class has its own event
  map, and `on()` infers the event type from the event name.
- Generic parameters are options and events, not GeoJSON properties. Instead of `GeoJSON<MyProps>`, type the
  callback parameter: `onEachFeature(feature: Feature<Point, MyProps>, layer)`. Groups take the member type first:
  `LayerGroup<Marker>`.
- Events that bubble up to a group still have the 1.x `layer` property at runtime, but it isn't typed. Use
  `e.propagatedFrom` instead.
- There's no global `L` namespace for script-tag code checked with `// @ts-check`.
- Types are stricter in places. For example, `getPopup()` can return `undefined`, and `getPixelWorldBounds()` can
  return `null`.

Typings for plugins (`@types/leaflet.*`) were written against `@types/leaflet`, so they may not compile until they're
updated.

## Part 2: Plugins and extensions

This part covers code that subclasses Leaflet classes, adds hooks or uses its internals. Everything in Part 1 applies
too, especially [sections 7](#7-write-custom-classes-as-es-classes) and
[8](#8-use-the-platform-instead-of-removed-utilities).

### 11. Support 1.x and 2.0 from one release

ES classes can extend the 1.x classes too, so a plugin can support both versions:

```js
import * as L from 'leaflet';

class MyLayer extends L.Layer {
	constructor(options) {
		super();
		L.Util.setOptions(this, options);
	}
}

// 1.x keeps defaults on the prototype, and without a copy of its own,
// mergeOptions would change the defaults of every L.Layer
if (L.version.startsWith('1.')) {
	MyLayer.prototype.options = Object.create(L.Layer.prototype.options);
}
MyLayer.mergeOptions({opacity: 0.5});
```

1. Use `class X extends L.Layer` with a `constructor()`, not `extend` or `initialize`. `Layer` doesn't apply options
   passed to `super()` in either version, so call `L.Util.setOptions(this, options)` yourself, as 1.x `initialize`
   methods did. Classes like `Control` and `Marker` take options in `super()` in both versions.
2. Set defaults with `X.mergeOptions({...})` after the class, after giving it its own `prototype.options` on 1.x as
   above. `static defaultOptions` is the 2.0 way, but 1.x doesn't read it.
3. Reach renamed classes through the namespace, `import * as L from 'leaflet'`, and fall back:
   `L.ZoomControl ?? L.Control.Zoom`. A static import of a flat name fails on 1.x.
4. Use `new` instead of factories. It works on both versions.
5. Pick event names by version (`L.version.startsWith('1.')`) instead of listening to both `mouse*` and `pointer*`.

Declare both versions in `peerDependencies`: `"leaflet": "^1.9.0 || ^2.0.0-beta.1"`. A plain `^2.0.0` doesn't match
the betas, so npm refuses to install the plugin next to one.

On 1.x, `addInitHook` on an ES class adds the hook to its parent, so it runs for every `L.Layer`. Only add hooks to
your own classes on 2.0.

`include()`, `mergeOptions()` and `addInitHook()` keep their 1.x signatures. `setDefaultOptions()`, added in the 2.0
alphas, is a deprecated alias of `mergeOptions()`.

### 12. Init hooks run after the whole constructor

Hooks added with `addInitHook` run once per instance, after the constructors of Leaflet's own classes have
finished. A hook on `Layer` sees a fully built `Polygon`, as in 1.x.

For a class of your own that extends a Leaflet class, hooks run before the body of your constructor. If other
code adds hooks to your class and they need its fields, mark the class with `static initHooks = true` and end its
constructor with `this.callInitHooks()`.

### 13. Removed internals

- `Class.__super__` is gone; use `super` or `Object.getPrototypeOf()`.
- `L.Mixin.Events` is gone; extend `Evented`.
- `LineUtil._flat` and `Polyline._flat` → `LineUtil.isFlat`.
- `Draggable` takes `(element, dragHandle, options)`. The third argument used to be `preventOutline`, and passing a
  boolean there throws. `DomUtil.preventOutline` and `restoreOutline` are gone; focus outlines use
  `:focus-visible`.
- `PosAnimation` is no longer exported.
- `DomEvent.PointerEvents`, `getWheelPxFactor` and `isExternalTarget` are gone. Pointer tracking is internal, and
  `Draggable` works outside a map without setup.
- `DomEvent` functions return nothing, so they can't be chained.
- `DomUtil.setPosition` stores positions in a `WeakMap` instead of the `_leaflet_pos` property. Read them with
  `DomUtil.getPosition`.
- The `_leaflet_events`, `_leaflet_disable_click`, `_leaflet_disable_events`, `_stopped` and
  `_leaflet_focus_handler` properties are no longer set on elements and events. Use
  `DomEvent.disableClickPropagation` and `DomEvent.stopPropagation`.
- `KeyboardHandler.keyCodes` → `KeyboardHandler.keys`, which holds `KeyboardEvent.key` values instead of key codes.
- `LayersControl.onRemove` takes `map`, like `onAdd`, and `collapse()` takes no event.
- `Canvas` no longer handles pointer events itself, so `_onClick`, `_onPointerMove`, `_handlePointerHover`,
  `_handlePointerOut` and `_fireEvent` are gone. The map calls `_layerAt(e, click)` on each canvas renderer to find
  the path under the pointer, so override that to customize hit-testing.
- `openPopup()` without a `latlng` throws on a layer that has `_latlng` but no `getLatLng()`, `getCenter()` or
  `getBounds()`.

### 14. Types for plugins

Augment the `leaflet` module to add members to Leaflet classes:

```ts
declare module 'leaflet' {
	interface Map {
		editTools?: EditTools;
	}
}
```

Augment `Map`, not `LeafletMap`. Augmenting both loses one of them. A layer whose `getEvents()` adds its own map
events should add them to `MapEventMap`.

Subclasses pass their options and events as generic parameters: `class MyGroup extends FeatureGroup<Layer, MyOptions>`.

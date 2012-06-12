Leaflet Changelog
=================

(all changes without author notice are by [@mourner](https://github.com/mourner))

## 0.4 (master)

An in-progress version being developed on the master branch.

### Notable new features

 * Added configurable **panning inertia** - after a quick pan, the map slows down in the same direction.
 * Added **polyline and polygon editing**. [#174](https://github.com/CloudMade/Leaflet/issues/174)
 * Added an unobtrusive **scale control**.
 * Added `DivIcon` class that easily allows you to create lightweight div-based markers.
 * Added `Rectangle` vector layer (by [@JasonSanford](https://github.com/JasonSanford)). [#504](https://github.com/CloudMade/Leaflet/pull/504)

### Improvements

#### Usability improvements

 * Drag-panning now works even when there are markers in the starting point (helps on maps with lots of markers). [#506](https://github.com/CloudMade/Leaflet/issues/506)
 * Improved panning performance even more (there are no wasted frames now).
 * Replaced box-shadow with border on controls for mobile devices to improve performance.
 * Slightly improved default popup styling.
 * Added `TileLayer` `detectRetina` option (`false` by default) that makes tiles show in a higher resolution on iOS retina displays (by [Mithgol](https://github.com/Mithgol)). [#586](https://github.com/CloudMade/Leaflet/pull/586)

#### Breaking API changes

 * Converted `Icon` properties (like `iconUrl`) to options, changed constructor signature to `Icon(options)`.
 * Moved default marker icon options to `L.Icon.Default` class (which extends from `L.Icon`).
 * Improved `TileLayer` constructor to interpolate URL template values from options (removed third `urlParams` argument).
 * Replaced ugly control position constants (e.g. L.Control.Position.TOP_LEFT) with light strings ('topleft', 'bottomright', etc.)
 * Removed `Map` `locateAndSetView` method (use `locate` with `setView: true` option)
 * Changed popup `minWidth` and `maxWidth` options to be applied to content element, not the whole popup.
 * Moved `prefix` argument to `options` in `Control.Attribution` constructor.
 * Renamed `L.VERSION` to `L.version`.

#### Other API improvements

 * Added `Icon` `className` option to assign a custom class to an icon.
 * Added `Icon` `shadowOffset` option to set the position of shadow relative to the icon.
 * Made all `Icon` options except `iconUrl` optional (if not specified, they'll be chosen automatically or implemented using CSS). Anchor is centered by default (if size is specified), and otherwise can be set through CSS using negative margins.
 * Moved all default marker icon options from `L.Icon` to `L.Icon.Default`.
 * Added `originalEvent` property to `MouseEvent` (by [@k4](https://github.com/k4)). [#521](https://github.com/CloudMade/Leaflet/pull/521)
 * Added `Circle` `getBounds` method. [#440](https://github.com/CloudMade/Leaflet/issues/440)
 * Added `Circle` `getLatLng` and `getRadius` methods (by [Guiswa](https://github.com/Guiswa)). [#655](https://github.com/CloudMade/Leaflet/pull/655)
 * Added `Map` `getContainer` method (by [Guiswa](https://github.com/Guiswa)). [#654](https://github.com/CloudMade/Leaflet/pull/654)
 * Added `Marker` `opacity` option.
 * Added public `redraw` method to vector layers (useful if you manipulate their `LatLng` points directly).
 * Added `setPosition` and `getPosition` to all controls, as well as ability to pass certain position as an option when creating a control.
 * Added `Popup` `maxHeight` option that makes content inside the popup scrolled if it doesn't fit the specified max height.
 * Made controls implementation easier (now more magic happens under the hood).
 * Added `Map` `containerPointToLatLng` and `latLngToContainerPoint` methods. [#474](https://github.com/CloudMade/Leaflet/issues/474)
 * Added `containerPoint` property to `MouseEvent`. [#413](https://github.com/CloudMade/Leaflet/issues/413)
 * Added `LatLngBounds` `pad` method that returns bounds extended by a percentage (by [@jacobtoye](https://github.com/jacobtoye)). [#492](https://github.com/CloudMade/Leaflet/pull/492)
 * Added `contextmenu` event to vector layers (by [@ErrorProne](https://github.com/ErrorProne)). [#500](https://github.com/CloudMade/Leaflet/pull/500)
 * Added chaining to `DomEvent` methods.
 * Added `Map` `addHandler` method.
 * Moved dragging cursor styles from JS code to CSS.
 * Improved `Marker` `openPopup` not to raise an error if it doesn't have a popup. [#507](https://github.com/CloudMade/Leaflet/issues/507)

### Bug fixes

#### General bugfixes

 * Fixed a bug where the map was zooming incorrectly inside a `position: fixed` container (by [chx007](https://github.com/chx007)). [#602](https://github.com/CloudMade/Leaflet/pull/602)
 * Fixed a bug where scaled tiles weren't cleared up after zoom in some cases (by [cfis](https://github.com/cfis)) [#683](https://github.com/CloudMade/Leaflet/pull/683)

#### API bugfixes

 * Fixed a regression where removeLayer would not remove corresponding attribution. [#488](https://github.com/CloudMade/Leaflet/issues/488)
 * Fixed a bug where popup close button wouldn't work on manually added popups. [#423](https://github.com/CloudMade/Leaflet/issues/423)
 * Fixed a bug where `TileLayer.WMS` wouldn't take `insertAtTheBottom` option into account (by [@bmcbride](https://github.com/bmcbride)). [#478](https://github.com/CloudMade/Leaflet/pull/478)
 * Fixed a bug where marker click event would stop working if you dragged it and then disabled dragging. [#434](https://github.com/CloudMade/Leaflet/issues/434)
 * Fixed a bug where `TileLayer` `setOpacity` wouldn't work when setting it back to 1.
 * Fixed a bug where vector layer `setStyle({stroke: false})` wouldn't remove stroke and the same for fill. [#441](https://github.com/CloudMade/Leaflet/issues/441)
 * Fixed a bug where `Marker` `bindPopup` method wouldn't take `offset` option into account.
 * Fixed a bug where `TileLayer` `load` event wasn't fired if some tile didn't load (by [cfis](https://github.com/cfis)) [#682](https://github.com/CloudMade/Leaflet/pull/682)
 * Fixed error when removing `GeoJSON` layer. [#685](https://github.com/CloudMade/Leaflet/issues/685)
 * Fixed error when calling `GeoJSON` `clearLayer` (by [runderwood](https://github.com/runderwood)). [#617](https://github.com/CloudMade/Leaflet/pull/617)
 * Fixed a bug where polygons/polylines sometimes throwed an error when making them editable manually (by [cfis](https://github.com/cfis)). [#669](https://github.com/CloudMade/Leaflet/pull/669)
 * Fixed a bug where `Control` `setPosition` wasn't always working correctly (by [ericmmartinez](https://github.com/ericmmartinez)). [#657](https://github.com/CloudMade/Leaflet/pull/657)
 * Fixed a bug with `Util.bind` sometimes losing arguments (by [johtso](https://github.com/johtso)). [#588](https://github.com/CloudMade/Leaflet/pull/588)

#### Browser bugfixes

 * Fixed inability to use scrolled content inside popup due to mouse wheel propagation.
 * Fixed a bug that caused jumping/stuttering of panning animation in some cases.
 * Fixed a bug where popup size was calculated incorrectly in IE.
 * Fixed a bug where cursor would flicker when dragging a marker.
 * Fixed a bug where clickable paths on IE9 didn't have a hand cursor (by [naehrstoff](https://github.com/naehrstoff)). [#671](https://github.com/CloudMade/Leaflet/pull/671)
 * Fixed a bug in IE with disappearing icons when changing opacity (by [tagliala](https://github.com/tagliala) and [DamonOehlman](https://github.com/DamonOehlman)). [#667](https://github.com/CloudMade/Leaflet/pull/667) [#600](https://github.com/CloudMade/Leaflet/pull/600)
 * Fixed a bug where `Control.Layers` didn't work on IE7. [#652](https://github.com/CloudMade/Leaflet/issues/652)

#### Mobile browser bugfixes

 * Fixed a bug with false map click events on pinch-zoom and zoom/layers controls click. [#485](https://github.com/CloudMade/Leaflet/issues/485)
 * Fixed a bug where touching the map with two or more fingers simultaneously would raise an error.
 * Fixed a bug where zoom control wasn't always visible on Android 3. [#335](https://github.com/CloudMade/Leaflet/issues/335)

## 0.3.1 (February 14, 2012)

 * Fixed a regression where default marker icons wouldn't work if Leaflet include url contained a query string.
 * Fixed a regression where tiles sometimes flickered with black on panning in iOS.

## 0.3 (February 13, 2012)

### Major features

 * Added **Canvas backend** for vector layers (polylines, polygons, circles). This enables vector support on Android < 3, and it can also be optionally preferred over SVG for a performance gain in some cases. Thanks to [@florianf](https://github.com/florianf) for a big part of this work.
 * Added **layers control** (`Control.Layers`) for convenient layer switching.
 * Added ability to set **max bounds** within which users can pan/zoom. [#93](https://github.com/CloudMade/Leaflet/issues/93)

### Improvements

#### Usability improvements

 * Map now preserves its center after resize.
 * When panning to another copy of the world (that's infinite horizontally), map overlays now jump to corresponding positions. [#273](https://github.com/CloudMade/Leaflet/issues/273)
 * Limited maximum zoom change on a single mouse wheel movement (so you won't zoom across the whole zoom range in one scroll). [#149](https://github.com/CloudMade/Leaflet/issues/149)
 * Significantly improved line simplification performance (noticeable when rendering polylines/polygons with tens of thousands of points)
 * Improved circles performance by not drawing them if they're off the clip region.
 * Improved stability of zoom animation (less flickering of tiles).

#### API improvements

 * Added ability to add a tile layer below all others (`map.addLayer(layer, true)`) (useful for switching base tile layers).
 * Added `Map` `zoomstart` event (thanks to [@Fabiz](https://github.com/Fabiz)). [#377](https://github.com/CloudMade/Leaflet/pull/377)
 * Improved `Map` `locate` method, added ability to watch location continuously and more options. [#212](https://github.com/CloudMade/Leaflet/issues/212)
 * Added second argument `inside` to `Map` `getBoundsZoom` method that allows you to get appropriate zoom for the view to fit *inside* the given bounds.
 * Added `hasLayer` method to `Map`.
 * Added `Marker` `zIndexOffset` option to be able to set certain markers below/above others. [#65](https://github.com/CloudMade/Leaflet/issues/65)
 * Added `urlParams` third optional argument to `TileLayer` constructor for convenience: an object with properties that will be evaluated in the URL template.
 * Added `TileLayer` `continuousWorld` option to disable tile coordinates checking/wrapping.
 * Added `TileLayer` `tileunload` event fired when tile gets removed after panning (by [@CodeJosch](https://github.com/CodeJosch)). [#256](https://github.com/CloudMade/Leaflet/pull/256)
 * Added `TileLayer` `zoomOffset` option useful for non-256px tiles (by [@msaspence](https://github.com/msaspence)).
 * Added `TileLayer` `zoomReverse` option to reverse zoom numbering (by [@Majiir](https://github.com/Majiir)). [#406](https://github.com/CloudMade/Leaflet/pull/406)
 * Added `TileLayer.Canvas` `redraw` method (by [@mortenbekditlevsen](https://github.com/mortenbekditlevsen)). [#459](https://github.com/CloudMade/Leaflet/pull/459)
 * Added `Polyline` `closestLayerPoint` method that's can be useful for interaction features (by [@anru](https://github.com/anru)). [#186](https://github.com/CloudMade/Leaflet/pull/186)
 * Added `setLatLngs` method to `MultiPolyline` and `MultiPolygon` (by [@anru](https://github.com/anru)). [#194](https://github.com/CloudMade/Leaflet/pull/194)
 * Added `getBounds` method to `Polyline` and `Polygon` (by [@JasonSanford](https://github.com/JasonSanford)). [#253](https://github.com/CloudMade/Leaflet/pull/253)
 * Added `getBounds` method to `FeatureGroup` (by [@JasonSanford](https://github.com/JasonSanford)). [#557](https://github.com/CloudMade/Leaflet/pull/557)
 * Added `FeatureGroup` `setStyle` method (also inherited by `MultiPolyline` and `MultiPolygon`). [#353](https://github.com/CloudMade/Leaflet/issues/353)
 * Added `FeatureGroup` `invoke` method to call a particular method on all layers of the group with the given arguments.
 * Added `ImageOverlay` `load` event. [#213](https://github.com/CloudMade/Leaflet/issues/213)
 * Added `minWidth` option to `Popup` (by [@marphi](https://github.com/marphi)). [#214](https://github.com/CloudMade/Leaflet/pull/214)
 * Improved `LatLng` constructor to be more tolerant (and throw descriptive error if latitude or longitude can't be interpreted as a number). [#136](https://github.com/CloudMade/Leaflet/issues/136)
 * Added `LatLng` `distanceTo` method (great circle distance) (by [@mortenbekditlevsen](https://github.com/mortenbekditlevsen)). [#462](https://github.com/CloudMade/Leaflet/pull/462)
 * Added `LatLngBounds` `toBBoxString` method for convenience (by [@JasonSanford](https://github.com/JasonSanford)). [#263](https://github.com/CloudMade/Leaflet/pull/263)
 * Added `LatLngBounds` `intersects(otherBounds)` method (thanks to [@pagameba](https://github.com/pagameba)). [#350](https://github.com/CloudMade/Leaflet/pull/350)
 * Made `LatLngBounds` `extend` method to accept other `LatLngBounds` in addition to `LatLng` (by [@JasonSanford](https://github.com/JasonSanford)). [#553](https://github.com/CloudMade/Leaflet/pull/553)
 * Added `Bounds` `intersects(otherBounds)` method. [#461](https://github.com/CloudMade/Leaflet/issues/461)
 * Added `L.Util.template` method for simple string template evaluation.
 * Added `DomUtil.removeClass` method (by [@anru](https://github.com/anru)).
 * Added ability to pass empty imageUrl to icons for creating transparent clickable regions (by [@mortenbekditlevsen](https://github.com/mortenbekditlevsen)). [#460](https://github.com/CloudMade/Leaflet/pull/460)
 * Improved browser-specific code to rely more on feature detection rather than user agent string.
 * Improved superclass access mechanism to work with inheritance chains of 3 or more classes; now you should use `Klass.superclass` instead of `this.superclass` (by [@anru](https://github.com/anru)). [#179](https://github.com/CloudMade/Leaflet/pull/179)
 * Added `Map` `boxzoomstart` and `boxzoomend` events (by [zedd45](https://github.com/zedd45)). [#554](https://github.com/CloudMade/Leaflet/pull/554)
 * Added `Popup` `contentupdate` event (by [mehmeta](https://github.com/mehmeta)). [#548](https://github.com/CloudMade/Leaflet/pull/548)

#### Breaking API changes

 * `shiftDragZoom` map option/property renamed to `boxZoom`.
 * Removed `mouseEventToLatLng` method (bringed back in 0.4).

#### Development workflow improvements

 * Build system completely overhauled to be based on Node.js, Jake, JSHint and UglifyJS.
 * All code is now linted for errors and conformity with a strict code style (with JSHint), and wont build unless the check passes.

### Bugfixes

#### General bugfixes

 * Fixed a bug where `Circle` was rendered with incorrect radius (didn't take projection exagerration into account). [#331](https://github.com/CloudMade/Leaflet/issues/331)
 * Fixed a bug where `Map` `getBounds` would work incorrectly on a date line cross. [#295](https://github.com/CloudMade/Leaflet/issues/295)
 * Fixed a bug where polygons and polylines sometimes rendered incorrectly on some zoom levels. [#381](https://github.com/CloudMade/Leaflet/issues/381)
 * Fixed a bug where fast mouse wheel zoom worked incorrectly when approaching min/max zoom values.
 * Fixed a bug where `GeoJSON` `pointToLayer` option wouldn't work in a `GeometryCollection`. [#391](https://github.com/CloudMade/Leaflet/issues/391)
 * Fixed a bug with incorrect rendering of GeoJSON on a date line cross. [#354](https://github.com/CloudMade/Leaflet/issues/354)
 * Fixed a bug where map panning would stuck forever after releasing the mouse over an iframe or a flash object (thanks to [@sten82](https://github.com/sten82)). [#297](https://github.com/CloudMade/Leaflet/pull/297) [#64](https://github.com/CloudMade/Leaflet/issues/64)
 * Fixed a bug where mouse wheel zoom worked incorrectly if map is inside scrolled container (partially by [@chrillo](https://github.com/chrillo)). [#206](https://github.com/CloudMade/Leaflet/issues/206)
 * Fixed a bug where it was possible to add the same listener twice. [#281](https://github.com/CloudMade/Leaflet/issues/281)
 * Fixed a bug where `Circle` was rendered with incorrect radius (didn't take projection exaggeration into account). [#331](https://github.com/CloudMade/Leaflet/issues/331)
 * Fixed a bug where `Marker` `setIcon` was not working properly (by [@marphi](https://github.com/marphi)). [#218](https://github.com/CloudMade/Leaflet/pull/218) [#311](https://github.com/CloudMade/Leaflet/issues/311)
 * Fixed a bug where `Marker` `setLatLng` was not working if it's set before adding the marker to a map. [#222](https://github.com/CloudMade/Leaflet/issues/222)
 * Fixed a bug where marker popup would not move on `Marker` `setLatLng` (by [@tjarratt](https://github.com/tjarratt)). [#272](https://github.com/CloudMade/Leaflet/pull/272)
 * Fixed a bug where static properties of a child class would not override the parent ones.
 * Fixed broken popup `closePopup` option (by [@jgerigmeyer](https://github.com/jgerigmeyer)).
 * Fixed a bug that caused en error when dragging marker with icon without shadow (by [@anru](https://github.com/anru)). [#178](https://github.com/CloudMade/Leaflet/issues/178)
 * Fixed a typo in `Bounds` `contains` method (by [@anru](https://github.com/anru)). [#180](https://github.com/CloudMade/Leaflet/pull/180)
 * Fixed a bug where creating an empty `Polygon` with `new L.Polygon()` would raise an error.
 * Fixed a bug where drag event fired before the actual movement of layer (by [@anru](https://github.com/anru)). [#197](https://github.com/CloudMade/Leaflet/pull/197)
 * Fixed a bug where map click caused an error if dragging is initially disabled. [#196](https://github.com/CloudMade/Leaflet/issues/196)
 * Fixed a bug where map `movestart` event would fire after zoom animation.
 * Fixed a bug where attribution prefix would not update on `setPrefix`. [#195](https://github.com/CloudMade/Leaflet/issues/195)
 * Fixed a bug where `TileLayer` `load` event wouldn't fire in some edge cases (by [@dravnic](https://github.com/dravnic)).
 * Fixed a bug related to clearing background tiles after zooming (by [@neno-giscloud](https://github.com/neno-giscloud) & [@dravnic](https://github.com/dravnic)).
 * Fixed a bug that sometimes caused map flickering after zoom animation.
 * Fixed a bug related to cleaning up after removing tile layers (by [@dravnic](https://github.com/dravnic)). [#276](https://github.com/CloudMade/Leaflet/pull/276)
 * Fixed a bug that made selecting text in the attribution control impossible. [#279](https://github.com/CloudMade/Leaflet/issues/279)
 * Fixed a bug when initializing a map in a non-empty div. [#278](https://github.com/CloudMade/Leaflet/issues/278)
 * Fixed a bug where `movestart` didn't fire on panning animation.
 * Fixed a bug in Elliptical Mercator formula that affeted `EPSG:3395` CRS (by [@Savvkin](https://github.com/Savvkin)). [#358](https://github.com/CloudMade/Leaflet/pull/358)

#### Browser bugfixes

 * Fixed occasional crashes on Mac Safari (thanks to [@lapinos03](https://github.com/lapinos03)). [#191](https://github.com/CloudMade/Leaflet/issues/191)
 * Fixed a bug where resizing the map would sometimes make it blurry on WebKit (by [@mortenbekditlevsen](https://github.com/mortenbekditlevsen)). [#453](https://github.com/CloudMade/Leaflet/pull/453)
 * Fixed a bug that raised error in IE6-8 when clicking on popup close button. [#235](https://github.com/CloudMade/Leaflet/issues/235)
 * Fixed a bug with Safari not redrawing UI immediately after closing a popup. [#296](https://github.com/CloudMade/Leaflet/issues/296)
 * Fixed a bug that caused performance drop and high CPU usage when calling `setView` or `panTo` to the current center. [#231](https://github.com/CloudMade/Leaflet/issues/231)
 * Fixed a bug that caused map overlays to appear blurry in some cases under WebKit browsers.
 * Fixed a bug that was causing errors in some Webkit/Linux builds (requestAnimationFrame-related), thanks to Chris Martens.

#### Mobile browser bugfixes

 * Fixed a bug that caused an error when clicking vector layers under iOS. [#204](https://github.com/CloudMade/Leaflet/issues/204)
 * Fixed crash on Android 3+ when panning or zooming (by [@florian](https://github.com/florianf)). [#137](https://github.com/CloudMade/Leaflet/issues/137)
 * Fixed a bug on Android 2/3 that sometimes caused the map to disappear after zooming. [#69](https://github.com/CloudMade/Leaflet/issues/69)
 * Fixed a bug on Android 3 that caused tiles to shift position on a big map.
 * Fixed a bug that caused the map to pan when touch-panning inside a popup. [#452](https://github.com/CloudMade/Leaflet/issues/452)
 * Fixed a bug that caused click delays on zoom control.


## 0.2.1 (2011-06-18)

 * Fixed regression that caused error in `TileLayer.Canvas`.

## 0.2 (2011-06-17)

### Major features

 * Added **WMS** support (`TileLayer.WMS` layer).
 * Added different **projections** support, having `EPSG:3857`, `EPSG:4326` and `EPSG:3395` out of the box (through `crs` option in `Map`). Thanks to [@Miroff](https://github.com/Miroff) & [@Komzpa](https://github.com/Komzpa) for great advice and explanation regarding this.
 * Added **GeoJSON** layer support.

### Improvements

#### Usability improvements

 * Improved panning performance in Chrome and FF considerably with the help of `requestAnimationFrame`. [#130](https://github.com/CloudMade/Leaflet/issues/130)
 * Improved click responsiveness in mobile WebKit (now it happens without delay). [#26](https://github.com/CloudMade/Leaflet/issues/26)
 * Added tap tolerance (so click happens even if you moved your finger slighly when tapping).
 * Improved geolocation error handling: better error messages, explicit timeout, set world view on locateAndSetView failure. [#61](https://github.com/CloudMade/Leaflet/issues/61)

#### API improvements

 * Added **MultiPolyline** and **MultiPolygon** layers. [#77](https://github.com/CloudMade/Leaflet/issues/77)
 * Added **LayerGroup** and **FeatureGroup** layers for grouping other layers.
 * Added **TileLayer.Canvas** for easy creation of canvas-based tile layers.
 * Changed `Circle` to be zoom-dependent (with radius in meters); circle of a permanent size is now called `CircleMarker`.
 * Added `mouseover` and `mouseout` events to map, markers and paths; added map `mousemove` event.
 * Added `setLatLngs`, `spliceLatLngs`, `addLatLng`, `getLatLngs` methods to polylines and polygons.
 * Added `setLatLng` and `setRadius` methods to `Circle` and `CircleMarker`.
 * Improved `LatLngBounds contains` method to accept `LatLng` in addition to `LatLngBounds`, the same for `Bounds contains` and `Point`
 * Improved `LatLngBounds` & `Bounds` to allow their instantiation without arguments (by [@snc](https://github.com/snc)).
 * Added TMS tile numbering support through `TileLayer` `scheme: 'tms'` option (by [@tmcw](https://github.com/tmcw)).
 * Added `TileLayer` `noWrap` option to disable wrapping `x` tile coordinate (by [@jasondavies](https://github.com/jasondavies)).
 * Added `opacity` option and `setOpacity` method to `TileLayer`.
 * Added `setLatLng` and `setIcon` methods to `Marker`.
 * Added `title` option to `Marker`.
 * Added `maxZoom` argument to `map.locateAndSetView` method.
 * Added ability to pass Geolocation options to map `locate` and `locateAndSetView` methods (by [@JasonSanford](https://github.com/JasonSanford)).
 * Improved `Popup` to accept HTML elements in addition to strings as its content.

#### Development workflow improvements

 * Added `Makefile` for building `leaflet.js` on non-Windows machines (by [@tmcw](https://github.com/tmcw)).
 * Improved `debug/leaflet-include.js` script to allow using it outside of `debug` folder (by [@antonj](https://github.com/antonj)).
 * Improved `L` definition to be compatible with CommonJS. [#122](https://github.com/CloudMade/Leaflet/issues/122)

### Bug fixes

#### General bugfixes

 * Fixed a bug where zooming is broken if the map contains a polygon and you zoom to an area where it's not visible. [#47](https://github.com/CloudMade/Leaflet/issues/47)
 * Fixed a bug where closed polylines would not appear on the map.
 * Fixed a bug where marker that was added, removed and then added again would not appear on the map. [#66](https://github.com/CloudMade/Leaflet/issues/66)
 * Fixed a bug where tile layer that was added, removed and then added again would not appear on the map.
 * Fixed a bug where some tiles would not load when panning across the date line. [#97](https://github.com/CloudMade/Leaflet/issues/97)
 * Fixed a bug where map div with `position: absolute` is reset to `relative`. [#100](https://github.com/CloudMade/Leaflet/issues/100)
 * Fixed a bug that caused an error when trying to add a marker without shadow in its icon.
 * Fixed a bug where popup content would not update on `setContent` call. [#94](https://github.com/CloudMade/Leaflet/issues/94)
 * Fixed a bug where double click zoom wouldn't work if popup is opened on map click
 * Fixed a bug with click propagation on popup close button. [#99](https://github.com/CloudMade/Leaflet/issues/99)
 * Fixed inability to remove ImageOverlay layer.

#### Browser bugfixes

 * Fixed a bug where paths would not appear in IE8.
 * Fixed a bug where there were occasional slowdowns before zoom animation in WebKit. [#123](https://github.com/CloudMade/Leaflet/issues/123)
 * Fixed incorrect zoom animation & popup styling in Opera 11.11.
 * Fixed popup fade animation in Firefox and Opera.
 * Fixed a bug where map isn't displayed in Firefox when there's an `img { max-width: 100% }` rule.

#### Mobile browsers bugfixes

 * Fixed a bug that prevented panning on some Android 2.1 (and possibly older) devices. [#84](https://github.com/CloudMade/Leaflet/issues/84)
 * Disabled zoom animation on Android by default because it's buggy on some devices (will be enabled back when it's stable enough). [#32](https://github.com/CloudMade/Leaflet/issues/32)
 * Fixed a bug where map would occasionally break while multi-touch-zooming on iOS. [#32](https://github.com/CloudMade/Leaflet/issues/32)
 * Fixed a bug that prevented panning/clicking on Android 3 tablets. [#121](https://github.com/CloudMade/Leaflet/issues/121)
 * Fixed a bug that prevented panning/clicking on Opera Mobile. [#138](https://github.com/CloudMade/Leaflet/issues/138)
 * Fixed potentional memory leak on WebKit when removing tiles, thanks to [@Scalar4eg](https://github.com/Scalar4eg). [#107](https://github.com/CloudMade/Leaflet/issues/107)

## 0.1 (2011-05-13)

Initial Leaflet release.

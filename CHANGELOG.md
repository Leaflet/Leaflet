Leaflet Changelog
=================

(all changes without author notice are by [@mourner](https://github.com/mourner))

## master

An in-progress version being developed on the master branch.

### Breaking changes

Be sure to read through these changes to avoid any issues when upgrading from older versions:

 * Removed default `LatLng` wrapping/clamping of coordinates (`-180, -90` to `180, 90`), wrapping moved to an explicit method (`LatLng` `wrap`).
 * Disabled `Map` `worldCopyJump` option by default (jumping back to the original world copy when panning out of it). Enable it explicitly if you need it.
 * Changed styles for the zoom control (you may need to update your custom styles for it).

### Improvements

#### Usability improvements

##### Interaction

 * Added touch zoom, pan and double tap support for **IE10 touch devices and Metro apps** (by [@danzel](https://github.com/danzel) and [@veproza](https://github.com/veproza) with help from [@oliverheilig](https://github.com/oliverheilig)). [#1076](https://github.com/Leaflet/Leaflet/pull/1076) [#871](https://github.com/Leaflet/Leaflet/issues/871)
 * **Improved panning inertia** to be much more natural and smooth.
 * **Improved dragging cursors** in Chrome, Safari and Firefox (now grabbing hand cursors are used).
 * Improved zoom animation curve for a better feel overall.
 * Improved scroll wheel zoom to be more responsive.
 * Improved panning animation performance in IE6-8.

##### Controls

 * **Improved zoom control design** to look better, more neutral and in line with other controls, making it easier to customize and fit different website designs. Replaced +/- images with text.
 * Improved zoom control to zoom by 3 levels if you hold shift while clicking on a button.
 * Improved zoom control buttons to become visually disabled when min/max zoom is reached. [#917](https://github.com/Leaflet/Leaflet/issues/917)
 * Improved scale control styles.
 * Improved fallback control styles for IE6-8.

##### Other

 * Added **retina support for markers** (through `Icon` `iconRetinaUrl` and `shadowRetinaUrl` options) (by [@danzel](https://github.com/danzel)). [#1048](https://github.com/Leaflet/Leaflet/issues/1048) [#1174](https://github.com/Leaflet/Leaflet/pull/1174)
 * Added retina-sized default marker icon in addition to standard one (along with its SVG source and with some subtle design improvements) (by [@danzel](https://github.com/danzel)). [#1048](https://github.com/Leaflet/Leaflet/issues/1048) [#1174](https://github.com/Leaflet/Leaflet/pull/1174)
 * Improved vectors updating/removing performance on Canvas backend (by [@danzel](https://github.com/danzel)). [#961](https://github.com/Leaflet/Leaflet/pull/961)
 * Cut total images size from 10KB to 3.2KB with [Yahoo Smush.it](http://www.smushit.com/ysmush.it/). Thanks to Peter Rounce for suggestion.

#### API improvements

 * Replaced `L.Transition` with a much better and simpler `L.PosAnimation`.
 * Added `Class` `addInitHook` method for **adding constructor hooks to any classes** (great extension point for plugin authors). [#1123](https://github.com/Leaflet/Leaflet/issues/1123)
 * Added `Map` `whenReady` method (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1063](https://github.com/Leaflet/Leaflet/pull/1063)
 * Added optional `delta` argument to `Map` `zoomIn` and `zoomOut` (1 by default).
 * Added `isValid` method to `LatLngBounds` and `Bounds` (by [@domoritz](https://github.com/domoritz)). [#972](https://github.com/Leaflet/Leaflet/pull/972)
 * Added `Point` `equals` method.
 * Added `Bounds` `getSize` method.
 * Improved markers and vectors click event so that it propagates to map if no one is listening to it (by [@danzel](https://github.com/danzel)). [#834](https://github.com/Leaflet/Leaflet/issues/834) [#1033](https://github.com/Leaflet/Leaflet/pull/1033)
 * Added `Path` `unbindPopup` and `closePopup` methods.
 * Added `Path` `add` and `remove` event.
 * Added `Marker` `riseOnHover` and `riseOffset` options (for bringing markers to front on hover, disabled by default) (by [jacobtoye](https://github.com/jacobtoye)). [#914](https://github.com/Leaflet/Leaflet/pull/914) [#920](https://github.com/Leaflet/Leaflet/issues/920)
 * Added `Marker` `move` and `remove` events.
 * Added `Marker` `contextmenu` event. [#223](https://github.com/Leaflet/Leaflet/issues/223)
 * Added `Popup` `zoomAnimation` option (useful to disable when displaying flash content inside popups [#999](https://github.com/Leaflet/Leaflet/issues/999)).
 * Added `FeatureGroup` `layeradd` and `layerremove` events (by [@jacobtoye](https://github.com/jacobtoye)). [#1122](https://github.com/Leaflet/Leaflet/issues/1122)
 * Added `Control.Layers` `baselayerchange` event (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1064](https://github.com/Leaflet/Leaflet/pull/1064)
 * Improved `Control.Layers` to support HTML in layer names (by [@aparshin](https://github.com/aparshin)). [#1055](https://github.com/Leaflet/Leaflet/pull/1055) [#1099](https://github.com/Leaflet/Leaflet/issues/1099)
 * Added `CRS.Simple` to the list of built-in CRS and improved it to be more usable out of the box (it has different default scaling and transformation now), see `debug/map/simple-proj.html` for an example.
 * Removed `Browser` `ua`, `gecko`, `opera` properties (no longer needed).
 * Added `L.extend`, `L.bind`, `L.stamp`, `L.setOptions` shortcuts for corresponding `L.Util` methods.
 * Disabled clearing of map container contents on map initialization (as a result of fixing [#278](https://github.com/Leaflet/Leaflet/issues/278)).
 * Added `L.Util.isArray` function (by [@oslek](https://github.com/oslek)). [#1279](https://github.com/Leaflet/Leaflet/pull/1279)

### Bugfixes

#### General bugfixes

 * Fixed broken tiles and zooming in RTL layouts (by [@danzel](https://github.com/danzel)). [#1099](https://github.com/Leaflet/Leaflet/pull/1099) [#1095](https://github.com/Leaflet/Leaflet/issues/1095)
 * Fixed a bug with pan animation where it jumped to its end position if you tried to drag the map.
 * Fixed a bug where shift-clicking on a map would zoom it to the max zoom level.
 * Fixed a glitch with zooming in while panning animation is running.
 * Fixed a glitch with dragging the map while zoom animation is running.
 * Fixed a bug where slight touchpad scrolling or one-wheel scrolling wouln't always perform zooming. [#1039](https://github.com/Leaflet/Leaflet/issues/1039)
 * Fixed a bug where `panBy` wouldn't round the offset values (so it was possible to make the map blurry with it). [#1085](https://github.com/Leaflet/Leaflet/issues/1085)
 * Fixed a bug where you couldn't scroll the layers control with a mouse wheel.
 * Fixed a regression where WMS tiles wouldn't wrap on date lines. [#970](https://github.com/Leaflet/Leaflet/issues/970)
 * Fixed a bug where mouse interaction was affected by map container border width (by [@mohlendo](https://github.com/mohlendo)). [#1204](https://github.com/Leaflet/Leaflet/issues/1205) [#1205](https://github.com/Leaflet/Leaflet/pull/1205)
 * Fixed a bug with weird vector zoom animation when using Canvas for rendering (by [@danzel](https://github.com/danzel)). [#1187](https://github.com/Leaflet/Leaflet/issues/1187) [#1188](https://github.com/Leaflet/Leaflet/pull/1188)
 * Fixed a bug where max bounds limitation didn't work when navigating the map with a keyboard (by [@snkashis](https://github.com/snkashis)). [#989](https://github.com/Leaflet/Leaflet/issues/989) [#1221](https://github.com/Leaflet/Leaflet/pull/1221)

#### API bugfixes

 * Fixed a bug where `TileLayer` `bringToBack` didn't work properly in some cases (by [@danzel](https://github.com/danzel)). [#963](https://github.com/Leaflet/Leaflet/pull/963) [#959](https://github.com/Leaflet/Leaflet/issues/959)
 * Fixed a bug where removing a tile layer while dragging would throw an error (by [@danzel](https://github.com/danzel)). [#965](https://github.com/Leaflet/Leaflet/issues/965) [#968](https://github.com/Leaflet/Leaflet/pull/968)
 * Fixed a bug where middle marker wasn't removed after deleting 2 end nodes from a polyline (by [@Svad](https://github.com/Svad)). [#1022](https://github.com/Leaflet/Leaflet/issues/1022) [#1023](https://github.com/Leaflet/Leaflet/pull/1023)
 * Fixed a bug where `Map` `load` event happened too late (after `moveend`, etc.) (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1027](https://github.com/Leaflet/Leaflet/pull/1027)
 * Fixed `Circle` `getBounds` to return correct bounds and work without adding the circle to a map. [#1068](https://github.com/Leaflet/Leaflet/issues/1068)
 * Fixed a bug where removing `Popup` on `viewreset` throwed an error (by [fnicollet](https://github.com/fnicollet) and [@danzel](https://github.com/danzel)). [#1098](https://github.com/Leaflet/Leaflet/pull/1098) [#1094](https://github.com/Leaflet/Leaflet/issues/1094)
 * Fixed a bug where `TileLayer.Canvas` `drawTile` didn't receive tile zoom level in arguments.
 * Fixed a bug where `GeoJSON` `resetStyle` would not fully reset a layer to its default style. [#1112](https://github.com/Leaflet/Leaflet/issues/1112)
 * Fixed a bug that caused infinite recursion when using `latLngBounds` factory with coordinates as string values. [#933](https://github.com/Leaflet/Leaflet/issues/933)
 * Fixed chaining on `Marker` `setIcon`, `setZIndexOffset`, `update` methods. [#1176](https://github.com/Leaflet/Leaflet/issues/1176)
 * Fixed a bug with mouse interaction when the map container contained children with position other than absolute. [#278](https://github.com/Leaflet/Leaflet/issues/278)
 * Fixed a bug with fill/stroke opacity conflicts when using Canvas for rendering (by [@danzel](https://github.com/danzel)). [#1186](https://github.com/Leaflet/Leaflet/issues/1186) [#1889](https://github.com/Leaflet/Leaflet/pull/1189)
 * Fixed a bug where `FeatureGroup` `bindPopup` didn't take options into account.
 * Fixed a bug where Canvas-based vector layers didn't cleanup click event on removal properly (by [@snkashis](https://github.com/snkashis)). [#1006](https://github.com/Leaflet/Leaflet/issues/1006) [#1273](https://github.com/Leaflet/Leaflet/pull/1273)
 * Fixed a bug where `CircleMarker` `setStyle` didn't take `radius` into account (by [@fdlk](https://github.com/fdlk)). [#1012](https://github.com/Leaflet/Leaflet/issues/1012) [#1013](https://github.com/Leaflet/Leaflet/pull/1013)
 * Fixed a bug where null GeoJSON geometries would throw an error instead of skipping (by [@brianherbert](https://github.com/brianherbert)). [#1240](https://github.com/Leaflet/Leaflet/pull/1240)
 * Fixed a bug where Canvas-based vector layers passed incorrect `layer` event property on click (by [@snkashis](https://github.com/snkashis)). [#1215](https://github.com/Leaflet/Leaflet/issues/1215) [#1243](https://github.com/Leaflet/Leaflet/pull/1243)
 * Fixed a bug where `TileLayer.WMS` didn't work correctly if the base URL contained query parameters (by [@snkashis](https://github.com/snkashis)). [#973](https://github.com/Leaflet/Leaflet/issues/973) [#1231](https://github.com/Leaflet/Leaflet/pull/1231)
 * Fixed a bug where removing a polyline in editing state wouldn't clean up the editing handles (by [@mehmeta](https://github.com/mehmeta)). [#1233](https://github.com/Leaflet/Leaflet/pull/1233)
 * Fixed a bug where removing a vector layer with a bound popup wouldn't clean up its click event properly (by [@yohanboniface](https://github.com/yohanboniface)). [#1229](https://github.com/Leaflet/Leaflet/pull/1229)
 * Fixed a bug where `GeoJSON` features with `GeometryCollection` didn't pass properties to `pointToLayer` function (by [@calvinmetcalf](https://github.com/calvinmetcalf)). [#1097](https://github.com/Leaflet/Leaflet/pull/1097)

#### Browser bugfixes

 * Fixed a bug with map **freezing after zoom on Android 4.1**. [#1182](https://github.com/Leaflet/Leaflet/issues/1182)
 * Fixed a bug where "Not implemented" error sometimes appeared in IE6-8 (by [@bryguy](https://github.com/bryguy) and [@lookfirst](https://github.com/lookfirst)). [#892](https://github.com/Leaflet/Leaflet/issues/892) [#893](https://github.com/Leaflet/Leaflet/pull/893)
 * Fixed compatibility with SmoothWheel extension for Firefox (by [@waldir](https://github.com/waldir)). [#1011](https://github.com/Leaflet/Leaflet/pull/1011)
 * Fixed a bug with popup layout in IE6-7 (by [@danzel](https://github.com/danzel)). [#1117](https://github.com/Leaflet/Leaflet/issues/1117)
 * Fixed a bug with incorrect box zoom opacity in IE6-7 (by [@jacobtoye](https://github.com/jacobtoye)). [#1072](https://githubcom/Leaflet/Leaflet/pull/1072)
 * Fixed a bug with box zoom throwing a JS error in IE6-7 (by [@danzel](https://github.com/danzel)). [#1071](https://github.com/Leaflet/Leaflet/pull/1071)
 * Fixed a bug where `TileLayer` `bringToFront/Back()` throwed an error in IE6-8. [#1168](https://github.com/Leaflet/Leaflet/issues/1168)
 * Fixed array type checking in the code to be more consistent in a cross-frame environment (by [@oslek](https://github.com/oslek)). [#1279](https://github.com/Leaflet/Leaflet/pull/1279)
 * Fixed a bug with `-` key not working in Firefox 15+ (thanks to [@mattesCZ](https://github.com/mattesCZ)). [#869](https://github.com/Leaflet/Leaflet/issues/869)

## 0.4.5 (October 25, 2012)

 * Fixed a bug with **wonky zoom animation in IE10** (by [@danzel](https://github.com/danzel)). [#1007](https://github.com/Leaflet/Leaflet/pull/1007)
 * Fixed a bug with **wonky zoom animation in Chrome 23+** (by [@danzel](https://github.com/danzel)). [#1060](https://github.com/Leaflet/Leaflet/pull/1060) [#1056](https://github.com/Leaflet/Leaflet/issues/1056)

## 0.4.4 (August 7, 2012)

### Improvements

 * Improved `GeoJSON` `setStyle` to also accept function (like the corresponding option).
 * Added `GeoJSON` `resetStyle(layer)`, useful for resetting hover state.
 * Added `feature` property to layers created with `GeoJSON` (containing the GeoJSON feature data).
 * Added `FeatureGroup` `bringToFront` and `bringToBack` methods (so that they would work for multipolys).
 * Added optional `animate` argument to `Map` `invalidateSize` (by [@ajbeaven](https://github.com/ajbeaven)). [#857](https://github.com/Leaflet/Leaflet/pull/857)

### Bugfixes

 * Fixed a bug where tiles sometimes disappeared on initial map load on Android 2/3 (by [@danzel](https://github.com/danzel)). [#868](https://github.com/Leaflet/Leaflet/pull/868)
 * Fixed a bug where map would occasionally flicker near the border on zoom or pan on Chrome.
 * Fixed a bug where `Path` `bringToFront` and `bringToBack` didn't return `this`.
 * Removed zoom out on Win/Meta key binding (since it interferes with global keyboard shortcuts). [#869](https://github.com/Leaflet/Leaflet/issues/869)

## 0.4.2 (August 1, 2012)

 * Fixed a bug where layers control radio buttons would not work correctly in IE7 (by [@danzel](https://github.com/danzel)). [#862](https://github.com/Leaflet/Leaflet/pull/862)
 * Fixed a bug where `FeatureGroup` `removeLayer` would unbind popups of removed layers even if the popups were not put by the group (affected [Leaflet.markercluster](https://github.com/danzel/Leaflet.markercluster) plugin) (by [@danzel](https://github.com/danzel)). [#861](https://github.com/Leaflet/Leaflet/pull/861)

## 0.4.1 (July 31, 2012)

 * Fixed a bug that caused marker shadows appear as opaque black in IE6-8. [#850](https://github.com/Leaflet/Leaflet/issues/850)
 * Fixed a bug with incorrect calculation of scale by the scale control. [#852](https://github.com/Leaflet/Leaflet/issues/852)
 * Fixed broken L.tileLayer.wms class factory (by [@mattcurrie](https://github.com/mattcurrie)). [#856](https://github.com/Leaflet/Leaflet/issues/856)
 * Improved retina detection for `TileLayer` `detectRetina` option (by [@sxua](https://github.com/sxua)). [#854](https://github.com/Leaflet/Leaflet/issues/854)

## 0.4 (July 30, 2012)

### API simplification

Leaflet 0.4 contains several API improvements that allow simpler, jQuery-like syntax ([example](https://gist.github.com/3038879)) while being backwards compatible with the previous approach (so you can use both styles):

 * Improved most methods and options to accept `LatLng`, `LatLngBounds`, `Point` and `Bounds` values in an array form (e.g. `map.panTo([lat, lng])` will be the same as `map.panTo(new L.LatLng(lat, lng))`)
 * Added `addTo` method to all layer classes, e.g. `marker.addTo(map)` is equivalent to `map.addLayer(marker)`
 * Added factory methods to most classes to be able to write code without `new` keyword, named the same as classes but starting with a lowercase letter, e.g. `L.map('map')` is the same as `new L.Map('map')`

### Notable new features

 * Added configurable **panning inertia** - after a quick pan, the map slows down in the same direction.
 * Added **keyboard navigation** for panning/zooming with keyboard arrows and +/- keys (by [@ericmmartinez](https://github.com/ericmmartinez)). [#663](https://github.com/Leaflet/Leaflet/pull/663) [#646](https://github.com/Leaflet/Leaflet/issues/646)
 * Added smooth **zoom animation of markers, vector layers, image overlays and popups** (by [@danzel](https://github.com/danzel)). [#740](https://github.com/Leaflet/Leaflet/pull/740) [#758](https://github.com/Leaflet/Leaflet/issues/758)
 * Added **Android 4+ pinch-zoom** support (by [@danzel](https://github.com/danzel)). [#774](https://github.com/Leaflet/Leaflet/pull/774)
 * Added **polyline and polygon editing**. [#174](https://github.com/Leaflet/Leaflet/issues/174)
 * Added an unobtrusive **scale control**.
 * Added **DivIcon** class that easily allows you to create lightweight div-based markers.
 * Added **Rectangle** vector layer (by [@JasonSanford](https://github.com/JasonSanford)). [#504](https://github.com/Leaflet/Leaflet/pull/504)

### Improvements

#### Usability improvements

 * Improved zooming so that you don't get a blank map when you zoom in or out twice quickly (by [@danzel](https://github.com/danzel)). [#7](https://github.com/Leaflet/Leaflet/issues/7) [#729](https://github.com/Leaflet/Leaflet/pull/729)
 * Drag-panning now works even when there are markers in the starting point (helps on maps with lots of markers). [#506](https://github.com/Leaflet/Leaflet/issues/506)
 * Improved panning performance even more (there are no wasted frames now).
 * Improved pinch-zoom performance in mobile Chrome and Firefox.
 * Improved map performance on window resize.
 * Replaced box-shadow with border on controls for mobile devices to improve performance.
 * Slightly improved default popup styling.
 * Added `TileLayer` `detectRetina` option (`false` by default) that makes tiles show in a higher resolution on iOS retina displays (by [@Mithgol](https://github.com/Mithgol)). [#586](https://github.com/Leaflet/Leaflet/pull/586)

#### GeoJSON API changes

GeoJSON API was improved to be simpler and more flexible ([example](https://gist.github.com/3062900)). The changes are not backwards-compatible, so be sure to update your old code.

 * Added `style` option for styling vector layers, passed either as an object or as a function (to style vector layers according to GeoJSON properties).
 * Added `filter` option to leave out features that don't correspond to a certain criteria (e.g. based on properties).
 * Added `onEachFeature` option to execute certain code on each feature layer based on its properties (binding popups, etc).
 * Changed `pointToLayer` function signature to provide `geojson` in addition to `latlng` when creating point features for more flexibility.

#### Icon API changes

Icon API was improved to be more flexible, but one of the changes is backwards-incompatible: you now need to pass different icon properties (like `iconUrl`) inside an options object ([example](https://gist.github.com/3076084)).

 * Converted `Icon` properties to options, changed constructor signature to `Icon(options)`.
 * Moved default marker icon options to `L.Icon.Default` class (which extends from `L.Icon`).
 * Added `Icon` `className` option to assign a custom class to an icon.
 * Added `Icon` `shadowAnchor` option to set the anchor of the shadow.
 * Made all `Icon` options except `iconUrl` optional (if not specified, they'll be chosen automatically or implemented using CSS). Anchor is centered by default (if size is specified), and otherwise can be set through CSS using negative margins.

#### Control API changes

 * Added `setPosition` and `getPosition` to all controls, as well as ability to pass certain position as an option when creating a control.
 * Made controls implementation easier (now more magic happens under the hood).
 * Replaced ugly control position constants (e.g. `L.Control.Position.TOP_LEFT`) with light strings (`'topleft'`, `'bottomright'`, etc.)

#### Other breaking API changes

 * Improved `TileLayer` constructor to interpolate URL template values from options (removed third `urlParams` argument).
 * Changed `TileLayer` `scheme: 'tms'` option to `tms: true`.
 * Removed `Map` `locateAndSetView` method (use `locate` with `setView: true` option)
 * Changed popup `minWidth` and `maxWidth` options to be applied to content element, not the whole popup.
 * Moved `prefix` argument to `options` in `Control.Attribution` constructor.
 * Renamed `L.VERSION` to `L.version`.

#### Other API improvements

 * Improved `on` and `off` methods to also accept `(eventHash[, context])`, as well as multiple space-separated events (by [@Guiswa](https://github.com/Guiswa)). [#770](https://github.com/Leaflet/Leaflet/pull/770)
 * Improved `off` to remove all listeners of the event if no function was specified (by [@Guiswa](https://github.com/Guiswa)). [#770](https://github.com/Leaflet/Leaflet/pull/770) [#691](https://github.com/Leaflet/Leaflet/issues/691)
 * Added `TileLayer` `setZIndex` method for controlling the order of tile layers (thanks to [@mattcurrie](https://github.com/mattcurrie)). [#837](https://github.com/Leaflet/Leaflet/pull/837)
 * Added `Control.Layers` `autoZIndex` option (on by default) to preserve the order of tile layers when switching.
 * Added `TileLayer` `redraw` method for re-requesting tiles (by [@greeninfo](https://github.com/greeninfo)). [#719](https://github.com/Leaflet/Leaflet/issues/719)
 * Added `TileLayer` `setUrl` method for dynamically changing the tile URL template.
 * Added `bringToFront` and `bringToBack` methods to `TileLayer`, `ImageOverlay` and vector layers. [#185](https://github.com/Leaflet/Leaflet/issues/185) [#505](https://github.com/Leaflet/Leaflet/issues/505)
 * Added `TileLayer` `loading` event that fires when its tiles start to load (thanks to [@lapinos03](https://github.com/lapinos03)). [#177](https://github.com/Leaflet/Leaflet/issues/177)
 * Added `TileLayer.WMS` `setParams` method for setting WMS parameters at runtime (by [@greeninfo](https://github.com/greeninfo)). [#719](https://github.com/Leaflet/Leaflet/issues/719)
 * Added `TileLayer.WMS` subdomain support (`{s}` in the url) (by [@greeninfo](https://github.com/greeninfo)). [#735](https://github.com/Leaflet/Leaflet/issues/735)
 * Added `originalEvent` property to `MouseEvent` (by [@k4](https://github.com/k4)). [#521](https://github.com/Leaflet/Leaflet/pull/521)
 * Added `containerPoint` property to `MouseEvent`. [#413](https://github.com/Leaflet/Leaflet/issues/413)
 * Added `contextmenu` event to vector layers (by [@ErrorProne](https://github.com/ErrorProne)). [#500](https://github.com/Leaflet/Leaflet/pull/500)
 * Added `LayerGroup` `eachLayer` method for iterating over its members.
 * Added `FeatureGroup` `mousemove` and `contextmenu` events (by [@jacobtoye](https://github.com/jacobtoye)). [#816](https://github.com/Leaflet/Leaflet/pull/816)
 * Added chaining to `DomEvent` methods.
 * Added `on` and `off` aliases for `DomEvent` `addListener` and `removeListener` methods.
 * Added `L_NO_TOUCH` global variable switch (set it before Leaflet inclusion) which disables touch detection, helpful for desktop apps built using QT. [#572](https://github.com/Leaflet/Leaflet/issues/572)
 * Added `dashArray` option to vector layers for making dashed strokes (by [jacobtoye](https://github.com/jacobtoye)). [#821](https://github.com/Leaflet/Leaflet/pull/821) [#165](https://github.com/Leaflet/Leaflet/issues/165)
 * Added `Circle` `getBounds` method. [#440](https://github.com/Leaflet/Leaflet/issues/440)
 * Added `Circle` `getLatLng` and `getRadius` methods (by [@Guiswa](https://github.com/Guiswa)). [#655](https://github.com/Leaflet/Leaflet/pull/655)
 * Added `openPopup` method to all vector layers. [#246](https://github.com/Leaflet/Leaflet/issues/246)
 * Added public `redraw` method to vector layers (useful if you manipulate their `LatLng` points directly).
 * Added `Marker` `opacity` option and `setOpacity` method.
 * Added `Marker` `update` method. [#392](https://github.com/Leaflet/Leaflet/issues/392)
 * Improved `Marker` `openPopup` not to raise an error if it doesn't have a popup. [#507](https://github.com/Leaflet/Leaflet/issues/507)
 * Added `ImageOverlay` `opacity` option and `setOpacity` method. [#438](https://github.com/Leaflet/Leaflet/issues/438)
 * Added `Popup` `maxHeight` option that makes content inside the popup scrolled if it doesn't fit the specified max height.
 * Added `Popup` `openOn(map)` method (similar to `Map` `openPopup`).
 * Added `Map` `getContainer` method (by [@Guiswa](https://github.com/Guiswa)). [#654](https://github.com/Leaflet/Leaflet/pull/654)
 * Added `Map` `containerPointToLatLng` and `latLngToContainerPoint` methods. [#474](https://github.com/Leaflet/Leaflet/issues/474)
 * Added `Map` `addHandler` method.
 * Added `Map` `mouseup` and `autopanstart` events.
 * Added `LatLngBounds` `pad` method that returns bounds extended by a percentage (by [@jacobtoye](https://github.com/jacobtoye)). [#492](https://github.com/Leaflet/Leaflet/pull/492)
 * Moved dragging cursor styles from JS code to CSS.

### Bug fixes

#### General bugfixes

 * Fixed a bug where the map was zooming incorrectly inside a `position: fixed` container (by [@chx007](https://github.com/chx007)). [#602](https://github.com/Leaflet/Leaflet/pull/602)
 * Fixed a bug where scaled tiles weren't cleared up after zoom in some cases (by [@cfis](https://github.com/cfis)) [#683](https://github.com/Leaflet/Leaflet/pull/683)
 * Fixed a bug where map wouldn't drag over a polygon with a `mousedown` listener. [#834](https://github.com/Leaflet/Leaflet/issues/834)

#### API bugfixes

 * Fixed a regression where removeLayer would not remove corresponding attribution. [#488](https://github.com/Leaflet/Leaflet/issues/488)
 * Fixed a bug where popup close button wouldn't work on manually added popups. [#423](https://github.com/Leaflet/Leaflet/issues/423)
 * Fixed a bug where marker click event would stop working if you dragged it and then disabled dragging. [#434](https://github.com/Leaflet/Leaflet/issues/434)
 * Fixed a bug where `TileLayer` `setOpacity` wouldn't work when setting it back to 1.
 * Fixed a bug where vector layer `setStyle({stroke: false})` wouldn't remove stroke and the same for fill. [#441](https://github.com/Leaflet/Leaflet/issues/441)
 * Fixed a bug where `Marker` `bindPopup` method wouldn't take `offset` option into account.
 * Fixed a bug where `TileLayer` `load` event wasn't fired if some tile didn't load (by [@lapinos03](https://github.com/lapinos03) and [@cfis](https://github.com/cfis)) [#682](https://github.com/Leaflet/Leaflet/pull/682)
 * Fixed error when removing `GeoJSON` layer. [#685](https://github.com/Leaflet/Leaflet/issues/685)
 * Fixed error when calling `GeoJSON` `clearLayer` (by [@runderwood](https://github.com/runderwood)). [#617](https://github.com/Leaflet/Leaflet/pull/617)
 * Fixed a bug where `Control` `setPosition` wasn't always working correctly (by [@ericmmartinez](https://github.com/ericmmartinez)). [#657](https://github.com/Leaflet/Leaflet/pull/657)
 * Fixed a bug with `Util.bind` sometimes losing arguments (by [@johtso](https://github.com/johtso)). [#588](https://github.com/Leaflet/Leaflet/pull/588)
 * Fixed a bug where `drag` event was sometimes fired after `dragend`. [#555](https://github.com/Leaflet/Leaflet/issues/555)
 * Fixed a bug where `TileLayer` `load` event was firing only once (by [@lapinos03](https://github.com/lapinos03) and [shintonik](https://github.com/shintonik)). [#742](https://github.com/Leaflet/Leaflet/pull/742) [#177](https://github.com/Leaflet/Leaflet/issues/177)
 * Fixed a bug where `FeatureGroup` popup events where not cleaned up after removing a layer from it (by [@danzel](https://github.com/danzel)). [#775](https://github.com/Leaflet/Leaflet/pull/775)
 * Fixed a bug where `DomUtil.removeClass` didn't remove trailing spaces (by [@jieter](https://github.com/jieter)). [#784](https://github.com/Leaflet/Leaflet/pull/784)
 * Fixed a bug where marker popup didn't take popup offset into account.
 * Fixed a bug that led to an error when polyline was removed inside a `moveend` listener.
 * Fixed a bug where `LayerGroup` `addLayer` wouldn't check if a layer has already been added (by [@danzel](https://github.com/danzel)). [798](https://github.com/Leaflet/Leaflet/pull/798)

#### Browser bugfixes

 * Fixed broken zooming on IE10 beta (by [@danzel](https://github.com/danzel)). [#650](https://github.com/Leaflet/Leaflet/issues/650) [#751](https://github.com/Leaflet/Leaflet/pull/751)
 * Fixed a bug that broke Leaflet for websites that had XHTML content-type header set (by [lars-sh](https://github.com/lars-sh)). [#801](https://github.com/Leaflet/Leaflet/pull/801)
 * Fixed a bug that caused popups to be empty in IE when passing a DOM node as the content (by [@nrenner](https://github.com/nrenner)). [#472](https://github.com/Leaflet/Leaflet/pull/472)
 * Fixed inability to use scrolled content inside popup due to mouse wheel propagation.
 * Fixed a bug that caused jumping/stuttering of panning animation in some cases.
 * Fixed a bug where popup size was calculated incorrectly in IE.
 * Fixed a bug where cursor would flicker when dragging a marker.
 * Fixed a bug where clickable paths on IE9 didn't have a hand cursor (by [naehrstoff](https://github.com/naehrstoff)). [#671](https://github.com/Leaflet/Leaflet/pull/671)
 * Fixed a bug in IE with disappearing icons when changing opacity (by [@tagliala](https://github.com/tagliala) and [DamonOehlman](https://github.com/DamonOehlman)). [#667](https://github.com/Leaflet/Leaflet/pull/667) [#600](https://github.com/Leaflet/Leaflet/pull/600)
 * Fixed a bug with setting opacity on IE10 (by [@danzel](https://github.com/danzel)). [796](https://github.com/Leaflet/Leaflet/pull/796)
 * Fixed a bug where `Control.Layers` didn't work on IE7. [#652](https://github.com/Leaflet/Leaflet/issues/652)
 * Fixed a bug that could cause false `mousemove` events on click in Chrome (by [@stsydow](https://github.com/stsydow)). [#757](https://github.com/Leaflet/Leaflet/pull/757)
 * Fixed a bug in IE6-8 where adding fill or stroke on vector layers after initialization with `setStyle` would break the map. [#641](https://github.com/Leaflet/Leaflet/issues/641)
 * Fixed a bug with setOpacity in IE where it would not work correctly if used more than once on the same element (by [@ajbeaven](https://github.com/ajbeaven)). [#827](https://github.com/Leaflet/Leaflet/pull/827)
 * Fixed a bug in Chrome where transparent control corners sometimes couldn't be clicked through (by [@danzel](https://github.com/danzel)). [#836](https://github.com/Leaflet/Leaflet/pull/836) [#575](https://github.com/Leaflet/Leaflet/issues/575)

#### Mobile browser bugfixes

 * Fixed a bug that sometimes caused map to disappear completely after zoom on iOS (by [@fr1n63](https://github.com/fr1n63)). [#580](https://github.com/Leaflet/Leaflet/issues/580) [#777](https://github.com/Leaflet/Leaflet/pull/777)
 * Fixed a bug that often caused vector layers to flicker on drag end on iOS (by [@krawaller](https://github.com/krawaller)). [#18](https://github.com/Leaflet/Leaflet/issues/18)
 * Fixed a bug with false map click events on pinch-zoom and zoom/layers controls click. [#485](https://github.com/Leaflet/Leaflet/issues/485)
 * Fixed a bug where touching the map with two or more fingers simultaneously would raise an error.
 * Fixed a bug where zoom control wasn't always visible on Android 3. [#335](https://github.com/Leaflet/Leaflet/issues/335)
 * Fixed a bug where opening the layers control would propagate a click to the map (by [@jacobtoye](https://github.com/jacobtoye)). [#638](https://github.com/Leaflet/Leaflet/pull/638)
 * Fixed a bug where `ImageOverlay` wouldn't stretch properly on zoom on Android 2. [#651](https://github.com/Leaflet/Leaflet/issues/651)
 * Fixed a bug where `clearLayers` for vector layers on a Canvas backend (e.g. on Android 2) would take unreasonable amount of time. [#785](https://github.com/Leaflet/Leaflet/issues/785)
 * Fixed a bug where `setLatLngs` and similar methods on vector layers on a Canvas backend would not update the layers immediately. [#732](https://github.com/Leaflet/Leaflet/issues/732)

## 0.3.1 (February 14, 2012)

 * Fixed a regression where default marker icons wouldn't work if Leaflet include url contained a query string.
 * Fixed a regression where tiles sometimes flickered with black on panning in iOS.

## 0.3 (February 13, 2012)

### Major features

 * Added **Canvas backend** for vector layers (polylines, polygons, circles). This enables vector support on Android < 3, and it can also be optionally preferred over SVG for a performance gain in some cases. Thanks to [@florianf](https://github.com/florianf) for a big part of this work.
 * Added **layers control** (`Control.Layers`) for convenient layer switching.
 * Added ability to set **max bounds** within which users can pan/zoom. [#93](https://github.com/Leaflet/Leaflet/issues/93)

### Improvements

#### Usability improvements

 * Map now preserves its center after resize.
 * When panning to another copy of the world (that's infinite horizontally), map overlays now jump to corresponding positions. [#273](https://github.com/Leaflet/Leaflet/issues/273)
 * Limited maximum zoom change on a single mouse wheel movement (so you won't zoom across the whole zoom range in one scroll). [#149](https://github.com/Leaflet/Leaflet/issues/149)
 * Significantly improved line simplification performance (noticeable when rendering polylines/polygons with tens of thousands of points)
 * Improved circles performance by not drawing them if they're off the clip region.
 * Improved stability of zoom animation (less flickering of tiles).

#### API improvements

 * Added ability to add a tile layer below all others (`map.addLayer(layer, true)`) (useful for switching base tile layers).
 * Added `Map` `zoomstart` event (thanks to [@Fabiz](https://github.com/Fabiz)). [#377](https://github.com/Leaflet/Leaflet/pull/377)
 * Improved `Map` `locate` method, added ability to watch location continuously and more options. [#212](https://github.com/Leaflet/Leaflet/issues/212)
 * Added second argument `inside` to `Map` `getBoundsZoom` method that allows you to get appropriate zoom for the view to fit *inside* the given bounds.
 * Added `hasLayer` method to `Map`.
 * Added `Marker` `zIndexOffset` option to be able to set certain markers below/above others. [#65](https://github.com/Leaflet/Leaflet/issues/65)
 * Added `urlParams` third optional argument to `TileLayer` constructor for convenience: an object with properties that will be evaluated in the URL template.
 * Added `TileLayer` `continuousWorld` option to disable tile coordinates checking/wrapping.
 * Added `TileLayer` `tileunload` event fired when tile gets removed after panning (by [@CodeJosch](https://github.com/CodeJosch)). [#256](https://github.com/Leaflet/Leaflet/pull/256)
 * Added `TileLayer` `zoomOffset` option useful for non-256px tiles (by [@msaspence](https://github.com/msaspence)).
 * Added `TileLayer` `zoomReverse` option to reverse zoom numbering (by [@Majiir](https://github.com/Majiir)). [#406](https://github.com/Leaflet/Leaflet/pull/406)
 * Added `TileLayer.Canvas` `redraw` method (by [@mortenbekditlevsen](https://github.com/mortenbekditlevsen)). [#459](https://github.com/Leaflet/Leaflet/pull/459)
 * Added `Polyline` `closestLayerPoint` method that's can be useful for interaction features (by [@anru](https://github.com/anru)). [#186](https://github.com/Leaflet/Leaflet/pull/186)
 * Added `setLatLngs` method to `MultiPolyline` and `MultiPolygon` (by [@anru](https://github.com/anru)). [#194](https://github.com/Leaflet/Leaflet/pull/194)
 * Added `getBounds` method to `Polyline` and `Polygon` (by [@JasonSanford](https://github.com/JasonSanford)). [#253](https://github.com/Leaflet/Leaflet/pull/253)
 * Added `getBounds` method to `FeatureGroup` (by [@JasonSanford](https://github.com/JasonSanford)). [#557](https://github.com/Leaflet/Leaflet/pull/557)
 * Added `FeatureGroup` `setStyle` method (also inherited by `MultiPolyline` and `MultiPolygon`). [#353](https://github.com/Leaflet/Leaflet/issues/353)
 * Added `FeatureGroup` `invoke` method to call a particular method on all layers of the group with the given arguments.
 * Added `ImageOverlay` `load` event. [#213](https://github.com/Leaflet/Leaflet/issues/213)
 * Added `minWidth` option to `Popup` (by [@marphi](https://github.com/marphi)). [#214](https://github.com/Leaflet/Leaflet/pull/214)
 * Improved `LatLng` constructor to be more tolerant (and throw descriptive error if latitude or longitude can't be interpreted as a number). [#136](https://github.com/Leaflet/Leaflet/issues/136)
 * Added `LatLng` `distanceTo` method (great circle distance) (by [@mortenbekditlevsen](https://github.com/mortenbekditlevsen)). [#462](https://github.com/Leaflet/Leaflet/pull/462)
 * Added `LatLngBounds` `toBBoxString` method for convenience (by [@JasonSanford](https://github.com/JasonSanford)). [#263](https://github.com/Leaflet/Leaflet/pull/263)
 * Added `LatLngBounds` `intersects(otherBounds)` method (thanks to [@pagameba](https://github.com/pagameba)). [#350](https://github.com/Leaflet/Leaflet/pull/350)
 * Made `LatLngBounds` `extend` method to accept other `LatLngBounds` in addition to `LatLng` (by [@JasonSanford](https://github.com/JasonSanford)). [#553](https://github.com/Leaflet/Leaflet/pull/553)
 * Added `Bounds` `intersects(otherBounds)` method. [#461](https://github.com/Leaflet/Leaflet/issues/461)
 * Added `L.Util.template` method for simple string template evaluation.
 * Added `DomUtil.removeClass` method (by [@anru](https://github.com/anru)).
 * Improved browser-specific code to rely more on feature detection rather than user agent string.
 * Improved superclass access mechanism to work with inheritance chains of 3 or more classes; now you should use `Klass.superclass` instead of `this.superclass` (by [@anru](https://github.com/anru)). [#179](https://github.com/Leaflet/Leaflet/pull/179)
 * Added `Map` `boxzoomstart` and `boxzoomend` events (by [@zedd45](https://github.com/zedd45)). [#554](https://github.com/Leaflet/Leaflet/pull/554)
 * Added `Popup` `contentupdate` event (by [@mehmeta](https://github.com/mehmeta)). [#548](https://github.com/Leaflet/Leaflet/pull/548)

#### Breaking API changes

 * `shiftDragZoom` map option/property renamed to `boxZoom`.
 * Removed `mouseEventToLatLng` method (bringed back in 0.4).

#### Development workflow improvements

 * Build system completely overhauled to be based on Node.js, Jake, JSHint and UglifyJS.
 * All code is now linted for errors and conformity with a strict code style (with JSHint), and wont build unless the check passes.

### Bugfixes

#### General bugfixes

 * Fixed a bug where `Circle` was rendered with incorrect radius (didn't take projection exagerration into account). [#331](https://github.com/Leaflet/Leaflet/issues/331)
 * Fixed a bug where `Map` `getBounds` would work incorrectly on a date line cross. [#295](https://github.com/Leaflet/Leaflet/issues/295)
 * Fixed a bug where polygons and polylines sometimes rendered incorrectly on some zoom levels. [#381](https://github.com/Leaflet/Leaflet/issues/381)
 * Fixed a bug where fast mouse wheel zoom worked incorrectly when approaching min/max zoom values.
 * Fixed a bug where `GeoJSON` `pointToLayer` option wouldn't work in a `GeometryCollection`. [#391](https://github.com/Leaflet/Leaflet/issues/391)
 * Fixed a bug with incorrect rendering of GeoJSON on a date line cross. [#354](https://github.com/Leaflet/Leaflet/issues/354)
 * Fixed a bug where map panning would stuck forever after releasing the mouse over an iframe or a flash object (thanks to [@sten82](https://github.com/sten82)). [#297](https://github.com/Leaflet/Leaflet/pull/297) [#64](https://github.com/Leaflet/Leaflet/issues/64)
 * Fixed a bug where mouse wheel zoom worked incorrectly if map is inside scrolled container (partially by [@chrillo](https://github.com/chrillo)). [#206](https://github.com/Leaflet/Leaflet/issues/206)
 * Fixed a bug where it was possible to add the same listener twice. [#281](https://github.com/Leaflet/Leaflet/issues/281)
 * Fixed a bug where `Circle` was rendered with incorrect radius (didn't take projection exaggeration into account). [#331](https://github.com/Leaflet/Leaflet/issues/331)
 * Fixed a bug where `Marker` `setIcon` was not working properly (by [@marphi](https://github.com/marphi)). [#218](https://github.com/Leaflet/Leaflet/pull/218) [#311](https://github.com/Leaflet/Leaflet/issues/311)
 * Fixed a bug where `Marker` `setLatLng` was not working if it's set before adding the marker to a map. [#222](https://github.com/Leaflet/Leaflet/issues/222)
 * Fixed a bug where marker popup would not move on `Marker` `setLatLng` (by [@tjarratt](https://github.com/tjarratt)). [#272](https://github.com/Leaflet/Leaflet/pull/272)
 * Fixed a bug where static properties of a child class would not override the parent ones.
 * Fixed broken popup `closePopup` option (by [@jgerigmeyer](https://github.com/jgerigmeyer)).
 * Fixed a bug that caused en error when dragging marker with icon without shadow (by [@anru](https://github.com/anru)). [#178](https://github.com/Leaflet/Leaflet/issues/178)
 * Fixed a typo in `Bounds` `contains` method (by [@anru](https://github.com/anru)). [#180](https://github.com/Leaflet/Leaflet/pull/180)
 * Fixed a bug where creating an empty `Polygon` with `new L.Polygon()` would raise an error.
 * Fixed a bug where drag event fired before the actual movement of layer (by [@anru](https://github.com/anru)). [#197](https://github.com/Leaflet/Leaflet/pull/197)
 * Fixed a bug where map click caused an error if dragging is initially disabled. [#196](https://github.com/Leaflet/Leaflet/issues/196)
 * Fixed a bug where map `movestart` event would fire after zoom animation.
 * Fixed a bug where attribution prefix would not update on `setPrefix`. [#195](https://github.com/Leaflet/Leaflet/issues/195)
 * Fixed a bug where `TileLayer` `load` event wouldn't fire in some edge cases (by [@dravnic](https://github.com/dravnic)).
 * Fixed a bug related to clearing background tiles after zooming (by [@neno-giscloud](https://github.com/neno-giscloud) & [@dravnic](https://github.com/dravnic)).
 * Fixed a bug that sometimes caused map flickering after zoom animation.
 * Fixed a bug related to cleaning up after removing tile layers (by [@dravnic](https://github.com/dravnic)). [#276](https://github.com/Leaflet/Leaflet/pull/276)
 * Fixed a bug that made selecting text in the attribution control impossible. [#279](https://github.com/Leaflet/Leaflet/issues/279)
 * Fixed a bug when initializing a map in a non-empty div. [#278](https://github.com/Leaflet/Leaflet/issues/278)
 * Fixed a bug where `movestart` didn't fire on panning animation.
 * Fixed a bug in Elliptical Mercator formula that affeted `EPSG:3395` CRS (by [@Savvkin](https://github.com/Savvkin)). [#358](https://github.com/Leaflet/Leaflet/pull/358)

#### Browser bugfixes

 * Fixed occasional crashes on Mac Safari (thanks to [@lapinos03](https://github.com/lapinos03)). [#191](https://github.com/Leaflet/Leaflet/issues/191)
 * Fixed a bug where resizing the map would sometimes make it blurry on WebKit (by [@mortenbekditlevsen](https://github.com/mortenbekditlevsen)). [#453](https://github.com/Leaflet/Leaflet/pull/453)
 * Fixed a bug that raised error in IE6-8 when clicking on popup close button. [#235](https://github.com/Leaflet/Leaflet/issues/235)
 * Fixed a bug with Safari not redrawing UI immediately after closing a popup. [#296](https://github.com/Leaflet/Leaflet/issues/296)
 * Fixed a bug that caused performance drop and high CPU usage when calling `setView` or `panTo` to the current center. [#231](https://github.com/Leaflet/Leaflet/issues/231)
 * Fixed a bug that caused map overlays to appear blurry in some cases under WebKit browsers.
 * Fixed a bug that was causing errors in some Webkit/Linux builds (requestAnimationFrame-related), thanks to Chris Martens.

#### Mobile browser bugfixes

 * Fixed a bug that caused an error when clicking vector layers under iOS. [#204](https://github.com/Leaflet/Leaflet/issues/204)
 * Fixed crash on Android 3+ when panning or zooming (by [@florian](https://github.com/florianf)). [#137](https://github.com/Leaflet/Leaflet/issues/137)
 * Fixed a bug on Android 2/3 that sometimes caused the map to disappear after zooming. [#69](https://github.com/Leaflet/Leaflet/issues/69)
 * Fixed a bug on Android 3 that caused tiles to shift position on a big map.
 * Fixed a bug that caused the map to pan when touch-panning inside a popup. [#452](https://github.com/Leaflet/Leaflet/issues/452)
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

 * Improved panning performance in Chrome and FF considerably with the help of `requestAnimationFrame`. [#130](https://github.com/Leaflet/Leaflet/issues/130)
 * Improved click responsiveness in mobile WebKit (now it happens without delay). [#26](https://github.com/Leaflet/Leaflet/issues/26)
 * Added tap tolerance (so click happens even if you moved your finger slighly when tapping).
 * Improved geolocation error handling: better error messages, explicit timeout, set world view on locateAndSetView failure. [#61](https://github.com/Leaflet/Leaflet/issues/61)

#### API improvements

 * Added **MultiPolyline** and **MultiPolygon** layers. [#77](https://github.com/Leaflet/Leaflet/issues/77)
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
 * Improved `L` definition to be compatible with CommonJS. [#122](https://github.com/Leaflet/Leaflet/issues/122)

### Bug fixes

#### General bugfixes

 * Fixed a bug where zooming is broken if the map contains a polygon and you zoom to an area where it's not visible. [#47](https://github.com/Leaflet/Leaflet/issues/47)
 * Fixed a bug where closed polylines would not appear on the map.
 * Fixed a bug where marker that was added, removed and then added again would not appear on the map. [#66](https://github.com/Leaflet/Leaflet/issues/66)
 * Fixed a bug where tile layer that was added, removed and then added again would not appear on the map.
 * Fixed a bug where some tiles would not load when panning across the date line. [#97](https://github.com/Leaflet/Leaflet/issues/97)
 * Fixed a bug where map div with `position: absolute` is reset to `relative`. [#100](https://github.com/Leaflet/Leaflet/issues/100)
 * Fixed a bug that caused an error when trying to add a marker without shadow in its icon.
 * Fixed a bug where popup content would not update on `setContent` call. [#94](https://github.com/Leaflet/Leaflet/issues/94)
 * Fixed a bug where double click zoom wouldn't work if popup is opened on map click
 * Fixed a bug with click propagation on popup close button. [#99](https://github.com/Leaflet/Leaflet/issues/99)
 * Fixed inability to remove ImageOverlay layer.

#### Browser bugfixes

 * Fixed a bug where paths would not appear in IE8.
 * Fixed a bug where there were occasional slowdowns before zoom animation in WebKit. [#123](https://github.com/Leaflet/Leaflet/issues/123)
 * Fixed incorrect zoom animation & popup styling in Opera 11.11.
 * Fixed popup fade animation in Firefox and Opera.
 * Fixed a bug where map isn't displayed in Firefox when there's an `img { max-width: 100% }` rule.

#### Mobile browsers bugfixes

 * Fixed a bug that prevented panning on some Android 2.1 (and possibly older) devices. [#84](https://github.com/Leaflet/Leaflet/issues/84)
 * Disabled zoom animation on Android by default because it's buggy on some devices (will be enabled back when it's stable enough). [#32](https://github.com/Leaflet/Leaflet/issues/32)
 * Fixed a bug where map would occasionally break while multi-touch-zooming on iOS. [#32](https://github.com/Leaflet/Leaflet/issues/32)
 * Fixed a bug that prevented panning/clicking on Android 3 tablets. [#121](https://github.com/Leaflet/Leaflet/issues/121)
 * Fixed a bug that prevented panning/clicking on Opera Mobile. [#138](https://github.com/Leaflet/Leaflet/issues/138)
 * Fixed potentional memory leak on WebKit when removing tiles, thanks to [@Scalar4eg](https://github.com/Scalar4eg). [#107](https://github.com/Leaflet/Leaflet/issues/107)

## 0.1 (2011-05-13)

Initial Leaflet release.

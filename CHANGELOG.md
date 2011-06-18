Leaflet Changelog
=================

## 0.3 (master)

## 0.2.1 (2011-06-18)

 * Fixed regression that caused error in `TileLayer.Canvas`

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

 * Initial Leaflet release.

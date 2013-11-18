Leaflet Changelog
=================

(all changes without author notice are by [@mourner](https://github.com/mourner))

## 0.8-dev (master)

An in-progress version being developed on the `master` branch. No changes since 0.7 release yet.

## 0.7 (November 18, 2013)

### Improvements

#### Usability improvements

* Added **support for IE11 touch devices** (by [@danzel](https://github.com/danzel), [@DanielX2](https://github.com/DanielX2) and [@fnicollet](https://github.com/fnicollet)). [#2039](https://github.com/Leaflet/Leaflet/pull/2039) [#2066](https://github.com/Leaflet/Leaflet/pull/2066) [#2037](https://github.com/Leaflet/Leaflet/issues/2037) [#2102](https://github.com/Leaflet/Leaflet/issues/2102)
* Added shift-double-click to zoom out shortcut. [#2185](https://github.com/Leaflet/Leaflet/issues/2185)
* Significantly improved **controls design on mobile** devices. [#1868](https://github.com/Leaflet/Leaflet/issues/1868) [#2012](https://github.com/Leaflet/Leaflet/issues/2012)
* Fixed and improved IE7-8 control and popup styles.
* Made subtle improvements to control styles on desktop browsers.
* Improved keyboard nav support so that map doesn't loose focus when you click on a control (by [@jacobtoye](https://github.com/jacobtoye)). [#2150](https://github.com/Leaflet/Leaflet/issues/2150) [#2148](https://github.com/Leaflet/Leaflet/issues/2148)
* Improved `maxBounds` behavior: now it doesn't force higher minimal zoom, and anchors to max bounds edges properly when zooming (by [@kapouer](https://github.com/kapouer) and [@mourner](https://github.com/mourner)). [#2187](https://github.com/Leaflet/Leaflet/pull/2187) [#1946](https://github.com/Leaflet/Leaflet/pull/1946) [#2081](https://github.com/Leaflet/Leaflet/issues/2081) [#2168](https://github.com/Leaflet/Leaflet/issues/2168) [#1908](https://github.com/Leaflet/Leaflet/issues/1908)

#### Map API improvements

* Made `Map` `setView` `zoom` argument optional. [#2056](https://github.com/Leaflet/Leaflet/issues/2056)
* Added `maxZoom` option to `Map` `fitBounds`. [#2101](https://github.com/Leaflet/Leaflet/issues/2101)
* Added `Map` `bounceAtZoomLimits` option that makes the map bounce when you pinch-zoom past limits (it worked like this before, but now you can disable this) (by [@trevorpowell](https://github.com/trevorpowell)). [#1864](https://github.com/Leaflet/Leaflet/issues/1864) [#2072](https://github.com/Leaflet/Leaflet/pull/2072)
* Added `distance` property to `Map` and `Marker` `dragend` events. [#2158](https://github.com/Leaflet/Leaflet/issues/2158) [#872](https://github.com/Leaflet/Leaflet/issues/872)
* Added optional support for center-oriented scroll and double-click zoom (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1939](https://github.com/Leaflet/Leaflet/issues/1939)
* Added `timestamp` to `Map` `locationfound` event. [#584](https://github.com/Leaflet/Leaflet/pull/584)
* Improved `Map` `invalidateSize` to call `moveend` immediately unless given `debounceMoveend: true` option (by [@jfirebaugh](https://github.com/jfirebaugh)). [#2181](https://github.com/Leaflet/Leaflet/issues/2181)

#### TileLayer API improvements

* Added `TileLayer` `maxNativeZoom` option that allows displaying tile layers on zoom levels above their maximum by **upscaling tiles**. [#1802](https://github.com/Leaflet/Leaflet/issues/1802) [#1798](https://github.com/Leaflet/Leaflet/issues/1798)
* Added `TileLayer` `tileloadstart` event (by [@tmcw](https://github.com/tmcw)). [#2142](https://github.com/Leaflet/Leaflet/pull/2142) [#2140](https://github.com/Leaflet/Leaflet/issues/2140)
* Improved `TileLayer` world size (used for wrapping and limiting tiles) to be derived from CRS instead of hardcoded, making it easier to use with custom projections (by [@perliedman](https://github.com/perliedman)). [#2160](https://github.com/Leaflet/Leaflet/pull/2160)

#### Marker API improvements

* Added CSS classes to draggable markers for easier customization (by [@snkashis](https://github.com/snkashis)). [#1902](https://github.com/Leaflet/Leaflet/issues/1902) [#1916](https://github.com/Leaflet/Leaflet/issues/1916)
* Added `Marker` `add` event (by [@tohaocean](https://github.com/tohaocean)). [#1942](https://github.com/Leaflet/Leaflet/issues/1942)
* Added `Marker` `getPopup` method (by [@scottharvey](https://github.com/scottharvey)). [#618](https://github.com/Leaflet/Leaflet/issues/618) [#1197](https://github.com/Leaflet/Leaflet/pull/1197)
* Added `Marker` `alt` option for adding `alt` text to markers (by [@jimmytidey](https://github.com/jimmytidey)). [#2112](https://github.com/Leaflet/Leaflet/pull/2112)

#### Vector layers API improvements

* Added `Path` `className` option for adding custom class names to vector layers.
* Added `Path` `lineCap` and `lineJoin` options (by [@palewire](https://github.com/palewire)). [#1843](https://github.com/Leaflet/Leaflet/issues/1843) [#1863](https://github.com/Leaflet/Leaflet/issues/1863) [#1881](https://github.com/Leaflet/Leaflet/issues/1881)
* Added ability to pass vector options to `GeoJSON` (by [@kapouer](https://github.com/kapouer)). [#2075](https://github.com/Leaflet/Leaflet/pull/2075)
* Improved `Polygon` `setLatLngs` to also accept holes (by [@aparshin](https://github.com/aparshin)). [#2095](https://github.com/Leaflet/Leaflet/pull/2095) [#1518](https://github.com/Leaflet/Leaflet/issues/1518)
* Added `GeoJSON` 3D format support and optional `altitude` argument to `LatLng` constructor (by [@Starefossen](https://github.com/Starefossen)). [#1822](https://github.com/Leaflet/Leaflet/pull/1822)
* Added `MultiPolygon` and `MultiPolyline` `openPopup` method. [#2046](https://github.com/Leaflet/Leaflet/issues/2046)

#### Popup API improvements

* Added `Popup` `update` method. [#1959](https://github.com/Leaflet/Leaflet/issues/1959)
* Added `Popup` `autoPanPaddingTopLeft` and `autoPanPaddingBottomRight` options (by [@albburtsev](https://github.com/albburtsev)). [#1972](https://github.com/Leaflet/Leaflet/issues/1972) [#1588](https://github.com/Leaflet/Leaflet/issues/1588)
* Added `Popup` `getContent` method. [#2100](https://github.com/Leaflet/Leaflet/issues/2100)
* Added `Popup` `getLatLng` method (by [@AndreyGeonya](https://github.com/AndreyGeonya)). [#2097](https://github.com/Leaflet/Leaflet/pull/2097)

#### Misc API improvements

* Added `ImageOverlay` `setUrl` and `getAttribution` methods and `attribution` option (by [@stsydow](https://github.com/stsydow)). [#1957](https://github.com/Leaflet/Leaflet/issues/1957) [#1958](https://github.com/Leaflet/Leaflet/issues/1958)
* Added localization support for the zoom control (by [@Danielku15](https://github.com/Danielku15)). [#1953](https://github.com/Leaflet/Leaflet/issues/1953) [#1643](https://github.com/Leaflet/Leaflet/issues/1643) [#1953](https://github.com/Leaflet/Leaflet/pull/1953)
* Significantly improved `L.Util.template` performance (affects `L.TileLayer`) by introducing cached template compilation (by [@calvinmetcalf](https://github.com/calvinmetcalf)). [#1969](https://github.com/Leaflet/Leaflet/issues/1969) [#1968](https://github.com/Leaflet/Leaflet/issues/1968) [#1554](https://github.com/Leaflet/Leaflet/issues/1554)
* Added `CRS` `getSize` for getting the world size in pixels (by [@perliedman](https://github.com/perliedman)). [#2160](https://github.com/Leaflet/Leaflet/pull/2160)
* Added `leaflet-drag-target` CSS class to an element under cursor when dragging for more flexible customization. [#2164](https://github.com/Leaflet/Leaflet/issues/2164) [#1902](https://github.com/Leaflet/Leaflet/issues/1902)
* Improved `L.DomUtil` `addClass`, `removeClass`, `hasClass` methods performance and fixed it to work with SVG elements. [#2164](https://github.com/Leaflet/Leaflet/issues/2164)

#### Dev workflow improvements

* Added an [official FAQ](https://github.com/Leaflet/Leaflet/blob/master/FAQ.md).
* Cleaned up and moved old IE styles to `leaflet.css` and removed `leaflet.ie.css`, so **no need for IE conditional comment** when including Leaflet now. [#2159](https://github.com/Leaflet/Leaflet/issues/2159)
* Added `leaflet-oldie` CSS class to map container in IE7-8 for easier styling. [#2159](https://github.com/Leaflet/Leaflet/issues/2159)
* Officially **dropped support for IE6**. Nobody cares anyway, and Leaflet should still be accessible on it. [#2159](https://github.com/Leaflet/Leaflet/issues/2159)
* Improved the build system to check JS errors in spec files. [#2151](https://github.com/Leaflet/Leaflet/issues/2151)
* Fixed `jake` command to run tests before building the source. [#2151](https://github.com/Leaflet/Leaflet/issues/2151)
* Switched the main file in `package.json` to unminified version for NPM/Browserify (by [@icetan](https://github.com/icetan)). [#2109](https://github.com/Leaflet/Leaflet/pull/2109)

### Bugfixes

#### 0.6 regression fixes

* Fixed a **memory leak in iOS7** that could crash Safari when handling lots of objects (e.g. 1000 markers) (by [@danzel](https://github.com/danzel)). [#2149](https://github.com/Leaflet/Leaflet/pull/2149) [#2122](https://github.com/Leaflet/Leaflet/issues/2122)
* Fixed a bug that caused lag at the beginning of panning in Chrome (by [@jfirebaugh](https://github.com/jfirebaugh)). [#2163](https://github.com/Leaflet/Leaflet/issues/2163)
* Fixed a regression that made the layers control unscrollable in Firefox. [#2029](https://github.com/Leaflet/Leaflet/issues/2029)
* Fixed a regression that broke `worldCopyJump: true` option (by [@fastrde](https://github.com/fastrde)). [#1904](https://github.com/Leaflet/Leaflet/issues/1904) [#1831](https://github.com/Leaflet/Leaflet/issues/1831) [#1982](https://github.com/Leaflet/Leaflet/issues/1982)
* Fixed a regression where a first map click after popup close button click was ignored (by [@fastrde](https://github.com/fastrde)). [#1537](https://github.com/Leaflet/Leaflet/issues/1537) [#1963](https://github.com/Leaflet/Leaflet/issues/1963) [#1925](https://github.com/Leaflet/Leaflet/issues/1925)
* Fixed a regression where `L.DomUtil.getMousePosition` would throw an error if container argument not provided (by [@scooterw](https://github.com/scooterw)). [#1826](https://github.com/Leaflet/Leaflet/issues/1826) [#1928](https://github.com/Leaflet/Leaflet/issues/1928) [#1926](https://github.com/Leaflet/Leaflet/issues/1926)
* Fixed a regression with vector layers positioning when zooming on IE10+ touch devices (by [@danzel](https://github.com/danzel)). [#2002](https://github.com/Leaflet/Leaflet/issues/2002) [#2000](https://github.com/Leaflet/Leaflet/issues/2000)
* Fixed a regression with `maxBounds` behaving weirdly on panning inertia out of bounds. [#2168](https://github.com/Leaflet/Leaflet/issues/2168)

#### General bugfixes

* Fixed a bug where the map could freeze if centered and immediately recentered on initialization. [#2071](https://github.com/Leaflet/Leaflet/issues/2071)
* Fixed a bug where all maps except the first one on a page didn't track window resize. [#1980](https://github.com/Leaflet/Leaflet/issues/1980)
* Fixed a bug where tiles in `EPSG:3395` projection were shifted (by [@aparshin](https://github.com/aparshin)). [#2020](https://github.com/Leaflet/Leaflet/issues/2020)
* Fixed a bug where scale control displayed wrong scale when on pages with `box-sizing: border-box`.
* Fixed a bug where zoom control button didn't appear as disabled if map was initialized at the zoom limit. [#2083](https://github.com/Leaflet/Leaflet/issues/2083)
* Fixed a bug where box zoom also triggered a map click event (by [@fastrde](https://github.com/fastrde)). [#1951](https://github.com/Leaflet/Leaflet/issues/1951) [#1884](https://github.com/Leaflet/Leaflet/issues/1884)
* Fixed a bug where shift-clicking on a map immediately after a drag didn't trigger a click event (by [@fastrde](https://github.com/fastrde)). [#1952](https://github.com/Leaflet/Leaflet/issues/1952) [#1950](https://github.com/Leaflet/Leaflet/issues/1950)
* Fixed a bug where content was updated twice when opening a popup. [#2137](https://github.com/Leaflet/Leaflet/issues/2137)
* Fixed a bug that could sometimes cause infinite panning loop when using `maxBounds` (by [@kapouer](https://github.com/kapouer) and [@mourner](https://github.com/mourner)). [#2187](https://github.com/Leaflet/Leaflet/pull/2187) [#1946](https://github.com/Leaflet/Leaflet/pull/1946) [#2081](https://github.com/Leaflet/Leaflet/issues/2081) [#2168](https://github.com/Leaflet/Leaflet/issues/2168) [#1908](https://github.com/Leaflet/Leaflet/issues/1908)

#### Browser bugfixes

* Fixed a bug where keyboard `+` no longer zoomed the map on FF 22+ (by [@fastrde](https://github.com/fastrde)). [#1943](https://github.com/Leaflet/Leaflet/issues/1943) [#1981](https://github.com/Leaflet/Leaflet/issues/1981)
* Fixed a bug where calling `Map` `remove` throwed an error in IE6-8. [#2015](https://github.com/Leaflet/Leaflet/issues/2015)
* Fixed a bug where `isArray` didn't work in rare cases in IE9. [#2077](https://github.com/Leaflet/Leaflet/issues/2077)
* Fixed a bug where FF sometimes produced console warnings when animating markers. [#2090](https://github.com/Leaflet/Leaflet/issues/2090)
* Fixed a bug where mouse wasn't handled correctly on RTL pages in some cases (by [@danzel](https://github.com/danzel)). [#1986](https://github.com/Leaflet/Leaflet/issues/1986) [#2136](https://github.com/Leaflet/Leaflet/pull/2136)

#### Mobile bugfixes

* Fixed a bug where tiles could **disappear after zooming on Chrome 30+ for Android** (by [@danzel](https://github.com/danzel)). [#2152](https://github.com/Leaflet/Leaflet/pull/2152) [#2078](https://github.com/Leaflet/Leaflet/issues/2078)
* Fixed a bug on IE10+ touch where pinch-zoom also caused click (by [@danzel](https://github.com/danzel)). [#2117](https://github.com/Leaflet/Leaflet/pull/2117) [#2094](https://github.com/Leaflet/Leaflet/issues/2094)
* Fixed a bug on IE10+ touch where controls didn't loose the pressed state after tapping (by [@danzel](https://github.com/danzel)). [#2111](https://github.com/Leaflet/Leaflet/pull/2111) [#2103](https://github.com/Leaflet/Leaflet/issues/2103)
* Fixed a bug where clicking on layers control labels on iOS throwed an error (by [@olemarkus](https://github.com/olemarkus) and [@dagjomar](https://github.com/dagjomar)). [#1984](https://github.com/Leaflet/Leaflet/issues/1984) [#1989](https://github.com/Leaflet/Leaflet/issues/1989)

#### Map API bugfixes

* Fixed a bug where `Map` `getCenter` returned old result after map container size changed (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1940](https://github.com/Leaflet/Leaflet/issues/1940) [#1919](https://github.com/Leaflet/Leaflet/issues/1919)
* Fixed `Map` `invalidateSize` rounding issues when changing map size by an odd pixel amount (by [@russelldavis](https://github.com/russelldavis)). [#1931](https://github.com/Leaflet/Leaflet/issues/1931)
* Fixed a bug where `Map` `removeLayer` didn't return `this` in a corner case (by [@jfirebaugh](https://github.com/jfirebaugh)).
* Fixed a bug where calling `Map` `setZoom` before `setView` would throw an error. [#1449](https://github.com/Leaflet/Leaflet/issues/1449)

#### Layers API bugfixes

* Fixed a bug where `Popup` `setLatLng` unnecessarily reset content and updated layout; works much faster now. [#2167](https://github.com/Leaflet/Leaflet/issues/2167)
* Fixed a bug where `toGeoJSON` of layers originated from GeoJSON GeometryCollection and MultiPoint didn't work properly (wasn't round-tripped). [#1956](https://github.com/Leaflet/Leaflet/issues/1956)
* Fixed `GeoJSON` dependencies in build configuration that could lead to a broken custom build in some situations (by [@alubchuk](https://github.com/alubchuk)). [#1909](https://github.com/Leaflet/Leaflet/issues/1909)
* Fixed a bug where `CircleMarker` popup placement wasn't updated after calling `setLatLng` (by [@snkashis](https://github.com/snkashis)). [#1921](https://github.com/Leaflet/Leaflet/issues/1921) [#1927](https://github.com/Leaflet/Leaflet/issues/1927)
* Fixed a bug where popup anchor wasn't updated on `Marker` `setIcon` (by [@snkashis](https://github.com/snkashis)). [#1874](https://github.com/Leaflet/Leaflet/issues/1874) [#1891](https://github.com/Leaflet/Leaflet/issues/1891)
* Fixed a bug with GeoJSON not throwing a descriptive error if a polygon has zero length inner ring (by [@snkashis](https://github.com/snkashis)). [#1917](https://github.com/Leaflet/Leaflet/issues/1917) [#1918](https://github.com/Leaflet/Leaflet/issues/1918)
* Fixed a bug where `FeatureGroup` would break when using non-evented children layers (by [@tmcw](https://github.com/tmcw)). [#2032](https://github.com/Leaflet/Leaflet/pull/2032) [#1962](https://github.com/Leaflet/Leaflet/issues/1962)
* Fixed a bug where `CircleMarker` `getRadius` would always return `null`. [#2016](https://github.com/Leaflet/Leaflet/issues/2016) [#2017](https://github.com/Leaflet/Leaflet/pull/2017)
* Fixed a bug where `TileLayer.WMS` didn't work with WMS 1.3 & EPSG4326 projection (by [@Bobboya](https://github.com/Bobboya)). [#1897](https://github.com/Leaflet/Leaflet/pull/1897)
* Fixed a bug where `FeatureGroup` events `e.layer` was sometimes empty in old IE. [#1938](https://github.com/Leaflet/Leaflet/issues/1938)

#### Misc API bugfixes

* Fixed a bug where `L.latLngBounds` didn't accept simple object `LatLng` form (by [@Gnurfos](https://github.com/Gnurfos)). [#2025](https://github.com/Leaflet/Leaflet/issues/2025) [#1915](https://github.com/Leaflet/Leaflet/issues/1915)
* Fixed a bug where `L.Util.tempalate` wouldn't work with double quotes in the string (by [@jieter](https://github.com/jieter)). [#1968](https://github.com/Leaflet/Leaflet/issues/1968) [#2121](https://github.com/Leaflet/Leaflet/pull/2121) [#2120](https://github.com/Leaflet/Leaflet/issues/2120)
* Fixed a bug where attribution control that was added to a map after attributed layers didn't have the corresponding attributions (by [@snkashis](https://github.com/snkashis)). [#2177](https://github.com/Leaflet/Leaflet/issues/2177) [#2178](https://github.com/Leaflet/Leaflet/pull/2178)


## 0.6.4 (July 25, 2013)

* Fixed a regression where `fitBounds` and `setMaxBounds` could freeze the browser in some situations. [#1895](https://github.com/Leaflet/Leaflet/issues/1895) [1866](https://github.com/Leaflet/Leaflet/issues/1866)
* Fixed a bug where click on a map on a page with horizontal scroll caused the page to scroll right (by [@mstrelan](https://github.com/mstrelan)). [#1901](https://github.com/Leaflet/Leaflet/issues/1901)

## 0.6.3 (July 17, 2013)

### Regression fixes

* Fixed a regression where mouse interaction had incorrect coordinates in some map positioning cases (by [@scooterw](https://github.com/scooterw)). [#1826](https://github.com/Leaflet/Leaflet/issues/1826) [#1684](https://github.com/Leaflet/Leaflet/issues/1684) [#1745](https://github.com/Leaflet/Leaflet/issues/1745) [#1](https://github.com/Leaflet/Leaflet/issues/1)
* Fixed a regression that prevented the map from responding to drag on areas covered with `ImageOverlay` (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1821](https://github.com/Leaflet/Leaflet/issues/1821)
* Fixed a regression where `layerremove` and `layeradd` were fired before the corresponding action finishes (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1846](https://github.com/Leaflet/Leaflet/issues/1846)
* Fixed a regression with `worldCopyJump: true` breaking the map on small zoom levels (by [@danzel](https://github.com/danzel)). [#1831](https://github.com/Leaflet/Leaflet/issues/1831)
* Fixed a regression where `Marker` shadow didn't animate on zoom after using `setIcon`. [#1768](https://github.com/Leaflet/Leaflet/issues/1768)
* Fixed a regression where the map would stuck when trying to animate zoom before any tile layers are added to the map. [#1484](https://github.com/Leaflet/Leaflet/issues/1484) [#1845](https://github.com/Leaflet/Leaflet/issues/1845)
* Fixed a regression with the layers control and popups closing on inside click in IE < 9. [#1850](https://github.com/Leaflet/Leaflet/issues/1850)
* Fixed a regression where scrolled popup content woudln't scroll in FF (by [@jfirebaugh](https://github.com/jfirebaugh)).

### Bug fixes

* Fixed vector feature flickering on Safari Mac for screen < 2000px. [#902](https://github.com/Leaflet/Leaflet/issues/902)
* Fixed a bug where `GeoJSON` ignored non-feature geometries passed in an array. [#1840](https://github.com/Leaflet/Leaflet/issues/1840)
* Fixed a bug where `Map` `minZoom` and `maxZoom` didn't always override values derived from the added tile layers. [1848](https://github.com/Leaflet/Leaflet/issues/1848)
* Fixed a bug where `TileLayer.Canvas` wasn't immediately redrawn when `redraw` is called (by [@tofferrosen](https://github.com/tofferrosen)). [#1797](https://github.com/Leaflet/Leaflet/issues/1797) [#1817](https://github.com/Leaflet/Leaflet/issues/1817)
* Fixed a bug where `FeatureGroup` still fired `layerremove` event on `removeLayer` even if the given layer wan't present in the group (by (by [@danzel](https://github.com/danzel))). [#1847](https://github.com/Leaflet/Leaflet/issues/1847) [#1858](https://github.com/Leaflet/Leaflet/issues/1858)
* Fixed a bug where `Marker` `setOpacity` wasn't returning the marker (by [@freepius44](https://github.com/freepius44)). [#1851](https://github.com/Leaflet/Leaflet/issues/1851)
* Fixed a bug where removing the map element from the DOM before panning transition has finished could keep a setInterval loop running forever (by [@rutkovsky](https://github.com/rutkovsky)). [#1825](https://github.com/Leaflet/Leaflet/issues/1825) [#1856](https://github.com/Leaflet/Leaflet/issues/1856)
* Fixed mobile styles to apply to `leaflet-bar` elements.

### Improvements

* Added ability to pass zoom/pan animation options to `setMaxBounds` (by [@davidjb](http://git.io/djb)). [#1834](https://github.com/Leaflet/Leaflet/pull/1834)
* Added `MultiPolyline` and `MultiPolygon` `getLatLngs` method. [#1839](https://github.com/Leaflet/Leaflet/issues/1839)

### Dev Workflow improvements

* Leaflet builds (*.js files in the `dist` folder) were removed from the repo and are now done automatically on each commit for `master` and `stable` branches by [Travis CI](travis-ci.org/Leaflet/Leaflet). The download links are on the [Leafet download page](http://leafletjs.com/download.html).

## 0.6.2 (June 28, 2013)

 * Fixed a bug that caused wrong tile layers stacking order when using opacity < 1 (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1804](https://github.com/Leaflet/Leaflet/issues/1804) [#1790](https://github.com/Leaflet/Leaflet/issues/1790) [#1667](https://github.com/Leaflet/Leaflet/issues/1667)
 * Fixed a regression that caused tiles selection when double-clicking absolutely positioned maps with vector layers in it in Firefox (WTF!) (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1807](https://github.com/Leaflet/Leaflet/issues/1807)
 * Fixed a regression with a wrong cursor when dragging a map with vector layers, and tiles becoming selected on double click (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1800](https://github.com/Leaflet/Leaflet/issues/1800)
 * Fixed a regression that caused flickering of tiles near map border on zoom animation in Chrome.

## 0.6.1 (June 27, 2013)

 * Fixed a regression with mouse wheel zooming too fast on Firefox (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1788](https://github.com/Leaflet/Leaflet/issues/1788)
 * Fixed a regression with broken zooming on maps with EPSG3395 projection. [#1796](https://github.com/Leaflet/Leaflet/issues/1796)
 * Fixed a bug where zoom buttons inherited Bootstrap link hover styles. [#1791](https://github.com/Leaflet/Leaflet/issues/1791)

## 0.6 (June 26, 2013)

### Breaking changes

 * Moved polyline editing code into [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw) plugin (where it fits much better along with all other editing and drawing handlers). The API remains the same.
 * Dropped support for environments that augment `Object.prototype` (luckily it's a thing of the past nowadays).
 * `Map` `invalidateSize` no longer fires `move` and `moveend` events if the map size didn't change. [#1819](https://github.com/Leaflet/Leaflet/issues/1819)

### Improvements

#### Usability and performance improvements

 * **Improved zoom control design** - cleaner, simpler, more accessible (mostly by [@jacobtoye](https://github.com/jacobtoye)). [#1313](https://github.com/Leaflet/Leaflet/issues/1313)
 * Updated `Control.Layers` icon (designed by Volker Kinkelin), added retina version and SVG source. [#1739](https://github.com/Leaflet/Leaflet/issues/1739)
 * Added keyboard accessibility to markers (you can now tab to them and press enter for click behavior). [#1355](https://github.com/Leaflet/Leaflet/issues/1355)
 * Improved `TileLayer` zoom animation to eliminate flickering in case one tile layer on top of another or when zooming several times quickly (by [@mourner](https://github.com/mourner) with lots of fixes from [@danzel](https://github.com/danzel)). [#1140](https://github.com/Leaflet/Leaflet/issues/1140) [#1437](https://github.com/Leaflet/Leaflet/issues/1437) [#52](https://github.com/Leaflet/Leaflet/issues/52)
 * Subtly improved default popup styles
 * Improved attribution control to be much less obtrusive (no "powered by", just a Leaflet link). You can still remove the prefix with `map.attributionControl.setPrefix('')` if you need.
 * Improved zoom behavior so that there's no drift of coordinates when you change zoom back and forth without panning. [#426](https://github.com/Leaflet/Leaflet/issues/426)
 * Improved double click behavior to zoom while keeping the clicked point fixed (by [@ansis](https://github.com/ansis)). [#1582](https://github.com/Leaflet/Leaflet/issues/1582)
 * Improved dragging behavior to not get stuck if mouse moved outside of an iframe containing the map (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1277](https://github.com/Leaflet/Leaflet/issues/1277) [#1782](https://github.com/Leaflet/Leaflet/issues/1782) [#1786](https://github.com/Leaflet/Leaflet/issues/1786)
 * Improved box zoom to be cancelable by pressing Escape (by [@yohanboniface](https://github.com/yohanboniface)). [#1438](https://github.com/Leaflet/Leaflet/issues/1438)
 * Improved `Marker` popups to close on marker click if opened (by [@popox](https://github.com/popox)). [#1761](https://github.com/Leaflet/Leaflet/issues/1761)
 * Significantly improved mass layer removal performance (by [@jfgirard](https://github.com/jfgirard) with fixes from [@danzel](https://github.com/danzel)). [#1141](https://github.com/Leaflet/Leaflet/pull/1141) [#1514](https://github.com/Leaflet/Leaflet/pull/1514)

#### API improvements

##### Layers API improvements

 * Added `toGeoJSON` method to various layer types, allowing you to **save your Leaflet layers as GeoJSON**. (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1462](https://github.com/Leaflet/Leaflet/issues/1462) [#712](https://github.com/Leaflet/Leaflet/issues/712) [#1779](https://github.com/Leaflet/Leaflet/issues/1779)
 * Added `GeoJSON` `coordsToLatLng` option for dealing with GeoJSON that has non-WGS84 coords (thanks to [@moonlite](https://github.com/moonlite)). [#888](https://github.com/Leaflet/Leaflet/issues/888) [#886](https://github.com/Leaflet/Leaflet/issues/886)
 * Improved `Marker` to reuse icon DOM elements when changing icons on the fly (e.g. fixes problems when changing icon on mouse hover) (by [@robpvn](https://github.com/robpvn) & [@danzel](https://github.com/danzel)). [#1726](https://github.com/Leaflet/Leaflet/issues/1726) [#561](https://github.com/Leaflet/Leaflet/issues/561) [#1753](https://github.com/Leaflet/Leaflet/issues/1753) [#1754](https://github.com/Leaflet/Leaflet/pull/1754)
 * Added `latlng` property to `Marker` mouse event data. [#1613](https://github.com/Leaflet/Leaflet/issues/1613)
 * Added `LayerGroup` `hasLayer` method (by [@rvlasveld](https://github.com/rvlasveld)). [#1282](https://github.com/Leaflet/Leaflet/issues/1282) [#1300](https://github.com/Leaflet/Leaflet/pull/1300)
 * Added `LayerGroup` `getLayers` method (by [@tmcw](https://github.com/tmcw)). [#1469](https://github.com/Leaflet/Leaflet/pull/1469)
 * Added `LayerGroup` `getLayer` method (by [@gumballhead](https://github.com/gumballhead)). [#1650](https://github.com/Leaflet/Leaflet/pull/1650)
 * Improved `LayerGroup` `removeLayer` method to also accept layer `id` (by [@gumballhead](https://github.com/gumballhead)). [#1642](https://github.com/Leaflet/Leaflet/pull/1642)
 * Added `Path` `pointerEvents` option for setting pointer-events on SVG-powered vector layers (by [@inpursuit](https://github.com/inpursuit)). [#1053](https://github.com/Leaflet/Leaflet/pull/1053)
 * Improved `Polygon` to filter out last point if it's equal to the first one (to fix GeoJSON polygon issues) (by [@snkashis](https://github.com/snkashis)). [#1153](https://github.com/Leaflet/Leaflet/pull/1153) [#1135](https://github.com/Leaflet/Leaflet/issues/1135)
 * Improved paths with `clickable: false` to allow mouse events to pass through to objects underneath (by [@snkashis](https://github.com/snkashis)). [#1384](https://github.com/Leaflet/Leaflet/pull/1384) [#1281](https://github.com/Leaflet/Leaflet/issues/1281)
 * Improved `L.Util.template` (and correspondingly url-related `TileLayer` options) to support functions for data values (by [@olegsmith](https://github.com/olegsmith)). [#1554](https://github.com/Leaflet/Leaflet/pull/1554)
 * Added `TileLayer` `getContainer` method (by [@tmcw](https://github.com/tmcw)). [#1433](https://github.com/Leaflet/Leaflet/pull/1433)
 * Fixed `TileLayer.Canvas` `redraw` method chaining (by [@jieter](https://github.com/jieter)). [#1287](https://github.com/Leaflet/Leaflet/pull/1287)
 * Added `TileLayer.WMS` `crs` option to be able to use WMS of CRS other than the map CRS (by [@kengu](https://github.com/kengu)). [#942](https://github.com/Leaflet/Leaflet/issues/942) [#945](https://github.com/Leaflet/Leaflet/issues/945)
 * Added `popupopen` and `popupclose` events to various layers (by [@Koc](https://github.com/Koc)). [#738](https://github.com/Leaflet/Leaflet/pull/738)
 * Added `Popup` `keepInView` option (thanks to [@lapo-luchini](https://github.com/lapo-luchini)) that prevents the popup from going off-screen while it's opened. [#1308](https://github.com/Leaflet/Leaflet/pull/1308) [#1052](https://github.com/Leaflet/Leaflet/issues/1052)
 * Added `Marker` `togglePopup` method (by [@popox](https://github.com/popox)). [#1761](https://github.com/Leaflet/Leaflet/issues/1761)
 * Added `Popup` `closeOnClick` option that overrides the same `Map` option for specific popups (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1669](https://github.com/Leaflet/Leaflet/issues/1669)
 * Improved `Marker` and `Path` `bindPopup` method to also accept `Popup` objects (by [@snkashis](https://github.com/snkashis)). [#1385](https://github.com/Leaflet/Leaflet/pull/1385) [#1208](https://github.com/Leaflet/Leaflet/issues/1208) [#1402](https://github.com/Leaflet/Leaflet/pull/1402)
 * Added `Marker` `setPopupContent` method (by [@snkashis](https://github.com/snkashis)). [#1373](https://github.com/Leaflet/Leaflet/pull/1373)

##### Map API improvements

 * Improved all view changing methods of `Map` (`setView`, `panTo`, `setZoom`, `fitBounds`, etc.) to accept an options object, including the ability to precisely control zoom/pan animations they cause (force disable/enable, etc.). [#1617](https://github.com/Leaflet/Leaflet/pull/1617) [#1616](https://github.com/Leaflet/Leaflet/issues/1616) [#340](https://github.com/Leaflet/Leaflet/issues/340) [#483](https://github.com/Leaflet/Leaflet/issues/483) [#1164](https://github.com/Leaflet/Leaflet/issues/1164) [#1420](https://github.com/Leaflet/Leaflet/issues/1420)
 * Improved `Map` `fitBounds` method to accept `padding` (or `paddingTopLeft` and `paddingBottomRight`) options, allowing you to zoom to an area with a certain padding in pixels (usually left for controls). [#859](https://github.com/Leaflet/Leaflet/issues/859)
 * Improved `Map` `invalidateSize` to accept options object (`animate` and `pan`, the latter controls if it pans the map on size change). (by [@jacobtoye](https://github.com/jacobtoye) and [@mourner](https://github.com/mourner)). [#1766](https://github.com/Leaflet/Leaflet/issues/1766) [#1767](https://github.com/Leaflet/Leaflet/issues/1767)
 * Added `Map` `setZoomAround` method for zooming while keeping a certain point fixed (used by scroll and double-click zooming). [#1157](https://github.com/Leaflet/Leaflet/issues/1157)
 * Added `Map` `remove` method to properly destroy the map and clean up all events, and added corresponding `unload` event (by [@jfirebaugh](https://github.com/jfirebaugh) and [@mourner](https://github.com/mourner)). [#1434](https://github.com/Leaflet/Leaflet/issues/1434) [#1101](https://github.com/Leaflet/Leaflet/issues/1101) [#1621](https://github.com/Leaflet/Leaflet/issues/1621)
 * Added `Map` `tap` handler that now contains all mobile hacks for enabling quick taps and long holds and `tapTolerance` option specifying the number of pixels you can shift your finger for click to still fire.
 * Added `Map` `zoomAnimationThreshold` for setting the max zoom difference with which zoom animation can occur. [#1377](https://github.com/Leaflet/Leaflet/issues/1377)
 * Improved `Map` `openPopup` method to also accept `(content, latlng)` signature as a shortcut.
 * Improved `Map` `closePopup` method to optionally accept a popup object to close. [#1641](https://github.com/Leaflet/Leaflet/issues/1641)
 * Improved `Map` `stopLocate` method to abort resetting map view if calling `locate` with `setView` option. [#747](https://github.com/Leaflet/Leaflet/issues/747)
 * Improved `Map` to throw exception if the specified container id is not found (by [@tmcw](htts://github.com/tmcw)). [#1574](https://github.com/Leaflet/Leaflet/pull/1574)
 * Improved `Map` `locationfound` event to pass all location data (heading, speed, etc.). [#984](https://github.com/Leaflet/Leaflet/issues/984) [#584](https://github.com/Leaflet/Leaflet/issues/584) [#987](https://github.com/Leaflet/Leaflet/issues/987) [#1028](https://github.com/Leaflet/Leaflet/issues/1028)
 * Added `Map` `resize` event. [#1564](https://github.com/Leaflet/Leaflet/issues/1564)
 * Added `Map` `zoomlevelschange` event that triggers when the current zoom range (min/max) changes (by [@moonlite](https://github.com/moonlite)). [#1376](https://github.com/Leaflet/Leaflet/pull/1376)

##### Controls API improvements

 * Added **generic toolbar classes** for reuse by plugin developers (used by zoom control).
 * Added `Map` `baselayerchange`, `overlayadd` and `overlayremove` events fired by `Control.Layers` (by [@calvinmetcalf](https://github.com/calvinmetcalf) and [@Xelio](https://github.com/Xelio)). [#1286](https://github.com/Leaflet/Leaflet/issues/1286) [#1634](https://github.com/Leaflet/Leaflet/issues/1634)
 * Added `Control` `getContainer` method. [#1409](https://github.com/Leaflet/Leaflet/issues/1409)

##### Misc API improvements

 * Made Leaflet classes compatible with **CoffeeScript class inheritance** syntax (by [@calvinmetcalf](https://github.com/calvinmetcalf)). [#1345](https://github.com/Leaflet/Leaflet/pull/1345) [#1314](https://github.com/Leaflet/Leaflet/issues/1314)
 * Added `cleanAllEventListeners` method (aliased to `off` without arguments) to all events-enabled objects (by [@iirvine](https://github.com/iirvine)). [#1599](https://github.com/Leaflet/Leaflet/issues/1599)
 * Added `addOneTimeEventListener` method (aliased to `once`) to all events-enabled objects (by [@iirvine](https://github.com/iirvine)). [#473](https://github.com/Leaflet/Leaflet/issues/473) [#1596](https://github.com/Leaflet/Leaflet/issues/1596)
 * Added ability to pass coordinates as simple objects (`{lat: 50, lon: 30}` or `{lat: 50, lng: 30}`). [#1412](https://github.com/Leaflet/Leaflet/issues/1412)
 * Added `LatLngBounds` `getNorth`, `getEast`, `getSouth`, `getWest` methods (by [@yohanboniface](https://github.com/yohanboniface)). [#1318](https://github.com/Leaflet/Leaflet/issues/1318)
 * Added `AMD` support (Leaflet now registers itself as a `leaflet` AMD module) (with fixes from [@sheppard](https://github.com/sheppard)). [#1364](https://github.com/Leaflet/Leaflet/issues/1364) [#1778](https://github.com/Leaflet/Leaflet/issues/1778)
 * Added `L.Util.trim` function (by [@kristerkari](https://github.com/kristerkari)). [#1607](https://github.com/Leaflet/Leaflet/pull/1607)

#### Development workflow improvements

 * Switched from Jasmine to [Mocha](http://visionmedia.github.io/mocha/) with Expect.js (matchers) and Sinon (spies) for tests (by [@tmcw](https://github.com/tmcw) & [@jfirebaugh](https://github.com/jfirebaugh)). [#1479](https://github.com/Leaflet/Leaflet/issues/1479)
 * Added [Karma](http://karma-runner.github.io) integration for running tests in a headless PhantomJS instance and code coverage reporting (by [@edjafarov](https://github.com/edjafarov)). [#1326](https://github.com/Leaflet/Leaflet/issues/1326) [#1340](https://github.com/Leaflet/Leaflet/pull/1340)
 * Added [Travis CI integration](https://travis-ci.org/Leaflet/Leaflet) for linting and running tests for each commit and pull request automatically (by [@edjafarov](https://github.com/edjafarov)). [#1336](https://github.com/Leaflet/Leaflet/issues/1336)
 * Significantly improved test coverage
 * Added compatibility with lazy evaluation scripts (by [@kristerkari](https://github.com/kristerkari)). [#1288](https://github.com/Leaflet/Leaflet/issues/1288) [#1607](https://github.com/Leaflet/Leaflet/issues/1607) [#1288](https://github.com/Leaflet/Leaflet/issues/1288)

### Bugfixes

#### General bugfixes

 * Fixed lots of issues with extent restriction by `Map` `maxBounds`. [#1491](https://github.com/Leaflet/Leaflet/issues/1491) [#1475](https://github.com/Leaflet/Leaflet/issues/1475) [#1194](https://github.com/Leaflet/Leaflet/issues/1194) [#900](https://github.com/Leaflet/Leaflet/issues/900) [#1333](https://github.com/Leaflet/Leaflet/issues/1333)
 * Fixed occasional crashes by disabling zoom animation if changing zoom level by more than 4 levels. [#1377](https://github.com/Leaflet/Leaflet/issues/1377)
 * Fixed a bug with that caused stuttery keyboard panning in some cases (by [@tmcw](https://github.com/tmcw)). [#1710](https://github.com/Leaflet/Leaflet/issues/1710)
 * Fixed a bug that caused unwanted scrolling of the page to the top of the map on focus. [#1228](https://github.com/Leaflet/Leaflet/issues/1228) [#1540](https://github.com/Leaflet/Leaflet/issues/1540)
 * Fixed a bug where clicking on a marker with an open popup caused the popup to faded in again (by [@snkashis](https://github.com/snkashis)). [#506](https://github.com/Leaflet/Leaflet/issues/560) [#1386](https://github.com/Leaflet/Leaflet/pull/1386)
 * Fixed a bug where zoom buttons disabled state didn't update on min/max zoom change (by [@snkashis](https://github.com/snkashis)). [#1372](https://github.com/Leaflet/Leaflet/pull/1372) [#1328](https://github.com/Leaflet/Leaflet/issues/1328)
 * Fixed a bug where scrolling slightly wouldn't always zoom out the map (by [@cschwarz](https://github.com/cschwarz)). [#1575](https://github.com/Leaflet/Leaflet/pull/1575)
 * Fixed popup close button to not leave an outline after clicking on it and reopening the popup (by [@dotCypress](https://github.com/dotCypress)). [#1537](https://github.com/Leaflet/Leaflet/pull/1537)
 * Fixed a bug that prevented tiles from loading during pan animation.
 * Fixed a bug with `contextmenu` events on popups falling through to map (by [@snkashis](https://github.com/snkashis)). [#1730](https://github.com/Leaflet/Leaflet/issues/1730) [#1732](https://github.com/Leaflet/Leaflet/issues/1732)
 * Fixed `404` tile loading errors when browsing the map off the world bounds.
 * Fixed shifted mouse events in some cases with map inside a relatively positioned parent (by [@scooterw](https://github.com/scooterw) and [@jec006](https://github.com/jec006)). [#1670](https://github.com/Leaflet/Leaflet/issues/1670) [#1684](https://github.com/Leaflet/Leaflet/issues/1684) [#1745](https://github.com/Leaflet/Leaflet/issues/1745) [#1744](https://github.com/Leaflet/Leaflet/issues/1744)
 * Fixed a bug where tile layer z-index order sometimes broke after view reset. [#1422](https://github.com/Leaflet/Leaflet/issues/1422)

#### Browser bugfixes

 * Fixed a bug with undesirable page scrolling in Firefox 17+ when you zoom the map by scrolling (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1789](https://github.com/Leaflet/Leaflet/issues/1789) [#1788](https://github.com/Leaflet/Leaflet/issues/1788)
 * Fixed a bug where mouse coordinates where shifted in Firefox if the map was inside a positioned block on a scrolled page (by [@joschka](https://github.com/joschka)). [#1365](https://github.com/Leaflet/Leaflet/pull/1365) [#1322](https://github.com/Leaflet/Leaflet/issues/1322)
 * Fixed a bug where box zoom didn't work in some cases in Firefox 18+ (by [@fabriceds](https://github.com/fabriceds)). [#1405](https://github.com/Leaflet/Leaflet/pull/1405)
 * Fixed a bug where `TileLayer` opacity didn't work in IE 7-8 (by [@javisantana](https://github.com/javisantana) & [@danzel](https://gi
.com/danzel)). [#1084](https://github.com/Leaflet/Leaflet/issues/1084) [#1396](https://github.com/Leaflet/Leaflet/pull/1396) [#1371](https://github.com/Leaflet/Leaflet/issues/1371)
 * Fixed Leaflet not working correctly in PhantomJS (by [@rassie](https://github.com/rassie)). [#1501](https://github.com/Leaflet/Leaflet/pull/1501)

#### Mobile bugfixes

 * Fixed a bug with layers control on WinPhone8/IE10 Touch (by [@danzel](https://github.com/danzel)). [#1635](https://github.com/Leaflet/Leaflet/pull/1635) [#1539](https://github.com/Leaflet/Leaflet/issues/1539)
 * Fixed a bug with click sometimes firing twice on WinPhone8/IE10 Touch (by [@danzel](https://github.com/danzel)). [#1694](https://github.com/Leaflet/Leaflet/issues/1694)
 * Fixed a bug in Android where click was triggered twice on one tap (by [@jerel](https://github.com/jerel) & [@mourner](https://github.com/mourner)). [#1227](https://github.com/Leaflet/Leaflet/pull/1227) [#1263](https://github.com/Leaflet/Leaflet/issues/1263) [#1785](https://github.com/Leaflet/Leaflet/issues/1785) [#1694](https://github.com/Leaflet/Leaflet/issues/1694)
 * Fixed a bug in Android where click on a collapsed layers control would immediately select one of the layers (by [@danzel](https://github.com/danzel)). [#1784](https://github.com/Leaflet/Leaflet/issues/1784) [#1694](https://github.com/Leaflet/Leaflet/issues/1694)

#### API bugfixes

##### General API bugfixes

 * Fixed click mouse event inside popups **not propagating outside the map** (fixes issues with jQuery.live and some mobile frameworks that rely on document click listeners). [#301](https://github.com/Leaflet/Leaflet/issues/301)
 * Fixed a bug where event listener still fired even if it was removed on the same event in other listener (by [@spamdaemon](https://github.com/spamdaemon)). [#1661](https://github.com/Leaflet/Leaflet/issues/1661) [#1654](https://github.com/Leaflet/Leaflet/issues/1654)
 * Fixed a bug where `L.point` and `L.latLng` factories weren't passing `null` and `undefined` values through.
 * Fixed `DomEvent` `removeListener` function chaining (by [@pagameba](https://github.com/pagameba)).
 * Fixed a bug where `removeEventListener` would throw an error if no events are registered on the object (by [@tjoekbezoer](https://github.com/tjoekbezoer)). [#1632](https://github.com/Leaflet/Leaflet/pull/1632) [#1631](https://github.com/Leaflet/Leaflet/issues/1631)
 * Fixed a bug where `Point` `equals` and `contains` methods didn't accept points in array form.
 * Fixed a bug where `LatLngBounds` `extend` of an undefined object would cause an error (by [@korzhyk](https://github.com/korzhyk)). [#1688](https://github.com/Leaflet/Leaflet/issues/1688)
 * Fixed a bug where `Control.Attribution` `removeAttribution` of inexistant attribution corrupted the attribution text. [#1410](https://github.com/Leaflet/Leaflet/issues/1410)
 * Fixed a bug where `setView` on an invisible map caused an error (by [@jfire](https://github.com/jfire)). [#1707](https://github.com/Leaflet/Leaflet/issues/1707)
 * Fixed compatibility with Browserify (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1572](https://github.com/Leaflet/Leaflet/pull/1572)

##### Layers API bugfixes

 * Fixed a bug where default marker icon path wasn't properly detected in some cases in IE6-7 (by [@calvinmetcalf](https://github.com/calvinmetcalf)). [#1294](https://github.com/Leaflet/Leaflet/pull/1294)
 * Fixed a bug where `TileLayer.WMS` param values weren't escaped in URLs (by [@yohanboniface](https://github.com/yohanboniface)). [#1317](https://github.com/Leaflet/Leaflet/issues/1317)
 * Fixed a bug where layers that belong to multiple feature groups didn't propagate events correctly (by [@danzel](https://github.com/danzel)). [#1359](https://github.com/Leaflet/Leaflet/pull/1359)
 * Fixed a bug where `TileLayer.WMS` `tileSize` option was ignored (by [@brianhatchl](https://github.com/brianhatchl)). [#1080](https://github.com/brianhatchl)
 * Fixed a bug where `Polyline` constructor could overwrite the source array (by [@snkashis](https://github.com/snkashis) and [@danzel](https://github.com/danzel)). [#1439](https://github.com/Leaflet/Leaflet/pull/1439) [#1092](https://github.com/Leaflet/Leaflet/issues/1092) [#1246](https://github.com/Leaflet/Leaflet/issues/1246) [#1426](https://github.com/Leaflet/Leaflet/issues/1426)
 * Fixed a bug where marker dragging disabling/enabling wouldn't always work correctly (by [@snkashis](https://github.com/snkashis) and [@escaped](https://github.com/escaped)). [#1471](https://github.com/Leaflet/Leaflet/pull/1471) [#1551](https://github.com/Leaflet/Leaflet/pull/1551)
 * Fixed `TileLayer` to prevent incorrect subdomain in case of negative tile coordinates (by [@malexeev](https://github.com/malexeev)). [#1532](https://github.com/Leaflet/Leaflet/pull/1532)
 * Fixed polygons to normalize holes (remove last point if it's equal to the first one) (by [@jfirebaugh](https://github.com/jfirebaugh)). [#](https://github.com/Leaflet/Leaflet/pull/1467) [#1459](https://github.com/Leaflet/Leaflet/issues/1459)
 * Fixed `DivIcon` `html` option to accept `0` as a value (by [@stuporglue](https://github.com/stuporglue)). [#1633](https://github.com/Leaflet/Leaflet/pull/1633)
 * Fixed a bug with Canvas-based paths throwing an error on `mousemove` in certain conditions. [#1615](https://github.com/Leaflet/Leaflet/issues/1615)
 * Fixed a bug where copies of the world wouldn't load if you set `TileLayer` `bounds` (by [@ansis](https://github.com/ansis)). [#1618](https://github.com/Leaflet/Leaflet/issues/1618)
 * Fixed a bug where `TileLayer` `load` event wouldn't always fire correctly. [#1565](https://github.com/Leaflet/Leaflet/issues/1565)
 * Fixed `TileLayer.WMS` compatibility with some old servers that only accepted request parameters in uppercase. [#1751](https://github.com/Leaflet/Leaflet/issues/1751)
 * Fixed a bug with incorrect `L.Icon.Default.imagePath` detection in some cases. [#1657](https://github.com/Leaflet/Leaflet/issues/1657)
 * Fixed a bug where layer `onRemove` was still called even if it was never added (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1729](https://github.com/Leaflet/Leaflet/issues/1729)
 * Fixed a bug where calling `setRadius` on a Canvas-powered `CircleMarker` would cause an infinite loop (by [@snkashis](https://github.com/snkashis)). [#1712](https://github.com/Leaflet/Leaflet/issues/1712) [#1713](https://github.com/Leaflet/Leaflet/issues/1713) [#1728](https://github.com/Leaflet/Leaflet/issues/1728)
 * Renamed `marker-icon@2x.png` to `marker-icon-2x.png` to fix compatibility with Google AppEngine. [#1552](https://github.com/Leaflet/Leaflet/issues/1552) [#1553](https://github.com/Leaflet/Leaflet/issues/1553)
 * Fixed a bug where `popupclose` and `popupopen` events weren't fired for multipolygons and multipolylines (by [@tmcw](https://github.com/tmcw)). [#1681](https://github.com/Leaflet/Leaflet/issues/1681)

##### Map API bugfixes

 * Fixed a bug where `Map` `fitBounds` wouldn't work correctly with large bounds (thanks to [@MaZderMind](https://github.com/MaZderMind)). [#1069](https://github.com/Leaflet/Leaflet/issues/1069)
 * Fixed a bug where `Map` `hasLayer` wasn't handling `null` objects (by [@rvlasveld](https://github.com/rvlasveld)). [#1282](https://github.com/Leaflet/Leaflet/issues/1282) [#1302](https://github.com/Leaflet/Leaflet/pull/1302)
 * Fixed a bug where `Map` `moveend` fired before `dragend` on drag (by [@oslek](https://github.com/oslek)). [#1374](https://github.com/Leaflet/Leaflet/pull/1374)
 * Fixed a bug where panning with inertia produced an excessive `Map` `movestart` event on inertia start (by [@oslek](https://github.com/oslek)). [#1374](https://github.com/Leaflet/Leaflet/pull/1374)
 * Fixed a bug where `Map` `moveend` fired repeatedly on window resize even if the actual map size didn't change (by [@oslek](https://github.com/oslek)). [#1374](https://github.com/Leaflet/Leaflet/pull/1374)
 * Fixed a bug where `Map` `moveend` sometimes wasn't fired after drag (particularly often when dragging with a trackpad).
 * Fixed a bug that would cause an error when trying to get the state of the map in a `Map` `load` event listener. [#962](https://github.com/Leaflet/Leaflet/issues/962)
 * Added `Map` `autopanstart` event back (it was removed occasionally in previous version). [#1375](https://github.com/Leaflet/Leaflet/issues/1375)
 * Fixed a bug with removing previously set `Map` `maxBounds` (by [@jec006](https://github.com/jec006)). [#1749](https://github.com/Leaflet/Leaflet/issues/1749) [#1750](https://github.com/Leaflet/Leaflet/issues/1750)


## 0.5.1 (February 6, 2013)

 * Fixed a regression with `GeoJSON` not accepting arrays of `FeatureCollection` (by [@snkashis](https://github.com/snkashis)). [#1299](https://github.com/Leaflet/Leaflet/pull/1299) [#1298](https://github.com/Leaflet/Leaflet/issues/1298)
 * Fixed a regression with `CirleMarker` `setRadius` not working if called before adding the layer to the map (by [@danzel](https://github.com/danzel)). [#1342](https://github.com/Leaflet/Leaflet/issues/1342) [#1297](https://github.com/Leaflet/Leaflet/issues/1297)

## 0.5 (January 17, 2013)

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
 * Added `mouseover` and `mouseout` events to canvas-based vector layers (by [@snkashis](https://github.com/snkashis)). [#1403](https://github.com/Leaflet/Leaflet/pull/1403)
 * Added `Map` `eachLayer` to iterate over all layers added to the map (by [@jfirebaugh](https://github.com/jfirebaugh)). [#1457](https://github.com/Leaflet/Leaflet/pull/1457)
 * Added `TileLayer` `bounds` option to limit tile loading to a specific region (by [@adimitrov](https://github.com/adimitrov)). [#991](https://github.com/Leaflet/Leaflet/pull/991)

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
 * Fixed `FeatureGroup` `eachLayer` chaining. [#1452](https://github.com/Leaflet/Leaflet/issues/1452)

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

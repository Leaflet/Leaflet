---
layout: v2
title: Plugins
bodyclass: plugins-page
---

## Leaflet plugins database

While Leaflet is meant to be as lightweight as possible, and focuses on a core set of features, an easy way to extend its functionality is to use third-party plugins. Thanks to the awesome community behind Leaflet, there are literally hundreds of nice plugins to choose from. Within each section, they're sorted by GitHub stars.

<div id="toc" class="toc-flow">
	<div class="toc-v2">
		<a href="#ready-for-leaflet-2">Ready for Leaflet 2</a>
		<hr>
	</div>
	<div class="toc-groups">
		<div class="toc-group">
			<h4>Tile &amp; image layers</h4>
			<ul>
				<li><a href="#basemap-providers">{% include plugin_count.html category="basemap-providers" %}Basemap providers</a></li>
				<li><a href="#raster-formats--large-images">{% include plugin_count.html category="raster-formats" %}Raster formats &amp; large images</a></li>
				<li><a href="#tile--image-effects">{% include plugin_count.html category="tile-image-display" %}Tile &amp; image effects</a></li>
				<li><a href="#tile-loading">{% include plugin_count.html category="tile-load" %}Tile loading</a></li>
				<li><a href="#vector-tiles--gl-maps">{% include plugin_count.html category="vector-tiles" %}Vector tiles &amp; GL maps</a></li>
			</ul>
		</div>
		<div class="toc-group">
			<h4>Overlay data</h4>
			<ul>
				<li><a href="#data-formats">{% include plugin_count.html category="overlay-data-formats" %}Data formats</a></li>
				<li><a href="#realtime--dynamic-data">{% include plugin_count.html category="realtime-dynamic-data" %}Realtime &amp; dynamic data</a></li>
				<li><a href="#grids--boundaries">{% include plugin_count.html category="grids-boundaries" %}Grids &amp; boundaries</a></li>
				<li><a href="#data-providers">{% include plugin_count.html category="data-providers" %}Data providers</a></li>
			</ul>
		</div>
		<div class="toc-group">
			<h4>Integration</h4>
			<ul>
				<li><a href="#frameworks--build-systems">{% include plugin_count.html category="frameworks-build-systems" %}Frameworks &amp; build systems</a></li>
				<li><a href="#cms--app-integrations">{% include plugin_count.html category="cms-app-integrations" %}CMS &amp; app integrations</a></li>
			</ul>
		</div>
		<div class="toc-group">
			<h4>Overlay display</h4>
			<ul>
				<li><a href="#markers--icons">{% include plugin_count.html category="markers-icons" %}Markers &amp; icons</a></li>
				<li><a href="#lines--shapes">{% include plugin_count.html category="lines-shapes" %}Lines &amp; shapes</a></li>
				<li><a href="#styling--labels">{% include plugin_count.html category="styling-labels" %}Styling &amp; labels</a></li>
				<li><a href="#animations">{% include plugin_count.html category="overlay-animations" %}Animations</a></li>
				<li><a href="#clustering--decluttering">{% include plugin_count.html category="clustering-decluttering" %}Clustering &amp; decluttering</a></li>
				<li><a href="#heatmaps">{% include plugin_count.html category="heatmaps" %}Heatmaps</a></li>
				<li><a href="#data-visualization">{% include plugin_count.html category="dataviz" %}Data visualization</a></li>
			</ul>
		</div>
		<div class="toc-group">
			<h4>Overlay interaction</h4>
			<ul>
				<li><a href="#edit-geometries">{% include plugin_count.html category="edit-geometries" %}Edit geometries</a></li>
				<li><a href="#time--elevation">{% include plugin_count.html category="time-elevation" %}Time &amp; elevation</a></li>
				<li><a href="#search--filter">{% include plugin_count.html category="search-filter" %}Search &amp; filter</a></li>
				<li><a href="#hover-click--popups">{% include plugin_count.html category="hover-click-popups" %}Hover, click &amp; popups</a></li>
				<li><a href="#area-selection">{% include plugin_count.html category="area-selection" %}Area selection</a></li>
			</ul>
		</div>
		<div class="toc-group">
			<h4>Map interaction</h4>
			<ul>
				<li><a href="#layer-switching--legends">{% include plugin_count.html category="layer-switching-legends" %}Layer switching &amp; legends</a></li>
				<li><a href="#navigation">{% include plugin_count.html category="navigation" %}Navigation</a></li>
				<li><a href="#minimaps--synced-maps">{% include plugin_count.html category="minimaps-synced-maps" %}Minimaps &amp; synced maps</a></li>
				<li><a href="#location--coordinates">{% include plugin_count.html category="location-coordinates" %}Location &amp; coordinates</a></li>
				<li><a href="#measurement">{% include plugin_count.html category="measurement" %}Measurement</a></li>
				<li><a href="#buttons--menus">{% include plugin_count.html category="buttons-menus" %}Buttons &amp; menus</a></li>
				<li><a href="#sidebars--panels">{% include plugin_count.html category="sidebars-panels" %}Sidebars &amp; panels</a></li>
				<li><a href="#print--export">{% include plugin_count.html category="print-export" %}Print &amp; export</a></li>
			</ul>
		</div>
		<div class="toc-group">
			<h4>Analysis &amp; services</h4>
			<ul>
				<li><a href="#geoprocessing--projections">{% include plugin_count.html category="geoprocessing" %}Geoprocessing &amp; projections</a></li>
				<li><a href="#routing">{% include plugin_count.html category="routing" %}Routing</a></li>
				<li><a href="#geocoding">{% include plugin_count.html category="geocoding" %}Geocoding</a></li>
			</ul>
		</div>
		<div class="toc-group toc-dev">
			<a href="#develop-your-own">Develop your own</a>
		</div>
	</div>
</div>

---

## Ready for Leaflet 2

Plugins that already work with Leaflet 2.0. Ported yours? [Mark it](#develop-your-own) with `compatible-v2: true`.

{% include plugin_list.html %}

## Tile & image layers

The following plugins allow loading different maps and provide functionality to tile and image layers.

### Basemap providers

Ready-to-go basemaps, with little or no configuration at all.

{% include plugin_list.html category="basemap-providers" %}

<a id="basemap-formats"></a><a id="non-map-base-layers"></a>

### Raster formats & large images

Load basemaps and GIS raster layers in formats beyond plain tile URLs, such as WMS, WMTS, GeoTIFF and MBTiles, or show really big non-map images, such as IIIF and DeepZoom.

{% include plugin_list.html category="raster-formats" %}

### Tile & image effects

The following plugins change the way that tile or image layers are displayed in the map.

{% include plugin_list.html category="tile-image-display" %}

### Tile loading

The following plugins change the way that tile layers are loaded into the map.

{% include plugin_list.html category="tile-load" %}

<a id="vector-tiles"></a>

### Vector tiles & GL maps

Display [vector tiles](https://github.com/mapbox/vector-tile-spec), or add a MapLibre or Mapbox GL map to Leaflet as a layer.

{% include plugin_list.html category="vector-tiles" %}

## Overlay data

The following plugins provide new ways of loading overlay data (GIS vector data): points, lines and polygons.

### Data formats

Load your own data from various GIS formats.

{% include plugin_list.html category="overlay-data-formats" %}

<a id="dynamiccustom-data-loading"></a>

### Realtime & dynamic data

Load data that keeps updating on the map, from live tracking to periodic refreshes.

{% include plugin_list.html category="realtime-dynamic-data" %}

<a id="synthetic-overlays"></a>

### Grids & boundaries

Overlays that need no data of your own: graticules and reference grids, day and night, time zones, and ready-made boundary layers.

{% include plugin_list.html category="grids-boundaries" %}

### Data providers

Load overlay data from third-party services. See also [basemap providers](#basemap-providers).

{% include plugin_list.html category="data-providers" %}

## Integration

### Frameworks & build systems

Ease your development integrating Leaflet into a development framework or automating some of the javascript/CSS work for complex applications.

{% include plugin_list.html category="frameworks-build-systems" %}

<a id="third-party-services"></a>

### CMS & app integrations

Leaflet maps in WordPress, Drupal, Joomla, forums and other apps, without writing code.

{% include plugin_list.html category="cms-app-integrations" %}

## Overlay display

The following plugins provide new ways of displaying overlay data information.

### Markers & icons

New kinds of markers and icons: icon fonts, SVG and canvas markers, photos, directional symbols, and markers for points outside the view.

{% include plugin_list.html category="markers-icons" %}

### Lines & shapes

Draw curves, geodesic lines, arcs and new shapes, or decorate lines with arrows, patterns and offsets.

{% include plugin_list.html category="lines-shapes" %}

### Styling & labels

Style overlays from data, fill them with patterns, or label them. Leaflet users versed in GIS also know these as symbolizers.

{% include plugin_list.html category="styling-labels" %}

### Animations

These plugins animate markers or some geometries. See also [time & elevation](#time--elevation).

{% include plugin_list.html category="overlay-animations" %}

### Clustering & decluttering

When you are displaying a lot of data, these plugins will make your map look cleaner.

{% include plugin_list.html category="clustering-decluttering" %}

### Heatmaps

These plugins create heatmaps and heatmap-like visualizations from vector data.

{% include plugin_list.html category="heatmaps" %}

### Data visualization

Powerful multi-purpose libraries for data visualization.

{% include plugin_list.html category="dataviz" %}

## Overlay interaction

The following plugins enable users to interact with overlay data: edit geometries, select areas or features, interact with the time dimension, search features and display information about them.

### Edit geometries

Allows users to create, draw, edit and/or delete points, lines and polygons.

{% include plugin_list.html category="edit-geometries" %}

### Time & elevation

Most data is two-dimensional (latitude and longitude), but some data has more dimensions (altitude and/or time). The following plugins help users navigate these extra dimensions.

{% include plugin_list.html category="time-elevation" %}

<a id="search--popups"></a>

### Search & filter

Search for markers and features on the map, or filter them by their properties. To search for addresses and places, see [geocoding](#geocoding).

{% include plugin_list.html category="search-filter" %}

### Hover, click & popups

Make overlays easier to hover and click, find what is under the cursor, and enhance popups and tooltips.

{% include plugin_list.html category="hover-click-popups" %}

<a id="areaoverlay-selection"></a>

### Area selection

Let users select an area on the map, or select features by drawing around them.

{% include plugin_list.html category="area-selection" %}

## Map interaction

New ways to interact with the map itself.

### Layer switching & legends

The following plugins enhance or extend `LayersControl`, or add legends for the layers on the map.

{% include plugin_list.html category="layer-switching-legends" %}

### Navigation

Change the way the user moves around the map: zoom and pan controls, map rotation, saved and shared views, fullscreen, and control over scroll and touch gestures.

{% include plugin_list.html category="navigation" %}

### Minimaps & synced maps

Display two maps at once. One of them might be a different size and zoom level, usable as a minimap to aid with navigation.

{% include plugin_list.html category="minimaps-synced-maps" %}

### Location & coordinates

Show the user's location, display the coordinates under the cursor, or let the user pick a location.

{% include plugin_list.html category="location-coordinates" %}

### Measurement

Allow the user to measure distances or areas, or show a scale.

{% include plugin_list.html category="measurement" %}

### Buttons & menus

Buttons, toolbars, context menus, sliders and other custom controls.

{% include plugin_list.html category="buttons-menus" %}

### Sidebars & panels

Sidebars, windows, messages and loading indicators.

{% include plugin_list.html category="sidebars-panels" %}

### Print & export

Print or export your map.

<!--
- Saving a Leaflet Map to a PNG Example using Javascript and PHP https://github.com/tegansnyder/Leaflet-Save-Map-to-PNG
- Get a PNG from a Leaflet map and export it in PDF https://github.com/chrissom/leaflet-pdf
-->

{% include plugin_list.html category="print-export" %}

## Analysis & services

<a id="geoprocessing"></a>

### Geoprocessing & projections

Geometry operations, spatial indexes and antimeridian handling, plus support for other projections and coordinate systems.

{% include plugin_list.html category="geoprocessing" %}

### Routing

The following plugins use external services to calculate driving or walking routes.

{% include plugin_list.html category="routing" %}

### Geocoding

External services that transform an address or the name of a place into latitude and longitude (or vice versa).

{% include plugin_list.html category="geocoding" %}

## Develop your own

Leaflet keeps it simple. If you can think of a feature that is not required by all Leaflet users, and you can write the JavaScript code in a reusable way, you've got yourself a Leaflet plugin already.

There are no hard requirements on how to create your own plugin, but all developers are encouraged to read the recommendations in the [plugin guide](https://github.com/Leaflet/Leaflet/blob/main/PLUGIN-GUIDE.md).

Once your plugin is ready, you can submit it: copy [`template.md`](https://github.com/Leaflet/Leaflet/blob/main/docs/_plugins/template.md) into the category folder in [/docs/_plugins/](https://github.com/Leaflet/Leaflet/tree/main/docs/_plugins) that fits your plugin, fill it in, and send a pull request to our GitHub repository. If your plugin works with Leaflet 2, set `compatible-v2: true` to have it listed in the [Ready for Leaflet 2](#ready-for-leaflet-2) section too.

<style>
ul.plugins {
	list-style: none;
	padding: 0;
	border-top: 1px solid #eee;
}
ul.plugins li {
	display: grid;
	grid-template-columns: 18em minmax(0, 1fr);
	gap: 0.2em 1.5em;
	padding: 0.6em 0;
	border-bottom: 1px solid #eee;
}
.plugin-info > div {
	display: flex;
	align-items: baseline;
	gap: 0 0.5em;
}
.plugin-info > div > :first-child {
	flex: 1;
	min-width: 0;
}
.plugin-name {
	font-weight: bold;
	overflow-wrap: anywhere;
}
.plugin-meta,
.plugin-stars {
	color: #777;
	font-size: 0.9em;
	font-variant-numeric: tabular-nums;
}
.plugin-stars,
.plugin-meta time {
	white-space: nowrap;
}
.plugin-meta a {
	color: inherit;
	text-decoration: none;
}
.plugin-meta a:hover {
	text-decoration: underline;
}
.plugin-desc p {
	margin: 0;
}
.v2 {
	font-size: 0.75em;
	font-weight: bold;
	color: #fff;
	background: #4a9b2f;
	border-radius: 3px;
	padding: 0.1em 0.4em;
	white-space: nowrap;
}
@media (max-width: 700px) {
	ul.plugins li {
		grid-template-columns: minmax(0, 1fr);
	}
}
</style>

<script>
// shows commit dates as "3 weeks ago" etc., which a build would leave stale until the next one
{
	const relTime = new Intl.RelativeTimeFormat('en', {numeric: 'auto'});
	const units = [['year', 365], ['month', 30], ['week', 7], ['day', 1]];
	for (const time of document.querySelectorAll('.plugin-meta time')) {
		const days = (Date.now() - new Date(time.dateTime)) / 864e5;
		const [unit, size] = units.find(([, size]) => days >= size) ?? units[3];
		time.textContent = relTime.format(-Math.floor(days / size), unit);
	}
}
</script>

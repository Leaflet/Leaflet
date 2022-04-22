---
layout: v2
title: Plugins
bodyclass: plugins-page
---

<style>
table.plugins td > p {
	margin-top: 0;
	margin-bottom: 0;
}
</style>

## Leaflet Plugins database

While Leaflet is meant to be as lightweight as possible, and focuses on a core set of features, an easy way to extend its functionality is to use third-party plugins. Thanks to the awesome community behind Leaflet, there are literally hundreds of nice plugins to choose from.

---

<div id="toc" class="clearfix">
	<div class="toc-col">
		<h4>Tile &amp; image layers</h4>
		<ul>
			<li> <a href='#basemap-providers'>Basemap providers</a></li>
			<li> <a href='#basemap-formats'>Basemap formats</a></li>
			<li> <a href='#non-map-base-layers'>Non-map base layers</a></li>
			<li> <a href='#tileimage-display'>Tile/image display</a></li>
			<li> <a href='#tile-load'>Tile load</a></li>
			<li> <a href='#vector-tiles'>Vector tiles</a></li>
		</ul>
		<h4>Overlay data</h4>
		<ul>
			<li> <a href='#overlay-data-formats'>Overlay data formats</a></li>
			<li> <a href='#dynamiccustom-data-loading'>Dynamic data loading</a></li>
			<li> <a href='#synthetic-overlays'>Synthetic overlays</a></li>
			<li> <a href='#data-providers'>Data providers</a></li>
		</ul>
	</div>
	<div class="toc-col">
		<h4>Overlay Display</h4>
		<ul>
			<li><a href="#markers--renderers">Markers &amp; renderers</a></li>
			<li><a href="#overlay-animations">Overlay animations</a></li>
			<li><a href="#clusteringdecluttering">Clustering/decluttering</a></li>
			<li><a href="#heatmaps">Heatmaps</a></li>
			<li><a href="#dataviz">DataViz</a></li>
		</ul>
		<h4>Overlay interaction</h4>
		<ul>
			<li><a href="#edit-geometries">Edit geometries</a></li>
			<li><a href="#time--elevation">Time &amp; elevation</a></li>
			<li><a href="#search--popups">Search &amp; popups</a></li>
			<li><a href="#areaoverlay-selection">Area/overlay selection</a></li>
		</ul>
	</div>
	<div class="toc-col">
		<h4>Map interaction</h4>
		<ul>
			<li><a href="#layer-switching-controls">Layer switching controls</a></li>
			<li><a href="#interactive-panzoom">Interactive pan/zoom</a></li>
			<li><a href="#bookmarked-panzoom">Bookmarked pan/zoom</a></li>
			<li><a href="#fullscreen-controls">Fullscreen</a></li>
			<li><a href="#minimaps--synced-maps">Minimaps &amp; synced maps</a></li>
			<li><a href="#measurement">Measurement</a></li>
			<li><a href="#mouse-coordinates">Mouse coordinates</a></li>
			<li><a href="#events">Events</a></li>
			<li><a href="#user-interface">User interface</a></li>
			<li><a href="#printexport">Print/export</a></li>
			<li><a href="#geolocation">Geolocation</a></li>
		</ul>
	</div>
	<div class="toc-col">
		<h4>Miscellaneous</h4>
		<ul>
			<li><a href="#geoprocessing">Geoprocessing</a></li>
			<li><a href="#routing">Routing</a></li>
			<li><a href="#geocoding">Geocoding</a></li>
			<li><a href="#plugin-collections">Plugin collections</a></li>
		</ul>
		<h4>Integration</h4>
		<ul>
			<li><a href="#frameworks--build-systems">Frameworks &amp; build systems</a></li>
			<li><a href="#3rd-party-integration">3<sup>rd</sup> party</a></li>
		</ul>
		<hr>
		<a href="#develop-your-own">Develop your own</a>
	</div>
</div>

---

## Tile & image layers

The following plugins allow loading different maps and provide functionality to tile and image layers.

* [Basemap providers](#basemap-providers)
* [Basemap formats](#basemap-formats)
* [Non-map base layers](#non-map-base-layers)
* [Tile/image display](#tileimage-display)
* [Tile load](#tile-load)
* [Vector tiles](#vector-tiles)


### Basemap providers

Ready-to-go basemaps, with little or no configuration at all.

{% include plugin_category_table.html category="basemap-providers" %}


### Basemap formats

Plugins for loading basemaps or GIS raster layers in common (albeit non-default) formats.

{% include plugin_category_table.html category="basemap-formats" %}

### Non-map base layers

Sometimes you don't want to load a map, just big custom images. **Really** big ones.

{% include plugin_category_table.html category="non-map-base-layers" %}

### Tile/image display

The following plugins change the way that tile or image layers are displayed in the map.

{% include plugin_category_table.html category="tile-image-display" %}

### Tile Load

The following plugins change the way that tile layers are loaded into the map.

{% include plugin_category_table.html category="tile-load" %}

### Vector tiles

Plugins to display [vector tiles](https://github.com/mapbox/vector-tile-spec).

{% include plugin_category_table.html category="vector-tiles" %}


## Overlay data

The following plugins provide new ways of loading overlay data (GIS vector data): points, lines and polygons.

* [Overlay data formats](#overlay-data-formats)
* [Dynamic data loading](#dynamiccustom-data-loading)
* [Synthetic overlays](#synthetic-overlays)
* [Data providers](#data-providers)

### Overlay data formats

Load your own data from various GIS formats.

{% include plugin_category_table.html category="overlay-data-formats" %}

### Dynamic/custom data loading

Load dynamic data which is updated in the map, or load GIS vector data in non-standard ways.

{% include plugin_category_table.html category="dynamic-custom-data-loading" %}

### Synthetic overlays

These plugins create useful overlays from scratch, no loading required.

{% include plugin_category_table.html category="synthetic-overlays" %}

### Data providers

Load overlay data from third-party-services. See also [basemap providers](#basemap-providers) and [plugin collections](#collections).

{% include plugin_category_table.html category="data-providers" %}


## Overlay display

The following plugins provide new ways of displaying overlay data information.

* [Markers & renderers](#markers--renderers)
* [Overlay animations](#overlay-animations)
* [Clustering/decluttering](#clusteringdecluttering)
* [Heatmaps](#heatmaps)
* [DataViz](#dataviz)


### Markers & renderers

These plugins provide new markers or news ways of converting abstract data into images in your screen. Leaflet users versed in GIS also know these as symbolizers.

{% include plugin_category_table.html category="markers-renderers" %}

### Overlay animations

These plugins animate markers or some geometries. See also [geometries with time or elevation](#geometryinteraction-time).

{% include plugin_category_table.html category="overlay-animations" %}

### Clustering/Decluttering

When you are displaying a lot of data, these plugins will make your map look cleaner.

{% include plugin_category_table.html category="clustering-decluttering" %}

### Heatmaps

These plugins create heatmaps and heatmap-like visualizations from vector data.

{% include plugin_category_table.html category="heatmaps" %}

### DataViz

Powerful multi-purpose libraries for data visualization.

{% include plugin_category_table.html category="dataviz" %}


## Interaction with geometries/features

The following plugins enable users to interact with overlay data: edit geometries, select areas or features, interact with the time dimension, search features and display information about them.

* [Edit geometries](#edit-geometries)
* [Time & elevation](#time--elevation)
* [Search & popups](#search--popups)
* [Area/overlay selection](#areaoverlay-selection)

### Edit geometries

Allows users to create, draw, edit and/or delete points, lines and polygons.

{% include plugin_category_table.html category="edit-geometries" %}

### Time & elevation

Most data is two-dimensional (latitude and longitude), but some data has more dimensions (altitude and/or time). The following plugins help users navigate these extra dimensions.

{% include plugin_category_table.html category="time-elevation" %}

### Search & popups

Plugins that search for overlays and enhance how to display information about them.

{% include plugin_category_table.html category="search-popups" %}

### Area/overlay selection

These plugins help users select either overlays or areas in the map.

{% include plugin_category_table.html category="area-overlay-selection" %}


## Map interaction

New ways to interact with the map itself.

* [Layer switching controls](#layer-switching-controls)
* [Interactive pan/zoom](#interactive-panzoom)
* [Bookmarked pan/zoom](#bookmarked-panzoom)
* [Fullscreen](#fullscreen-controls)
* [Minimaps & synced maps](#minimaps--synced-maps)
* [Measurement](#measurement)
* [Mouse coordinates](#mouse-coordinates)
* [Events](#events)
* [User interface](#user-interface)
* [Print/export](#printexport)
* [Geolocation](#geolocation)

### Layer switching controls

The following plugins enhance or extend `L.Control.Layers`.

{% include plugin_category_table.html category="layer-switching-controls" %}


### Interactive pan/zoom

Change the way the user can interactively move around the map.

{% include plugin_category_table.html category="interactive-pan-zoom" %}

### Bookmarked pan/zoom

Change the way the user is moved around the map, by jumping to predefined/stored places.

{% include plugin_category_table.html category="bookmarked-pan-zoom" %}

### Fullscreen controls

Allows display of the map in full-screen mode.

{% include plugin_category_table.html category="fullscreen-controls" %}

### Minimaps & synced maps

Display two maps at once. One of them might be a different size and zoom level, usable as a minimap to aid with navigation.

{% include plugin_category_table.html category="minimaps-synced-maps" %}

### Measurement

Allow the user to measure distances or areas.

{% include plugin_category_table.html category="measurement" %}

### Mouse coordinates

Show the geographical coordinates under the mouse cursor in different ways.

{% include plugin_category_table.html category="mouse-coordinates" %}

### Events

These plugins extend Leaflet event handling.

{% include plugin_category_table.html category="events" %}

### User interface

Buttons, sliders, toolbars, sidebars, and panels.

{% include plugin_category_table.html category="user-interface" %}

### Print/export

Print or export your map.

<!--
- Saving a Leaflet Map to a PNG Example using Javascript and PHP https://github.com/tegansnyder/Leaflet-Save-Map-to-PNG
- Get a PNG from a Leaflet map and export it in PDF https://github.com/chrissom/leaflet-pdf
-->

{% include plugin_category_table.html category="print-export" %}

### Geolocation

Plugins that extend Leaflet's geolocation capabilities.

{% include plugin_category_table.html category="geolocation" %}


## Miscellaneous

### Geoprocessing

The following plugins perform several sorts of geoprocessing (mathematical and topological operations on points, lines and polygons).

{% include plugin_category_table.html category="geoprocessing" %}

### Routing

The following plugins use external services to calculate driving or walking routes.

{% include plugin_category_table.html category="routing" %}

### Geocoding

External services that transform an address or the name of a place into latitude and longitude (or vice versa).

{% include plugin_category_table.html category="geocoding" %}

### Plugin collections

Sets of plugins that span several categories.

Plugin developers: please keep future plugins in individual repositories.

{% include plugin_category_table.html category="plugin-collections" %}


## Integration

### Frameworks & build systems

Ease your development integrating Leaflet into a development framework or automating some of the javascript/CSS work for complex applications.

{% include plugin_category_table.html category="frameworks-build-systems" %}

### 3<sup>rd</sup> party integration

The following plugins integrate Leaflet into third party services or websites.

{% include plugin_category_table.html category="3rd-party-integration" %}



## Develop your own

Leaflet keeps it simple. If you can think of a feature that is not required by all Leaflet users, and you can write the JavaScript code in a reusable way, you've got yourself a Leaflet plugin already.

There are no hard requirements on how to create your own plugin, but all developers are encouraged to read the recommendations in the [plugin guide](https://github.com/Leaflet/Leaflet/blob/main/PLUGIN-GUIDE.md).

Once your plugin is ready, you can submit it: just send a pull request with a new plugin file in [/docs/_plugins/](https://github.com/Leaflet/Leaflet/tree/main/docs/_plugins)to our GitHub repository.

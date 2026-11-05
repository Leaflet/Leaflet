---
layout: v2
title: Plugins
bodyclass: plugins-page
---

## Leaflet plugins database

While Leaflet is meant to be as lightweight as possible, and focuses on a core set of features, an easy way to extend its functionality is to use third-party plugins. Thanks to the awesome community behind Leaflet, there are literally hundreds of nice plugins to choose from.

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
		<h4>Overlay display</h4>
		<ul>
			<li><a href="#markers--renderers">Markers &amp; renderers</a></li>
			<li><a href="#overlay-animations">Overlay animations</a></li>
			<li><a href="#clusteringdecluttering">Clustering/decluttering</a></li>
			<li><a href="#heatmaps">Heatmaps</a></li>
			<li><a href="#data-visualization">Data visualization</a></li>
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
			<li><a href="#third-party-integration">Third-party</a></li>
		</ul>
		<hr>
		<a href="#ready-for-leaflet-2">Ready for Leaflet 2</a><br>
		<a href="#develop-your-own">Develop your own</a>
	</div>
</div>

---

## Ready for Leaflet 2

Plugins that already work with Leaflet 2.0. Ported yours? [Mark it](#develop-your-own) with `compatible-v2: true`.

{% include plugin_list.html %}

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

{% include plugin_list.html category="basemap-providers" %}


### Basemap formats

Plugins for loading basemaps or GIS raster layers in common (albeit non-default) formats.

{% include plugin_list.html category="basemap-formats" %}

### Non-map base layers

Sometimes you don't want to load a map, just big custom images. **Really** big ones.

{% include plugin_list.html category="non-map-base-layers" %}

### Tile/image display

The following plugins change the way that tile or image layers are displayed in the map.

{% include plugin_list.html category="tile-image-display" %}

### Tile load

The following plugins change the way that tile layers are loaded into the map.

{% include plugin_list.html category="tile-load" %}

### Vector tiles

Plugins to display [vector tiles](https://github.com/mapbox/vector-tile-spec).

{% include plugin_list.html category="vector-tiles" %}


## Overlay data

The following plugins provide new ways of loading overlay data (GIS vector data): points, lines and polygons.

* [Overlay data formats](#overlay-data-formats)
* [Dynamic data loading](#dynamiccustom-data-loading)
* [Synthetic overlays](#synthetic-overlays)
* [Data providers](#data-providers)

### Overlay data formats

Load your own data from various GIS formats.

{% include plugin_list.html category="overlay-data-formats" %}

### Dynamic/custom data loading

Load dynamic data which is updated in the map, or load GIS vector data in non-standard ways.

{% include plugin_list.html category="dynamic-custom-data-loading" %}

### Synthetic overlays

These plugins create useful overlays from scratch, no loading required.

{% include plugin_list.html category="synthetic-overlays" %}

### Data providers

Load overlay data from third-party-services. See also [basemap providers](#basemap-providers) and [plugin collections](#collections).

{% include plugin_list.html category="data-providers" %}


## Overlay display

The following plugins provide new ways of displaying overlay data information.

* [Markers & renderers](#markers--renderers)
* [Overlay animations](#overlay-animations)
* [Clustering/decluttering](#clusteringdecluttering)
* [Heatmaps](#heatmaps)
* [Data visualization](#data-visualization)


### Markers & renderers

These plugins provide new markers or news ways of converting abstract data into images in your screen. Leaflet users versed in GIS also know these as symbolizers.

{% include plugin_list.html category="markers-renderers" %}

### Overlay animations

These plugins animate markers or some geometries. See also [geometries with time or elevation](#geometryinteraction-time).

{% include plugin_list.html category="overlay-animations" %}

### Clustering/decluttering

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

* [Edit geometries](#edit-geometries)
* [Time & elevation](#time--elevation)
* [Search & popups](#search--popups)
* [Area/overlay selection](#areaoverlay-selection)

### Edit geometries

Allows users to create, draw, edit and/or delete points, lines and polygons.

{% include plugin_list.html category="edit-geometries" %}

### Time & elevation

Most data is two-dimensional (latitude and longitude), but some data has more dimensions (altitude and/or time). The following plugins help users navigate these extra dimensions.

{% include plugin_list.html category="time-elevation" %}

### Search & popups

Plugins that search for overlays and enhance how to display information about them.

{% include plugin_list.html category="search-popups" %}

### Area/overlay selection

These plugins help users select either overlays or areas in the map.

{% include plugin_list.html category="area-overlay-selection" %}


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

The following plugins enhance or extend `LayersControl`.

{% include plugin_list.html category="layer-switching-controls" %}


### Interactive pan/zoom

Change the way the user can interactively move around the map.

{% include plugin_list.html category="interactive-pan-zoom" %}

### Bookmarked pan/zoom

Change the way the user is moved around the map, by jumping to predefined/stored places.

{% include plugin_list.html category="bookmarked-pan-zoom" %}

### Fullscreen controls

Allows display of the map in full-screen mode.

{% include plugin_list.html category="fullscreen-controls" %}

### Minimaps & synced maps

Display two maps at once. One of them might be a different size and zoom level, usable as a minimap to aid with navigation.

{% include plugin_list.html category="minimaps-synced-maps" %}

### Measurement

Allow the user to measure distances or areas.

{% include plugin_list.html category="measurement" %}

### Mouse coordinates

Show the geographical coordinates under the mouse cursor in different ways.

{% include plugin_list.html category="mouse-coordinates" %}

### Events

These plugins extend Leaflet event handling.

{% include plugin_list.html category="events" %}

### User interface

Buttons, sliders, toolbars, sidebars, and panels.

{% include plugin_list.html category="user-interface" %}

### Print/export

Print or export your map.

<!--
- Saving a Leaflet Map to a PNG Example using Javascript and PHP https://github.com/tegansnyder/Leaflet-Save-Map-to-PNG
- Get a PNG from a Leaflet map and export it in PDF https://github.com/chrissom/leaflet-pdf
-->

{% include plugin_list.html category="print-export" %}

### Geolocation

Plugins that extend Leaflet's geolocation capabilities.

{% include plugin_list.html category="geolocation" %}


## Miscellaneous

### Geoprocessing

The following plugins perform several sorts of geoprocessing (mathematical and topological operations on points, lines and polygons).

{% include plugin_list.html category="geoprocessing" %}

### Routing

The following plugins use external services to calculate driving or walking routes.

{% include plugin_list.html category="routing" %}

### Geocoding

External services that transform an address or the name of a place into latitude and longitude (or vice versa).

{% include plugin_list.html category="geocoding" %}

### Plugin collections

Sets of plugins that span several categories.

Plugin developers: please keep future plugins in individual repositories.

{% include plugin_list.html category="plugin-collections" %}


## Integration

### Frameworks & build systems

Ease your development integrating Leaflet into a development framework or automating some of the javascript/CSS work for complex applications.

{% include plugin_list.html category="frameworks-build-systems" %}

### Third-party integration

The following plugins integrate Leaflet into third party services or websites.

{% include plugin_list.html category="3rd-party-integration" %}



## Develop your own

Leaflet keeps it simple. If you can think of a feature that is not required by all Leaflet users, and you can write the JavaScript code in a reusable way, you've got yourself a Leaflet plugin already.

There are no hard requirements on how to create your own plugin, but all developers are encouraged to read the recommendations in the [plugin guide](https://github.com/Leaflet/Leaflet/blob/main/PLUGIN-GUIDE.md).

Once your plugin is ready, you can submit it: just send a pull request with a new plugin file in [/docs/_plugins/](https://github.com/Leaflet/Leaflet/tree/main/docs/_plugins)to our GitHub repository.

<style>
ul.plugins {
	list-style: none;
	padding: 0;
	border-top: 1px solid #eee;
}
ul.plugins li {
	padding: 0.6em 0;
	border-bottom: 1px solid #eee;
}
ul.plugins p {
	margin: 0.15em 0 0;
}
.plugin-head {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-items: center;
	gap: 0 1em;
}
.plugin-repo-url {
	font-weight: bold;
}
.plugin-meta {
	color: #777;
}
.plugin-meta a {
	color: inherit;
	text-decoration: none;
}
.plugin-meta a:hover {
	text-decoration: underline;
}
.v2 {
	font-size: 0.75em;
	font-weight: bold;
	color: #fff;
	background: #4a9b2f;
	border-radius: 3px;
	padding: 0 0.4em;
	vertical-align: 0.15em;
}
.repo-data {
	white-space: nowrap;
}
.repo-data > img {
	height: 20px;
	max-width: none;
	margin-left: 5px;
	filter: grayscale(1);
}
ul.plugins li:hover .repo-data > img {
	filter: none;
}
</style>

<script>
function loadRepoData() {
	const regexpGithubCom = /^https?:\/\/(?:www\.)?github\.com\/([\w\d-_.]+)\/([\w\d-_.]+)\/?/;
	const regexpGithubIO = /^https?:\/\/([\w\d-_.]+)\.github\.io\/([\w\d-_.]+)\/?/;
	const regexpGitlabCom = /^https?:\/\/(?:www\.)?gitlab\.com\/([\w\d-_.]+)\/([\w\d-_.]+)\/?/;

	const rows = document.querySelectorAll('.plugins li');
	rows.forEach((row) => {
		try {
			const repoData = row.querySelector('.repo-data');
			if (repoData) {
				const link = row.querySelector('.plugin-repo-url').href;
				let badges = [];

				const matchGithubCom = link.match(regexpGithubCom);
				if (matchGithubCom) {
					const repo = `${matchGithubCom[1]}/${matchGithubCom[2]}`;
					badges = [
						`https://badgen.net/github/last-commit/${repo}`,
						`https://badgen.net/github/stars/${repo}`
					];
				}

				const matchGithubIO = link.match(regexpGithubIO);
				if (matchGithubIO) {
					const repo = `${matchGithubIO[1]}/${matchGithubIO[2]}`;
					badges = [
						`https://badgen.net/github/last-commit/${repo}`,
						`https://badgen.net/github/stars/${repo}`
					];
				}

				const matchGitlabCom = link.match(regexpGitlabCom);
				if (matchGitlabCom) {
					const repo = `${matchGitlabCom[1]}/${matchGitlabCom[2]}`;
					badges = [
						`https://badgen.net/gitlab/last-commit/${repo}`,
						`https://badgen.net/gitlab/stars/${repo}`
					];
				}

				badges.forEach((badge) => {
					repoData.innerHTML += `<img src="${badge}" alt="" loading="lazy"/>`;
				});
			}
		} catch (e) {
			console.error(e);
		}
	});
}
loadRepoData();

</script>

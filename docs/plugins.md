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
			<li> <a href='#tile-loading'>Tile loading</a></li>
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
			<li><a href="#markers--icons">Markers &amp; icons</a></li>
			<li><a href="#lines--shapes">Lines &amp; shapes</a></li>
			<li><a href="#styling--labels">Styling &amp; labels</a></li>
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
			<li><a href="#layer-switching--legends">Layer switching &amp; legends</a></li>
			<li><a href="#navigation">Navigation</a></li>
			<li><a href="#minimaps--synced-maps">Minimaps &amp; synced maps</a></li>
			<li><a href="#location--coordinates">Location &amp; coordinates</a></li>
			<li><a href="#measurement">Measurement</a></li>
			<li><a href="#buttons--menus">Buttons &amp; menus</a></li>
			<li><a href="#sidebars--panels">Sidebars &amp; panels</a></li>
			<li><a href="#print--export">Print &amp; export</a></li>
		</ul>
	</div>
	<div class="toc-col">
		<h4>Analysis &amp; services</h4>
		<ul>
			<li><a href="#geoprocessing">Geoprocessing</a></li>
			<li><a href="#routing">Routing</a></li>
			<li><a href="#geocoding">Geocoding</a></li>
		</ul>
		<h4>Integration</h4>
		<ul>
			<li><a href="#frameworks--build-systems">Frameworks &amp; build systems</a></li>
			<li><a href="#third-party-services">Third-party services</a></li>
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
* [Tile loading](#tile-loading)
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

### Tile loading

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

Load overlay data from third-party services. See also [basemap providers](#basemap-providers).

{% include plugin_list.html category="data-providers" %}


## Overlay display

The following plugins provide new ways of displaying overlay data information.

* [Markers & icons](#markers--icons)
* [Lines & shapes](#lines--shapes)
* [Styling & labels](#styling--labels)
* [Overlay animations](#overlay-animations)
* [Clustering/decluttering](#clusteringdecluttering)
* [Heatmaps](#heatmaps)
* [Data visualization](#data-visualization)


### Markers & icons

New kinds of markers and icons: icon fonts, SVG and canvas markers, photos, directional symbols, and markers for points outside the view.

{% include plugin_list.html category="markers-icons" %}

### Lines & shapes

Draw curves, geodesic lines, arcs and new shapes, or decorate lines with arrows, patterns and offsets.

{% include plugin_list.html category="lines-shapes" %}

### Styling & labels

Style overlays from data, fill them with patterns, or label them. Leaflet users versed in GIS also know these as symbolizers.

{% include plugin_list.html category="styling-labels" %}

### Overlay animations

These plugins animate markers or some geometries. See also [time & elevation](#time--elevation).

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

These plugins help users select either overlays or areas in the map, or make overlays easier to hover and click.

{% include plugin_list.html category="area-overlay-selection" %}


## Map interaction

New ways to interact with the map itself.

* [Layer switching & legends](#layer-switching--legends)
* [Navigation](#navigation)
* [Minimaps & synced maps](#minimaps--synced-maps)
* [Location & coordinates](#location--coordinates)
* [Measurement](#measurement)
* [Buttons & menus](#buttons--menus)
* [Sidebars & panels](#sidebars--panels)
* [Print & export](#print--export)

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

### Geoprocessing

The following plugins perform several sorts of geoprocessing (mathematical and topological operations on points, lines and polygons).

{% include plugin_list.html category="geoprocessing" %}

### Routing

The following plugins use external services to calculate driving or walking routes.

{% include plugin_list.html category="routing" %}

### Geocoding

External services that transform an address or the name of a place into latitude and longitude (or vice versa).

{% include plugin_list.html category="geocoding" %}


## Integration

### Frameworks & build systems

Ease your development integrating Leaflet into a development framework or automating some of the javascript/CSS work for complex applications.

{% include plugin_list.html category="frameworks-build-systems" %}

### Third-party services

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

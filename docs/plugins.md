---
layout: v2
title: Plugins
bodyclass: plugins-page
---

## Leaflet Plugins

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


{% for category in site.data.plugins.categories %}

## {{ category.name }}

{{ category.description }}

{% for subcategory in category.subcategories %}* [{{subcategory.name}}](#basemap-providers)
{% endfor %}


{% for subcategory in category.subcategories %}

### {{ subcategory.name }}

{{ subcategory.description }}

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>

{% for plugin in subcategory.plugins %}
	<tr>
		<td>
			<a href="{{ plugin.repo }}">{{ plugin.name }}</a>
			{% if plugin.npm %}<div style='font-size:70%'><tt>npm install {{plugin.npm}}</tt></div>{% endif %}
		</td>
		<td>
			<div>{{ plugin.description }}</div>

			{% if plugin.demo %}<div><a href='{{ plugin.demo }}'>Demo</a>.</div>{% endif %}

			<div>
			{% case plugin['worksWith.v0.7'] %}
			{% when nil %}
				<img src='https://img.shields.io/badge/Leaflet%200.7-%3F%3F%3F-a0a0a0.svg?colorA=C0C0C0&colorB=A0A0A0'/>
			{% when true %}
				<img src='https://img.shields.io/badge/Leaflet%200.7-yes-yellowgreen.svg?colorA=C0C0C0'/>
			{% else %}
				<img src='https://img.shields.io/badge/Leaflet%200.7-no-800000.svg?colorA=C0C0C0'/>
			{% endcase %}

			{% case plugin['worksWith.v1.0'] %}
			{% when nil %}
				<img src='https://img.shields.io/badge/Leaflet%201.0-%3F%3F%3F-a0a0a0.svg?colorA=C0C0C0&colorB=A0A0A0'/>
			{% when true %}
				<img src='https://img.shields.io/badge/Leaflet%201.0-yes-yellowgreen.svg?colorA=C0C0C0'/>
			{% else %}
				<img src='https://img.shields.io/badge/Leaflet%201.0-no-800000.svg?colorA=C0C0C0'/>
			{% endcase %}
			</div>
		</td>
		<td>
			<a href="{{ plugin.author-url }}">{{ plugin.author }}</a>
		</td>
	</tr>
{% endfor %}
</table>

{% endfor %}

{% endfor %}

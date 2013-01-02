---
layout: default
title: Plugins
---

## Notable Leaflet Plugins

While Leaflet is meant to be as lightweight as possible, and focuses on a core set of features, an easy way to extend its functionality is to use third-party plugins. Thanks to the awesome community behind Leaflet, there are lots of nice plugins to choose from.

---

### Layers and Overlays

<table class="plugins">
	<tr>
		<th>Plugin</th>
		<th>Description</th>
		<th>Maintainer</th>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/danzel/Leaflet.markercluster">Leaflet.markercluster</a>
		</td><td>
			Beautiful, sophisticated, high performance marker clustering solution with smooth animations and lots of great features. <em>Recommended!</em>
		</td><td>
			<a href="https://github.com/danzel">Dave Leaver</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jacobtoye/Leaflet.label">Leaflet.label</a>
		</td><td>
			Adds text labels to map markers and vector layers.
		</td><td>
			<a href="https://github.com/jacobtoye">Jacob Toye</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://dynmeth.github.com/RaphaelLayer/">RaphaelLayer</a>
		</td><td>
			Allows you to use <a href="http://raphaeljs.com/">Raphael</a> as a layer on a Leaflet map for advanced animations and visualizations.
		</td><td>
			<a href="https://github.com/dynmeth">Dynamic Methods</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet">Overlapping Marker Spiderfier</a>
		</td><td>
			Deals with overlapping markers in a Google Earth-inspired way by gracefully springing them apart on click.
		</td><td>
			<a href="http://mackerron.com">George MacKerron</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/aparshin/leaflet-boundary-canvas">TileLayer.BoundaryCanvas</a>
		</td><td>
			Allows you to draw tile layers with arbitrary polygonal boundary. HTML5 Canvas is used for rendering.
		</td><td>
			<a href="https://github.com/aparshin">Alexander Parshin</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/domoritz/leaflet-maskcanvas">MaskCanvas</a>
		</td><td>
			Canvas layer that can be used to visualize coverage.
		</td><td>
			<a href="https://github.com/domoritz">Dominik Moritz</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/sunng87/heatcanvas">HeatCanvas</a>
		</td><td>
			Simple heatmap api based on HTML5 canvas.
		</td><td>
			<a href="https://github.com/sunng87">Sun Ning</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/openplans/Leaflet.AnimatedMarker">Leaflet.AnimatedMarker</a>
		</td><td>
			Animate a marker along a polyline.
		</td><td>
			<a href="https://github.com/atogle">Aaron Ogle</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jieter/Leaflet-semicircle">Leaflet-semicircle</a>
		</td><td>
			Adds functionality to <pre>L.Circle</pre> to draw semicircles.
		</td><td>
			<a href="https://github.com/jieter">Jieter</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ismyrnow/Leaflet.functionaltilelayer">Leaflet.FunctionalTileLayer</a>
		</td><td>
			Allows you to define tile layer URLs using a function, with support for jQuery deferreds.
		</td><td>
			<a href="https://github.com/ismyrnow">Ishmael Smyrnow</a>
		</td>
	</tr>
</table>


### Services, Providers and Formats

<table class="plugins">
	<tr>
		<th>Plugin</th>
		<th>Description</th>
		<th>Maintainer</th>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/kartena/Proj4Leaflet">Proj4Leaflet</a>
		</td><td>
			<a href="http://trac.osgeo.org/proj4js/">Proj4js</a> integration plugin, allowing you to use all kinds of weird projections in Leaflet.
		</td><td>
			<a href="http://www.kartena.se/">Kartena</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/shramov/leaflet-plugins">Plugins by Pavel Shramov</a>
		</td><td>
			A set of plugins for: GPX, KML layers; Bing tile layer; Google and Yandex layers (implemented with their APIs), Permalink and alternative Scale controls.
		</td><td>
			<a href="https://github.com/shramov">Pavel Shramov</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://vizzuality.github.com/cartodb-leaflet/">cartodb-leaflet</a>
		</td><td>
			Official <a href="http://cartodb.com/">CartoDB</a> plugin for Leaflet.
		</td><td>
			<a href="http://vizzuality.com/">Vizzuality</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://geojason.info/leaflet-vector-layers/">Leaflet Vector Layers</a>
		</td><td>
			Allows to easily create vector layers from a number of geo web services, such as ArcGIS Server, Arc2Earth, GeoIQ, CartoDB and GIS Cloud.
		</td><td>
			<a href="http://geojason.info">Jason Sanford</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/perliedman/leaflet-tilejson">leaflet-tilejson</a>
		</td><td>
			Adds support for the <a href="https://github.com/mapbox/TileJSON">TileJSON</a> specification to Leaflet.
		</td><td>
			<a href="https://github.com/perliedman">Per Liedman</a>, <a href="http://www.kartena.se/">Kartena</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/seelmann/leaflet-providers">leaflet-providers</a>
		</td><td>
			Contains configurations for various free tile providers &mdash; OSM, OpenCycleMap, MapQuest, Mapbox Streets, Stamen, Esri, etc.
		</td><td>
			<a href="https://github.com/seelmann">Stefan Seelmann</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/azgs/azgs-leaflet">azgs-leaflet</a>
		</td><td>
			A set of small plugins for Leaflet, including WFS-GeoJSON layer with filtering, a hover control for GeoJSON, and an Esri tile layer.
		</td><td>
			<a href="https://github.com/azgs">AZGS</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/sa3m/leaflet-control-bing-geocoder">Leaflet Control Bing Geocoder</a>
		</td><td>
			A simple geocoder control that uses Bing to locate places.
		</td><td>
			<a href="https://github.com/sa3m">Samuel Piquet</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/calvinmetcalf/leaflet-ajax">Leaflet Ajax</a>
		</td><td>
			Add GeoJSON data via ajax or jsonp.
		</td><td>
			<a href="https://github.com/calvinmetcalf/">Calvin Metcalf</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/calvinmetcalf/leaflet.pouch">Leaflet.Pouch</a>
		</td><td>
			Use PouchDB to sync CouchDB data to local storage (indexedDB), to just add couchDB data or as just a less confusing implementation of indexedDB.
		</td><td>
			<a href="https://github.com/calvinmetcalf/">Calvin Metcalf</a>
		</td>
	</tr>
</table>


### Controls and Interaction

<table class="plugins">
	<tr>
		<th>Plugin</th>
		<th>Description</th>
		<th>Maintainer</th>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jacobtoye/Leaflet.draw">Leaflet.draw</a>
		</td><td>
			Enables drawing features like polylines, polygons, rectangles, circles and markers through a very nice user-friendly interface with icons and hints. <em>Recommended!</em>
		</td><td>
			<a href="https://github.com/jacobtoye">Jacob Toye</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/danzel/Leaflet.utfgrid">Leaflet.utfgrid</a>
		</td><td>
			Provides a utfgrid interaction handler for leaflet a very small footprint.
		</td><td>
			<a href="https://github.com/danzel">Dave Leaver</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/kartena/Leaflet.EditableHandlers">Leaflet.EditableHandlers</a>
		</td><td>
			A set of plugins that includes circle editing, measuring tool, and label for polygon sides.
		</td><td>
			<a href="http://www.kartena.se/">Kartena</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://kartena.github.com/Leaflet.Pancontrol/">Leaflet.Pancontrol</a>
		</td><td>
			A simple panning control.
		</td><td>
			<a href="http://www.kartena.se/">Kartena</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://kartena.github.com/Leaflet.zoomslider/">Leaflet.zoomslider</a>
		</td><td>
			A zoom slider control.
		</td><td>
			<a href="http://www.kartena.se/">Kartena</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/domoritz/leaflet-locatecontrol">Leaflet.Locate</a>
		</td><td>
			A customizable locate control.
		</td><td>
			<a href="https://github.com/domoritz">Dominik Moritz</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://elidupuis.github.com/leaflet.zoomfs">leaflet.zoomfs</a>
		</td><td>
			A fullscreen button control.
		</td><td>
			<a href="https://github.com/elidupuis">Eli Dupuis</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://brunob.github.com/leaflet.fullscreen">leaflet.fullscreen</a>
		</td><td>
			Another fullscreen button control but for modern browsers, using HTML5 Fullscreen API.
		</td><td>
			<a href="https://github.com/brunob/">Bruno B</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/stefanocudini/leaflet-search">leaflet-search</a>
		</td><td>
			Simple Leaflet Control for searching markers by attribute.
		</td><td>
			<a href="https://github.com/stefanocudini/">Stefano Cudini</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/tripbirds/leaflet-locationfilter/">leaflet-locationfilter</a>
		</td><td>
			A draggable/resizable rectangle for selecting an area on the map.
		</td><td>
			<a href="https://github.com/kajic">Robert Kajic</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Norkart/Leaflet-MiniMap">Leaflet.MiniMap</a>
		</td><td>
			A small minimap showing the map at a different scale to aid navigation.
		</td><td>
			<a href="https://github.com/robpvn">Robert Nordan</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://erictheise.github.com/rrose">Leaflet.Rrose</a>
		</td><td>
			A Leaflet Plugin for Edge Cases.  For use when you want popups on _mouseover_, not _click_, and
			you need popup tips to reorient as you get close to the edges of your map.  
		</td><td>
			<a href="http://www.linkedin.com/in/erictheise">Eric Theise</a>
		</td>
	</tr>
</table>


### Other Plugins and Libraries

<table class="plugins">
	<tr>
		<th>Plugin</th>
		<th>Description</th>
		<th>Maintainer</th>
	</tr>
	<tr>
		<td>
			<a href="http://flyjs.com/buildings/">OSM Buildings</a>
		</td><td>
			Amazing JS library for visualizing 3D OSM building data on top of Leaflet.
		</td><td>
			<a href="http://flyjs.com/buildings/about.php">Jan Marsch</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://www.mapsmarker.com/">Leaflet Maps Marker</a>
		</td><td>
			A Wordpress plugin that uses Leaflet and a set of its plugins for adding maps to your posts through a nice admin interface.
		</td><td>
			<a href="http://www.harm.co.at/">Robert Harm</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mlevans/leaflet-hash">leaflet-hash</a>
		</td><td>
			Plugin for persisting map state and browsing history through the URL hash.
		</td><td>
			<a href="https://github.com/mlevans">Michael Lawrence Evans</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/springmeyer/arc.js">arc.js</a>
		</td><td>
			A JS library for drawing great circle routes that can be used with Leaflet.
		</td><td>
			<a href="https://github.com/springmeyer">Dane Springmeyer</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/yohanboniface/Leaflet.Storage">Leaflet.Storage</a>
		</td><td>
			Create/update/delete Map, Marker, Polygon, Polyline... and expose them for backend storage with an API.
		</td><td>
			<a href="http://yohanboniface.me/">Yohan Boniface</a>
		</td>
	</tr>
</table>

<!--
- Saving a Leaflet Map to a PNG Example using Javascript and PHP https://github.com/tegansnyder/Leaflet-Save-Map-to-PNG
- Get a PNG from a Leaflet map and export it in PDF https://github.com/chrissom/leaflet-pdf
-->

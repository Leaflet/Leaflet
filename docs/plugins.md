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

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/leaflet-extras/leaflet-providers">leaflet-providers</a>
		</td><td>
			Contains configurations for various free tile providers &mdash; OSM, OpenCycleMap, Stamen, Esri, etc.
		</td><td>
			<a href="https://github.com/leaflet-extras">leaflet-extras members</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/tontita/Leaflet.KoreanTmsProviders">Leaflet.KoreanTmsProviders</a>
		</td><td>
			Contains configurations for various (South) Korean tile providers — Daum, Naver, VWorld, etc.
		</td><td>
			<a href="https://github.com/tontita/">Seong Choi</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/htoooth/Leaflet.ChineseTmsProviders">Leaflet.ChineseTmsProviders</a>
		</td><td>
			Contains configurations for various Chinese tile providers — TianDiTu, MapABC, GaoDe, etc.
		</td><td>
			<a href="https://github.com/htoooth/">Tao Huang</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://esri.github.io/esri-leaflet">Esri Leaflet</a>
		</td><td>
			A set of tools for using ArcGIS services with Leaflet. Support for map services, feature layers, ArcGIS Online tiles and more.
		</td><td>
			<a href="https://github.com/patrickarlt/">Patrick Arlt</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/aparshin/leaflet-GIBS">Leaflet.GIBS</a>
		</td><td>
			 <a href="https://earthdata.nasa.gov/gibs">NASA EOSDIS GIBS</a> imagery integration. The plugin provides <a href="https://wiki.earthdata.nasa.gov/display/GIBS/GIBS+Available+Imagery+Products">96 daily updated layers</a> with satellite imagery and science parameters. <a href="http://aparshin.github.io/leaflet-GIBS/examples/">Demo</a>.
		</td><td>
			<a href="https://github.com/aparshin">Alexander Parshin</a>
		</td>
	</tr>
        <tr>
		<td>
			<a href="https://github.com/knreise/L.TileLayer.Kartverket">L.TileLayer.Kartverket</a>
		</td><td>
			Provides easy setup of the tile layers from <a href="http://kartverket.no/Kart/Gratis-kartdata/Cache-tjenester/">Kartverket</a> (The Norwegian Mapping Authority)
		</td><td>
			<a href="https://github.com/knreise">Kultur og naturreise</a> / <a href="https://github.com/atlefren">Atle Frenvik Sveen</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/sigdeletras/Leaflet.Spain.WMS">Leaflet.Spain.WMS</a>
		</td><td>
			Provides easy setup for several Web Map Services (WMS) layers for Spain (PNOA, IGN base, Catastro, etc), from Spanish mapping agencies.
		</td><td>
			<a href="https://github.com/sigdeletras">Patricio Soriano</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/GeoSensorWebLab/polarmap.js">PolarMap.js</a>
		</td><td>
			JavaScript library for displaying tiles from <a href="http://webmap.arcticconnect.org">ArcticWebMap</a>, a free tile provider with OSM data in multiple Arctic polar projections. Includes lower-level API for deeper integration with other Leaflet plugins.
		</td><td>
			<a href="https://github.com/geosensorweblab">GeoSensorWeb Lab</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/gmaclennan/leaflet-bing-layer">Bing Maps Layer</a>
		</td><td>
			Add <a href="https://msdn.microsoft.com/en-us/library/ff701721.aspx">Bing Maps tiles</a> to your Leaflet Map. Requires Leaflet v1.0.0.beta.2 or later.
		</td><td>
			<a href="https://github.com/gmaclennan">Gregor MacLennan</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://gitlab.com/IvanSanchez/Leaflet.TileLayer.HERE">L.TileLayer.HERE</a>
		</td><td>
			Displays map tiles from HERE maps (<a href="https://ivansanchez.gitlab.io/Leaflet.TileLayer.HERE/demo.html">demo</a>).
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://gitlab.com/IvanSanchez/Leaflet.GridLayer.GoogleMutant">L.GridLayer.GoogleMutant</a>
		</td><td>
			Displays Google maps (with minimal artifacts thanks to a <a href='https://developer.mozilla.org/en-US/docs/Web/API/MutationObserver'>DOM mutation observer</a> technique) (<a href="http://ivansanchez.gitlab.io/Leaflet.GridLayer.GoogleMutant/demo.html">demo</a>).
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://gitlab.com/IvanSanchez/Leaflet.MapkitMutant">L.MapkitMutant</a>
		</td><td>
			Displays Apple's MapkitJS basemaps.
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez</a>
		</td>	</tr>
	<tr>
        <td>
        	<a href="https://supermap.github.io/supermap-leaflet">SuperMap Leaflet</a>
        </td><td>
         SuperMap Leaflet is a Leaflet plugins for working with SuperMap service types.
         Support for SuperMap services, tiles and more.
        </td><td>
        	<a href="https://github.com/SuperMap">SuperMap</a>
        </td>
    </tr>
	<tr>
        <td>
        	<a href="https://github.com/MIERUNE/Leaflet.TileLayer.MIERUNE">Leaflet.TileLayer.Mierune</a>
        </td><td>
			Displays tiles from <a href="https://mierune.co.jp/tile.html">Mierune map</a>. (<a href="https://tile.mierune.co.jp">Demo</a>)
        </td><td>
        	<a href="https://github.com/MIERUNE">Mierune</a>
        </td>
    </tr>
	<tr>
		<td>
			<a href="https://github.com/rzoller/Leaflet.TileLayer.Swiss">Leaflet.TileLayer.Swiss</a>
		</td><td>
			Displays national maps of Switzerland using WMTS services of swisstopo.
			<a href="https://rzoller.ch/Leaflet.TileLayer.Swiss/examples/basic.html">Demo</a>.
		</td><td>
			<a href="https://github.com/rzoller">Roman Zoller</a>
		</td>
	</tr>
</table>



### Basemap formats

Plugins for loading basemaps or GIS raster layers in common (albeit non-default) formats.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/mylen/leaflet.TileLayer.WMTS">leaflet.TileLayer.WMTS</a>
		</td><td>Add WMTS (IGN) layering for leaflet.
		</td><td>
			<a href="https://github.com/mylen">Alexandre Melard</a>
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
			<a href="https://github.com/heigeo/leaflet.wms">leaflet.wms</a>
		</td><td>
			Enhanced WMS support for Leaflet, including single-tile/untiled layers, shared WMS sources, and layer identify via GetFeatureInfo.
		</td><td>
			<a href="https://github.com/sheppard/">S. Andrew Sheppard</a><br>(<a href="https://github.com/heigeo/">HEI Geo</a>)
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/stuartmatthews/Leaflet.NonTiledLayer.WCS">Leaflet.NonTiledLayer.WCS</a>
		</td><td>
			Display raster data from Web Coverage Services.  Rasters can be styled and queried in the client.  See the <a href="https://stuartmatthews.github.io/Leaflet.NonTiledLayer.WCS/">demo</a>.
		</td><td>
			<a href="https://github.com/stuartmatthews">Stuart Matthews</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/balrog-kun/Leaflet.bpg">Leaflet.bpg</a>
		</td><td>
			TileLayer with <a href="http://bellard.org/bpg/">.bpg</a> image format decoding.
		</td><td>
			<a href="https://github.com/balrog-kun/">Andrzej Zaborowski</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/glenrobertson/leaflet-tilelayer-geojson/">TileLayer.GeoJSON</a>
		</td><td>
			A TileLayer for GeoJSON tiles.
		</td><td>
			<a href="https://github.com/glenrobertson">Glen Robertson</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/kartena/leaflet-tilejson">leaflet-tilejson</a>
		</td><td>
			Adds support for the <a href="https://github.com/mapbox/TileJSON">TileJSON</a> specification to Leaflet.
		</td><td>
			<a href="https://github.com/perliedman">Per Liedman</a>, <a href="http://www.kartena.se/">Kartena</a>
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
			<a href="https://github.com/emikhalev/leaflet-2gis">Leaflet-2gis</a>
		</td><td>
			Adds support for 2GIS tile layer
		</td><td>
			<a href="https://github.com/emikhalev/">Eugene Mikhalev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/geobricks/Leaflet.GeoJSON.Encoded">Leaflet GeoJSON Encoded</a>
		</td><td>
			Extends the L.GeoJSON layer using Google polyline encoding algorithm, allowing an optimized data transfer.
		</td><td>
			<a href="https://github.com/geobricks/">Geobricks</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://gitlab.com/IvanSanchez/Leaflet.TileLayer.MBTiles">Leaflet.TileLayer.MBTiles</a>
		</td><td>
			Loads <a href="https://github.com/mapbox/mbtiles-spec"><code>.mbtiles</code></a> tilesets.
		</td><td>
			<a href="https://github.com/IvanSanchez/">Iván Sánchez</a>
		</td>
	</tr>
    <tr>
		<td>
			<a href="https://github.com/IHCantabria/Leaflet.CanvasLayer.Field">Leaflet.CanvasLayer.Field</a>
		</td><td>
			Loads and styles raster files (geotiff & asciigrid formats).
            It includes a <code>ScalarField</code> layer (for DTM, temperature...) and
			<code>VectorFieldAnim</code> (an animated layer for wind, currents...). See the <a href="https://ihcantabria.github.io/Leaflet.CanvasLayer.Field/">examples</a>
		</td><td>
			<a href="https://github.com/VictorVelarde">Víctor Velarde</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/stuartmatthews/leaflet-geotiff">leaflet-geotiff</a>
		</td><td>
			Display raster data from geoTIFF files as images or direction arrows.  Rasters can be styled and queried in the client.  An optional clipping mask can be applied, e.g. to restrict DEMs to land areas.  See the <a href="https://stuartmatthews.github.io/leaflet-geotiff/">demo</a>.
		</td><td>
			<a href="https://github.com/stuartmatthews">Stuart Matthews</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/GeoportalPL/leaflet.projwmts">Leaflet.projwmts</a>
		</td><td>
			Adding WMTS services (GUGiK Poland).
		 (<a href="https://geoportalpl.github.io/leaflet.projwmts/examples/wmts_services.html">demo</a>).
		</td><td>
			<a href="https://github.com/GeoportalPL">Geoportal Poland</a>
		</td>
	</tr>
</table>


### Non-map base layers

Sometimes you don't want to load a map, just big custom images. **Really** big ones.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/turban/Leaflet.Zoomify">TileLayer.Zoomify</a>
		</td><td>
			A TileLayer for Zoomify images.
		</td><td>
			<a href="https://github.com/turban">Bjørn Sandvik</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/alfarisi/leaflet-deepzoom">TileLayer.DeepZoom</a>
		</td><td>
			A TileLayer for DeepZoom images.
		</td><td>
			<a href="https://github.com/alfarisi">Al Farisi</a>,
			<a href="http://indokreatif.net">Indokreatif Teknologi</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/namrehs/Leaflet.Gigapan">TileLayer.Gigapan</a>
		</td><td>
			A TileLayer for Gigapan images.
		</td><td>
			<a href="https://github.com/namrehs">Dan Sherman</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/astromatic/Leaflet.TileLayer.IIP">Leaflet.TileLayer.IIP</a>
		</td><td>Add support for <a href="http://iipimage.sourceforge.net/">IIPImage</a> layers in Leaflet.
		</td><td>
			<a href="https://github.com/ebertin">Emmanuel Bertin</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mejackreed/Leaflet-IIIF">Leaflet-IIIF</a>
		</td><td>
			A <a href="http://iiif.io/">IIIF</a> (International Image Interoperability Framework) viewer for Leaflet. See the <a href="http://mejackreed.github.io/Leaflet-IIIF/examples/example.html">demo</a>.
		</td><td>
			<a href="https://github.com/mejackreed">Jack Reed</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/aparshin/leaflet-fractal">leaflet-fractal</a>
		</td><td>
			Renders some fractals (Mandelbrot set, Julia set and some others) using 2D canvas (<a href="http://aparshin.github.io/leaflet-fractal/">demo</a>).
		</td><td>
			<a href="https://github.com/aparshin">Alexander Parshin</a>
		</td>
	</tr>
	<tr>
	  <td>
	    <a href="https://github.com/commenthol/leaflet-rastercoords">leaflet-rastercoords</a>
	  </td><td>
	    Renders large tiled images generated with
	    <a href="http://github.com/commenthol/gdal2tiles-leaflet">gdal2tiles-leaflet</a>.
	    Image raster coordinates can be used to set markers, etc.
	    (<a href="http://commenthol.github.io/leaflet-rastercoords">demo</a>).
	  </td><td>
	    <a href="https://github.com/commenthol">Commenthol</a>
	  </td>
	</tr>
</table>



### Tile/image display

The following plugins change the way that tile or image layers are displayed in the map.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
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
			<a href="https://github.com/Zverik/leaflet-grayscale/">TileLayer.Grayscale</a>
		</td><td>
			A regular TileLayer with grayscale makeover.
		</td><td>
			<a href="https://github.com/Zverik">Ilya Zverev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ScanEx/Leaflet.imageTransform">Leaflet.ImageTransform</a>
		</td><td>Add support of image overlays with arbitrary perspective transformation.
		</td><td>
			<a href="https://github.com/aparshin">Alexander Parshin</a>,
			<a href="https://github.com/OriginalSin">Sergey Alekseev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/lizardtechblog/Leaflet.OpacityControls">Leaflet.OpacityControls</a>
		</td><td>
			Simple Leaflet controls to adjust the opacity of a map layer.
		</td><td>
			<a href="https://github.com/lizardtechblog/">Jared Dominguez</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/publiclab/Leaflet.DistortableImage">Leaflet.DistortableImage</a>
		</td><td>
			Enable users to <a href="https://publiclab.github.io/Leaflet.DistortableImage/examples/">scale, rotate, and distort images</a> on Leaflet maps.
		</td><td>
			<a href="https://github.com/publiclab">Public Lab</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ronikar/Leaflet.DistortableVideo">Leaflet.DistortableVideo</a>
		</td><td>
			Enable users to scale, rotate, and distort videos on Leaflet maps.  (<a href='https://ronikar.github.io/Leaflet.DistortableVideo/examples/'>demo</a>).
		</td><td>
			<a href="https://github.com/ronikar">Roni Karilkar</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/IvanSanchez/Leaflet.ImageOverlay.Rotated">Leaflet.ImageOverlay.Rotate</a>
		</td><td>
			Displays rotated, scaled and skewed (but not rubbersheeted) ImageOverlays, given three control points. (<a href='http://ivansanchez.github.io/Leaflet.ImageOverlay.Rotated/demo.html'>demo</a>).
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez Ortega</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/frogcat/leaflet-tilelayer-mask">Leaflet.TileLayer.Mask</a>
		</td><td>
			A TileLayer with mask effect (<a href="http://frogcat.github.io/leaflet-tilelayer-mask/default/">demo</a>)
		</td><td>
			<a href="https://github.com/frogcat">Yuzo Matsuzawa</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/GreenInfo-Network/L.TileLayer.PixelFilter/">Leaflet.TileLayer.PixelFilter</a>
		</td><td>
			A TileLayer which can filter and replace pixels by RGB code.
			<br/>
			<a href="http://greeninfo-network.github.io/L.TileLayer.PixelFilter/demo1.html">demo 1</a> &bull; <a href="http://greeninfo-network.github.io/L.TileLayer.PixelFilter/demo2.html">demo 2</a>
		</td><td>
			<a href="https://github.com/GreenInfo-Network/">GreenInfo Network</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/digidem/leaflet-side-by-side">Leaflet.Control.SideBySide</a>
		</td><td>
			A Leaflet control to add a split screen to compare two map overlays (<a href="http://lab.digital-democracy.org/leaflet-side-by-side/">demo</a>).
		</td><td>
			<a href="http://www.digital-democracy.org">Digital Democracy</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://gitlab.com/IvanSanchez/Leaflet.TileLayer.GL">Leaflet.TileLayer.GL</a>
		</td><td>
			Applies custom WebGL shaders to each tile in a tilelayer (<a href="https://ivansanchez.gitlab.io/Leaflet.TileLayer.GL/demo/repl.html">demo</a>).
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/frogcat/leaflet-tilelayer-colorpicker">Leaflet.TileLayer.ColorPicker</a>
		</td><td>
			A Leaflet TileLayer with getColor(latLng). Demos: <a href="https://frogcat.github.io/leaflet-tilelayer-colorpicker/">color picker</a>, <a href="https://frogcat.github.io/leaflet-tilelayer-colorpicker/mapbox-terrain-rgb.html">elevation picker with mapbox terrain-RGB</a>
		</td><td>
			<a href="https://github.com/frogcat">Yuzo Matsuzawa</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/hnrchrdl/leaflet-tilelayer-colorizr">Leaflet.TileLayer.Colorizr</a>
		</td><td>
			A Leaflet TileLayer which can modify colors by RGBA code. Demos: coming soon.
		</td><td>
			<a href="https://github.com/hnrchrdl">Hinrich Riedel</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/consbio/Leaflet.UTFGrid">Leaflet.UTFGrid</a>
		</td><td>
			Provides UTF-8 Grid support for Leaflet >= 1.0.  Includes basic mouseover support plus ability to highlight feature from UTFGrid on hover (<a href="https://consbio.github.io/Leaflet.UTFGrid/">demo</a>).
		</td><td>
			<a href="https://github.com/brendan-ward">Brendan Ward</a>
		</td>
	</tr>
	<tr>
        	<td>
        		<a href="https://github.com/dayjournal/Leaflet.Control.Opacity">Leaflet.Control.Opacity</a>
        	</td><td>
			Make multiple tile layers transparent. (<a href="https://dayjournal.github.io/Leaflet.Control.Opacity">demo</a>)
        	</td><td>
        		<a href="https://day-journal.com">Yasunori Kirimoto</a>
        	</td>
    	</tr>
</table>



### Tile Load

The following plugins change the way that tile layers are loaded into the map.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/mattiasb/Leaflet.MultiTileLayer">Leaflet.MultiTileLayer</a>
		</td><td>
			Allows to compose a TileLayer from several tile sources. Each source is active only on a defined set of zoomlevels.
		</td><td>
			<a href="https://github.com/mattiasb">Mattias Bengtsson</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ismyrnow/Leaflet.functionaltilelayer">Leaflet.FunctionalTileLayer</a>
		</td><td>
			Allows you to define tile layer URLs using a function. Even works with asynchronous sources, using promises.
		</td><td>
			<a href="https://github.com/ismyrnow">Ishmael Smyrnow</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/gregallensworth/L.TileLayer.Cordova">TileLayer.Cordova</a>
		</td><td>
			For use with Cordova/Phonegap, adds tile caching onto local device storage, switching between offline and online mode.
		</td><td>
			<a href="https://github.com/gregallensworth">Greg Allensworth</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/MazeMap/Leaflet.TileLayer.PouchDBCached">TileLayer.PouchDBCached</a>
		</td><td>
			Allows all Leaflet TileLayers to cache into PouchDB for offline use.
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez Ortega</a>,
			<a href="https://github.com/MazeMap">MazeMap</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ebrelsford/Leaflet.loading">Leaflet.loading</a>
		</td><td>
			A simple control that adds a loading indicator as tiles and other data are loaded.
		</td><td>
			<a href="https://github.com/ebrelsford/">Eric Brelsford</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/TolonUK/Leaflet.EdgeBuffer">Leaflet.EdgeBuffer</a>
		</td><td>
			Buffer tiles beyond the edge of the viewport, for Leaflet 1.0. <a href="http://www.tolon.co.uk/Leaflet.EdgeBuffer/comparison.html">Demo</a>.
		</td><td>
			<a href="https://github.com/TolonUK">Alex Paterson</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ghybs/Leaflet.TileLayer.Fallback">Leaflet.TileLayer.Fallback</a>
		</td><td>
			Replaces missing Tiles (HTTP 404 Not Found Error) by scaled up equivalent Tiles from lower zooms.
		</td><td>
			<a href="https://github.com/ghybs">ghybs</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Outdooractive/Leaflet.FeatureGroup.LoadEvents">Leaflet.FeatureGroup.LoadEvents</a>
		</td><td>
			`FeatureGroup` that supports the `"loading"` and `"load"` events (for v0.7.*).
		</td><td>
			<a href="http://glat.info">G. Lathoud</a>, <a href="http://www.outdooractive.com">Outdooractive</a>.
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://gitlab.com/IvanSanchez/Leaflet.GridLayer.FadeOut">Leaflet.GridLayer.FadeOut</a>
		</td><td>
			Fades out grid layers and tilelayers when they are removed, making basemap changes smoother (for 1.0.0). <a href="http://ivansanchez.gitlab.io/Leaflet.GridLayer.FadeOut/demo.html">Demo</a>.
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/robertomlsoares/leaflet-offline">leaflet-offline</a>
		</td><td>
			Allows the use of offline tiles in a customizable way while falling back to the normal TileLayer when necessary. <a href="https://robertomlsoares.github.io/leaflet-offline/">Demo</a>.
		</td><td>
			<a href="https://github.com/robertomlsoares">Roberto Soares</a>
		</td>
	</tr>
</table>



### Vector tiles

Plugins to display [vector tiles](https://github.com/mapbox/vector-tile-spec).

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/SpatialServer/Leaflet.MapboxVectorTile">Leaflet.MapboxVectorTile</a>
		</td><td>
			A Leaflet Plugin that renders Mapbox Vector Tiles on canvas. See <a href="http://spatialserver.github.io/Leaflet.MapboxVectorTile/examples/confetti.html">demo</a>. Compatible with Leaflet 0.7.x only.
		</td><td>
			<a href="http://spatialdev.com/">SpatialDev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/devTristan/hoverboard">Hoverboard</a>
		</td><td>
			Render vector tiles on canvas with leaflet (geojson, topojson, and protobuf). See <a href="http://tristan.io/hoverboard/">demo</a>. Compatible with Leaflet 0.7.x only.
		</td><td>
			<a href="http://tristan.io/">Tristan Davies</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mapbox/geojson-vt">geojson-vt</a>
		</td><td>
			Efficient library for slicing GeoJSON data into vector tiles on the fly.
		</td><td>
			<a href="https://www.mapbox.com/">Mapbox</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/IvanSanchez/Leaflet.VectorGrid">Leaflet.VectorGrid</a>
		</td><td>
			Display gridded vector data (GeoJSON or TopoJSON sliced with geojson-vt, or protobuf vector tiles) in Leaflet 1.0.0. See <a href="https://github.com/IvanSanchez/Leaflet.VectorGrid#demo">demos</a>. Not compatible with 0.7.x.
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://gitlab.com/jkuebart/Leaflet.VectorTileLayer/">Leaflet.VectorTileLayer</a>
		</td><td>
			A Leaflet layer for displaying vector tiles. Very similar to <a href="https://github.com/IvanSanchez/Leaflet.VectorGrid">Leaflet.VectorGrid</a> except for styling: a single style can be specified for all layers while VectorGrid requires knowing layer names in advance. For Leaflet 1.0.0.
		</td><td>
			<a href="https://gitlab.com/jkuebart/">Joachim Kuebart</a>
		</td>
	</tr>
</table>


## Overlay data

The following plugins provide new ways of loading overlay data (GIS vector data): points, lines and polygons.

* [Overlay data formats](#overlay-data-formats)
* [Dynamic data loading](#dynamiccustom-data-loading)
* [Synthetic overlays](#synthetic-overlays)
* [Data providers](#data-providers)

### Overlay data formats

Load your own data from various GIS formats.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
    <tr>
		<td>
			<a href="https://github.com/mapbox/leaflet-omnivore">leaflet-omnivore</a>
		</td><td>
			Loads &amp; converts CSV, KML, GPX, TopoJSON, WKT formats for Leaflet.
		</td><td>
			<a href="https://github.com/mapbox">Mapbox</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.FileLayer">Leaflet.FileLayer</a>
		</td><td>
			Loads files (GeoJSON, GPX, KML) into the map using the HTML5 FileReader API (i.e. locally without server).
		</td><td>
			<a href="https://github.com/leplatrem">Mathieu Leplatre</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/joker-x/Leaflet.geoCSV">Leaflet.geoCSV</a>
		</td><td>
			Leaflet plugin for loading a CSV file as geoJSON layer.
		</td><td>
			<a href="https://github.com/joker-x">Iván Eixarch</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/calvinmetcalf/leaflet.shapefile">Leaflet.Shapefile</a>
		</td><td>
			Put a shapefile onto your map as a layer.
		</td><td>
			<a href="https://github.com/calvinmetcalf">Calvin Metcalf</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/calvinmetcalf/leaflet.filegdb">Leaflet.FileGDB</a>
		</td><td>
			Put an ESRI File GeoDatabase onto your map as a layer.
		</td><td>
			<a href="https://github.com/calvinmetcalf">Calvin Metcalf</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jieter/Leaflet.encoded">Leaflet.encoded</a>
		</td><td>
			Use encoded polylines in Leaflet.
		</td><td>
			<a href="https://github.com/jieter">Jieter</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mpetazzoni/leaflet-gpx">Leaflet GPX</a>
		</td><td>
			GPX layer, targeted at sporting activities by providing access to information such as distance, moving time, pace, elevation, heart rate, etc.
		</td><td>
			<a href="https://github.com/mpetazzoni/">Maxime Petazzoni</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://arthur-e.github.com/Wicket/">Wicket</a>
		</td><td>
			A modest library for translating between Well-Known Text (WKT) and Leaflet geometry objects (e.g. between L.marker() instances and "POINT()" strings).
		</td><td>
			<a href="https://github.com/arthur-e/">K. Arthur Endsley</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/tomchadwin/qgis2web">qgis2web</a>
		</td><td>
			A <a href="http://qgis.org/">QGIS</a> plugin to make webmaps without coding.
		</td><td>
			<a href="https://github.com/tomchadwin">Tom Chadwin</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Flexberry/Leaflet-WFST">Leaflet-WFST</a>
		</td><td>
			<a href="http://www.opengeospatial.org/standards/wfs">WFS</a> client layer with transaction support
		</td><td>
			<a href="https://github.com/Flexberry/">Flexberry</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/daniellsu/leaflet-betterscale">Leaflet-BetterScale</a>
		</td><td>
			A new, more GIS-like scalebar with alternating black/white bars.
		</td><td>
			<a href="https://github.com/daniellsu/">Dan Brown</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ngageoint/geopackage-js/tree/master/leaflet">Leaflet-GeoPackage</a>
		</td><td>
			Load <a href="http://www.geopackage.org/">GeoPackage</a> Tile and Feature Layers.
		</td><td>
			<a href="https://github.com/danielbarela">Daniel Barela</a>,
			<a href="https://github.com/ngageoint">NGA</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/gherardovarando/leaflet-csvtiles">Leaflet-CsvTiles</a>
		</td><td>
		Load points from tiled csv files, using the amazing <a href="http://papaparse.com/">PapaParse</a> library. <a href="https://gherardovarando.github.io/leaflet-csvtiles/demo/index.html">Demo</a>.
		</td><td>
			<a href="https://github.com/gherardovarando">Gherardo Varando</a>
		</td>
	</tr>
</table>



### Dynamic/custom data loading

Load dynamic data which is updated in the map, or load GIS vector data in non-standard ways.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/perliedman/leaflet-realtime">Leaflet Realtime</a>
		</td><td>
			Put realtime data on a Leaflet map: live tracking GPS units, sensor data or just about anything.
		</td><td>
			<a href="https://github.com/perliedman/">Per Liedman</a>
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
			<a href="https://github.com/tinuzz/leaflet-liveupdate">Leaflet.Liveupdate</a>
		</td>
		<td>
			Periodically ('live') update something on a map (<a href="https://www.grendelman.net/leaflet/">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/tinuzz/">Martijn Grendelman</a>
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
	<tr>
		<td>
			<a href="https://github.com/cbaines/leaflet-indoor">Leaflet.Indoor</a>
		</td><td>
			Create indoor maps.
		</td><td>
			<a href="https://github.com/cbaines">Christopher Baines</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/BenjaminVadant/leaflet-ugeojson">Leaflet uGeoJSON</a>
		</td><td>
			Add an auto updating GeoJSON data Layer via ajax post requests.
		</td><td>
			<a href="https://github.com/BenjaminVadant/">Benjamin VADANT</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/dj0001/Leaflet.mytrack">Leaflet.mytrack</a>
		</td><td>Track my way on a map and download it. <a href="https://dj0001.github.io/Leaflet.mytrack">Demo</a>
		</td><td>
			<a href="https://github.com/dj0001">DJ</a>
		</td>
	</tr>
</table>



### Synthetic overlays

These plugins create useful overlays from scratch, no loading required.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/turban/Leaflet.Graticule">Leaflet.Graticule</a>
		</td><td>
			Draws a grid of latitude and longitude lines.
		</td><td>
			<a href="https://github.com/turban">Bjørn Sandvik</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ablakey/Leaflet.SimpleGraticule">Leaflet.SimpleGraticule</a>
		</td><td>
			Draws a grid lines for L.CRS.Simple coordinate system.
		</td><td>
			<a href="https://github.com/ablakey">Andrew Blakey</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jonshutt/Leaflet.OS.Graticule">L.OS.Graticule</a>
		</td><td>
			Overlays UK Ordinance Survey (OS) 1km grid squares and labels.
		</td><td>
			<a href="https://github.com/jonshutt">Jon Shutt</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/joergdietrich/Leaflet.Terminator">Leaflet.Terminator</a>
		</td><td>Overlay day and night regions on a map.
		</td><td>
			<a href="https://github.com/joergdietrich">J&ouml;rg Dietrich</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/dj0001/Leaflet.Sun">Leaflet.Sun</a>
		</td><td>Get sunset or sunrise at map click. <a href="https://dj0001.github.io/Leaflet.Sun">Demo</a>
		</td><td>
			<a href="https://github.com/dj0001">DJ</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/dj0001/Leaflet.timezones">Leaflet.timezones</a>
		</td><td>Overlay timezones on a Leaflet Earth map. <a href="https://dj0001.github.io/Leaflet.timezones">Demo</a>
		</td><td>
			<a href="https://github.com/dj0001">DJ</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/cloudybay/leaflet.latlng-graticule">leaflet.latlng-graticule</a>
		</td>
		<td>
			Create a Canvas as ImageOverlay to draw the Lat/Lon Graticule, and show the grid tick label at the edges of the map.<a href="https://cloudybay.github.io/leaflet.latlng-graticule/example/">Demo</a>.
		</td>
		<td>
			<a href="https://github.com/cloudybay/">CloudyBay</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://github.com/GEOF-OSGL/Leaflet.EdgeScaleBar">Leaflet.EdgeScaleBar</a>
		</td>
		<td>
			Creates scale bars along top and right edge of a map in the Web Mercator projection..<a href="http://geof-osgl.github.io/Leaflet.EdgeScaleBar/">Demo</a>.
		</td>
		<td>
			<a href="http://github.com/GEOF-OSGL">Dražen Tutić, Ana Kuveždić Divjak</a>
		</td>
	</tr>
</table>



### Data providers

Load overlay data from third-party-services. See also [basemap providers](#basemap-providers) and [plugin collections](#collections).

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="http://jasonsanford.github.io/leaflet-vector-layers/">Leaflet Vector Layers</a>
		</td><td>
			Allows to easily create vector layers from a number of geo web services, such as ArcGIS Server, Arc2Earth, GeoIQ, CartoDB and GIS Cloud.
		</td><td>
			<a href="http://geojason.info">Jason Sanford</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/GuillaumeAmat/leaflet-overpass-layer">Leaflet Overpass Layer</a>
		</td><td>
      Easily include data from the <a href="http://overpass-api.de">overpass api</a>.
		</td><td>
			<a href="https://github.com/GuillaumeAmat">Guillaume AMAT</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/kr1/Leaflet.dbpediaLayer/">Leaflet.dbpediaLayer</a>
		</td><td>
			A layer with Points of interest from Wikipedia - loaded via ajax from DBpedia's SPARQL endpoint.
		</td><td>
			<a href="https://github.com/kr1/">Kr1</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/MatthewBarker/leaflet-wikipedia">Leaflet-Wikipedia</a>
		</td>
		<td>
			A leaflet plugin to display Wikipedia API entries on a map layer.
		</td>
		<td>
			<a href="https://github.com/MatthewBarker">Matthew Barker</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/windycom/API">Windy-Leaflet-plugin</a>
		</td>
		<td>
			Displays animated weather map on your page using Windy's free API.
		</td>
		<td>
			<a href="https://www.windy.com">Windy.com</a>
		</td>
	</tr>
</table>



## Overlay display

The following plugins provide new ways of displaying overlay data information.

* [Markers & renderers](#markers--renderers)
* [Overlay animations](#overlay-animations)
* [Clustering/decluttering](#clusteringdecluttering)
* [Heatmaps](#heatmaps)
* [DataViz](#dataviz)


### Markers & renderers

These plugins provide new markers or news ways of converting abstract data into images in your screen. Leaflet users versed in GIS also know these as symbolizers.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/zhuang-hao-ming/Leaflet.RoughCanvas">Leaflet.RoughCanvas</a>
		</td><td>
			Leaflet.RoughCanvas renders hand-drawn, sketch style vector map(polyline, polygon, geojson).
		</td><td>
			<a href="https://github.com/zhuang-hao-ming/">haoming</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jdfergason/Leaflet.Ellipse">Leaflet.ellipse</a>
		</td><td>
			Leaflet.ellipse place ellipses on map by specifying center point, semi-major axis,
			semi-minor axis, and tilt degrees from west.
		</td><td>
			<a href="https://github.com/jdfergason">JD Fergason</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Leaflet/Leaflet.label">Leaflet.label</a>
		</td><td>
			Adds text labels to map markers and vector layers.
		</td><td>
			<a href="https://github.com/jacobtoye">Jacob Toye</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jieter/Leaflet-semicircle">Leaflet-semicircle</a>
		</td><td>
			Adds functionality to <code>L.Circle</code> to draw semicircles.
		</td><td>
			<a href="https://github.com/jieter">Jieter</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/bbecquet/Leaflet.PolylineDecorator">Leaflet.PolylineDecorator</a>
		</td><td>
			Allows you to draw patterns (like dashes, arrows or evenly spaced Markers) along Polylines or coordinate paths.
		</td><td>
			<a href="https://github.com/bbecquet">Benjamin Becquet</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/leaflet-extras/leaflet.sprite">Leaflet.Sprite</a>
		</td><td>
			Use sprite based icons in your markers.
		</td><td>
			<a href="https://github.com/calvinmetcalf">Calvin Metcalf</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.TextPath">Leaflet.TextPath</a>
		</td><td>
			Allows you to draw text along Polylines.
		</td><td>
			<a href="https://github.com/leplatrem">Mathieu Leplatre</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/iatkin/leaflet-svgicon">Leaflet-SVGIcon</a>
		</td><td>
			A simple and customizable SVG icon with no external dependencies. Also included is a convenience Marker class and two example subclasses. <a href="http://iatkin.github.io/leaflet-svgicon/">Customizable demo with example subclasses</a>
		</td><td>
			<a href="https://github.com/iatkin">Ilya Atkin</a>
		</td>
	</tr>
    	<tr>
		<td>
			<a href="https://github.com/marslan390/BeautifyMarker">Leaflet.BeautifyMarkers</a>
		</td><td>
			Lightweight plugin that adds colorful iconic markers without image and gives full control of style to end user (i.e. Unlimited colors and CSS styling).
		</td><td>
			<a href="https://github.com/marslan390">Muhammad Arslan Sajid</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/lvoogdt/Leaflet.awesome-markers">Leaflet.Awesome-Markers</a>
		</td><td>
			Colorful, iconic &amp; retina-proof markers based on the Font Awesome icons/Twitter Bootstrap icons
		</td><td>
			<a href="http://www.lennardvoogdt.nl">Lennard Voogdt</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/coryasilva/Leaflet.ExtraMarkers">Leaflet.Extra-Markers</a>
		</td><td>
			Shameless copy of Awesome-Markers with more shapes, colors and semantic-ui support
		</td><td>
			<a href="http://www.corysilva.com">Cory Silva</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jseppi/Leaflet.MakiMarkers">Leaflet.MakiMarkers</a>
		</td><td>Create markers using <a href="https://www.mapbox.com/maki/">Maki Icons</a> from MapBox.
		</td><td>
			<a href="https://github.com/jseppi">James Seppi</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/IvanSanchez/Leaflet.Icon.Glyph">Leaflet.Icon.Glyph</a>
		</td><td>
			Use icon font glyphs in your markers (from Font Awesome, Material Design Icons, Glyphicons,
			Metro UI icons, Elusive, and other icon fonts). (<a href='https://ivansanchez.github.io/Leaflet.Icon.Glyph/demo.html'>demo</a>)
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez Ortega</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.LineExtremities">Leaflet.LineExtremities</a>
		</td><td>
			Show symbols at the extremities of polylines, using SVG markers.
		</td><td>
			<a href="https://github.com/fredericbonifas">Frédéric Bonifas</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/hiasinho/Leaflet.vector-markers">Leaflet.VectorMarkers</a>
		</td><td>
			Vector SVG markers for Leaflet, with an option for Font Awesome/Twitter Bootstrap icons.
		</td><td>
			<a href="https://github.com/hiasinho">Mathias Schneider</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/teastman/Leaflet.pattern">Leaflet.pattern</a>
		</td><td>
			Add support for pattern fills on Paths.
		</td><td>
			<a href="https://github.com/teastman">Tyler Eastman</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/thomasbrueggemann/leaflet.boatmarker">Leaflet.BoatMarker</a>
		</td><td>
			A boat marker using HTML Canvas for displaying yachts and sailboats with heading and optional wind information. <a href="http://thomasbrueggemann.github.io/leaflet.boatmarker/">Demo</a>.
		</td><td>
			<a href="https://github.com/thomasbrueggemann">Thomas Brüggemann</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/heyman/leaflet-usermarker">leaflet-usermarker</a>
		</td><td>
			Plugin for plotting a marker representing a user - or multiple users - on a map,
			with support for drawing an accuraccy circle. Can be seen in action on
			<a href="http://longitude.me">Longitude.me</a>.
		</td><td>
			<a href="http://heyman.info">Jonatan Heyman</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/albburtsev/Leaflet.geojsonCSS">Leaflet.geojsonCSS</a>
		</td><td>
			<a href="http://wiki.openstreetmap.org/wiki/Geojson_CSS">Geojson CSS</a> implementation for Leaflet.
		</td><td>
			<a href="https://github.com/albburtsev/">Alexander Burtsev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://osmbuildings.org/">OSM Buildings</a>
		</td><td>
			Amazing JS library for visualizing 3D OSM building geometry on top of Leaflet.
		</td><td>
			<a href="https://github.com/kekscom/">Jan Marsch</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ubergesundheit/Leaflet.EdgeMarker">Leaflet.EdgeMarker</a>
		</td><td>
			Plugin to indicate the existence of Features outside of the current view.
		</td><td>
			<a href="https://github.com/ubergesundheit">Gerald Pape</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/gismartwaredev/leaflet.orientedMarker">Leaflet.orientedMarker</a>
		</td><td>
			Allows to manage orientation of markers dynamically.
		</td><td>
			<a href="https://github.com/gismartwaredev">Gismartwaredev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mapshakers/leaflet-icon-pulse">leaflet-icon-pulse</a>
		</td><td>
			Renders pulsing icon using CSS3. It can be used for location marker.
		</td><td>
			<a href="https://github.com/mapshakers">mapshakers</a>/
			<a href="https://github.com/filipzava">Filip Zavadil</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mapshakers/leaflet-mapkey-icon">leaflet-mapkey-icon</a>
		</td><td>
			Set of cartographic font icons based on <a href="http://www.mapkeyicons.com">mapkeyicons</a>.
		</td><td>
			<a href="https://github.com/mapshakers">mapshakers</a>/
			<a href="https://github.com/filipzava">Filip Zavadil</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/turban/Leaflet.Photo">Leaflet.Photo</a>
		</td><td>
			Plugin to show geotagged photos on a Leaflet map. <a href="http://turban.github.io/Leaflet.Photo/examples/picasa.html">Demo</a>.
		</td><td>
			<a href="https://github.com/turban">Bjørn Sandvik</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/elfalem/Leaflet.curve">Leaflet.curve</a>
		</td><td>
			A Leaflet plugin for drawing Bézier curves and other complex shapes. <a href="http://elfalem.github.io/Leaflet.curve/">Demo</a>.
		</td><td>
			<a href="https://github.com/elfalem">elfalem</a>
		</td>
	</tr>
		<tr>
		<td>
			<a href="https://github.com/lifeeka/leaflet.bezier">Leaflet.bezier</a>
		</td><td>
			Draws a Bézier line between two points with an animated flight object.
		</td><td>
			<a href="https://github.com/spmsupun">Supun Praneeth</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/MAD-GooZe/Leaflet.Arc">Leaflet.Arc</a>
		</td><td>
			This plugin adds L.Polyline.Arc function which wraps arc.js functionality for creation of Great Cirlce arcs.
		</td><td>
			<a href="https://github.com/MAD-GooZe">Alexey Gusev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/timwis/leaflet-choropleth">leaflet-choropleth</a>
		</td><td>
			Extends L.geoJson to add a choropleth visualization (color scale based on value). <a href="http://timwis.com/leaflet-choropleth/examples/basic">Demo</a>.
		</td><td>
			<a href="http://timwis.com">Tim Wisniewski</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/eJuke/Leaflet.Canvas-Markers">Leaflet.Canvas-Markers</a>
		</td><td>
			Displays markers on canvas instead of DOM.
		</td><td>
			<a href="https://github.com/eJuke">Evgeniy Voynov</a>
		</td>
	</tr>
        <tr>
                <td>
                        <a href="https://github.com/lethexa/leaflet-tracksymbol">leaflet-tracksymbol</a>
                </td><td>
                        This marker provides a tracksymbol with orientation, velocity-vector and configurable shape.
                </td><td>
                        <a href="https://github.com/lethexa">Tim Leerhoff</a>
                </td>
        </tr>
        <tr>
                <td>
                        <a href="https://github.com/PowerPan/leaflet-ais-tracksymbol">leaflet-ais-tracksymbol</a>
                </td><td>
                        AIS Extension for leaflet-tracksymbol It displays AIS Contacts on the Map.
                </td><td>
                        <a href="https://github.com/powerpan">Johannes Rudolph</a>
                </td>
        </tr>
        <tr>
                <td>
                        <a href="https://github.com/PowerPan/leaflet-ais-tracksymbol-search">leaflet-ais-tracksymbol-search</a>
                </td><td>
                        Adds a Seach Box for your Leaflet Map and Your [leaflet-ais-trackymbol](https://github.com/PowerPan/leaflet-ais-tracksymbol)
                </td><td>
                        <a href="https://github.com/powerpan">Johannes Rudolph</a>
                </td>
        </tr>
	<tr>
		<td>
			<a href="https://github.com/wwwouaiebe/leaflet.TravelNotes">leaflet.TravelNotes</a>
		</td>
		<td>
			Editable markers and routing engine for leaflet. The routing engine have plugins for Mapbox, GraphHopper and OSRM and can be used for car, bike or pedestrian route. <a href="https://wwwouaiebe.github.io/leaflet.TravelNotes/?lng=en">Demo</a>.
		</td>
		<td>
			<a href="https://github.com/wwwouaiebe">Christian Guyette</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/IvanSanchez/Leaflet.Marker.Stack">Leaflet.Marker.Stack</a>
		</td>
		<td>
			A pure Leaflet implementation of CartoDB's "<a href="http://blog.cartodb.com/stacking-chips-a-map-hack/">stacked chips</a>" symbolizer. <a href="http://ivansanchez.github.io/Leaflet.Marker.Stack/demos/color_ramps.html">Demo</a>.
		</td>
		<td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/cloudybay/leaflet-polygon-fillPattern">leaflet-polygon.fillPattern</a>
		</td>
		<td>
			Extend the Polygon Object to fill SVG Path element with an image pattern.<a href="http://lwsu.github.io/leaflet-polygon-fillPattern/example/">Demo</a>.
		</td>
		<td>
			<a href="https://github.com/cloudybay/">CloudyBay</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/bbecquet/Leaflet.PolylineOffset">Leaflet Polyline Offset</a>
		</td>
		<td>
			Adds to <code>L.Polyline</code> the ability to be shifted with a relative pixel offset, without modifying its actual <code>LatLng</code>s. The offset value can be either negative or positive, for left- or right-side offset, and remains constant across zoom levels (<a href="http://bbecquet.github.io/Leaflet.PolylineOffset/examples/example.html">basic demo</a>).
		</td>
		<td>
			<a href="https://github.com/bbecquet">Benjamin Becquet</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/w8r/leaflet-labeled-circle">leaflet-labeled-circle</a>
		</td>
		<td>
			Special type of SVG marker with a label inside and draggable around the anchor point (<a href="https://w8r.github.io/leaflet-labeled-circle/demo/">demo</a>).
		</td>
		<td>
			<a href="https://github.com/w8r/">Alexander Milevski</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/dagjomar/Leaflet.ParallaxMarker">Leaflet.ParallaxMarker</a>
		</td>
		<td>
			Add markers that moves with a parallax-effect relative to the map when panning (<a href="https://dagjomar.github.io/Leaflet.ParallaxMarker/">demos / examples</a>).
		</td>
		<td>
			<a href="https://github.com/dagjomar/">Dag Jomar Mersland</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/adoroszlai/leaflet-distance-markers">leaflet-distance-markers</a>
		</td>
		<td>
			Allows displaying markers along a route (L.Polyline) at equivalent distances (eg. one per mile) (<a href="http://adoroszlai.github.io/leaflet-distance-markers/">demo</a>).
		</td>
		<td>
			<a href="https://github.com/adoroszlai">Doroszlai, Attila</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mikhailshilkov/leaflet-corridor">leaflet-corridor</a>
		</td>
		<td>
			Renders a polyline with width fixed in meters, not in pixels; adjusts width depending on zoom level (<a href="http://mikhail.io/demos/leaflet-corridor/">demo</a>).
		</td>
		<td>
			<a href="https://github.com/mikhailshilkov">Mikhail Shilkov</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/yakitoritabetai/Leaflet.LabelTextCollision">Leaflet.LabelTextCollision</a>
		</td>
		<td>
			Displays labels on paths (polylines, polygons, circles) avoiding label collision. (<a href="https://yakitoritabetai.github.io/Leaflet.LabelTextCollision/">demo</a>).
		</td>
		<td>
			<a href="https://github.com/yakitoritabetai">Kenta Hakoishi</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ggolikov/Leaflet.Viewpoint">Leaflet.Viewpoint</a>
		</td>
		<td>
			Displays circleMarker with multiple directions.
			Useful to show photos taken from one point. (<a href="https://ggolikov.github.io/Leaflet.Viewpoint/example/">demo</a>).
		</td>
		<td>
			<a href="https://github.com/ggolikov">Grigory Golikov</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/react-map/leaflet.magicMarker">Leaflet.magicMarker</a>
		</td>
		<td>
			Adding magical animation effect to a marker while loading.(<a href="https://react-map.github.io/leaflet.magicMarker/">Demo</a>).
		</td>
		<td>
			<a href="https://github.com/react-map">Sylvenas</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/brandonxiang/leaflet.marker.highlight">Leaflet.Marker.Highlight</a>
		</td>
		<td>
			Adding highlight performance for L.marker.(<a href="https://brandonxiang.github.io/leaflet.marker.highlight/examples/">Demo</a>).
		</td>
		<td>
			<a href="https://github.com/brandonxiang">Brandon Xiang</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/nypl-spacetime/Leaflet.GeotagPhoto">Leaflet.GeotagPhoto</a>
		</td>
		<td>
			Plugin for photo geotagging, with two modes: camera and crosshair (<a href="http://spacetime.nypl.org/Leaflet.GeotagPhoto/examples/camera.html">Demo</a>).
		</td>
		<td>
			<a href="https://github.com/bertspaan">Bert Spaan</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://gitlab.com/IvanSanchez/Leaflet.GLMarkers">Leaflet.GLMarkers</a>
		</td><td>
			Display thousands of markers with custom WebGL shaders, optionally animated. (<a href='http://https://ivansanchez.gitlab.io/Leaflet.GLMarkers/demo/repl.html'>demo</a>)
		</td><td>
			<a href="https://gitlab.com/IvanSanchez">Iván Sánchez Ortega</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ggolikov/Leaflet.River">Leaflet.River</a>
		</td>
		<td>
			Draw lines with different width (like rivers) on a map.
			Useful when you want to show how rivers 'flow' on the map (<a href="https://ggolikov.github.io/Leaflet.River/">demo</a>).
		</td>
		<td>
			<a href="https://github.com/ggolikov">Grigory Golikov</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/sybri/Leaflet.SpeechBubble/">Leaflet.SpeechBubble</a>
		</td>
		<td>
			Popup a speech bubble with the arrow that follow points,layer, markers ...
			 (<a href="https://sybri.github.io/demo/Leaflet.SpeechBubble/demo.html">demo</a>).
		</td>
		<td>
			<a href="https://github.com/sybri">Sylvain BRISSY</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://wbkd.github.io/leaflet-swoopy/">Leaflet Swoopy</a>
		</td>
		<td>
			A plugin for creating customizable swoopy arrow annotations.
		</td>
		<td>
			<a href="https://webkid.io">webkid</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Oliv/leaflet-polycolor">leaflet-polycolor</a>
		</td>
		<td>
			Color each polyline segment. (<a href='https://oliv.github.io/leaflet-polycolor/'>demo</a>)
		</td>
		<td>
			<a href="https://github.com/Oliv">Olivier Gasc</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/JackZouShao/leaflet-marker-direction">leaflet-marker-direction</a>
		</td>
		<td>
			display the path and the direction of the marker. (<a href='https://jackzoushao.github.io/leaflet-marker-direction/examples/marker-direction.html'>demo</a>)
		</td>
		<td>
			<a href="https://github.com/JackZouShao">Jack Zou</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/bbecquet/Leaflet.RotatedMarker">Leaflet Rotated Marker</a>
		</td>
		<td>
			Enables rotation of marker icons in Leaflet. (<a href='http://bbecquet.github.io/Leaflet.RotatedMarker/example.html'>Demo</a>)
		</td>
		<td>
			<a href="https://github.com/bbecquet">Benjamin Becquet</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://wbkd.github.io/leaflet-truesize/">Leaflet Truesize</a>
		</td>
		<td>
			A plugin for creating projection aware draggable polygons and polylines.
		</td>
		<td>
			<a href="https://webkid.io">webkid</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://gitlab.com/IvanSanchez/Leaflet.RepeatedMarkers">Leaflet.RepeatedMarkers</a>
		</td>
		<td>
			Displays markers when wrapping around the globe, once every 360 degrees of longitude (<a href="https://ivansanchez.gitlab.io/Leaflet.RepeatedMarkers/demo.html">demo</a>).
		</td>
		<td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez</a>
		</td>
	</tr>
</table>



### Overlay animations

These plugins animate markers or some geometries. See also [geometries with time or elevation](#geometryinteraction-time).

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
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
			<a href="https://github.com/maximeh/leaflet.bouncemarker">Leaflet.BounceMarker</a>
		</td><td>
			Make a marker bounce when you add it to a map.
		</td><td>
			<a href="https://github.com/maximeh">Maxime Hadjinlian</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/hosuaby/Leaflet.SmoothMarkerBouncing">Leaflet.SmoothMarkerBouncing</a>
		</td><td>
			Smooth animation of marker bouncing for Leaflet.
		</td><td>
			<a href="https://github.com/hosuaby">Alexei KLENIN</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ewoken/Leaflet.MovingMarker">Leaflet.MovingMarker</a>
		</td><td>
			Allow to move markers along a polyline with custom durations.
		</td><td>
			<a href="https://github.com/ewoken">Ewoken</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/naturalatlas/leaflet-transitionedicon">Leaflet.TransitionedIcon</a>
		</td><td>
			Transition in/out markers with CSS3 transitions. It supports jitter
			for staggering markers into view to prevent visual overload. See the <a href="http://naturalatlas.github.io/leaflet-transitionedicon/">demo</a>.
		</td><td>
			<a href="https://github.com/brianreavis">Brian Reavis</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/IvanSanchez/Leaflet.Polyline.SnakeAnim">Leaflet.Polyline.SnakeAnim</a>
		</td><td>
			Animates (poly)lines into existence, as if they were being slowly drawn from start to end.
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez Ortega</a>,
			<a href="https://github.com/MazeMap">MazeMap</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/rubenspgcavalcante/leaflet-ant-path">Leaflet.AntPath</a>
		</td><td>
			Leaflet.AntPath put a flux animation (like ants walking) into a Polyline.
			(<a href='http://rubenspgcavalcante.github.io/leaflet-ant-path/'>demo</a>)
		</td><td>
			<a href="https://github.com/rubenspgcavalcante">Rubens Pinheiro</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://gitlab.com/IvanSanchez/Leaflet.Marker.SlideTo">Leaflet.Marker.SlideTo</a>
		</td><td>
			Smoothly move (slide) markers to a new location. (<a href='http://ivansanchez.gitlab.io/Leaflet.Marker.SlideTo/demo.html'>demo</a>)
		</td><td>
			<a href="https://gitlab.com/u/IvanSanchez">Iván Sánchez Ortega</a>,
			<a href="https://github.com/MazeMap">MazeMap</a>
		</td>
	</tr>
	</table>



### Clustering/Decluttering

When you are displaying a lot of data, these plugins will make your map look cleaner.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/Leaflet/Leaflet.markercluster">Leaflet.markercluster</a>
		</td><td>
			Beautiful, sophisticated, high performance marker clustering solution with smooth animations and lots of great features. <em>Recommended!</em>
		</td><td>
			<a href="https://github.com/danzel">Dave Leaver</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/MazeMap/Leaflet.LayerGroup.Collision">Leaflet.LayerGroup.Collision</a>
		</td><td>
			Provides collision detection for groups of markers. Unlike clustering, this takes into account the shape &amp; size of the markers.
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez Ortega</a>,
			<a href="https://github.com/MazeMap">MazeMap</a>
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
			<a href="https://github.com/SINTEF-9012/PruneCluster">PruneCluster</a>
		</td><td>
			Fast and realtime marker clustering library.
		</td><td>
			<a href="https://github.com/yellowiscool">Antoine Pultier</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/oliverroick/Leaflet.Deflate">Leaflet.Deflate</a>
		</td><td>
			Deflates lines and polygons to a marker when their screen size becomes too small in lower zoom levels.
		</td><td>
			<a href="https://github.com/oliverroick">Oliver Roick</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/andy-kay/Leaflet.GridCluster">Leaflet.GridCluster</a>
		</td><td>
			Create grid-based clusters in realtime.
		</td><td>
			<a href="https://github.com/andy-kay">Andreas Kiefer</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/spatialdev/q-cluster">q-cluster</a>
		</td><td>
			Quick point clustering library with D3 categorization.
		</td><td>
			<a href="https://github.com/hallahan">Nicholas Hallahan</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Eclipse1979/leaflet-conditionalLayer">Leaflet.ConditionalLayer</a>
		</td><td>
			A FeatureGroup that does not show any more than a certain amount of markers visible in the viewport. (<a href="http://eclipse1979.github.io/Leaflet.ConditionalLayer/example/leaflet-conditionalLayer2.html">Demo</a>)
		</td><td>
			<a href="https://github.com/Eclipse1979">EPP</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ghybs/Leaflet.FeatureGroup.SubGroup">Leaflet.FeatureGroup.SubGroup</a>
		</td><td>
			A simple plugin to create Feature Groups that add their child layers into a parent group. Typical usage is to switch them through L.Control.Layers to dynamically add/remove groups of markers from Leaflet.markercluster. <a href="http://ghybs.github.io/Leaflet.FeatureGroup.SubGroup/examples/subGroup-markercluster-controlLayers-realworld.388.html">Demo</a>.
		</td><td>
			<a href="https://github.com/ghybs">ghybs</a>
		</td>
	</tr>
</table>

### Heatmaps

These plugins create heatmaps and heatmap-like visualizations from vector data.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
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
			<a href="http://www.patrick-wied.at/static/heatmapjs/example-heatmap-leaflet.html">heatmap.js</a>
		</td><td>
			JavaScript Library for HTML5 canvas based heatmaps.

			Its Leaflet layer implementation supports large datasets because it is tile based and uses a quadtree index to store the data.
		</td><td>
			<a href="https://github.com/pa7">Patrick Wied</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/dpiccone/leaflet-div-heatmap">Leaflet divHeatmap</a>
		</td><td>
			Lightweight and versatile heatmap layer based on CSS3 and divIcons

		</td><td>
			<a href="https://github.com/dpiccone">Daniele Piccone</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://ursudio.com/webgl-heatmap-leaflet/">WebGL Heatmap</a>
		</td><td>
			High performance Javascript heatmap plugin using WebGL.

		</td><td>
			<a href="https://twitter.com/bozdoz">Benjamin J DeLong</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Leaflet/Leaflet.heat">Leaflet.heat</a>
		</td><td>
			A tiny, simple and fast Leaflet heatmap plugin. Uses <a href='https://github.com/mourner/simpleheat'>simpleheat</a> under the hood, additionally clustering points into a grid for performance. (<a href='https://leaflet.github.io/Leaflet.heat/demo'>Demo</a>)

		</td><td>
			<a href="https://github.com/mourner">Vladimir Agafonkin</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mejackreed/leaflet-solr-heatmap">Leaflet-Solr-Heatmap</a>
		</td><td>
			A Leaflet plugin for rendering heatmaps and clusters from <a href='https://lucene.apache.org/solr/guide/6_6/spatial-search.html#SpatialSearch-HeatmapFaceting'>Solr's Heatmap Faceting</a>. High performance for millions of points or polygons.
		</td><td>
			<a href="https://github.com/mejackreed">Jack Reed</a> /
			<a href="https://github.com/spacemansteve">Steve McDonald</a>
		</td>
	</tr>
</table>


### DataViz

Powerful multi-purpose libraries for data visualization.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/giscience/geogrid.js">geogrid.js</a>
		</td><td>
			Displays data aggregated by the ISEA3H discrete global grid system.  The data can, e.g., be delived by using <a href="https://github.com/giscience/measures-rest">Measures REST</a> (a framework to deliver data aggregated by the grid) or <a href="https://github.com/giscience/geogrid">geogrid</a> (a library for handling the grid in case that you want to aggregate data manually).
		</td><td>
			<a href="http://www.mocnik-science.net">F.-B. Mocnik,</a><br><a href="http://www.geog.uni-heidelberg.de/gis/index_en.html">GIScience Research Group,<br>Heidelberg University</a>
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
			<a href="http://humangeo.github.com/leaflet-dvf/">Leaflet Data Visualization Framework</a>
		</td><td>
			New markers, layers, and utility classes for easy thematic mapping and data visualization.
		</td><td>
			<a href="https://github.com/sfairgrieve">Scott Fairgrieve</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/teralytics/Leaflet.D3SvgOverlay">Leaflet.D3SvgOverlay</a>
		</td><td>
			SVG overlay class for using with <a href="http://d3js.org">D3</a> library. Supports zoom animation and scaling without need to redraw the layer.
		</td><td>
			<a href="https://github.com/xEviL">Kirill Zhuravlev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mapbox/mapbox-gl-leaflet">mapbox-gl-leaflet</a>
		</td><td>
			Binding from Mapbox GL JS to the Leaflet API
		</td><td>
			<a href="https://github.com/tmcw">Tom MacWright</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/wandergis/leaflet-echarts">leaflet-echarts</a>
		</td><td>
			A plugin for Leaflet to load <a href="https://github.com/ecomfe/echarts">echarts</a> map and make big data visualization easier.
		</td><td>
			<a href="https://github.com/wandergis">wandergis</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/atlefren/storymap">jquery-storymap</a>
		</td><td>
			A jQuery plugin to display several map locations as the user scrolls through paragraphs.
		</td><td>
			<a href="https://github.com/atlefren">Atle Frenvik Sveen</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/rstudio/leaflet">Leaflet for R</a>
		</td><td>
			Allows using Leaflet from within <a href="https://en.wikipedia.org/wiki/R_%28programming_language%29">R</a> programs, a programming language popular for statistical analysis and data mining.
		</td><td>
			<a href="https://github.com/rstudio/">RStudio team</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/react-map/leaflet.migrationLayer">leaflet.migrationLayer</a>
		</td><td>
			leafet.migrationLayer is used to show migration data such as population,flight,vehicle,traffic and so on.Data visualization on map.<a href="https://react-map.github.io/leaflet.migrationLayer">demo</a>
		</td><td>
			<a href="https://github.com/react-map">Sylvenas</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://ibesora.github.io/Leaflet.Quadtree/">Leaflet.Quadtree</a>
		</td><td>
			Leaflet.Quadtree is used to retrieve visible data inside given bounds
		</td><td>
			<a href="https://github.com/ibesora">ibesora</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jwasilgeo/Leaflet.Canvas-Flowmap-Layer">Leaflet.Canvas-Flowmap-Layer</a>
		</td><td>
			A LeafletJS custom map layer for mapping the flow of objects, ideas, people, etc. with Bezier curves rendered on the HTML canvas.
		</td><td>
			<a href="https://github.com/jwasilgeo">Jacob Wasilkowski</a>,
			<a href="https://github.com/sarahbellum">Sarah Bell</a>
    </td>
  </tr>
  <tr>
    <td>
			<a href="https://github.com/manubb/Leaflet.PixiOverlay">Leaflet.PixiOverlay</a>
		</td><td>
			A Leaflet overlay class for drawing and animating with <a href="http://www.pixijs.com/">Pixi.js</a>. (<a href="https://manubb.github.io/Leaflet.PixiOverlay/demo.html">demo</a>)
		</td><td>
			<a href="https://github.com/manubb">Manuel Baclet</a>
		</td>
	</tr>
	 <tr>
        <td>
    		<a href="https://github.com/danwild/leaflet-velocity">leaflet-velocity</a>
    	</td>
    	<td>
            Visualise velocity layers with leaflet.
            <a href="https://danwild.github.io/leaflet-velocity">Demo here.</a>
        </td>
        <td>
            <a href="https://github.com/danwild">Dan Wild</a>
        </td>
    </tr>
</table>



## Interaction with geometries/features

The following plugins enable users to interact with overlay data: edit geometries, select areas or features, interact with the time dimension, search features and display information about them.

* [Edit geometries](#edit-geometries)
* [Time & elevation](#time--elevation)
* [Search & popups](#search--popups)
* [Area/overlay selection](#areaoverlay-selection)

### Edit geometries

Allows users to create, draw, edit and/or delete points, lines and polygons.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/codeofsumit/leaflet.pm">Leaflet.PM</a>
		</td><td>
			Geometry Management for Leaflet 1.0 and higher. Draw, Edit, Cut, Drag and Snap Layers like Markers, Circles, Rectangles, Polylines, Polygons, LayerGroups, geoJSON, MultiPolygons, MultiLineStrings. Supports holes in polygons, snapping, canvas mode and more. (<a href="https://leafletpm.now.sh">Demo</a>)
		</td><td>
			<a href="https://github.com/codeofsumit">Sumit Kumar</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Wildhoney/Leaflet.FreeDraw">Leaflet.FreeDraw</a>
		</td><td>
			Zoopla inspired freehand polygon creation using Leaflet.js and D3.
		</td><td>
			<a href="https://github.com/Wildhoney">Wildhoney</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/scripter-co/leaflet-plotter">Leaflet.plotter</a>
		</td><td>
			leaflet-plotter allows you to create routes using a leaflet powered map. You can click on the mid-points to create a new, draggable point.
		</td><td>
			<a href="https://github.com/scripter-co">Nathan Mahdavi</a>
		</td>
	</tr>

	<tr>
		<td>
			<a href="https://github.com/tkrajina/leaflet-editable-polyline">Leaflet.Editable.Polyline</a>
		</td><td>Editable polylines: move existing points, add new points and split polylines.
		</td><td>
			<a href="https://github.com/tkrajina">Tomo Krajina</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Leaflet/Leaflet.draw">Leaflet.draw</a>
		</td><td>
			Enables drawing features like polylines, polygons, rectangles, circles and markers through a very nice user-friendly interface with icons and hints. <em>Recommended!</em>
		</td><td>
			<a href="https://github.com/jacobtoye">Jacob Toye</a>
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
			<a href="https://github.com/dwilhelm89/Leaflet.StyleEditor">Leaflet.StyleEditor</a>
		</td><td>
			Enables editing the styles of features (lines, polygons, etc) and markers with a GUI.
		</td><td>
			<a href="https://github.com/dwilhelm89">Dennis Wilhelm</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jdomingu/Leaflet.SimpleMarkers">Leaflet.SimpleMarkers</a>
		</td><td>
			A light-weight Leaflet plugin for adding and deleting markers.
		</td><td>
			<a href="https://github.com/jdomingu">Jared Dominguez</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/yohanboniface/Leaflet.Editable">Leaflet.Editable</a>
		</td><td>
			Lightweight fully customisable and controlable drawing/editing plugin.
		</td><td>
			<a href="http://yohanboniface.me/">Yohan Boniface</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/w8r/Leaflet.Path.Drag">Leaflet.Path.Drag</a>
		</td>
		<td>
			Drag handler and interaction for polygons and polylines (<a href="https://w8r.github.io/Leaflet.Path.Drag">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/w8r/">Alexander Milevski</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/w8r/Leaflet.Path.Transform">Leaflet.Path.Transform</a>
		</td>
		<td>
			Scale & rotate handler and interaction for polygons and polylines (<a href="https://w8r.github.io/Leaflet.Path.Transform">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/w8r/">Alexander Milevski</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.Snap">Leaflet.Snap</a>
		</td><td>
			Enables snapping of draggable markers to polylines and other layers.
		</td><td>
			<a href="https://github.com/leplatrem">Mathieu Leplatre</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/willfarrell/Leaflet.Clipper">Leaflet.Clipper</a>
		</td><td>
			Allows Union, Difference, Xor, and Intersection operations on two polygons. (<a href="https://willfarrell.github.io/Leaflet.Clipper">Demo</a>)
		</td><td>
			<a href="https://github.com/willfarrell">will Farrell</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/SINTEF-9012/Leaflet.MapPaint">Leaflet.MapPaint</a>
		</td>
		<td>
			Bitmap painting plugin designed for touch devices.
		</td><td>
			<a href="https://github.com/yellowiscool">Antoine Pultier</a>
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
	<tr>
		<td>
			<a href="https://github.com/Wildhoney/L.Pather">Leaflet.Pather</a>
		</td><td>
			L.Pather is a freehand polyline creator that simplifies the polyline for mutability. Requires D3 support.
		</td><td>
			<a href="https://github.com/Wildhoney">Wildhoney</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/manleyjster/Leaflet.Illustrate">Leaflet.Illustrate</a>
		</td><td>
			Extension for Leaflet.draw enabling users to <a href="http://manleyjster.github.io/Leaflet.Illustrate/examples/0.0.2/simple/">type annotations directly on maps</a>.
		</td><td>
			<a href="https://github.com/manleyjster">Justin Manley</a>
		</td>
	</tr>
        <tr>
		<td>
			<a href="https://github.com/kklimczak/Leaflet.Pin">Leaflet.Pin</a>
		</td><td>
			Enable attaching of markers to other layers during draw or edit features with Leaflet.Draw.
		</td><td>
			<a href="https://github.com/kklimczak">Konrad Klimczak</a>
		</td>
	</tr>
        <tr>
		<td>
			<a href="https://github.com/tcoupin/leaflet-paintpolygon">L.Control.PaintPolygon</a>
		</td><td>
			Draw yours polygons with a circle brush like Paint[brush]. Includes turf.js dependencies.
		</td><td>
			<a href="https://github.com/tcoupin">Thibault Coupin</a>
		</td>
	</tr>
</table>


### Time & elevation

Most data is two-dimensional (latitude and longitude), but some data has more dimensions (altitude and/or time). The following plugins help users navigate these extra dimensions.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/socib/Leaflet.TimeDimension">Leaflet.TimeDimension</a>
		</td>
		<td>
			Add time dimension capabilities on a Leaflet map. <a href="http://apps.socib.es/Leaflet.TimeDimension/examples/index.html">Demos</a>
		</td>
		<td>
			<a href="http://www.socib.eu">ICTS SOCIB</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/dwilhelm89/LeafletSlider">Leaflet Time-Slider</a>
		</td><td>
			The Leaflet Time-Slider enables you to dynamically add and remove Markers on a map by using a JQuery UI slider
		</td><td>
			<a href="https://github.com/dwilhelm89">Dennis Wilhelm</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/hallahan/LeafletPlayback">LeafletPlayback</a>
		</td><td>
			Play back time-stamped GPS Tracks synchronized to a clock.
		</td><td>
			<a href="http://theoutpost.io">Nicholas Hallahan</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/skeate/Leaflet.timeline">Leaflet.timeline</a>
		</td><td>
			Display arbitrary GeoJSON on a map with a timeline slider and play button.
		</td><td>
			<a href="https://github.com/skeate">Jonathan Skeate</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/MrMufflon/Leaflet.Elevation">Leaflet.Elevation</a>
		</td><td>
			A Leaflet plugin to view interactive height profiles of GeoJSON lines using <a href="http://d3js.org/">d3</a>.
		</td><td>
			<a href="https://github.com/MrMufflon">Felix Bache</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/iosphere/Leaflet.hotline">Leaflet.hotline</a>
		</td><td>
			A Leaflet plugin for drawing gradients along polylines.
		</td><td>
			<a href="https://github.com/iosphere">iosphere</a>
		</td>
	</tr>
</table>




### Search & popups

Plugins that search for overlays and enhance how to display information about them.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/naomap/leaflet-fusesearch">leaflet-fusesearch</a>
		</td><td>
			A control that provides a panel to search features in a GeoJSON layer using the lightweight fuzzy search Fuse.js
		</td><td>
			<a href="http://www.naomap.fr">Antoine Riche</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/stefanocudini/leaflet-search">Leaflet Search</a>
		</td><td>
			A control for search Markers/Features location by custom property in LayerGroup/GeoJSON. Support AJAX/JSONP, Autocompletion and 3rd party service
		</td><td>
			<a href="http://labs.easyblog.it">Stefano Cudini</a>
		</td>
	</tr>
	<tr>
        	<td>
            		<a href="https://github.com/8to5Developer/leaflet-custom-searchbox">leaflet-custom-searchbox</a>
        	</td>
		<td>
            		A google map style search box which includes a side panel slider control.
        	</td>
		<td>
		        <a href="https://github.com/8to5Developer/">A.D</a>
			</td>
          </tr>
	<tr>
		<td>
			<a href="http://erictheise.github.com/rrose">Leaflet.Rrose</a>
		</td><td>
			A Leaflet Plugin for Edge Cases.  For use when you want popups on <em>mouseover</em>, not <em>click</em>, and
			you need popup tips to reorient as you get close to the edges of your map.
		</td><td>
			<a href="http://www.linkedin.com/in/erictheise">Eric Theise</a>
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
			<a href="https://github.com/yohanboniface/Leaflet.RevealOSM">Leaflet.RevealOSM</a>
		</td><td>
			Very simple but extendable Leaflet plugin to display OSM POIs data on map click.
		</td><td>
			<a href="http://yohanboniface.me">Yohan Boniface</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/perliedman/leaflet-underneath">Leaflet Underneath</a>
		</td><td>
			Find interesting features near a location using Mapbox Vector Tiles data, to add
			interactive functionality to a tile layer with speed and limited bandwidth.
		</td><td>
			<a href="http://github.com/perliedman">Per Liedman</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/utahemre/Leaflet.GeoJSONAutocomplete">Leaflet.GeoJSONAutocomplete</a>
		</td><td>
			Leaflet Autocomplete For Remote Searching with GeoJSON Services.
		</td><td>
			<a href="https://github.com/utahemre">Yunus Emre Özkaya</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/maydemirx/leaflet-tag-filter-button">L.tagFilterButton</a>
		</td><td>
			LeafLet marker filtering by tags
		</td><td>
			<a href="https://github.com/maydemirx">Mehmet Aydemir</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Twista/leaflet-google-places-autocomplete">Leaflet-gplaces-autocomplete</a>
		</td><td>
			Add google places search into map
		</td><td>
			<a href="https://github.com/Twista">Michal Haták</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/yafred/leaflet-responsive-popup">leaflet-responsive-popup</a>
		</td><td>
			Removes the need to move the map to be able to see the content of the popup.
		</td><td>
			<a href="https://github.com/yafred">YaFred</a>
		</td>
	</tr>
</table>



### Area/overlay selection

These plugins help users select either overlays or areas in the map.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/heyman/leaflet-areaselect/">Leaflet.AreaSelect</a>
		</td><td>
			A fixed positioned, resizable rectangle for selecting an area on the map.
		</td><td>
			<a href="http://heyman.info">Jonatan Heyman</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/kajic/leaflet-locationfilter/">leaflet-locationfilter</a>
		</td><td>
			A draggable/resizable rectangle for selecting an area on the map.
		</td><td>
			<a href="https://github.com/kajic">Robert Kajic</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/w8r/L.Control.LineStringSelect">L.Control.LineStringSelect</a>
		</td>
		<td>
			Fast LineString(polyline) partial selection tool: select a stretch between two points in a complex path. <a href="https://w8r.github.io/L.Control.LineStringSelect">Demo</a>
		</td>
		<td>
			<a href="https://github.com/w8r">Alexander Milevski</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/openplans/Leaflet.FeatureSelect">Leaflet.FeatureSelect</a>
		</td><td>Use a configurable centerpoint marker to select any geometry type from a GeoJSON layer.
		</td><td>
			<a href="https://github.com/atogle">Aaron Ogle</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/stefanocudini/leaflet-geojson-selector">Leaflet GeoJSON Selector</a>
		</td>
		<td>
			Leaflet Control for selection from GeoJSON feature in a interactive list and map(<a href="http://labs.easyblog.it/maps/leaflet-geojson-selector/">Demo</a>).
		</td>
		<td>
			<a href="http://labs.easyblog.it/stefano-cudini/">Stefano Cudini</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/IvanSanchez/Leaflet.CheapLayerAt">Leaflet.CheapLayerAt</a>
		</td>
		<td>
			Allows querying which layer is under a screen coordinate (<a href="http://ivansanchez.github.io/Leaflet.CheapLayerAt/demo.html">Demo</a>).
		</td>
		<td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez Ortega</a>,
			<a href="https://github.com/MazeMap">MazeMap</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/sandropibia/Leaflet.SelectAreaFeature/">Leaflet.SelectAreaFeature</a>
		</td><td>
			Selecting feature layers on a map by drawing an area.
		</td><td>
			<a href="http://pezzo.org">Sandro Pibia</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mkong0216/leaflet-shades/"> Leaflet-Shades </a>
		</td>
		<td>
			A draggable and resizable rectangle for selecting an area on a map and creating a gray overlay in unselected areas (<a href="https://mkong0216.github.io/leaflet-shades/examples">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/mkong0216"> Mandy Kong </a>
		</td>
	</tr>
  <tr>
		<td>
			<a href="https://github.com/zakjan/leaflet-lasso">leaflet-lasso</a>
		</td>
		<td>
			True lasso selection plugin
		</td>
		<td>
			<a href="https://github.com/zakjan">Jan Zak</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/olanaso/Leaflet-Select-Polygons">Leaflet-Select-Polygons</a>
		</td>
		<td>
			Leaflet-Select-Polygons allows the selection of several polygons and also adjusts the base map view (<a href="https://olanaso.github.io/Leaflet-Select-Polygons/">demo</a>)
		</td>
		<td>
			<a href="https://github.com/olanaso">Erick S Escalante Olano</a>
		</td>
	</tr>
</table>



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

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/aebadirad/Leaflet.AutoLayers">Leaflet.AutoLayers</a>
		</td><td>
			Automatically pull layers from multiple mapservers and organize/search them with user controlled overlay zindex management.
		</td><td>
			<a href="https://github.com/aebadirad">Alex Ebadirad</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/vogdb/SelectLayersControl">Leaflet.SelectLayers</a>
		</td><td>
			a Leaflet plugin which adds new control to switch between different layers on the map. New control replaces L.Control.Layers radio button panel with select tag.
		</td><td>
			<a href="https://github.com/vogdb">vogdb</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/davicustodio/Leaflet.StyledLayerControl">Leaflet.StyledLayerControl</a>
		</td><td>
			A Leaflet plugin that implements the management and control of layers by organization into categories or groups.
		</td><td>
			<a href="https://github.com/davicustodio">Davi Custodio</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ismyrnow/Leaflet.groupedlayercontrol">Leaflet.GroupedLayerControl</a>
		</td><td>
			Leaflet layer control with support for grouping overlays together.
		</td><td>
			<a href="https://github.com/ismyrnow">Ishmael Smyrnow</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://elesdoar.github.io/leaflet-control-orderlayers/">Leaflet Control Order Layers</a>
		</td><td>
			Adds the ability to change overlay order in the layers control.
		</td><td>
			<a href="https://github.com/elesdoar/">Michael Salgado</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/robbiet480/leaflet-categorized-layers">Leaflet Categorized Layers</a>
		</td><td>
			Leaflet Control Layers extended for groups of categorized layers
		</td><td>
			<a href="http://robbie.io/">Robbie Trencheny</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/stefanocudini/leaflet-panel-layers">Leaflet Panel Layers</a>
		</td><td>
			Leaflet Control Layers extended for group of layers and icons legend
		</td><td>
			<a href="http://labs.easyblog.it">Stefano Cudini</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/chriscalip/L.UniformControl">Leaflet.UniformControl</a>
		</td><td>
			Leaflet layer control with stylable checkboxes and radio buttons.
		</td><td>
			<a href="https://github.com/chriscalip">Chris Calip</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ScanEx/Leaflet-IconLayers">Leaflet-IconLayers</a>
		</td><td>
			Leaflet control that displays base layers as small icons (<a href="http://scanex.github.io/Leaflet-IconLayers/examples">demo</a>).
		</td><td>
			<a href="https://github.com/zverev">Alexander Zverev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/bambrikii/leaflet-layer-tree-plugin">Leafet.LayerTreePlugin</a>
		</td><td>
			Leaflet control allows to switch layers on and off, display them in a tree-like way (<a href="http://rawgit.com/bambrikii/leaflet-layer-tree-plugin/master/examples/basic-example.htm">demo</a>).
		</td><td>
			<a href="https://github.com/bambrikii">Alexander Arakelyan</a>
		</td>
	</tr>
		<tr>
		<td>
			<a href="https://github.com/consbio/Leaflet.Basemaps">Leaflet.Basemaps</a>
		</td><td>
			A basemap chooser with a preview image from the tile stack.
			<a href="http://consbio.github.io/Leaflet.Basemaps/">Example</a>
		</td><td>
			<a href="https://github.com/brendan-ward">Brendan Ward</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jjimenezshaw/Leaflet.Control.Layers.Tree">Leaflet.Control.Layers.Tree</a>
		</td><td>
			L.Control.Layers extension that supports a Tree structure, both for base and overlay layers. Simple and highly configurable. See <a href="https://jjimenezshaw.github.io/Leaflet.Control.Layers.Tree/examples/">demos</a>
		</td><td>
			<a href="https://github.com/jjimenezshaw/">Javier Jimenez Shaw</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/vogdb/Leaflet.ActiveLayers">Leaflet.ActiveLayers</a>
		</td><td>
			Adds new L.Control.ActiveLayers with functionality to get currently active layers on the map.
		</td><td>
			<a href="https://github.com/vogdb">vogdb</a>
		</td>
	</tr>
</table>


### Interactive pan/zoom

Change the way the user can interactively move around the map.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
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
			<a href="https://github.com/gregallensworth/L.Control.BoxZoom">Leaflet.BoxZoom</a>
		</td><td>
			A visible, clickable control to perform a box zoom.
		</td><td>
			<a href="https://github.com/gregallensworth/L.Control.BoxZoom">Greg Allensworth</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/elrobis/L.Control.ZoomBar">L.Control.ZoomBar</a>
		</td><td>
			An extended version of Leaflet's native Zoom control with Home and Zoom-to-Area buttons. <a href="https://elrobis.github.io/L.Control.ZoomBar/">Demo</a>
		</td><td>
			<a href="http://cartometric.com/blog/">Elijah Robison</a>
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
			<a href="https://github.com/flaviocarmo/Leaflet.zoominfo/">Leaflet.zoominfo</a>
		</td><td>
			A zoom control which displays the current zoom level.
		</td><td>
			<a href="https://github.com/flaviocarmo">Flávio Carmo</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/slara/Leaflet.BorderPan">Leaflet.BorderPan</a>
		</td><td>
			A Leaflet plugin to pan by clicking on map borders.
		</td><td>
			<a href="https://github.com/slara">Sebastián Lara</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/SINTEF-9012/Leaflet.GameController">Leaflet GameController</a>
		</td><td>
			Interaction handler providing support for gamepads.
		</td><td>
			<a href="https://github.com/yellowiscool">Antoine Pultier</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/aratcliffe/Leaflet.twofingerzoom">Leaflet.twofingerZoom</a>
		</td><td>
			 Interaction handler for touch devices enabling zooming out with a two finger tap.
		</td><td>
			<a href="https://github.com/aratcliffe/">Adam Ratcliffe</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/consbio/Leaflet.ZoomBox">Leaflet.ZoomBox</a>
		</td>
		<td>
			A lightweight zoom box control: draw a box around the area you want to zoom to. <a href="https://consbio.github.io/Leaflet.ZoomBox">Demo</a>
		</td>
		<td>
			<a href="https://github.com/brendan-ward">Brendan Ward</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Zverik/Leaflet.LimitZoom">Leaflet LimitZoom</a>
		</td><td>
			Plugins to limit available zoom levels to a given list, either by
			restricting zooming or by interpolating tiles.
		</td><td>
			<a href="https://github.com/zverik">Ilya Zverev</a>
		</td>
	</tr>
  <tr>
		<td>
			<a href="https://github.com/GhostGroup/Leaflet.DoubleRightClickZoom">Leaflet.DoubleRightClickZoom</a>
		</td><td>
			 Interaction handler enabling zooming out with double right click.
		</td><td>
			<a href="https://github.com/mikeotoole/">Mike O'Toole</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/unbam/Leaflet.ZoomLabel">Leaflet.ZoomLabel</a>
		</td>
		<td>
			A simple zoom label control.
		</td>
		<td>
			<a href="https://github.com/unbam">Masashi Takeshita</a>
		</td>
	</tr>
</table>



### Bookmarked pan/zoom

Change the way the user is moved around the map, by jumping to predefined/stored places.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/pwldp/leaflet.viewcenter">Leaflet.viewcenter</a>
		</td><td>
			A simple control that adds a button to change view and zoom to predefinied values in options.
		</td><td>
			<a href="https://github.com/pwldp/">Dariusz Pawlak</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/alanshaw/leaflet-zoom-min/">leaflet-zoom-min</a>
		</td><td>
			Adds a button to the zoom control that allows you to zoom to the map minimum zoom level in a single click.
		</td><td>
			<a href="https://github.com/alanshaw/">Alan Shaw</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/davidchouse/Leaflet.NavBar">Leaflet Navigation Toolbar</a>
		</td><td>
			Leaflet control for simple back, forward and home navigation.
		</td><td>
			<a href="https://github.com/davidchouse">David C</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mithron/leaflet.locationlist">Leaflet Locationlist</a>
		</td><td>
			A control to jump between predefined locations and zooms.
		</td><td>
			<a href="https://github.com/mithron">Ivan Ignatyev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/nguyenning/Leaflet.defaultextent">Leaflet.defaultextent</a>
		</td>
		<td>
			A control that returns to the original start extent of the map.  Similar to the <a href="https://developers.arcgis.com/javascript/jssamples/widget_home.html">HomeButton</a> widget.
		</td>
		<td>
			<a href="https://github.com/nguyenning">Alex Nguyen</a>
		</td>
	</tr>
		<tr>
		<td>
			<a href="https://github.com/w8r/Leaflet.Bookmarks">Leaflet.Bookmarks</a>
		</td>
		<td>
			Control for adding and navigating between user-created bookmarks on the map.
		</td>
		<td>
			<a href="https://github.com/w8r/">Alexander Milevski</a>
		</td>
	</tr>
	<tr>
        <td>
			<a href="https://github.com/florpor/Leaflet.ShowAll">Leaflet.ShowAll</a>
		</td><td>
			A control that can show a predefined extent while saving the current one so it can be jumped back to.
		</td><td>
			<a href="https://github.com/florpor">Mor Yariv</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/torfsen/leaflet.zoomhome">Leaflet.zoomhome</a>
		</td>
		<td>
			Zoom control with a home button for resetting the view (<a href="http://torfsen.github.io/leaflet.zoomhome/">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/torfsen">Florian Brucker</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/cscott530/leaflet-history">Leaflet-History</a>
		</td>
		<td>
			Track history of map movements and zoom locations similar to a browser.
		</td>
		<td>
			<a href="https://github.com/cscott530">Chris Scott</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.RestoreView">Leaflet.RestoreView</a>
		</td><td>
			Stores and restores map view using localStorage.
		</td><td>
			<a href="https://github.com/leplatrem">Mathieu Leplatre</a>
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
</table>



### Fullscreen controls

Allows display of the map in full-screen mode.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/mapbox/Leaflet.fullscreen">Leaflet.fullscreen</a>
		</td><td>
			A fullscreen button control by mapbox
		</td><td>
			<a href="https://github.com/mapbox">mapbox</a>
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
			<a href="http://elidupuis.github.com/leaflet.zoomfs">leaflet.zoomfs</a>
		</td><td>
			A fullscreen button control.
		</td><td>
			<a href="https://github.com/elidupuis">Eli Dupuis</a>
		</td>
	</tr>
</table>



### Minimaps & synced maps

Display two maps at once. One of them might be a different size and zoom level, usable as a minimap to aid with navigation.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/turban/Leaflet.Sync">Leaflet.Sync</a>
		</td><td>
			Synchronized view of two maps.
		</td><td>
			<a href="https://github.com/turban">Bjørn Sandvik</a>
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
			<a href="https://github.com/bbecquet/Leaflet.MagnifyingGlass">Leaflet.MagnifyingGlass</a>
		</td><td>
			Allows you to display a small portion of the map at another zoom level, either at a fixed position or linked to the mouse movement, for a magnifying glass effect.
		</td><td>
			<a href="https://github.com/bbecquet/">Benjamin Becquet</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://jieter.github.io/Leaflet.layerscontrol-minimap/">Leaflet.layerscontrol-minimap</a>
		</td><td>
			Extends the default Leaflet layers control with synced minimaps.
		</td><td>
			<a href="https://github.com/jieter">Jieter</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/chriswhong/leaflet-globeminimap/">Leaflet.GlobeMiniMap</a>
		</td><td>
			Simple minimap control that places a 3D Globe in the corner of your map, centered on the same location as the main map (<a href='http://chriswhong.github.io/leaflet-globeminimap/example/'>demo</a>).
		</td><td>
			<a href="https://github.com/chriswhong">Chris Whong</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jieter/leaflet-clonelayer">leaflet-clonelayer</a>
		</td><td>
			Clone Leaflet layers to allow reuse across different maps in the same runtime.
		</td><td>
			<a href="https://github.com/jieter">Jieter</a>
		</td>
	</tr>
</table>






### Measurement

Allow the user to measure distances or areas.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/ppete2/Leaflet.PolylineMeasure">Leaflet.PolylineMeasure</a>
		</td><td>
			 Measure great-circle distances of simple lines as well as of complex polylines. (<a href="https://ppete2.github.io/Leaflet.PolylineMeasure/demo1.html">Demo 1</a>), (<a href="https://ppete2.github.io/Leaflet.PolylineMeasure/demo2.html">Demo 2</a>), (<a href="https://ppete2.github.io/Leaflet.PolylineMeasure/demo3.html">Demo 3</a>)
		</td><td>
			<a href="https://github.com/ppete2">PPete</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.MeasureControl">Leaflet.MeasureControl</a>
		</td><td>
			A simple tool to measure distances on maps (*relies on Leaflet.Draw*).
		</td><td>
			<a href="https://github.com/makinacorpus/">Makina Corpus</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/zvaraondrej/Leaflet.MeasureAreaControl">Leaflet.MeasureAreaControl</a>
		</td><td>
			 Control for measuring element's area.
		</td><td>
			<a href="https://github.com/zvaraondrej">Ondrej Zvara</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ljagis/leaflet-measure">leaflet-measure</a>
		</td>
		<td>
			Coordinate, linear, and area measure control for Leaflet maps
		</td>
		<td>
			<a href="https://github.com/ljagis">LJA GIS</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/nerik/leaflet-graphicscale">leaflet-graphicscale</a>
		</td>
		<td>
			Animated graphic scale control (<a href='http://nerik.github.io/leaflet-graphicscale/demo/'>demo</a>).
		</td>
		<td>
			<a href="https://github.com/nerik">Erik Escoffier</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/MarcChasse/leaflet.ScaleFactor">Leaflet.ScaleFactor</a>
		</td><td>
			Display a Scale Factor (e.g. 1:50,000) for Leaflet maps (<a href="https://marcchasse.github.io/leaflet.ScaleFactor/">Demo</a>)
		</td><td>
			<a href="https://github.com/MarcChasse">Marc Chasse</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/PowerPan/leaflet.nauticscale">Leaflet.nauticscale</a>
		</td><td>
			Display a Nauticscale on Leaflet maps
		</td><td>
			<a href="https://github.com/PowerPan">Johannes Rudolph</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/ProminentEdge/leaflet-measure-path">Leaflet Measure Path</a>
		</td><td>
			Show measurements on paths; polylines, polygons and circles currently supported (<a href="http://prominentedge.com/leaflet-measure-path/">demo</a>)
		</td><td>
			<a href="https://github.com/perliedman">Per Liedman</a> / <a href="http://prominentedge.com/">Prominent Edge</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/NLTGit/Leaflet.LinearMeasurement">Leaflet.LinearMeasurement</a>
		</td><td>
			Leaflet Linear Measurement plugin that creates polylines with incremental measures along the path. (<a href="https://nltgit.github.io/Leaflet.LinearMeasurement/">demo</a>)
		</td><td>
			<a href="http://www.newlighttechnologies.com/">New Light Technologies</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/gokertanrisever/leaflet-ruler">leaflet-ruler</a>
		</td><td>
			A simple leaflet plugin to measure true bearing and distance between clicked points. (<a href="https://gokertanrisever.github.io/leaflet-ruler/">Demo</a>)
		</td><td>
			<a href="https://github.com/gokertanrisever">Goker Tanrisever</a>
		</td>
	</tr>
</table>








### Mouse coordinates

Show the geographical coordinates under the mouse cursor in different ways.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/ardhi/Leaflet.MousePosition">Leaflet.MousePosition</a>
		</td><td>
			A simple MousePosition control that displays geographic coordinates of the mouse pointer, as it is moved about the map
		</td><td>
			<a href="https://github.com/ardhi">Ardhi Lukianto</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/MrMufflon/Leaflet.Coordinates">Leaflet.Coordinates</a>
		</td><td>
			A simple Leaflet plugin viewing the mouse LatLng-coordinates. Also views a marker with coordinate popup on userinput.
		</td><td>
			<a href="https://github.com/MrMufflon">Felix Bache</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/zimmicz/Leaflet-Coordinates-Control">Leaflet Coordinates Control</a>
		</td><td>
			Captures mouseclick and displays its coordinates with easy way to copy them.
		</td><td>
			<a href="https://github.com/zimmicz">Michal Zimmermann</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mahmoodvcs/Leaflet.NACCoordinates">Leaflet.NACCoordinates</a>
		</td>
		<td>
			Displays NAC coordinate of the mouse pointer on mouse move (<a href="http://mahmoodvcs.github.io/Leaflet.NACCoordinates/">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/mahmoodvcs">Mahmood Dehghan</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/PowerPan/leaflet.mouseCoordinate">Leaflet.mouseCoordinates</a>
		</td>
		<td>
			Displays the Mouse Coordinate in a Box.
			Multiple Formats Are Possible
			<ul>
				<li>GPS</li>
				<li>UTM</li>
				<li>UTMREF / MGRS</li>
				<li>QTH</li>
			</ul>
		</td>
		<td>
			<a href="https://github.com/PowerPan">Johannes Rudolph</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/stefanocudini/leaflet-locationpicker">Leaflet Location Picker</a>
		</td>
		<td>
			Simple location picker with mini Leaflet map (<a href="http://labs.easyblog.it/maps/leaflet-locationpicker/">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/stefanocudini/">Stefano Cudini</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/xguaita/Leaflet.MapCenterCoord">Leaflet.MapCenterCoord</a>
		</td>
		<td>
			A Leaflet control to display the coordinates of the map center, especially useful on touch/mobile devices. (<a href="http://xguaita.github.io/Leaflet.MapCenterCoord/">Doc & demos</a>)
		</td>
		<td>
			<a href="https://github.com/xguaita">Xisco Guaita</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/matlads/Leaflet.Mapcodes">Leaflet.Mapcodes</a>
		</td>
		<td>
			Displays the <a href="http://www.mapcode.com">Mapcode</a> of the mouse pointer on mouse move (<a href="http://matlads.github.io/Leaflet.Mapcodes/">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/matlads">Martin Atukunda</a>
		</td>
	</tr>
</table>









### Events

These plugins extend Leaflet event handling.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/elmarquis/Leaflet.GestureHandling/">Leaflet.GestureHandling</a>
		</td><td>
		Brings the basic functionality of Google Maps Gesture Handling into Leaflet. Prevents users from getting trapped on the map when scrolling a long page.
			<a href="https://elmarquis.github.io/Leaflet.GestureHandling/examples/"> Demo</a>
		</td><td>
			<a href="https://github.com/elmarquis">Andy Marquis</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/CliffCloud/Leaflet.Sleep">L.Sleep</a>
		</td><td>
			Avoid unwanted scroll capturing.
			<a href="https://cliffcloud.github.io/Leaflet.Sleep"> Demo</a>
		</td><td>
			<a href="https://github.com/atstp">atstp</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.OverIntent">Leaflet.OverIntent</a>
		</td><td>
			Adds a new event ``mouseintent``, that differs from ``mouseover`` since it reflects user
			intentions to aim a particular layer.
		</td><td>
			<a href="https://github.com/makinacorpus/">Mathieu Leplatre</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.AlmostOver">Leaflet.AlmostOver</a>
		</td><td>
			Trigger mouse events when cursor is "almost" over a layer.
		</td><td>
			<a href="https://github.com/makinacorpus/">Mathieu Leplatre</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Mappy/Leaflet-active-area">Leaflet-active-area</a>
		</td><td>
			This plugin allows you to use a smaller portion of the map as an active area.
			All positioning methods (setView, fitBounds, setZoom) will be applied on this portion instead of the all map.
		</td><td>
			<a href="https://github.com/Mappy">Mappy</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/MazeMap/Leaflet.ControlledBounds">Leaflet.ControlledBounds</a>
		</td><td>
			Inspired by Leaflet-active-area, automatically detects the largest area of the map not covered by any map controls and applies setView, fitBounds, setZoom, getBounds to that area.
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez Ortega</a>,
			<a href="https://github.com/MazeMap">MazeMap</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Outdooractive/leaflet-singleclick_0.7">singleclick</a>
		</td>
		<td>
			Extend <code>L.Map</code> to fire a <code>singleclick</code> event (<a href="http://outdooractive.github.io/leaflet-singleclick_0.7/">demo</a>). Compatible with Leaflet 0.7.x only.
		</td>
		<td>
			<a href="http://glat.info">Guillaume Lathoud</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/MazeMap/Leaflet.singleclick">singleclick</a>
		</td>
		<td>
			Extend <code>L.Evented</code> to fire a <code>singleclick</code> event (<a href="https://mazemap.github.io/Leaflet.singleclick/">demo</a>). Compatible with Leaflet 1.0.0-beta1 and greater only.
		</td><td>
			<a href="https://github.com/IvanSanchez">Iván Sánchez Ortega</a>,
			<a href="https://github.com/MazeMap">MazeMap</a>
		</td>
	</tr>

	<tr>
	        <td>
	            <a href="https://github.com/MazeMap/Leaflet.VisualClick">Leaflet.VisualClick</a>
	        </td>
	        <td>
	            Adds visual feedback when user clicks/taps the map (<a href="https://github.com/MazeMap/Leaflet.VisualClick/">demo</a>).
	            Useful when further action is delayed by server requests, or implementation of Leaflet.singleclick.
	            Or just because it looks cool :)
	            Only tested with Leaflet 1.0.0-beta1.
	        </td><td>
	            <a href="https://github.com/dagjomar">Dag Jomar Mersland</a>,
	            <a href="https://github.com/IvanSanchez">Iván Sánchez Ortega</a>,
	            <a href="https://github.com/MazeMap">MazeMap</a>
	        </td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/perliedman/leaflet-touch-helper">Leaflet Touch Helper</a>
		</td><td>
			Makes it easy to touch vector overlays with thick fingers on a small display by adding a transparent, larger touch surface
		</td><td>
			<a href="https://github.com/perliedman">Per Liedman</a> / <a href="http://prominentedge.com/">Prominent Edge</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/geoloep/Leaflet.ClickTolerance">Leaflet.ClickTolerance</a>
		</td><td>
			This plugin allows you to increase the click tolerance of canvas powered layers, making it possible to increase the clickable area of vector layers beyond their visible extent. Useful when your features are difficult to click otherwise.
		</td><td>
			<a href="https://github.com/geoloep">Geoloep</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/idawave/Leaflet.DraggableEnhancer">L.DraggableEnhancer</a>
		</td><td>
			Modify the default L.Draggable handler (responsible for map panning, ...) to make it work properly if one of the map container's parents has predefined handlers like "event.stopPropagation()' attached to a "mousemove" event for example.
		</td><td>
			<a href="https://github.com/idawave">Vincent Dechandon</a>
		</td>
	</tr>
</table>










### User interface

Buttons, sliders, toolbars, sidebars, and panels.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/yigityuce/Leaflet.Control.Custom">Leaflet.Control.Custom</a>
		</td><td>
			Fully customizable Leaflet control panel with HTML element.
			<a href="https://yigityuce.github.io/Leaflet.Control.Custom/examples/index.html"> Demo</a>
		</td><td>
			<a href="https://github.com/yigityuce">Yiğit Yüce</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/CliffCloud/Leaflet.EasyButton">L.EasyButton</a>
		</td><td>
			In one line, add a Font Awesome control button with attached click events.
			<a href="https://cliffcloud.github.io/Leaflet.EasyButton"> Demo</a>
		</td><td>
			<a href="https://github.com/atstp">atstp</a>
		</td>
	</tr>
		<tr>
		<td>
			<a href="https://github.com/aratcliffe/Leaflet.contextmenu">Leaflet.contextmenu</a>
		</td><td>
			A context menu for Leaflet.
		</td><td>
			<a href="https://github.com/aratcliffe/">Adam Ratcliffe</a>
		</td>
	</tr>
		<tr>
		<td>
			<a href="https://github.com/ahalota/Leaflet.CountrySelect/">Leaflet.CountrySelect</a>
		</td><td>
			Control with menu of all countries, and an event listener that returns
			the selected country as a GeoJSON feature (<a href="http://ahalota.github.io/Leaflet.CountrySelect/demo.html">demo</a>)
		</td><td>
			<a href="https://github.com/ahalota/">Anika Halota</a>
		</td>

	</tr>
	<tr>
		<td>
			<a href="https://github.com/turbo87/leaflet-sidebar/">leaflet-sidebar</a>
		</td><td>
			A responsive sidebar plugin.
		</td><td>
			<a href="https://github.com/turbo87/">Tobias Bieniek</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/turbo87/sidebar-v2/">sidebar-v2</a>
		</td><td>
			Another responsive sidebar plugin. This time with tabs!
		</td><td>
			<a href="https://github.com/turbo87/">Tobias Bieniek</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/tinuzz/leaflet-messagebox">Leaflet.Messagebox</a>
		</td>
		<td>
			Display a temporary text message on a map (<a href="https://www.grendelman.net/leaflet/">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/tinuzz/">Martijn Grendelman</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/yohanboniface/Leaflet.TileLegend">Leaflet.TileLegend</a>
		</td><td>
			Create illustrated and interactive legends for your background layers.
		</td><td>
			<a href="http://yohanboniface.me">Yohan Boniface</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Leaflet/Leaflet.toolbar">Leaflet.toolbar</a>
		</td>
		<td>
			Flexible, extensible toolbars for Leaflet maps. View an example <a href="https://leaflet.github.io/Leaflet.toolbar/examples/popup.html">here</a>.
		</td>
		<td>
			<a href="https://github.com/manleyjster">Justin Manley</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/gregallensworth/L.Control.Credits">L.Credits</a>
		</td>
		<td>
			A simple, attractive, interactive control to put your logo and link in the corner of your map.
		</td>
		<td>
			<a href="https://github.com/gregallensworth/">Greg Allensworth</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.Spin">Leaflet.Spin</a>
		</td><td>
			Shows a nice spinner on the map using <a href="http://fgnass.github.com/spin.js/">Spin.js</a>,
			for asynchronous data load, like with <a href="https://github.com/calvinmetcalf/leaflet-ajax">Leaflet Ajax</a>.
		</td><td>
			<a href="https://github.com/leplatrem">Mathieu Leplatre</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/oskosk/Leaflet.Weather">Leaflet Weather</a>
		</td>
		<td>
			A Leaflet plugin for adding a weather widget to the map using OpenWeatherMap API (<a href="http://oskosk.github.io/Leaflet.Weather/">Demo</a>).
		</td>
		<td>
			<a href="https://github.com/oskosk">Osk</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/dalbrx/Leaflet.ResizableControl">Leaflet ResizableControl</a>
		</td>
		<td>
			A Leaflet plugin to add a resizable and scrollable control to the map (<a href="http://dalbrx.github.io/Leaflet.ResizableControl/">Demo</a>).
		</td>
		<td>
			<a href="https://github.com/dalbrx">David Albrecht</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Eclipse1979/leaflet-slider">Leaflet.Slider</a>
		</td>
		<td>
			Adds a <code>&lt;input type="range"&gt;</code> slider that calls a function every time its input is changed (<a href="https://github.com/Eclipse1979/leaflet-slider">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/Eclipse1979">EPP</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mapshakers/leaflet-control-window">leaflet-control-window</a>
		</td><td>
		Creates modal/modeless, draggable, responsive, customisable window in your map.
		</td><td>
			<a href="https://github.com/mapshakers">mapshakers</a>/
			<a href="https://github.com/filipzava">Filip Zavadil</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/utahemre/Leaflet.CoordinatedImagePreview">Leaflet.CoordinatedImagePreview</a>
		</td><td>
			Displays coordinated images in map bounds.
		</td><td>
			<a href="https://github.com/utahemre">Yunus Emre Özkaya</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/unbam/Leaflet.SlideMenu">Leaflet.SlideMenu</a>
		</td>
		<td>
			A simple slide menu for Leaflet.
		</td>
		<td>
			<a href="https://github.com/unbam">Masashi Takeshita</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/NBTSolutions/Leaflet.Dialog">Leaflet.Dialog</a>
		</td>
		<td>
			A simple resizable, movable, customizable dialog box. (<a href="http://nbtsolutions.github.io/Leaflet.Dialog/">Demo</a>)
		</td>
		<td>
			<a href="https://github.com/NBTSolutions">NBT Solutions</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/MAD-GooZe/Leaflet.BootstrapZoom">Leaflet.BootstrapZoom</a>
		</td>
		<td>
			Overrides default zoom control buttons with Twitter Bootstrap styled ones
		</td>
		<td>
			<a href="https://github.com/MAD-GooZe">Alexey Gusev</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/route360/Leaflet.CondensedAttribution">Leaflet.CondensedAttribution</a>
		</td>
		<td>
			An attribution plugin that makes long attributes visible on hover
		</td>
		<td>
			<a href="http://www.motionintelligence.net/">Motion Intelligence GmbH</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/consbio/Leaflet.HtmlLegend">Leaflet.HtmlLegend</a>
		</td>
		<td>
			A simple Leaflet plugin for creating legends using HTML elements. <a href="https://consbio.github.io/Leaflet.HtmlLegend/">Demo</a>.
		</td>
		<td>
			<a href="https://github.com/ka7eh">Kaveh Karimi</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/publiclab/leaflet-blurred-location/">leaflet-blurred-image</a>
		</td>
		<td>
			A Leaflet-based interface for selecting a "blurred" or low-resolution location, to preserve privacy. <a href="https://publiclab.github.io/leaflet-blurred-location/examples/">Demo</a>.
		</td>
		<td>
			<a href="https://github.com/publiclab">Public Lab</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jjimenezshaw/Leaflet.Control.Resizer">Leaflet.Control.Resizer</a>
		</td><td>
			Control to resize your map on the right or bottom side. See <a href="https://jjimenezshaw.github.io/Leaflet.Control.Resizer/examples/basic.html">demo</a>
		</td><td>
			<a href="https://github.com/jjimenezshaw/">Javier Jimenez Shaw</a>
		</td>
	</tr>
</table>



### Print/export

Print or export your map.

<!--
- Saving a Leaflet Map to a PNG Example using Javascript and PHP https://github.com/tegansnyder/Leaflet-Save-Map-to-PNG
- Get a PNG from a Leaflet map and export it in PDF https://github.com/chrissom/leaflet-pdf
-->

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/aratcliffe/Leaflet.print">Leaflet.print</a>
		</td><td>
			Implements the Mapfish print protocol allowing a Leaflet map to be printed using either the Mapfish or GeoServer print module.
		</td><td>
			<a href="https://github.com/aratcliffe">Adam Ratcliffe</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mapbox/leaflet-image">Leaflet-image</a>
		</td><td>
			Export images out of Leaflet maps without a server component, by using Canvas and CORS.
		</td><td>
			<a href="https://github.com/tmcw">Tom MacWright</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/rowanwins/leaflet-easyPrint">Leaflet-easyPrint</a>
		</td><td>
			A simple plugin which adds an icon to print your Leaflet map.
		</td><td>
			<a href="https://github.com/rowanwins">Rowan Winsemius</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Igor-Vladyka/leaflet.browser.print">leaflet.browser.print</a>
		</td><td>
			Allows users to print full page map directly from the browser.
		</td><td>
			<a href="https://github.com/Igor-Vladyka">Igor Vladyka</a>
		</td>
	</tr>
</table>



### Geolocation

Plugins that extend Leaflet's geolocation capabilities.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/CliffCloud/Leaflet.LocationShare">L.LocationShare</a>
		</td><td>
			Allow users to send and receive a marker with a message.
			<a href="https://cliffcloud.github.io/Leaflet.LocationShare"> Demo</a>
		</td><td>
			<a href="https://github.com/atstp">atstp</a>
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
			<a href="https://github.com/stefanocudini/leaflet-compass">Leaflet Control Compass</a>
		</td><td>
			A leaflet control plugin to build a simple rotating compass
		</td><td>
			<a href="http://labs.easyblog.it/">Stefano Cudini</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/M165437/Leaflet.AccuratePosition">Leaflet.AccuratePosition</a>
		</td><td>
			Leaflet.AccuratePosition aims to provide a desired device location accuracy.
		</td><td>
			<a href="https://github.com/M165437">Michael Schmidt-Voigt</a>
		</td>
	</tr>
</table>





## Miscellaneous



### Geoprocessing

The following plugins perform several sorts of geoprocessing (mathematical and topological operations on points, lines and polygons).

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
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
			<a href="https://github.com/springmeyer/arc.js">arc.js</a>
		</td><td>
			A JS library for drawing great circle routes that can be used with Leaflet.
		</td><td>
			<a href="https://github.com/springmeyer">Dane Springmeyer</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/tmcw/leaflet-pip">Leaflet-pip</a>
		</td><td>
			Simple point in polygon calculation using <a href="https://github.com/substack/point-in-polygon">point-in-polygon</a>.
		</td><td>
			<a href="https://github.com/tmcw">Tom MacWright</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.GeometryUtil">Leaflet.GeometryUtil</a>
		</td><td>
			A collection of utilities for Leaflet geometries (linear referencing, etc.)
		</td><td>
			<a href="https://github.com/bbecquet">Benjamin Becquet</a>, <a href="https://github.com/leplatrem">Mathieu Leplatre</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/w8r/GreinerHormann">Greiner-Hormann</a>
		</td>
		<td>
			Greiner-Hormann algorithm for polygon clipping and binary operations, adapted for use with Leaflet.
		</td>
		<td>
			<a href="https://github.com/w8r">Alexander Milevski</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/henrythasler/Leaflet.Geodesic">Leaflet.Geodesic</a>
		</td><td>
			Draw geodesic (poly)lines. A geodesic line is the shortest path between two given positions on the earth surface. and You can also calculate the exact distance between two given points on the map.
		</td><td>
			<a href="https://github.com/henrythasler">Henry Thasler</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/skeate/Leaflet.buffer">Leaflet.buffer</a>
		</td><td>
			Enables buffering of shapes drawn with Leaflet.draw.
		</td><td>
			<a href="https://github.com/skeate">Jonathan Skeate</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/makinacorpus/Leaflet.LayerIndex">Leaflet.LayerIndex</a>
		</td><td>
			An efficient spatial index for features and layers, using <a href="https://github.com/imbcmdth/RTree">RTree.js</a>.
		</td><td>
			<a href="https://github.com/leplatrem">Mathieu Leplatre</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mapzen/leaflet-spatial-prefix-tree">leaflet-spatial-prefix-tree</a>
		</td><td>
			Leaflet plugin for visualizing spatial prefix trees, quadtree and geohash. See <a href="http://mapzen.github.io/leaflet-spatial-prefix-tree/">demo</a>
		</td><td>
			<a href="http://mapzen.com/">Mapzen</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/jjimenezshaw/Leaflet.UTM">Leaflet.UTM</a>
		</td><td>
			A simple way to convert L.LatLng into UTM (WGS84) and vice versa. UTM string format easily configurable. It does not depend on any other plugin or 3rd party. See <a href="https://jjimenezshaw.github.io/Leaflet.UTM/examples/input.html">demo</a>
		</td><td>
			<a href="https://github.com/jjimenezshaw/">Javier Jimenez Shaw</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/briannaAndCo/Leaflet.Antimeridian">Leaflet.Antimeridian</a>
		</td><td>
			A plugin to allow polygons and polylines to naturally draw across the Antimeridian (or the Internation Date Line) instead of always wrapping across the Greenwich meridian. (<a href="https://briannaandco.github.io/Leaflet.Antimeridian/">Demo</a>)
		</td><td>
			<a href="https://github.com/briannaAndCo">Brianna Landon</a>
		</td>
	</tr>
</table>



### Routing

The following plugins use external services to calculate driving or walking routes.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="http://www.liedman.net/leaflet-routing-machine/">Leaflet Routing Machine</a>
		</td><td>
			Control for route search with via points, displaying itinerary and alternative routes. Uses
			<a href="http://project-osrm.org/">OSRM</a> by default, but also supports
			<a href="https://graphhopper.com/">GraphHopper</a>,
			<a href="https://www.mapbox.com/developers/api/directions/">Mapbox Directions API</a> and more.
		</td><td>
			<a href="https://github.com/perliedman">Per Liedman</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Turistforeningen/leaflet-routing">Leaflet.Routing</a>
		</td><td>
			Leaflet controller and interface for routing paths between waypoints using any user provided routing service.
		</td><td>
			<a href="https://github.com/turistforeningen">Norwegian Trekking Association</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/route360/r360-js">Route360°</a>
		</td><td>
			Route360° visualizes the area which is reachable from a set of starting points in a given time and gives detailed routing information (walk, bike, car and <b>public transportation</b>) to targets.
		</td><td>
			<a href="http://www.motionintelligence.net/">Motion Intelligence GmbH</a>
		</td>
	</tr>

	<tr>
		<td>
			<a href="https://github.com/StephanGeorg/leaflet-routeboxer">Leaflet RouteBoxer</a>
		</td><td>
			This is a Leaflet implementation of the RouteBoxer Class from Google. The Leaflet 		RouteBoxer class generates a set of L.LatLngBounds objects that are guaranteed to cover every point within a specified distance of a path.
		</td><td>
			<a href="http://www.nearest.place/">Nearest!</a>
		</td>
	</tr>

	<tr>
    		<td>
    			<a href="https://github.com/BKGiser/Leaflet.Routing.Amap">Leaflet.Routing.Amap</a>
    		</td><td>
		Control for route search using <a href="http://www.amap.com/">AMap(高德地图)</a> as a backend. Supports the Chinese BD09 and GCJ02 coordinate systems, colourful lines, and turn-by-turn popups.
    		</td><td>
    			<a href="https://github.com/BKGiser">Jack Good</a>
    		</td>
    	</tr>
    <tr>
    	<td>
    		<a href="https://github.com/skedgo/leaflet.tripgo.routing">Leaflet TripGo routing</a>
    	</td>
    	<td>
    		The <b>TripGo</b> mobility platform let’s you create apps providing seamless and personalised door-to-door trips using any public, private or commercial mode of transport.
    		TripGo leaflet's plugin motivation is to provide an easy way to include it's functionality in an external platform.
    	</td>
    	<td>
    		<a href="http://skedgo.com/">SkedGo</a>
    	</td>
    </tr>
	<tr>
		<td>
			<a href="https://github.com/wwwouaiebe/leaflet.TravelNotes">leaflet.TravelNotes</a>
		</td>
		<td>
			Editable markers and routing engine for leaflet. The routing engine have plugins for Mapbox, GraphHopper and OSRM and can be used for car, bike or pedestrian route. <a href="https://wwwouaiebe.github.io/leaflet.TravelNotes/?lng=en">Demo</a>.
		</td>
		<td>
			<a href="https://github.com/wwwouaiebe">Christian Guyette</a>
		</td>
	</tr>
</table>




### Geocoding

External services that transform an address or the name of a place into latitude and longitude (or vice versa).

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/smeijer/L.GeoSearch">Leaflet GeoSearch</a>
		</td><td>
			Small geocoding plugin that brings address searching/lookup (aka geosearching) to Leaflet.<br />
			Comes with support for Google, OpenStreetMap Nominatim, Bing, Esri and Nokia. Easily extensible.
		</td><td>
			<a href="https://github.com/smeijer">Stephan Meijer</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/k4r573n/leaflet-control-osm-geocoder">Leaflet Control OSM Geocoder</a>
		</td><td>
			A simple geocoder that uses OpenstreetMap Nominatim to locate places by address.
		</td><td>
			<a href="https://github.com/k4r573n">Karsten Hinz</a>
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
			<a href="https://github.com/perliedman/leaflet-control-geocoder">Leaflet Control Geocoder</a>
		</td><td>
			A clean and extensible control for both geocoding and reverse geocoding. Builtin support for
			Nominatim, Bing, MapQuest, Mapbox, What3Words, Google and Photon. Easy to extend to other providers.
		</td><td>
			<a href="https://github.com/perliedman">Per Liedman</a>
		</td>
	</tr>
    	<tr>
		<td>
			<a href="https://github.com/jakubdostal/leaflet-geoip">Leaflet GeoIP Locator</a>
		</td><td>
			A simple plugin that allows finding the approximate location of IP addresses and map centering on said location.
		</td><td>
			<a href="https://github.com/jakubdostal">Jakub Dostal</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Esri/esri-leaflet-geocoder">Esri Leaflet Geocoder</a>
		</td><td>
			A geocoding control with suggestions powered by the ArcGIS Online geocoder.
		</td><td>
			<a href="https://github.com/patrickarlt/">Patrick Arlt</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/lokku/leaflet-opencage-search">Leaflet.OpenCage.Search</a>
		</td>
		<td>
			A search plugin plugin that uses <a href="http://geocoder.opencagedata.com/">OpenCage Data's geocoding API</a>.
		</td>
		<td>
			The <a href="https://github.com/opencagedata">OpenCage</a> team
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/consbio/Leaflet.Geonames">Leaflet.Geonames</a>
		</td>
		<td>
			A lightweight geocoding control powered by <a href="http://www.geonames.org/">GeoNames</a>.  <a href="https://consbio.github.io/Leaflet.Geonames">Demo</a>
		</td>
		<td>
			<a href="https://github.com/brendan-ward">Brendan Ward</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mapzen/leaflet-geocoder">Mapzen Search Leaflet Geocoder</a>
		</td>
		<td>
			A geocoding control using <a href="https://mapzen.com/projects/search">Mapzen Search</a> or any hosted service powered by the <a href="https://github.com/pelias/api">Pelias Geocoder API</a>.  <a href="https://mapzen.github.io/leaflet-geocoder/">Demo</a>
		</td>
		<td>
			<a href="https://github.com/louh">Lou Huang</a>
		</td>
	</tr>
</table>



### Plugin collections

Sets of plugins that span several categories.

Plugin developers: please keep future plugins in individual repositories.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/shramov/leaflet-plugins">Plugins by Pavel Shramov</a>
		</td><td>
			A set of plugins for: GPX, KML, TOPOJSON layers; Bing tile layer; Yandex layers (implemented with their APIs), and permalink control.
		</td><td>
			<a href="https://github.com/shramov">Pavel Shramov</a>, <a href="https://github.com/brunob">Bruno B</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Estimap/Spectrum4Leaflet">Spectrum4Leaflet</a>
		</td><td>
			Tools for using Spectrum Spatial Server services with leaflet. This plugin supports: map service, tile service, feature service. It has layers, legend and feature controls.
		</td><td>
			<a href="https://github.com/SVoyt">SVoyt</a>, <a href="https://github.com/Estimap">ESTI MAP</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://mapbbcode.org/leaflet.html">MapBBCode-related leaflet plugins</a>
		</td><td>
			Seven plugins for various features, independent of the MapBBCode library.
			From circular and popup icons to buttons, layer switcher, better search and attribution.
		</td><td>
			<a href="https://github.com/zverik">Ilya Zverev</a>
		</td>
	</tr>
</table>



## Integration

### Frameworks & build systems

Ease your development integrating Leaflet into a development framework or automating some of the javascript/CSS work for complex applications.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/ghybs/leaflet-defaulticon-compatibility">leaflet-defaulticon-compatibility</a>
		</td><td>
			Retrieve all Leaflet Default Icon options from CSS, in particular all icon images URL's, to improve compatibility with bundlers and frameworks that modify URL's in CSS. In particular for webpack (with style-, css-, file- and url-loader's), Rails Asset Pipeline and Django pipeline. Should solve all use cases linked to <a href="https://github.com/Leaflet/Leaflet/issues/4968">issue Leaflet/Leaflet #4968</a>. <a href="https://ghybs.github.io/leaflet-defaulticon-compatibility/webpack-demo.html">Demo with webpack</a> (and <a href="https://ghybs.github.io/leaflet-defaulticon-compatibility/webpack-demo.html?demo=no-plugin">without this plugin</a>).
		</td><td>
			<a href="https://github.com/ghybs">ghybs</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/moklick/generator-leaflet">Leaflet Yeoman Generator</a>
		</td><td>
			Yeoman generator that scaffolds out a basic Leaflet map application.
		</td><td>
			<a href="https://github.com/moklick">Moritz Klack</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/PaulLeCam/react-leaflet">react-leaflet</a>
		</td><td>
			<a href="https://facebook.github.io/react/">React</a> components for Leaflet maps.
		</td><td>
			<a href="http://paullecam.github.io/">Paul Le Cam</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/leaflet-extras/leaflet.css">Leaflet.CSS</a>
		</td><td>
			Add the main Leaflet CSS files (or any css) from within JavaScript, be gone conditional comments.
		</td><td>
			<a href="https://github.com/calvinmetcalf">Calvin Metcalf</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/Norkart/Leaflet-LayerConfig">Leaflet LayerConfig</a>
		</td><td>
			Provide a json file or service response with a configuration of layers and markers to automatically set up a Leaflet client.
		</td><td>
			<a href="https://github.com/alexanno">Alexander Nossum</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/yohanboniface/Leaflet.i18n">Leaflet.i18n</a>
		</td><td>
			Internationalization for Leaflet plugins.
		</td><td>
			<a href="http://yohanboniface.me">Yohan Boniface</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/dagjomar/Leaflet.ZoomCSS">Leaflet ZoomLevel CSS Class</a>
		</td><td>
			Add zoom level css class to map element for easy style updates based on zoom levels
		</td><td>
			<a href="https://github.com/dagjomar">Dag Jomar Mersland</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/IjzerenHein/famous-map">famous-map</a>
		</td><td>
			Integrate Leaflet in applications made with the <a href='http://famo.us'>famo.us</a> web framework.
		</td><td>
			<a href="http://www.gloey.nl">Hein Rutjes</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/tombatossals/angular-leaflet-directive">Angular Leaflet directive</a>
		</td><td>
			Integrate Leaflet in applications made with the <a href='http://angularjs.org/'>AngularJS</a> web framework.
		</td><td>
			<a href="https://github.com/tombatossals">David Rubert</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/CleverMaps/tiny-leaflet-directive">Tiny Leaflet Directive</a>
		</td><td>
			Tiny LeafletJS map directive for your AngularJS apps.
		</td><td>
			<a href="https://github.com/mattesCZ">Martin Tesař</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/grantHarris/leaflet-popup-angular">Leaflet Popup Angular</a>
		</td><td>
			Use AngularJS in your Leaflet popups. Extends the built-in L.popup.
		</td><td>
			<a href="https://github.com/grantHarris">Grant Harris</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/grantHarris/leaflet-control-angular">Leaflet Control Angular</a>
		</td><td>
			Insert and use Angularized HTML code in your Leaflet map as a Leaflet control.
		</td><td>
			<a href="https://github.com/grantHarris">Grant Harris</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/yagajs/leaflet-ng2">YAGA leaflet-ng2</a>
		</td><td>
			Granular integration into Angular2/4. <a href="https://leaflet-ng2.yagajs.org/latest/examples"> demo </a>.
		</td><td>
			<a href="https://github.com/yagajs">YAGA Development Team</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/leaflet-extras/leaflet-map">&lt;leaflet-map&gt;</a>
		</td><td>
			Integrate Leaflet in applications made with the <a href='https://www.polymer-project.org/'>Polymer &gt;= 1.0</a> web component framework.
		</td><td>
			<a href="https://github.com/nhnb">Hendrik Brummermann</a>,
			<a href="https://github.com/prtksxna">Prateek Saxena</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/prtksxna/leaflet-map-component">Leaflet map component</a>
		</td><td>
			Integrate Leaflet in applications made with the <a href='https://www.polymer-project.org/0.5/'>Polymer 0.5</a> web framework.
		</td><td>
			<a href="https://github.com/prtksxna">Prateek Saxena</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://bitbucket.org/terrayazilim/leaflet.jsf">Leaflet.jsf</a>
		</td><td>
			Comprehensive Java Server Faces(JSF) Component/Wrapper for Leaflet.
		</td><td>
			<a href="http://terrayazilim.com.tr">Terra SI LLC.</a>
			<a href="https://bitbucket.org/terrayazilim">M.Çağrı Tepebaşılı</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/themrleon/JSF2Leaf">JSF2Leaf</a>
		</td><td>
			A JavaServer Faces wrapper for Leaflet.
		</td><td>
			<a href="https://github.com/themrleon">Leonardo Ciocari</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://www.ember-leaflet.com/">ember-leaflet</a>
		</td><td>
			Easy and declarative mapping for <a href="http://emberjs.com/">Ember.js</a> using Leaflet.
		</td><td>
			<a href="https://github.com/miguelcobain">Miguel Andrade</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/bevanhunt/meteor-leaflet">meteor-leaflet</a>
		</td><td>
			Provides a Meteor package to quickly build real-time cross-platform map apps.
		</td><td>
			<a href="https://github.com/bevanhunt">Bevan Hunt</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/gregallensworth/L.Control.BootstrapModal">L.Control.BootstrapModal</a>
		</td><td>
			Trigger a Bootstrap modal using an on-map control.
		</td><td>
			<a href="https://github.com/gregallensworth">Greg Allensworth</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/gregallensworth/L.Control.jQueryDialog">L.Control.jQueryDialog</a>
		</td><td>
			Trigger a jQuery UI dialog/modal using an on-map control.
		</td><td>
			<a href="https://github.com/gregallensworth">Greg Allensworth</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/mstahv/v-leaflet">V-Leaflet</a>
		</td><td>
			Use Leaflet as a component for the <a href='https://vaadin.com/home'>Vaadin</a> Java/HTML framework.
		</td><td>
			<a href="https://github.com/mstahv">Matti Tahvonen</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/gwidgets/gwty-leaflet">gwty-leaflet</a>
		</td><td>
			A Java/GWT JsInterop wrapper for Leaflet. It allows using Leaflet in Java the same way as from a javascript script.
		</td><td>
			<a href="https://github.com/zak905">Zakaria Amine</a>
		</td>
	</tr>
        <tr>
		<td>
			<a href="https://github.com/gherardovarando/leaflet-map-builder">Leaflet Map Builder</a>
		</td><td>
			It populates a leaflet map from a configuration object, can also creates zoom, layers, attribution and           draw controls. <a href="https://gherardovarando.github.io/leaflet-map-builder/"> demo </a>.
		</td><td>
			<a href="https://github.com/gherardovarando">Gherardo Varando</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://github.com/KoRiGaN/Vue2Leaflet">Vue2Leaflet</a>
		</td><td>
			<a href="https://github.com/KoRiGaN/Vue2Leaflet">Vue2Leaflet</a> is a JavaScript library for the <a href="https://vuejs.org/">Vue.js</a> framework that wraps Leaflet, making it easy to create reactive maps.
		</td><td>
			<a href="https://github.com/KoRiGaN">Mickaël KoRiGaN</a>
		</td>
	</tr>
</table>


### 3<sup>rd</sup> party integration

The following plugins integrate Leaflet into third party services or websites.

<table class="plugins"><tr><th>Plugin</th><th>Description</th><th>Maintainer</th></tr>
	<tr>
		<td>
			<a href="https://github.com/yohanboniface/Leaflet.EditInOSM">Leaflet.EditInOSM</a>
		</td><td>
			Add a control with links to open the current map view on main OSM editors.
		</td><td>
			<a href="http://yohanboniface.me">Yohan Boniface</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://www.mapsmarker.com/">Maps Marker Pro</a>
		</td><td>
			A WordPress plugin that enables users to pin, organize and share their favorite places and tracks through their WordPress powered site.
		</td><td>
			<a href="http://www.harm.co.at/">Robert Harm</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://wordpress.org/plugins/leaflet-map/">WordPress Leaflet Map</a>
		</td><td>
			Interactive and flexible shortcode to create multiple maps in posts and pages,
			and to add multiple markers on those maps.
		</td><td>
			<a href="https://twitter.com/bozdoz">Benjamin J DeLong</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://maptiks.com">Maptiks</a>
		</td>
		<td>
			Analytics platform for web maps. Track map activities, layer load times, marker clicks, and more!
		</td>
		<td>
			<a href="http://www.sparkgeo.com/">Sparkgeo</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="http://drupal.org/project/leaflet">Leaflet for Drupal</a>
		</td><td>
			A Drupal (7.x and 8.x) module to integrate Leaflet maps in your Drupal site. Contains a field formatter to show a map for fields containing geospatial data, Views integration to plot data on a map, and a lightweight and easy to use API. Currently used by over 10.000 sites.
		</td><td>
			<a href="http://marzeelabs.org">Marzee Labs</a>, and more maintainers listed at <a href="http://drupal.org/project/leaflet">drupal.org</a>
		</td>
	</tr>
	<tr>
		<td>
			<a href="https://lapizistik.github.io/leaflet-easymap/">Leaflet Easymap</a>
		</td><td>
			Include a map in your HTML page without one line of programming. A data-driven Javascript module.
		</td><td>
			<a href="https://github.com/Lapizistik">Klaus Stein</a>
		</td>
	</tr>
</table>



## Develop your own

Leaflet keeps it simple. If you can think of a feature that is not required by all Leaflet users, and you can write the JavaScript code in a reusable way, you've got yourself a Leaflet plugin already.

There are no hard requirements on how to create your own plugin, but all developers are encouraged to read the recommendations in the [plugin guide](https://github.com/Leaflet/Leaflet/blob/master/PLUGIN-GUIDE.md).

Once your plugin is ready, you can submit it to this list: just send a pull request with the addition to [/docs/plugins.md](https://github.com/Leaflet/Leaflet/blob/master/docs/plugins.md) to our GitHub repository.

---
layout: default
---

Leaflet is a modern open-source JavaScript library for mobile-friendly interactive maps. It is developed by [Vladimir Agafonkin][] of [CloudMade][] with a&nbsp;team of dedicated [contributors][]. Weighing just about <abbr title="That's 97 KB minified and 166 KB in the source form, with 8 KB of CSS (1.8 KB gzipped) and 11 KB of images">25 KB of gzipped JS code</abbr>, it still has all the [features][] most developers ever need for online maps, while providing a smooth, pleasant user experience.

It is built from the ground up to work efficiently on both desktop and mobile platforms like iOS and Android, taking advantage of HTML5 and CSS3 on modern browsers. The focus is on usability, performance, small size, [A-grade][] browser support and [a simple API][] with <abbr title="Simplicity and reasonable defaults so that the API doesn't get in your way, while not losing flexibility">convention over configuration</abbr>. The OOP-based [code of the library][] is designed to be modular, extensible and very easy to understand.


### Basic Usage Example

<div id="map"></div>

Here we create a map with <abbr title="Here we use the beautiful CloudMade tiles which require an API key (get one for free!), but Leaflet doesn't force you to &mdash; use whatever works for you, it's open source!">tiles of our choice</abbr>, add a marker and bind a popup with some text to it:


<!--- manually colored to support raw HTML inside the code -->
<pre><code class="javascript"><span class="comment">// create a map in the "map" div, set the view to a given place and zoom</span>
<span class="keyword">var</span> map = L.map(<span class="string">'map'</span>).setView([<span class="number">51.505</span>, -<span class="number">0.09</span>], <span class="number">13</span>);

<span class="comment">// add a CloudMade tile layer with style #997</span>
L.tileLayer(<span class="string">'http://{s}.tile.cloudmade.com/<a href="http://cloudmade.com/register">[API-key]</a>/997/256/{z}/{x}/{y}.png'</span>, {
    attribution: <span class="string">'Map data <span class="text-cut" data-cut="[&hellip;]">&amp;copy; &lt;a href="http://openstreetmap.org"&gt;OpenStreetMap&lt;/a&gt; contributors, &lt;a href="http://creativecommons.org/licenses/by-sa/2.0/"&gt;CC-BY-SA&lt;/a&gt;, Imagery © &lt;a href="http://cloudmade.com"&gt;CloudMade&lt;/a&gt;</span>'</span>
}).addTo(map);

<span class="comment">// add a marker in the given location, attach some popup content to it and open the popup</span>
L.marker([<span class="number">51.5</span>, -<span class="number">0.09</span>]).addTo(map)
    .bindPopup(<span class="string">'A pretty CSS3 popup. &lt;br&gt; Easily customizable.'</span>).openPopup();</code></pre>


Learn more with the [quick start guide](examples/quick-start.html), check out [other tutorials](examples.html), or head straight to the [API documentation](reference.html).


### Contributing to Leaflet

The project is [hosted on GitHub][], waiting for your contributions --- just send your pull requests to [@mourner][] (Vladimir Agafonkin, Leaflet author and maintainer). Let’s make the best library for maps that can possibly exist!

You can also help the project a lot by reporting bugs on the [GitHub issues page][], showing your support for  your favorite feature suggestions on [Leaflet UserVoice page][], tweeting to [@LeafletJS][] or joining the [Leaflet mailing list][].

  [Vladimir Agafonkin]: http://agafonkin.com/en
  [CloudMade]: http://cloudmade.com
  [contributors]: https://github.com/CloudMade/Leaflet/graphs/contributors
  [features]: features.html
  [A-grade]: http://developer.yahoo.com/yui/articles/gbs/
  [a simple API]: reference.html "Leaflet API reference"
  [code of the library]: https://github.com/CloudMade/Leaflet
    "Leaflet GitHub repository"
  [hosted on GitHub]: http://github.com/CloudMade/Leaflet
  [@mourner]: http://github.com/mourner
  [GitHub issues page]: http://github.com/CloudMade/Leaflet/issues
  [Leaflet UserVoice page]: http://leaflet.uservoice.com
  [@LeafletJS]: http://twitter.com/LeafletJS
  [Leaflet mailing list]: https://groups.google.com/group/leaflet-js


<script>
	var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
		cloudmadeAttribution = 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery &copy; <a href="http://cloudmade.com">CloudMade</a>',
		cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution});

	var map = new L.Map('map');
	map.setView(new L.LatLng(51.505, -0.09), 13).addLayer(cloudmade);

	var marker = new L.Marker(new L.LatLng(51.5, -0.09));
	map.addLayer(marker);

	marker.bindPopup('A pretty CSS3 popup.<br />Easily customizable.').openPopup();
</script>

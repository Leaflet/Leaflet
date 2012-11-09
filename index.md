---
layout: default
---

<p class="notice">October 25, 2012 &mdash; Leaflet 0.4.5 bugfix release and plans for 0.5 &mdash; <a href="2012/10/25/leaflet-0-4-5-bugfix-release-and-plans-for-0.5.html">Read More in the Blog</a></p>

Leaflet is a modern open-source JavaScript library for mobile-friendly interactive maps. It is developed by [Vladimir Agafonkin][] of [CloudMade][] with a&nbsp;team of dedicated [contributors][]. Weighing just about <abbr title="That's 102 KB minified and 176 KB in the source form, with 8 KB of CSS (1.8 KB gzipped) and 10 KB of images">27 KB of gzipped JS code</abbr>, it has all the [features][] most developers ever need for online maps.

Leaflet is designed with _simplicity_, _performance_ and _usability_ in mind. It works efficiently across all major desktop and mobile platforms out of the box, taking advantage of HTML5 and CSS3 on modern browsers while being accessible on older ones too. It can also be extended with many [plugins][], has a beautiful, easy to use and [well-documented][] API and a simple, readable [source code][] that is a joy to [contribute][] to.

{: .usedby}
Used by: [Flickr](http://flickr.com/map) [foursquare](https://foursquare.com/) [craigslist](http://t.co/V4EiURIA) [IGN](http://www.ign.com/wikis/the-elder-scrolls-5-skyrim/interactive-maps/Skyrim) [Wikimedia](http://blog.wikimedia.org/2012/04/05/new-wikipedia-app-for-ios-and-an-update-for-our-android-app/) [Meetup](http://www.meetup.com/) [WSJ](http://projects.wsj.com/campaign2012/maps/) [Geocaching](http://geocaching.com) [StreetEasy](http://streeteasy.com/) [Nestoria](http://www.nestoria.co.uk) [Topix](http://topix.com/) [Chartbeat](http://chartbeat.com/) [GIS Cloud](http://www.giscloud.com/) ...

<div id="map" class="map" style="height: 300px"></div>

In this basic example, we create a map with <abbr title="Here we use the beautiful CloudMade tiles which require an API key (get one for free!), but Leaflet doesn't force you to &mdash; use whatever works for you, it's open source!">tiles of our choice</abbr>, add a marker and bind a popup with some text to it:


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


## Getting Involved

Third-party patches are absolutely essential on our quest to create the best mapping library that will ever exist. However, they're not the only way to get involved with the development of Leaflet. You can help the project tremendously by discovering and [reporting bugs][], [improving documentation][], helping others on the [Leaflet forum](https://groups.google.com/forum/#!forum/leaflet-js) and [GitHub issues](https://github.com/CloudMade/Leaflet/issues), showing your support for your favorite feature suggestions on [Leaflet UserVoice page](http://leaflet.uservoice.com), tweeting to [@LeafletJS](http://twitter.com/LeafletJS) and spreading the word about Leaflet among your colleagues and friends.

Check out the [contribution guide][contribute] for more information on getting involved with Leaflet development.

  [Vladimir Agafonkin]: http://agafonkin.com/en
  [CloudMade]: http://cloudmade.com
  [contributors]: https://github.com/CloudMade/Leaflet/graphs/contributors
  [features]: features.html
  [plugins]: plugins.html
  [well-documented]: reference.html "Leaflet API reference"
  [source code]: https://github.com/CloudMade/Leaflet "Leaflet GitHub repository"
  [hosted on GitHub]: http://github.com/CloudMade/Leaflet
  [contribute]: https://github.com/CloudMade/Leaflet/blob/master/CONTRIBUTING.md "A guide to contributing to Leaflet"
  [reporting bugs]: https://github.com/CloudMade/Leaflet/blob/master/CONTRIBUTING.md#reporting-bugs
  [improving documentation]: https://github.com/CloudMade/Leaflet/blob/master/CONTRIBUTING.md#improving-documentation
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

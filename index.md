---
layout: default
---

<!-- <p class="notice">November 18, 2013 &mdash; <a href="2013/11/18/leaflet-0-7-released-plans-for-future.html">Leaflet 0.7 Release, MapBox &amp; Plans for Future</a> (Blog Post)</p> -->

Leaflet is a modern open-source JavaScript library for mobile-friendly interactive maps.
It is developed by [Vladimir Agafonkin][] with a&nbsp;team of dedicated [contributors][].
Weighing just about <abbr title="33 KB gzipped &mdash; that's 123 KB minified and 218 KB in the source form, with 10 KB of CSS (2 KB gzipped) and 11 KB of images.">33 KB of JS</abbr>,
it has all the [features][] most developers ever need for online maps.

Leaflet is designed with _simplicity_, _performance_ and _usability_ in mind.
It works efficiently across all major desktop and mobile platforms out of the box,
taking advantage of HTML5 and CSS3 on modern browsers while still being accessible on older ones.
It can be extended with a huge amount of [plugins][],
has a beautiful, easy to use and [well-documented API][]
and a simple, readable [source code][] that is a&nbsp;joy to [contribute][] to.

{: .usedby}
Used by:
[Flickr](http://flickr.com/map)
[foursquare](https://foursquare.com/)
[Pinterest](http://pinterest.com)
[craigslist](http://t.co/V4EiURIA)
[Data.gov](http://data.gov)
[IGN](http://www.ign.com/wikis/the-elder-scrolls-5-skyrim/interactive-maps/Skyrim)
[Wikimedia](http://blog.wikimedia.org/2012/04/05/new-wikipedia-app-for-ios-and-an-update-for-our-android-app/)
[OSM](http://openstreetmap.org)
[Meetup](http://www.meetup.com/)
[WSJ](http://projects.wsj.com/campaign2012/maps/)
[Mapbox](http://mapbox.com)
[CartoDB](http://cartodb.com)
[GIS Cloud](http://www.giscloud.com/)
...

<div id="map" class="map" style="height: 300px"></div>

In this basic example, we create a map with <abbr title="Here we use OpenStreetMap tiles, but Leaflet doesn't force you to &mdash; use whatever works for you, it's open source!">tiles of our choice</abbr>, add a marker and bind a popup with some text to it:

	// create a map in the "map" div, set the view to a given place and zoom
	var map = L.map('map').setView([51.505, -0.09], 13);

	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
		attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	// add a marker in the given location, attach some popup content to it and open the popup
	L.marker([51.5, -0.09]).addTo(map)
		.bindPopup('A pretty CSS3 popup. <br> Easily customizable.')
		.openPopup();

Learn more with the [quick start guide](examples/quick-start.html), check out [other tutorials](examples.html), or head straight to the [API documentation](reference.html). <br>
If you have any questions, take a look at the [FAQ](https://github.com/Leaflet/Leaflet/blob/master/FAQ.md) first.


## Getting Involved

Third-party patches are absolutely essential on our quest to create the best mapping library that will ever exist.
However, they're not the only way to get involved with the development of Leaflet.
You can help the project tremendously by discovering and [reporting bugs][], [improving documentation][],
helping others on the [Leaflet forum](https://groups.google.com/forum/#!forum/leaflet-js)
and [GitHub issues](https://github.com/Leaflet/Leaflet/issues),
showing your support for your favorite feature suggestions on [Leaflet UserVoice page](http://leaflet.uservoice.com),
tweeting to [@LeafletJS](http://twitter.com/LeafletJS)
and spreading the word about Leaflet among your colleagues and friends.

Check out the [contribution guide][contribute] for more information on getting involved with Leaflet development.

  [Vladimir Agafonkin]: http://agafonkin.com/en
  [contributors]: https://github.com/Leaflet/Leaflet/graphs/contributors
  [features]: features.html
  [plugins]: plugins.html
  [well-documented API]: reference.html "Leaflet API reference"
  [source code]: https://github.com/Leaflet/Leaflet "Leaflet GitHub repository"
  [hosted on GitHub]: http://github.com/Leaflet/Leaflet
  [contribute]: https://github.com/Leaflet/Leaflet/blob/master/CONTRIBUTING.md "A guide to contributing to Leaflet"
  [reporting bugs]: https://github.com/Leaflet/Leaflet/blob/master/CONTRIBUTING.md#reporting-bugs
  [improving documentation]: https://github.com/Leaflet/Leaflet/blob/master/CONTRIBUTING.md#improving-documentation
  [@mourner]: http://github.com/mourner
  [GitHub issues page]: http://github.com/Leaflet/Leaflet/issues
  [Leaflet UserVoice page]: http://leaflet.uservoice.com
  [@LeafletJS]: http://twitter.com/LeafletJS
  [Leaflet mailing list]: https://groups.google.com/group/leaflet-js


<script>
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		osmAttrib = '&copy; <a href="http://openstreetmap.org/copyright">OpenStreetMap</a> contributors',
		osm = L.tileLayer(osmUrl, {maxZoom: 18, attribution: osmAttrib});

	var map = L.map('map').setView([51.505, -0.159], 15).addLayer(osm);

	L.marker([51.504, -0.159])
		.addTo(map)
		.bindPopup('A pretty CSS3 popup.<br />Easily customizable.')
		.openPopup();
</script>

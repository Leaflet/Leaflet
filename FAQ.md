# Leaflet FAQ

This is a collection of answers to the most frequently asked questions about Leaflet.

 1. [Data Providers](#data-providers)
 2. [Commercial Use and Licensing](#commercial-use-and-licensing)
 3. [Features](#features)
 4. [Performance](#performance)
 5. [Misc](#misc)

## Data Providers

#### The map is wrong in my neighborhood, could you fix it?

Nope, but you can.
The map you see on Leaflet examples is based on [OpenStreetMap](http://openstreetmap.org),
a free editable map of the world.
Signing up and editing the map there is easy,
and the changes will be reflected on the map in a few minutes.

#### What map tiles can I use with Leaflet? Is it limited to OpenStreetMap?

Leaflet is provider-agnostic, meaning you can use any map provider as long as you conform to its terms of use.
You can roll your own tiles as well.
[OpenStreetMap](http://openstreetmap.org) is the most popular data source among different tile providers,
but there are providers that use other sources.

Check out [this example](http://leaflet-extras.github.io/leaflet-providers/preview/)
with over seventy different layers to choose from.
Popular commercial options, free up to a particular number of requests, include
[MapBox](http://mapbox.com),
[Bing Maps](http://www.microsoft.com/maps/choose-your-bing-maps-API.aspx) (using a [plugin](https://github.com/shramov/leaflet-plugins)),
[Esri ArcGIS](http://www.arcgis.com/features/maps/imagery.html) ([official plugin](https://github.com/Esri/esri-leaflet))
and [Nokia Here](http://developer.here.com/web-experiences).
A notable exception is [MapQuest Open](http://developer.mapquest.com/web/products/open/map), which is free for any number of requests.

Always be sure to **read the terms of use** of a chosen tile provider, **know its limitations**, and **attribute it properly** in your app.

#### I'm looking for satellite imagery to use with my Leaflet map, any options?

[MapBox](http://mapbox.com),
[Bing Maps](http://www.microsoft.com/maps/choose-your-bing-maps-API.aspx),
[ArcGIS](http://www.arcgis.com/features/maps/imagery.html)
and [MapQuest Open](http://developer.mapquest.com/web/products/open/map) provide satellite imagery among others.

#### I want to use Google Maps API tiles with Leaflet, can I do that?

The problem with Google is that its [Terms of Use](https://developers.google.com/maps/terms) forbid any means of tile access other than through the Google Maps API.

You can add the Google Maps API as a Leaflet layer with a [plugin](https://github.com/shramov/leaflet-plugins). But note that the map experience will not be perfect, because Leaflet will just act as a proxy to the Google Maps JS engine, so you won't get all the performance and usability benefits of using Leaflet when the Google layer is on.

#### I want to roll my own OSM tile server for Leaflet, where do I start?

Check out [this excellent guide](http://switch2osm.org/serving-tiles/).

#### I want to create tiles from my own data for use with Leaflet, what are the options?

There's a number of services that allow you to do this easily,
notably [MapBox](https://www.mapbox.com/), [CartoDB](http://cartodb.com/) and [GIS Cloud](http://www.giscloud.com/).
If you want to make tiles on your own, probably the easiest way is using [TileMill](https://www.mapbox.com/tilemill/).
TileMill can export your map as a single [.mbtiles](https://www.mapbox.com/developers/mbtiles/) file, which can be copied to a webserver and accessed by Leaflet with [a small PHP script](https://github.com/infostreams/mbtiles-php).
Alternatively, you can [extract](https://github.com/mapbox/mbutil) the tiled images from the .mbtiles database and place them directly on your webserver with absolutely no server-side dependencies.

## Commercial Use and Licensing

#### I have an app that gets lots of hits a day, and I want to switch from Google/Bing/whatever to Leaflet. Is there a fee for using it?

Leaflet, unlike Google Maps and other all-in-one solutions, is just a JavaScript library.
It's free to use, but doesn't provide map imagery on its own &mdash;
you have to choose a tile service to combine with it.

There are [plenty of options](#what-map-tiles-can-i-use-with-leaflet-is-it-limited-to-openstreetmap) for a tile service,
each with their own terms of use, prices (some of them free), features, limitations, etc.
Choice is yours.

#### I'm building a commercial app that I plan to sell. Can I use Leaflet in it?

You're welcome, as the code is published under the very permissive [2-clause BSD License](https://github.com/Leaflet/Leaflet/blob/master/LICENSE).
Just make sure to attribute the use of the library somewhere in the app UI or the distribution
(e.g. keep the Leaflet link on the map, or mention the use on the About page or a Readme file, etc.) and you'll be fine.

That only applies to the code though.
Make sure you conform to the terms of use of the tile images provider(s) that you choose as well.


## Features

#### What's the best way to put the data I have on a Leaflet map?

Check out [this awesome cheatsheet](https://github.com/tmcw/mapmakers-cheatsheet).

#### Why is there still no feature X in Leaflet?

First of all, did you check out the [Leaflet plugins page](http://leafletjs.com/plugins.html)?
It lists about a hundred plugins doing all kinds of crazy stuff,
and there's a high possibility that it has what you're looking for.

Generally, we do our best to keep the Leaflet core small, lightweight and simple,
focusing on _quality_ instead of _quantity_, and leaving all the rest to plugin authors.

Check out [this video](http://www.youtube.com/watch?v=_P2SaCPbJ4w) of a talk by the Leaflet creator for more background on the story and philosophy behind Leaflet.
Another essential read is [Advocating Simplicity in Open Source](http://blog.universalmind.com/advocating-simplicity-in-open-source/) by the same guy.


## Performance

#### I have thousands of markers on my map. How do I make it faster and more usable?

Check out the [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) plugin. It's amazing.

#### I have vector data with many thousands of points on my map. Any performance tips?

Leaflet generally does a pretty good job of handling heavy vector data
with its real-time clipping and simplification algorithms,
but browser technology still has its limits.
Try [switching from SVG to Canvas as the default rendering back-end](http://leafletjs.com/reference.html#global),
it may help considerably (depends on the app and the data).

If you still have too much data to render, you'll have to use some help of a server-side service
like [MapBox](https://www.mapbox.com/),
[CartoDB](http://cartodb.com/)
and [GIS Cloud](http://www.giscloud.com/)
(they all work great with Leaflet).
What they do under the hood is serving rendered data as image tiles,
along with additional data to enable interactivity like hovering shapes
(e.g. done using [UTFGrid](https://www.mapbox.com/developers/utfgrid/) &mdash;
Leaflet [has a nice plugin](https://github.com/danzel/Leaflet.utfgrid) for it).


## Misc

#### I downloaded the Leaflet source but didn't find `leaflet.js` there. Why is that?

You can download the built versions using links from the [download page](http://leafletjs.com/download.html).
It even includes the latest build of the development version (`master` branch),
updated automatically on each commit to the repo.

We removed the built versions from the repository because it's a chore to build and commit them manually on each change,
and it often complicates merging branches and managing contributions.

There's a common complaint that Leaflet can't be used with [Bower](http://bower.io/) because of that, but we'll resolve the issue soon.

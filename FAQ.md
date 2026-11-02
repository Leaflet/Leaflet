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
The map you see on Leaflet examples is based on [OpenStreetMap](https://www.openstreetmap.org/),
a free editable map of the world.
Signing up and editing the map there is easy,
and the changes will be reflected on the map in a few minutes.

#### What map tiles can I use with Leaflet? Is it limited to OpenStreetMap?

Leaflet is provider-agnostic, meaning you can use any map provider as long as you conform to its terms of use.
You can roll your own tiles as well.
[OpenStreetMap](https://www.openstreetmap.org/) is the most popular data source among different tile providers,
but there are providers that use other sources.

Check out [this preview](https://leaflet-extras.github.io/leaflet-providers/preview/)
of the many layers to choose from.
Popular commercial options, free up to a particular number of requests, include
[Mapbox](https://www.mapbox.com/),
[MapTiler](https://www.maptiler.com/),
[Esri ArcGIS](https://www.esri.com/en-us/arcgis/products/arcgis-location-platform/overview) ([official plugin](https://github.com/Esri/esri-leaflet)),
[HERE](https://www.here.com/developer),
[Thunderforest](https://www.thunderforest.com/),
and [Stadia Maps](https://docs.stadiamaps.com/tutorials/raster-maps-with-leaflet/).

Always be sure to **read the terms of use** of a chosen tile provider, **know its limitations**, and **attribute it properly** in your app.

#### I'm looking for satellite imagery to use with my Leaflet map, any options?

[Mapbox](https://www.mapbox.com/),
[MapTiler](https://www.maptiler.com/),
[Esri ArcGIS](https://www.esri.com/en-us/arcgis/products/arcgis-location-platform/overview),
and [Stadia Maps](https://docs.stadiamaps.com/map-styles/alidade-satellite/) provide satellite imagery among others.

#### I want to use Google Maps API tiles with Leaflet, can I do that?

Google's [Map Tiles API](https://developers.google.com/maps/documentation/tile/2d-tiles-overview) serves 2D map and satellite tiles
that you can use with a `TileLayer`, following its [terms](https://cloud.google.com/maps-platform/terms) (an API key, a session token and Google's attribution).

You can also add the Google Maps JavaScript API as a Leaflet layer with the [GoogleMutant plugin](https://gitlab.com/IvanSanchez/Leaflet.GridLayer.GoogleMutant). But, note that the map experience will not be perfect, because Leaflet must wait for the Google Maps JS engine to load the map tiles, so you might experience glitches and lagging when using it.

#### I want to roll my own OSM tile server for Leaflet, where do I start?

Check out [this excellent guide](https://switch2osm.org/serving-tiles/).

#### I want to create tiles from my own data for use with Leaflet, what are the options?

There's a number of services that allow you to do this easily,
notably [Mapbox](https://www.mapbox.com/), [MapTiler](https://www.maptiler.com/) and [CARTO](https://carto.com/).
If you want to make tiles on your own, [QGIS](https://qgis.org/) (with its "Generate XYZ tiles" tool) and
[gdal2tiles](https://gdal.org/en/stable/programs/gdal2tiles.html) can render your data into a folder of tile images,
which you can put on any web server with absolutely no server-side dependencies.

## Commercial Use and Licensing

#### I have an app that gets lots of hits a day, and I want to switch from Google/Bing/whatever to Leaflet. Is there a fee for using it?

Leaflet, unlike Google Maps and other all-in-one solutions, is just a JavaScript library.
It's free to use, but doesn't provide map imagery on its own &mdash;
you have to choose a tile service to combine with it.

There are [plenty of options](#what-map-tiles-can-i-use-with-leaflet-is-it-limited-to-openstreetmap) for a tile service,
each with their own terms of use, prices (some of them free), features, limitations, etc.
The choice is yours.

#### I'm building a commercial app that I plan to sell. Can I use Leaflet in it?

You're welcome to do so, as the code is published under the very permissive [2-clause BSD License](https://github.com/Leaflet/Leaflet/blob/main/LICENSE).
Just make sure to attribute the use of the library somewhere in the app UI or the distribution
(e.g. keep the Leaflet link on the map, or mention the use on the About page or a Readme file, etc.) and you'll be fine.

That only applies to the code, though.
Make sure you conform to the terms of use of the tile images provider(s) that you choose, as well.


## Features

#### What's the best way to put the data I have on a Leaflet map?

Check out [this awesome cheatsheet](https://github.com/tmcw/mapmakers-cheatsheet).

#### Why is there still no feature X in Leaflet?

First of all, did you check out the [Leaflet plugins page](https://leafletjs.com/plugins.html)?
It lists hundreds of plugins doing all kinds of crazy stuff,
and there's a high possibility that it has what you're looking for.

Generally, we do our best to keep the Leaflet core small, lightweight and simple,
focusing on _quality_ instead of _quantity_, and leaving all the rest to plugin authors.

Check out [this video](https://www.youtube.com/watch?v=_P2SaCPbJ4w) of a talk by the Leaflet creator for more background on the story and philosophy behind Leaflet.


## Performance

#### I have thousands of markers on my map. How do I make it faster and more usable?

Check out the [Leaflet.markercluster](https://github.com/Leaflet/Leaflet.markercluster) plugin. It's amazing.

#### I have vector data with many thousands of points on my map. Any performance tips?

Leaflet generally does a pretty good job of handling heavy vector data
with its real-time clipping and simplification algorithms,
but the browser technology still has its limits.
Try switching from SVG to [Canvas](https://leafletjs.com/reference.html#canvas) as the default rendering back-end
(the map's [`renderer`](https://leafletjs.com/reference.html#map-renderer) option: `renderer: new Canvas()`),
it may help considerably (depends on the app and the data).

If you still have too much data to render, render it into image tiles instead,
either [on your own](#i-want-to-create-tiles-from-my-own-data-for-use-with-leaflet-what-are-the-options)
or with a service like [Mapbox](https://www.mapbox.com/) or [CARTO](https://carto.com/).


## Misc

#### I downloaded the Leaflet source but didn't find `leaflet.js` there. Why is that?

You can get the built versions from npm, a CDN or a zip, as described on the [install page](https://leafletjs.com/install.html),
or build them yourself with `npm run build`.
There's also a [development snapshot](https://github.com/Leaflet/Leaflet/releases/tag/dev) of the `main` branch,
updated automatically on each commit to the repo.

We removed the built versions from the repository because it's a chore to build and commit them manually on each change,
and it often complicates merging branches and managing contributions.

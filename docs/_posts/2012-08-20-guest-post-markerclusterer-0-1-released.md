---
layout: post
title: Leaflet.MarkerCluster 0.1 Released
description: Introducing Leaflet.MarkerCluster, a beautiful, fast, customizable plugin to reduce the visual clutter on crowded maps.
author: Dave Leaver
authorsite: https://github.com/danzel/
---

_This is a guest post from Dave Leaver, an active Leaflet contributor (particularly, he implemented 0.4 zoom animation improvements) and also the author of the best marker clustering plugin out there, which is presented in this post._

Almost anyone who has a map with markers on it will eventually end up having those markers overlap. At my day job at <a href="http://www.smartrak.co.nz/" title="Smartrak GPS Fleet Tracking">Smartrak</a> we regularly have customers with thousands of points on the map. When you zoom it out, these markers all overlap and make the map look messy and crowded. There are also cases where the markers overlap even on the maximum zoom level, which makes interacting with them impossible. Also, having a large amount of markers on the map usually ends up lowering performance to an unacceptable level.

To improve this, many sites use marker clustering, a technique of grouping markers that are close to each other together on each zom level. One good example of this is <a href="http://www.redfin.com/homes-for-sale">Redfin</a>. We needed something like this, but in Leaflet. In the spirit of open source we developed and released our solution so that everyone can take advantage of it. So we proudly present <a href="https://github.com/leaflet/Leaflet.markercluster">Leaflet.MarkerCluster</a>.

<div id="map" class="map" style="height: 320px"></div>

{:#plugin-features}
### Features

The clusterer has all sorts of great built in behaviour:

 * Everything is brilliantly animated. As you zoom in and out you can logically see which clusters have become which markers.
 * It is very fast, so for example [clustering 50,000 points](https://leaflet.github.com/Leaflet.markercluster/example/marker-clustering-realworld.50000.html) isn't a problem. Also, all the heavy calculation happens on initial page load, and after this the map works smoothly.
 * Markers that don't need clustering aren't and will be visible at the relevant zoom levels.
 * When you mouse over a cluster the bounds of the marker within that cluster are shown.
 * Clicking a cluster will zoom you in to the bounds of its children.
 * At the bottom zoom level if there are still clusters you can click on them to "spiderfy" them, which makes interaction with individual markers within the cluster possible (based on <a href="https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet">jawj's Overlapping MarkerSpidifer</a>).
 * Cluster and markers that are further than a screen width from the view port are removed from the map to increase performance.
 * As with core Leaflet, everything works on both mobile and desktop browsers and is tested all the way back to IE6.
 * Supports adding and removing markers after being added to the map (see Best Practices below!).
 * It is highly customizable, allowing you to easily change the appearance of clusters, disable certain features and add custom behavior on cluster interaction.

### Usage

Using the Marker Clusterer is easy, just replace your existing [LayerGroup](../../../examples/layers-control.html) usage with an `L.MarkerClusterGroup`:

    var markers = new L.MarkerClusterGroup();

	markers.addLayer(L.marker([175.3107, -37.7784]));
	// add more markers here...

	map.addLayer(markers);

You can also use all of the [FeatureGroup events](../../../reference.html#featuregroup) (and additionally `clusterclick`) for both individual markers and clusters.

	markers.on('clusterclick', function (a) { alert('Cluster Clicked'); });
	markers.on('click', function (a) { alert('Marker Clicked'); });

### Best Practices

 * To get the best performance from the clusterer, you should add all of your markers to it before adding it to the map (like we did in the example).
 * If you are going to move a marker that is in a L.MarkerClusterGroup you must remove it first, then move it, then re-add it. If you move it while it is in the MarkerClusterGroup we can't track it and that marker will become lost.
 * Although the clusterer supports having markers added and removed from it while it is on the map it does not perform as well as when they are added while it is not on the map. If you need to do a large update to the markers in a `MarkerClusterGroup` you may want to remove it from the map, change the markers then re-add it.

### Get It

You can download the latest release on the <a href="https://github.com/leaflet/Leaflet.markercluster/downloads">github download page</a>.

### The Technical Bits

The underlying clustering algorithm (`MarkerClusterGroup._cluster`) is plain greedy clustering.

{: .no-highlight}
    foreach marker
        if there is a cluster within the clustering distance, join it.
        else if there is an unclustered marker within the clustering distance, form a cluster with it.

The first clustering step we do for the maximum (bottom most) zoom level, we then cluster all of the resulting markers and clusters to generate the next zoom level up and so on until we have reached the top.
These clusters are stored in a tree (A cluster contains its child clusters) with good geospatial qualities. We use this tree to optimise identifying what markers and clusters are on screen at any particular zoom level.

#### L.DistanceGrid

`L.DistanceGrid` provides some nice optimization when clustering (contributed by [Vladimir](http://agafonkin.com/en/), Leaflet maintainer).

To cluster the markers, we need to compare every marker with every other marker to try form a cluster.
To make this quicker, we need reduce the set of markers we need to compare with. `DistanceGrid` does this by putting all markers on a grid sized the same as the distance we need to search. Then, when looking for a marker to cluster with, we only need to look at markers in the grid square we are in and its immediate neighbours. This can be quite a big performance win as we only look at markers that we are likely to form a cluster with. (<a href="https://github.com/leaflet/Leaflet.markercluster/pull/29">check out the initial PR for numbers</a>)

### Closing Words

I hope you enjoy using the clusterer and get everything you want out of it. If you do use it in a public site please <a href="mailto:danzel@localhost.geek.nz">throw me an email</a> so I can check it out and potentially link it on the github site.

If you have any issues also please log a bug on <a href="https://github.com/leaflet/Leaflet.markercluster">the github page</a>.

Enjoy!<br />
Dave Leaver.

<link rel="stylesheet" href="http://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.css" />
<link rel="stylesheet" href="http://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.Default.css" />
<!--[if lte IE 8]><link rel="stylesheet" href="http://leaflet.github.io/Leaflet.markercluster/dist/MarkerCluster.Default.ie.css" /><![endif]-->
<script src="http://leaflet.github.io/Leaflet.markercluster/dist/leaflet.markercluster-src.js"></script>
<script src="http://leaflet.github.io/Leaflet.markercluster/example/realworld.388.js"></script>

<script>
	var mapbox = new L.TileLayer(MB_URL, {maxZoom: 18, attribution: MB_ATTR, id: 'examples.map-i875mjb7'}),
		latlng = new L.LatLng(-37.820, 175.217);

	var map = new L.Map('map', {center: latlng, zoom: 15, layers: [mapbox]});

	map.attributionControl.addAttribution("Points &copy 2012 LINZ");

	var markers = new L.MarkerClusterGroup();

	for (var i = 0; i < addressPoints.length; i++) {
		var a = addressPoints[i];
		var title = a[2];
		var marker = new L.Marker(new L.LatLng(a[0], a[1]), { title: title });
		marker.bindPopup(title);
		markers.addLayer(marker);
	}

	map.addLayer(markers);
</script>

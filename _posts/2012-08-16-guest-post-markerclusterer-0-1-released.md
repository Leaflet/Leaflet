---
layout: post
title: Guest Post - Leaflet.MarkerClusterer 0.1 Released
description: Leaflet now has its own MarkerClustering Plugin to reduce the visual clutter on your maps.
author: Dave Leaver
authorsite: https://github.com/danzel/
---

Almost anyone who has a map with markers on it will eventually end up having those markers overlap. At my day job at <a href="http://www.smartrak.co.nz/" title="Smartrak GPS Fleet Tracking">Smartrak</a> we regularly have customers with thousands of points on the map.
When you zoom your map out, these markers all overlap and make the map look messy and crowded. Also having a large amount of markers on the map usually ends up lowering performance to an unacceptable level.

To improve this, many sites use marker clustering, one good example is at <a href="http://www.redfin.com/homes-for-sale">redfin</a>.

We needed something like this, but in leaflet. So in the spirit of open source we developed it and released it so that everyone can take advantage of it.

So we proudly present <a href="https://github.com/danzel/Leaflet.markercluster">Leaflet.MarkerCluster</a>.

<iframe src="http://danzel.github.com/Leaflet.markercluster/example/marker-clustering-realworld-mobile.388.html" style="height: 250px; width: 100%"></iframe>


The clusterer has all sorts of great built in behaviour:

 *   Markers that don't need clustering aren't and will be visible at the relevant levels.
 *   Cluster and markers that are further than a screen width from the view port are removed from the map to increase performance.
 *   Everything is brilliantly animated. As you zoom in and out you can logically see which clusters have become which markers.
 *   At the bottom zoom level if there are still clusters you can click on them to 'spiderfy' them, which shows the individual markers within the cluster. (Based on <a href="https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet">jawj's Overlapping MarkerSpidifer</a>)
 *   As with core Leaflet, everything works on Mobile and on the desktop is tested all the way back to IE7.
 *   It is based on L.FeatureGroup to provide the interaction for the markers contained with in it.
 *   Supports Adding and Removing Markers after being added to the map.

### Usage

Using the Marker Clusterer is easy, just replace your existing L.FeatureGroup usage with a L.MarkerClusterGroup:

    var markers = new L.MarkerClusterGroup();
	markers.addLayer(new Marker([175.3107, -37.7784]));
	//Add more markers
	map.addLayer(markers);

You can also use all of the L.FeatureGroup event features for both individual markers and clusters:
	markers.on('clusterclick', function (a) { alert('Cluster Clicked'); });
	markers.on('click', function (a) { alert('Marker Clicked'); });

### The Technical bits

The underlying clustering algorithm (MarkerClusterGroup._cluster) is plain greedy clustering.

    foreach marker
        if there is a cluster within the clustering distance, join it.
        else if there is an unclustered marker within the clustering distance, form a cluster with it.

L.DistanceGrid provides some nice optimization in here (Contributed by mourner of course!).
When clustering we need to compare every marker with every other marker to try form a cluster.
To make this quicker we need to reduce the set of markers we need to compare with, L.DistanceGrid does this by putting all markers on to a grid with grid size the same as the distance we need to search.
Then when looking for a marker to cluster with we only need to look at markers in the grid square we are in and its immediate neighbours.
This can be quite a big performance win as you will only look at markers that you are likely to form a cluster with. (<a href="https://github.com/danzel/Leaflet.markercluster/pull/29">check out the initial PR for numbers</a>)

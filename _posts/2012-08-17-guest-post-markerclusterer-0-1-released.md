---
layout: post
title: Guest Post - Leaflet.MarkerCluster 0.1 Released
description: Leaflet now has its own MarkerClustering Plugin to reduce the visual clutter on your maps.
author: Dave Leaver
authorsite: https://github.com/danzel/
---

Almost anyone who has a map with markers on it will eventually end up having those markers overlap. At my day job at <a href="http://www.smartrak.co.nz/" title="Smartrak GPS Fleet Tracking">Smartrak</a> we regularly have customers with thousands of points on the map.
When you zoom your map out, these markers all overlap and make the map look messy and crowded. Also having a large amount of markers on the map usually ends up lowering performance to an unacceptable level.

To improve this, many sites use marker clustering, one good example is at <a href="http://www.redfin.com/homes-for-sale">redfin</a>.

We needed something like this, but in Leaflet. In the spirit of open source we developed it and released it so that everyone can take advantage of it.

So we proudly present <a href="https://github.com/danzel/Leaflet.markercluster">Leaflet.MarkerCluster</a>.

<div id="map" class="map" style="height: 350px"></div>


The clusterer has all sorts of great built in behaviour:

 *   Markers that don't need clustering aren't and will be visible at the relevant levels.
 *   When you mouse over a cluster the bounds of the marker within that cluster are shown.
 *   Clicking a cluster will zoom you in to the bounds of its children.
 *   At the bottom zoom level if there are still clusters you can click on them to 'spiderfy' them, which shows the individual markers within the cluster. (Based on <a href="https://github.com/jawj/OverlappingMarkerSpiderfier-Leaflet">jawj's Overlapping MarkerSpidifer</a>)
 *   Everything is brilliantly animated. As you zoom in and out you can logically see which clusters have become which markers.
 *   Cluster and markers that are further than a screen width from the view port are removed from the map to increase performance.
 *   As with core Leaflet, everything works on Mobile and on the desktop is tested all the way back to IE6.
 *   It is based on L.FeatureGroup to provide the interaction for the markers contained with in it.
 *   Supports Adding and Removing Markers after being added to the map (See Best Practices below!).

### Usage

Using the Marker Clusterer is easy, just replace your existing L.FeatureGroup usage with a L.MarkerClusterGroup:

    var markers = new L.MarkerClusterGroup();
	markers.addLayer(new Marker([175.3107, -37.7784]));
	//Add more markers here...
	map.addLayer(markers);

You can also use all of the L.FeatureGroup event features for both individual markers and clusters.

	markers.on('clusterclick', function (a) { alert('Cluster Clicked'); });
	markers.on('click', function (a) { alert('Marker Clicked'); });

### Best Practices

 *   To get the best performance from the clusterer you should add all of your markers to it before adding it to the map (like we did in the example).
 *   If you are going to move a marker that is in a L.MarkerClusterGroup you must remove it first, then move it, then re-add it. If you move it while it is in the MarkerClusterGroup we can't track it and that marker will become lost.
 *   Although the clusterer supports having markers added and removed from it while it is on the map it does not perform as well as when they are added while it is not on the map. If you need to do a large update to the markers in a MarkerClusterGroup you may want to remove it from the map, change the markers then re-add it.

### The Technical bits

The underlying clustering algorithm (MarkerClusterGroup._cluster) is plain greedy clustering.

    foreach marker
        if there is a cluster within the clustering distance, join it.
        else if there is an unclustered marker within the clustering distance, form a cluster with it.

The first clustering step we do for the maximum (bottom most) zoom level, we then cluster all of the resulting markers and clusters to generate the next zoom level up and so on until we have reached the top.
These clusters are stored in a tree (A cluster contains its child clusters) with good geospatial qualities. We use this tree to optimise identifying what markers and clusters are on screen at any particular zoom level.

#### L.DistanceGrid

L.DistanceGrid provides some nice optimization when clustering (Contributed by mourner of course!).

To cluster the markers we need to compare every marker with every other marker to try form a cluster.
To make this quicker we reduce the set of markers we need to compare with, L.DistanceGrid does this by putting all markers on a grid sized the same as the distance we need to search.
Then when looking for a marker to cluster with we only need to look at markers in the grid square we are in and its immediate neighbours.
This can be quite a big performance win as we only look at markers that we are likely to form a cluster with. (<a href="https://github.com/danzel/Leaflet.markercluster/pull/29">check out the initial PR for numbers</a>)

### Closing Words

I hope you enjoy using the clusterer and get everything you want out of it. If you do use it in a public site please <a href="mailto:danzel@localhost.geek.nz">throw me an email</a> so I can check it out and potentially link it on the github site.

If you have any issues also please log a bug on <a href="https://github.com/danzel/Leaflet.markercluster">the github page</a>.

Enjoy!<br />
Dave Leaver.

<link rel="stylesheet" href="http://danzel.github.com/Leaflet.markercluster/example/mobile.css" />

<link rel="stylesheet" href="http://danzel.github.com/Leaflet.markercluster/dist/MarkerCluster.css" />
<link rel="stylesheet" href="http://danzel.github.com/Leaflet.markercluster/dist/MarkerCluster.Default.css" />
<!--[if lte IE 8]><link rel="stylesheet" href="http://danzel.github.com/Leaflet.markercluster/dist/MarkerCluster.Default.ie.css" /><![endif]-->
<script src="http://danzel.github.com/Leaflet.markercluster/dist/leaflet.markercluster-src.js"></script>
<script src="http://danzel.github.com/Leaflet.markercluster/example/realworld.388.js"></script>

<script>
	var cloudmadeUrl = 'http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png',
		cloudmadeAttribution = 'Map data &copy; 2011 OpenStreetMap contributors, Imagery &copy; 2011 CloudMade, Points &copy 2012 LINZ',
		cloudmade = new L.TileLayer(cloudmadeUrl, {maxZoom: 18, attribution: cloudmadeAttribution}),
		latlng = new L.LatLng(-37.821, 175.22);

	var map = new L.Map('map', {center: latlng, zoom: 15, layers: [cloudmade]});

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

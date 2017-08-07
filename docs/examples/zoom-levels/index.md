---
layout: tutorial_v2
title: Zoom levels
---

<style>
.tiles img {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 5px;
}
.tiles.small img {
    border: 1px solid #ccc;
    border-radius: 5px;
    margin: 1px;
    width: 64px;
    height: 64px;
}
.tiles {
    line-height: 0;
}
.tiles.legend {
    line-height: 1;
}
</style>

## Zoom levels

Leaflet works with [latitude](https://en.wikipedia.org/wiki/Latitude), [longitude](https://en.wikipedia.org/wiki/Longitude) and "zoom level".

Lower zoom levels means that the map shows entire continents, while higher zoom
levels means that the map can show details of a city.

To understand how zoom levels work, first we need a basic introduction to <i>geodesy</i>.

## The shape of the earth

Let's have a look at a simple map locked at zoom zero:

```
	var map = L.map('map', {
		minZoom: 0,
		maxZoom: 0
	});

	var positron = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
		attribution: cartodbAttribution
	}).addTo(map);

	map.setView([0, 0], 0);
```

{% include frame.html url="example-zero.html" %}

Notice that the "whole earth" is just one image, 256 pixels wide and 256 pixels high:

<div class='tiles' style='text-align: center'>
<img src="http://a.basemaps.cartocdn.com/light_all/0/0/0.png" class="bordered-img" alt=""/>
</div>

Just to be clear: the earth is not a square. Rather, the earth is shaped like [a weird potato](https://commons.wikimedia.org/wiki/File:GRACE_globe_animation.gif) that can be approximated to [something similar to a sphere](https://en.wikipedia.org/wiki/Geoid).

<div class='tiles legend' style='text-align: center'>
<a title="By NASA/JPL/University of Texas Center for Space Research. (http://photojournal.jpl.nasa.gov/catalog/PIA12146) [Public domain], via Wikimedia Commons" href="https://commons.wikimedia.org/wiki/File%3AGRACE_globe_animation.gif"><img width="256" alt="GRACE globe animation" src="https://upload.wikimedia.org/wikipedia/commons/7/78/GRACE_globe_animation.gif"/>
<br/>
Potato earth image by NASA/JPL/University of Texas Center for Space Research</a>
with help of the <a href='https://en.wikipedia.org/wiki/Gravity_Recovery_and_Climate_Experiment'>GRACE satellites</a>.
</div>

So we *assume* that the earth is mosly round. To make it flat, we put an imaginary cylinder around, unroll it, and cut it so it looks square:

<div class='tiles legend' style='text-align: center'>
<a title="By derived from US Government USGS [Public domain], via Wikimedia Commons" href="https://en.wikipedia.org/wiki/Map_projection#Cylindrical"><img width="512" alt="Usgs map mercator" src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/62/Usgs_map_mercator.svg/512px-Usgs_map_mercator.svg.png"/>
<br/>
This is called a "cylindrical map projection".
</a>
</div>

This is not the only way of displaying the surface on the earth on a plane. There
are [hundreds of ways](https://en.wikipedia.org/wiki/Map_projection), each of them
with its own advantages and disadvantages. The following 6-minute video is a nice
introduction to the topic:

<center><iframe width="696" height="392" src="https://www.youtube.com/embed/kIID5FDi2JQ" frameborder="0" allowfullscreen></iframe></center>

Things like geodesy, map projections and coordinate systems are hard, *very hard*
(and out of scope for this tutorial). Assuming that the earth is a square is not
always the right thing to do, but most of the time works fine enough, makes things
simpler, and allows Leaflet (and other map libraries) to be fast.

## Powers of two

For now, let's just ***assume*** that the world is a square:

<div class='tiles' style='text-align: center'>
<img src="http://a.basemaps.cartocdn.com/light_all/0/0/0.png" class="bordered-img" alt=""/>
</div>

When we represent the world at zoom level **zero**, it's 256 pixels wide and high. When we go into zoom level **one**, it doubles its width and height, and can be represented by four 256-pixel-by-256-pixel images:

<div class='tiles' style='text-align: center'>
<div>
<img src="http://a.basemaps.cartocdn.com/light_all/1/0/0.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/1/1/0.png" class="bordered-img" alt=""/>
</div>
<div>
<img src="http://a.basemaps.cartocdn.com/light_all/1/0/1.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/1/1/1.png" class="bordered-img" alt=""/>
</div>
</div>

At each zoom level, each tile is divided in four, and its size doubles (in other words, the width and height of the world is <code>256·2<sup>zoomlevel</sup></code> pixels):

<table><tr><td>
<div class='tiles small' style='text-align: center'>
<img src="http://a.basemaps.cartocdn.com/light_all/0/0/0.png" class="bordered-img" alt=""/>
</div>
</td><td>
<div class='tiles small' style='text-align: center'>
<div>
<img src="http://a.basemaps.cartocdn.com/light_all/1/0/0.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/1/1/0.png" class="bordered-img" alt=""/>
</div>
<div>
<img src="http://a.basemaps.cartocdn.com/light_all/1/0/1.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/1/1/1.png" class="bordered-img" alt=""/>
</div>
</div>
</td><td>
<div class='tiles small' style='text-align: center'>
<div>
<img src="http://a.basemaps.cartocdn.com/light_all/2/0/0.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/1/0.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/2/0.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/3/0.png" class="bordered-img" alt=""/>
</div>
<div>
<img src="http://a.basemaps.cartocdn.com/light_all/2/0/1.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/1/1.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/2/1.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/3/1.png" class="bordered-img" alt=""/>
</div>
<div>
<img src="http://a.basemaps.cartocdn.com/light_all/2/0/2.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/1/2.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/2/2.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/3/2.png" class="bordered-img" alt=""/>
</div>
<div>
<img src="http://a.basemaps.cartocdn.com/light_all/2/0/3.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/1/3.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/2/3.png" class="bordered-img" alt=""/><img src="http://a.basemaps.cartocdn.com/light_all/2/3/3.png" class="bordered-img" alt=""/>
</div>
</div>
</td></tr>
<tr><td>Zoom 0</td><td>Zoom 1</td><td>Zoom 2</td></tr></table>

This goes on and on. Most tile services offer tiles up to zoom level 18, depending on
their coverage. This is enough to see a few city blocks per tile.

## A note about scale

One of the disadvantages of using a cylindrical projection is that the scale is not
constant, and measuring distances or sizes is not reliable, specially at low zoom levels.

In [technical terms](https://en.wikipedia.org/wiki/Map_projection#Projections_by_preservation_of_a_metric_property),
the cylindrical projection that Leaflet uses is <i>conformal</i> (preserves shapes),
but not <i>equidistant</i> (does not preserve distances), and not <i>equal-area</i>
(does not preserve areas, as things near the equator appear smaller than they are).

By adding a `L.Control.Scale` to a map, and panning to the equator and to 60° north,
we can see how the scale factor <b>doubles</b>. The following example uses
[javascript timeouts](https://developer.mozilla.org/docs/Web/API/WindowTimers/setTimeout)
to  do this automatically:

```
	L.control.scale().addTo(map);

	setInterval(function(){
		map.setView([0, 0]);
		setTimeout(function(){
			map.setView([60, 0]);
		}, 2000);
	}, 4000);
```

{% include frame.html url="example-scale.html" %}

`L.Control.Scale` shows the scale which applies to the center point of the map.
At high zoom levels, the scale changes very little, and is not noticeable.


## Controlling the zoom

A leaflet map has several ways to control the zoom level shown, but the most obvious
one is [`setZoom()`](../../reference-1.0.3.html#map-setzoom). For example, `map.setZoom(0);`
will set the zoom level of `map` to `0`.

This example again uses timeouts to alternate between zoom levels `0` and `1` automatically:

```
	setInterval(function(){
		map.setZoom(0);
		setTimeout(function(){
			map.setZoom(1);
		}, 2000);
	}, 4000);
```

{% include frame.html url="example-setzoom.html" %}

Notice how the images shown at zoom levels 0 and one correspond with the images
shown in the previous section!

Other ways of setting the zoom are:

* [`setView(center, zoom)`](../../reference-1.0.3.html#map-setview), which also sets the map center
* [`flyTo(center, zoom)`](../../reference-1.0.3.html#map-flyto), like `setView` but with a smooth animation
* [`zoomIn()` / `zoomIn(delta)`](../../reference-1.0.3.html#map-zoomin), zooms in `delta` zoom levels, `1` by default
* [`zoomOut()` / `zoomOut(delta)`](../../reference-1.0.3.html#map-zoomout), zooms out `delta` zoom levels, `1` by default
* [`setZoomAround(fixedPoint, zoom)`](../../reference-1.0.3.html#map-setzoomaround), sets the zoom level while keeping a point fixed (what scrollwheel zooming does)
* [`fitBounds(bounds)`](../../reference-1.0.3.html#map-fitbounds), automatically calculates the zoom to fit a rectangular area on the map


## Fractional zoom

A feature introduced in Leaflet 1.0.0 was the concept of <em>fractional zoom</em>.
Before this, the zoom level of the map could be only an integer number (`0`, `1`, `2`, and so on);
but now you can use fractional numbers like `1.5` or `1.25`.

Fractional zoom is disabled by default. To enable it, use the
[map's `zoomSnap` option](http://leafletjs.com/reference-1.0.3.html#map-zoomsnap).
The `zoomSnap` option has a default value of `1` (which means that the zoom level
of the map can be `0`, `1`, `2`, and so on).

If you set the value of `zoomSnap` to `0.5`, the valid zoom levels of the map
will be `0`, `0.5`, `1`, `1.5`, `2`, and so on.

If you set a value of `0.1`, the valid zoom levels of the map will be `0`, `0.1`,
`0.2`, `0.3`, `0.4`, and so on.

The following example uses a `zoomSnap` value of `0.25`:

```
	var map = L.map('map', {
		zoomSnap: 0.25
	});
```

{% include frame.html url="example-fractional.html" %}

As you can see, Leaflet will only load the tiles for zoom levels `0` or `1`, and will scale them
as needed.

Leaflet will <em>snap</em> the zoom level to the closest valid one. For example,
if you have `zoomSnap: 0.25` and you try to do `map.setZoom(0.8)`, the zoom will
snap back to `0.75`. The same happens with `map.fitBounds(bounds)`, or when ending
a pinch-zoom gesture on a touchscreen.

`zoomSnap` can be set to zero. This means that Leaflet will <strong>not</strong>
snap the zoom level.

There is another important map option related to `zoomSnap`: [the `zoomDelta` option](http://leafletjs.com/reference-1.0.3.html#map-zoomdelta).
This controls how many zoom levels to zoom in/out when using the zoom buttons
(from the default [`L.Control.Zoom`](http://leafletjs.com/reference-1.0.3.html#control-zoom))
or the `+`/`-` keys in your keyboard.

For the mousewheel zoom, the [`wheelPxPerZoomLevel`](http://leafletjs.com/reference-1.0.3.html#map-wheelpxperzoomlevel)
option controls how fast the mousewheel zooms in our out.

Here is an example with `zoomSnap` set to zero:

```
	var map = L.map('map', {
		zoomDelta: 0.25,
		zoomSnap: 0
	});
```

Try the following, and see how the zoom level changes:

* Pinch-zoom if you have a touchscreen
* Zoom in/out with your mousewheel
* Do a box zoom (drag with your mouse while pressing the `shift` key in your keyboard)
* Use the zoom in/out buttons

{% include frame.html url="example-delta.html" %}


That concludes this tutorial. Now play with your zoom levels in your maps!

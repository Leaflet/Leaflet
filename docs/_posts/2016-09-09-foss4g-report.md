---
layout: post
title: Report from FOSS4G
description: Some of the Leaflet maintainers met at the FOSS4G conference in Bonn
author: Iván Sánchez Ortega
---

A couple of weeks ago, a few of the Leaflet maintainers attended the [FOSS4G conference held in Bonn](http://2016.foss4g.org/). It was really nice and we met [hundreds of GIS people](https://www.flickr.com/photos/146261124@N02/28982312300/):

![The Leaflet folks are somewhere in there](/docs/images/2016-09-09-foss4g-party-boat.jpg)

Web mapping libraries, such as Leaflet, OpenLayers or Cesium are a big part of today's GIS software, and there were some talks about them. If you missed this conference, the full [video archive](http://video.foss4g.org/foss4g2016/videos/index.html) is up, with all talks recorded.

We managed to meet in Bonn, hack in the (amazing) BaseCamp facilities, and skip a few talks to work on the final release of Leaflet 1.0.0:

![Vlad and Iván ponder while Per codes](/docs/images/2016-09-09-foss4g.jpg)

While we made some progress, unfortunately we discovered that...

### Event handling is hard.

One of the last blockers for Leaflet 1.0.0 has been event handling. In particular, adding event handlers inside an event handler.

To make you aware of what's been delaying 1.0.0 lately, imagine the following scenario:

```
function a() { doSomething(); }
function b() { map.on('click', a); }
map.on('click', b);
```

Clicking on the map will trigger `b()`, which will add `a()`, but... *will* `a()` run? *Should* it run?

This case, which should be very rare, unfortunately happens a lot in Leaflet, in subtle ways. For example, when re-setting a map's `moveend` event handler after a map move, or when adding handlers to newly created layers (via `Leaflet.Editable` and the like). As our fellow Per Liedman discovered, providing a *consistent* way of doing this is no easy task.


### Pixel gap between tiles

One of the features that *won't* be making it to the 1.0.0 release is the [one-pixel-gap-between-tiles bug when using fractional zoom](https://github.com/Leaflet/Leaflet/issues/4844). Leaflet uses a lot of well-known HTML hacks to display things properly, but a good solution for the tile gap has been pretty much impossible to find.

Taking a bit of inspiration from the OpenLayers folks, Iván has started doing a [prototype of `<canvas>`-powered gap-less tilelayer](https://github.com/Leaflet/Leaflet.TileLayer.NoGap). This basically uses a `<canvas>` instead of `<img>` elements to display tiles, which avoids the gap and still allows for smooth panning and zooming. A lot of testing is still needed to prove that the image copy operations will not affect performance.

This poses a small dilemma to Leaflet. To keep things simple, developers should be able to see individual tiles in their browser's inpectors; but to fix this bug, we should add another layer of complexity.

Using the browser's native capabilities to display images is a good idea, as developers can see things like 404 errors much easier. Furthermore, using a `<canvas>` **will** create problems when developers use a tileserver which does not add [cross-origin headers](https://developer.mozilla.org/en-US/docs/Web/HTTP/Access_control_CORS).

Making sure that the code stays simple and that developers have an easy time debugging their applications is very high in Leaflet's list of priorities. The jury is still out on whether this will make it to the Leaflet core or stay as a plugin.


### Hold on tight for 1.0.0

The list of issues for Leaflet 1.0.0 is now down to two items, which means the release will happen «very very very soon». Hold on tight!


Best,

The "Leafteam"

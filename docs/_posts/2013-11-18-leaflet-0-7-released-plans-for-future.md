---
layout: post
title: Leaflet 0.7 Release, MapBox and Plans for Future
description: Leaflet 0.7 Released &mdash; with IE11 touch support, upscaling tiles and tons of other improvements and bugfixes! Meanwhile, I've joined the MapBox team full-time.
author: Vladimir Agafonkin
authorsite: http://agafonkin.com/en
---

_Leaflet 0.7 Released &mdash; with IE11 touch support, upscaling tiles and tons of other improvements and bugfixes! Meanwhile, I've joined the MapBox team full-time..._

After another 5 months of active development with [lots of contributors involved](https://github.com/Leaflet/Leaflet/graphs/contributors?from=2013-06-27&to=2013-11-18&type=c), I'm happy to announce the **release of Leaflet 0.7** stable.

This is a bugfix-heavy release &mdash; as Leaflet becomes more and more stable feature-wise, the focus shifts towards stability, usability and API improvements over new features. I've also been holding back some of the planned deep refactorings (which I'll talk about later in the post) until 0.7 is released, so that the heavy risky stuff is done at the beginning of the release cycle, leaving plenty of room to catch bugs and incompatible changes that can unintentionally break existing apps.

### Joining MapBox

In other news, I [joined the MapBox team full-time](https://www.mapbox.com/blog/vladimir-agafonkin-joins-mapbox/). This is extremely exciting for me, as this was my dream job for quite a while &mdash; [MapBox](https://www.mapbox.com) have changed the world of interactive mapping forever with all their amazing work, having some of the greatest geomapping engineers and designers of the world working together, pushing the boundaries of what's possible and inspiring others every day.

For Leaflet, this can only mean very good things &mdash; much more time on Leaflet development, more enthusiasm, more play, more crazy experiments with maps (like [this one](https://www.mapbox.com/blog/dynamic-hill-shading/)), and lots of learning. I'm now one of the happiest map geeks ever. Stay tuned for tons of awesome!

### 0.7 changes

You can check out the [detailed changelog](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md#07-dev-master) of what's already done over the recent months for 0.7 (about 90 improvements and bugfixes), but I'd like to mention some highlights:

* Added the ability to **upscale tiles** to higher zoom levels (e.g. have zoom 19-20 when the source has 18 max).
* Added support for **IE11 touch devices**. MS unexpectedly broke their pointer API compatibility between Developer Preview and final IE11 release, and we eventually rewrote quite a bit of code to make everything work smoothly across all IE versions (both dekstop & mobile), fixing a bunch of IE10 bugs along the way as well.
* Officially **dropped IE6 support** (nobody cares anyway) and cleaned up/fixed IE7-8 styles.
* Dropped the need for **IE conditional comment** when including Leaflet, making the snippet much simpler &mdash; all IE7/8-specific styles got simplified and moved to the main `leaflet.css` file.
* Fixed an **obscure iOS7 memory leak** that crashed Safari when you tried to create several thousands of layers (e.g. markers for clustering). I still don't understand why it happens, but we managed to fix it with a bit of trickery.
* Fixed a critical **Chrome for Android** bug that made the tiles disappear after zooming on some devices.
* Removed some **Earth-related hardcode** in TileLayer implementation to make it easier for plugins like Proj4Leaflet to handle complex projections without horrible hacks. Some other work in this direction to follow in 0.8.
* Improved **panning performance** on complex pages with significant number of elements &mdash; we found out that simple things like setting a different cursor to `document` (for a "grabbing" hand) caused noticeable performance hit on some browsers (Chrome in particular).
* **Changed the way maxBounds works**, not enforcing a derived `minZoom` from it but restricting panning across lower zoom levels, along with some tricks to make it play better with panning inertia or offset zooming, etc.

### Plans for 0.8

There are several big undertakings in refactoring Leaflet that I'd want to switch to immediately after releasing 0.7 &mdash; I've been holding them off for too long, and they'll be extremely beneficial for plugin and Leaflet-based API authors. Some of them are already in progress.

* Refactoring the **layers** architecture. Currently there's a lot of duplication of logic across implementation of different layers (map, markers, vector layers, etc.), specifically event handling, zoom animation logic, zIndex and pane handling (what appears on top of what etc.). Making the code consistent, more universal and shared across different layers will make it much easier to customize layers and make your own (e.g. integrate d3, etc.)
* Splitting the huge TileLayer implementation into **GridLayer and TileLayer**, separating image tiles-related logic and grid-logic that will make other grid-like layer implementations (e.g. UTFGrid interaction or tiled GeoJSON) much simpler.
* Refactoring **zoom animation logic** to make the long-awaited Easey-style animations (zoom-panning between points) possible.
* Refactoring **projections** code to make it easier to set up flat maps and weird projections and customize how Leaflet handles them.
* Refactoring the **vector layers** code to make it possible to use different rendering backends (Canvas, SVG, etc.) for different layers on the same map and switch between them easily. This will also open it up for interesting extensions, like indexing layers with [RBush](https://github.com/mourner/rbush) for fast interaction features.

While it's an ambitious plan and it may take more than one stable release, finishing all those refactorings will mean that Leaflet is getting ready for a 1.0 release.

Another direction I'd like to focus on after releasing 0.7 is **website and documentation improvements**. First, Leaflet is begging for **more step-by-step tutorials** (with more advanced features like custom layers, custom controls, etc.), and I'd love to do a docs/tutorials sprint some time in future. Second, the presentation could be significantly improved &mdash; adding a prominent visual **showcase** or app gallery, making Leaflet users more prominent with some logos and quotes/testimonials, and updating the layout/design for a more stylish, clean look, etc.

Hope that gives a good glimpse of the stuff to expect from Leafet in near future, and don't hesitate to ask any questions in comments &mdash; I'll be happy to answer!

Grab the CDN links or downloads for the new release on the [download page](../../../download.html) as always. Be sure to try it out on your apps and report any regressions so that we can patch them up immediately. And lets make some nice Twitter buzz about the release as usual!

To all the people wo've been involved in Leaflet contributions, bug reports, mailing list, Twitter buzz, making awesome apps and spreading the word about Leaflet &mdash; thank you! You are the most awesome community ever.

Cheers,<br />
Vladimir.

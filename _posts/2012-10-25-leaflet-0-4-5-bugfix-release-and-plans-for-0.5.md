---
layout: post
title: Leaflet 0.4.5 Bugfix Release and Plans for 0.5
description: Leaflet 0.4.5 released, containing a small but important zoom animation bugfix for upcoming Chrome 23+ (currently beta) and IE10. Work on future 0.5 release goes on!
author: Vladimir Agafonkin
authorsite: http://agafonkin.com/en
---

### 0.4.5 release

While we contrinue working on the next major release (0.5), today we decided to release **Leaflet 0.4.5**. It contains only one small but important bugfix for **wonky zoom animation** on upcoming **Chrome 23** (currently in beta and to be released in a couple of weeks) and **Internet Explorer 10** (that will eventually hit Windows 7 in addition to Windows 8).

Everyone is encouraged to upgrade (before Chrome 23 turns stable). As always, you can find CDN links and downloads for the new release on the [download page](../../../download.html).

### Plans for 0.5

As Leaflet approaches feature-complete state and API stabilization, we naturally shift our focus from new features towards performance and usability improvements, better browser and device support, bugfixes and internal refactoring to make certain parts of Leaflet (like projections and vector rendering) easier to extend and customize for plugin developers and advanced users.

Highlights of things already implemented in the `master` branch include touch interaction support for **IE10 touch devices and Metro apps** and a more smooth and responsive panning inertia. Follow the [full changelog](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md) for more details.

We're also in the process of a major refactoring of vector rendering code to allow much simpler extension of base functionality with custom shapes, additional rendering systems (like WebGL in addition to existing SVG/VML and Canvas renderers), easy switching between renderers, also making the code simpler and easier to understand.

The same goes for projection-related code to make using Leaflet with non-standard projections easier, inluding plain projections for game and indoor maps. Thanks to these changes, in addition to making advanced GIS folks happier, we'll see much more awesome Leaflet projects like [interactive Skyrim map on IGN](http://www.ign.com/wikis/the-elder-scrolls-5-skyrim/interactive-maps/Skyrim) or [World of Warcraft map on Wowhead](http://www.wowhead.com/map).

Another important task for upcoming weeks is working more closely with plugin developers. In particular, one of the areas of focus will be the [Leaflet.draw](https://github.com/jacobtoye/Leaflet.draw) plugin that will soon become a state-of-the-art map vector drawing/editing solution, just as Dave's [Leaflet.markercluster](https://github.com/danzel/Leaflet.markercluster) became the best marker clustering solution among all mapping platforms out there.

The current plan is to release 0.5 stable sometime in mid-November. Stay tuned!

### Contributing to Leaflet

Leaflet is a true open source project, so we're always happy to meet new contributors, accept patches and bugreports. To help others become involved with Leaflet development and make managing contributions easier, I've put up a [Contributing to Leaflet](https://github.com/Leaflet/Leaflet/blob/master/CONTRIBUTING.md) guide with best practices and advices &mdash; check it out!

Thanks to everyone! Leaflet has got quite an amazing community which makes me really proud. Keep it up!

Cheers,<br />
Vladimir, Leaflet author and maintainer.

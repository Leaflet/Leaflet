---
layout: default
title: Download
---

### Download Leaflet

Besides the library itself, the download package contains full source
code, unit tests, files for debugging and a build system. The production
files (included the same way as in the code above) are in the `dist`
folder.

[Download Leaflet 0.3.1 stable](https://github.com/CloudMade/Leaflet/zipball/v0.3.1) (February 14, 2012)<br />
[Download Leaflet 0.4 master](http://github.com/CloudMade/Leaflet/zipball/master) (in-progress version)

[View Changelog](https://github.com/CloudMade/Leaflet/blob/master/CHANGELOG.md)

### Using a Hosted Version of Leaflet

The latest stable release of Leaflet is hosted on a CDN — to start using
it straight away, place this code in the `head` section of your HTML:

    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.3.1/leaflet.css" />
    <!--[if lte IE 8]>
        <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.3.1/leaflet.ie.css" />
    <![endif]-->

    <script src="http://cdn.leafletjs.com/leaflet-0.3.1/leaflet.js"></script>

### Building a Custom Version of Leaflet

Open `build/build.html` page from the download package, check the
components you want to see in your build and then follow the
instructions there.

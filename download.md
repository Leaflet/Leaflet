---
layout: default
title: Download
---

## Download Leaflet

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

### Building Leaflet from the Source

Leaflet build system is powered by the [Node.js](http://nodejs.org) platform and Jake, JSHint and UglifyJS libraries, which install easily and work well across all major platforms. Here are the steps to install it:

 1. [Download and install Node](http://nodejs.org)
 2. Run the following commands in the command line:

	<pre><code class="no-highlight">npm install -g jake
npm install jshint
npm install uglify-js
</code></pre>

Now that you have everything installed, run `jake` inside the Leaflet directory. This will check Leaflet source files for JavaScript errors and inconsistencies, and then combine and compress it to the `dist` folder.

### Building a Custom Version of Leaflet

To make a custom build of the library with only the things you need, open `build/build.html` page of the package contents, choose the components (it figures out dependencies for you) and then run the command generated with it.

---
layout: default
title: Download
---

## Download Leaflet

Besides the library itself, the download package contains full source code, unit tests, files for debugging and a build system. The production files are in the `dist` folder.

<table>
	<tr>
		<th>Version</th>
		<th>Description</th>
	</tr>
	<tr>
		<td class="width100"><a href="https://github.com/Leaflet/Leaflet/archive/v0.6.2.zip">Leaflet 0.6.2</a></td>
		<td>Stable version, released on June 26, 2013 and last updated on June 28, 2013</td>
	</tr>
	<tr>
		<td class="width100"><a href="https://github.com/Leaflet/Leaflet/archive/v0.5.1.zip">Leaflet 0.5.1</a></td>
		<td>Previous stable version, released on January 17, 2013 and last updated on February 6, 2013</td>
	</tr>
	<tr>
		<td><a href="http://github.com/Leaflet/Leaflet/archive/master.zip">Leaflet master</a></td>
		<td>In-progress version, developed on the <code>master</code> branch</td>
	</tr>
</table>

[View Changelog](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md)

Note that the master version can contain incompatible changes, so please read the changelog carefully when upgrading to it.

### Using a Hosted Version of Leaflet

The latest stable release of Leaflet is hosted on a CDN — to start using
it straight away, place this code in the `head` section of your HTML:

    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.6.2/leaflet.css" />
    <!--[if lte IE 8]>
        <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.6.2/leaflet.ie.css" />
    <![endif]-->

    <script src="http://cdn.leafletjs.com/leaflet-0.6.2/leaflet.js"></script>

### Building Leaflet from the Source

Leaflet build system is powered by the [Node.js](http://nodejs.org) platform and Jake, JSHint and UglifyJS libraries, which install easily and work well across all major platforms. Here are the steps to install it:

 1. [Download and install Node](http://nodejs.org)
 2. Run the following commands in the command line:

 <pre><code class="no-highlight">npm install -g jake
npm install</code></pre>

Now that you have everything installed, run `jake` inside the Leaflet directory. This will check Leaflet source files for JavaScript errors and inconsistencies, and then combine and compress it to the `dist` folder.

### Building a Custom Version of Leaflet

To make a custom build of the library with only the things you need, open `build/build.html` page of the package contents, choose the components (it figures out dependencies for you) and then run the command generated with it.

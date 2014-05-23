---
layout: default
title: Download
---

## Download Leaflet

<table>
	<tr>
		<th>Version</th>
		<th>Description</th>
	</tr>
	<tr>
		<td class="width100"><a href="http://leaflet-cdn.s3.amazonaws.com/build/leaflet-0.7.3.zip">Leaflet 0.7.3</a></td>
		<td>Stable version, released on November 18, 2013 and last updated on May 23, 2014.</td>
	</tr>
	<tr>
		<td class="width100"><a href="http://leaflet-cdn.s3.amazonaws.com/build/leaflet-0.6.4.zip">Leaflet 0.6.4</a></td>
		<td>Previous stable version, released on June 26, 2013 and last updated on July 25, 2013.</td>
	</tr>
	<tr>
		<td><a href="http://leaflet-cdn.s3.amazonaws.com/build/leaflet-master.zip">Leaflet 0.8-dev</a></td>
		<td>In-progress version, developed on the <code>master</code> branch.</td>
	</tr>
</table>

[View Changelog](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md)

Note that the master version can contain incompatible changes,
so please read the changelog carefully when upgrading to it.

### Using a Hosted Version of Leaflet

The latest stable Leaflet release is hosted on a CDN &mdash; to start using
it straight away, place this in the `head` of your HTML code:

    <link rel="stylesheet" href="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.css" />
    <script src="http://cdn.leafletjs.com/leaflet-0.7.3/leaflet.js"></script>

### Leaflet Source Code

These download packages above only contain the library itself.
If you want to download the full source code, including unit tests, files for debugging, build scripts, etc.,
you can <a href="https://github.com/Leaflet/Leaflet/releases">download it</a>
from the <a href="https://github.com/Leaflet/Leaflet">GitHub repository</a>.

### Building Leaflet from the Source

Leaflet build system is powered by the [Node.js](http://nodejs.org) platform,
which installs easily and works well across all major platforms.
Here are the steps to set it up:

 1. [Download and install Node](http://nodejs.org)
 2. Run the following commands in the command line:

 <pre><code class="no-highlight">npm install -g jake
npm install</code></pre>

Now that you have everything installed, run `jake build` inside the Leaflet directory.
This will combine and compress the Leaflet source files, saving the build to the `dist` folder.

### Building a Custom Version of Leaflet

To make a custom build of the library with only the things you need,
open `build/build.html` page of the Leaflet source code contents, choose the components
(it figures out dependencies for you) and then run the command generated with it.

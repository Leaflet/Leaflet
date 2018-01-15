---
layout: v2
title: Download
bodyclass: download-page
---

## Download Leaflet

<table>
	<tr>
		<th>Version</th>
		<th>Description</th>
	</tr>
	<tr>
		<td><a href="http://cdn.leafletjs.com/leaflet/v1.3.0/leaflet.zip">Leaflet 1.3.0</a></td>
		<td>Stable version, released on January 15, 2018.</td>
	</tr>
	<tr>
		<td><a href="https://leafletjs-cdn.s3.amazonaws.com/content/leaflet/master/leaflet.zip">Leaflet 1.3-dev</a></td>
		<td>In-progress version, developed on the <code>master</code> branch.</td>
	</tr>
	<tr>
		<td class="width100"><a href="http://cdn.leafletjs.com/leaflet/v0.7.7/leaflet.zip">Leaflet 0.7.7</a></td>
		<td>Legacy version, released on November 18, 2013 and last updated on October 26, 2015.</td>
	</tr>
</table>

[View Changelog](https://github.com/Leaflet/Leaflet/blob/master/CHANGELOG.md)

Note that the master version can contain incompatible changes,
so please read the changelog carefully when upgrading to it.

### Using a Hosted Version of Leaflet

The latest stable Leaflet release is available on several CDN's &mdash; to start using
it straight away, place this in the `head` of your HTML code:

    <link rel="stylesheet" href="https://unpkg.com/leaflet@{{ site.latest_leaflet_version}}/dist/leaflet.css" />
    <script src="https://unpkg.com/leaflet@{{ site.latest_leaflet_version}}/dist/leaflet.js"></script>

To avoid potential security problems, we recommend and encourage enabling
[subresource integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity)
when using Leaflet from a CDN:

    <link rel="stylesheet" href="https://unpkg.com/leaflet@{{ site.latest_leaflet_version}}/dist/leaflet.css"
      integrity="{{site.integrity_hash_css}}"
      crossorigin=""/>
    <script src="https://unpkg.com/leaflet@{{ site.latest_leaflet_version}}/dist/leaflet.js"
      integrity="{{site.integrity_hash_uglified}}"
      crossorigin=""></script>

Leaflet is available on the following free CDN's:  [unpkg](https://unpkg.com/leaflet/dist/), [cdnjs](https://cdnjs.com/libraries/leaflet), [jsDelivr](https://www.jsdelivr.com/package/npm/leaflet?path=dist)

_Disclaimer: these services are external to Leaflet; for questions or support, please contact them directly._

### Using a Downloaded Version of Leaflet

Inside the archives downloaded from the above links, you will see four things:

- `leaflet.js` - This is the minified Leaflet JavaScript code.
- `leaflet-src.js` - This is the readable, unminified Leaflet JavaScript, which is sometimes helpful for debugging. <small>(The integrity hash for this file is <nobr><tt>{{site.integrity_hash_source}}</tt></nobr>)</small>
- `leaflet.css` - This is the stylesheet for Leaflet.
- `images` - This is a folder that contains images referenced by `leaflet.css`. It must be in the same directory as `leaflet.css`.

Unzip the downloaded archive to your website's directory and add this to the `head` of your HTML code:

    <link rel="stylesheet" href="/path/to/leaflet.css" />
    <script src="/path/to/leaflet.js"></script>

### Using a JavaScript package manager

If you use the [`npm` package manager](https://www.npmjs.com/), you can fetch a local copy of Leaflet by running:

    npm install leaflet

You will find a copy of the Leaflet release files in `node_modules/leaflet/dist`.

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
 <pre><code>npm install</code></pre>

Now that you have everything installed, from inside the Leaflet directory, run:
<pre><code>npm run build</code></pre>
This will combine and compress the Leaflet source files, saving the build to the `dist` folder.


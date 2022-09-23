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
		<td><a href="https://leafletjs-cdn.s3.amazonaws.com/content/leaflet/v1.9.1/leaflet.zip">Leaflet 1.9.1</a></td>
		<td>Stable version, released on September 23, 2022.</td>
	</tr>
	<tr>
		<td><a href="https://leafletjs-cdn.s3.amazonaws.com/content/leaflet/v1.8.0/leaflet.zip">Leaflet 1.8.0</a></td>
		<td>Previous stable version, released on April 18, 2022.</td>
	</tr>
	<tr>
		<td><a href="https://leafletjs-cdn.s3.amazonaws.com/content/leaflet/main/leaflet.zip">Leaflet 2.0-dev</a></td>
		<td>In-progress version, developed on the <code>main</code> branch.</td>
	</tr>
</table>

[View Changelog](https://github.com/Leaflet/Leaflet/blob/main/CHANGELOG.md)

Note that the main version can contain incompatible changes,
so please read the changelog carefully when upgrading to it.

### Using a Hosted Version of Leaflet

The latest stable Leaflet release is available on several CDN's &mdash; to start using
it straight away, place this in the `head` of your HTML code:

    <link rel="stylesheet" href="https://unpkg.com/leaflet@{{ site.latest_leaflet_version}}/dist/leaflet.css" integrity="{{site.integrity_hash_css}}" crossorigin="" />
    <script src="https://unpkg.com/leaflet@{{ site.latest_leaflet_version}}/dist/leaflet.js" integrity="{{site.integrity_hash_uglified}}" crossorigin=""></script>

Note that the [`integrity` hashes](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) are included for security when using Leaflet from CDN.

Leaflet is available on the following free CDNs: [unpkg](https://unpkg.com/leaflet/dist/), [cdnjs](https://cdnjs.com/libraries/leaflet), [jsDelivr](https://www.jsdelivr.com/package/npm/leaflet?path=dist).

_Disclaimer: these services are external to Leaflet; for questions or support, please contact them directly._

### Using a Downloaded Version of Leaflet

Inside the archives downloaded from the above links, you will see four things:

- `leaflet.js` - This is the minified Leaflet JavaScript code.
- `leaflet-src.js` - This is the readable, unminified Leaflet JavaScript, which is sometimes helpful for debugging. <small>(integrity="<nobr><tt>{{site.integrity_hash_source}}</tt></nobr>")</small>
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
 2. Run the following command in the command line:

 <pre><code>npm install</code></pre>

Now that you have everything installed, run `npm run build` inside the Leaflet directory.
This will combine and compress the Leaflet source files, saving the build to the `dist` folder.


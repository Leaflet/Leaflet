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
		<td><a href="https://leafletjs-cdn.s3.amazonaws.com/content/leaflet/v1.9.4/leaflet.zip">Leaflet 1.9.4</a></td>
		<td>Stable version, released on May 18, 2023.</td>
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

The latest stable Leaflet release is available on several CDNs. To start using it with an [importmap](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap), place the following in the `head` of your HTML code:

```html
<link rel="stylesheet" href="https://unpkg.com/leaflet@{{ site.latest_leaflet_version }}/dist/leaflet.css" integrity="{{site.integrity_hash_css}}" crossorigin="anonymous" />

<script type="importmap">
{
	"imports": {
		"leaflet": "https://unpkg.com/leaflet@{{ site.latest_leaflet_version }}/dist/leaflet.js"
	},
	"integrity": {
		"https://unpkg.com/leaflet@{{ site.latest_leaflet_version }}/dist/leaflet.js": "{{site.integrity_hash_uglified}}"
	}
}
</script>
```

A [**`importmap`**](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/script/type/importmap) allows defining module specifiers (`import` paths) in the browser without relying on a bundler. It enables the use of named imports directly from a CDN or local files, making module resolution more flexible and readable.


Then, in your script, import the needed Leaflet Classes as follows:

```js
<script type="module">
	import {Map, TileLayer} from 'leaflet';

	const map = new Map('map').setView([51.505, -0.09], 13);
	
	new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19,
		attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
	}).addTo(map);
</script>
```
#### Including Leaflet with a Global Scope

The old (and no longer recommended) way to include Leaflet in your project without using modules is by relying on the global variable `L`.

```html
<script src="https://unpkg.com/leaflet@{{ site.latest_leaflet_version}}/dist/leaflet-global.js" integrity="{{site.integrity_hash_global_uglified}}" crossorigin=""></script>
```

Note that the [`integrity` hashes](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) are included for security when using Leaflet from a CDN.

Leaflet is available on the following free CDNs: [unpkg](https://unpkg.com/leaflet/dist/), [cdnjs](https://cdnjs.com/libraries/leaflet), [jsDelivr](https://www.jsdelivr.com/package/npm/leaflet?path=dist).

_Disclaimer: These services are external to Leaflet; for questions or support, please contact them directly._

### Using a Downloaded Version of Leaflet

Inside the archives downloaded from the above links, you will see four things:

- `leaflet.js` - This is the minified Leaflet JavaScript code.
- `leaflet.js.map` - This is a source map file for `leaflet.js`, allowing browser developer tools to map minified code back to the original source for easier debugging.
- `leaflet-src.js` - This is the readable, unminified Leaflet JavaScript, which is sometimes helpful for debugging. <small>(integrity="<nobr><tt>{{site.integrity_hash_source}}</tt></nobr>")</small>
- `leaflet-src.js.map` - This is a source map file for `leaflet-src.js`, providing debugging support for the unminified version of Leaflet.
- `leaflet.css` - This is the stylesheet for Leaflet.
- `images` - This is a folder that contains images referenced by `leaflet.css`. It must be in the same directory as `leaflet.css`.

Unzip the downloaded archive to your website's directory and add this to the `head` of your HTML code:

```html
<link rel="stylesheet" href="/path/to/leaflet.css" />
<script type="importmap">
{
  "imports": {
    "leaflet": "/path/to/leaflet.js"
  }
}
</script>
```

Then, import Leaflet in your JavaScript file:

```js
import {Map, TileLayer} from 'leaflet';

const map = new Map('map').setView([51.505, -0.09], 13);

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

### Using a JavaScript Package Manager

If you use the [`npm` package manager](https://www.npmjs.com/), you can fetch a local copy of Leaflet by running:

```sh
npm install leaflet
```

Then, import Leaflet in your JavaScript file:

```js
import {Map, TileLayer} from 'leaflet';

const map = new Map('map').setView([51.505, -0.09], 13);

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

You will find a copy of the Leaflet release files in `node_modules/leaflet/dist`.

### Leaflet Source Code

These download packages above only contain the library itself.
If you want to download the full source code, including unit tests, files for debugging, build scripts, etc.,
you can <a href="https://github.com/Leaflet/Leaflet/releases">download it</a>
from the <a href="https://github.com/Leaflet/Leaflet">GitHub repository</a>.

### Building Leaflet from the Source

Leaflet's build system is powered by the [Node.js](http://nodejs.org) platform,
which installs easily and works well across all major platforms.
Here are the steps to set it up:

1. [Download and install Node](http://nodejs.org)
2. Run the following command in the command line:

```sh
npm install
```

Now that you have everything installed, run `npm run build` inside the Leaflet directory.
This will combine and compress the Leaflet source files, saving the build to the `dist` folder.

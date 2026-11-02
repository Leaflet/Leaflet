---
layout: v2
title: Install
bodyclass: download-page
---

## Install Leaflet

Leaflet {{ site.latest_leaflet_version }} is a beta of Leaflet 2.0, a modern rewrite with ES modules and classes. See the
[changelog](https://github.com/Leaflet/Leaflet/blob/main/CHANGELOG.md) for what's new, and the
[migration guide](https://github.com/Leaflet/Leaflet/blob/main/MIGRATION.md) if you're upgrading from 1.x. To stay on
1.x, for example because your app relies on plugins that don't support 2.0 yet, use [Leaflet 1.9.4](#leaflet-19).

### Using npm

If you build your app with a bundler such as [Vite](https://vite.dev/), install Leaflet from npm:

```sh
npm install leaflet@beta
```

Then import the classes you need and Leaflet's CSS:

```js
import {LeafletMap, TileLayer} from 'leaflet';
import 'leaflet/styles.css';

const map = new LeafletMap('map').setView([51.505, -0.09], 13);

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);
```

The package includes TypeScript types, so you don't need a separate `@types` package.

### Using a CDN

Without a build step, load Leaflet from a CDN with an
[import map](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/script/type/importmap), which tells
the browser where `'leaflet'` imports come from. Put this in the `head` of your page:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@{{ site.latest_leaflet_version }}/dist/leaflet.css"
	integrity="{{ site.integrity_hash_css }}" crossorigin="anonymous">
<script type="importmap">
{
	"imports": {
		"leaflet": "https://cdn.jsdelivr.net/npm/leaflet@{{ site.latest_leaflet_version }}/dist/leaflet.js"
	},
	"integrity": {
		"https://cdn.jsdelivr.net/npm/leaflet@{{ site.latest_leaflet_version }}/dist/leaflet.js": "{{ site.integrity_hash_uglified }}"
	}
}
</script>
```

Then import Leaflet in a module script, the same way as with npm:

```html
<script type="module">
	import {LeafletMap, TileLayer} from 'leaflet';

	const map = new LeafletMap('map').setView([51.505, -0.09], 13);
</script>
```

The [`integrity` hashes](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) make sure the
files you get from the CDN are exactly the ones we published, so keep them when you copy the snippets. Leaflet is also
on [unpkg](https://unpkg.com/leaflet@{{ site.latest_leaflet_version }}/dist/) and
[cdnjs](https://cdnjs.com/libraries/leaflet).

_These services are external to Leaflet; for questions or support, please contact them directly._

#### As a classic script

If you can't use modules, `leaflet-global.js` is a classic script that puts all of Leaflet in the global `L` variable
(`new L.LeafletMap(...)`):

```html
<script src="https://cdn.jsdelivr.net/npm/leaflet@{{ site.latest_leaflet_version }}/dist/leaflet-global.js"
	integrity="{{ site.integrity_hash_global_uglified }}" crossorigin="anonymous"></script>
```

### Downloading

To host Leaflet yourself, download
[leaflet.zip](https://github.com/Leaflet/Leaflet/releases/download/v{{ site.latest_leaflet_version }}/leaflet.zip) from the
[release page](https://github.com/Leaflet/Leaflet/releases/tag/v{{ site.latest_leaflet_version }}). It has:

- `leaflet.js`: Leaflet as an ES module, minified.
- `leaflet-global.js`: the same as a classic script that defines the global `L`.
- `leaflet.css`: the stylesheet. It has no images to copy along with it.
- `.map` source maps for both scripts, so browser developer tools show the original source when debugging.

Put the files on your site and point the import map at them:

```html
<link rel="stylesheet" href="/path/to/leaflet.css">
<script type="importmap">
{
	"imports": {
		"leaflet": "/path/to/leaflet.js"
	}
}
</script>
```

There's also a [development snapshot](https://github.com/Leaflet/Leaflet/releases/tag/dev) built from the `main`
branch, which can have unreleased and breaking changes.

### Leaflet 1.9

Leaflet 1.9.4 is the last 1.x release, and `npm install leaflet` installs it until 2.0.0 is out. Use it for code
written for 1.x and for plugins that don't support 2.0 yet. Download
[leaflet.zip](https://github.com/Leaflet/Leaflet/releases/download/v1.9.4/leaflet.zip), or load it from a CDN:

```html
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.css"
	integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="anonymous">
<script src="https://cdn.jsdelivr.net/npm/leaflet@1.9.4/dist/leaflet.js"
	integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin="anonymous"></script>
```

See the [1.9.4 API reference](reference-versions.html) for its docs.

### Building from source

To build Leaflet yourself, clone the [repository](https://github.com/Leaflet/Leaflet), then install
[Node.js](https://nodejs.org/) and run:

```sh
npm install
npm run build
```

The build goes to the `dist` folder.

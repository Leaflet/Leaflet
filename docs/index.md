---
layout: v2
---

<div class="announcement">Nov 6, 2026 — Leaflet 2.0 beta 2 is out! See <a href="https://github.com/Leaflet/Leaflet/releases">what's new in the 2.0 betas</a> and <a href="https://github.com/Leaflet/Leaflet/blob/main/MIGRATION.md">how to migrate from 1.x</a>.</div>

Leaflet is the leading open-source JavaScript library for building powerful interactive maps.
Weighing just about <abbr title="40 KB gzipped &mdash; that's 140 KB minified, with 9 KB of CSS (2.4 KB gzipped).">40 KB of JS</abbr>,
it&nbsp;has all the mapping [features](#features) most developers ever need.

Leaflet is designed with *simplicity*, *performance* and *usability* in mind.
It works efficiently across all major desktop and mobile platforms,
can be extended with lots of [plugins](plugins.html),
has a beautiful, easy to use and [well-documented API](reference.html "Leaflet API reference")
and a simple, readable&nbsp;[source code](https://github.com/Leaflet/Leaflet "Leaflet source code repository on GitHub") that is a&nbsp;joy to
[contribute](https://github.com/Leaflet/Leaflet/blob/main/CONTRIBUTING.md "A guide to contributing to Leaflet") to.
It powers maps on millions of websites, with over 10 million npm downloads a week.

<div id="map" class="map map-home"></div>

Here we create a map in the `'map'` div, add <abbr title="Here we use OpenStreetMap tiles, but Leaflet doesn't force you to &mdash; use whatever works for you, it's open source!">tiles of our choice</abbr>, and then add a marker with some text in a popup:

{% capture code %}import {LeafletMap, TileLayer, Marker} from 'leaflet';

const map = new LeafletMap('map').setView([51.505, -0.159], 15);

new TileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
}).addTo(map);

new Marker([51.504, -0.159]).addTo(map)
    .bindPopup('A pretty CSS popup.<br>Easily customizable.')
    .openPopup();{% endcapture %}
<pre class="basic-code javascript"><code>{{ code | escape }}</code></pre>

Learn more with the [quick start guide](examples/quick-start/), check out [other tutorials](examples.html),
or head straight to the [API documentation](reference.html).
If you have any questions, take a look at the [FAQ](https://github.com/Leaflet/Leaflet/blob/main/FAQ.md) first.


## Features

Leaflet doesn't try to do everything for everyone. Instead it focuses on making *the basic things work perfectly*.

<div class="features clearfix">
<div class="no-break">

### Layers

- Tile layers and WMS
- Markers, popups and tooltips
- Polylines, polygons, circles <span class="quiet">and rectangles</span>
- GeoJSON
- Image, video and SVG overlays

</div>
<div class="no-break">

### Interaction

- Panning with inertia
- Zoom with the wheel, pinch, double tap <span class="quiet">or shift-drag</span>
- Same behavior for mouse, touch and pen
- Draggable markers
- Events <span class="quiet">on the map and every layer</span>

</div>
<div class="no-break">

### Rendering

- GPU-accelerated zoom and pan animations
- SVG or Canvas vectors, <span class="quiet">clipped and simplified on the fly</span>
- Sharp on high-DPI screens
- Fractional zoom levels
- Follows the size of its container

</div>
<div class="no-break">

### Customization

- Plain CSS <span class="quiet">for easy restyling</span>
- Image- and HTML-based markers
- Custom layers and controls <span class="quiet">by extending standard JS classes</span>
- Custom projections <span class="quiet">(with `EPSG:3857/4326/3395` built in)</span>
- Non-geographical maps <span class="quiet">for floor plans, game maps and images</span>

</div>
<div class="no-break">

### Accessibility

- Keyboard navigation <span class="quiet">of the map, markers and controls</span>
- Labeled controls and alt text <span class="quiet">for screen readers</span>

</div>
<div class="no-break">

### Controls

- Zoom buttons
- Attribution
- Layer switcher
- Scale

</div>
<div class="no-break">

### For Developers

- Tree-shakable ES modules
- TypeScript types included
- No dependencies
- All modern browsers <span class="quiet">and devices</span>

</div>
</div>

If you find some feature really missing in Leaflet, first check if there's a [plugin for it](plugins.html)
and if it's been discussed before already on [GitHub issues](https://github.com/Leaflet/Leaflet/issues).
If not, please open a new GitHub issue.

## Getting Involved

Let's create the best mapping library in the world!
Leaflet was originally created by [Volodymyr Agafonkin](https://agafonkin.com),
but is now developed by a big community of [contributors](https://github.com/Leaflet/Leaflet/graphs/contributors).
[Pull requests](https://github.com/Leaflet/Leaflet) are always welcome.
However, there are many more ways to get involved with the development of Leaflet.

You can help the project tremendously by discovering and [reporting bugs](https://github.com/Leaflet/Leaflet/blob/main/CONTRIBUTING.md#reporting-bugs), [improving documentation](https://github.com/Leaflet/Leaflet/blob/main/CONTRIBUTING.md#improving-documentation),
helping others in [GitHub Discussions](https://github.com/Leaflet/Leaflet/discussions), [GIS Stack Exchange](https://gis.stackexchange.com/questions/tagged/leaflet)
and [GitHub issues](https://github.com/Leaflet/Leaflet/issues),
following Leaflet on [Mastodon](https://mapstodon.space/@leaflet) or [X](https://twitter.com/LeafletJS)
and spreading the word about Leaflet among your colleagues and friends.

Check out the [contribution guide](https://github.com/Leaflet/Leaflet/blob/main/CONTRIBUTING.md) for more information on getting involved with Leaflet development.

<script type="module">
{{ code }}
</script>

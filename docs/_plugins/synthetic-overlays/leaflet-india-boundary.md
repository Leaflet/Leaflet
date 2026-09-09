---
name: leaflet-india-boundary
category: synthetic-overlays
repo: https://github.com/lux-in-tenebris-lucet/leaflet-india-boundary
author: Abhilaksh Sharma
author-url: https://github.com/lux-in-tenebris-lucet
demo: https://lux-in-tenebris-lucet.github.io/leaflet-india-boundary/
compatible-v0:
compatible-v1: true
compatible-v2: false
---

Draws India's boundary through Jammu & Kashmir, Ladakh and Aksai Chin — the Survey of India depiction — over any basemap. The styling is taken from openstreetmap-carto's own `admin.mss`, including its per-zoom widths and its zoom-4 cutoff, so the line matches the national borders the tiles already draw instead of sitting on top of them.

The practical case is teams building for users in India: OSM renders this region on the "on the ground" principle, so a stock map shows a border those users do not recognise. This is the per-application overlay that commercial providers sell as a "political view", for the free raster tiles most Leaflet apps use, and it gives such a team a reasonable starting point to work from rather than a coordinate list pasted out of an issue thread.

It is deliberately not sold as more than that. The README states the ceiling plainly: the overlay *adds* the claimed boundary but cannot *remove* the line already rendered into raster tiles, and it does nothing about place labels — so it is not a route to matching the official depiction end to end, and anyone needing that is pointed at vector tiles or a provider worldview. Each of the 67 features carries a tag recording whether OpenStreetMap independently corroborates it, and the derivation script is included so the data can be re-checked. The GeoJSON and the style values are also exported without a Leaflet dependency, for MapLibre and OpenLayers users.

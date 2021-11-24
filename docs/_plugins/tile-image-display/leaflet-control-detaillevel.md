---
name: Leaflet.Control.DetailLevel
category: tile-image-display
repo: https://github.com/valkenburg/Leaflet.Control.DetailLevel
author: Wessel Valkenburg
author-url: https://github.com/valkenburg
demo: https://valkenburg.github.io/Leaflet.Control.DetailLevel/demo.html
compatible-v0:
compatible-v1: true
---

Display tiles at higher-than-retina (hdpi) resolutions, by real-time modification of the zoomOffset. Useful for mapping sources which drastically change map style between different zoom levels. Increasing the zoomOffset by too much does slow down the browser, as the number of displayed tiles grows exponentially with the zoomOffset.

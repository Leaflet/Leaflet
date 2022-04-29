---
name: L.DraggableEnhancer
category: events
repo: https://github.com/idawave/Leaflet.DraggableEnhancer
author: Vincent Dechandon
author-url: https://github.com/idawave
demo: 
compatible-v0:
compatible-v1: true
---

Modify the default L.Draggable handler (responsible for map panning, ...) to make it work properly if one of the map container's parents has predefined handlers like "event.stopPropagation()' attached to a "mousemove" event for example.

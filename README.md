Leaflet
=======
Leaflet is a lightweight JavaScript library for map display and interaction by [CloudMade](http://cloudmade.com). It will form the core of CloudMade's next generation JavaScript API.

It is built from the ground up to work well on both desktop and mobile web browsers, utilizing cutting-edge technologies included in HTML5. It's main priorities are usability, performance, [A-grade](http://developer.yahoo.com/yui/articles/gbs/) browser support (up to IE6), flexibility and easy to use API. The OOP-based code of the library is designed to be modular, extensible and very easy to understand and modify.

## Contributing to Leaflet
We really look forward to any help with the development! But first, in order to contribute to Leaflet, you will need to sign a non-exclusive copyright assignment agreement online. We're forced to ask this to ensure that CloudMade can redistribute the library with your contributions in it. Please contact [leaflet@cloudmade.com](mailto:leaflet@cloudmade.com) about this. After signing the agreement, we'll be happy to accept your contributions!

## What's left to do for initial version

Interaction:
 - mouse wheel zoom
 - shift-drag zoom
 - double tap on iOS

Overlays:
 - markers
 - info window
 - vectors (polyline, polygon)
 - vector editing
 - image overlays
 
Overlay formats:
 - KML
 - GeoRSS
 - GeoJSON

Controls:
 - control infrastructure (smart positioning)
 - copyright control
 - basic zoom control
 - zoom slider

Core:
 - ÑSS transitions with timer-based fallback
 
Visual appearance:
 - panning animation
 - zooming animation
 - show scaled background until tiles are loaded
 - tiles fade-in animation?
 - spiral tile loading
 
Misc:
 - map mouseover/mouseout/mousemove events

Browser issues:
 - alpha-transparent tiles on IE
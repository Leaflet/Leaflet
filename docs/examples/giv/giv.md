---
layout: tutorial_v2
title: GeoImageViewer
---


## Viewer for geoaligned photographs. 

View any photograph together 
with a mapview of the same
location. Both are linked so that points clicked in 
the map will be marked in the image and vice-versa.
Other features like GPS-tracks or the horizon can also be 
displayed in a linked fashion. Linking is provided
and calculated in realtime via 3d-elevation data or depthmaps.

Images must be aligned which includes camera calibration, and precise knowledge of
orientation and location. The program includes tools to determine
these values, allowing location of features within few pixels error.


* [Screenshots and usage information](https://hdersch.github.io/Viewing.html).
* [Demo installation with examples of geoaligned images](https://hdersch.github.io/app/main.html)..
* [How to prepare and view your own images](https://hdersch.github.io/Editing.html).
* [Github project](https://github.com/hdersch/hdersch.github.io).

GeoImageViewer uses the opensource [Leaflet-library](https://leafletjs.com/) as mapview, and free 
3d-data from [SRTM](https://eospso.nasa.gov/missions/shuttle-radar-topography-mission) or derived data. 
It can be installed
locally to run completely offline on most HTML-browsers and on almost
any platform.

GeoImageViewer is published under the terms of the
GNU General Public License.

Helmut Dersch der(at)hs-furtwangen.de March 2021



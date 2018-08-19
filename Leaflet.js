function main() {
  
  // Create the map, center it somewhere.
  var map = new L.map('map', {
    center: [48.1667, -100.1667],
    zoom: 7 ,
    minZoom: 1,
    maxZoom: 10,
    maxBounds: new L.LatLngBounds(
      new L.LatLng(-90, -180),
      new L.LatLng(90, 180)
    )
  });
  
  // Open streetmap tiles [zoom 0..10][Entire planet]
  var map_osm_tiles = L.tileLayer("http://{s}.tile.osm.org/{z}/{x}/{y}.png", {
    minZoom: 0,
    maxZoom: 10,
    zIndex: 2,
    attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    bounds: new L.LatLngBounds(
      new L.LatLng(-90, -180),
      new L.LatLng(90, 180))
  });
  
  // Natural earth tiles [zoom 0..5][North America]
  var map_vfr_tiles = L.tileLayer("http://happicow.com/maps/naturalearth/{z}/{x}/{y}.png", {
    minZoom: 0,
    maxZoom: 5,
    zIndex: 3,
    bounds: new L.LatLngBounds(new L.LatLng(0, -180),new L.LatLng(90, 0))
  });
  
  // Add the tiles to the map
  map_vfr_tiles.addTo(map);
  map_osm_tiles.addTo(map);  
  
}

window.onload = main; 

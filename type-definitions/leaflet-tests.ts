/// <reference path='leaflet.d.ts' />

let mapOptions: L.MapOptions = {
    preferCanvas: false,

    attributionControl: true,
    zoomControl: true,

    closePopupOnClick: true,
    zoomSnap: 1,
    zoomDelta: 1,
    trackResize: true,
    boxZoom: true,
    doubleClickZoom: true,
    dragging: true,

    crs: L.CRS.EPSG3857,
    center: L.latLng([51.505, -0.09]),
    zoom: 13,
    minZoom: 3,
    maxZoom: 8,
    layers: [],
    maxBounds: L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]),
    renderer: L.canvas(),

    fadeAnimation: true,
    markerZoomAnimation: true,
    transform3DLimit: 2^23,
    zoomAnimation: true,
    zoomAnimationThreshold: 4,

    inertia: true,
    inertiaDeceleration: 3000,
    inertiaMaxSpeed: Infinity,

    easeLinearity: 0.2,
    worldCopyJump: false,
    maxBoundsViscosity: 0.0,

    keyboard: true,
    keyboardPanDelta: 80,

    scrollWheelZoom: true,
    wheelDebounceTime: 40,
    wheelPxPerZoomLevel: 50,

    tap: true,
    tapTolerance: 15,
    touchZoom: true,
    bounceAtZoomLimits: true,
}

let map = L.map(document.getElementById('map'), mapOptions);
map = L.map('map', mapOptions);
map = new L.Map('map', mapOptions);
map = new L.Map('map', {
    doubleClickZoom: 'center',
    scrollWheelZoom: 'center',
    touchZoom: 'center'
})

map.setView(L.latLng([51.505, -0.09]), 13, { animate: false, duration: 0.25, easeLinearity: 0.25, noMoveStart: false })
   .setView([51.505, -0.09])
   .setView({ lat: 51.505, lng: -0.09 })
   .setZoom(12)
   .zoomIn(2)
   .zoomOut(2)
   .setZoomAround(L.latLng([51.505, -0.09]), 12)
   .setZoomAround([51.505, -0.09], 12)
   .setZoomAround({ lat: 51.505, lng: -0.09 }, 12)
   .fitBounds(L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]))
   .fitBounds([L.latLng(-60, -60), L.latLng(60, 60)])
   .fitBounds([[-60, -60], [60, 60]])
   .fitBounds([{ lat: -60, lng: -60 }, { lat: 60, lng: 60 }])
   .fitWorld()
   .panTo(L.latLng([51.505, -0.09]))
   .panTo([51.505, -0.09])
   .panTo({ lat: 51.505, lng: -0.09 })
   .panBy(L.point([3, 5]))
   .panBy([3, 5])
   .panBy({ x: 3, y: 5 })
   .setMaxBounds(L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]))
   .setMaxBounds([[-60, -60], [60, 60]])
   .setMaxBounds([{ lat: -60, lng: -60 }, { lat: 60, lng: 60 }])
   .setMinZoom(1)
   .setMaxZoom(4)
   .panInsideBounds(L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]))
   .panInsideBounds([[-60, -60], [60, 60]])
   .panInsideBounds([{ lat: -60, lng: -60 }, { lat: 60, lng: 60 }])
   .invalidateSize({ animate: false, duration: 0.25, easeLinearity: 0.25, noMoveStart: false })
   .invalidateSize(false)
   .stop()
   .flyTo(L.latLng([51.505, -0.09]), 12)
   .flyTo([51.505, -0.09])
   .flyTo({ lat: 51.505, lng: -0.09 })
   .flyToBounds(L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]))
   .flyToBounds([[-60, -60], [60, 60]])
   .flyToBounds([{ lat: -60, lng: -60 }, { lat: 60, lng: 60 }])
   .remove();

map.createPane('pane');
map.getPane('pane');
map.getPanes();
map.getContainer();
map.whenReady(map => {}, { a: 1, b: 2 });
map.getCenter();
map.getZoom();
map.getBounds();
map.getMinZoom();
map.getMaxZoom();
map.getBoundsZoom(L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]), false);
map.getBoundsZoom([[-60, -60], [60, 60]]);
map.getBoundsZoom([{ lat: -60, lng: -60 }, { lat: 60, lng: 60 }]);
map.getSize();
map.getPixelBounds();
map.getPixelOrigin();
map.getPixelWorldBounds(2);
map.getZoomScale(1, 2);
map.getScaleZoom(2, 4);
map.project(L.latLng([51.505, -0.09]), 12);
map.unproject(L.point([1, 2]), 12);
map.unproject([1, 2], 12);
map.unproject({ x: 1, y: 2 }, 12);
map.layerPointToLatLng(L.point([1, 2]));
map.layerPointToLatLng([1, 2]);
map.layerPointToLatLng({ x: 1, y: 2 });
map.latLngToLayerPoint(L.latLng([51.505, -0.09]));
map.wrapLatLng(L.latLng([51.505, -0.09]));
map.distance(L.latLng([51.505, -0.09]), L.latLng([51.505, -0.09]));
map.containerPointToLayerPoint(L.point([1, 2]));
map.containerPointToLayerPoint([1, 2]);
map.containerPointToLayerPoint({ x: 1, y: 2 });
map.layerPointToContainerPoint(L.point([1, 2]));
map.layerPointToContainerPoint([1, 2]);
map.layerPointToContainerPoint({ x: 1, y: 2 });
map.containerPointToLatLng(L.point([1, 2]));
map.containerPointToLatLng([1, 2]);
map.containerPointToLatLng({ x: 1, y: 2 });
map.latLngToContainerPoint(L.latLng([51.505, -0.09]));
map.locate({ watch: true, setView: true, maxZoom: 1, timeout: 1000, maximumAge: 0, enableHighAccuracy: true });
map.stopLocate();

let markerOptions: L.MarkerOptions = {
    icon: new L.Icon.Default(),
    interactive: true,
    draggable: false,
    keyboard: true,
    title: '',
    alt: '',
    zIndexOffset: 0,
    opacity: 1,
    riseOnHover: false,
    riseOffset: 250,
    pane: 'markerPane'
}

let marker = L.marker(L.latLng([51.505, -0.09]), markerOptions);
marker = new L.Marker(L.latLng([51.505, -0.09]), markerOptions);
marker = new L.Marker([51.505, -0.09], markerOptions);
marker = new L.Marker({ lat: 51.505, lng: -0.09}, markerOptions);

marker.setLatLng(L.latLng([51.505, -0.09]))
      .setLatLng([51.505, -0.09])
      .setLatLng({ lat: 51.505, lng: -0.09 })
      .setZIndexOffset(100)
      .setIcon(new L.Icon())
      .setOpacity(0.5);

marker.getLatLng();

let popupOptions: L.PopupOptions = {
    maxWidth: 300,
    minWidth: 50,
    maxHeight: 100,
    autoPan: true,
    autoPanPaddingTopLeft: L.point([100, 100]),
    autoPanPaddingBottomRight: L.point([100, 100]),
    autoPanPadding: L.point([100, 100]),
    keepInView: true,
    closeButton: true,
    offset: L.point([100, 100]),
    autoClose: true,
    zoomAnimation: true,
    className: '',
    pane: 'popupPan'
}

let popup = L.popup(popupOptions)
popup = new L.Popup(popupOptions)

popup.setLatLng(L.latLng([51.505, -0.09]))
     .setContent('')
     .setContent(document.getElementById('popup'))
     .setContent(layer => document.getElementById('popup'))
     .bringToFront()
     .bringToBack();

popup.getLatLng();
popup.getElement();
popup.update();
popup.isOpen();

let tileLayerOptions: L.TileLayerOptions = {
    minZoom: 0,
    maxZoom: 18,
    maxNativeZoom: 17,
    subdomains: 'abc',
    errorTileUrl: '',
    zoomOffset: 0,
    tms: false,
    zoomReverse: false,
    detectRetina: false,
    crossOrigin: false
}

let tileLayer = L.tileLayer('', tileLayerOptions);
tileLayer = new L.TileLayer('', tileLayerOptions);
tileLayer = new L.TileLayer('', {
    subdomains: ['a', 'b', 'c']
});

let wmsOptions: L.TileLayer.WMSOptions = {
    layers: 'nexrad-n0r-900913',
    styles: '',
    format: 'image/png',
    transparent: true,
    version: '1.1.1',
    attribution: 'Weather data © 2012 IEM Nexrad',
    crs: L.CRS.EPSG3857,
    uppercase: true
}

let wmsTileLayer = L.tileLayer.wms('', wmsOptions);
wmsTileLayer = new L.TileLayer.WMS('', wmsOptions);

let imageOverlayOptions: L.ImageOverlayOptions = {
    opacity: 1,
    alt: '',
    interactive: false,
    crossOrigin: false
}

let imageOverlay = L.imageOverlay('', L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]), imageOverlayOptions);
imageOverlay = new L.ImageOverlay('', L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]), imageOverlayOptions);
imageOverlay = new L.ImageOverlay('', [[-60, -60], [60, 60]], imageOverlayOptions);
imageOverlay = new L.ImageOverlay('', [{ lat: -60, lng: -60 }, { lat: 60, lng: 60 }], imageOverlayOptions);

imageOverlay.setOpacity(1)
            .bringToFront()
            .bringToBack()
            .setUrl('');

let polylineOptions: L.PolylineOptions = {
    stroke: true,
    color: '#3388ff',
    weight: 3,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: '',
    dashOffset: '',
    fill: false,
    fillColor: '#3388ff',
    fillOpacity: 0.2,
    fillRule: 'evenodd',
    interactive: true,
    smoothFactor: 1.0,
    noClip: true
}

let polyline = L.polyline([L.latLng(-60, -60), L.latLng(60, 60)], polylineOptions);
polyline = L.polyline([L.latLng(-60, -60), L.latLng(60, 60)]);
polyline = new L.Polyline([L.latLng(-60, -60), L.latLng(60, 60)]);
polyline = new L.Polyline([L.latLng(-60, -60), L.latLng(60, 60)], polylineOptions);
polyline = new L.Polyline([[-60, -60], [60, 60]], polylineOptions);
polyline = new L.Polyline([{ lat: -60, lng: -60 }, { lat: 60, lng: 60 }], polylineOptions);

polyline.redraw()
        .setStyle(polylineOptions)
        .bringToFront()
        .bringToBack()
        .setLatLngs([L.latLng(-60, -60), L.latLng(60, 60)])
        .setLatLngs([[-60, -60], [60, 60]])
        .setLatLngs([{ lat: -60, lng: -60 }, { lat: 60, lng: 60 }])
        .addLatLng(L.latLng(-60, -60))
        .addLatLng([-60, -60])
        .addLatLng({ lat: -60, lng: -60 });

polyline.toGeoJSON();
polyline.getLatLngs();
polyline.isEmpty();
polyline.getCenter();
polyline.getBounds();

let polygon = L.polygon([L.latLng(-60, -60), L.latLng(60, 60)], polylineOptions);
polygon = L.polygon([L.latLng(-60, -60), L.latLng(60, 60)]);
polygon = new L.Polygon([L.latLng(-60, -60), L.latLng(60, 60)]);
polygon = new L.Polygon([L.latLng(-60, -60), L.latLng(60, 60)], polylineOptions);
polygon = new L.Polygon([[-60, -60], [60, 60]], polylineOptions);
polygon = new L.Polygon([{ lat: -60, lng: -60 }, { lat: 60, lng: 60 }], polylineOptions);

let rectangle = L.rectangle([L.latLng(-60, -60), L.latLng(60, 60)], polylineOptions);
rectangle = L.rectangle([L.latLng(-60, -60), L.latLng(60, 60)]);
rectangle = new L.Rectangle(L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]));
rectangle = new L.Rectangle(L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]), polylineOptions);
rectangle = new L.Rectangle([L.latLng(-60, -60), L.latLng(60, 60)], polylineOptions);
rectangle = new L.Rectangle([[-60, -60], [60, 60]], polylineOptions);
rectangle = new L.Rectangle([{ lat: -60, lng: -60 }, { lat: 60, lng: 60 }], polylineOptions);

let circleOptions: L.CircleOptions = {
    stroke: true,
    color: '#3388ff',
    weight: 3,
    opacity: 1,
    lineCap: 'round',
    lineJoin: 'round',
    dashArray: '',
    dashOffset: '',
    fill: false,
    fillColor: '#3388ff',
    fillOpacity: 0.2,
    fillRule: 'evenodd',
    interactive: true,
    radius: 10
}

let circle = L.circle(L.latLng([51.505, -0.09]), circleOptions);
circle = L.circle(L.latLng([51.505, -0.09]));
circle = new L.Circle(L.latLng([51.505, -0.09]));
circle = new L.Circle(L.latLng([51.505, -0.09]), circleOptions);
circle = new L.Circle([51.505, -0.09], circleOptions);
circle = new L.Circle({ lat: 51.505, lng: -0.09 }, circleOptions);

circle.setRadius(10)

circle.getRadius();
circle.getBounds();

let circleMarker = L.circleMarker(L.latLng([51.505, -0.09]), circleOptions);
circleMarker = L.circleMarker(L.latLng([51.505, -0.09]));
circleMarker = new L.CircleMarker(L.latLng([51.505, -0.09]));
circleMarker = new L.CircleMarker(L.latLng([51.505, -0.09]), circleOptions);
circleMarker = new L.CircleMarker([51.505, -0.09], circleOptions);
circleMarker = new L.CircleMarker({ lat: 51.505, lng: -0.09 }, circleOptions);

circleMarker.setLatLng(L.latLng([51.505, -0.09]))
            .setLatLng([51.505, -0.09])
            .setLatLng({ lat: 51.505, lng: -0.09 })
            .setRadius(10);

circleMarker.toGeoJSON();
circleMarker.getLatLng();
circleMarker.getRadius();

let svg = L.svg({ padding: 0.1 })
svg = new L.SVG({ padding: 0.1 })

L.SVG.create('')
L.SVG.pointsToPath([[{ x: 1, y: 2 }, { x: 1, y: 2 }]])

let canvas = L.canvas({ padding: 0.1 })
canvas = new L.Canvas({ padding: 0.1 })

let layerGroup = L.layerGroup();
layerGroup = new L.LayerGroup();
layerGroup = L.layerGroup([polyline, polygon, rectangle, circle, circleMarker]);
layerGroup = new L.LayerGroup([polyline, polygon, rectangle, circle, circleMarker]);

layerGroup.addLayer(polyline)
          .removeLayer(polyline)
          .removeLayer(1)
          .clearLayers()
          .invoke('setRadius', { a: 1, b: 2 })
          .eachLayer(layer => layer.bindPopup('Hello'), { a: 1, b: 2 })
          .setZIndex(100)

layerGroup.toGeoJSON();
layerGroup.hasLayer(polyline);
layerGroup.getLayer(1);
layerGroup.getLayers();
layerGroup.getLayerId(polyline);

let featureGroup = L.featureGroup();
featureGroup = new L.FeatureGroup();
featureGroup = L.featureGroup([polyline, polygon, rectangle, circle, circleMarker]);
featureGroup = new L.FeatureGroup([polyline, polygon, rectangle, circle, circleMarker]);

featureGroup.setStyle(polylineOptions)
            .bringToFront()
            .bringToBack();

featureGroup.getBounds();

let geoJsonOptions: L.GeoJSONOptions = {
    pointToLayer: (featureData, latlng) => L.marker(latlng),
    style: featureData => {},
    onEachFeature: layer => layer.bindPopup('Hello!'),
    filter: featureData => featureData.visible,
    coordsToLatLng: coords => [L.latLng(51.505, -0.09)]
}

let geoJson = L.geoJson({}, geoJsonOptions);
geoJson = L.geoJson({});
geoJson = new L.GeoJSON({});
geoJson = new L.GeoJSON({}, geoJsonOptions);

L.GeoJSON.geometryToLayer({}, geoJsonOptions);
L.GeoJSON.coordsToLatLng([-0.09, 51.505, 10]);
L.GeoJSON.coordsToLatLngs([[-0.09, 51.505, 10], [-0.09, 51.505, 10]]);
L.GeoJSON.coordsToLatLngs([[-0.09, 51.505, 10], [-0.09, 51.505, 10]], 0);
L.GeoJSON.coordsToLatLngs([[[-0.09, 51.505, 10], [-0.09, 51.505, 10]], [[-0.09, 51.505, 10], [-0.09, 51.505, 10]]], 1);
L.GeoJSON.latLngToCoords(L.latLng([51.505, -0.09]));
L.GeoJSON.latLngsToCoords([L.latLng([51.505, -0.09]), L.latLng([51.505, -0.09])]);
L.GeoJSON.latLngsToCoords([L.latLng([51.505, -0.09]), L.latLng([51.505, -0.09])], 0);
L.GeoJSON.latLngsToCoords([[L.latLng([51.505, -0.09]), L.latLng([51.505, -0.09])], [L.latLng([51.505, -0.09]), L.latLng([51.505, -0.09])]], 1);
L.GeoJSON.asFeature({});

let gridLayerOptions: L.GridLayerOptions = {
    tileSize: 256,
    opacity: 1,
    updateWhenIdle: true,
    updateInterval: 200,
    attribution: '',
    zIndex: 1,
    bounds: L.latLngBounds([L.latLng(-60, -60), L.latLng(60, 60)]),
    minZoom: 3,
    maxZoom: 12,
    noWrap: false,
    pane: 'tilePane'
}

let gridLayer = L.gridLayer(gridLayerOptions);
gridLayer = L.gridLayer();
gridLayer = new L.GridLayer(gridLayerOptions);
gridLayer = new L.GridLayer();

gridLayer.bringToFront()
         .bringToBack()
         .setOpacity(0.5)
         .setZIndex(100)
         .redraw();

gridLayer.getAttribution();
gridLayer.getContainer();
gridLayer.isLoading();
gridLayer.getTileSize();

type CustomLayerConstructor = {
    new(options?: L.GridLayerOptions): L.GridLayer;
}

let createTileSync: L.GridLayer.createTile = (coords) => document.createElement('canvas');
let createTileAsync: L.GridLayer.createTile = (coords, done) => done('', document.createElement('canvas'));

let CustomLayer = L.GridLayer.extend<CustomLayerConstructor>({
    createTile: createTileSync
});

CustomLayer = L.GridLayer.extend<CustomLayerConstructor>({
    createTile: createTileAsync
});

let customLayer = new CustomLayer();

customLayer.bringToFront()
           .bringToBack()
           .setOpacity(0.5)
           .setZIndex(100)
           .redraw();

customLayer.getAttribution();
customLayer.getContainer();
customLayer.isLoading();
customLayer.getTileSize();

let latlng = L.latLng(50.5, 30.5);
latlng = L.latLng([50.5, 30.5]);
latlng = L.latLng({ lat: 50.5, lng: 30.5 });
latlng = L.latLng({ lon: 30.5, lat: 50.5 });
latlng = L.latLng(50.5, 30.5, 10);
latlng = L.latLng([50.5, 30.5, 10]);
latlng = L.latLng({ lat: 50.5, lng: 30.5, alt: 10 });
latlng = new L.LatLng(50.5, 30.5);
latlng = new L.LatLng([50.5, 30.5]);
latlng = new L.LatLng({ lat: 50.5, lng: 30.5 });
latlng = new L.LatLng({ lon: 30.5, lat: 50.5 });
latlng = new L.LatLng(50.5, 30.5, 10);
latlng = new L.LatLng([50.5, 30.5, 10]);
latlng = new L.LatLng({ lat: 50.5, lng: 30.5, alt: 10 });

latlng.equals(latlng);
latlng.equals(latlng, 10);
latlng.toString();
latlng.distanceTo(latlng);
latlng.wrap();
latlng.toBounds(10);

latlng.lat;
latlng.lng;
latlng.alt;

let latLngBounds = L.latLngBounds(L.latLng(40.712, -74.227), L.latLng(40.774, -74.125));
latLngBounds = L.latLngBounds([L.latLng(40.712, -74.227), L.latLng(40.774, -74.125)]);
latLngBounds = L.latLngBounds([40.712, -74.227], [40.774, -74.125]);
latLngBounds = L.latLngBounds([[40.712, -74.227], [40.774, -74.125]]);
latLngBounds = L.latLngBounds({ lat: 40.712, lng: -74.227 }, { lat: 40.774, lng: -74.125 });
latLngBounds = L.latLngBounds([{ lat: 40.712, lng: -74.227 }, { lat: 40.774, lng: -74.125 }]);
latLngBounds = new L.LatLngBounds(L.latLng(40.712, -74.227), L.latLng(40.774, -74.125));
latLngBounds = new L.LatLngBounds([L.latLng(40.712, -74.227), L.latLng(40.774, -74.125)]);
latLngBounds = new L.LatLngBounds([40.712, -74.227], [40.774, -74.125]);
latLngBounds = new L.LatLngBounds([[40.712, -74.227], [40.774, -74.125]]);
latLngBounds = new L.LatLngBounds({ lat: 40.712, lng: -74.227 }, { lat: 40.774, lng: -74.125 });
latLngBounds = new L.LatLngBounds([{ lat: 40.712, lng: -74.227 }, { lat: 40.774, lng: -74.125 }]);

latLngBounds.extend(latlng)
            .extend([50.5, 30.5])
            .extend({ lat: 50.5, lng: 30.5 })
            .extend([50.5, 30.5, 10])
            .extend({ lat: 50.5, lng: 30.5, alt: 10 })

latLngBounds.pad(10);
latLngBounds.getCenter();
latLngBounds.getSouthWest();
latLngBounds.getNorthEast();
latLngBounds.getNorthWest();
latLngBounds.getSouthEast();
latLngBounds.getWest();
latLngBounds.getSouth();
latLngBounds.getEast();
latLngBounds.getNorth();
latLngBounds.contains(latLngBounds);
latLngBounds.contains(latlng);
latLngBounds.intersects(latLngBounds);
latLngBounds.overlaps(latLngBounds);
latLngBounds.toBBoxString();
latLngBounds.equals(latLngBounds);
latLngBounds.isValid();

let point = L.point(200, 300);
point = L.point(200, 300, true);
point = L.point([200, 300]);
point = L.point({ x: 200, y: 300 });
point = new L.Point(200, 300);
point = new L.Point(200, 300, true);
point = new L.Point([200, 300]);
point = new L.Point({ x: 200, y: 300 });

point.clone();
point.add(point);
point.add([200, 300]);
point.add({ x: 200, y: 300 });
point.subtract(point);
point.divideBy(2);
point.divideBy(2, true);
point.scaleBy(point);
point.scaleBy([200, 300]);
point.scaleBy({ x: 200, y: 300 });
point.unscaleBy(point);
point.unscaleBy([200, 300]);
point.unscaleBy({ x: 200, y: 300 });
point.round();
point.floor();
point.ceil();
point.multiplyBy(2);
point.distanceTo(point);
point.distanceTo([200, 300]);
point.distanceTo({ x: 200, y: 300 });
point.equals(point);
point.equals([200, 300]);
point.equals({ x: 200, y: 300 });
point.contains(point);
point.contains([200, 300]);
point.contains({ x: 200, y: 300 });
point.toString();

point.x;
point.y;

let bounds = L.bounds(point, point);
bounds = L.bounds([200, 300], [200, 300]);
bounds = L.bounds({ x: 200, y: 300 }, { x: 200, y: 300 });
bounds = L.bounds([point, point]);
bounds = L.bounds([[200, 300], [200, 300]]);
bounds = L.bounds([{ x: 200, y: 300 }, { x: 200, y: 300 }]);
bounds = new L.Bounds(point, point);
bounds = new L.Bounds([200, 300], [200, 300]);
bounds = new L.Bounds({ x: 200, y: 300 }, { x: 200, y: 300 });
bounds = new L.Bounds([point, point]);
bounds = new L.Bounds([[200, 300], [200, 300]]);
bounds = new L.Bounds([{ x: 200, y: 300 }, { x: 200, y: 300 }]);

bounds.extend(point);
bounds.extend([200, 300]);
bounds.extend({ x: 200, y: 300 });
bounds.getCenter();
bounds.getCenter(true);
bounds.getBottomLeft();
bounds.getTopRight();
bounds.getSize();
bounds.contains(bounds);
bounds.contains([[200, 300], [200, 300]]);
bounds.contains([{ x: 200, y: 300 }, { x: 200, y: 300 }]);
bounds.contains(point);
bounds.contains([200, 300]);
bounds.contains({ x: 200, y: 300 });
bounds.intersects(bounds);
bounds.intersects([[200, 300], [200, 300]]);
bounds.intersects([{ x: 200, y: 300 }, { x: 200, y: 300 }]);
bounds.overlaps(bounds);
bounds.overlaps([[200, 300], [200, 300]]);
bounds.overlaps([{ x: 200, y: 300 }, { x: 200, y: 300 }]);

bounds.min;
bounds.max;

let iconOptions: L.IconOptions = {
    iconUrl: '',
    iconRetinaUrl: '',
    iconSize: [25, 25],
    iconAnchor: [10, 5],
    popupAnchor: [10, 5],
    shadowUrl: '',
    shadowRetinaUrl: '',
    shadowSize: [25, 25],
    shadowAnchor: [10, 5],
    className: ''
}

let icon = L.icon(iconOptions);
icon = new L.Icon(iconOptions);
icon = new L.Icon.Default();

icon.createIcon();
icon.createShadow();

let divIconOptions: L.DivIconOptions = {
    iconUrl: '',
    iconRetinaUrl: '',
    iconSize: [25, 25],
    iconAnchor: [10, 5],
    popupAnchor: [10, 5],
    shadowUrl: '',
    shadowRetinaUrl: '',
    shadowSize: [25, 25],
    shadowAnchor: [10, 5],
    className: '',
    html: '',
    bgPos: [0, 0]
}

let divIcon = L.divIcon(divIconOptions);
divIcon = new L.DivIcon(divIconOptions);

let zoomControlOptions: L.Control.ZoomOptions = {
    zoomInText: '+',
    zoomInTitle: 'Zoom in',
    zoomOutText: '-',
    zoomOutTitle: 'Zoom out'
}

let zoomControl = L.control.zoom(zoomControlOptions)
zoomControl = new L.Control.Zoom(zoomControlOptions)

let attributionControl = L.control.attribution({
    prefix: 'Leaflet'
})
attributionControl = new L.Control.Attribution({
    prefix: 'Leaflet'
})

attributionControl.setPrefix('Leaflet')
                  .addAttribution('')
                  .removeAttribution('')

let layerControlOptions: L.Control.LayersOptions = {
    collapsed: true,
    autoZIndex: true,
    hideSingleBase: false
}

let layerControl = L.control.layers({}, {}, layerControlOptions);
layerControl = new L.Control.Layers({}, {}, layerControlOptions);

layerControl.addBaseLayer(rectangle, '');
layerControl.addOverlay(polyline, '');
layerControl.removeLayer(polyline);
layerControl.expand();
layerControl.collapse();

let scaleControlOptions: L.Control.ScaleOptions = {
    maxWidth: 100,
    metric: true,
    imperial: true,
    updateWhenIdle: false
}

let scaleControl = L.control.scale(scaleControlOptions)
scaleControl = new L.Control.Scale(scaleControlOptions)

L.Browser.ie;
L.Browser.ielt9;
L.Browser.edge;
L.Browser.webkit;
L.Browser.gecko;
L.Browser.android;
L.Browser.android23;
L.Browser.chrome;
L.Browser.safari;
L.Browser.ie3d;
L.Browser.webkit3d;
L.Browser.gecko3d;
L.Browser.opera12;
L.Browser.any3d;
L.Browser.mobile;
L.Browser.mobileWebkit;
L.Browser.mobileWebkit3d;
L.Browser.mobileOpera;
L.Browser.mobileGecko;
L.Browser.touch;
L.Browser.msPointer;
L.Browser.pointer;
L.Browser.retina;
L.Browser.canvas;
L.Browser.vml;
L.Browser.svg;

L.Util.extend({}, {}, {}, {});
L.extend({}, {}, {}, {});
L.Util.create({}, {});
L.Util.bind(() => {}, {});
L.bind(() => {}, {});
L.Util.stamp({});
L.Util.throttle(() => {}, 10, {});
L.Util.wrapNum(10, [0, 5]);
L.Util.wrapNum(10, [0, 5], true);
L.Util.falseFn();
L.Util.formatNum(10.123456);
L.Util.formatNum(10.123456, 2);
L.Util.trim('');
L.Util.splitWords('split words');
L.Util.setOptions({}, {});
L.Util.getParamString({});
L.Util.getParamString({}, '');
L.Util.getParamString({}, '', false);
L.Util.template('Hello {a}, {b}', { a: 'foo', b: 'bar' });
L.Util.isArray([]);
L.Util.indexOf([1, 2, 3, 4], 2);
L.Util.requestAnimFrame(() => {});
L.Util.requestAnimFrame(() => {}, {});
L.Util.requestAnimFrame(() => {}, {}, true);
L.Util.cancelAnimFrame(1);

L.Util.lastId;
L.Util.emptyImageUrl;

let transformation = new L.Transformation(2, 5, -1, 10);

transformation.transform(point);
transformation.transform(point, 1);
transformation.untransform(point);
transformation.untransform(point, 1);

L.LineUtil.simplify([point, point, point], 0.1);
L.LineUtil.pointToSegmentDistance(point, point, point);
L.LineUtil.closestPointOnSegment(point, point, point);
L.LineUtil.clipSegment(point, point, bounds);
L.LineUtil.clipSegment(point, point, bounds, true);
L.LineUtil.clipSegment(point, point, bounds, true, true);

L.PolyUtil.clipPolygon([point, point, point], bounds);
L.PolyUtil.clipPolygon([point, point, point], bounds, true);

L.DomEvent.addListener(document.createElement('div'), 'click', e => {});
L.DomEvent.addListener(document.createElement('div'), 'click', e => {}, {});
L.DomEvent.on(document.createElement('div'), 'click', e => {});
L.DomEvent.on(document.createElement('div'), 'click', e => {}, {});
L.DomEvent.removeListener(document.createElement('div'), 'click', e => {});
L.DomEvent.removeListener(document.createElement('div'), 'click', e => {}, {});
L.DomEvent.off(document.createElement('div'), 'click', e => {});
L.DomEvent.off(document.createElement('div'), 'click', e => {}, {});
// L.DomEvent.stopPropagation(event);
L.DomEvent.disableScrollPropagation(document.createElement('div'));
L.DomEvent.disableClickPropagation(document.createElement('div'));
// L.DomEvent.preventDefault(event);
// L.DomEvent.stop(event);
// L.DomEvent.getMousePosition(event);
// L.DomEvent.getMousePosition(event, document.createElement('div'));
// L.DomEvent.getWheelDelta(event);

L.DomUtil.get('map');
L.DomUtil.get(document.createElement('div'));
L.DomUtil.getStyle(document.createElement('div'), '');
L.DomUtil.create('div', 'class');
L.DomUtil.create('div', 'class', document.createElement('div'));
L.DomUtil.remove(document.createElement('div'));
L.DomUtil.empty(document.createElement('div'));
L.DomUtil.toFront(document.createElement('div'));
L.DomUtil.toBack(document.createElement('div'));
L.DomUtil.hasClass(document.createElement('div'), 'class');
L.DomUtil.addClass(document.createElement('div'), 'class');
L.DomUtil.removeClass(document.createElement('div'), 'class');
L.DomUtil.setClass(document.createElement('div'), 'class');
L.DomUtil.getClass(document.createElement('div'));
L.DomUtil.setOpacity(document.createElement('div'), 0.5);
L.DomUtil.testProp(['', '', '']);
L.DomUtil.setTransform(document.createElement('div'), point);
L.DomUtil.setTransform(document.createElement('div'), point, 1);
L.DomUtil.setPosition(document.createElement('div'), point);
L.DomUtil.setPosition(document.createElement('div'), point, true);
L.DomUtil.disableTextSelection();
L.DomUtil.enableTextSelection();
L.DomUtil.disableImageDrag();
L.DomUtil.enableImageDrag();
L.DomUtil.preventOutline(document.createElement('div'));
L.DomUtil.restoreOutline(document.createElement('div'));

L.DomUtil.TRANSFORM;
L.DomUtil.TRANSITION;

let fx = new L.PosAnimation();

fx.run(document.createElement('div'), point);
fx.run(document.createElement('div'), point, 0.25);
fx.run(document.createElement('div'), point, 0.25, 0.5);
fx.stop();

let draggable = new L.Draggable(document.createElement('div'), document.createElement('div'));
draggable = new L.Draggable(document.createElement('div'), document.createElement('div'), true);
draggable = new L.Draggable(document.createElement('div'), document.createElement('div'), true, { clickTolerance: 3 });

draggable.enable();
draggable.disable();

interface MyClass {
    greet: (name: string) => void;
}

interface MyClassStatic extends L.ClassStatic {
    new(greeter: string): MyClass;
}

let MyClass = L.Class.extend<MyClassStatic>({
    initialize: function(greeter: string) {
        this.greeter = greeter;
    },

    greet: function(name: string) {
        alert(this.greeter + ', ' + name);
    }
});

let a = new MyClass('Hello');
a.greet('World');

let myClass = function (greeter: string) {
    return new MyClass(greeter)
}

let b = myClass('Hello');
b.greet('World');

let MyChildClass = MyClass.extend<MyClassStatic>({
    initialize: function () {
        MyClass.prototype.initialize.call('Yo');
    },

    greet: function(name: string) {
        MyClass.prototype.greet.call(this, 'bro ' + name + '!');
    }
})

interface MySecondClassOptions {
    myOption1?: string;
    myOption2?: string;
}

interface MySecondClass {
    options: MySecondClassOptions;
}

interface MySecondChildClassOptions extends MySecondClassOptions {
    myOption1?: string;
    myOption3?: number;
}

interface MySecondChildClass {
    options: MySecondChildClassOptions;
}

interface MySecondClassStatic extends L.ClassStatic {
    new(): MySecondClass;
}

interface MySecondChildClassStatic extends L.ClassStatic {
    new(): MySecondChildClass;
}

let MySecondClass = L.Class.extend<MySecondClassStatic>({
    options: {
        myOption1: 'foo',
        myOption2: 'bar'
    }
})

let MySecondChildClass = MySecondClass.extend<MySecondChildClassStatic>({
    options: {
        myOption1: 'baz',
        myOption3: 5
    }
})

let c = new MySecondChildClass();

c.options.myOption1;
c.options.myOption2;
c.options.myOption3;

interface MyMixin {
    foo(): void;
    bar: number;
}

let MyMixin: MyMixin = {
    foo: function () {},
    bar: 5
}

interface MyThirdClass extends MyClass, MyMixin {}

interface MyThirdClassStatic extends L.ClassStatic {
    new(): MyThirdClass;
}

let MyThirdClass = L.Class.extend<MyThirdClassStatic>({
    includes: MyMixin
});

let d = new MyThirdClass();
d.foo();

MyThirdClass.include(MyMixin);

interface MyFourthClass {}

interface MyFourthClassStatic extends L.ClassStatic {
    new(): MyFourthClass;

    FOO: string;
    BLA: number;
}

let MyFourthClass = L.Class.extend<MyFourthClassStatic>({
    statics: {
        FOO: 'bar',
        BLA: 5
    }
})

MyFourthClass.FOO;

MyFourthClass.addInitHook(function() {});
MyFourthClass.addInitHook('methodName', 4, 5, 6);

let clickCallback = function(e: L.MouseEvent) {
    e.type;
    e.target;
    e.latlng;
    e.layerPoint;
    e.containerPoint;
    e.originalEvent;
};

let locationfoundCallback = function(e: L.LocationEvent) {
    e.latlng;
    e.bounds;
    e.accuracy;
    e.altitude;
    e.altitudeAccuracy;
    e.heading;
    e.speed;
    e.timestamp;
};

let locationerrorCallback = function(e: L.ErrorEvent) {
    e.message;
    e.code;
};

let layeraddCallback = function(e: L.LayerEvent) {
    e.layer;
};

let baselayerchangeCallback = function(e: L.LayersControlEvent) {
    e.layer;
    e.name;
};

let tileunloadCallback = function(e: L.TileEvent) {
    e.tile;
    e.coords;
};

let tileerrorCallback = function(e: L.TileErrorEvent) {
    e.tile;
    e.coords;
    e.error;
};

let resizeCallback = function(e: L.ResizeEvent) {
    e.oldSize;
    e.newSize;
};

let popupopenCallback = function(e: L.PopupEvent) {
    e.popup;
};

let dragendCallback = function(e: L.DragEndEvent) {
    e.distance;
};

let zoomanimCallback = function(e: L.ZoomAnimEvent) {
    e.center;
    e.zoom;
    e.noUpdate;
};

map.on('click', clickCallback);
map.off('click', clickCallback);
map.once('click', clickCallback);
map.addEventListener('click', clickCallback);
map.removeEventListener('click', clickCallback);
map.addOneTimeEventListener('click', clickCallback);

map.on('locationfound', locationfoundCallback);
map.off('locationfound', locationfoundCallback);
map.once('locationfound', locationfoundCallback);
map.addEventListener('locationfound', locationfoundCallback);
map.removeEventListener('locationfound', locationfoundCallback);
map.addOneTimeEventListener('locationfound', locationfoundCallback);

map.on('locationerror', locationerrorCallback);
map.off('locationerror', locationerrorCallback);
map.once('locationerror', locationerrorCallback);
map.addEventListener('locationerror', locationerrorCallback);
map.removeEventListener('locationerror', locationerrorCallback);
map.addOneTimeEventListener('locationerror', locationerrorCallback);

map.on('layeradd', layeraddCallback);
map.off('layeradd', layeraddCallback);
map.once('layeradd', layeraddCallback);
map.addEventListener('layeradd', layeraddCallback);
map.removeEventListener('layeradd', layeraddCallback);
map.addOneTimeEventListener('layeradd', layeraddCallback);

map.on('baselayerchange', baselayerchangeCallback);
map.off('baselayerchange', baselayerchangeCallback);
map.once('baselayerchange', baselayerchangeCallback);
map.addEventListener('baselayerchange', baselayerchangeCallback);
map.removeEventListener('baselayerchange', baselayerchangeCallback);
map.addOneTimeEventListener('baselayerchange', baselayerchangeCallback);

map.on('tileunload', tileunloadCallback);
map.off('tileunload', tileunloadCallback);
map.once('tileunload', tileunloadCallback);
map.addEventListener('tileunload', tileunloadCallback);
map.removeEventListener('tileunload', tileunloadCallback);
map.addOneTimeEventListener('tileunload', tileunloadCallback);

map.on('tileerror', tileerrorCallback);
map.off('tileerror', tileerrorCallback);
map.once('tileerror', tileerrorCallback);
map.addEventListener('tileerror', tileerrorCallback);
map.removeEventListener('tileerror', tileerrorCallback);
map.addOneTimeEventListener('tileerror', tileerrorCallback);

map.on('resize', resizeCallback);
map.off('resize', resizeCallback);
map.once('resize', resizeCallback);
map.addEventListener('resize', resizeCallback);
map.removeEventListener('resize', resizeCallback);
map.addOneTimeEventListener('resize', resizeCallback);

map.on('popupopen', popupopenCallback);
map.off('popupopen', popupopenCallback);
map.once('popupopen', popupopenCallback);
map.addEventListener('popupopen', popupopenCallback);
map.removeEventListener('popupopen', popupopenCallback);
map.addOneTimeEventListener('popupopen', popupopenCallback);

map.on('dragend', dragendCallback);
map.off('dragend', dragendCallback);
map.once('dragend', dragendCallback);
map.addEventListener('dragend', dragendCallback);
map.removeEventListener('dragend', dragendCallback);
map.addOneTimeEventListener('dragend', dragendCallback);

map.on('zoomanim', zoomanimCallback);
map.off('zoomanim', zoomanimCallback);
map.once('zoomanim', zoomanimCallback);
map.addEventListener('zoomanim', zoomanimCallback);
map.removeEventListener('zoomanim', zoomanimCallback);
map.addOneTimeEventListener('zoomanim', zoomanimCallback);

map.on({
    click: clickCallback,
    locationfound: locationfoundCallback,
    locationerror: locationerrorCallback,
    layeradd: layeraddCallback,
    baselayerchange: baselayerchangeCallback,
    tileunload: tileunloadCallback,
    tileerror: tileerrorCallback,
    resize: resizeCallback,
    popupopen: popupopenCallback,
    dragend: dragendCallback,
    zoomanim: zoomanimCallback
});

map.off({
    click: clickCallback,
    locationfound: locationfoundCallback,
    locationerror: locationerrorCallback,
    layeradd: layeraddCallback,
    baselayerchange: baselayerchangeCallback,
    tileunload: tileunloadCallback,
    tileerror: tileerrorCallback,
    resize: resizeCallback,
    popupopen: popupopenCallback,
    dragend: dragendCallback,
    zoomanim: zoomanimCallback
});

map.off();
map.fire('click');
map.fire('click', {});
map.fire('click', {}, true);
map.fireEvent('click')
map.fireEvent('click', {});
map.fireEvent('click', {}, true);
map.listens('click');
map.hasEventListeners('click');
map.addEventParent(polyline);
map.removeEventParent(polyline);
map.clearAllEventListeners();

polyline.addTo(map)
        .remove()
        .removeFrom(map)
        .bindPopup('Hi There!')
        .bindPopup(document.createElement('div'))
        .bindPopup((layer: L.Polyline) => layer.options.pane)
        .bindPopup(popup)
        .unbindPopup()
        .openPopup()
        .openPopup(latlng)
        .closePopup()
        .setPopupContent('Hi There!')
        .setPopupContent(document.createElement('div'))
        .bindPopup((layer: L.Polyline) => layer.options.pane)
        .setPopupContent(popup);

polygon.getPane();
polygon.getPane('popupPane');
polygon.getPopup();

let control = L.control({ position: 'topright' });
control = new L.Control({ position: 'topright' });

control.setPosition('topright')
       .addTo(map)
       .remove();

control.getPosition();
control.getContainer();

let handler = new L.Handler();

handler.enable();
handler.disable();
handler.enabled();

L.Projection.LonLat.project(latlng);
L.Projection.LonLat.unproject(point);
L.Projection.LonLat.bounds;

L.Projection.Mercator.project(latlng);
L.Projection.Mercator.unproject(point);
L.Projection.Mercator.bounds;

L.Projection.SphericalMercator.project(latlng);
L.Projection.SphericalMercator.unproject(point);
L.Projection.SphericalMercator.bounds;

L.CRS.EPSG3395.code;
L.CRS.EPSG3395.wrapLng;
L.CRS.EPSG3395.wrapLat;
L.CRS.EPSG3395.infinite;
L.CRS.EPSG3395.latLngToPoint(latlng, 3);
L.CRS.EPSG3395.pointToLatLng(point, 3);
L.CRS.EPSG3395.project(latlng);
L.CRS.EPSG3395.unproject(point);
L.CRS.EPSG3395.scale(3);
L.CRS.EPSG3395.zoom(3);
L.CRS.EPSG3395.getProjectedBounds(3);
L.CRS.EPSG3395.wrapLatLng(latlng);

L.CRS.EPSG3857.code;
L.CRS.EPSG3857.wrapLng;
L.CRS.EPSG3857.wrapLat;
L.CRS.EPSG3857.infinite;
L.CRS.EPSG3857.latLngToPoint(latlng, 3);
L.CRS.EPSG3857.pointToLatLng(point, 3);
L.CRS.EPSG3857.project(latlng);
L.CRS.EPSG3857.unproject(point);
L.CRS.EPSG3857.scale(3);
L.CRS.EPSG3857.zoom(3);
L.CRS.EPSG3857.getProjectedBounds(3);
L.CRS.EPSG3857.wrapLatLng(latlng);

L.CRS.EPSG4326.code;
L.CRS.EPSG4326.wrapLng;
L.CRS.EPSG4326.wrapLat;
L.CRS.EPSG4326.infinite;
L.CRS.EPSG4326.latLngToPoint(latlng, 3);
L.CRS.EPSG4326.pointToLatLng(point, 3);
L.CRS.EPSG4326.project(latlng);
L.CRS.EPSG4326.unproject(point);
L.CRS.EPSG4326.scale(3);
L.CRS.EPSG4326.zoom(3);
L.CRS.EPSG4326.getProjectedBounds(3);
L.CRS.EPSG4326.wrapLatLng(latlng);

L.CRS.Simple.code;
L.CRS.Simple.wrapLng;
L.CRS.Simple.wrapLat;
L.CRS.Simple.infinite;
L.CRS.Simple.latLngToPoint(latlng, 3);
L.CRS.Simple.pointToLatLng(point, 3);
L.CRS.Simple.project(latlng);
L.CRS.Simple.unproject(point);
L.CRS.Simple.scale(3);
L.CRS.Simple.zoom(3);
L.CRS.Simple.getProjectedBounds(3);
L.CRS.Simple.wrapLatLng(latlng);

let renderer = new L.Renderer();
renderer = new L.Renderer({ padding: 0.1 });

L.version;

L_NO_TOUCH;
L_DISABLE_3D;

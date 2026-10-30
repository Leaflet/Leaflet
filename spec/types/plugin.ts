// Typings of a plugin: `declare module 'leaflet'` merges into the classes, options and event maps it augments.
import {FeatureGroup, GeoJSON, Layer, LayerGroup, LineUtil, Map, Marker, Polygon, Polyline, Popup, Tooltip} from 'leaflet';
import type {LeafletEvent, LeafletPointerEvent, MarkerEventMap, MarkerOptions, ZoomAnimEvent} from 'leaflet';

declare module 'leaflet' {
	interface Map {
		pm: {enableDraw(shape: string): void};
	}
	interface Layer {
		pm?: {enable(): void};
	}
	interface MarkerOptions {
		glow: number;
	}
	interface MapEventMap {
		'pm:create': LeafletEvent & {shape: string};
	}
}

const map = new Map('map');
map.pm.enableDraw('Polygon');
map.boxZoom.disable();
map.on('pm:create', e => e.shape.toUpperCase()).on('click', e => e.latlng);
// @ts-expect-error not a pm:create property
map.on('pm:create', e => e.layer);
map.on({'pm:create': e => e.shape.toUpperCase(), click: e => e.latlng, 'pm:other': e => e.whatever});
// @ts-expect-error not a pm:create property
map.off({'pm:create': e => e.layer});

new Polygon([[0, 0], [1, 1], [1, 0]]).pm?.enable();

const marker = new Marker([0, 0], {glow: 2});
const glow: number = marker.options.glow;
// @ts-expect-error glow is a number
new Marker([0, 0], {glow: 'bright'});

// a plugin class with its own defaults needs no annotations
class GlowMarker extends Marker {
	static defaultOptions = {glow: 3, pulse: true};
}
new GlowMarker([0, 0]).addTo(map);

// a generic subclass passes `this` as a plain layer and binds its handlers in map form
class PulseMarker<O extends MarkerOptions = MarkerOptions, E extends MarkerEventMap = MarkerEventMap> extends Marker<O, E> {
	pulse(m: Map) {
		this.on({click: this._onClick, add: () => {}});
		if (!m.hasLayer(this)) { m.addLayer(this); }
	}
	group(g: FeatureGroup) {
		this.addTo(g).removeFrom(g);
	}
	_onClick(e: LeafletPointerEvent) { void e.latlng; }
}
new PulseMarker([0, 0]).pulse(map);

// map listeners of a layer are checked against the map events, including the augmented ones
class DrawLayer extends Layer {
	getEvents() {
		return {'pm:create': this._onCreate, zoomanim: this._onZoomAnim};
	}
	_onCreate(e: {shape: string}) { void e.shape; }
	_onZoomAnim(e: ZoomAnimEvent) { void e.center; }
}
class BadLayer extends Layer {
	// @ts-expect-error not a zoomend event
	getEvents() {
		return {zoomend: this._onZoomEnd};
	}
	_onZoomEnd(e: {shape: string}) { void e.shape; }
}
new DrawLayer().addTo(map);
new BadLayer().addTo(map);

// groups hold layers that popups and tooltips can bind to, which those aren't
const group = new LayerGroup().addTo(map);
new Marker([0, 0]).addTo(group).removeFrom(group);
new Popup().addTo(map).removeFrom(map);
// @ts-expect-error a popup in a group
new Popup().addTo(group);
// @ts-expect-error a tooltip in a group
new Tooltip().removeFrom(group);

// nested latlngs: GeoJSON coordinates convert into polyline input, and `isFlat` tells a line from nested ones
const line = new Polyline(GeoJSON.coordsToLatLngs([[[0, 0], [1, 1]], [[2, 2], [3, 3]]], 1));
const latlngs = line.getLatLngs();
if (LineUtil.isFlat(latlngs)) {
	void latlngs[0].lat;
} else {
	// @ts-expect-error a line, not a point
	void latlngs[0].lat;
}
new Polygon([[[0, 0], [1, 1], [1, 0]], [[0.2, 0.2], [0.8, 0.8], [0.8, 0.2]]]).toGeoJSON().geometry.coordinates[0];

void glow;

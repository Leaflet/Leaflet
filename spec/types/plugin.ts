// Typings of a plugin: `declare module 'leaflet'` merges into the classes, options and event maps it augments.
import {Map, Marker, Polygon} from 'leaflet';
import type {LeafletEvent, LeafletPointerEvent, MarkerEventMap, MarkerOptions} from 'leaflet';

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
	_onClick(e: LeafletPointerEvent) { void e.latlng; }
}
new PulseMarker([0, 0]).pulse(map);

void glow;

// Options interfaces are all-optional bags, as in `@types/leaflet`, while `options` on an instance has the defaults
// filled in, including the ones inherited from parent classes.
import {Circle, Layer, LayersControl, Map, Marker, Polyline, TileLayer, ZoomControl} from 'leaflet';
import type {ControlPosition, MapOptions, MarkerOptions, PathOptions, PolylineOptions, TileLayerOptions} from 'leaflet';

declare module 'leaflet' {
	interface MarkerOptions {
		rotationAngle?: number;
	}
}

// annotations and props types built on the options
const style: PathOptions = {color: 'red'};
const lineOpts: PolylineOptions = {weight: 2, smoothFactor: 2};
interface TileLayerProps extends TileLayerOptions { url: string }
interface MapContainerProps extends MapOptions { center: [number, number] }
const tp: TileLayerProps = {url: 'x', attribution: 'a'};
const mp: MapContainerProps = {center: [0, 0], zoom: 3};
function makeMarker(o: MarkerOptions) { return new Marker([0, 0], o); }
const map = new Map('map', mp);
new TileLayer(tp.url, tp).addTo(map);
new Polyline([[0, 0], [1, 1]], {...style, ...lineOpts}).setStyle(style);

// resolved options
const m = makeMarker({rotationAngle: 4, glow: 1}); // plugin.ts makes `glow` required
const pane: string = m.options.pane;
const angle: number | undefined = m.options.rotationAngle;
const maxZoom: number = new TileLayer('').options.maxZoom;
const radius: number = new Circle([0, 0], {radius: 5}).options.radius;
// the options passed to the constructor don't narrow the type of `options`
const className: string | undefined = new Circle([0, 0], {radius: 5}).options.className;
const title: string = new Marker([0, 0], {title: 'a'}).options.title;
const pos: ControlPosition = new ZoomControl().options.position;
const collapsed: boolean = new LayersControl().options.collapsed;
// @ts-expect-error no default for bounds
const bounds: object = new TileLayer('').options.bounds;
const asLayer: Layer = m;

// generic and concrete subclasses
class MyTiles<O extends TileLayerOptions = TileLayerOptions> extends TileLayer<O> {
	constructor(url: string, options?: Partial<O>) {
		super(url, options);
		const z: number = this.options.maxZoom;
		void z;
	}
}
const shineDefaults = {shine: 3};
interface ShineOptions extends MarkerOptions { shine?: number }
class ShineMarker extends Marker<ShineOptions & typeof shineDefaults> {
	static defaultOptions = shineDefaults;
	get shine(): number { return this.options.shine; }
}
new MyTiles('').addTo(map);
new ShineMarker([0, 0], {shine: 2}).addTo(map);

void [pane, angle, maxZoom, radius, className, title, pos, collapsed, bounds, asLayer];

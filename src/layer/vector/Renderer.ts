import {Layer} from '../Layer';
import * as DomUtil from '../../dom/DomUtil';
import * as Util from '../../core/Util';
import * as Browser from '../../core/Browser';
import {Bounds} from '../../geometry/Bounds';

// import {Bounds} from '../../geometry/Bounds';

import {Point} from '../../geometry/Point';
// import {Bounds} from '../../geometry/Bounds';
import {LatLngBounds, toLatLngBounds as latLngBounds} from '../../geo/LatLngBounds';

import {Object, ReturnType, HTMLElement} from 'typescript';
import {Point} from "../geometry";
import {FeatureGroup} from "../FeatureGroup";

// https://www.typescriptlang.org/docs/handbook/2/typeof-types.html
type LatLngBoundsReturnType= ReturnType<typeof LatLngBounds>;

type EventReturnType = ReturnType<typeof Event>;

// type HTMLElementReturnType = ReturnType<typeof HTMLElement>;
type NumberReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
// type pointReturnType = ReturnType<typeof  Point.prototype.clone> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

// type GridLayerReturnType = ReturnType<typeof  FeatureGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
type LayerReturnType = ReturnType<typeof  FeatureGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;
// type LayerGroupReturnType = ReturnType<typeof  LayerGroup> | number | ReturnType<typeof Object.Number>| ReturnType<typeof Point>;

// type PointReturnType = ReturnType<typeof Point>;
// type StringReturnType = ReturnType<typeof  Point.prototype.toString> | string | ReturnType<typeof Object.String>;
// type _roundReturnType = ReturnType<typeof  Point.prototype._round> | number | ReturnType<typeof Object.Number>;
// type roundReturnType = ReturnType<typeof  Point.prototype.round> | number | ReturnType<typeof Object.Number>;
// type floorReturnType = ReturnType<typeof  Point.prototype.floor> | number | ReturnType<typeof Object.Number>;

// type numberAuxX = ReturnType<typeof Object.Number>;

// type numberAuxY = ReturnType<typeof Object.Number>;



/*
 * @class Renderer
 * @inherits Layer
 * @aka L.Renderer
 *
 * Base class for vector renderer implementations (`SVG`, `Canvas`). Handles the
 * DOM container of the renderer, its bounds, and its zoom animation.
 *
 * A `Renderer` works as an implicit layer group for all `Path`s - the renderer
 * itself can be added or removed to the map. All paths use a renderer, which can
 * be implicit (the map will decide the type of renderer and use it automatically)
 * or explicit (using the [`renderer`](#path-renderer) option of the path).
 *
 * Do not use this class directly, use `SVG` and `Canvas` instead.
 *
 * @event update: Event
 * Fired when the renderer updates its bounds, center and zoom, for example when
 * its map has moved
 */

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
export const Renderer = Layer.extend({

	// @section
	// @aka Renderer options
	options: {
		// @option padding: Number = 0.1
		// How much to extend the clip area around the map view (relative to its size)
		// e.g. 0.1 would be 10% of map view in each direction
		padding: 0.1,

		// @option tolerance: Number = 0
		// How much to extend click tolerance round a path/object on the map
		tolerance : 0
	},

	initialize: function (options:NumberReturnType):void {
		Util.setOptions(this, options);
		Util.stamp(this);
		this._layers = this._layers || {};
	},

	onAdd: function ():void {
		if (!this._container) {
			this._initContainer(); // defined by renderer implementations

			if (this._zoomAnimated) {
				DomUtil.addClass(this._container, 'leaflet-zoom-animated');
			}
		}

		this.getPane().appendChild(this._container);
		this._update();
		this.on('update', this._updatePaths, this);
	},

	onRemove: function ():void {
		this.off('update', this._updatePaths, this);
		this._destroyContainer();
	},

	getEvents: function (){
		const events = {
			viewreset: this._reset,
			zoom: this._onZoom,
			moveend: this._update,
			zoomend: this._onZoomEnd
		};
		if (this._zoomAnimated) {
			events.zoomanim = this._onAnimZoom;
		}
		return events;
	},

	_onAnimZoom: function (ev) {
		this._updateTransform(ev.center, ev.zoom);
	},

	_onZoom: function () {
		this._updateTransform(this._map.getCenter(), this._map.getZoom());
	},

	_updateTransform: function (center, zoom) {
		const scale = this._map.getZoomScale(zoom, this._zoom);
		const position = DomUtil.getPosition(this._container);
		const viewHalf = this._map.getSize().multiplyBy(0.5 + this.options.padding);
		const currentCenterPoint = this._map.project(this._center, zoom);
		const destCenterPoint = this._map.project(center, zoom);
		const centerOffset = destCenterPoint.subtract(currentCenterPoint);

		const topLeftOffset = viewHalf.multiplyBy(-scale).add(position).add(viewHalf).subtract(centerOffset);

		if (Browser.any3d) {
			DomUtil.setTransform(this._container, topLeftOffset, scale);
		} else {
			DomUtil.setPosition(this._container, topLeftOffset);
		}
	},

	_reset: function ():void {
		this._update();
		this._updateTransform(this._center, this._zoom);

		for (const id in this._layers) {
			this._layers[id]._reset();
		}
	},

	_onZoomEnd: function ():void {
		for (const id in this._layers) {
			this._layers[id]._project();
		}
	},

	_updatePaths: function ():void {
		for (const id in this._layers) {
			this._layers[id]._update();
		}
	},

	_update: function ():void {
		// Update pixel bounds of renderer container (for positioning/sizing/clipping later)
		// Subclasses are responsible of firing the 'update' event.
		const p = this.options.padding;
		const size = this._map.getSize();
		const min = this._map.containerPointToLayerPoint(size.multiplyBy(-p)).round();

		this._bounds = new Bounds(min, min.add(size.multiplyBy(1 + p * 2)).round());

		this._center = this._map.getCenter();
		this._zoom = this._map.getZoom();
	}
});

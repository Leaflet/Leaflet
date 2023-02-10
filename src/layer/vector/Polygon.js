import {Polyline} from './Polyline.js';
import {LatLng} from '../../geo/LatLng.js';
import * as LineUtil from '../../geometry/LineUtil.js';
import {Point} from '../../geometry/Point.js';
import {Bounds} from '../../geometry/Bounds.js';
import * as PolyUtil from '../../geometry/PolyUtil.js';

/*
 * @class Polygon
 * @aka L.Polygon
 * @inherits Polyline
 *
 * A class for drawing polygon overlays on a map. Extends `Polyline`.
 *
 * Note that points you pass when creating a polygon shouldn't have an additional last point equal to the first one — it's better to filter out such points.
 *
 *
 * @example
 *
 * ```js
 * // create a red polygon from an array of LatLng points
 * var latlngs = [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]];
 *
 * var polygon = L.polygon(latlngs, {color: 'red'}).addTo(map);
 *
 * // zoom the map to the polygon
 * map.fitBounds(polygon.getBounds());
 * ```
 *
 * You can also pass an array of arrays of latlngs, with the first array representing the outer shape and the other arrays representing holes in the outer shape:
 *
 * ```js
 * var latlngs = [
 *   [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
 *   [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
 * ];
 * ```
 *
 * Additionally, you can pass a multi-dimensional array to represent a MultiPolygon shape.
 *
 * ```js
 * var latlngs = [
 *   [ // first polygon
 *     [[37, -109.05],[41, -109.03],[41, -102.05],[37, -102.04]], // outer ring
 *     [[37.29, -108.58],[40.71, -108.58],[40.71, -102.50],[37.29, -102.50]] // hole
 *   ],
 *   [ // second polygon
 *     [[41, -111.03],[45, -111.04],[45, -104.05],[41, -104.05]]
 *   ]
 * ];
 * ```
 */

export const Polygon = Polyline.extend({

	options: {
		fill: true
	},

	isEmpty() {
		return !this._latlngs.length || !this._latlngs[0].length;
	},

	// @method getCenter(): LatLng
	// Returns the center ([centroid](http://en.wikipedia.org/wiki/Centroid)) of the Polygon.
	getCenter() {
		// throws error when not yet added to map as this center calculation requires projected coordinates
		if (!this._map) {
			throw new Error('Must add layer to map before using getCenter()');
		}
		return PolyUtil.polygonCenter(this._defaultShape(), this._map.options.crs);
	},

	_convertLatLngs(latlngs) {
		const result = Polyline.prototype._convertLatLngs.call(this, latlngs),
		    len = result.length;

		// remove last point if it equals first one
		if (len >= 2 && result[0] instanceof LatLng && result[0].equals(result[len - 1])) {
			result.pop();
		}
		return result;
	},

	_setLatLngs(latlngs) {
		Polyline.prototype._setLatLngs.call(this, latlngs);
		if (LineUtil.isFlat(this._latlngs)) {
			this._latlngs = [this._latlngs];
		}
	},

	_defaultShape() {
		return LineUtil.isFlat(this._latlngs[0]) ? this._latlngs[0] : this._latlngs[0][0];
	},

	_clipPoints() {
		// polygons need a different clipping algorithm so we redefine that

		let bounds = this._renderer._bounds;
		const w = this.options.weight,
		      p = new Point(w, w);

		// increase clip padding by stroke width to avoid stroke on clip edges
		bounds = new Bounds(bounds.min.subtract(p), bounds.max.add(p));

		this._parts = [];
		if (!this._pxBounds || !this._pxBounds.intersects(bounds)) {
			return;
		}

		if (this.options.noClip) {
			this._parts = this._rings;
			return;
		}

		for (let i = 0, len = this._rings.length, clipped; i < len; i++) {
			clipped = PolyUtil.clipPolygon(this._rings[i], bounds, true);
			if (clipped.length) {
				this._parts.push(clipped);
			}
		}
	},

	_updatePath() {
		this._renderer._updatePoly(this, true);
	},

	// Needed by the `Canvas` renderer for interactivity
	_containsPoint(p) {
		let inside = false,
		    part, p1, p2, i, j, k, len, len2;

		if (!this._pxBounds || !this._pxBounds.contains(p)) { return false; }

		// ray casting algorithm for detecting if point is in polygon
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];

			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				p1 = part[j];
				p2 = part[k];

				if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
					inside = !inside;
				}
			}
		}

		// also check if it's on polygon stroke
		return inside || Polyline.prototype._containsPoint.call(this, p, true);
	}

});


// @factory L.polygon(latlngs: LatLng[], options?: Polyline options)
export function polygon(latlngs, options) {
	return new Polygon(latlngs, options);
}

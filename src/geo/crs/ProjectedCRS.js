import {EarthCRS} from './EarthCRS.js';
import {Transformation} from '../../geometry/Transformation.js';

/**
 * A base for CRSs defined by a projection and a list of resolutions, such as national grids and the tile matrix sets
 * of WMTS services. Extend it with your own `projection`, `resolutions`, `transformation` and `code`. The resolutions,
 * origin and bounds describe the tile grid and come from the tile service (e.g. a WMTS `TileMatrixSet`), not from
 * the projection. Zooms between and beyond the given resolutions scale geometrically, so fractional zoom and zooming
 * past the last level work as in other CRSs. `distance()` returns meters, and the longitude axis does not wrap.
 *
 * @example
 * Using [proj4js](https://github.com/proj4js/proj4js) for SWEREF 99 TM, the Swedish national grid:
 * ```js
 * const proj = proj4('+proj=utm +zone=33 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs');
 *
 * class SWEREF99 extends ProjectedCRS {
 * 	static code = 'EPSG:3006';
 * 	static resolutions = [4096, 2048, 1024, 512, 256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5];
 * 	static transformation = new Transformation(1, 1200000, -1, 8500000); // top-left origin at [-1200000, 8500000]
 * 	static projection = {
 * 		bounds: new Bounds([-1200000, 4700000], [2600000, 8500000]),
 * 		project({lat, lng}) {
 * 			const [x, y] = proj.forward([lng, lat]);
 * 			return new Point(x, y);
 * 		},
 * 		unproject({x, y}) {
 * 			const [lng, lat] = proj.inverse([x, y]);
 * 			return new LatLng(lat, lng);
 * 		}
 * 	};
 * }
 *
 * const map = new LeafletMap('map', {crs: SWEREF99, center: [59.33, 18.07], zoom: 5});
 * ```
 */
export class ProjectedCRS extends EarthCRS {
	static wrapLng = undefined;

	/**
	 * The transformation from projected coordinates to pixels, with resolution 1. Defaults to flipping the `y` axis,
	 * for the origin at `[0, 0]`. For a top-left origin at `[x, y]`, use `new Transformation(1, -x, -1, y)`.
	 */
	static transformation = /* @__PURE__ */ new Transformation(1, 0, -1, 0);

	/**
	 * Projected units per pixel for each zoom level starting at 0, from largest to smallest. Needs at least two.
	 * @type {number[]}
	 */
	static resolutions = [];

	/** @param {number} zoom */
	static scale(zoom) {
		const r = this.resolutions,
		i = Math.min(Math.max(Math.floor(zoom), 0), r.length - 2);

		return (r[i] / r[i + 1]) ** (zoom - i) / r[i];
	}

	/** @param {number} scale */
	static zoom(scale) {
		const r = this.resolutions;
		let i = 0;
		while (i < r.length - 2 && r[i + 1] * scale >= 1) { i++; }

		return i + Math.log(r[i] * scale) / Math.log(r[i] / r[i + 1]);
	}
}

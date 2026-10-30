import {EarthCRS} from './EarthCRS.js';
import {SphericalMercatorProjection} from '../projection/SphericalMercatorProjection.js';
import {Transformation} from '../../geometry/Transformation.js';

/**
 * The most common CRS for online maps, used by almost all free and commercial tile providers. Uses Spherical Mercator
 * projection. Set in by default in Map's `crs` option.
 */
export class EPSG3857 extends EarthCRS {
	static code = 'EPSG:3857';
	static projection = SphericalMercatorProjection;

	static transformation = /* @__PURE__ */ (() => {
		const scale = 0.5 / (Math.PI * SphericalMercatorProjection.R);
		return new Transformation(scale, 0.5, -scale, 0.5);
	})();
}

export class EPSG900913 extends EPSG3857 {
	static code = 'EPSG:900913';
}

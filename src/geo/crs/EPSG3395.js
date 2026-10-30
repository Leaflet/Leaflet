import {EarthCRS} from './EarthCRS.js';
import {MercatorProjection} from '../projection/MercatorProjection.js';
import {Transformation} from '../../geometry/Transformation.js';

/** Rarely used by some commercial tile providers. Uses Elliptical Mercator projection. */
export class EPSG3395 extends EarthCRS {
	static code = 'EPSG:3395';
	static projection = MercatorProjection;

	static transformation = /* @__PURE__ */ (() => {
		const scale = 0.5 / (Math.PI * MercatorProjection.R);
		return new Transformation(scale, 0.5, -scale, 0.5);
	})();
}

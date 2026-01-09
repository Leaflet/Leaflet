import {Earth} from './CRS.Earth.js';
import {LonLat} from '../projection/Projection.LonLat.js';
import {Transformation} from '../../geometry/Transformation.js';

/*
 * @namespace CRS
 * @crs CRS.EPSG4326
 *
 * A common CRS among GIS enthusiasts. Uses simple Equirectangular projection.
 *
 * Leaflet complies with the [TMS coordinate scheme for EPSG:4326](https://wiki.osgeo.org/wiki/Tile_Map_Service_Specification#global-geodetic).
 * If you are using a `TileLayer` with this CRS, ensure that there are two 256x256 pixel tiles covering the
 * whole earth at zoom level zero, and that the tile coordinate origin is (-180,+90),
 * or (-180,-90) for `TileLayer`s with [the `tms` option](#tilelayer-tms) set.
 */

export class EPSG4326 extends Earth {
	static code = 'EPSG:4326';
	static projection = LonLat;
	static transformation = new Transformation(1 / 180, 1, -1 / 180, 0.5);
}

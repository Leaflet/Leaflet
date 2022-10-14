/*
 * @class Projection

 * An object with methods for projecting geographical coordinates of the world onto
 * a flat surface (and back). See [Map projection](https://en.wikipedia.org/wiki/Map_projection).

 * @property bounds: Bounds
 * The bounds (specified in CRS units) where the projection is valid

 * @method project(latlng: LatLng): Point
 * Projects geographical coordinates into a 2D point.
 * Only accepts actual `L.LatLng` instances, not arrays.

 * @method unproject(point: Point): LatLng
 * The inverse of `project`. Projects a 2D point into a geographical location.
 * Only accepts actual `L.Point` instances, not arrays.

 * Note that the projection instances do not inherit from Leaflet's `Class` object,
 * and can't be instantiated. Also, new classes can't inherit from them,
 * and methods can't be added to them with the `include` function.

 */

export {LonLat} from './Projection.LonLat';
export {Mercator} from './Projection.Mercator';
export {SphericalMercator} from './Projection.SphericalMercator';

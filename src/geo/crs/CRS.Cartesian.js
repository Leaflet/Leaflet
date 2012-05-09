/*
 * CRS.Cartesian is used for infinite coordinate systems that are not related to the Earth.  Examples
 * include indoor maps, gaming maps, etc.  We assume 0,0 is in the bottom right corner.
 */

L.CRS.Cartesian = L.Class.extend({
    includes: L.CRS,

    initialize: function(bounds)
    {
        this.unbounded = true;
        this._bounds = bounds;
        var boundsWidth = bounds.max.x - bounds.min.x;
        var boundsHeight = bounds.max.y - bounds.min.y;

        this.projection = L.Projection.Identity;
        this.transformation = new L.Transformation(1.0/boundsWidth, 0,
                                                  -1.0/boundsHeight, 1);
    }
});

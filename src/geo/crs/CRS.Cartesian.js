/*
 * CRS.Cartesian is used for infinite coordinate systems that are not related to the Earth.  Examples
 * include indoor maps, gaming maps, etc.  We assume 0,0 is in the bottom right corner.
 */

L.CRS.Cartesian = L.Class.extend({
    includes: L.CRS,

    initialize: function(bounds, options)
    {
        L.Util.setOptions(this, options);
        this.unbounded = true;
        this._bounds = bounds;

        var boundsWidth = bounds.max.x - bounds.min.x;
        var boundsHeight = bounds.max.y - bounds.min.y;

        var xOffset = options.falseEasting || 0;
        var xOffsetPercentage = 0 + xOffset / (boundsWidth * 1.0)

        var yOffset = options.falseNorthing || 0;
        var yOffsetPercentage = 1 - yOffset / (boundsHeight * 1.0)

        this.projection = L.Projection.Identity;
        this.transformation = new L.Transformation(1.0/boundsWidth, xOffsetPercentage,
            -1.0/boundsHeight, yOffsetPercentage);
    }
});

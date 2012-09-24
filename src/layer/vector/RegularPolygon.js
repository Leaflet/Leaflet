/*
 * L.RegularPolygon is used to display regular polygons on a map.
 */

L.RegularPolygon = L.Polygon.extend({
    options: {
        radius: 50,
        rotation: 0,
        sides: 6
    },

    initialize: function (center, options) {
        L.Polygon.prototype.initialize.call(this, [], options);

        this._center = center;
    },

    _calculateLimits: function () {
        var angle = Math.PI * ((1 / this.options.sides) - (1 / 2));
        var centerPixel = this._map.latLngToLayerPoint(this._center);
        var points = [];

        angle += ((this.options.rotation / 180) * Math.PI);

        for (var i = 0; i < this.options.sides; i++) {
            var rotatedAngle = angle + (i * 2 * Math.PI / this.options.sides);
            var x = centerPixel.x + (this.options.radius * Math.cos(rotatedAngle));
            var y = centerPixel.y + (this.options.radius * Math.sin(rotatedAngle));

            points.push(L.point(x, y));
        }

        this._parts = [points];
    },

    _updatePath: function () {
        if (!this._map) { return; }

        this._calculateLimits();
        L.Path.prototype._updatePath.call(this);
    }
});


L.regularPolygon = function (latlngs, options) {
    return new L.RegularPolygon(latlngs, options);
};
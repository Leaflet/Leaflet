/*
 * L.Ellipse is an ellipse overlay (with a certain radius in meters).
 */

L.Ellipse = L.Path.extend({
    initialize: function (latlng, radii, options) {
        L.Path.prototype.initialize.call(this, options);

        this._latlng = L.latLng(latlng);

        if (radii) {
            this._mRadiusX = radii.x;
            this._mRadiusY = radii.y;
        }
    },

    options: {
        fill: true
    },

    setLatLng: function (latlng) {
        this._latlng = L.latLng(latlng);
        return this.redraw();
    },

    setRadius: function (radii) {
        this._mRadiusX = radii.x;
        this._mRadiusY = radii.y;
        return this.redraw();
    },

    projectLatlngs: function () {
        var lngRadius = this._getLngRadius(),
            latRadius = this._getLatRadius(),
            latlng = this._latlng,
            pointLeft = this._map.latLngToLayerPoint([latlng.lat, latlng.lng - lngRadius]),
            pointBelow = this._map.latLngToLayerPoint([latlng.lat - latRadius, latlng.lng]);

        this._point = this._map.latLngToLayerPoint(latlng);
        this._radiusX = Math.max(this._point.x - pointLeft.x, 1);
        this._radiusY = Math.max(pointBelow.y - this._point.y, 1);
    },

    getBounds: function () {
        var lngRadius = this._getLngRadius(),
            latRadius = this._getLatRadius(),
            latlng = this._latlng;

        return new L.LatLngBounds(
                [latlng.lat - latRadius, latlng.lng - lngRadius],
                [latlng.lat + latRadius, latlng.lng + lngRadius]);
    },

    getLatLng: function () {
        return this._latlng;
    },

    getPathString: function () {
        var p = this._point,
            rx = this._radiusX,
            ry = this._radiusY;

        if (this._checkIfEmpty()) {
            return '';
        }

        if (L.Browser.svg) {
            return 'M' + p.x + ',' + (p.y - ry) +
                   'A' + rx + ',' + ry + ',0,1,1,' +
                   (p.x - 0.1) + ',' + (p.y - ry) + ' z';
        } else {
            p._round();
            rx = Math.round(rx);
            ry = Math.round(ry);
            return 'AL ' + p.x + ',' + p.y + ' ' + rx + ',' + ry + ' 0,' + (65535 * 360);
        }
    },

    getRadius: function () {
        return new L.point(this._mRadiusX, this._mRadiusY);
    },

    // TODO Earth hardcoded, move into projection code!

    _getLatRadius: function () {
        return (this._mRadiusY / 40075017) * 360;
    },

    _getLngRadius: function () {
        return ((this._mRadiusX / 40075017) * 360) / Math.cos(L.LatLng.DEG_TO_RAD * this._latlng.lat);
    },

    _checkIfEmpty: function () {
        if (!this._map) {
            return false;
        }
        var vp = this._map._pathViewport,
            r = this._radiusX,
            p = this._point;

        return p.x - r > vp.max.x || p.y - r > vp.max.y ||
               p.x + r < vp.min.x || p.y + r < vp.min.y;
    }
});

L.ellipse = function (latlng, radii, options) {
    return new L.Ellipse(latlng, radii, options);
};
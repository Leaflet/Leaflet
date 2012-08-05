// CM.LatLng represents a geographical point with latitude & longitude coordinates

L.LatLng = function( rawLat, rawLng, noWrap ) {
    var lat = parseFloat(rawLat),
        lng = parseFloat(rawLng);

    if( isNaN(lat) || isNaN(lng) ) {
        throw new Error('Invalid LatLng object:' + rawLat + ', ' + rawLng + ')');
    }

    if (noWrap !== true) {
        // latitude should be in -90..90
        lat = Math.max( Math.min(lat, 90), -90);

        // wrap longitude into -180..180
//        lng = (lng + 180) % 360  // clamp lng to max 360
//              + ( (lng < -180 || lng === 180) ? 180 : -180);
//                // if lng < 180 add 180,
//                // if lng === 180, set lng to 0

        var bound360 = (lng + 180) % 360;

        var toAdd;
        if( lng < -180
            || lng === 180 ) {

            // if less than -180, add 180, so it's > -180
            toAdd = 180;
        }
        else {
            // if
            toAdd = -180;
        }

        lng = bound360 + toAdd;

        // shift lng +180 degrees and
        // bound lng within 360 degrees
        // ie. lng == -179, bound360 == 1, toAdd = 180, final lng = -179
        // ie. lng == -180, bound360 == 0, toAdd = -180, final lng = -180
        // ie. lng == -181, bound360 == -1, toAdd = 180, final lng = 179
        //
        // ie. lng == -1, bound360 == 179, toAdd = -180, final lng = -1
        // ie. lng == 0, bound360 == 180, toAdd = -180, final lng = 0
        // ie. lng == 1, bound360 == 181, toAdd = -180, final lng = 1
        //
        // ie. lng == 179, bound360 == 359, toAdd = -180, final lng = 179
        // ie. lng == 180, bound360 == 0, toAdd = 180, final lng = 180
        // ie. lng == 181, bound360 == 1, toAdd = -180, final lng = -179
        //
        // ie. lng == 359, bound360 == 179, toAdd = -180, final lng = -1
        // ie. lng == 360, bound360 == 180, toAdd = -180, final lng = 0
        // ie. lng == 361, bound360 == 181, toAdd = -180, final lng = 1
    }

    this.lat = lat;
    this.lng = lng;
};

L.Util.extend(L.LatLng, {
    DEG_TO_RAD: Math.PI / 180,
    RAD_TO_DEG: 180 / Math.PI,
    MAX_MARGIN: 1.0E-9  // max error margin for "equals" check
});

L.LatLng.prototype = {
    equals: function(obj) {
        if(!obj) { return false; }
        obj = L.latLng(obj);

        var margin = Math.max( Math.abs(this.lat - obj.lat)
            ,Math.abs(this.lng - obj.lng));

        // round up to 9 decimal places
        margin = margin.toFixed(9);

        return margin <= L.LatLng.MAX_MARGIN;
    },

    toString: function() {
        return 'LatLng('
            + L.Util.formatNum(this.lat)
            + L.Util.formatNum(this.lng) + ')';
    },

    // Haversine distance formula, http://en.wikipedia.org/wiki/Haversine_formula
    distanceTo: function(other) {
        other = L.latLng(other);

        var R = 6378137,                            // earth radius in meters
            d2r = L.LatLng.DEG_TO_RAD,
            dLat = (other.lat - this.lat) * d2r,    // lat delta in radian
            dLon = (other.lng - this.lng) * d2r,    // lng delta in radian
            lat1 = this.lat * d2r,                  // lat1 in radian
            lat2 = other.lat * d2r,                 // lat2 in radian
            sin1 = Math.sin(dLat/2),
            sin2 = Math.sin(dLon/2);

        var a = sin1 * sin1
            + sin2 * sin2 * Math.cos(lat1) * Math.cos(lat2)

        return R * 2 * Math.atan2( Math.sqrt(a),
            Math.sqrt(1-a));
    }
};

/**------------------------------------
 *
 * @param { Number | Array<Number> } a
 * @param { Number } b
 * @param { Boolean } c
 * @return {*}
 * -------------------------------------
 */
L.latLng = function( a, b, c) {
    if( a instanceof L.LatLng ) {
        return a;
    }
    if( a instanceof Array ) {
        return new L.LatLng( a[0], a[1] );
    }
    if( isNaN(a) ) {
        return a;
    }
    return new L.LatLng( a, b, c);
}

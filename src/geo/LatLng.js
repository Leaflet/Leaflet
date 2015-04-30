/*
 * L.LatLng represents a geographical point with latitude and longitude coordinates.
 */

// constructs LatLng with different signatures
// (LatLng) or ([Number, Number]) or (Number, Number) or (Object)
L.LatLng = function (a, b, c) {
	var lat, lng, alt;
	if (L.Util.isArray(a) && typeof a[0] !== 'object') {
		if (a.length === 3) {
			lat = a[0];
			lng = a[1];
			alt = a[2];
		}
		if (a.length === 2) {
			lat = a[0];
			lng = a[1];
		}
	} else if (typeof a === 'object' && 'lat' in a) {
		lat = a.lat;
		lng = 'lng' in a ? a.lng : a.lon;
		alt = a.alt;
	} else {
		lat = a;
		lng = b;
		alt = c;
	}

	if (isNaN(lat) || isNaN(lng)) {
		throw new Error('Invalid LatLng object: (' + lat + ', ' + lng + ')');
	}

	this.lat = +lat;
	this.lng = +lng;

	if (alt !== undefined) {
		this.alt = +alt;
	}
};

L.LatLng.prototype = {
	equals: function (obj, maxMargin) {
		if (!obj) { return false; }

		obj = L.latLng(obj);

		var margin = Math.max(
		        Math.abs(this.lat - obj.lat),
		        Math.abs(this.lng - obj.lng));

		return margin <= (maxMargin === undefined ? 1.0E-9 : maxMargin);
	},

	toString: function (precision) {
		return 'LatLng(' +
		        L.Util.formatNum(this.lat, precision) + ', ' +
		        L.Util.formatNum(this.lng, precision) + ')';
	},

	distanceTo: function (other) {
		return L.CRS.Earth.distance(this, L.latLng(other));
	},

	wrap: function () {
		return L.CRS.Earth.wrapLatLng(this);
	},

	toBounds: function (sizeInMeters) {
		var latAccuracy = 180 * sizeInMeters / 40075017,
				lngAccuracy = latAccuracy / Math.cos((Math.PI / 180) * this.lat);

		return L.latLngBounds(
		        [this.lat - latAccuracy, this.lng - lngAccuracy],
		        [this.lat + latAccuracy, this.lng + lngAccuracy]);
	}
};


L.latLng = function (a, b, c) {
	if (a instanceof L.LatLng || a === null) {
		return a;
	}
	try {
		return new L.LatLng(a, b, c);
	} catch(err) {
		return null;
	}
};

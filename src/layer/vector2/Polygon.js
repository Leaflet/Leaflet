
L.Polygon = L.Polyline.extend({

	options: {
		fill: true
	},

	addLatLng: function (latlng) {
		// TODO with rings
	},

	spliceLatLngs: function () {
		// TODO with rings
	},

	getBounds: function () {
		var flat = this._latlngs[0] instanceof L.LatLng;
		return flat ? new L.LatLngsBounds(this._latlngs) : this._latlngs[0];
	},

	_convertLatLngs: function (latlngs) {
		var target = [],
		    flat = !L.Util.isArray(latlngs[0]) || typeof latlngs[0][0] === 'number',
		    len = latlngs.length;

		for (var i = 0; i < len; i++) {
			target[i] = flat ?
					L.latLng(latlngs[i]) :
					this._convertLatLngs(latlngs[i]);
		}

		if (flat && len >= 2 && target[0].equals(target[len - 1])) {
			target.pop();
		}

		return target;
	},

	_clipPoints: function () {
		var points = this._originalPoints,
		    bounds = this._renderer._bounds,
		    parts = points[0] instanceof L.Point ? [points] : points;

		this._parts = [];

		if (this.options.noClip) { return; }

		for (var i = 0, len = parts.length; i < len; i++) {
			var clipped = L.PolyUtil.clipPolygon(parts[i], bounds);
			if (clipped.length) {
				this._parts.push(clipped);
			}
		}
	},

	_updatePath: function () {
		this._renderer._updatePoly(this, true);
	}
});

L.polygon = function (latlngs, options) {
	return new L.Polyline(latlngs, options);
};

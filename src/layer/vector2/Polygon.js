
L.Polygon = L.Polyline.extend({

	options: {
		fill: true
	},

	_convertLatLngs: function (latlngs) {
		var result = L.Polyline.prototype._convertLatLngs.call(this, latlngs);

		// remove last point if it equals first one
		if (result.length >= 2 && result[0] instanceof L.LatLng && result[0].equals(result[len - 1])) {
			result.pop();
		}
		return result;
	},

	_clipPoints: function () {
		var points = this._originalPoints,
		    bounds = this._renderer._bounds,
		    parts = points[0] instanceof L.Point ? [points] : points,
		    w = this.options.weight,
		    p = new L.Point(w, w);

		// increase clip padding by stroke width to avoid stroke on clip edges
		bounds = new L.Bounds(bounds.min.subtract(p), bounds.max.add(p));

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
	return new L.Polygon(latlngs, options);
};


L.Polyline = L.Path.extend({

	options: {
		// how much to simplify the polyline on each zoom level
		// more = better performance and smoother look, less = more accurate
		smoothFactor: 1.0
		// noClip: false
	},

	initialize: function (latlngs, options) {
		L.setOptions(this, options);
		this._latlngs = this._convertLatLngs(latlngs);
	},

	getLatLngs: function () {
		// TODO rings
		return this._latlngs;
	},

	setLatLngs: function (latlngs) {
		this._latlngs = this._convertLatLngs(latlngs);
		return this.redraw();
	},

	addLatLng: function (latlng) {
		// TODO rings
		this._latlngs.push(L.latLng(latlng));
		return this.redraw();
	},

	spliceLatLngs: function () {
		// TODO rings
		var removed = [].splice.apply(this._latlngs, arguments);
		this._latlngs = this._convertLatLngs(this._latlngs);
		this.redraw();
		return removed;
	},

	// TODO remove this method?
	closestLayerPoint: function (p) {
		var minDistance = Infinity,
		    minPoint = null,
		    closest = L.LineUtil._sqClosestPointOnSegment,
		    p1, p2;

		for (var j = 0, jLen = this._parts.length; j < jLen; j++) {
			var points = this._parts[j];

			for (var i = 1, len = points.length; i < len; i++) {
				p1 = points[i - 1];
				p2 = points[i];

				var sqDist = closest(p, p1, p2, true);

				if (sqDist < minDistance) {
					minDistance = sqDist;
					minPoint = closest(p, p1, p2);
				}
			}
		}
		if (minPoint) {
			minPoint.distance = Math.sqrt(minDistance);
		}
		return minPoint;
	},

	getBounds: function () {
		// TODO rings
		return new L.LatLngBounds(this.getLatLngs());
	},

	_convertLatLngs: function (latlngs) {
		var result = [],
		    flat = !L.Util.isArray(latlngs[0]) || typeof latlngs[0][0] === 'number';

		for (var i = 0, len = latlngs.length; i < len; i++) {
			result[i] = flat ? L.latLng(latlngs[i]) : this._convertLatLngs(latlngs[i]);
		}

		return result;
	},

	_project: function () {
		this._originalPoints = this._projectLatlngs(this._latlngs);
	},

	_projectLatlngs: function (latlngs) {
		var result = [],
		    flat = latlngs[0] instanceof L.LatLng;

		// TODO flatten to 2-dimensional

		for (var i = 0, len = latlngs.length; i < len; i++) {
			result[i] = flat ?
					this._map.latLngToLayerPoint(latlngs[i]) :
					this._projectLatlngs(latlngs[i]);
		}
		return result;
	},

	_clipPoints: function () {
		var points = this._originalPoints;

		if (this.options.noClip) {
			this._parts = [points];
			return;
		}

		this._parts = [];

		var parts = this._parts,
		    bounds = this._renderer._bounds,
		    len = points.length,
		    i, k, segment;

		for (i = 0, k = 0; i < len - 1; i++) {
			segment = L.LineUtil.clipSegment(points[i], points[i + 1], bounds, i);

			if (!segment) { continue; }

			parts[k] = parts[k] || [];
			parts[k].push(segment[0]);

			// if segment goes out of screen, or it's the last one, it's the end of the line part
			if ((segment[1] !== points[i + 1]) || (i === len - 2)) {
				parts[k].push(segment[1]);
				k++;
			}
		}
	},

	// simplify each clipped part of the polyline
	_simplifyPoints: function () {
		var parts = this._parts,
			tolerance = this.options.smoothFactor;

		for (var i = 0, len = parts.length; i < len; i++) {
			parts[i] = L.LineUtil.simplify(parts[i], tolerance);
		}
	}
});

L.polyline = function (latlngs, options) {
	return new L.Polyline(latlngs, options);
};


L.Polyline = L.Path.extend({
	initialize: function(latlngs, options) {
		L.Path.prototype.initialize.call(this, options);
		this._latlngs = latlngs;
	},
	
	options: {
		// how much to simplify the polyline on each zoom level
		// more = better performance and smoother look, less = more accurate
		smoothFactor: 1.0,
		noClip: false
	},
	
	onAdd: function(map) {
		this._map = map;
		
		this._initElements();
		
		this._projectLatlngs();
		this._updatePath();

		map.on('viewreset', this._projectLatlngs, this);
		map.on('moveend', this._updatePath, this);
	},
	
	_projectLatlngs: function() {
		this._originalPoints = [];
		
		for (var i = 0, len = this._latlngs.length; i < len; i++) {
			this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);
		}
	},
	
	_buildPathStr: function() {
		this._pathStr = '';
		
		for (var i = 0, len = this._parts.length; i < len; i++) {
			this._buildPathPartStr(this._parts[i]);
		}
	},
	
	_buildPathPartStr: function(points) {
		var round = L.Path.VML;
		
		for (var j = 0, len2 = points.length, p; j < len2; j++) {
			p = points[j];
			if (round) p._round();
			this._pathStr += (j ? 'L' : 'M') + p.x + ' ' + p.y;
		}
	},
	
	_clipPoints: function() {
		var points = this._originalPoints,
			len = points.length,
			i, k, segment;

		if (this.options.noClip) {
			this._parts = [points];
			return;
		}
		
		this._parts = [];
		
		var parts = this._parts,
			vp = this._map._pathViewport,
			lu = L.LineUtil;
		
		for (i = 0, k = 0; i < len - 1; i++) {
			segment = lu.clipSegment(points[i], points[i+1], vp, i);
			if (!segment) continue;
			
			parts[k] = parts[k] || [];
			parts[k].push(segment[0]);
			
			// if segment goes out of screen, or it's the last one, it's the end of the line part
			if ((segment[1] != points[i+1]) || (i == len - 2)) {
				parts[k].push(segment[1]);
				k++;  
			}
		}
	},
	
	// simplify each clipped part of the polyline
	_simplifyPoints: function() {
		var parts = this._parts,
			lu = L.LineUtil;
		
		for (var i = 0, len = parts.length; i < len; i++) {
			parts[i] = lu.simplify(parts[i], this.options.smoothFactor);
		}
	},
	
	_updatePath: function() {
		this._clipPoints();
		this._simplifyPoints();
		
		this._buildPathStr();
		
		L.Path.prototype._updatePath.call(this);
	}
});
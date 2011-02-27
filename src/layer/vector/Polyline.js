
L.Polyline = L.Path.extend({
	initialize: function(latlngs, options) {
		L.Path.prototype.initialize.call(this, options);
		this._latlngs = latlngs;
	},
	
	options: {
		// how much to simplify the polyline on each zoom level
		// more = better performance and smoother look, less = more accurate
		smoothFactor: 1,
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
		
		for (var i = 0, len = this._latlngs.length, point; i < len; i++) {
			this._originalPoints[i] = this._map.latLngToLayerPoint(this._latlngs[i]);
		}
	},
	
	_buildPathStr: function() {
		this._pathStr = '';
		for (var i = 0, len = this._parts.length, part; i < len; i++) {
			part = this._parts[i];
			
			for (var j = 0, len2 = part.length, p; j < len2; j++) {
				p = part[j];
				this._pathStr += (j ? 'L' : 'M') + p.x + ' ' + p.y;
			}
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
		
		for (i = 0, k = 0; i < len - 1; i++) {
			segment = L.LineUtil.clipSegment(points[i], points[i+1], this._map._pathViewport, i);
			if (!segment) continue;
			
			this._parts[k] = this._parts[k] || [];
			this._parts[k].push(segment[0]);
			
			// if segment goes out of screen, or it's the last one, it's the end of the line part
			if ((segment[1] != points[i+1]) || (i == len - 2)) {
				this._parts[k].push(segment[1]);
				k++;  
			}
		}
	},
	
	_simplifyPoints: function() {
		//var l1 = 0, l2 = 0;
		// simplify each clipped part of the polyline
		for (var i = 0, len = this._parts.length; i < len; i++) {
			//l1 += this._parts[i].length;
			this._parts[i] = L.LineUtil.simplify(this._parts[i], this.options.smoothFactor);
			//l2 += this._parts[i].length;
		}
		//console.log(l1, l2, l2/l1);
	},
	
	_updatePath: function() {
		this._clipPoints();
		this._simplifyPoints();
		
		this._buildPathStr();
		
		L.Path.prototype._updatePath.call(this);
	}
});
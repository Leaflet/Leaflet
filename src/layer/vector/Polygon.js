/*
 * L.Polygon is used to display polygons on a map.
 */

L.Polygon = L.Polyline.extend({
	options: {
		fill: true
	},
	
	initialize: function(latlngs, options) {
		L.Polyline.prototype.initialize.call(this, latlngs, options);
		
		if (latlngs[0] instanceof Array) {
			this._latlngs = latlngs[0];
			this._holes = latlngs.slice(1);
		}
	},
	
	_projectLatlngs: function() {
		L.Polyline.prototype._projectLatlngs.call(this);
		
		// project polygon holes points
		// TODO move this logic to Polyline to get rid of duplication
		this._holePoints = [];
		
		if (!this._holes) return;
		
		for (var i = 0, len = this._holes.length, hole; i < len; i++) {
			this._holePoints[i] = [];
			
			for(var j = 0, len2 = this._holes[i].length; j < len2; j++) {
				this._holePoints[i][j] = this._map.latLngToLayerPoint(this._holes[i][j]);
			}
		}
	},
	
	_clipPoints: function() {
		var points = this._originalPoints;
		
		this._parts = [points].concat(this._holePoints);
		
		if (this.options.noClip) return;
		
		for (var i = 0, len = this._parts.length; i < len; i++) {
			this._parts[i] = L.LineUtil.clipPolygon(this._parts[i], this._map._pathViewport);
		}
	},
	
	_buildPathPartStr: function(points) {
		L.Polyline.prototype._buildPathPartStr.call(this, points);
		this._pathStr += L.Path.SVG ? 'z' : 'x';
	}
});
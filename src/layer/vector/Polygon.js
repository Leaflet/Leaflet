
L.Polygon = L.Polyline.extend({
	options: {
		fill: true
	},
	
	_clipPoints: function() {
		var points = this._originalPoints;
		
		if (this.options.noClip) {
			this._parts = [points];
			return;			
		}
		
		var clippedPoints = L.LineUtil.clipPolygon(points, this._map._pathViewport);
		
		this._parts = [clippedPoints]; //TODO include holes?
	},
	
	_buildPathPartStr: function(points) {
		L.Polyline.prototype._buildPathPartStr.call(this, points);
		this._pathStr += L.Path.SVG ? 'z' : 'x';
	}
});
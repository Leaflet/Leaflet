
L.Circle = L.Path.extend({
	initialize: function(latlng, radius, options) {
		L.Path.prototype.initialize.call(this, options);
		
		this._latlng = latlng;
		this._radius = radius;
	},
	
	options: {
		fill: true
	},
	
	onAdd: function(map) {
		L.Path.prototype.onAdd.call(this, map);
		map.on('viewreset', this._updatePath, this);
	},
	
	onRemove: function(map) {
		L.Path.prototype.onRemove.call(this, map);
		map.off('viewreset', this._updatePath, this);
	},
	
	projectLatlngs: function() {
		this._point = this._map.latLngToLayerPoint(this._latlng);
	},
	
	getPathString: function() {
		var p = this._point,
			r = this._radius;
		
		if (L.Path.SVG) {
			return "M" + p.x + "," + (p.y - r) + 
					"A" + r + "," + r + ",0,1,1," + 
					(p.x - 0.1) + "," + (p.y - r) + " z";
		} else {
			p._round();
			r = Math.round(r);
			return "AL " + p.x + "," + p.y + " " + r + "," + r + " 0," + (65535 * 360);
		}
	}
});
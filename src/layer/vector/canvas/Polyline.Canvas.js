
L.Polyline.include(L.Path.SVG || !L.Path.CANVAS ? {} : {
	_initEvents: function() {
		if (this.options.clickable) {
			// TODO hand cursor
			// TODO mouseover, mouseout, dblclick 
			this._map.on('click', this._onClick, this);
		}
	},
	
	_onClick: function(e) {
		var p1 = this._point, 
			p2 = e.layerPoint;
		
		var i, j, len, len2, dist, part;
	
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];
			for (j = 0, len2 = part.length; j < len2 - 1; j++) {
				dist = L.LineUtil.pointToSegmentDistance(e.layerPoint, part[j], part[j+1]);
				
				if (dist <= this.options.weight / 2) {
					this.fire('click', e);
					return;
				}
			}
		}
	}
});
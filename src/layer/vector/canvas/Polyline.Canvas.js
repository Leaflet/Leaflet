
L.Polyline.include(L.Path.SVG || !L.Path.CANVAS ? {} : {
	_initEvents: function() {
		if (this.options.clickable) {
			// TODO hand cursor
			// TODO mouseover, mouseout, dblclick 
			this._map.on('click', this._onClick, this);
		}
	},
	
	_containsPoint: function(p, closed) {
		var i, j, k, len, len2, dist, part;
		
		for (i = 0, len = this._parts.length; i < len; i++) {
			part = this._parts[i];
			for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
				if (!closed && (j === 0)) { continue; }
				
				dist = L.LineUtil.pointToSegmentDistance(p, part[k], part[j]);
				
				if (dist <= this.options.weight / 2) {
					return true;
				}
			}
		}
		return false;
	},
	
	_onClick: function(e) {
		if (this._containsPoint(e.layerPoint)) {
			this.fire('click', e);
		}
	}
});
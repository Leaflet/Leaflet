/*
 * Circle canvas specific drawing parts.
 */

L.Circle.include(L.Path.SVG || !L.Path.CANVAS ? {} : {
	_drawPath: function() {
		var p = this._point;
		
		this._updateStyle();
		this._ctx.arc(p.x, p.y, this._radius, 0, Math.PI * 2);
	},
	
	_initEvents: function() {
		if (this.options.clickable) {
			// TODO hand cursor
			// TODO mouseover, mouseout, dblclick 
			this._map.on('click', this._onClick, this);
		}
	},
	
	_onClick: function(e) {
		var p1 = this._point, 
			p2 = e.layerPoint,
			w2 = this.options.stroke ? this.options.weight / 2 : 0;
		
		if (p1.distanceTo(p2) <= this._radius + w2) {
			this.fire('click', e);
		}
	}
});

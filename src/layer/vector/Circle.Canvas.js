/*
 * Circle canvas specific drawing parts.
 */

L.Circle = /*L.Path.SVG || !L.Path.Canvas ? L.Circle :*/ L.Circle.extend({
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
			p2 = e.layerPoint;
		
		// TODO take strokeWidth into account
		if (p1.distanceTo(p2) <= this._radius) {
			this.fire('click', e);
		}
	}
});

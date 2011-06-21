/*
 * Circle canvas specific drawing parts.
 */

L.Circle = L.Path.SVG || !L.Path.Canvas ? L.Circle : L.Circle.extend({
	_drawPath : function() {
		this._updateStyle();
		var p = this._point,
		r = this._radius;
		this._ctx.arc(p.x,p.y,r, 0,Math.PI*2);
	}
});

/*
 * Vector rendering for all browsers that support canvas.
 */

L.Canvas = L.Renderer.extend({

	onAdd: function () {
		var container = this._container = document.createElement('canvas');

		if (this._zoomAnimated) {
			L.DomUtil.addClass(container, 'leaflet-zoom-animated');
		}

		this._ctx = container.getContext('2d');

		this.getPane().appendChild(container);
		this._update();
	},

	onRemove: function () {
		L.DomUtil.remove(this._container);
	},

	_update: function () {
		if (this._map._animatingZoom) { return; }

		L.Renderer.prototype._update.call(this);

		var b = this._bounds,
		    size = b.getSize(),
		    container = this._container;

		L.DomUtil.setPosition(container, b.min);
		container.width = size.x;
		container.height = size.y;
		this._ctx.translate(-b.min.x, -b.min.y);
	},

	_initPath: function (layer) {
		this.on('redraw', layer._updatePath, layer);

		if (layer.options.clickable) {
			L.DomEvent
				.on(this._container, 'mousemove', this._onMouseMove, layer)
				.on(this._container, 'click', this._onClick, layer);
		}
	},

	_addPath: L.Util.falseFn,

	_removePath: function (layer) {
		if (layer.options.clickable) {
			L.DomEvent
				.off(this._container, 'mousemove', this._onMouseMove, layer)
				.off(this._container, 'click', this._onClick, layer);
		}

		this.off('redraw', layer._updatePath, layer);
		this._requestRedraw();
	},

	_updateStyle: function () {
		this._requestRedraw();
	},

	_requestRedraw: function () {
		if (this._map) {
			this._redrawRequest = this._redrawRequest || L.Util.requestAnimFrame(this._fireRedraw, this);
		}
	},

	_fireRedraw: function () {
		this._redrawRequest = null;
		this._container.width = this._container.width; // clear canvas
		this.fire('redraw');
	},

	_updatePoly: function (layer, closed) {

		var i, j, len2, p,
		    parts = layer._parts,
		    len = parts.length,
		    ctx = this._ctx,
		    options = layer.options;

		if (!len) { return; }

		ctx.beginPath();

		for (i = 0; i < len; i++) {
			for (j = 0, len2 = parts[i].length; j < len2; j++) {
				p = parts[i][j];
				ctx[j ? 'lineTo' : 'moveTo'](p.x, p.y);
			}
			if (closed) {
				ctx.closePath();
			}
		}

		this._fillStroke(ctx, options);

		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},

	_updateCircle: function (layer) {
		var p = layer._point,
		    ctx = this._ctx;

		if (!layer._empty()) {
			ctx.beginPath();
			ctx.arc(p.x, p.y, layer._radius, 0, Math.PI * 2, false);

			this._fillStroke(ctx, layer.options);
		}
	},

	_fillStroke: function (ctx, options) {
		ctx.globalAlpha = 1;

		if (options.fill) {
			ctx.globalAlpha = options.fillOpacity;
			ctx.fillStyle = options.fillColor || options.color;
			ctx.fill('evenodd');
		}

		if (options.stroke) {
			ctx.globalAlpha = options.opacity;
			ctx.lineWidth = options.weight;
			ctx.strokeStyle = options.color;
			ctx.lineCap = options.lineCap;
			ctx.lineJoin = options.lineJoin;
			ctx.stroke();
		}
	},

	_onClick: function (e) {
		var point = this._map.mouseEventToLayerPoint(e);

		if (this._containsPoint(point)) {
			this._onMouseClick(e);
		}
	},

	_onMouseMove: function (e) {
		if (!this._map || this._map._animatingZoom) { return; }

		var point = this._map.mouseEventToLayerPoint(e);

		// TODO don't do on each move
		if (this._containsPoint(point)) {
			this._renderer._container.style.cursor = 'pointer';
			this._mouseInside = true;
			this._fireMouseEvent(e, 'mouseover');

		} else if (this._mouseInside) {
			this._renderer._container.style.cursor = '';
			this._mouseInside = false;
			this._fireMouseEvent(e, 'mouseout');
		}
	}

	// TODO _bringToFront & _bringToBack
});

L.Browser.canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

L.canvas = function () {
	return new L.Canvas();
};


L.Polyline.prototype._containsPoint = function (p, closed) {
	var i, j, k, len, len2, part,
	    w = (this.options.stroke ? this.options.weight / 2 : 0) + (L.Browser.touch ? 10 : 0);

	for (i = 0, len = this._parts.length; i < len; i++) {
		part = this._parts[i];

		for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
			if (!closed && (j === 0)) { continue; }

			if (L.LineUtil.pointToSegmentDistance(p, part[k], part[j]) <= w) {
				return true;
			}
		}
	}
	return false;
};

L.Polygon.prototype._containsPoint = function (p) {
	var inside = false,
	    part, p1, p2, i, j, k, len, len2;

	// TODO optimization: check if within bounds first

	// click on polygon border
	if (L.Polyline.prototype._containsPoint.call(this, p, true)) { return true; }

	// ray casting algorithm for detecting if point is in polygon
	for (i = 0, len = this._parts.length; i < len; i++) {
		part = this._parts[i];

		for (j = 0, len2 = part.length, k = len2 - 1; j < len2; k = j++) {
			p1 = part[j];
			p2 = part[k];

			if (((p1.y > p.y) !== (p2.y > p.y)) && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x)) {
				inside = !inside;
			}
		}
	}

	return inside;
};

L.Circle.prototype._containsPoint = function (p) {
	var center = this._point,
	    w2 = this.options.stroke ? this.options.weight / 2 : 0;

	return (p.distanceTo(center) <= this._radius + w2);
};

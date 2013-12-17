/*
 * Vector rendering for all browsers that support canvas.
 */

L.Canvas = L.Renderer.extend({

	onAdd: function () {
		var container = this._container;

		if (!container) {
			container = this._container = document.createElement('canvas');

			if (this._zoomAnimated) {
				L.DomUtil.addClass(container, 'leaflet-zoom-animated');
			}

			this._ctx = container.getContext('2d');
		}

		this.getPane().appendChild(container);
		this._update();

		this.fire('redraw');
	},

	onRemove: function () {
		L.DomUtil.remove(this._container);
	},

	_update: function () {
		if (this._map._animatingZoom) { return; }

		L.Renderer.prototype._update.call(this);

		var b = this._bounds,
		    size = b.getSize(),
		    m = L.Browser.retina ? 2 : 1,
		    container = this._container;

		L.DomUtil.setPosition(container, b.min);
		container.width = m * size.x;
		container.height = m * size.y;
		container.style.width = size.x + 'px';
		container.style.height = size.y + 'px';

		if (L.Browser.retina) {
			this._ctx.scale(2, 2);
		}

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

		layer._removed = true;
		this._requestRedraw(layer);
	},

	_updateStyle: function (layer) {
		this._requestRedraw(layer);
	},

	_requestRedraw: function (layer) {
		if (this._map) {
			this._redrawBounds = this._redrawBounds || new L.Bounds();
			this._redrawBounds.extend(layer._pxBounds.min).extend(layer._pxBounds.max);
			this._redrawRequest = this._redrawRequest || L.Util.requestAnimFrame(this._fireRedraw, this);
		}
	},

	_fireRedraw: function () {
		this._redrawRequest = null;
		this._clear = true;
		this.fire('redraw');
		this._clear = false;
		this.fire('redraw');
		this._redrawBounds = null;
	},

	_updatePoly: function (layer, closed) {

		var i, j, len2, p,
		    parts = layer._parts,
		    len = parts.length,
		    ctx = this._ctx;

	    if (!len || this._redrawBounds && !this._redrawBounds.intersects(layer._pxBounds)) { return; }

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

		this._fillStroke(ctx, layer);

		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},

	_updateCircle: function (layer) {

		if (layer._empty()) { return; }

		var p = layer._point,
		    ctx = this._ctx;

		ctx.beginPath();
		ctx.arc(p.x, p.y, layer._radius, 0, Math.PI * 2, false);

		this._fillStroke(ctx, layer);
	},

	_fillStroke: function (ctx, layer) {
		var clear = this._clear;

		if (layer._removed && !clear) {
			layer._removed = false;
			this.off('redraw', layer._updatePath, layer);
			return;
		}

		var options = layer.options;

		ctx.globalCompositeOperation = clear ? 'destination-out' : 'source-over';

		if (options.fill) {
			ctx.globalAlpha = clear ? 1 : options.fillOpacity;
			ctx.fillStyle = options.fillColor || options.color;
			ctx.fill('evenodd');
		}

		if (options.stroke) {
			ctx.globalAlpha = clear ? 1 : options.opacity;

			// if clearing shape, do it with the previously drawn line width
			layer._prevWeight = ctx.lineWidth = clear ? layer._prevWeight + 1 : options.weight;

			ctx.strokeStyle = options.color;
			ctx.lineCap = options.lineCap;
			ctx.lineJoin = options.lineJoin;
			ctx.stroke();
		}
	},

	_onClick: function (e) {
		if (this._containsPoint(this._map.mouseEventToLayerPoint(e))) {
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
	},

	_bringToFront: function () {},
	_bringToBack: function () {}

	// TODO _bringToFront & _bringToBack
});

L.Browser.canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

L.canvas = function () {
	return L.Browser.canvas ? new L.Canvas() : null;
};

L.Canvas.instance = L.canvas();


L.Polyline.prototype._containsPoint = function (p, closed) {
	var i, j, k, len, len2, part,
	    w = this._clickTolerance();

	if (!this._pxBounds.contains(p)) { return false; }

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

	if (!this._pxBounds.contains(p)) { return false; }

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

	// also check if it's on polygon stroke
	return inside || L.Polyline.prototype._containsPoint.call(this, p, true);
};

L.Circle.prototype._containsPoint = function (p) {
	return p.distanceTo(this._point) <= this._radius + this._clickTolerance();
};

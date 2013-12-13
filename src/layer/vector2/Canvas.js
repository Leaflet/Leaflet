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
			this._initEvents(layer);
		}
	},

	_addPath: L.Util.falseFn,

	_removePath: function (layer) {
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

		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},

	// _bringToFront: function (layer) {
	// 	// TODO
	// },

	// _bringToBack: function (layer) {
	// 	// TODO
	// },

	// _initEvents: function (layer) {
	// 	// TODO
	// }
});

L.Browser.canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

L.canvas = function () {
	return new L.Canvas();
};

/*
 * Vector rendering for all browsers that support canvas.
 */

L.Canvas = L.Renderer.extend({

	onAdd: function () {
		var container = this._container = document.createElement('canvas');

		if (this._zoomAnimated) {
			L.DomUtil.addClass(container, 'leaflet-zoom-animated');
		}

		var ctx = this._ctx = container.getContext('2d');

		ctx.lineCap = 'round';
		ctx.lineJoin = 'round';

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
		if (layer.options.clickable) {
			this._initEvents(layer);
		}
		this._updateStyle(layer);
	},

	_addPath: function () {},

	_removePath: function (layer) {
		L.DomUtil.remove(layer._path);
	},

	_updateStyle: function (layer) {
		var options = layer.options,
			ctx = this._ctx;

		if (options.stroke) {
			ctx.lineWidth = options.weight;
			ctx.strokeStyle = options.color;
		}
		if (options.fill) {
			ctx.fillStyle = options.fillColor || options.color;
		}
	},

	_updatePoly: function (layer, closed) {

		var i, j, len, len2, p, drawMethod,
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

		// TODO why save/restore?
		ctx.save();
		this._updateStyle(layer);

		if (options.fill) {
			ctx.globalAlpha = options.fillOpacity;
			ctx.fill('evenodd');
		}

		if (options.stroke) {
			ctx.globalAlpha = options.opacity;
			ctx.stroke();
		}

		ctx.restore();
		// TODO optimization: 1 fill/stroke for all features with equal style instead of 1 for each feature
	},

	_bringToFront: function (layer) {
		// TODO
	},

	_bringToBack: function (layer) {
		// TODO
	},

	_initEvents: function (layer) {
		// TODO
	}
});

L.Browser.canvas = (function () {
	return !!document.createElement('canvas').getContext;
}());

L.canvas = function () {
	return new L.Canvas();
};

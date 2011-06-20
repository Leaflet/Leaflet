/*
 * Vector rendering for all browsers that support canvas.
 */

L.Path.Canvas = (function() {
	return !!document.createElement('canvas').getContext;
})();

L.Path = L.Path.SVG ? L.Path : !L.Path.Canvas ? L.Path.VML : L.Path.extend({
	initialize: function(options) {
		L.Util.setOptions(this, options);
	},
	
	statics: {
		CLIP_PADDING: 0.02
	},
	
	options :  {
		updateOnMoveEnd: true
	},
		
	_initRoot: function() {
		if (!this._map._pathRoot) {
			this._map._pathRoot = document.createElement("canvas");
			this._ctx = this._map._pathRoot.getContext('2d');
			
			this._map._panes.overlayPane.appendChild(this._map._pathRoot);

			this._map.on('moveend', this._updateCanvasViewport, this);
			this._updateCanvasViewport();
		}
		else {
			this._ctx = this._map._pathRoot.getContext('2d');
		}
	},
		
	_initStyle: function() {
		//NOOP.
	},
		
	_updateStyle: function() {
		if (this.options.stroke) {
			this._ctx.lineWidth = this.options.weight;
			this._ctx.strokeStyle = this.options.color;
		}
		if (this.options.fill) {
			this._ctx.fillStyle = this.options.fillColor || this.options.color;
		}
	},
	
	_drawPath : function() {	
		this._updateStyle();				
		this._ctx.beginPath();
						
		for (var i = 0, len = this._parts.length; i < len; i++) {
			for (var j=0;j<this._parts[i].length;j++) {
				var point = this._parts[i][j];
				
				if (j === 0) {
					if (i > 0) {
						this._ctx.closePath();
					}
					this._ctx.moveTo(point.x, point.y);
				}
				else {
					this._ctx.lineTo(point.x,point.y);
				}
			}
		}
		
		
	},
	
	_updatePath: function() {
		this._drawPath();
		
		if (this.options.fill) {
			this._ctx.globalAlpha = this.options.fillOpacity;
			this._ctx.closePath();
			this._ctx.fill();	
		}
		
		if (this.options.stroke) {
			this._ctx.globalAlpha = this.options.opacity;
			this._ctx.stroke();
		}
		
	},

	_updateCanvasViewport: function() {
		this._updateViewport();
		
		var vp = this._map._pathViewport,
			min = vp.min,
			max = vp.max,
			width = max.x - min.x,
			height = max.y - min.y,
			root = this._map._pathRoot,
			pane = this._map._panes.overlayPane;
	
		// Hack to make flicker on drag end on mobile webkit less irritating
		// Unfortunately I haven't found a good workaround for this yet
		if (L.Browser.mobileWebkit) { pane.removeChild(root); }
				
		L.DomUtil.setPosition(root, min);
		root.setAttribute('width', width);		//Attention resets canvas, but not on mobile webkit!
		root.setAttribute('height', height);
		
		var vp = this._map._pathViewport;
		this._ctx.translate(-vp.min.x, -vp.min.y);

		
		if (L.Browser.mobileWebkit) { pane.appendChild(root); }
	},
		
	_initEvents :function() {
		//doesn't work currently.
	}
});

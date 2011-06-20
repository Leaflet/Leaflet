/*
 * Vector rendering for all browsers that support canvas.
 * Florian Falkner, General Solutions Steiner GmbH
 */

L.Path.Canvas = (function() {
	return !!document.createElement('canvas').getContext;
})();

L.Path = L.Path.SVG ? L.Path : !L.Path.Canvas ? L.Path.VML : L.Path.extend({
	statics: {
		CLIP_PADDING: 0.02
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
	
	_hexToRGB : function(h) {
		h = (h.charAt(0)=="#") ? h.substring(1,h.length):h;
		while (h.length < 6) {
			h += h;
		}
		
		return parseInt(h.substring(0,2),16) + "," +
			parseInt(h.substring(2,4),16) + "," + 
			parseInt(h.substring(4,6),16)
	},
	
	_getStyle : function(color, opacity) {
		return "rgba(" + this._hexToRGB(color) +"," + opacity + ")";
	},
	
	_updateStyle: function() {
		if (this.options.stroke) {
			this._ctx.lineWidth = this.options.weight;
			this._ctx.strokeStyle = this._getStyle(this.options.color, this.options.opacity);
		}
		if (this.options.fill) {
			this._ctx.fillStyle = this._getStyle(this.options.fillColor || this.options.color, this.options.fillOpacity);
		}
	},
	
	_drawPath : function() {					
		this._updateStyle();
			
		if (this.setRadius) {
			var p = this._point,
			r = this._radius;
			this._ctx.arc(p.x,p.y,r, 0,Math.PI*2);
		}
		else {
			this._ctx.beginPath();
						
			for (var i = 0, len = this._parts.length; i < len; i++) {
				for (var j=0;j<this._parts[i].length;j++) {
					var point = this._parts[i][j];
					if (i == 0 && j == 0) {
						this._ctx.moveTo(point.x, point.y);
					}
					else {
						this._ctx.lineTo(point.x,point.y);
					}
				}
			}
		}
	},
	
	_updatePath: function() {
		this._drawPath();
		
		if (this.options.fill) {
			if (!this.setRadius) {
				this._ctx.closePath();
			}
			this._ctx.fill();	
		}
		
		if (this.options.stroke) {
			this._ctx.stroke();
		}
		
	},

	_resetCanvas : function() {		
		this._ctx.clearRect(0, 0, this._map._pathRoot.width, this._map._pathRoot.height);
		var w = this._map._pathRoot.width;
		this._map._pathRoot.width = 1;
		this._map._pathRoot.width = w;
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
		//if (L.Browser.mobileWebkit) { pane.removeChild(root); }
				
		L.DomUtil.setPosition(root, min);
		root.setAttribute('width', width);		//Attention resets canvas, but not on mobile webkit!
		root.setAttribute('height', height);
		
		this._resetCanvas();
		var vp = this._map._pathViewport;
		this._ctx.translate(-vp.min.x, -vp.min.y);

		
		//if (L.Browser.mobileWebkit) { pane.appendChild(root); }
	},
		
	_initEvents :function() {
		//doesn't work currently.
	}
});

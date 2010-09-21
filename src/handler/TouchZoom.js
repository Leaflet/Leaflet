/*
 * L.Handler.TouchZoom is used internally by L.Map to add touch-zooming on Webkit-powered mobile browsers.
 */

L.Handler.TouchZoom = L.Handler.extend({
	
	enable: function() {
		if (!L.Browser.mobileWebkit || this._enabled) { return; }
		L.DomEvent.addListener(this._map._container, 'touchstart', this._onTouchStart, this);
		this._enabled = true;
	},
	
	disable: function() {
		if (!this._enabled) { return; }
		L.DomEvent.removeListener(this._map._container, 'touchstart', this._onTouchStart, this);
		this._enabled = false;
	},
	
	_onTouchStart: function(e) {
		if (!e.touches || e.touches.length != 2) { return; }
		
		var p1 = this._map.mouseEventToLayerPoint(e.touches[0]),
			p2 = this._map.mouseEventToLayerPoint(e.touches[1]),
			viewCenter = this._map.containerPointToLayerPoint(this._map.getSize().divideBy(2));
		
		this._startCenter = p1.add(p2).divideBy(2, true);
		this._startDist = p1.distanceTo(p2);
		this._startTransform = this._map._mapPane.style.webkitTransform;

		this._centerOffset = viewCenter.subtract(this._startCenter);

		L.DomEvent.addListener(document, 'touchmove', this._onTouchMove, this);
		L.DomEvent.addListener(document, 'touchend', this._onTouchEnd, this);
		
		L.DomEvent.preventDefault(e);
	},
	
	_onTouchMove: function(e) {
		if (!e.touches || e.touches.length != 2) { return; }
		
		var p1 = this._map.mouseEventToLayerPoint(e.touches[0]),
			p2 = this._map.mouseEventToLayerPoint(e.touches[1]);
		
		this._scale = p1.distanceTo(p2) / this._startDist;
		this._delta = p1.add(p2).divideBy(2, true).subtract(this._startCenter);
		
		/*
		 * Used 2 translates instead of transform-origin because of a very strange bug - 
		 * it didn't count the origin on the first touch-zoom but worked correctly afterwards 
		 */
		
		/*this._map._mapPane.style.webkitTransformOrigin = 
		this._startCenter.x + 'px ' + this._startCenter.y + 'px';*/

		this._map._mapPane.style.webkitTransform = [
            this._startTransform,
            L.DomUtil.getTranslateString(this._delta),
            L.DomUtil.getTranslateString(this._startCenter),
            'scale(' + this._scale + ')',
            L.DomUtil.getTranslateString(this._startCenter.multiplyBy(-1))
        ].join(" ");
		
		L.DomEvent.preventDefault(e);
	},
	
	_onTouchEnd: function(e) {
		if (!e.touches || e.touches.length >= 2 || !this._scale) { return; }
		
		var zoom = this._map.getZoom() + Math.round(Math.log(this._scale)/Math.LN2),
			centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale),
			centerPoint = this._map.getPixelOrigin().add(this._startCenter).add(centerOffset),
			center = this._map.unproject(centerPoint);
		
		map.setView(center, zoom, true);
		
		this._scale = null;
		L.DomEvent.removeListener(document, 'touchmove', this._onTouchMove);
		L.DomEvent.removeListener(document, 'touchend', this._onTouchEnd);
	}
});
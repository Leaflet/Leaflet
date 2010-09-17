L.Handler.TouchZoom = L.Handler.extend({
	
	enable: function() {
		if (!L.Browser.mobileWebkit) { return; }
		L.DomEvent.addListener(this._map._container, 'touchstart', this._onTouchStart, this);
	},
	
	_getClientPoint: function(e) {
		return new L.Point(e.clientX, e.clientY);
	},
	
	_onTouchStart: function(e) {
		if (!e.touches || e.touches.length != 2) { return; }
		
		var p1 = this._getClientPoint(e.touches[0]),
			p2 = this._getClientPoint(e.touches[1]),
			mapPanePos = L.DomUtil.getPosition(this._map._mapPane),
			containerOffset = L.DomUtil.getCumulativeOffset(this._map._container);
		
		this._clientStartCenter = p1.add(p2).divideBy(2, true);
		this._startCenter = this._clientStartCenter.subtract(containerOffset).subtract(mapPanePos);
		this._startDist = p1.distanceTo(p2);
		this._startTransform = this._map._mapPane.style.webkitTransform;

		this._centerOffset = this._map.getSize().divideBy(2, true).subtract(mapPanePos).subtract(this._startCenter);

		L.DomEvent.addListener(document, 'touchmove', this._onTouchMove, this);
		L.DomEvent.addListener(document, 'touchend', this._onTouchEnd, this);
		
		L.DomEvent.preventDefault(e);
	},
	
	_onTouchMove: function(e) {
		if (!e.touches || e.touches.length != 2) { return; }
		
		var p1 = this._getClientPoint(e.touches[0]),
			p2 = this._getClientPoint(e.touches[1]),
			dist = p1.distanceTo(p2);
		
		this._delta = p1.add(p2).divideBy(2, true).subtract(this._clientStartCenter);
		
		this._scale = dist / this._startDist;
		
		/*
		 * Used 2 translates instead of transform-origin because of a very strange bug - 
		 * it didn't count the origin on the first touch-zoom but worked correctly afterwards 
		 */
		
		var open = L.DomUtil.TRANSLATE_OPEN,
			close = L.DomUtil.TRANSLATE_CLOSE;
	
		/*this._map._mapPane.style.webkitTransformOrigin = 
		this._startCenter.x + 'px ' + this._startCenter.y + 'px';*/

		this._map._mapPane.style.webkitTransform = this._transform = this._startTransform +
				' ' + open + this._delta.x + 'px,' + this._delta.y + 'px' + close +
				' ' + open + this._startCenter.x + 'px,' + this._startCenter.y + 'px' + close +
				' scale(' + this._scale + ')' + 
				' ' + open + '-' + this._startCenter.x + 'px,-' + this._startCenter.y + 'px' + close;
		
		L.DomEvent.preventDefault(e);
	},
	
	_onTouchEnd: function(e) {
		if (!e.touches || e.touches.length >= 2 || !this._scale) { return; }
		
		var zoom = this._map.getZoom() + Math.round(Math.log(this._scale)/Math.LN2),
			centerOffset = this._centerOffset.subtract(this._delta).divideBy(this._scale, true),
			center = this._map.unproject(this._map.getPixelOrigin().add(this._startCenter).add(centerOffset));
		
		map.setView(center, zoom, true);
		
		this._scale = null;
		L.DomEvent.removeListener(document, 'touchmove', this._onTouchMove);
		L.DomEvent.removeListener(document, 'touchend', this._onTouchEnd);
	}
});
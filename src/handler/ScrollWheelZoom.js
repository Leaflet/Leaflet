/*
 * L.Handler.ScrollWheelZoom is used internally by L.Map to enable mouse scroll wheel zooming on the map.
 */

L.Handler.ScrollWheelZoom = L.Handler.extend({
	enable: function() {
		if (this._enabled) { return; }
		L.DomEvent.addListener(this._map._container, 'mousewheel', this._onWheelScroll, this);
		this._delta = 0;
		this._enabled = true;
	},
	
	disable: function() {
		if (!this._enabled) { return; }
		L.DomEvent.removeListener(this._map._container, 'mousewheel', this._onWheelScroll);
		this._enabled = false;
	},
	
	_onWheelScroll: function(e) {
		this._delta += L.DomEvent.getWheelDelta(e);
		this._lastMousePos = this._map.mouseEventToContainerPoint(e);
		
		clearTimeout(this._timer);
		this._timer = setTimeout(L.Util.bind(this._performZoom, this), 50);
		
		L.DomEvent.preventDefault(e);
	},
	
	_performZoom: function() {
		var delta = Math.round(this._delta);
		this._delta = 0;
		
		if (!delta) { return; }
		
		var center = this._getCenterForScrollWheelZoom(this._lastMousePos, delta),
			zoom = this._map.getZoom() + delta;
		
		if (this._map._limitZoom(zoom) == this._map._zoom) { return; }

		this._map.setView(center, zoom);
	},
	
	_getCenterForScrollWheelZoom: function(mousePos, delta) {
		var centerPoint = this._map.getPixelBounds().getCenter(),
			viewHalf = this._map.getSize().divideBy(2),
			centerOffset = mousePos.subtract(viewHalf).multiplyBy(1 - Math.pow(2, -delta)),
			newCenterPoint = centerPoint.add(centerOffset);
		return this._map.unproject(newCenterPoint, this._map._zoom, true);
	}
});
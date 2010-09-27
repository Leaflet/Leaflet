/*
 * L.Handler.ScrollWheelZoom is used internally by L.Map to enable mouse scroll wheel zooming on the map.
 */

L.Handler.ScrollWheelZoom = L.Handler.extend({
	enable: function() {
		if (this._enabled) { return; }
		L.DomEvent.addListener(this._map._container, 'mousewheel', this._onWheelScroll, this);
		this._enabled = true;
	},
	
	disable: function() {
		if (!this._enabled) { return; }
		L.DomEvent.removeListener(this._map._container, 'mousewheel', this._onWheelScroll);
		this._enabled = false;
	},
	
	_onWheelScroll: function(e) {
		var delta = L.DomEvent.getWheelDelta(e);
		
		delta = (delta > 0 ? Math.ceil(delta) : Math.floor(delta));
		
		var center = this._getCenterForScrollWheelZoom(e, delta),
			zoom = this._map.getZoom() + delta;
		
		//TODO clamp many scroll events into one within a time interval
		this._map.setView(center, zoom);
		
		L.DomEvent.preventDefault(e);
	},
	
	_getCenterForScrollWheelZoom: function(e, delta) {
		var centerPoint = this._map.getPixelBounds().getCenter(),
			viewHalf = this._map.getSize().divideBy(2),
			mousePos = this._map.mouseEventToContainerPoint(e),
			centerOffset = mousePos.subtract(viewHalf).multiplyBy(1 - Math.pow(2, -delta)),
			newCenterPoint = centerPoint.add(centerOffset);
		return this._map.unproject(newCenterPoint);
	}
});
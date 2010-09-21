/*
 * L.Handler.DoubleClickZoom is used internally by L.Map to add double-click zooming.
 */

L.Handler.DoubleClickZoom = L.Handler.extend({
	statics: {
		DOUBLE_TAP_DELAY: 500 
	},
	
	enable: function() {
		if (this._enabled) { return; }
		L.DomEvent.addListener(this._map._container, 
				L.Browser.mobileWebkit ? 'click' : 'dblclick', 
				L.Browser.mobileWebkit ? this._onMobileWebkitClick : this._onDoubleClick, 
				this);
		this._enabled = true;
	},
	
	disable: function() {
		if (!this._enabled) { return; }
		L.DomEvent.removeListener(this._map._container, 
				L.Browser.mobileWebkit ? 'click' : 'dblclick', 
				L.Browser.mobileWebkit ? this._onMobileWebkitClick : this._onDoubleClick);
		this._enabled = false;
	},
	
	_onDoubleClick: function(e) {
		this._map.setView(this._map.mouseEventToLatLng(e), this._map._zoom + 1);
	},
	
	_onMobileWebkitClick: function(e) {
		console.log('click');
		var time = new Date(),
			delay = L.Handler.DoubleClickZoom.DOUBLE_TAP_DELAY;
		if (this._lastClickTime && (time - this._lastClickTime < delay)) {
			this._onDoubleClick.call(this._map, e);
		}
		this._lastClickTime = time;
	}
});
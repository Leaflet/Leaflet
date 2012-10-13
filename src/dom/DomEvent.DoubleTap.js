L.Util.extend(L.DomEvent, {

	_touchstart: L.Browser.msTouch ? 'MSPointerDown' : 'touchstart',
	_touchend: L.Browser.msTouch ? 'MSPointerUp' : 'touchend',

	// inspired by Zepto touch code by Thomas Fuchs
	addDoubleTapListener: function (obj, handler, id) {
		var last,
			doubleTap = false,
			delay = 250,
			touch,
			pre = '_leaflet_',
			touchstart = this._touchstart,
			touchend = this._touchend,
			touchCount = 0;

		function onTouchStart(e) {
			touchCount++;
			if (touchCount > 1) {
				return;
			}

			var now = Date.now(),
				delta = now - (last || now);

			touch = e.touches[0];
			doubleTap = (delta > 0 && delta <= delay);
			last = now;
		}
		function onTouchEnd(e) {
			touchCount--;
			if (doubleTap) {
				if (L.Browser.msTouch) {
					//Work around .type being readonly with MSPointer* events
					var newTouch = { },
						prop;
					for (var i in touch) {
						if (true) { //Make JSHint happy, we want to copy all properties
							prop = touch[i];
							if (typeof prop === 'function') { //Make JSHint happy, we want to copy all properties
								newTouch[i] = prop.bind(touch);
							} else {
								newTouch[i] = prop;
							}
						}
					}
					touch = newTouch;
				}
				touch.type = 'dblclick';
				handler(touch);
				last = null;
			}
		}
		obj[pre + touchstart + id] = onTouchStart;
		obj[pre + touchend + id] = onTouchEnd;

		obj.addEventListener(touchstart, onTouchStart, false);
		obj.addEventListener(touchend, onTouchEnd, false);
		if (L.Browser.msTouch) {
			obj.addEventListener('MSPointerCancel', onTouchEnd, false);
		}
		return this;
	},

	removeDoubleTapListener: function (obj, id) {
		var pre = '_leaflet_';
		obj.removeEventListener(this._touchstart, obj[pre + this._touchstart + id], false);
		obj.removeEventListener(this._touchend, obj[pre + this._touchend + id], false);
		if (L.Browser.msTouch) {
			obj.addEventListener('MSPointerCancel', obj[pre + this._touchend + id], false);
		}
		return this;
	}
});

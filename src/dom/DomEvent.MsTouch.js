L.Util.extend(L.DomEvent, {

	_msTouches: [],

	// Provides a touch events wrapper for msPointer events.
	// Based on changes by veproza https://github.com/CloudMade/Leaflet/pull/1019

	addMsTouchListener: function (obj, type, handler, id) {

		switch (type) {
		case 'touchstart':
			return this.addMsTouchListenerStart(obj, type, handler, id);
		case 'touchend':
			return this.addMsTouchListenerEnd(obj, type, handler, id);
		case 'touchmove':
			return this.addMsTouchListenerMove(obj, type, handler, id);
		default:
			throw 'Unknown touch event type';
		}
	},

	addMsTouchListenerStart: function (obj, type, handler, id) {
		var pre = '_leaflet_',
			touches = this._msTouches;

		var cb = function (e) {

			var alreadyInArray = false;
			for (var i = 0; i < touches.length; i++) {
				if (touches[i].pointerId === e.pointerId) {
					alreadyInArray = true;
					break;
				}
			}
			if (!alreadyInArray) {
				touches.push(e);
			}

			e.touches = touches.slice();
			e.changedTouches = [e];

			handler(e);
		};

		obj[pre + 'touchstart' + id] = cb;
		obj.addEventListener('MSPointerDown', cb, this);


		//Need to also listen for end events to keep the _msTouches list accurate
		var internalCb = function (e) {
			for (var i = 0; i < touches.length; i++) {
				if (touches[i].pointerId === e.pointerId) {
					touches.splice(i, 1);
					break;
				}
			}
		};
		obj.addEventListener('MSPointerUp', internalCb, this);
		obj.addEventListener('MSPointerCancel', internalCb, this);
		obj[pre + 'touchstartend' + id] = cb;

		return this;
	},

	addMsTouchListenerMove: function (obj, type, handler, id) {
		var pre = '_leaflet_';

		var touches = this._msTouches;
		var cb = function (e) {

			//Don't fire touch moves when mouse isn't down
			if (e.pointerType === e.MSPOINTER_TYPE_MOUSE && e.buttons === 0) {
				return;
			}

			for (var i = 0; i < touches.length; i++) {
				if (touches[i].pointerId === e.pointerId) {
					touches[i] = e;
					break;
				}
			}

			e.touches = touches.slice();
			e.changedTouches = [e];

			handler(e);
		};

		obj[pre + 'touchmove' + id] = cb;
		obj.addEventListener('MSPointerMove', cb, this);

		return this;
	},

	addMsTouchListenerEnd: function (obj, type, handler, id) {
		var pre = '_leaflet_',
			touches = this._msTouches;

		var cb = function (e) {

			for (var i = 0; i < touches.length; i++) {
				if (touches[i].pointerId === e.pointerId) {
					touches.splice(i, 1);
					break;
				}
			}

			e.touches = touches.slice();
			e.changedTouches = [e];

			handler(e);
		};

		obj[pre + 'touchend' + id] = cb;
		obj.addEventListener('MSPointerUp', cb, this);
		obj.addEventListener('MSPointerCancel', cb, this);

		return this;
	},

	removeMsTouchListener: function (obj, type, id) {
		var pre = '_leaflet_',
		    cb = obj[pre + type + id];

		switch (type) {
		case 'touchstart':
			obj.removeEventListener('MSPointerDown', cb, this);
			obj.removeEventListener('MSPointerUp', obj[pre + 'touchstartend' + id], this);
			obj.removeEventListener('MSPointerCancel', obj[pre + 'touchstartend' + id], this);
			break;
		case 'touchmove':
			obj.removeEventListener('MSPointerMove', cb, this);
			break;
		case 'touchend':
			obj.removeEventListener('MSPointerUp', cb, this);
			obj.removeEventListener('MSPointerCancel', cb, this);
			break;
		}

		return this;
	}
});

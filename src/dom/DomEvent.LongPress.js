L.Util.extend(L.DomEvent, {
	// inspired by Zepto touch code by Thomas Fuchs
	addLongPressListener: function (obj, handler, id) {
		var touch, touchStartX, touchStartY,
			start,
			timeoutId = null,
			delay = 1000,
			maxMovement = 10,
			diffX, diffY,
			pre = '_leaflet_',
			touchstart = 'touchstart',
			touchmove = 'touchmove',
			touchend = 'touchend';

		function onTouchStart(e) {
			clearTimeout(timeoutId);

			if (e.touches.length !== 1) {
				return;
			}

			touch = e.touches[0];
			touchStartX = touch.pageX;
			touchStartY = touch.pageY;
			start = Date.now();

			timeoutId = setTimeout(function () {
				touch.pageX = touchStartX;
				touch.pageY = touchStartY;
				touch.type = 'contextmenu';
				handler(touch);
			}, delay);
		}

		function onTouchMove(e) {
			diffX = e.touches[0].pageX - touchStartX;
			diffY = e.touches[0].pageY - touchStartY;

			if (diffX * diffX + diffY * diffY > maxMovement * maxMovement) {
				clearTimeout(timeoutId);
			}
		}

		function onTouchEnd() {
			clearTimeout(timeoutId);
		}
		obj[pre + touchstart + id] = onTouchStart;
		obj[pre + touchmove + id] = onTouchMove;
		obj[pre + touchend + id] = onTouchEnd;

		obj.addEventListener(touchstart, onTouchStart, false);
		obj.addEventListener(touchmove, onTouchMove, false);
		obj.addEventListener(touchend, onTouchEnd, false);
		return this;
	},

	removeLongPressListener: function (obj, id) {
		var pre = '_leaflet_';
		obj.removeEventListener(obj, obj[pre + 'touchstart' + id], false);
		obj.removeEventListener(obj, obj[pre + 'touchmove' + id], false);
		obj.removeEventListener(obj, obj[pre + 'touchend' + id], false);
		return this;
	}
});

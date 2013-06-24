/*
 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

L.Draggable = L.Class.extend({
	includes: L.Mixin.Events,

	statics: {
		START: L.Browser.touch ? ['touchstart', 'mousedown'] : ['mousedown'],
		END: {
			mousedown: 'mouseup',
			touchstart: 'touchend',
			MSPointerDown: 'touchend'
		},
		MOVE: {
			mousedown: 'mousemove',
			touchstart: 'touchmove',
			MSPointerDown: 'touchmove'
		},
		TAP_TOLERANCE: 15
	},

	initialize: function (element, dragStartTarget, longPress) {
		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
		this._longPress = longPress && !L.Browser.msTouch;
	},

	enable: function () {
		if (this._enabled) { return; }

		for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
			L.DomEvent.on(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
		}

		this._enabled = true;
	},

	disable: function () {
		if (!this._enabled) { return; }

		for (var i = L.Draggable.START.length - 1; i >= 0; i--) {
			L.DomEvent.off(this._dragStartTarget, L.Draggable.START[i], this._onDown, this);
		}

		this._enabled = false;
		this._moved = false;
	},

	_onDown: function (e) {
		if (e.shiftKey || ((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

		L.DomEvent
		    .stopPropagation(e);

		if (L.Draggable._disabled) { return; }

		this._simulateClick = true;

		var touchesNum = (e.touches && e.touches.length) || 0;

		// don't simulate click or track longpress if more than 1 touch
		if (touchesNum > 1) {
			this._simulateClick = false;
			clearTimeout(this._longPressTimeout);
			return;
		}

		var first = touchesNum === 1 ? e.touches[0] : e,
		    el = first.target;

		// if touching a link, highlight it
		if (L.Browser.touch && el.tagName.toLowerCase() === 'a') {
			L.DomUtil.addClass(el, 'leaflet-active');
		}

		this._moved = false;

		if (this._moving) { return; }

		this._startPoint = new L.Point(first.clientX, first.clientY);
		this._startPos = this._newPos = L.DomUtil.getPosition(this._element);

		// touch contextmenu event emulation
		if (touchesNum === 1 && L.Browser.touch && this._longPress) {

			this._longPressTimeout = setTimeout(L.bind(function () {
				var dist = (this._newPos && this._newPos.distanceTo(this._startPos)) || 0;

				if (dist < L.Draggable.TAP_TOLERANCE) {
					this._simulateClick = false;
					this._onUp();
					this._simulateEvent('contextmenu', first);
				}
			}, this), 1000);
		}

		L.DomEvent
		    .on(document, L.Draggable.MOVE[e.type], this._onMove, this)
		    .on(document, L.Draggable.END[e.type], this._onUp, this);
	},

	_onMove: function (e) {
		if (e.touches && e.touches.length > 1) { return; }

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
		    newPoint = new L.Point(first.clientX, first.clientY),
		    offset = newPoint.subtract(this._startPoint);

		if (!offset.x && !offset.y) { return; }

		L.DomEvent.preventDefault(e);

		if (!this._moved) {
			this.fire('dragstart');

			this._moved = true;
			this._startPos = L.DomUtil.getPosition(this._element).subtract(offset);

			if (!L.Browser.touch) {
				L.DomUtil.disableTextSelection();
				L.DomUtil.addClass(document.body, 'leaflet-dragging');
			}
		}

		this._newPos = this._startPos.add(offset);
		this._moving = true;

		L.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
	},

	_updatePosition: function () {
		this.fire('predrag');
		L.DomUtil.setPosition(this._element, this._newPos);
		this.fire('drag');
	},

	_onUp: function (e) {
		var first, el, dist, simulateClickTouch, i;

		clearTimeout(this._longPressTimeout);

		if (this._simulateClick && e.changedTouches) {

			dist = (this._newPos && this._newPos.distanceTo(this._startPos)) || 0;
			first = e.changedTouches[0];
			el = first.target;

			if (el.tagName.toLowerCase() === 'a') {
				L.DomUtil.removeClass(el, 'leaflet-active');
			}

			// simulate click if the touch didn't move too much
			if (dist < L.Draggable.TAP_TOLERANCE) {
				simulateClickTouch = true;
			}
		}

		if (!L.Browser.touch) {
			L.DomUtil.enableTextSelection();
			L.DomUtil.removeClass(document.body, 'leaflet-dragging');
		}

		for (i in L.Draggable.MOVE) {
			L.DomEvent
			    .off(document, L.Draggable.MOVE[i], this._onMove)
			    .off(document, L.Draggable.END[i], this._onUp);
		}

		if (this._moved) {
			// ensure drag is not fired after dragend
			L.Util.cancelAnimFrame(this._animRequest);

			this.fire('dragend');
		}

		this._moving = false;

		if (simulateClickTouch) {
			this._moved = false;
			this._simulateEvent('click', first);
		}
	},

	_simulateEvent: function (type, e) {
		var simulatedEvent = document.createEvent('MouseEvents');

		simulatedEvent.initMouseEvent(
		        type, true, true, window, 1,
		        e.screenX, e.screenY,
		        e.clientX, e.clientY,
		        false, false, false, false, 0, null);

		e.target.dispatchEvent(simulatedEvent);
	}
});

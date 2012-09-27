/*
 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

L.Draggable = L.Class.extend({
	includes: L.Mixin.Events,

	statics: {
		START: L.Browser.touch ? 'touchstart' : 'mousedown',
		END: L.Browser.touch ? 'touchend' : 'mouseup',
		MOVE: L.Browser.touch ? 'touchmove' : 'mousemove',
		MSPOINTERSTART: 'MSPointerDown',
		MSPOINTERUP: 'MSPointerUp',
		MSPOINTERMOVE: 'MSPointerMove',
		TAP_TOLERANCE: 15
	},

	_msTouchActive : false,
	_msTouches : [],

	initialize: function (element, dragStartTarget) {
		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
	},

	enable: function () {
		if (this._enabled) {
			return;
		}
		
		if (!L.Browser.msTouch) {
			L.DomEvent.on(this._dragStartTarget, L.Draggable.START, this._onDown, this);
		} else {
			L.DomEvent.on(this._dragStartTarget, L.Draggable.MSPOINTERSTART, this._translateMsDown, this);
			this._dragStartTarget.style.msTouchAction = 'none';
			this._msTouchActive = true;
		}
		this._enabled = true;
	},

	disable: function () {
		if (!this._enabled) {
			return;
		}
		L.DomEvent.off(this._dragStartTarget, L.Draggable.START, this._onDown);
		this._enabled = false;
		this._moved = false;
	},

	_onDown: function (e) {
		if ((!L.Browser.touch && e.shiftKey) ||
			((e.which !== 1) && (e.button !== 1) && !e.touches)) { return; }

		L.DomEvent.preventDefault(e);

		if (L.Draggable._disabled) { return; }

		this._simulateClick = true;

		if (e.touches && e.touches.length > 1) {
			this._simulateClick = false;
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
			el = first.target;

		if (L.Browser.touch && el.tagName.toLowerCase() === 'a') {
			L.DomUtil.addClass(el, 'leaflet-active');
		}

		this._moved = false;
		if (this._moving) {
			return;
		}

		this._startPoint = new L.Point(first.clientX, first.clientY);
		this._startPos = this._newPos = L.DomUtil.getPosition(this._element);
		if (!this._msTouchActive) {
			L.DomEvent.on(document, L.Draggable.MOVE, this._onMove, this);
			L.DomEvent.on(document, L.Draggable.END, this._onUp, this);
		}
	},

	_translateMsDown: function (e) {
		this._msTouches.push(e);
		e.preventDefault();
		e.stopPropagation();
		e.touches = this._msTouches;
		this._onDown(e);
		if (this._msTouches.length === 1) {
			L.DomEvent.on(document, L.Draggable.MSPOINTERMOVE, this._translateMsMove, this);
			L.DomEvent.on(document, L.Draggable.MSPOINTERUP, this._translateMsEnd, this);
		}
	},

	_onMove: function (e) {
		if (e.touches && e.touches.length > 1) { return; }

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
			newPoint = new L.Point(first.clientX, first.clientY),
			diffVec = newPoint.subtract(this._startPoint);

		if (!diffVec.x && !diffVec.y) { return; }

		L.DomEvent.preventDefault(e);

		if (!this._moved) {
			this.fire('dragstart');
			this._moved = true;

			this._startPos = L.DomUtil.getPosition(this._element).subtract(diffVec);

			if (!L.Browser.touch) {
				L.DomUtil.disableTextSelection();
				this._setMovingCursor();
			}
		}

		this._newPos = this._startPos.add(diffVec);
		this._moving = true;

		L.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
	},

	_translateMsMove: function (e) {
		var i,
			max = this._msTouches.length;
		for (i = 0; i < max; i += 1) {
			if (this._msTouches[i].pointerId === e.pointerId) {
				this._msTouches[i] = e;
				break;
			}
		}
		e.touches = this._msTouches;
		this._onMove(e);
	},


	_updatePosition: function () {
		this.fire('predrag');
		L.DomUtil.setPosition(this._element, this._newPos);
		this.fire('drag');
	},

	_onUp: function (e) {
		if (this._simulateClick && e.changedTouches) {
			var first = e.changedTouches[0],
				el = first.target,
				dist = (this._newPos && this._newPos.distanceTo(this._startPos)) || 0;

			if (el.tagName.toLowerCase() === 'a') {
				L.DomUtil.removeClass(el, 'leaflet-active');
			}

			if (dist < L.Draggable.TAP_TOLERANCE) {
				this._simulateEvent('click', first);
			}
		}

		if (!L.Browser.touch) {
			L.DomUtil.enableTextSelection();
			this._restoreCursor();
		}
		if (!this._msTouchActive) {
			L.DomEvent.off(document, L.Draggable.MOVE, this._onMove);
			L.DomEvent.off(document, L.Draggable.END, this._onUp);
		}

		if (this._moved) {
			// ensure drag is not fired after dragend
			L.Util.cancelAnimFrame(this._animRequest);

			this.fire('dragend');
		}
		this._moving = false;
	},

	_translateMsEnd: function (e) {
		var i,
			max = this._msTouches.length;
		
		for (i = 0; i < max; i += 1) {
			if (this._msTouches[i].pointerId === e.pointerId) {
				this._msTouches.splice(i, 1);
				break;
			}
		}
		e.changedTouches = [e];
		this._onUp(e);
		if (this._msTouches.length === 0) {
			L.DomEvent.off(document, L.Draggable.MSPOINTERMOVE, this._translateMsMove);
			L.DomEvent.off(document, L.Draggable.MSPOINTERUP, this._translateMsEnd);
		}
	},

	_setMovingCursor: function () {
		L.DomUtil.addClass(document.body, 'leaflet-dragging');
	},

	_restoreCursor: function () {
		L.DomUtil.removeClass(document.body, 'leaflet-dragging');
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

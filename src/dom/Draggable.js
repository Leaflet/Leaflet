/*
 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

L.Draggable = L.Class.extend({
	includes: L.Mixin.Events,

	statics: {
		START: L.Browser.touch ? 'touchstart' : 'mousedown',
		END: L.Browser.touch ? 'touchend' : 'mouseup',
		MOVE: L.Browser.touch ? 'touchmove' : 'mousemove',
		TAP_TOLERANCE: 15
	},

	initialize: function (element, dragStartTarget) {
		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
	},

	enable: function () {
		if (this._enabled) {
			return;
		}
		L.DomEvent.addListener(this._dragStartTarget, L.Draggable.START, this._onDown, this);
		this._enabled = true;
	},

	disable: function () {
		if (!this._enabled) {
			return;
		}
		L.DomEvent.removeListener(this._dragStartTarget, L.Draggable.START, this._onDown);
		this._enabled = false;
		this._moved = false;
	},

	_onDown: function (e) {
		if ((!L.Browser.touch && e.shiftKey) || ((e.which !== 1) && (e.button !== 1) && !e.touches)) {
			return;
		}

		this._simulateClick = true;

		if (e.touches && e.touches.length > 1) {
			this._simulateClick = false;
			return;
		}

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e),
			el = first.target;

		L.DomEvent.preventDefault(e);

		if (L.Browser.touch && el.tagName.toLowerCase() === 'a') {
			el.className += ' leaflet-active';
		}

		this._moved = false;
		if (this._moving) {
			return;
		}

		if (!L.Browser.touch) {
			L.DomUtil.disableTextSelection();
			this._setMovingCursor();
		}

		this._startPos = this._newPos = L.DomUtil.getPosition(this._element);
		this._startPoint = new L.Point(first.clientX, first.clientY);

		L.DomEvent.addListener(document, L.Draggable.MOVE, this._onMove, this);
		L.DomEvent.addListener(document, L.Draggable.END, this._onUp, this);
	},

	_onMove: function (e) {
		if (e.touches && e.touches.length > 1) {
			return;
		}

		L.DomEvent.preventDefault(e);

		var first = (e.touches && e.touches.length === 1 ? e.touches[0] : e);

		if (!this._moved) {
			this.fire('dragstart');
			this._moved = true;
		}
		this._moving = true;

		var newPoint = new L.Point(first.clientX, first.clientY);
		this._newPos = this._startPos.add(newPoint).subtract(this._startPoint);

		L.Util.cancelAnimFrame(this._animRequest);
		this._animRequest = L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
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
				el.className = el.className.replace(' leaflet-active', '');
			}

			if (dist < L.Draggable.TAP_TOLERANCE) {
				this._simulateEvent('click', first);
			}
		}

		if (!L.Browser.touch) {
			L.DomUtil.enableTextSelection();
			this._restoreCursor();
		}

		L.DomEvent.removeListener(document, L.Draggable.MOVE, this._onMove);
		L.DomEvent.removeListener(document, L.Draggable.END, this._onUp);

		if (this._moved) {
			this.fire('dragend');
		}
		this._moving = false;
	},

	_setMovingCursor: function () {
		document.body.className += ' leaflet-dragging';
	},

	_restoreCursor: function () {
		document.body.className = document.body.className.replace(/ leaflet-dragging/g, '');
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

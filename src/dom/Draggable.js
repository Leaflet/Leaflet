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
	
	initialize: function(element, dragStartTarget) {
		this._element = element;
		this._dragStartTarget = dragStartTarget || element;
	},
	
	enable: function() {
		if (this._enabled) { return; }
		L.DomEvent.addListener(this._dragStartTarget, L.Draggable.START, this._onDown, this);
		this._enabled = true;
	},
	
	disable: function() {
		if (!this._enabled) { return; }
		L.DomEvent.removeListener(this._dragStartTarget, L.Draggable.START, this._onDown);
		this._enabled = false;
	},

	_onDown: function(e) {
		if (e.shiftKey || ((e.which != 1) && (e.button != 1) && !e.touches)) { return; }
		
		if (e.touches && e.touches.length > 1) { return; }

		var first = (e.touches && e.touches.length == 1 ? e.touches[0] : e);
		
		L.DomEvent.preventDefault(e);
			
		if (L.Browser.touch) {
			first.target.className += ' leaflet-active';
		}
		
		this._moved = false;
		
		L.DomUtil.disableTextSelection();
		this._setMovingCursor();
		
		this._startPos = this._newPos = L.DomUtil.getPosition(this._element);
		this._startPoint = new L.Point(first.clientX, first.clientY);
		
		L.DomEvent.addListener(document, L.Draggable.MOVE, this._onMove, this);
		L.DomEvent.addListener(document, L.Draggable.END, this._onUp, this);
	},
	
	_onMove: function(e) {
		if (e.touches && e.touches.length > 1) { return; }

		L.DomEvent.preventDefault(e);
		
		var first = (e.touches && e.touches.length == 1 ? e.touches[0] : e);
		
		if (!this._moved) {
			this.fire('dragstart');
			this._moved = true;
		}

		var newPoint = new L.Point(first.clientX, first.clientY);
		this._newPos = this._startPos.add(newPoint).subtract(this._startPoint);
		
		L.Util.requestAnimFrame(this._updatePosition, this, true, this._dragStartTarget);
	},
	
	_updatePosition: function() {
		L.DomUtil.setPosition(this._element, this._newPos);
		this.fire('drag');
	},
	
	_onUp: function(e) {
		if (e.changedTouches) {
			var first = e.changedTouches[0],
				el = first.target,
				dist = (this._newPos && this._newPos.distanceTo(this._startPos)) || 0;
			
			el.className = el.className.replace(' leaflet-active', '');
			
			if (dist < L.Draggable.TAP_TOLERANCE) {
				this._simulateEvent('click', first);
			}
		}
		
		L.DomUtil.enableTextSelection();
		
		this._restoreCursor();
		
		L.DomEvent.removeListener(document, L.Draggable.MOVE, this._onMove);
		L.DomEvent.removeListener(document, L.Draggable.END, this._onUp);
		
		if (this._moved) {
			this.fire('dragend');
		}
	},
	
	_removeActiveClass: function(el) {
	},
	
	_setMovingCursor: function() {
		this._bodyCursor = document.body.style.cursor;
		document.body.style.cursor = 'move';
	},
	
	_restoreCursor: function() {
		document.body.style.cursor = this._bodyCursor;
	},
	
	_simulateEvent: function(type, e) {
		var simulatedEvent = document.createEvent('MouseEvent');
		
		simulatedEvent.initMouseEvent(
				type, true, true, window, 1, 
				e.screenX, e.screenY, 
				e.clientX, e.clientY, 
				false, false, false, false, 0, null);
		
		e.target.dispatchEvent(simulatedEvent);
	}
});

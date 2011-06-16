/*
 * L.Draggable allows you to add dragging capabilities to any element. Supports mobile devices too.
 */

L.Draggable = L.Class.extend({
	includes: L.Mixin.Events,
	
	statics: {
		START: L.Browser.mobileWebkit ? 'touchstart' : 'mousedown',
		END: L.Browser.mobileWebkit ? 'touchend' : 'mouseup',
		MOVE: L.Browser.mobileWebkit ? 'touchmove' : 'mousemove'
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
		if (e.touches && e.touches.length == 1) { e = e.touches[0]; }
		
		this._moved = false;

		L.DomUtil.disableTextSelection();
		this._setMovingCursor();
		
		this._startPos = L.DomUtil.getPosition(this._element);
		this._startPoint = new L.Point(e.clientX, e.clientY);
		
		L.DomEvent.addListener(document, L.Draggable.MOVE, this._onMove, this);
		L.DomEvent.addListener(document, L.Draggable.END, this._onUp, this);

		if (!L.Browser.mobileWebkit || L.Browser.android) {
			L.DomEvent.preventDefault(e);
		}
		if (L.Browser.android) {
			this._simulateEvent(e);
		}
	},
	
	_onMove: function(e) {
		if (e.touches && e.touches.length > 1) { return; }
		if (e.touches && e.touches.length == 1) { e = e.touches[0]; }
		
		if (!this._moved) {
			this.fire('dragstart');
			this._moved = true;
		}

		var newPoint = new L.Point(e.clientX, e.clientY);
		this._newPos = this._startPos.add(newPoint).subtract(this._startPoint);
		
		L.Util.requestAnimFrame(this._updatePosition, this);
		
		this.fire('drag');

		L.DomEvent.preventDefault(e);
		
		if (L.Browser.android) {
			this._simulateEvent(e);
		}
	},
	
	_updatePosition: function() {
		L.DomUtil.setPosition(this._element, this._newPos);
	},
	
	_onUp: function() {
		L.DomUtil.enableTextSelection();
		
		this._restoreCursor();
		
		L.DomEvent.removeListener(document, L.Draggable.MOVE, this._onMove);
		L.DomEvent.removeListener(document, L.Draggable.END, this._onUp);
		
		if (this._moved) {
			this.fire('dragend');
		}
		if (L.Browser.android) {
			this._simulateEvent(e);
		}
	},
	
	_setMovingCursor: function() {
		this._bodyCursor = document.body.style.cursor;
		document.body.style.cursor = 'move';
	},
	
	_restoreCursor: function() {
		document.body.style.cursor = this._bodyCursor;
	},
	
	_simulateEvent: function(e) {
		var type;
		
		switch(e.type) {
			case 'touchstart': type = 'mousedown'; break;
			case 'touchmove': type = 'mousemove'; break;        
			case 'touchend': type = 'mouseup';
		}
		
		var simulatedEvent = document.createEvent('MouseEvent');
			simulatedEvent.initMouseEvent(type, true, true, window, 1, 
									  e.screenX, e.screenY, 
									  e.clientX, e.clientY, false, 
									  false, false, false, 0, null);
																					
		e.target.dispatchEvent(simulatedEvent);
	}
});

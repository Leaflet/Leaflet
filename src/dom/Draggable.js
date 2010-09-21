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
		if (e.shiftKey || ((e.which != 1) && (e.button != 1) && !e.touches)) { return true; }
		
		if (e.touches && e.touches.length > 1) { return; }
		if (e.touches && e.touches.length == 1) { e = e.touches[0]; }
		
		this._dragStartPos = L.DomUtil.getPosition(this._element);
		this._startX = e.clientX;
		this._startY = e.clientY;
		
		this._disableTextSelection();
		
		this._setMovingCursor();
		
		L.DomEvent.addListener(document, L.Draggable.MOVE, this._onMove, this);
		L.DomEvent.addListener(document, L.Draggable.END, this._onUp, this);
	},
	
	_onMove: function(e) {
		L.DomEvent.preventDefault(e);

		if (e.touches && e.touches.length > 1) { return; }
		if (e.touches && e.touches.length == 1) { e = e.touches[0]; }
		
		var offset = new L.Point(e.clientX - this._startX, e.clientY - this._startY),
			newPos = this._dragStartPos.add(offset);
		
		if (!this._moved) {
			this.fire('dragstart');
			this._moved = true;
		}
		
		L.DomUtil.setPosition(this._element, newPos);
		
		this.fire('drag');
	},
	
	_onUp: function(e) {
		this._enableTextSelection();
		
		this._restoreCursor();
		
		L.DomEvent.removeListener(document, L.Draggable.MOVE, this._onMove);
		L.DomEvent.removeListener(document, L.Draggable.END, this._onUp);
		
		this.fire('dragend');
	},
	
	_setMovingCursor: function() {
		this._bodyCursor = document.body.style.cursor;
		document.body.style.cursor = 'move';
	},
	
	_restoreCursor: function() {
		document.body.style.cursor = this._bodyCursor;
	},
	
	_disableTextSelection: function() {
		if (document.selection && document.selection.empty) { 
			document.selection.empty();
		}
		if (!this._onselectstart) {
			this._onselectstart = document.onselectstart;
			document.onselectstart = L.Util.falseFn;
		}
	},
	
	_enableTextSelection: function() {
		document.onselectstart = this._onselectstart;
		this._onselectstart = null;
	}
});
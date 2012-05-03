L.Map.mergeOptions({
	keyboard: true
});

L.Map.Keyboard = L.Handler.extend({
	// Cross browser list of e.keyCode values for particular keys.
	// This list currently covers:
	//
	// Mac OSX 10.6.8
	//      Safari 5.1.1
	//      Firefox 11
	//      Chrome 18
	//
	// Windows 7
	//      IE 8
	//      IE 9
	//      Firefox 4
	//      Chrome 18
	_upArrow: {38: true},
	_rightArrow: {39: true},
	_downArrow: {40: true},
	_leftArrow: {37: true},
	_plusKey: {187: true, 61: true, 107: true},
	_minusKey: {189: true, 109: true, 0: true},

	options: {
		panDistance: 50 // Pixels
	},
	
	initialize: function (map) {
		this._map = map;
		this._container = map._container;
	},

	addHooks: function () {
		L.DomEvent.addListener(this._container, 'click', this._onClick, this);
	},

	removeHooks: function () {
		L.DomEvent.removeListener(this._container, 'click', this._onClick, this);
	},

	_onClick: function (e) {
		this._addHooks();
	},

	_onClickOut: function (e) {
		if (!this._checkInMap(e.target || e.srcElement)) {
			this._removeHooks();
		}
	},

	_addHooks: function () {
		L.DomEvent
			.addListener(document, 'keydown', this._onKeyDown, this)
			.addListener(document, 'click', this._onClickOut, this);

	},

	_removeHooks: function () {
		L.DomEvent
			.removeListener(document, 'keydown', this._onKeyDown, this)
			.removeListener(document, 'click', this._onClickOut, this);
	},

	_onKeyDown: function (e) {
		var key = e.keyCode,
		   dist = this.options.panDistance;

		if (key in this._leftArrow) {
			this._map.panBy(new L.Point(-1 * dist, 0));
		} else if (key in this._rightArrow) {
			this._map.panBy(new L.Point(dist, 0));
		} else if (key in this._upArrow) {
			this._map.panBy(new L.Point(0, -1 * dist));
		} else if (key in this._downArrow) {
			this._map.panBy(new L.Point(0, dist));
		} else if (key in this._plusKey) {
			this._map.zoomIn();
		} else if (key in this._minusKey) {
			this._map.zoomOut();
		} else {
			return;
		}
		L.DomEvent.stop(e);
	},

	_checkInMap: function (element) {
		try {
			if (element === this._container) {
				return true;
			} else if (!element.parentNode) {
				return false;
			} else {
				return this._checkInMap(element.parentNode);
			}
		} catch (e) {
			return false;
		}
	}
});
L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);

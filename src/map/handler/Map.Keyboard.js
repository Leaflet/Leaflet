L.Map.mergeOptions({
	keyboard: true,
	keyboardPanOffset: 50,
	keyboardZoomOffset: 1
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
	_leftKeys: [37],
	_rightKeys: [39],
	_downKeys: [40],
	_upKeys: [38],

	_inKeys: [187, 61, 107],
	_outKeys: [189, 109, 0],

	panKeys: {},
	zoomKeys: {},

	initialize: function (map) {
		this._map = map;
		this._container = map._container;
		var panOffset = map.options.keyboardPanOffset;
		var zoomOffset = map.options.keyboardZoomOffset;

		if (typeof panOffset !== 'number') {
			panOffset = 50;
		}
		if (typeof zoomOffset !== 'number') {
			zoomOffset = 1;
		}

		this._setPanOffset(panOffset);
		this._setZoomOffset(zoomOffset);
	},

	addHooks: function () {
		this._map.on('focus', this._addHooks, this)
			.on('blur', this._removeHooks, this);
	},

	removeHooks: function () {
		this._removeHooks();

		this._map.off('focus', this._addHooks, this)
			.off('blur', this._addHooks, this);
	},

	_setPanOffset: function (pan) {
		var panKeys = {},
		    keyCode = null,
		          i = 0;

		if (typeof pan !== 'number') {
			pan = L.Map.Keyboard.DEFAULT_PAN;
		}

		// Left
		for (i = 0; i < this._leftKeys.length; i++) {
			keyCode = this._leftKeys[i];
			panKeys[keyCode] = new L.Point(-1 * pan, 0);
		}

		// Right
		for (i = 0; i < this._rightKeys.length; i++) {
			keyCode = this._rightKeys[i];
			panKeys[keyCode] = new L.Point(pan, 0);
		}

		// Down
		for (i = 0; i < this._downKeys.length; i++) {
			keyCode = this._downKeys[i];
			panKeys[keyCode] = new L.Point(0, pan);
		}

		// Up
		for (i = 0; i < this._upKeys.length; i++) {
			keyCode = this._upKeys[i];
			panKeys[keyCode] = new L.Point(0, -1 * pan);
		}

		this.panKeys = panKeys;
	},

	_setZoomOffset: function (zoom) {
		var zoomKeys = {},
		     keyCode = null,
		           i = 0;

		if (typeof zoom !== 'number') {
			zoom = L.Map.Keyboard.DEFAULT_ZOOM;
		}

		// In
		for (i = 0; i < this._inKeys.length; i++) {
			keyCode = this._inKeys[i];
			zoomKeys[keyCode] = zoom;
		}

		// Out
		for (i = 0; i < this._outKeys.length; i++) {
			keyCode = this._outKeys[i];
			zoomKeys[keyCode] = -1 * zoom;
		}

		this.zoomKeys = zoomKeys;
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
		    map = this._map;

		if (this.panKeys.hasOwnProperty(key)) {
			map.panBy(this.panKeys[key]);
		} else if (this.zoomKeys.hasOwnProperty(key)) {
			map.setZoom(map.getZoom() + this.zoomKeys[key]);
		} else {
			return;
		}
		L.DomEvent.stop(e);
	}
});

L.Map.Keyboard.DEFAULT_PAN = 50; // Pixels
L.Map.Keyboard.DEFAULT_ZOOM = 1; // Zoom levels

L.Map.addInitHook('addHandler', 'keyboard', L.Map.Keyboard);

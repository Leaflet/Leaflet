import {Map} from '../Map';
import {Handler} from '../../core/Handler';
import * as DomEvent from '../../dom/DomEvent';
import {Point} from '../../geometry/Point';
import * as Util from '../../core/Util';
import Browser from '../../core/Browser';

/*
 * L.Map.TapHold is used to simulate `contextmenu` event on long hold,
 * which otherwise is not fired by mobile Safari.
 */

var tapHoldDelay = 600;

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Touch interaction options
	// @option tapHold: Boolean
	// Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
	tapHold: Browser.touchNative && Browser.safari && Browser.mobile,

	// @option tapTolerance: Number = 15
	// The max number of pixels a user can shift his finger during touch
	// for it to be considered a valid tap.
	tapTolerance: 15
});

export var TapHold = Handler.extend({
	addHooks: function () {
		DomEvent.on(this._map._container, 'touchstart', this._onDown, this);
	},

	removeHooks: function () {
		DomEvent.off(this._map._container, 'touchstart', this._onDown, this);
	},

	_onDown: function (e) {
		clearTimeout(this._holdTimeout);
		if (e.touches.length !== 1) { return; }

		var first = e.touches[0];
		this._startPos = this._newPos = new Point(first.clientX, first.clientY);

		this._holdTimeout = setTimeout(Util.bind(function () {
			this._cancel();
			if (!this._isTapValid()) { return; }

			// prevent simulated mouse events https://w3c.github.io/touch-events/#mouse-events
			DomEvent.on(document, 'touchend', DomEvent.preventDefault);
			DomEvent.on(document, 'touchend touchcancel', this._cancelClickPrevent);
			this._simulateEvent('contextmenu', first);
		}, this), tapHoldDelay);

		DomEvent.on(document, 'touchend touchcancel contextmenu', this._cancel, this);
		DomEvent.on(document, 'touchmove', this._onMove, this);
	},

	_cancelClickPrevent: function cancelClickPrevent() {
		DomEvent.off(document, 'touchend', DomEvent.preventDefault);
		DomEvent.off(document, 'touchend touchcancel', cancelClickPrevent);
	},

	_cancel: function () {
		clearTimeout(this._holdTimeout);
		DomEvent.off(document, 'touchend touchcancel contextmenu', this._cancel, this);
		DomEvent.off(document, 'touchmove', this._onMove, this);
	},

	_onMove: function (e) {
		var first = e.touches[0];
		this._newPos = new Point(first.clientX, first.clientY);
	},

	_isTapValid: function () {
		return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
	},

	_simulateEvent: function (type, e) {
		var simulatedEvent = new MouseEvent(type, {
			bubbles: true,
			cancelable: true,
			view: window,
			// detail: 1,
			screenX: e.screenX,
			screenY: e.screenY,
			clientX: e.clientX,
			clientY: e.clientY,
			// button: 2,
			// buttons: 2
		});

		simulatedEvent._simulated = true;

		e.target.dispatchEvent(simulatedEvent);
	}
});

// @section Handlers
// @property tapHold: Handler
// Long tap handler to simulate `contextmenu` event (useful in mobile Safari).
Map.addInitHook('addHandler', 'tapHold', TapHold);

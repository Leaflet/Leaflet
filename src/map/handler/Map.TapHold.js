import {Map} from '../Map';
import {Handler} from '../../core/Handler';
import * as DomEvent from '../../dom/DomEvent';
import {Point} from '../../geometry/Point';
import * as Util from '../../core/Util';
import * as Browser from '../../core/Browser';


/*
 * L.Map.TapHold is used to simulate `contextmenu` event on long hold,
 * which otherwise is not fired by mobile Safari.
 */

var tapDelay = 600;

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Touch interaction options
	// @option tapHold: Boolean
	// Enables simulation of `contextmenu` event, default is `true` for Safari.
	tapHold: Browser.touch && Browser.safari,

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
			document.addEventListener('touchend', function (e) {
				e.preventDefault(); // prevent 'click'simulated mouse events https://w3c.github.io/touch-events/#mouse-events
			}, {once: true});
			if (this._isTapValid()) {
				this._simulateEvent('contextmenu', first);
			}
		}, this), tapDelay);

		DomEvent.on(document, this._cancelEvents, this._cancel, this);
		DomEvent.on(document, 'touchmove', this._onMove, this);
	},

	_cancelEvents: 'touchend touchcancel contextmenu',

	_cancel: function () {
		clearTimeout(this._holdTimeout);
		DomEvent.off(document, this._cancelEvents, this._cancel, this);
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
		var simulatedEvent = document.createEvent('MouseEvents');

		simulatedEvent._simulated = true;

		simulatedEvent.initMouseEvent(
		        type, true, true, window, 1,
		        e.screenX, e.screenY,
		        e.clientX, e.clientY,
		        false, false, false, false, 0, null);

		e.target.dispatchEvent(simulatedEvent);
	}
});

// @section Handlers
// @property tapHold: Handler
// Long tap handler to simulate `contextmenu` event (useful in mobile Safari).
Map.addInitHook('addHandler', 'tapHold', TapHold);

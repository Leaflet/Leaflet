import {Map} from '../Map.js';
import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {Point} from '../../geometry/Point.js';
import Browser from '../../core/Browser.js';
import * as PointerEvents from '../../dom/DomEvent.PointerEvents.js';

/*
 * Map.TapHold is used to simulate `contextmenu` event on long hold,
 * which otherwise is not fired by mobile Safari.
 */

const tapHoldDelay = 600;

// @namespace Map
// @section Interaction Options
Map.mergeOptions({
	// @section Touch interaction options
	// @option tapHold: Boolean
	// Enables simulation of `contextmenu` event, default is `true` for mobile Safari.
	tapHold: Browser.safari && Browser.mobile,

	// @option tapTolerance: Number = 15
	// The max number of pixels a user can shift his finger during touch
	// for it to be considered a valid tap.
	tapTolerance: 15
});

export class TapHold extends Handler {
	addHooks() {
		DomEvent.on(this._map._container, 'pointerdown', this._onDown, this);
	}

	removeHooks() {
		DomEvent.off(this._map._container, 'pointerdown', this._onDown, this);
		clearTimeout(this._holdTimeout);
	}

	_onDown(e) {
		clearTimeout(this._holdTimeout);
		if (PointerEvents.getPointers().length !== 1 || e.pointerType === 'mouse') { return; }

		this._startPos = this._newPos = new Point(e.clientX, e.clientY);

		this._holdTimeout = setTimeout((() => {
			this._cancel();
			if (!this._isTapValid()) { return; }

			// prevent simulated mouse events https://w3c.github.io/touch-events/#mouse-events
			DomEvent.on(document, 'pointerup', DomEvent.preventDefault);
			DomEvent.on(document, 'pointerup pointercancel', this._cancelClickPrevent);
			this._simulateEvent('contextmenu', e);
		}), tapHoldDelay);

		DomEvent.on(document, 'pointerup pointercancel contextmenu', this._cancel, this);
		DomEvent.on(document, 'pointermove', this._onMove, this);
	}

	_cancelClickPrevent = function _cancelClickPrevent() {
		DomEvent.off(document, 'pointerup', DomEvent.preventDefault);
		DomEvent.off(document, 'pointerup pointercancel', _cancelClickPrevent);
	};

	_cancel() {
		clearTimeout(this._holdTimeout);
		DomEvent.off(document, 'pointerup pointercancel contextmenu', this._cancel, this);
		DomEvent.off(document, 'pointermove', this._onMove, this);
	}

	_onMove(e) {
		this._newPos = new Point(e.clientX, e.clientY);
	}

	_isTapValid() {
		return this._newPos.distanceTo(this._startPos) <= this._map.options.tapTolerance;
	}

	_simulateEvent(type, e) {
		const simulatedEvent = new MouseEvent(type, {
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
}

// @section Handlers
// @property tapHold: Handler
// Long tap handler to simulate `contextmenu` event (useful in mobile Safari).
Map.addInitHook('addHandler', 'tapHold', TapHold);

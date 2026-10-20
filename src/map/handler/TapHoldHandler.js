import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {Point} from '../../geometry/Point.js';
import * as PointerEvents from '../../dom/DomEvent.PointerEvents.js';

/*
 * TapHoldHandler is used to simulate `contextmenu` event on long hold,
 * which otherwise is not fired by mobile Safari.
 */

const tapHoldDelay = 600;

export class TapHoldHandler extends Handler {
	addHooks() {
		DomEvent.on(this._map._container, 'pointerdown', this._onDown, this);
	}

	removeHooks() {
		DomEvent.off(this._map._container, 'pointerdown', this._onDown, this);
		this._cancel();
		this._cancelClickPrevent();
		this._stopPreventingNative();
	}

	_onDown(e) {
		clearTimeout(this._holdTimeout);
		if (PointerEvents.getPointers().length !== 1 || e.pointerType === 'mouse') { return; }
		const el = this._map._container;
		this._startPos = this._newPos = new Point(e.clientX, e.clientY);

		this._holdTimeout = setTimeout((() => {
			this._cancel();
			if (!this._isTapValid()) { return; }

			// prevent simulated mouse events https://w3c.github.io/touch-events/#mouse-events
			DomEvent.on(el, 'pointerup', DomEvent.preventDefault);
			DomEvent.on(el, 'pointerup pointercancel', this._cancelClickPrevent, this);
			this._simulateEvent('contextmenu', e);

			// browsers that fire a native contextmenu on touch may do it later than us (e.g. Android with a longer
			// touch & hold delay, or Windows on release), so swallow it until the next press
			el.addEventListener('contextmenu', this._preventNative, true);
			el.addEventListener('pointerdown', this._stopPreventingNative, true);
		}), tapHoldDelay);

		DomEvent.on(el, 'pointerup pointercancel contextmenu', this._cancel, this);
		DomEvent.on(el, 'pointermove', this._onMove, this);
	}

	_cancelClickPrevent() {
		const el = this._map._container;
		DomEvent.off(el, 'pointerup', DomEvent.preventDefault);
		DomEvent.off(el, 'pointerup pointercancel', this._cancelClickPrevent, this);
	};

	_preventNative = (e) => {
		DomEvent.stop(e);
	};

	_stopPreventingNative = () => {
		const el = this._map._container;
		el.removeEventListener('contextmenu', this._preventNative, true);
		el.removeEventListener('pointerdown', this._stopPreventingNative, true);
	};

	_cancel() {
		clearTimeout(this._holdTimeout);
		const el = this._map._container;
		DomEvent.off(el, 'pointerup pointercancel contextmenu', this._cancel, this);
		DomEvent.off(el, 'pointermove', this._onMove, this);
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

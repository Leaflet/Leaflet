import {Handler} from '../../core/Handler.js';
import * as DomEvent from '../../dom/DomEvent.js';
import {getPointers} from '../../dom/DomEventUtil.js';
import {Point} from '../../geometry/Point.js';

const tapHoldDelay = 600;

/** Fires a `contextmenu` event on long tap, which mobile Safari doesn't fire on its own (`map.tapHold`), enabled by default. */
export class TapHoldHandler extends Handler {
	addHooks() {
		DomEvent.on(this._map._container, 'pointerdown', this._onDown, this);
	}

	removeHooks() {
		DomEvent.off(this._map._container, 'pointerdown', this._onDown, this);
		this._cancel();
		this._stopPreventingNative();
	}

	/** @param {PointerEvent} e */
	_onDown(e) {
		clearTimeout(this._holdTimeout);
		if (getPointers().length !== 1 || e.pointerType === 'mouse') { return; }
		const el = this._map._container,
		start = new Point(e.clientX, e.clientY);

		this._holdTimeout = setTimeout((() => {
			this._cancel();
			// the tracker keeps the latest event of each pointer, so this is where the finger is now
			const pointers = getPointers(),
			p = pointers[0];
			if (pointers.length !== 1 || start.distanceTo([p.clientX, p.clientY]) > this._map.options.tapTolerance) { return; }

			this._simulateEvent('contextmenu', e);

			// releasing the finger still fires a click (iOS skips it only after a longer hold), and browsers that fire a
			// native contextmenu on touch may do it later than us (e.g. Android with a longer touch & hold delay, or
			// Windows on release), so swallow both until the next press or key (which could click a focused control)
			el.addEventListener('contextmenu', DomEvent.stop, true);
			el.addEventListener('click', DomEvent.stop, true);
			el.addEventListener('pointerdown', this._stopPreventingNative, true);
			el.addEventListener('keydown', this._stopPreventingNative, true);
		}), tapHoldDelay);

		DomEvent.on(el, 'pointerup pointercancel contextmenu', this._cancel, this);
	}

	_stopPreventingNative = () => {
		const el = this._map._container;
		el.removeEventListener('contextmenu', DomEvent.stop, true);
		el.removeEventListener('click', DomEvent.stop, true);
		el.removeEventListener('pointerdown', this._stopPreventingNative, true);
		el.removeEventListener('keydown', this._stopPreventingNative, true);
	};

	_cancel() {
		clearTimeout(this._holdTimeout);
		const el = this._map._container;
		DomEvent.off(el, 'pointerup pointercancel contextmenu', this._cancel, this);
	}

	/**
	 * @param {string} type
	 * @param {PointerEvent} e
	 */
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

		/** @type {EventTarget} */ (e.target).dispatchEvent(simulatedEvent);
	}
}

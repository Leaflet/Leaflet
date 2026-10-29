// @ts-check
import {Evented} from '../core/Events.js';
import * as DomUtil from '../dom/DomUtil.js';

/** @import {Point} from '../geometry/Point.js' */

// Runs the map's pan animations: moves an element to a new position on an ease-out curve, firing `start`, `step` and `end`.
export class PosAnimation extends Evented {

	// `duration` is in seconds (0.25 by default), `easeLinearity` is the 3rd argument of the cubic bezier curve (0.5 by default)
	/**
	 * @param {HTMLElement} el
	 * @param {Point} newPos
	 * @param {number} [duration]
	 * @param {number} [easeLinearity]
	 */
	run(el, newPos, duration, easeLinearity) {
		this.stop();

		/** @type {HTMLElement} */
		this._el = el;
		this._inProgress = true;
		/** @type {number} */
		this._duration = duration ?? 0.25;
		/** @type {number} */
		this._easeOutPower = 1 / Math.max(easeLinearity ?? 0.5, 0.2);

		/** @type {Point} */
		this._startPos = DomUtil.getPosition(el);
		/** @type {Point} */
		this._offset = newPos.subtract(this._startPos);
		/** @type {number} */
		this._startTime = Date.now();

		this.fire('start');

		this._animate();
	}

	stop() {
		if (!this._inProgress) { return; }

		this._step(true);
		this._complete();
	}

	_animate() {
		// animation loop
		/** @type {number} */
		this._animId = requestAnimationFrame(this._animate.bind(this));
		this._step();
	}

	/** @param {boolean} [round] */
	_step(round) {
		const elapsed = (Date.now()) - this._startTime,
		duration = this._duration * 1000;

		if (elapsed < duration) {
			this._runFrame(this._easeOut(elapsed / duration), round);
		} else {
			this._runFrame(1);
			this._complete();
		}
	}

	/**
	 * @param {number} progress
	 * @param {boolean} [round]
	 */
	_runFrame(progress, round) {
		const pos = this._startPos.add(this._offset.multiplyBy(progress));
		if (round) {
			pos._round();
		}
		DomUtil.setPosition(this._el, pos);
		this.fire('step');
	}

	_complete() {
		cancelAnimationFrame(this._animId);

		this._inProgress = false;
		this.fire('end');
	}

	/** @param {number} t */
	_easeOut(t) {
		return 1 - (1 - t) ** this._easeOutPower;
	}
}

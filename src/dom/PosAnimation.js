import {Evented} from '../core/Events.js';
import * as DomUtil from '../dom/DomUtil.js';

// Runs the map's pan animations: moves an element to a new position on an ease-out curve, firing `start`, `step` and `end`.
export class PosAnimation extends Evented {

	// `duration` is in seconds (0.25 by default), `easeLinearity` is the 3rd argument of the cubic bezier curve (0.5 by default)
	run(el, newPos, duration, easeLinearity) {
		this.stop();

		this._el = el;
		this._inProgress = true;
		this._duration = duration ?? 0.25;
		this._easeOutPower = 1 / Math.max(easeLinearity ?? 0.5, 0.2);

		this._startPos = DomUtil.getPosition(el);
		this._offset = newPos.subtract(this._startPos);
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
		this._animId = requestAnimationFrame(this._animate.bind(this));
		this._step();
	}

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

	_easeOut(t) {
		return 1 - (1 - t) ** this._easeOutPower;
	}
}

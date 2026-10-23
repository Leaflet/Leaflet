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

		if (DomUtil.spike.waapiPan) {
			// the compositor moves the element, while the rAF loop below only tracks the model position for `step`
			// a piecewise linear ease, which the model positions below follow exactly so they match the screen
			const stops = this._stops = [];
			for (let i = 0; i <= 32; i++) { stops.push(+this._easeOut(i / 32).toFixed(4)); }

			this._anim = el.animate({transform: [transform(this._startPos), transform(newPos)]}, {
				duration: this._duration * 1000,
				easing: `linear(${stops.join(',')})`,
				fill: 'forwards'
			});
		}

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
		const elapsed = this._anim ? this._anim.currentTime : Date.now() - this._startTime,
		duration = this._duration * 1000;

		if (elapsed < duration) {
			this._runFrame(this._anim ? this._linearEase(elapsed / duration) : this._easeOut(elapsed / duration), round);
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
		// while the animation runs, only the final (or stopping) frame writes the inline transform
		DomUtil.setPosition(this._el, pos, this._anim && !round && progress < 1);
		this.fire('step');
	}

	_complete() {
		cancelAnimationFrame(this._animId);

		this._anim?.cancel();
		this._anim = null;

		this._inProgress = false;
		this.fire('end');
	}

	_easeOut(t) {
		return 1 - (1 - t) ** this._easeOutPower;
	}

	_linearEase(t) {
		const n = this._stops.length - 1,
		i = Math.min(Math.floor(t * n), n - 1);
		return this._stops[i] + (this._stops[i + 1] - this._stops[i]) * (t * n - i);
	}
}

function transform(pos) {
	return DomUtil.spike.markers2d ? `translate(${pos.x}px,${pos.y}px)` : `translate3d(${pos.x}px,${pos.y}px,0)`;
}

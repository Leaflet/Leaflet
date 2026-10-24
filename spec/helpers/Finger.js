// Simulates a mouse, pen or touch pointer. Steps are queued and dispatched as pointer events one animation frame
// apart; awaiting a finger waits for its queue to finish, and Promise.all moves several fingers at once.

// keep the real setTimeout in case a test fakes timers
const {setTimeout} = window;
let lastId = 1000;

export default class Finger {
	constructor(pointerType = 'mouse') {
		this.pointerType = pointerType;
		this.id = ++lastId;
		this.x = 0;
		this.y = 0;
		this.queue = Promise.resolve();
	}

	moveTo(x, y, init) { return this.step('move', x, y, init); }
	moveBy(dx, dy, init) { return this.step('move', this.x + dx, this.y + dy, init); }
	down(init) { return this.step('down', this.x, this.y, init); }
	up(init) { return this.step('up', this.x, this.y, init); }

	then(resolve, reject) {
		return this.queue.then(resolve, reject);
	}

	step(type, x, y, init) {
		this.x = x;
		this.y = y;
		this.queue = this.queue.then(() => {
			this.dispatch(type, x, y, init);
			// step after all of the next frame's callbacks so that handlers throttled with rAF see every event
			return new Promise((resolve) => { requestAnimationFrame(() => setTimeout(resolve)); });
		});
		return this;
	}

	dispatch(type, x, y, init) {
		const {pointerType, downAt} = this;

		// a pressed pointer sticks to the element it went down on, like with pointer capture
		const target = downAt && this.downTarget.isConnected ? this.downTarget :
			document.elementFromPoint(x, y) ?? document;

		if (type === 'down') {
			this.downAt = {x, y};
			this.downTarget = target;
		} else if (type === 'up') {
			this.downAt = null;
		}

		const props = {bubbles: true, cancelable: true, clientX: x, clientY: y, screenX: x, screenY: y, ...init};
		const notCancelled = target.dispatchEvent(new PointerEvent(`pointer${type}`, {
			...props, pointerId: this.id, pointerType,
			button: type === 'move' ? -1 : 0, buttons: this.downAt ? 1 : 0
		}));

		// browsers click after a tap but not after a drag, and never after synthetic pointer events, so do it here
		if (type === 'up' && notCancelled && Math.hypot(x - downAt.x, y - downAt.y) <= 5) {
			target.dispatchEvent(new MouseEvent('click', {...props, detail: 1}));
		}
	}
}

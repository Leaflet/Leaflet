export function createContainer(width, height) {
	width = width ? width : '400px';
	height = height ? height : '400px';
	const container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.top = '0px';
	container.style.left = '0px';
	container.style.height = height;
	container.style.width = width;
	document.body.appendChild(container);

	return container;
}

export function removeMapContainer(map, container) {
	map?.remove();
	if (container) {
		document.body.removeChild(container);
	}
}

// Simulates a mouse, pen or touch pointer. Steps are queued and dispatched as pointer events, one step per animation
// frame, with all active fingers stepping in the same frame callback; awaiting a finger waits for its queue to finish.

const active = new Set();
let frame = 0;
let lastId = 1000;

// a single loop for all fingers keeps them in lockstep, and runs after any rAF callbacks queued by the previous step
function tick() {
	frame = 0;
	for (const finger of active) {
		const step = finger.steps.shift();
		if (step) {
			finger.dispatch(...step);
		} else {
			active.delete(finger);
			finger.resolve();
		}
	}
	if (active.size) { frame = requestAnimationFrame(tick); }
}

export class Finger {
	constructor(pointerType = 'mouse') {
		this.pointerType = pointerType;
		this.id = ++lastId;
		this.x = 0;
		this.y = 0;
		this.steps = [];
		this.done = Promise.resolve();
	}

	moveTo(x, y, init) { return this.step('move', x, y, init); }
	moveBy(dx, dy, init) { return this.step('move', this.x + dx, this.y + dy, init); }
	down(init) { return this.step('down', this.x, this.y, init); }
	up(init) { return this.step('up', this.x, this.y, init); }

	then(resolve, reject) {
		return this.done.then(resolve, reject);
	}

	step(type, x, y, init) {
		this.x = x;
		this.y = y;
		this.steps.push([type, x, y, init]);
		if (!active.has(this)) {
			active.add(this);
			this.done = new Promise((resolve) => { this.resolve = resolve; });
		}
		frame ||= requestAnimationFrame(tick);
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

import sinon from 'sinon';

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

// fake timers that also drive element animations: sinon doesn't fake Web Animations, so `animate` is replaced
// with a stub whose `onfinish` fires on a faked timeout after the animation duration
export function createClock() {
	const clock = sinon.useFakeTimers({
		toFake: ['setTimeout', 'clearTimeout', 'Date']
	});
	const animate = sinon.stub(Element.prototype, 'animate').callsFake((keyframes, duration) => {
		const animation = {};
		setTimeout(() => animation.onfinish?.(), duration);
		return animation;
	});
	const restore = clock.restore.bind(clock);
	clock.restore = () => {
		animate.restore();
		restore();
	};
	return clock;
}

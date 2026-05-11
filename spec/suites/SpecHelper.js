import {DomEvent} from 'leaflet';

const runAsTouchBrowser = import.meta.env.VITE_TOUCH === '1';

export const pointerType = runAsTouchBrowser ? 'touch' : 'mouse';
export const pointerEventType = ['pointer', {pointerType}];

export function createContainer(width, height) {
	width = width ? width : '400px';
	height = height ? height : '400px';
	const container = document.createElement('div');
	container.style.position = 'absolute';
	container.style.top = '0px';
	container.style.left = '0px';
	container.style.height = height;
	container.style.width = width;
	container.style.opacity = '0.4';
	document.body.appendChild(container);

	return container;
}

export function removeMapContainer(map, container) {
	map?.remove();
	if (container) {
		document.body.removeChild(container);
	}

	DomEvent.PointerEvents.cleanupPointers();
}
